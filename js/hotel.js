/**
 * JP Luxury Hotel - Confirmation Logic
 */

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

function renderHotelBooking() {
    const container = document.getElementById('hotel-container');
    
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
                        <div class="val" style="color: green;">● ${bookingData.status}</div>
                    </div>
                </div>

                <div class="stay-details">
                    <div class="date-box">
                        <div class="label">CHECK-IN</div>
                        <div class="date">${bookingData.checkIn}</div>
                        <div class="label">14:00 PM</div>
                    </div>
                    <div class="arrow">→</div>
                    <div class="date-box">
                        <div class="label">CHECK-OUT</div>
                        <div class="date">${bookingData.checkOut}</div>
                        <div class="label">12:00 PM</div>
                    </div>
                </div>

                <div class="info-grid">
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
                    <div>
                        <div class="conf-no">CONF: ${bookingData.confirmationNo}</div>
                        <div class="address">${bookingData.hotelAddress}</div>
                    </div>
                    <div id="hotel-qr" class="qr-code"></div>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(generateHotelQR, 100);
}

function generateHotelQR() {
    new QRCode(document.getElementById("hotel-qr"), {
        text: `HOTEL-VERIFY:${bookingData.confirmationNo}`,
        width: 80,
        height: 80,
        colorDark : "#1a1a1a",
        colorLight : "#ffffff"
    });
}

async function downloadHotelPDF() {
    const btn = document.getElementById('pdf-btn');
    btn.innerText = "Generating...";
    
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(document.getElementById('hotel-container'), { 
        scale: 3,
        useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
    pdf.save(`Hotel_Confirmation_${bookingData.confirmationNo}.pdf`);
    
    btn.innerText = "📄 ดาวน์โหลด PDF";
}

document.addEventListener('DOMContentLoaded', renderHotelBooking);
