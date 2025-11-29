// === МОБИЛЬНОЕ МЕНЮ ===
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

function openMobileMenu() {
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open'); // Используем класс вместо style
}

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
}

// Обработчики событий
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Закрытие мобильного меню при клике на ссылку
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
    }
});
// === СЛАЙДЕР ===
let currentSlide = 0;
let slideInterval;
const slides = document.querySelector('.slider-slides');
const totalSlides = document.querySelectorAll('.slider-slide').length;
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');

function showSlide(index) {
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Обработчики для кнопок слайдера
if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
    });

    prevBtn.addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
    });
}

// Останавливаем автопрокрутку при наведении
const slider = document.querySelector('.slider');
if (slider) {
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);
}

// === ФОРМА ОБРАТНОЙ СВЯЗИ ===
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const feedbackModal = document.getElementById('feedbackModal');
const feedbackForm = document.getElementById('feedbackForm');
const responseMessage = document.getElementById('responseMessage');

const STORAGE_KEY = 'feedbackFormData';

// Валидация ФИО (только буквы, пробелы и дефисы)
function validateFullName(name) {
    return /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name);
}

// Валидация телефона (только цифры, пробелы и плюс)
function validatePhone(phone) {
    return /^[\d\s\+]+$/.test(phone);
}

// Открытие модального окна
if (openModalBtn) {
    openModalBtn.addEventListener('click', function() {
        feedbackModal.style.display = 'flex';
        // Изменение URL с помощью History API
        history.pushState({ modalOpen: true }, '', '#feedback');
        // Восстановление данных из LocalStorage
        restoreFormData();
    });
}

// Закрытие модального окна
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Закрытие модального окна при клике вне его области
if (feedbackModal) {
    feedbackModal.addEventListener('click', function(e) {
        if (e.target === feedbackModal) {
            closeModal();
        }
    });
}

// Обработка нажатия кнопки "Назад" в браузере
window.addEventListener('popstate', function(e) {
    if (location.hash !== '#feedback') {
        closeModal();
    }
});

// Функция закрытия модального окна
function closeModal() {
    if (feedbackModal) {
        feedbackModal.style.display = 'none';
    }
    // Возврат к исходному URL
    if (location.hash === '#feedback') {
        history.back();
    }
}

// Сохранение данных формы в LocalStorage
function saveFormData() {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const organizationInput = document.getElementById('organization');
    const messageInput = document.getElementById('message');

    if (fullNameInput && emailInput && phoneInput && organizationInput && messageInput) {
        const formData = {
            fullName: fullNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            organization: organizationInput.value,
            message: messageInput.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
}

// Восстановление данных формы из LocalStorage
function restoreFormData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const formData = JSON.parse(savedData);
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const organizationInput = document.getElementById('organization');
        const messageInput = document.getElementById('message');

        if (fullNameInput) fullNameInput.value = formData.fullName || '';
        if (emailInput) emailInput.value = formData.email || '';
        if (phoneInput) phoneInput.value = formData.phone || '';
        if (organizationInput) organizationInput.value = formData.organization || '';
        if (messageInput) messageInput.value = formData.message || '';
    }
}

// Очистка данных формы в LocalStorage
function clearFormData() {
    localStorage.removeItem(STORAGE_KEY);
}

// Валидация формы перед отправкой
function validateForm() {
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');

    if (!fullNameInput || !phoneInput) return false;

    const fullName = fullNameInput.value;
    const phone = phoneInput.value;

    let isValid = true;

    // Валидация ФИО
    if (fullName && !validateFullName(fullName)) {
        showFieldError('fullName', 'ФИО может содержать только буквы, пробелы и дефисы');
        isValid = false;
    } else {
        clearFieldError('fullName');
    }

    // Валидация телефона
    if (phone && !validatePhone(phone)) {
        showFieldError('phone', 'Телефон может содержать только цифры, пробелы, +');
        isValid = false;
    } else {
        clearFieldError('phone');
    }

    return isValid;
}

// Показать ошибку для конкретного поля
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    // Удаляем старую ошибку если есть
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Добавляем новую ошибку
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;

    formGroup.appendChild(errorElement);
    field.style.borderColor = '#dc3545';
}

// Очистить ошибку поля
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    field.style.borderColor = '#C2C5CE';
}

// Обработка отправки формы
if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Проверяем валидацию перед отправкой
        if (!validateForm()) {
            showMessage('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }

        // Сбор данных формы
        const formData = new FormData(feedbackForm);

        // Используем Formspree вместо Formcarry
        fetch('https://formcarry.com/s/dBg2a470fh0', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showMessage('Сообщение успешно отправлено!', 'success');
                feedbackForm.reset();
                clearFormData();
            } else {
                return response.json().then(err => {
                    throw new Error(err.error || 'Ошибка отправки формы');
                });
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
        });
    });
}

// Функция отображения сообщения
function showMessage(text, type) {
    if (!responseMessage) return;

    responseMessage.textContent = text;
    responseMessage.className = 'message ' + type;
    responseMessage.style.display = 'block';

    // Автоматическое скрытие сообщения через 5 секунд
    setTimeout(() => {
        responseMessage.style.display = 'none';
    }, 5000);
}

// Обработчики для реальной валидации при вводе
const fullNameInput = document.getElementById('fullName');
if (fullNameInput) {
    fullNameInput.addEventListener('input', function(e) {
        if (this.value && !validateFullName(this.value)) {
            showFieldError('fullName', 'ФИО может содержать только буквы, пробелы и дефисы');
        } else {
            clearFieldError('fullName');
        }
        saveFormData();
    });
}

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        if (this.value && !validatePhone(this.value)) {
            showFieldError('phone', 'Телефон может содержать только цифры, пробелы, +');
        } else {
            clearFieldError('phone');
        }
        saveFormData();
    });
}

// Сохранение данных формы при изменении полей
if (feedbackForm) {
    const otherInputs = feedbackForm.querySelectorAll('#email, #organization, #message');
    otherInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
    });
}

// Запуск слайдера после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    if (slides && totalSlides > 0) {
        startSlider();
    }
});