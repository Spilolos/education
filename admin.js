/* EduGhana Admin (CRUD + Export/Import + API hooks) */
const API = { base: '', login:'/api/auth/login', register:'/api/auth/register', lessons:'/api/lessons', quizzes:'/api/quizzes' };
const token = localStorage.getItem('edughana_token');
const userRaw = localStorage.getItem('edughana_user');
const user = userRaw ? JSON.parse(userRaw) : null;
if (!token || !user) { alert('Please log in first.'); location.href='index.html'; }
if (user && user.role !== 'admin') { alert('Admins only.'); location.href='index.html'; }
const DB_NAME='edughana-db', DB_VER=1; let db;
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VER);r.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('lessons'))d.createObjectStore('lessons',{keyPath:'id'});if(!d.objectStoreNames.contains('quizzes'))d.createObjectStore('quizzes',{keyPath:'id'});if(!d.objectStoreNames.contains('resources'))d.createObjectStore('resources',{keyPath:'title'});};r.onsuccess=()=>{db=r.result;resolve(db)};r.onerror=()=>reject(r.error)});}
async function put(s,v){const d=db||await openDB();return new Promise((res,rej)=>{const tx=d.transaction(s,'readwrite');tx.objectStore(s).put(v);tx.oncomplete=()=>res(true);tx.onerror=()=>rej(tx.error);});}
async function getAll(s){const d=db||await openDB();return new Promise((res,rej)=>{const tx=d.transaction(s,'readonly');const g=tx.objectStore(s).getAll();g.onsuccess=()=>res(g.result||[]);g.onerror=()=>rej(g.error);});}
async function delk(s,k){const d=db||await openDB();return new Promise((res,rej)=>{const tx=d.transaction(s,'readwrite');tx.objectStore(s).delete(k);tx.oncomplete=()=>res(true);tx.onerror=()=>rej(tx.error);});}
function $(s){return document.querySelector(s);}
async function loadLessons(){try{if(navigator.onLine){const res=await fetch((API.base||'')+API.lessons,{headers:{Authorization:`Bearer ${token}`}});if(res.ok){const data=await res.json();for(const l of data) await put('lessons',l);}}}catch(e){} const ls=await getAll('lessons'); const tb=$('#lessonsTbody'); if(tb){tb.innerHTML=''; ls.forEach(l=>{const tr=document.createElement('tr'); tr.innerHTML=`<td class='px-3 py-2 border'>${l.id}</td><td class='px-3 py-2 border'>${l.title||''}</td><td class='px-3 py-2 border'>${l.subject||''}</td><td class='px-3 py-2 border text-xs truncate max-w-[20rem]'>${(l.body||'').slice(0,120)}</td><td class='px-3 py-2 border text-right space-x-2'><button class='px-2 py-1 text-white bg-green-600 rounded' data-edit='${l.id}'>Edit</button><button class='px-2 py-1 text-white bg-red-600 rounded' data-del='${l.id}'>Delete</button></td>`; tb.appendChild(tr);});}}
async function saveLesson(){const id=($('#lessonId').value.trim()||crypto.randomUUID()); const lesson={ id, title:$('#lessonTitle').value.trim(), subject:$('#lessonSubject').value.trim(), body:$('#lessonBody').value.trim(), updatedAt:new Date().toISOString()}; await put('lessons',lesson); if(navigator.onLine){try{await fetch((API.base||'')+API.lessons,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(lesson)});}catch(e){}} closeLesson(); loadLessons();}
function openLesson(id){$('#lessonModal').classList.remove('hidden'); if(!id){$('#lessonId').value='';$('#lessonTitle').value='';$('#lessonSubject').value='';$('#lessonBody').value='';} else {getAll('lessons').then(ls=>{const l=ls.find(x=>x.id===id); if(!l)return; $('#lessonId').value=l.id; $('#lessonTitle').value=l.title||''; $('#lessonSubject').value=l.subject||''; $('#lessonBody').value=l.body||'';});}}
function closeLesson(){ $('#lessonModal').classList.add('hidden'); }
async function loadQuizzes(){try{if(navigator.onLine){const res=await fetch((API.base||'')+API.quizzes,{headers:{Authorization:`Bearer ${token}`}});if(res.ok){const data=await res.json();for(const q of data) await put('quizzes',q);}}}catch(e){} const qs=await getAll('quizzes'); const tb=$('#quizzesTbody'); if(tb){tb.innerHTML=''; qs.forEach(q=>{const tr=document.createElement('tr'); tr.innerHTML=`<td class='px-3 py-2 border'>${q.id}</td><td class='px-3 py-2 border'>${q.title||''}</td><td class='px-3 py-2 border'>${q.lessonId||''}</td><td class='px-3 py-2 border'>${(q.questions||[]).length}</td><td class='px-3 py-2 border text-right space-x-2'><button class='px-2 py-1 text-white bg-green-600 rounded' data-editq='${q.id}'>Edit</button><button class='px-2 py-1 text-white bg-red-600 rounded' data-delq='${q.id}'>Delete</button></td>`; tb.appendChild(tr);});}}
function qRow(q={},i=0){return `<div class='p-3 border rounded-lg space-y-2' data-qidx='${i}'><input class='w-full p-2 border rounded questionText' placeholder='Question' value='${q.q||''}'><div class='grid grid-cols-1 md:grid-cols-2 gap-2'>${(q.options||['','','','']).map((o,ix)=>`<input class='p-2 border rounded option' placeholder='Option ${ix+1}' value='${o||''}'>`).join('')}</div><input type='number' class='p-2 border rounded correctIndex w-24' min='0' max='3' value='${q.correct??0}'></div>`;}
function openQuiz(id){$('#quizModal').classList.remove('hidden'); $('#quizQuestions').innerHTML=''; if(!id){$('#quizId').value='';$('#quizTitle').value='';$('#quizLessonId').value=''; addQ();} else {getAll('quizzes').then(qs=>{const q=qs.find(x=>x.id===id); if(!q) return; $('#quizId').value=q.id; $('#quizTitle').value=q.title||''; $('#quizLessonId').value=q.lessonId||''; (q.questions||[]).forEach(qq=>addQ(qq));});}}
function closeQuiz(){ $('#quizModal').classList.add('hidden'); }
function addQ(q){ const wrap=$('#quizQuestions'); const d=document.createElement('div'); const idx=wrap.children.length; d.innerHTML=qRow(q||{},idx); wrap.appendChild(d.firstElementChild); }
async function saveQuiz(){ const id=($('#quizId').value.trim()||crypto.randomUUID()); const title=$('#quizTitle').value.trim(); const lessonId=$('#quizLessonId').value.trim(); const items=[...document.querySelectorAll('#quizQuestions [data-qidx]')].map(div=>({q:div.querySelector('.questionText').value, options:[...div.querySelectorAll('.option')].map(i=>i.value), correct:parseInt(div.querySelector('.correctIndex').value||'0',10)})); const quiz={id,title,lessonId,questions:items, updatedAt:new Date().toISOString()}; await put('quizzes',quiz); if(navigator.onLine){try{await fetch((API.base||'')+API.quizzes,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(quiz)});}catch(e){}} closeQuiz(); loadQuizzes();}
async function exportData(){ const lessons=await getAll('lessons'); const quizzes=await getAll('quizzes'); const resources=await getAll('resources'); const data={exportedAt:new Date().toISOString(), lessons, quizzes, resources}; const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='edughana_backup.json'; a.click(); URL.revokeObjectURL(url); }
function importData(file){ const reader=new FileReader(); reader.onload=async ()=>{ try{ const data=JSON.parse(reader.result); for(const l of (data.lessons||[])) await put('lessons',l); for(const q of (data.quizzes||[])) await put('quizzes',q); for(const r of (data.resources||[])) await put('resources',r); await loadLessons(); await loadQuizzes(); alert('Import complete.'); } catch(e){ alert('Invalid file.'); } }; reader.readAsText(file); }
document.addEventListener('click', async (e)=>{
  if(e.target.matches('#btnAddLesson')) openLesson();
  if(e.target.matches('[data-edit]')) openLesson(e.target.getAttribute('data-edit'));
  if(e.target.matches('[data-del]')) { await delk('lessons', e.target.getAttribute('data-del')); await loadLessons(); }
  if(e.target.matches('#btnSaveLesson')) await saveLesson();
  if(e.target.matches('#btnCancelLesson')) closeLesson();
  if(e.target.matches('#btnAddQuiz')) openQuiz();
  if(e.target.matches('[data-editq]')) openQuiz(e.target.getAttribute('data-editq'));
  if(e.target.matches('[data-delq]')) { await delk('quizzes', e.target.getAttribute('data-delq')); await loadQuizzes(); }
  if(e.target.matches('#btnSaveQuiz')) await saveQuiz();
  if(e.target.matches('#btnCancelQuiz')) closeQuiz();
  if(e.target.matches('#btnAddQuestion')) addQ();
  if(e.target.matches('#btnExport')) exportData();
  if(e.target.matches('#btnImport')) document.getElementById('fileImport').click();
});
document.addEventListener('change', (e)=>{
  if(e.target.matches('#fileImport') && e.target.files[0]) importData(e.target.files[0]);
});
document.addEventListener('DOMContentLoaded', async ()=>{
  await openDB();
  if(document.getElementById('lessonsTbody')) loadLessons();
  if(document.getElementById('quizzesTbody')) loadQuizzes();
});
