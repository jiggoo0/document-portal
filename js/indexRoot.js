/**
 * JP Group Management System - Root Dashboard Logic
 * Optimized for Modern Browsers & Mobile Performance
 * Version: 1.2.0
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // 1. เริ่มทำงานระบบนาฬิกาแบบ Real-time
    const clockController = initDigitalClock();

    // 2. รันแอนิเมชันตอนเข้าหน้าเว็บ (Entrance Stagger Animation)
    initEntranceAnimation();

    // 3. จัดการสถานะ Hover สำหรับ Mobile/Touch
    initTouchStates();
});

/**
 * ฟังก์ชันจัดการนาฬิกาดิจิทัล
 * อัปเดตเวลาทุก 1 วินาที ในรูปแบบภาษาไทย
 */
function initDigitalClock() {
    const timeDisplay = document.getElementById('current-time');
    if (!timeDisplay) return null;

    const updateClock = () => {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    
    // Return สำหรับใช้จัดการ Cleanup หากจำเป็น
    return intervalId;
}

/**
 * ฟังก์ชันจัดการแอนิเมชัน Card เมนู
 * ใช้เทคนิค Staggering เพื่อให้ Card ทยอยลอยขึ้นมาอย่างนุ่มนวล
 */
function initEntranceAnimation() {
    const cards = document.querySelectorAll('.menu-card');
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
        // Initial State
        Object.assign(card.style, {
            opacity: '0',
            transform: 'translateY(20px)',
            willChange: 'transform, opacity'
        });

        // Stagger Animation using requestAnimationFrame for performance
        setTimeout(() => {
            requestAnimationFrame(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 100 * index);
    });
}

/**
 * ฟังก์ชันจัดการ Touch State สำหรับอุปกรณ์มือถือ
 * ช่วยให้การกดเมนูบน iPhone ดูตอบสนอง (Responsive) มากขึ้น
 */
function initTouchStates() {
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
            card.style.transition = 'transform 0.1s ease';
        }, { passive: true });

        card.addEventListener('touchend', () => {
            card.style.transform = 'translateY(0) scale(1)';
        }, { passive: true });
    });
}
