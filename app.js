// Global variables
let currentUser = null;
let appointments = [];
let doctors = [];
let chatMessages = {};
let selectedChatDoctor = null;

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeBtns = document.querySelectorAll('.close');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const weatherWidget = document.getElementById('weatherWidget');
const weatherContent = document.getElementById('weatherContent');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDoctors();
    loadAppointments();
    loadWeatherData();
    updateNavigation();
});

// Initialize application
function initializeApp() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavigation();
    }
    
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
        appointments = JSON.parse(savedAppointments);
    }
    
    const savedChatMessages = localStorage.getItem('chatMessages');
    if (savedChatMessages) {
        chatMessages = JSON.parse(savedChatMessages);
    }
}

// Setup event listeners
function setupEventListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Modal controls
    document.getElementById('loginBtn').addEventListener('click', () => 
        document.getElementById('loginModal').style.display = 'block');
    document.getElementById('registerBtn').addEventListener('click', () => 
        document.getElementById('registerModal').style.display = 'block');
    
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Switch between modals
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointment);
    document.getElementById('sendMessage').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email && password) {
        currentUser = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('loginModal').style.display = 'none';
        updateNavigation();
        showNotification('Login successful!', 'success');
        document.getElementById('loginForm').reset();
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (name && email && password) {
        currentUser = {
            id: Date.now(),
            name: name,
            email: email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('registerModal').style.display = 'none';
        updateNavigation();
        showNotification('Registration successful!', 'success');
        document.getElementById('registerForm').reset();
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavigation();
    showNotification('Logged out successfully', 'success');
}

function updateNavigation() {
    if (currentUser) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';
        
        if (!document.getElementById('userMenu')) {
            const userMenu = document.createElement('li');
            userMenu.className = 'nav-item';
            userMenu.id = 'userMenu';
            userMenu.innerHTML = `
                <div class="user-menu">
                    <span>Welcome, ${currentUser.name}</span>
                    <button onclick="logout()" class="btn btn-secondary">Logout</button>
                </div>
            `;
            document.querySelector('.nav-menu').appendChild(userMenu);
        }
    } else {
        document.getElementById('loginBtn').style.display = 'inline';
        document.getElementById('registerBtn').style.display = 'inline';
        
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.remove();
        }
    }
}

// Doctor management (CRUD operations)
function loadDoctors() {
    doctors = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            rating: 4.8,
            availability: "Available",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop",
            experience: "15 years"
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Neurologist",
            rating: 4.9,
            availability: "Available",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop",
            experience: "12 years"
        },
        {
            id: 3,
            name: "Dr. Emily Rodriguez",
            specialty: "Pediatrician",
            rating: 4.7,
            availability: "Available",
            image: "https://images.unsplash.com/photo-1594824475545-62d7f4e6c1a7?w=300&h=200&fit=crop",
            experience: "10 years"
        },
        {
            id: 4,
            name: "Dr. David Thompson",
            specialty: "Orthopedic Surgeon",
            rating: 4.6,
            availability: "Available",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=200&fit=crop",
            experience: "18 years"
        }
    ];

    displayDoctors();
    populateDoctorSelect();
    populateChatDoctors();
}

function displayDoctors() {
    const doctorsGrid = document.getElementById('doctorsGrid');
    doctorsGrid.innerHTML = '';

    doctors.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        doctorCard.innerHTML = `
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
            <div class="doctor-info">
                <h3 class="doctor-name">${doctor.name}</h3>
                <p class="doctor-specialty">${doctor.specialty}</p>
                <div class="doctor-rating">
                    <i class="fas fa-star"></i>
                    <span>${doctor.rating}</span>
                </div>
                <p class="doctor-availability">${doctor.availability}</p>
                <p>Experience: ${doctor.experience}</p>
            </div>
        `;
        doctorsGrid.appendChild(doctorCard);
    });
}

function populateDoctorSelect() {
    const doctorSelect = document.getElementById('doctorSelect');
    doctorSelect.innerHTML = '<option value="">Choose a doctor</option>';
    
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialty}`;
        doctorSelect.appendChild(option);
    });
}

function populateChatDoctors() {
    const chatDoctorsList = document.getElementById('chatDoctorsList');
    chatDoctorsList.innerHTML = '';
    
    doctors.forEach(doctor => {
        const doctorItem = document.createElement('div');
        doctorItem.className = 'chat-doctor';
        doctorItem.innerHTML = `
            <h4>${doctor.name}</h4>
            <p>${doctor.specialty}</p>
        `;
        doctorItem.addEventListener('click', () => selectChatDoctor(doctor));
        chatDoctorsList.appendChild(doctorItem);
    });
}

// Appointment management (CRUD operations)
function handleAppointment(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to book an appointment', 'error');
        return;
    }

    const appointmentData = {
        id: Date.now(),
        patientName: document.getElementById('patientName').value,
        patientEmail: document.getElementById('patientEmail').value,
        patientPhone: document.getElementById('patientPhone').value,
        doctorId: document.getElementById('doctorSelect').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        appointmentReason: document.getElementById('appointmentReason').value,
        status: 'Scheduled',
        userId: currentUser.id
    };

    const doctor = doctors.find(d => d.id == appointmentData.doctorId);
    appointmentData.doctorName = doctor ? doctor.name : 'Unknown Doctor';

    appointments.push(appointmentData);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    loadAppointments();
    document.getElementById('appointmentForm').reset();
    showNotification('Appointment booked successfully!', 'success');
}

function loadAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = '';
    
    if (!currentUser) {
        appointmentsList.innerHTML = '<p>Please login to view your appointments</p>';
        return;
    }

    const userAppointments = appointments.filter(apt => apt.userId === currentUser.id);
    
    if (userAppointments.length === 0) {
        appointmentsList.innerHTML = '<p>No appointments scheduled</p>';
        return;
    }

    userAppointments.forEach(appointment => {
        const appointmentItem = document.createElement('div');
        appointmentItem.className = 'appointment-item';
        appointmentItem.innerHTML = `
            <h4>${appointment.doctorName}</h4>
            <p><strong>Date:</strong> ${appointment.appointmentDate}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Status:</strong> ${appointment.status}</p>
            <p><strong>Reason:</strong> ${appointment.appointmentReason}</p>
            <button onclick="cancelAppointment(${appointment.id})" class="btn btn-secondary">Cancel</button>
        `;
        appointmentsList.appendChild(appointmentItem);
    });
}

function cancelAppointment(appointmentId) {
    const index = appointments.findIndex(apt => apt.id === appointmentId);
    if (index !== -1) {
        appointments.splice(index, 1);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadAppointments();
        showNotification('Appointment cancelled successfully', 'success');
    }
}

// Chat functionality
function selectChatDoctor(doctor) {
    selectedChatDoctor = doctor;
    
    document.querySelectorAll('.chat-doctor').forEach(item => item.classList.remove('active'));
    event.target.closest('.chat-doctor').classList.add('active');
    
    document.getElementById('chatDoctorName').textContent = `Chat with ${doctor.name}`;
    document.getElementById('chatInput').disabled = false;
    document.getElementById('sendMessage').disabled = false;
    
    loadChatMessages(doctor.id);
}

function loadChatMessages(doctorId) {
    const chatMessagesDiv = document.getElementById('chatMessages');
    chatMessagesDiv.innerHTML = '';
    
    if (!chatMessages[doctorId]) {
        chatMessages[doctorId] = [];
    }
    
    chatMessages[doctorId].forEach(message => {
        displayChatMessage(message);
    });
    
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

function sendChatMessage() {
    if (!selectedChatDoctor || !currentUser) return;
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messageData = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
    };
    
    if (!chatMessages[selectedChatDoctor.id]) {
        chatMessages[selectedChatDoctor.id] = [];
    }
    chatMessages[selectedChatDoctor.id].push(messageData);
    
    setTimeout(() => {
        const doctorResponse = {
            id: Date.now() + 1,
            text: generateDoctorResponse(message),
            sender: 'doctor',
            timestamp: new Date().toLocaleTimeString()
        };
        chatMessages[selectedChatDoctor.id].push(doctorResponse);
        displayChatMessage(doctorResponse);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }, 1000);
    
    displayChatMessage(messageData);
    input.value = '';
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    
    const chatMessagesDiv = document.getElementById('chatMessages');
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

function displayChatMessage(message) {
    const chatMessagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}`;
    messageDiv.innerHTML = `
        <p>${message.text}</p>
        <small>${message.timestamp}</small>
    `;
    chatMessagesDiv.appendChild(messageDiv);
}

function generateDoctorResponse(userMessage) {
    const responses = [
        "Thank you for sharing that information. Could you tell me more about your symptoms?",
        "I understand your concern. Let me ask you a few questions to better assess the situation.",
        "That's helpful information. Based on what you've described, I recommend...",
        "I appreciate you reaching out. Let's discuss this further to ensure proper care.",
        "Thank you for the details. I'd like to know more about your medical history."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Weather API integration (Third-party API)
async function loadWeatherData() {
    try {
        const city = 'New York';
        const apiKey = 'YOUR_API_KEY';
        
        // Mock weather data for demo
        const mockWeatherData = {
            name: city,
            main: { temp: 22, humidity: 65 },
            weather: [{ description: 'Partly cloudy', icon: '02d' }],
            wind: { speed: 5.2 }
        };
        
        displayWeather(mockWeatherData);
        
    } catch (error) {
        console.error('Error loading weather:', error);
        document.getElementById('weatherContent').innerHTML = '<p>Weather unavailable</p>';
    }
}

function displayWeather(weatherData) {
    document.getElementById('weatherContent').innerHTML = `
        <h3>${weatherData.name}</h3>
        <p><strong>${Math.round(weatherData.main.temp)}°C</strong></p>
        <p>${weatherData.weather[0].description}</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind: ${weatherData.wind.speed} m/s</p>
    `;
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form validation
function validateForm(formData) {
    for (let [key, value] of formData.entries()) {
        if (!value.trim()) {
            return false;
        }
    }
    return true;
}

// Auto-populate appointment form with user data
function populateAppointmentForm() {
    if (currentUser) {
        document.getElementById('patientName').value = currentUser.name || '';
        document.getElementById('patientEmail').value = currentUser.email || '';
    }
}

// Update appointment form when user logs in
function updateAppointmentForm() {
    if (currentUser) {
        populateAppointmentForm();
    }
}

// Enhanced mobile navigation
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update appointment form when user logs in
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        updateAppointmentForm();
    }
});
