document.addEventListener('DOMContentLoaded', (event) => {
    loadItems();
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Replace with actual validation logic (e.g., check against stored credentials)
    if (username === 'Shahriar' && password === '202502') {
        document.querySelector('.login-container').style.display = 'none';
        document.getElementById('passwordManager').classList.remove('hidden');
        showAlert('Successfully logged in!', 'success');
    } else {
        showAlert('Invalid credentials. Please try again.', 'error');
    }
});

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = `alert_${new Date().getTime()}`;
    const alertBox = document.createElement('div');
    alertBox.className = `alert-box ${type}`;
    alertBox.id = alertId;
    alertBox.innerHTML = `
        <span>${message}</span>
        <span class="close-btn" onclick="closeAlert('${alertId}')">&times;</span>
    `;
    alertContainer.appendChild(alertBox);

    setTimeout(() => {
        closeAlert(alertId);
    }, 3000);
}

function closeAlert(alertId) {
    const alertBox = document.getElementById(alertId);
    if (alertBox) {
        alertBox.style.opacity = '0';
        setTimeout(() => {
            if (alertBox) {
                alertBox.remove();
            }
        }, 300);
    }
}

function copyPassword(itemId) {
    const text = document.getElementById(itemId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        showAlert('Copied to clipboard', 'info');
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}

function addItem() {
    const itemType = document.getElementById('itemType').value;
    const email = document.getElementById('newEmail').value;
    const value = document.getElementById('newValue').value;

    if (!email || !value) {
        showAlert('Both fields are required!', 'error');
        return;
    }

    const itemId = `item_${new Date().getTime()}`;
    const itemHtml = 
        `<div class="item" onclick="copyPassword('${itemId}')">${email}
            <span id="${itemId}" class="hidden">${value}</span>
        </div>`;

    document.getElementById(itemType).insertAdjacentHTML('beforeend', itemHtml);

    saveItems();
    document.getElementById('newEmail').value = '';
    document.getElementById('newValue').value = '';
    showAlert('Item added successfully!', 'success');
}

function saveItems() {
    const sections = ['passwords', 'backupCodes', 'keyPhrases', 'twoFACodes'];
    const data = {};
    sections.forEach(section => {
        const items = document.getElementById(section).querySelectorAll('.item');
        data[section] = Array.from(items).map(item => {
            return {
                email: item.textContent.trim(),
                value: item.querySelector('.hidden').textContent.trim()
            };
        });
    });

    localStorage.setItem('data', JSON.stringify(data));
}

function loadItems() {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    Object.keys(data).forEach(section => {
        data[section].forEach(item => {
            const itemId = `item_${new Date().getTime()}`;
            const itemHtml = 
                `<div class="item" onclick="copyPassword('${itemId}')">${item.email}
                    <span id="${itemId}" class="hidden">${item.value}</span>
                </div>`;
            document.getElementById(section).insertAdjacentHTML('beforeend', itemHtml);
        });
    });
}

function downloadData() {
    const data = JSON.parse(localStorage.getItem('data')) || {};
    let content = '';

    Object.keys(data).forEach(section => {
        content += `=== ${section.toUpperCase()} ===\n`;
        data[section].forEach(item => {
            content += `${item.email}: ${item.value}\n`;
        });
        content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}