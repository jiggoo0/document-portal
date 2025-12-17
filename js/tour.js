/**
 * JP World Travel - Tour Voucher Logic
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

function renderTourVoucher() {
    const container = document.getElementById('tour-container');
    
    let itineraryHtml = tourData.itinerary.map(item => `
        <div class="day-item">
            <div class="day-num">${item.day}</div>
            <div class="day-desc">${item.desc}</div>
        </div>
    `).join('');

    container.innerHTML = `
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
                ${tourData.contact}<br>
                www.jpworldtravel.com
            </div>
            <div class="qr-box">
                <div id="tour-qr"></div>
                <div style="font-size: 8px; color: #999; margin-top: 5px;">Scan to Verify</div>
            </div>
        </div>
    `;
    
    setTimeout(generateTourQR, 100);
}

function generateTourQR() {
    new QRCode(document.getElementById("tour-qr"), {
        text: `TOUR-VERIFY:${tourData.voucherNo}|PAX:${tourData.customerName}`,
        width: 70,
        height: 70,
        colorDark : "#2d3436",
        colorLight : "#ffffff"
    });
}

async function downloadTourPDF() {
    const btn = document.getElementById('pdf-btn');
    btn.innerText = "Creating PDF...";
    
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(document.getElementById('tour-container'), { scale: 3 });
    
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 10, 15, imgWidth, imgHeight);
    pdf.save(`Tour_Voucher_${tourData.voucherNo}.pdf`);
    
    btn.innerText = "📄 ดาวน์โหลด PDF";
}

document.addEventListener('DOMContentLoaded', renderTourVoucher);
