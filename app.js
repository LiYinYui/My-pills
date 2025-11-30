document.addEventListener('DOMContentLoaded', () => {
    loadMedications();
    initTheme(); 
    initQuickAddButtons();
    initModal(); // НОВАЯ ФУНКЦИЯ: Инициализация модального окна
});

// --- KNOWLEDGE BASE (База данных) ---
const PILL_INFO = {
    "Vitamin D": {
        time: "Morning, with breakfast",
        advice: "Take with fatty foods (oil, nuts, avocado). Dose: 600-800 IU/day for adults.",
        description: "Vitamin D is crucial for bone health and immune function. It's the #1 most popular supplement globally. 68% of adults take it."
    },
    "Vitamin C": {
        time: "Morning or Day, after a meal",
        advice: "Take with water, not juice. May cause stomach irritation if taken on an empty stomach.",
        description: "A powerful antioxidant vital for the immune system and collagen production. 45% of adults take it."
    },
    "Omega-3": {
        time: "During a meal",
        advice: "Take with main meal containing fats for best absorption. Usually taken in courses for 1-3 months.",
        description: "Essential fatty acids supporting heart health, brain function, and reducing inflammation. 35% of adults take it."
    },
    "Magnesium": {
        time: "Evening",
        advice: "Take 2 hours before sleep. It aids relaxation and improves sleep quality.",
        description: "A key mineral involved in over 300 enzyme systems, known for its calming effect. 25% of adults take it."
    },
    "Vitamin B Complex": {
        time: "Morning",
        advice: "Take with breakfast. They provide energy and may interfere with sleep if taken later.",
        description: "A group of vitamins necessary for metabolism, energy production, and nerve function. 28% of adults take it."
    },
    "Iron": {
        time: "Before a meal (30-60 min before)",
        advice: "Do not take with calcium or dairy products as they block absorption. Best absorbed with Vitamin C.",
        description: "Essential for producing red blood cells and transporting oxygen throughout the body. Always consult a doctor for Iron dosage."
    },
};

const POPULAR_PILLS = Object.keys(PILL_INFO); 

// --- MODAL LOGIC (ЛОГИКА МОДАЛЬНОГО ОКНА) ---
const infoModal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalTime = document.getElementById('modalTime');
const modalAdvice = document.getElementById('modalAdvice');
const modalDescription = document.getElementById('modalDescription');

function showModal() {
    infoModal.classList.add('active');
}

function hideModal() {
    infoModal.classList.remove('active');
}

function initModal() {
    // Закрытие по кнопке "x"
    closeModalBtn.addEventListener('click', hideModal);
    
    // Закрытие при клике вне окна
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            hideModal();
        }
    });
}

// 6. Функция для отображения информации (ОБНОВЛЕНО: Используем модальное окно)
window.showPillInfo = function(name) {
    const info = PILL_INFO[name];

    if (!info) {
        alert('Information not available for this supplement.');
        return;
    }
    
    // Заполнение модального окна данными
    modalTitle.textContent = name;
    modalTime.textContent = info.time;
    modalAdvice.textContent = info.advice;
    modalDescription.textContent = info.description;
    
    showModal();
}

// --- THEME SWITCHER LOGIC ---
function initTheme() {
    // ... (без изменений) ...
    const themeBtn = document.getElementById('themeToggleBtn');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeBtn) themeBtn.textContent = '☀️ Light Mode';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeBtn.textContent = '🌙 Dark Mode';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeBtn.textContent = '☀️ Light Mode';
            }
        });
    }
}

// --- BURGER MENU LOGIC ---
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
             burger.classList.remove('active');
             nav.classList.remove('active');
        }
    });
}

// --- APP LOGIC ---

const pillNameInput = document.getElementById('pillNameInput');
const dailyCountInput = document.getElementById('dailyCountInput');
const addPillBtn = document.getElementById('addPillBtn');
const medicationList = document.getElementById('medicationList');

// 1. Загрузка/Сохранение данных 
function loadMedications() {
    const meds = JSON.parse(localStorage.getItem('meds')) || [];
    medicationList.innerHTML = '';
    meds.forEach(med => renderPillItem(med));
}

function saveMedications(meds) {
    localStorage.setItem('meds', JSON.stringify(meds));
    loadMedications();
}

// 2. Универсальная функция для добавления лекарства
function createPill(name, count) {
    const newPill = {
        id: Date.now(),
        name: name,
        dailyCount: count,
        currentCount: 0
    };

    const meds = JSON.parse(localStorage.getItem('meds')) || [];
    meds.push(newPill);
    saveMedications(meds);
}

// 3. Добавление через форму
function addPill() {
    const name = pillNameInput.value.trim();
    const count = parseInt(dailyCountInput.value);

    if (name === '' || isNaN(count) || count < 1) {
        alert('Please enter a valid pill name and daily dose (must be 1 or more).');
        return;
    }
    
    createPill(name, count);

    pillNameInput.value = '';
    dailyCountInput.value = '';
    pillNameInput.focus();
}

// 4. Добавление через кнопку быстрого доступа
function quickAddPill(event) {
    const name = event.target.getAttribute('data-name');
    const dose = parseInt(event.target.getAttribute('data-dose'));
    
    if (name && !isNaN(dose)) {
        createPill(name, dose);
    }
}

// 5. Инициализация кнопок быстрого доступа
function initQuickAddButtons() {
    const buttons = document.querySelectorAll('.quick-add-btn');
    buttons.forEach(button => {
        button.addEventListener('click', quickAddPill);
    });
}

// 7. Отрисовка элемента
function renderPillItem(pill) {
    const item = document.createElement('div');
    item.className = 'pill-item';
    item.setAttribute('data-id', pill.id);

    const progressText = `${pill.currentCount} / ${pill.dailyCount}`;
    const isCompleted = pill.currentCount >= pill.dailyCount;
    const progressColor = isCompleted ? '#4CAF50' : '#7758ff';

    const isPopular = POPULAR_PILLS.includes(pill.name);
    
    const infoButtonHTML = isPopular 
        ? `<button class="info-pill-btn" onclick="showPillInfo('${pill.name}')">LEARN MORE</button>` 
        : '';
        
    item.innerHTML = `
        <div class="pill-info">
            <span class="pill-name">${pill.name}</span>
            <span class="pill-progress-text" style="color: ${progressColor};">${progressText}</span>
        </div>
        <div class="pill-controls">
            ${infoButtonHTML} 
            <button class="take-pill-btn" onclick="takePill(${pill.id})" ${isCompleted ? 'disabled' : ''}>TAKE</button>
            <button class="reset-pill-btn" onclick="resetPill(${pill.id})">RESET</button>
            <button class="delete-pill-btn" onclick="deletePill(${pill.id})">DELETE</button>
        </div>
    `;

    medicationList.appendChild(item);
}

// 8. Глобальные функции
window.takePill = function(id) {
    const meds = JSON.parse(localStorage.getItem('meds'));
    const pillIndex = meds.findIndex(p => p.id === id);

    if (pillIndex !== -1 && meds[pillIndex].currentCount < meds[pillIndex].dailyCount) {
        meds[pillIndex].currentCount += 1;
        saveMedications(meds);
    }
}

window.resetPill = function(id) {
    const meds = JSON.parse(localStorage.getItem('meds'));
    const pillIndex = meds.findIndex(p => p.id === id);

    if (pillIndex !== -1) {
        meds[pillIndex].currentCount = 0;
        saveMedications(meds);
    }
}

window.deletePill = function(id) {
    let meds = JSON.parse(localStorage.getItem('meds'));
    meds = meds.filter(p => p.id !== id);
    saveMedications(meds);
}

// 9. Event Listeners для формы
addPillBtn.addEventListener('click', addPill);

pillNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPill();
});

dailyCountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPill();
});