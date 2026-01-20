// State management
let currentTemplate = 'banking';
let stats = {
    total: 0,
    clicked: 0
};

// Template data with phishing characteristics
const templates = {
    banking: {
        sender: 'Security Alert <noreply@secure-bankalert.com>',
        subject: 'URGENT: Suspicious Activity Detected on Your Account',
        body: `Dear Valued Customer,

We have detected unusual activity on your account that requires immediate verification.

Account Status: SUSPENDED
Suspicious Login Attempts: 3
Location: Unknown

To restore full access to your account, please verify your identity immediately:

<a href="#" class="phishing-link" onclick="handlePhishingClick(event)">VERIFY YOUR ACCOUNT NOW</a>

Failure to verify within 24 hours will result in permanent account closure.

Thank you for your immediate attention.

Security Department
Secure Banking Services`,
        redFlags: [
            'Creates false urgency with "URGENT" and "24 hours" deadline',
            'Sender email "secure-bankalert.com" is not the real bank domain',
            'Generic greeting "Dear Valued Customer" instead of your name',
            'Threatens account closure to pressure quick action',
            'Asks you to click a link instead of directing to official website'
        ]
    },
    shipping: {
        sender: 'Delivery Service <notifications@delivery-tracking.net>',
        subject: 'Package Delivery Failed - Action Required',
        body: `Hello,

We attempted to deliver your package today but no one was available to receive it.

Tracking Number: DHL-8492-X3K9
Delivery Attempts: 2
Next Attempt: Pending Your Action

To reschedule delivery and avoid return to sender, please confirm your delivery address:

<a href="#" class="phishing-link" onclick="handlePhishingClick(event)">CONFIRM DELIVERY ADDRESS</a>

Package will be returned if not claimed within 48 hours.

Best regards,
Delivery Support Team`,
        redFlags: [
            'Unexpected package delivery you didn\'t order',
            'Domain "delivery-tracking.net" is not official courier service',
            'No specific package details or actual tracking link to official site',
            'Pressure tactic with "48 hours" deadline',
            'Generic sender name without company branding'
        ]
    },
    corporate: {
        sender: 'IT Department <support@company-it-services.com>',
        subject: 'Mandatory: Password Reset Required',
        body: `Dear Employee,

As part of our annual security audit, all passwords must be reset by end of day.

Your current password will expire in: 2 hours

Please reset your password immediately using the secure portal:

<a href="#" class="phishing-link" onclick="handlePhishingClick(event)">RESET PASSWORD NOW</a>

Accounts that do not comply will be temporarily suspended.

IT Security Team
Internal Systems Division`,
        redFlags: [
            'IT departments rarely ask for password resets via email',
            'Domain doesn\'t match your company\'s actual domain',
            'Artificial urgency with "2 hours" countdown',
            'Threatens account suspension to force compliance',
            'Real IT would use internal ticketing system or direct contact'
        ]
    },
    prize: {
        sender: 'Prize Notification <winner@reward-center.org>',
        subject: 'Congratulations! You\'re Our Lucky Winner!',
        body: `Dear Lucky Winner,

Congratulations! You have been selected as the grand prize winner in our annual customer appreciation program!

Your Prize: $5,000 Cash + iPhone 15 Pro
Winner ID: WN-2024-7893
Claim Deadline: 48 Hours

This is a limited-time offer. Claim your prize now:

<a href="#" class="phishing-link" onclick="handlePhishingClick(event)">CLAIM YOUR PRIZE</a>

Don't miss this incredible opportunity!

Prize Distribution Team`,
        redFlags: [
            'You never entered any contest or sweepstakes',
            'Too good to be true - unsolicited large prize',
            'Pressure to claim quickly with tight deadline',
            'No details about the actual contest or organization',
            'Generic winner notification without verification process'
        ]
    }
};

// Load stats from memory
function loadStats() {
    stats.total = parseInt(document.getElementById('totalSimulations').textContent) || 0;
    stats.clicked = parseInt(document.getElementById('clickedLinks').textContent) || 0;
    updateStats();
}

// Update statistics display
function updateStats() {
    document.getElementById('totalSimulations').textContent = stats.total;
    document.getElementById('clickedLinks').textContent = stats.clicked;
    const awarenessRate = stats.total > 0 ? 
        Math.round(((stats.total - stats.clicked) / stats.total) * 100) : 0;
    document.getElementById('awarenessRate').textContent = awarenessRate + '%';
}

// Select phishing template
function selectTemplate(templateName, element) {
    currentTemplate = templateName;
    
    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked element
    if (element) {
        element.classList.add('selected');
    }
    
    // DON'T auto-fill form fields - let user customize freely
    // Just clear the fields for fresh input
    document.getElementById('senderName').value = '';
    document.getElementById('subjectLine').value = '';
    
    // Clear any existing preview
    document.getElementById('previewSection').style.display = 'none';
}

// Generate phishing email preview
function generatePhishingEmail() {
    const template = templates[currentTemplate];
    
    // Get user input or use template defaults as fallback
    const recipient = document.getElementById('recipientEmail').value.trim() || 'user@example.com';
    const senderName = document.getElementById('senderName').value.trim() || template.sender.split('<')[0].trim();
    const subject = document.getElementById('subjectLine').value.trim() || template.subject;
    
    // Extract email from template sender if available
    const senderEmail = template.sender.match(/<(.+)>/)?.[1] || 'noreply@example.com';
    const fullSender = `${senderName} <${senderEmail}>`;
    
    const emailHTML = `
        <div class="email-header">
            <div class="email-field"><strong>From:</strong> ${fullSender}</div>
            <div class="email-field"><strong>To:</strong> ${recipient}</div>
            <div class="email-field"><strong>Subject:</strong> ${subject}</div>
            <div class="email-field"><strong>Date:</strong> ${new Date().toLocaleString()}</div>
        </div>
        <div class="email-body">
            ${template.body.replace(/\n/g, '<br>')}
        </div>
    `;
    
    document.getElementById('emailPreview').innerHTML = emailHTML;
    document.getElementById('previewSection').style.display = 'block';
    
    // Increment simulation counter
    stats.total++;
    updateStats();
}

// Handle phishing link click
function handlePhishingClick(event) {
    event.preventDefault();
    
    // Increment clicked counter
    stats.clicked++;
    updateStats();
    
    // Show result modal with educational content
    const template = templates[currentTemplate];
    document.getElementById('resultIcon').textContent = '⚠️';
    document.getElementById('resultTitle').textContent = 'You Clicked a Phishing Link!';
    document.getElementById('resultMessage').textContent = 
        'This was a simulated phishing attack. In a real scenario, you could have compromised your credentials, installed malware, or exposed sensitive company data.';
    
    // Display red flags specific to this template
    const redFlagsList = document.getElementById('redFlagsList');
    redFlagsList.innerHTML = template.redFlags.map(flag => `<li>${flag}</li>`).join('');
    
    document.getElementById('resultModal').classList.add('show');
}

// Close modal and return to dashboard
function closeModal() {
    document.getElementById('resultModal').classList.remove('show');
    
    // Clear the email preview to return to clean dashboard state
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('emailPreview').innerHTML = '';
}

// Initialize
window.addEventListener('load', () => {
    loadStats();
    selectTemplate('banking');
    
    // Close modal when clicking outside the content
    document.getElementById('resultModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});