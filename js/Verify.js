/**
 * Verify Letter Logic - JP Group
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ตั้งค่าวันที่ปัจจุบันในรูปแบบสากล
    initDate();
    
    // 2. สร้าง QR Code สำหรับตรวจสอบเอกสาร
    initQRCode();
});

function initDate() {
    const dateEl = document.getElementById('current-date');
    if (!dateEl) return;
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.innerText = new Date().toLocaleDateString('en-US', options);
}

function initQRCode() {
    const qrDiv = document.getElementById('verify-qr');
    if (!qrDiv) return;

    new QRCode(qrDiv, {
        text: `https://verify.jpgroup.com/check/${qrDiv.dataset.ref}`,
        width: 75,
        height: 75,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

/**
 * ฟังก์ชันส่งออกเป็น PDF คุณภาพสูง
 */
async function exportToPDF(event) {
    const btn = event.target;
    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const page = document.querySelector('.page');
        
        const canvas = await html2canvas(page, {
            scale: 3, // เพิ่มความชัด
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        pdf.save(`JP_Verification_${Date.now()}.pdf`);

    } catch (error) {
        console.error("PDF Export Error:", error);
        alert("ไม่สามารถสร้าง PDF ได้ในขณะนี้");
    } finally {
        btn.innerText = "📄 ดาวน์โหลด PDF";
        btn.disabled = false;
    }
}
