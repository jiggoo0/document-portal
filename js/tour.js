/**
 * JP World Travel - Tour Voucher Logic (Professional Update)
 * สำหรับจัดการข้อมูลแผนการท่องเที่ยวและระบบตรวจสอบผ่าน QR Code
 */

const tourData = {
    packageName: "Japan Autumn Wonders: Tokyo - Fuji - Kyoto",
    packageCode: "JP-AUT-2025-001",
    customerName: "KRITSANA CHAROENSUK",
    travelDate: "20 - 24 DEC 2025",
    totalPax: "2 Adults",
    voucherNo: "V-9923481",
    itinerary: [
        { day: "DAY 1", desc: "Arrival at Narita Airport - Transfer to Shinjuku - Welcome Dinner" },
        { day: "DAY 2", desc: "Mt. Fuji 5th Station - Oshino Hakkai - Kawaguchiko Lake View" },
        { day: "DAY 3", desc: "Bullet Train (Shinkansen) to Kyoto - Fushimi Inari Shrine" },
        { day: "DAY 4", desc: "Arashiyama Bamboo Grove - Kinkakuji Golden Pavilion - Gion District" },
        { day: "DAY 5", desc: "Souvenir Shopping - Transfer to Kansai Airport - Departure" }
    ],
    contact: "Emergency Call: +66 88 888 8888 | LINE: @JPWorldTravel"
};

/**
 * ฟังก์ชัน Render ข้อมูลลงใน HTML
 */
function renderTourVoucher() {
    const container = document.getElementById('tour-container');
    if (!container) return;
    
    let itineraryHtml = tourData.itinerary.map(item => `
        <div class="day-item">
            <div class="day-num">${item.day}</div>
            <div class="day-desc">${item.desc}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="tour-card">
            <div class="tour-header">
                <div class="brand-name">JP WORLD TRAVEL</div>
                <div class="voucher-label">OFFICIAL TOUR VOUCHER</div>
            </div>

            <div class="tour-content">
                <div class="tour-title-box">
                    <div class="tour-name">${tourData.packageName}</div>
                    <div class="tour-code">CODE: ${tourData.packageCode}</div>
                </div>

                <div class="info-bar">
                    <div class="info-item">
                        <label>CUSTOMER NAME</label>
                        <span>${tourData.customerName}</span>
                    </div>
                    <div class="info-item">
                        <label>TRAVEL DATE</label>
                        <span>${tourData.travelDate}</span>
                    </div>
                    <div class="info-item">
                        <label>GUESTS</label>
                        <span>${tourData.totalPax}</span>
                    </div>
                </div>

                <div class="itinerary-section">
                    <div class="section-h">ITINERARY HIGHLIGHTS</div>
                    ${itineraryHtml}
                </div>
            </div>

            <div class="tour-footer">
                <div class="contact-info">
                    <strong>VOUCHER NO: ${tourData.voucherNo}</strong><br>
                    <span class="contact-text">${tourData.contact}</span><br>
                    <span class="web-text">www.jpworldtravel.com</span>
                </div>
                <div class="qr-box">
                    <div id="tour-qr"></div>
                    <div class="qr-sub-text">Scan to Verify</div>
                </div>
            </div>
        </div>
    `;
    
    // สร้าง QR Code หลังจาก Content ถูกโหลด
    setTimeout(generateTourQR, 150);
}

/**
 * สร้าง QR Code ที่เชื่อมโยงกับระบบ Verification จริง
 */
function generateTourQR() {
    const qrTarget = document.getElementById("tour-qr");
    if (!qrTarget) return;

    // URL สำหรับตรวจสอบสถานะจริงบน Vercel
    const verifyUrl = `https://document-portal-lime.vercel.app/JPverify.html?id=${tourData.voucherNo}&type=tour`;

    new QRCode(qrTarget, {
        text: verifyUrl,
        width: 80,
        height: 80,
        colorDark : "#2d3436",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

/**
 * ฟังก์ชันดาวน์โหลด PDF พร้อมการจัดการหน่วยความจำ
 */
async function downloadTourPDF() {
    const btn = document.getElementById('pdf-btn');
    const originalText = btn.innerText;
    btn.innerText = "Creating PDF...";
    btn.disabled = true;
    
    try {
        const { jsPDF } = window.jspdf;
        const container = document.getElementById('tour-container');
        
        const canvas = await html2canvas(container, { 
            scale: 3, // ความละเอียดสูงเพื่อให้ QR Code สแกนติดง่าย
            useCORS: true,
            backgroundColor: "#ffffff"
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // จัดกึ่งกลางหน้า A4
        pdf.addImage(imgData, 'JPEG', 10, 15, imgWidth, imgHeight);
        pdf.save(`JP_Tour_Voucher_${tourData.voucherNo}.pdf`);
    } catch (error) {
        console.error("PDF Error:", error);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', renderTourVoucher);
