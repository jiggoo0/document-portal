/**
 * JP Group Management System - Root Dashboard Logic
 * ระบบจัดการ Portal กลางและการแสดงผลหน้าแรก
 * Version: 1.1.0
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // 1. เริ่มทำงานระบบนาฬิกาแบบ Real-time
    initDigitalClock();

    // 2. รันแอนิเมชันตอนเข้าหน้าเว็บ (Entrance Stagger Animation)
    initEntranceAnimation();
});

/**
 * ฟังก์ชันจัดการนาฬิกาดิจิทัล
 * อัปเดตเวลาทุก 1 วินาที ในรูปแบบภาษาไทย
 */
function initDigitalClock() {
    const timeDisplay = document.getElementById('current-time');
    
    // ตรวจสอบว่ามี Element ในหน้าเว็บหรือไม่ก่อนรัน
    if (!timeDisplay) return;

    const updateClock = () => {
        const now = new Date();
        const formattedTime = now.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        timeDisplay.innerText = formattedTime;
    };

    updateClock(); // รันทันทีเมื่อโหลดหน้า
    setInterval(updateClock, 1000);
}

/**
 * ฟังก์ชันจัดการแอนิเมชัน Card เมนู
 * ใช้เทคนิค Staggering เพื่อให้ Card ทยอยลอยขึ้นมาอย่างนุ่มนวล
 */
function initEntranceAnimation() {
    const cards = document.querySelectorAll('.menu-card');
    
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
        // ตั้งค่าเริ่มต้น (Hidden State)
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.willChange = 'transform, opacity'; // ช่วยให้เบราว์เซอร์รันแอนิเมชันได้ลื่นขึ้น

        // สั่งให้เริ่มทำงานตามลำดับ (Sequential Stagger)
        setTimeout(() => {
            // ใช้ Cubic Bezier เพื่อให้แอนิเมชันดู Smooth แบบ Modern UI
            card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 120 * index); // หน่วงเวลา 120ms ต่อการแสดงผล 1 Card
    });
}
