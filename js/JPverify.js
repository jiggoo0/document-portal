document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('id');
    const type = params.get('type');

    // UI Elements
    const banner = document.getElementById('status-indicator');
    const icon = document.getElementById('status-icon');
    const title = document.getElementById('status-title');
    const message = document.getElementById('status-message');

    // Simulation delay เพื่อความสมจริงในการตรวจสอบ
    setTimeout(() => {
        if (docId) {
            // Case: Valid Document
            banner.className = 'status-banner is-valid';
            icon.innerText = '✅';
            title.innerText = 'Verified';
            message.innerText = 'เอกสารนี้ได้รับการยืนยันความถูกต้อง';
            
            document.getElementById('doc-id').innerText = docId;
            document.getElementById('doc-holder').innerText = "Authorized Customer";
            document.getElementById('doc-date').innerText = new Date().toLocaleDateString('th-TH');
            document.getElementById('doc-status').innerText = (type || 'Authentic').toUpperCase();
        } else {
            // Case: Missing ID
            banner.className = 'status-banner is-invalid';
            icon.innerText = '❌';
            title.innerText = 'Invalid';
            message.innerText = 'ไม่พบรหัสเอกสาร หรือรหัสไม่ถูกต้อง';
        }
    }, 1200);
});
