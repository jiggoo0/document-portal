/**
 * DocMaster Pro - K-Bank Statement Logic
 * ปรับปรุงการคำนวณ Balance และ Pagination
 */

const config = {
    accountName: "น.ส. กฤษณา เจริญสุข",
    address: "124/5 ม.2 ต.คลองขลุง อ.คลองขลุง จ.กำแพงเพชร 62120",
    branch: "สาขาคลองขลุง",
    accountNo: "122-2-00003-0",
    period: "01/01/2020 - 24/01/2020",
    initialBalance: 1500000.00,
    logoPath: "Logo.jpg" // แนะนำให้ใช้ไฟล์นี้ตามโครงสร้าง Tree ของคุณ
};

const transactions = [
    { d: '01-01-20', t: '-', n: 'ยอดยกมา / Balance Brought Forward', w: 0, f: 0, c: '', br: '', u: '', isInitial: true },
    { d: '02-01-20', t: '08:15', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 50000.00, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '03-01-20', t: '10:45', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 12500.00, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '04-01-20', t: '13:20', n: 'ถอนเงินสด / Cash Withdrawal', w: 20000.00, f: 0, c: 'ATM', br: '0122', u: 'ATM' },
    { d: '05-01-20', t: '09:05', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 100000.00, c: 'Internet', br: '-', u: 'IBA' },
    { d: '06-01-20', t: '14:30', n: 'โอนเงิน / Transfer Withdrawal', w: 150000.00, f: 0, c: 'Connect', br: '0898', u: 'ACM' },
    { d: '07-01-20', t: '11:12', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 45000.00, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '08-01-20', t: '16:45', n: 'ชำระค่าสินค้า / Purchase', w: 3500.00, f: 0, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '09-01-20', t: '10:00', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 8500.00, c: 'Internet', br: '-', u: 'IBA' },
    { d: '10-01-20', t: '08:50', n: 'ฝากเงินสด / Cash Deposit', w: 0, f: 200000.00, c: 'สาขา', br: '0122', u: 'STAFF' },
    { d: '11-01-20', t: '12:15', n: 'โอนเงิน / Transfer Withdrawal', w: 45000.00, f: 0, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '12-01-20', t: '15:20', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 15000.00, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '13-01-20', t: '09:40', n: 'ถอนเงินสด ATM / ATM Withdrawal', w: 10000.00, f: 0, c: 'ATM', br: '0554', u: 'ATM' },
    { d: '14-01-20', t: '14:10', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 30000.00, c: 'Connect', br: '0898', u: 'ACM' },
    { d: '15-01-20', t: '11:55', n: 'โอนเงินต่างธนาคาร / ORFT Withdrawal', w: 80000.00, f: 0, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '16-01-20', t: '13:00', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 120000.00, c: 'Internet', br: '-', u: 'IBA' },
    { d: '17-01-20', t: '10:20', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 5000.00, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '18-01-20', t: '15:40', n: 'ถอนเงินสด / Cash Withdrawal', w: 5000.00, f: 0, c: 'ATM', br: '0122', u: 'ATM' },
    { d: '19-01-20', t: '09:15', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 25000.00, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '20-01-20', t: '12:30', n: 'ชำระบิล / Bill Payment', w: 1500.00, f: 0, c: 'Connect', br: '0898', u: 'ACM' },
    { d: '21-01-20', t: '14:00', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 65000.00, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '22-01-20', t: '10:50', n: 'โอนเงิน / Transfer Withdrawal', w: 100000.00, f: 0, c: 'K PLUS', br: '0923', u: 'KRS' },
    { d: '23-01-20', t: '11:20', n: 'รับโอนเงิน / Transfer Deposit', w: 0, f: 200000.00, c: 'Internet', br: '-', u: 'IBA' },
    { d: '24-01-20', t: '16:10', n: 'ถอนเงินสด / Cash Withdrawal', w: 23500.00, f: 0, c: 'ATM', br: '0122', u: 'ATM' }
];

const ROWS_PER_PAGE = 26; // ปรับลดลงเล็กน้อยเพื่อให้ Footer ไม่เบียด
const fmt = (v) => v > 0 ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) : '';

function renderApp() {
    const container = document.getElementById('page-container');
    container.innerHTML = '';
    
    let currentBal = config.initialBalance;
    const totalW = transactions.reduce((s, t) => s + t.w, 0);
    const totalF = transactions.reduce((s, t) => s + t.f, 0);
    const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);

    for (let p = 1; p <= totalPages; p++) {
        const startIndex = (p - 1) * ROWS_PER_PAGE;
        const pageItems = transactions.slice(startIndex, startIndex + ROWS_PER_PAGE);
        
        const pageHtml = createPage(p, totalPages, pageItems, currentBal, totalW, totalF);
        container.insertAdjacentHTML('beforeend', pageHtml);

        // อัปเดตยอดคงเหลือสำหรับหน้าถัดไป
        pageItems.forEach(t => {
            if (!t.isInitial) currentBal = currentBal - t.w + t.f;
        });
    }
}

function createPage(pageNo, totalPages, items, pageStartBal, totalW, totalF) {
    let rowsHtml = '';
    let runningBal = pageStartBal;

    items.forEach(r => {
        if (!r.isInitial) runningBal = runningBal - r.w + r.f;
        rowsHtml += `
            <tr>
                <td class="text-center">${r.d}</td>
                <td class="text-center">${r.t}</td>
                <td class="txn-name ${r.isInitial ? 'f-bold' : ''}">${r.n}</td>
                <td>
                    <div class="amt-flex">
                        <span class="withdraw-val">${fmt(r.w)}</span>
                        <span class="deposit-val">${fmt(r.f)}</span>
                    </div>
                </td>
                <td class="text-right f-bold">${new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(runningBal)}</td>
                <td class="text-center">${r.c}</td>
                <td class="text-center">${r.br}</td>
                <td class="text-center">${r.u}</td>
            </tr>`;
    });

    // Fill empty rows
    for (let i = items.length; i < ROWS_PER_PAGE; i++) {
        rowsHtml += `<tr>${'<td>&nbsp;</td>'.repeat(8)}</tr>`;
    }

    return `
    <div class="page">
        <div class="header-section">
            <div class="header-left">
                <p class="title-th">รายการเดินบัญชีเงินฝากออมทรัพย์</p>
                <p class="title-en">K-DEPOSIT STATEMENT OF SAVING ACCOUNT</p>
                <p class="doc-no">ที่งส. 008 : N20013116520037461269/2563 <span style="margin-left:30px">หน้าที่ ${pageNo}/${totalPages}</span></p>
            </div>
            <div class="logo-container">
                <img src="${config.logoPath}" class="bank-logo" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/f/f0/K_Bank_logo.svg'">
            </div>
        </div>

        <div class="info-grid">
            <div class="customer-info">
                <span class="f-bold">ชื่อบัญชี / Account Name:</span> ${config.accountName}<br>
                <span class="f-bold">ที่อยู่ / Address:</span> ${config.address}<br>
                <span class="f-bold">สาขาเจ้าของบัญชี / Account Branch:</span> ${config.branch}
            </div>
            <div class="summary-wrapper">
                <table class="s-table">
                    <tr><td class="label-bg">เลขที่บัญชี / Account No.</td><td class="f-bold">${config.accountNo}</td></tr>
                    <tr><td class="label-bg">ระหว่างวันที่ / Period</td><td>${config.period}</td></tr>
                </table>
                <table class="s-table">
                    <tr><td class="label-bg">ยอดยกมา / Bal. B/F</td><td class="text-right">${new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(config.initialBalance)}</td></tr>
                    <tr><td class="label-bg">รวมถอน / Total Withdrawal</td><td class="text-right">${fmt(totalW)}</td></tr>
                    <tr><td class="label-bg">รวมฝาก / Total Deposit</td><td class="text-right">${fmt(totalF)}</td></tr>
                </table>
            </div>
        </div>

        <div class="barcode-box">*20013116520037461269*</div>

        <div class="statement-container">
            <table class="main-table">
                <thead>
                    <tr>
                        <th style="width:10%">วันที่<br>Date</th>
                        <th style="width:10%">เวลา<br>Time</th>
                        <th style="width:23%">รายการ<br>Description</th>
                        <th style="width:18%">ถอนเงิน/ฝากเงิน<br>Withdrawal/Deposit</th>
                        <th style="width:15%">ยอดคงเหลือ<br>Balance</th>
                        <th style="width:10%">ช่องทาง<br>Channel</th>
                        <th style="width:7%">สาขา<br>Br.</th>
                        <th style="width:7%">ผู้ทำ<br>User</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>

        <div class="footer">
            <div class="footer-left">
                คัดโดย / Printed By: K0999999 <br>
                <strong>K-Contact Center 02-8888888</strong><br>
                www.kasikornbank.com
            </div>
            <div class="footer-right">
                สำนักงานใหญ่ 1 ซอยราษฎร์บูรณะ 27/1 เขตราษฎร์บูรณะ กรุงเทพฯ 10140 <br>
                Head Office: 1 Soi Rat Burana 27/1, Rat Burana District, Bangkok 10140 <br>
                <strong>เลขประจำตัวผู้เสียภาษี / Tax ID: 0107536000315</strong>
            </div>
        </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', renderApp);
