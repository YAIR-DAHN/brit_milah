// תאריך הברית מילה - יום שני כ"ב אלול תשפ"ה (15.9.25) בשעה 10:00
const EVENT_DATE = new Date('2025-09-15T10:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_DATE - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // אנימציה לעדכון המספרים
    updateTimeBlockWithAnimation('.days', days);
    updateTimeBlockWithAnimation('.hours', hours);
    updateTimeBlockWithAnimation('.minutes', minutes);
    updateTimeBlockWithAnimation('.seconds', seconds);

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = '<h2>הברית התחילה! מזל טוב!</h2>';
    }
}

function updateTimeBlockWithAnimation(selector, value) {
    const element = document.querySelector(selector);
    const currentValue = parseInt(element.textContent);
    const newValue = String(value).padStart(2, '0');
    
    if (currentValue !== value) {
        element.style.transform = 'translateY(-20px)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 300);
    }
}

// הוספת סגנונות מעבר לאלמנטים של הספירה לאחור
document.querySelectorAll('.time-block span').forEach(el => {
    el.style.transition = 'all 0.3s ease-out';
});

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// טיפול במודאל
const modal = document.getElementById('registrationModal');
const registerBtn = document.getElementById('registerBtn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('registrationForm');

registerBtn.onclick = () => modal.style.display = 'block';
closeBtn.onclick = () => modal.style.display = 'none';

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// טיפול בשליחת הטופס
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const wishes = document.getElementById('wishes').value || '';

    // בדיקת שם מלא
    if (!name.trim()) {
        alert('אנא הכנס את שמך המלא');
        return;
    }

    // הצגת אנימציית טעינה
    showLoadingAnimation();

    try {
        const response = await submitForm(name, wishes);
        if (response && response.success) {
            showSuccessMessage();
        } else {
            throw new Error(response.error || 'שגיאה בשליחת הטופס');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('אירעה שגיאה. אנא נסה שוב מאוחר יותר');
        hideLoadingAnimation();
    }
}
);

// פונקציות עזר לאנימציות
function showLoadingAnimation() {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="loading-animation">
            <div class="brit-loading">
                <div class="baby-icon">👶</div>
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <p class="loading-text">רושמים את האישור שלך לברית מילה...</p>
            <p class="loading-subtext">מזל טוב! 🎉</p>
        </div>
    `;
}

function showSuccessMessage() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="success-message">
                <div class="success-icon">🎉</div>
                <h3>תודה שאישרת את הגעתך!</h3>
                <p>נשמח לראותך בברית המילה 👶</p>
                <h2>משפחת עטר</h2>
                <div class="confetti"></div>
                <button onclick="closeModal()" class="close-btn">סגירה</button>
            </div>
        `;
        
        // אנימציית קונפטי
        createConfetti();
    }
}
function closeModal() {
    modal.style.display = 'none';
}

// פונקציה לשיחת הטופס ל-Google Apps Script
async function submitForm(name, wishes) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyB01txyUPXnVfTsTtg6m7UEiC8-RVl693CFtnMTyNpTzNBzlhmRLaQMwJAe3yU9FFp/exec'; // החלף עם ה-URL שלך
    
    try {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('wishes', wishes);
        formData.append('event', 'ברית מילה - משפחת עטר');
        formData.append('date', '15.9.25 - 10:00');
        
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        // בדיקה אם התגובה תקינה
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('שגיאה בשליחת הטופס');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// הוספת פונקציית hideLoadingAnimation החסרה
function hideLoadingAnimation() {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <span class="close">&times;</span>
            <h3>אישור הגעה לברית מילה</h3>
            <form id="registrationForm">
                <div class="form-group">
                    <label for="name">שם מלא:</label>
                    <input type="text" id="name" required placeholder="הכנס את שמך המלא">
                </div>
                <div class="form-group">
                    <label for="wishes">איחולים והערות (רשות):</label>
                    <textarea id="wishes" rows="3" placeholder="כתוב כאן איחולים או הערות מיוחדות..."></textarea>
                </div>
                <button type="submit" class="submit-btn">אשר הגעה</button>
            </form>
        `;
        
        // חידוש האזנה לאירועים
        const newCloseBtn = modalContent.querySelector('.close');
        if (newCloseBtn) {
            newCloseBtn.onclick = () => modal.style.display = 'none';
        }
    }
}

// הוספה לתחילת הקובץ
document.addEventListener('DOMContentLoaded', () => {
    initializeWindyText();
    // אנימציית כניסה לאלמנטים
    const elements = document.querySelectorAll('.time-block, .register-btn, h1, h2');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// פונציית קונפטי
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.querySelector('.confetti').appendChild(confetti);
    }
}

// נוסיף פונקציה חדשה לאנימציית הטקסט
function initializeWindyText() {
    const title = document.querySelector('h1');
    if (title) {
        const text = ['"בסימן', 'טוב', 'בן', 'בא', 'לנו"'];
        title.innerHTML = text.map(word => 
            `<div class="word">${
                [...word].map(char => 
                    `<span class="char">${char}</span>`
                ).join('')
            }</div>`
        ).join(' ');
    }
}

// פונקציות למודאל יצירת קשר
function showContactModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// סגירת המודאל בלחיצה מחוץ לתוכן
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    const registrationModal = document.getElementById('registrationModal');
    if (event.target === modal) {
        closeContactModal();
    }
    if (event.target === registrationModal) {
        registrationModal.style.display = 'none';
    }
}

// פונקציות ניווט
function openWaze() {
    const address = 'רחוב יהודה הנשיא 32 אלעד';
    const wazeUrl = `https://ul.waze.com/ul?place=ChIJS5Cs5_gzHRURPUuSxB4xqdE&ll=32.05080910%2C34.95287700&navigate=yes&utm_medium=send_to_phone_QR`;
    window.open(wazeUrl, '_blank');
}

function addToCalendar() {
    const eventTitle = 'ברית מילה - משפחת עטר';
    const eventDetails = 'בשבח ובהודיה להשי"ת - הכנסת בננו שיחי\' בבריתו של אברהם אבינו';
    const location = 'אולמי אחיעזר, רחוב יהודה הנשיא 32 אלעד';
    const startDate = '20250915T100000'; // 15.9.2025 10:00
    const endDate = '20250915T120000'; // משך 2 שעות
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, '_blank');
}

// הוספת מאזינים לכפתורי הניווט
document.addEventListener('DOMContentLoaded', () => {
    const wazeBtn = document.getElementById('wazeBtn');
    const calendarBtn = document.getElementById('calendarBtn');
    
    if (wazeBtn) {
        wazeBtn.addEventListener('click', openWaze);
    }
    
    if (calendarBtn) {
        calendarBtn.addEventListener('click', addToCalendar);
    }
});

