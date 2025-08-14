/* app.js — main student app + offline storage + sync stubs */

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// IDB setup
const DB_NAME = 'edughana-db';
const DB_VER = 1;
let db;
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('lessons')) d.createObjectStore('lessons', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('quizzes')) d.createObjectStore('quizzes', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('resources')) d.createObjectStore('resources', { keyPath: 'title' });
      if (!d.objectStoreNames.contains('scores')) d.createObjectStore('scores', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('messages')) d.createObjectStore('messages', { keyPath: 'id' });
    };
    req.onsuccess = () => { db = req.result; resolve(db); };
    req.onerror = () => reject(req.error);
  });
}
async function put(store, value){ const d=db||await openDB(); return new Promise((res,rej)=>{const tx=d.transaction(store,'readwrite'); tx.objectStore(store).put(value); tx.oncomplete=()=>res(true); tx.onerror=()=>rej(tx.error);}); }
async function getAll(store){ const d=db||await openDB(); return new Promise((res,rej)=>{const tx=d.transaction(store,'readonly'); const r=tx.objectStore(store).getAll(); r.onsuccess=()=>res(r.result||[]); r.onerror=()=>rej(r.error);}); }

// Seed sample content
async function seedContent(){
  const lessons = await getAll('lessons');
  if (lessons.length) return;
  await put('lessons', { id:'math-1', title:'Fractions Basics', subject:'Mathematics', body:'Numerator/denominator intro.' });
  await put('lessons', { id:'sci-1', title:'States of Matter', subject:'Science', body:'Solid, liquid, gas.' });
  await put('quizzes', { id:'q-math-1', title:'Fractions Quick Quiz', lessonId:'math-1', questions:[
    { q:'1/2 + 1/2 = ?', options:['1','2','1/4','3/4'], correct:0 }
  ]});
}

// Render subjects
async function renderSubjects(){
  const grid = document.getElementById('subjectsGrid');
  const lessons = await getAll('lessons');
  grid.innerHTML = lessons.map(l => `
    <div class="bg-white rounded-lg overflow-hidden shadow border">
      <div class="p-4">
        <h3 class="text-lg font-semibold">${l.title}</h3>
        <p class="text-sm text-gray-600">${l.subject}</p>
        <p class="text-sm mt-2">${(l.body||'').slice(0,120)}</p>
        <div class="mt-3 flex justify-between">
          <button class="px-3 py-1 bg-gray-100 rounded saveRes" data-title="${l.title}" data-body="${l.body}">Save Offline</button>
          <button class="px-3 py-1 border rounded readRes" data-title="${l.title}">Read</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Save/read resource
document.addEventListener('click', async (e) => {
  if (e.target.matches('.saveRes')) {
    await put('resources',{ title:e.target.dataset.title, body:e.target.dataset.body, savedAt:new Date().toISOString() });
    alert('Saved for offline reading.');
  }
  if (e.target.matches('.readRes')) {
    const all = await getAll('resources');
    const r = all.find(x => x.title === e.target.dataset.title);
    alert(r ? r.body : 'Not saved yet.');
  }
});

// Quiz engine
let qq = { idx:0, data:[] };
async function loadQuickQuiz(){
  const quizzes = await getAll('quizzes');
  if (!quizzes.length) return;
  qq.data = quizzes[0].questions || [];
  qq.idx = 0;
  drawQuestion();
}
function drawQuestion(){
  const body = document.getElementById('qqBody');
  const meta = document.getElementById('qqMeta');
  const bar = document.getElementById('qqBar');
  if (!qq.data.length) { body.innerHTML = '<p>No questions.</p>'; return; }
  const q = qq.data[qq.idx];
  meta.textContent = `Question ${qq.idx+1} of ${qq.data.length}`;
  bar.style.width = `${((qq.idx)/qq.data.length)*100}%`;
  body.innerHTML = `
    <p class="text-lg font-medium mb-2">${q.q}</p>
    ${q.options.map((o,i)=>`<button class="block w-full text-left p-3 rounded border opt" data-i="${i}">${o}</button>`).join('')}
  `;
}
document.getElementById('btnPrevQ').addEventListener('click', () => { if (qq.idx>0){qq.idx--; drawQuestion();}});
document.getElementById('btnNextQ').addEventListener('click', async () => {
  if (qq.idx < qq.data.length-1){ qq.idx++; drawQuestion(); }
  else {
    // finish
    const score = Math.round((correctCount/qq.data.length)*100);
    await put('scores',{ id:crypto.randomUUID(), score, at:new Date().toISOString(), synced:false });
    const res = document.getElementById('qqResult');
    res.textContent = `Done! You scored ${score}%. Saved offline.`;
    res.classList.remove('hidden');
  }
});
let correctCount = 0;
document.addEventListener('click', (e) => {
  if (e.target.matches('.opt')) {
    const i = parseInt(e.target.dataset.i,10);
    const correct = qq.data[qq.idx].correct;
    if (i === correct){ e.target.classList.add('border-green-500'); correctCount++; }
    else { e.target.classList.add('border-red-500'); }
  }
});

// Auth (demo)
document.getElementById('btnLogin').addEventListener('click', ()=> document.getElementById('authModal').classList.remove('hidden'));
document.getElementById('btnCloseAuth').addEventListener('click', ()=> document.getElementById('authModal').classList.add('hidden'));
document.getElementById('btnDoLogin').addEventListener('click', ()=>{
  const email = document.getElementById('authEmail').value;
  const pass = document.getElementById('authPass').value;
  if (!email || !pass) return alert('Enter email and password');
  const fakeUser = { id: crypto.randomUUID(), email, role: email.endsWith('@admin.test') ? 'admin' : 'student' };
  localStorage.setItem('edughana_token','demo-token');
  localStorage.setItem('edughana_user', JSON.stringify(fakeUser));
  document.getElementById('authModal').classList.add('hidden');
  alert('Logged in (demo).');
});

// Teacher message queue + sync
document.getElementById('btnQueueMsg').addEventListener('click', async ()=>{
  const t = document.getElementById('msgTeacher').value.trim();
  if (!t) return;
  await put('messages', { id:crypto.randomUUID(), text:t, at:new Date().toISOString(), sent:false });
  document.getElementById('msgTeacher').value='';
  alert('Queued for sending when online.');
});
document.getElementById('btnSync').addEventListener('click', async ()=>{
  const msgs = await getAll('messages');
  const unsent = msgs.filter(m => !m.sent);
  // Replace with your API call; we just mark as sent.
  for (const m of unsent){ m.sent = true; await put('messages', m); }
  alert('Synced locally. Wire to backend to truly send.');
});

// Wikipedia API
document.getElementById('btnWiki').addEventListener('click', async ()=>{
  const q = document.getElementById('wikiQ').value.trim();
  if (!q) return;
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
  try{
    const res = await fetch(url);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    document.getElementById('wikiRes').innerHTML = `<b>${data.title}</b><br>${data.extract}`;
    await put('resources', { title: data.title, body: data.extract, savedAt: new Date().toISOString() });
  }catch(e){
    document.getElementById('wikiRes').textContent = 'Not found.';
  }
});

// Boot
(async ()=>{
  await openDB();
  await seedContent();
  await renderSubjects();
  await loadQuickQuiz();
})();
