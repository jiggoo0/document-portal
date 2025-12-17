/**
 * JP Ariway - ETicket Logic (Full Implementation)
 */

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
    refNo: "JP-" + Math.floor(Math.random() * 900000 + 100000)
};

function renderTicket() {
    const container = document.getElementById('ticket-container');
    
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
                    <p class="ref-no">REF: ${ticketData.refNo}</p>
                </div>
                <div class="notice">
                    * Gate closes 15 mins before departure.<br>
                    * Please present this pass at security.
                </div>
            </div>
        </div>
    `;
    
    // สร้าง QR Code หลังจาก HTML ปรากฏ
    setTimeout(generateQR, 100);
}

function generateQR() {
    new QRCode(document.getElementById("ticket-qr"), {
        text: `TICKET-VERIFIED:${ticketData.refNo}`,
        width: 70,
        height: 70,
        colorDark : "#2d3436",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

async function downloadTicketPDF() {
    const btn = document.getElementById('pdf-btn');
    btn.innerText = "Processing...";
    
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('ticket-container');
    
    const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: "#f0f2f5"
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
    pdf.save(`JP_Ticket_${ticketData.refNo}.pdf`);
    
    btn.innerText = "📄 Download PDF";
}

document.addEventListener('DOMContentLoaded', renderTicket);
