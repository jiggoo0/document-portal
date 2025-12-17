/**
 * JP Luxury Hotel - Confirmation Logic (Professional Version)
 * ระบบจัดการใบยืนยันการจองพร้อม QR Code และ Export PDF
 */

"use strict";

const bookingData = {
    guestName: "KRITSANA CHAROENSUK",
    confirmationNo: "JPH-" + Math.floor(Math.random() * 900000 + 100000),
    checkIn: "21 DEC 2025",
    checkOut: "24 DEC 2025",
    roomType: "DELUXE OCEAN SUITE",
    guests: "2 ADULTS",
    breakfast: "INCLUDED",
    status: "CONFIRMED",
    hotelAddress: "123 Sukhumvit Road, Khlong Toei, Bangkok 10110, Thailand"
};

/**
 * ฟังก์ชันหลักในการ Render หน้าใบยืนยันการจอง
 */
function renderHotelBooking() {
    const container = document.getElementById('hotel-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="hotel-card">
            <div class="card-header">
                <div class="hotel-name">JP LUXURY HOTEL</div>
                <div class="sub-title">A SIGNATURE EXPERIENCE</div>
            </div>

            <div class="card-body">
                <div class="section-title">BOOKING CONFIRMATION</div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <label>GUEST NAME</label>
                        <div class="val">${bookingData.guestName}</div>
                    </div>
                    <div class="info-item">
                        <label>STATUS</label>
                        <div class="val status-confirmed">● ${bookingData.status}</div>
                    </div>
                </div>

                <div class="stay-details">
                    <div class="date-box">
                        <div class="label">CHECK-IN</div>
                        <div class="date">${bookingData.checkIn}</div>
                        <div class="time-label">FROM 14:00 PM</div>
                    </div>
                    <div class="arrow-divider">
                        <span class="nights">3 NIGHTS</span>
                        <div class="line"></div>
                        <span class="icon">🏨</span>
                    </div>
                    <div class="date-box">
                        <div class="label">CHECK-OUT</div>
                        <div class="date">${bookingData.checkOut}</div>
                        <div class="time-label">UNTIL 12:00 PM</div>
                    </div>
                </div>

                <div class="info-grid secondary">
                    <div class="info-item">
                        <label>ROOM TYPE</label>
                        <div class="val">${bookingData.roomType}</div>
                    </div>
                    <div class="info-item">
                        <label>GUESTS</label>
                        <div class="val">${bookingData.guests}</div>
                    </div>
                    <div class="info-item">
                        <label>MEAL PLAN</label>
                        <div class="val">${bookingData.breakfast}</div>
                    </div>
                    <div class="info-item">
                        <label>CONFIRMATION NO.</label>
                        <div class="val">${bookingData.confirmationNo}</div>
                    </div>
                </div>

                <div class="qr-footer">
                    <div class="address-box">
                        <div class="conf-no">REF: ${bookingData.confirmationNo}</div>
                        <div class="address">${bookingData.hotelAddress}</div>
                    </div>
                    <div class="qr-wrapper">
                        <div id="hotel-qr"></div>
                    </div>
                </div>
            </div>
            <div class="card-edge"></div>
        </div>
    `;
    
    // หน่วงเวลาเพื่อให้แน่ใจว่า Library QRCode พร้อมทำงาน
    setTimeout(generateHotelQR, 200);
}

/**
 * สร้าง QR Code ยืนยันตัวตน (Authentication)
 */
function generateHotelQR() {
    const qrContainer = document.getElementById("hotel-qr");
    if (!qrContainer) return;

    // ตรวจสอบว่ามี Library QRCode หรือยัง
    if (typeof QRCode === 'undefined') {
        console.error("QRCode library is not loaded.");
        return;
    }

    const verifyUrl = `https://document-portal-lime.vercel.app/JPverify.html?id=${bookingData.confirmationNo}&type=hotel`;

    qrContainer.innerHTML = ""; // ล้างค่าเก่า

    new QRCode(qrContainer, {
        text: verifyUrl,
        width: 100,
        height: 100,
        colorDark : "#1a1a1a",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

/**
 * ส่งออกใบยืนยันการจองเป็นไฟล์ PDF
 */
async function downloadHotelPDF() {
    const btn = document.getElementById('pdf-btn');
    if (!btn) return;

    const originalText = btn.innerText;
    btn.innerText = "⏳ Processing...";
    btn.disabled = true;
    
    try {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById('hotel-container');
        
        const canvas = await html2canvas(element, { 
            scale: 2.5, // เพิ่มความละเอียดเพื่อความคมชัดของข้อความ
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff"
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const xPos = (210 - imgWidth) / 2;
        
        pdf.addImage(imgData, 'PNG', xPos, 20, imgWidth, imgHeight);
        pdf.save(`JP_Hotel_${bookingData.confirmationNo}.pdf`);
    } catch (error) {
        console.error("PDF Export Error:", error);
        alert("ไม่สามารถสร้าง PDF ได้ โปรดลองใหม่อีกครั้ง");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// เริ่มต้นทำงานเมื่อโหลด DOM เสร็จสิ้น
document.addEventListener('DOMContentLoaded', renderHotelBooking);
