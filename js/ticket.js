/**
 * JP Ariway - ETicket Logic (Full Implementation)
 * ประสานการสร้าง QR Code และระบบส่งออก PDF คุณภาพสูง
 */

"use strict";

const ticketData = {
    passenger: "KRITSANA CHAROENSUK",
    flight: "JP888",
    from: { city: "BANGKOK", code: "BKK" },
    to: { city: "TOKYO", code: "NRT" },
    date: "20 DEC 2025",
    gate: "D7",
    boardingTime: "23:15",
    seat: "12A",
    class: "ECONOMY",
    refNo: "JP" + Math.floor(Math.random() * 900000 + 100000)
};

/**
 * ฟังก์ชันหลักในการวาดตั๋วลงหน้า HTML
 */
function renderTicket() {
    const container = document.getElementById('ticket-container');
    if (!container) return;

    // ฉีด Template ของตั๋วลงใน Container
    container.innerHTML = `
        <div class="ticket">
            <div class="ticket-header">
                <div class="logo">JP ARIWAY</div>
                <div class="ticket-type">${ticketData.class} BOARDING PASS</div>
            </div>

            <div class="ticket-body">
                <div class="flight-info">
                    <div class="info-group">
                        <label>Passenger Name</label>
                        <div class="value">${ticketData.passenger}</div>
                    </div>
                    <div class="info-group">
                        <label>Flight</label>
                        <div class="value">${ticketData.flight}</div>
                    </div>
                </div>

                <div class="route-info">
                    <div class="station">
                        <div class="city">${ticketData.from.city}</div>
                        <div class="code">${ticketData.from.code}</div>
                    </div>
                    <div class="plane-icon">✈️</div>
                    <div class="station" style="text-align: right;">
                        <div class="city">${ticketData.to.city}</div>
                        <div class="code">${ticketData.to.code}</div>
                    </div>
                </div>

                <div class="details-grid">
                    <div class="item">
                        <label>Date</label>
                        <div class="val">${ticketData.date}</div>
                    </div>
                    <div class="item">
                        <label>Gate</label>
                        <div class="val">${ticketData.gate}</div>
                    </div>
                    <div class="item">
                        <label>Boarding Time</label>
                        <div class="val">${ticketData.boardingTime}</div>
                    </div>
                    <div class="item">
                        <label>Seat</label>
                        <div class="val">${ticketData.seat}</div>
                    </div>
                </div>
            </div>

            <div class="ticket-footer">
                <div class="barcode-area">
                    <div id="ticket-qr" class="qr-code"></div>
                    <p class="ref-no">VERIFICATION ID: ${ticketData.refNo}</p>
                </div>
                <div class="notice">
                    * Gate closes 15 mins before departure.<br>
                    * This is an electronic document for security check.
                </div>
            </div>
        </div>
    `;
    
    // เรียกสร้าง QR Code
    generateQR();
}

/**
 * สร้าง QR Code ที่สแกนแล้วพาไปหน้ายืนยันสถานะ Authentic
 */
function generateQR() {
    const qrElement = document.getElementById("ticket-qr");
    
    // ตรวจสอบความพร้อมของ Element และ Library
    if (!qrElement) return;

    if (typeof QRCode === 'undefined') {
        console.warn("QRCode library not ready, retrying in 300ms...");
        setTimeout(generateQR, 300);
        return;
    }

    // ล้างค่าเก่า
    qrElement.innerHTML = "";

    // URL สำหรับตรวจสอบสถานะบน Vercel
    const BASE_VERIFY_URL = "https://document-portal-lime.vercel.app/JPverify.html";
    const verificationUrl = `${BASE_VERIFY_URL}?id=${ticketData.refNo}&type=flight`;

    try {
        new QRCode(qrElement, {
            text: verificationUrl,
            width: 100,
            height: 100,
            colorDark : "#2d3436",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        console.log("QR Code generated for ID:", ticketData.refNo);
    } catch (err) {
        console.error("QR Generation Error:", err);
    }
}

/**
 * ส่งออกตั๋วเป็นไฟล์ PDF คุณภาพสูง (A4)
 */
async function downloadTicketPDF() {
    const btn = document.getElementById('pdf-btn');
    if (!btn) return;
    
    const originalText = btn.innerText;
    btn.innerText = "⌛ Generating...";
    btn.disabled = true;
    
    try {
        const { jsPDF } = window.jspdf;
        const element = document.querySelector('.ticket');
        
        if (!element) throw new Error("Ticket element not found");

        // ใช้ html2canvas แปลงตั๋วเป็นรูปภาพ
        const canvas = await html2canvas(element, { 
            scale: 3, 
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // คำนวณขนาดให้อยู่กึ่งกลางหน้า A4
        const pdfWidth = 160; 
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const xPos = (210 - pdfWidth) / 2;
        
        pdf.addImage(imgData, 'JPEG', xPos, 30, pdfWidth, pdfHeight);
        pdf.save(`JP_ETicket_${ticketData.refNo}.pdf`);
    } catch (error) {
        console.error("PDF Creation Error:", error);
        alert("ขออภัย ไม่สามารถสร้าง PDF ได้ โปรดลองใหม่อีกครั้ง");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// ผูกฟังก์ชันเข้ากับหน้าเว็บ
document.addEventListener('DOMContentLoaded', renderTicket);
