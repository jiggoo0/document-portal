/**
 * Official Verification Letter Logic - JP Group Management
 * จัดการวันที่, การสร้าง QR Code และการส่งออกเอกสาร PDF คุณภาพสูง
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // 1. ตั้งค่าวันที่ปัจจุบันในรูปแบบสากล (เช่น December 17, 2025)
    initDate();
    
    // 2. สร้าง QR Code สำหรับตรวจสอบเอกสารผ่านระบบออนไลน์
    // ใช้การหน่วงเวลาเล็กน้อยเพื่อให้ Library QRCode โหลดเสร็จสมบูรณ์
    setTimeout(initQRCode, 300);
});

/**
 * ตั้งค่าวันที่ออกเอกสาร
 */
function initDate() {
    const dateEl = document.getElementById('current-date');
    if (!dateEl) return;
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateEl.innerText = today.toLocaleDateString('en-US', options);
}

/**
 * สร้าง QR Code ที่เชื่อมโยงกับ URL ตรวจสอบจริงบน Vercel
 */
function initQRCode() {
    const qrDiv = document.getElementById('verify-qr');
    if (!qrDiv || typeof QRCode === 'undefined') return;

    // ดึงค่ารหัสอ้างอิงจาก data-ref ใน HTML
    const refCode = qrDiv.dataset.ref || `JP-REF-${Date.now()}`;
    
    // URL สำหรับตรวจสอบความถูกต้อง (เปลี่ยนโดเมนให้ตรงกับ Vercel ของคุณ)
    const verifyUrl = `https://document-portal-lime.vercel.app/JPverify.html?id=${refCode}&type=legal`;

    // ล้างเนื้อหาเดิมก่อนสร้างใหม่ (ป้องกัน QR ซ้อนกัน)
    qrDiv.innerHTML = "";

    new QRCode(qrDiv, {
        text: verifyUrl,
        width: 85,
        height: 85,
        colorDark : "#2d3436",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H // ระดับความแม่นยำสูงเพื่อให้สแกนติดง่าย
    });
}

/**
 * ฟังก์ชันส่งออกเป็น PDF คุณภาพสูงขนาด A4
 * @param {Event} event - ข้อมูลจากปุ่มที่กด
 */
async function exportToPDF(event) {
    const btn = event ? event.target : document.getElementById('pdf-btn');
    if (!btn) return;

    const originalText = btn.innerText;
    btn.innerText = "⌛ Generating PDF...";
    btn.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const page = document.querySelector('.page');
        
        if (!page) throw new Error("Document page element not found");

        // สร้าง Canvas จากหน้าเอกสาร
        const canvas = await html2canvas(page, {
            scale: 3,           // ความคมชัดระดับ 3x สำหรับการพิมพ์ (High DPI)
            useCORS: true,      // รองรับรูปภาพที่มาจากโดเมนอื่น
            logging: false,     // ปิด log ใน console
            letterRendering: true,
            allowTaint: false,
            backgroundColor: "#ffffff"
        });

        // แปลงภาพเป็น JPEG คุณภาพสูงสุด
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // สร้างเอกสาร PDF ขนาด A4 (210mm x 297mm)
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // วางรูปภาพให้เต็มหน้ากระดาษพอดี
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
        
        // บันทึกไฟล์โดยใช้รหัสอ้างอิงเป็นชื่อไฟล์
        const refCode = document.getElementById('verify-qr')?.dataset.ref || 'Verification';
        pdf.save(`JP_Verification_${refCode}.pdf`);

    } catch (error) {
        console.error("PDF Export Error:", error);
        alert("ขออภัย: ไม่สามารถสร้างไฟล์ PDF ได้ในขณะนี้ โปรดลองใหม่อีกครั้ง");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// ผูกฟังก์ชันเข้ากับ Window เพื่อให้เรียกใช้จาก HTML ได้ง่าย
window.downloadPDF = exportToPDF;
