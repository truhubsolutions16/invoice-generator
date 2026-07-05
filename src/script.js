// Invoice Generator Application

// Global Variables
let invoiceData = {
    company: {
        logo: null,
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        taxId: ''
    },
    client: {
        name: '',
        company: '',
        address: '',
        phone: '',
        email: ''
    },
    invoice: {
        number: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        currency: 'USD',
        taxPercentage: 18,
        discountPercentage: 0
    },
    items: [],
    notes: '',
    terms: '',
    signature: null
};

// DOM Elements
const form = {
    companyName: document.getElementById('companyName'),
    companyAddress: document.getElementById('companyAddress'),
    companyPhone: document.getElementById('companyPhone'),
    companyEmail: document.getElementById('companyEmail'),
    companyWebsite: document.getElementById('companyWebsite'),
    companyTaxId: document.getElementById('companyTaxId'),
    clientName: document.getElementById('clientName'),
    clientCompany: document.getElementById('clientCompany'),
    clientAddress: document.getElementById('clientAddress'),
    clientPhone: document.getElementById('clientPhone'),
    clientEmail: document.getElementById('clientEmail'),
    invoiceNumber: document.getElementById('invoiceNumber'),
    invoiceDate: document.getElementById('invoiceDate'),
    dueDate: document.getElementById('dueDate'),
    currency: document.getElementById('currency'),
    taxPercentage: document.getElementById('taxPercentage'),
    discountPercentage: document.getElementById('discountPercentage'),
    notes: document.getElementById('notes'),
    terms: document.getElementById('terms'),
    logoInput: document.getElementById('logoInput'),
    signatureInput: document.getElementById('signatureInput'),
    itemsTable: document.getElementById('itemsTable'),
    addItemBtn: document.getElementById('addItemBtn'),
    generatePdfBtn: document.getElementById('generatePdfBtn'),
    printBtn: document.getElementById('printBtn'),
    saveHtmlBtn: document.getElementById('saveHtmlBtn'),
    clearFormBtn: document.getElementById('clearFormBtn'),
    newInvoiceBtn: document.getElementById('newInvoiceBtn'),
    invoicePreview: document.getElementById('invoicePreview'),
    themeToggle: document.getElementById('themeToggle')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setDefaultInvoiceDate();
    addEventListeners();
    loadTheme();
    renderItems();
    updatePreview();
}

// Event Listeners
function addEventListeners() {
    // Company Info
    form.companyName.addEventListener('change', updateInvoiceData);
    form.companyAddress.addEventListener('change', updateInvoiceData);
    form.companyPhone.addEventListener('change', updateInvoiceData);
    form.companyEmail.addEventListener('change', updateInvoiceData);
    form.companyWebsite.addEventListener('change', updateInvoiceData);
    form.companyTaxId.addEventListener('change', updateInvoiceData);

    // Client Info
    form.clientName.addEventListener('change', updateInvoiceData);
    form.clientCompany.addEventListener('change', updateInvoiceData);
    form.clientAddress.addEventListener('change', updateInvoiceData);
    form.clientPhone.addEventListener('change', updateInvoiceData);
    form.clientEmail.addEventListener('change', updateInvoiceData);

    // Invoice Info
    form.invoiceNumber.addEventListener('change', updateInvoiceData);
    form.invoiceDate.addEventListener('change', updateInvoiceData);
    form.dueDate.addEventListener('change', updateInvoiceData);
    form.currency.addEventListener('change', updateInvoiceData);
    form.taxPercentage.addEventListener('change', updateInvoiceData);
    form.discountPercentage.addEventListener('change', updateInvoiceData);

    // Additional Info
    form.notes.addEventListener('change', updateInvoiceData);
    form.terms.addEventListener('change', updateInvoiceData);

    // File Uploads
    form.logoInput.addEventListener('change', handleLogoUpload);
    form.signatureInput.addEventListener('change', handleSignatureUpload);

    // Buttons
    form.addItemBtn.addEventListener('click', addInvoiceItem);
    form.generatePdfBtn.addEventListener('click', generatePDF);
    form.printBtn.addEventListener('click', printInvoice);
    form.saveHtmlBtn.addEventListener('click', saveAsHTML);
    form.clearFormBtn.addEventListener('click', clearForm);
    form.newInvoiceBtn.addEventListener('click', newInvoice);

    // Theme Toggle
    form.themeToggle.addEventListener('click', toggleTheme);
}

// Update Invoice Data
function updateInvoiceData() {
    invoiceData.company.name = form.companyName.value;
    invoiceData.company.address = form.companyAddress.value;
    invoiceData.company.phone = form.companyPhone.value;
    invoiceData.company.email = form.companyEmail.value;
    invoiceData.company.website = form.companyWebsite.value;
    invoiceData.company.taxId = form.companyTaxId.value;

    invoiceData.client.name = form.clientName.value;
    invoiceData.client.company = form.clientCompany.value;
    invoiceData.client.address = form.clientAddress.value;
    invoiceData.client.phone = form.clientPhone.value;
    invoiceData.client.email = form.clientEmail.value;

    invoiceData.invoice.number = form.invoiceNumber.value;
    invoiceData.invoice.date = form.invoiceDate.value;
    invoiceData.invoice.dueDate = form.dueDate.value;
    invoiceData.invoice.currency = form.currency.value;
    invoiceData.invoice.taxPercentage = parseFloat(form.taxPercentage.value) || 0;
    invoiceData.invoice.discountPercentage = parseFloat(form.discountPercentage.value) || 0;

    invoiceData.notes = form.notes.value;
    invoiceData.terms = form.terms.value;

    updatePreview();
}

// File Uploads
function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            invoiceData.company.logo = event.target.result;
            const preview = document.getElementById('logoPreview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Logo">`;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

function handleSignatureUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            invoiceData.signature = event.target.result;
            const preview = document.getElementById('signaturePreview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Signature">`;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

// Invoice Items Management
function addInvoiceItem() {
    invoiceData.items.push({
        id: Date.now(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxPercentage: 0,
        total: 0
    });
    renderItems();
}

function deleteInvoiceItem(id) {
    invoiceData.items = invoiceData.items.filter(item => item.id !== id);
    renderItems();
}

function renderItems() {
    form.itemsTable.innerHTML = '';
    invoiceData.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" value="${item.description}" placeholder="Item description" class="item-input" data-field="description" data-id="${item.id}"></td>
            <td><input type="number" value="${item.quantity}" min="0" step="0.01" class="item-input" data-field="quantity" data-id="${item.id}"></td>
            <td><input type="number" value="${item.unitPrice}" min="0" step="0.01" class="item-input" data-field="unitPrice" data-id="${item.id}"></td>
            <td><input type="number" value="${item.taxPercentage}" min="0" max="100" step="0.01" class="item-input" data-field="taxPercentage" data-id="${item.id}"></td>
            <td class="text-right">₹${item.total.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="deleteInvoiceItem(${item.id})">Delete</button></td>
        `;
        form.itemsTable.appendChild(row);
    });

    // Add event listeners to new inputs
    document.querySelectorAll('.item-input').forEach(input => {
        input.addEventListener('change', updateItemValue);
    });
}

function updateItemValue(e) {
    const id = parseInt(e.target.dataset.id);
    const field = e.target.dataset.field;
    const value = e.target.value;
    const item = invoiceData.items.find(i => i.id === id);
    
    if (item) {
        if (field === 'description') {
            item.description = value;
        } else {
            item[field] = parseFloat(value) || 0;
        }
        calculateItemTotal(item);
        renderItems();
        updatePreview();
    }
}

function calculateItemTotal(item) {
    const subtotal = item.quantity * item.unitPrice;
    const tax = (subtotal * item.taxPercentage) / 100;
    item.total = subtotal + tax;
}

// Date Utilities
function setDefaultInvoiceDate() {
    const today = new Date().toISOString().split('T')[0];
    form.invoiceDate.value = today;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Generate Currency Symbol
function getCurrencySymbol(currency) {
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'INR': '₹',
        'CAD': 'C$',
        'AUD': 'A$'
    };
    return symbols[currency] || '$';
}

// Calculate Totals
function calculateTotals() {
    let subtotal = 0;
    invoiceData.items.forEach(item => {
        subtotal += item.total;
    });

    const discountAmount = (subtotal * invoiceData.invoice.discountPercentage) / 100;
    const afterDiscount = subtotal - discountAmount;
    const tax = (afterDiscount * invoiceData.invoice.taxPercentage) / 100;
    const grandTotal = afterDiscount + tax;

    return {
        subtotal,
        discountAmount,
        afterDiscount,
        tax,
        grandTotal
    };
}

// Update Preview
function updatePreview() {
    const totals = calculateTotals();
    const currencySymbol = getCurrencySymbol(invoiceData.invoice.currency);

    let html = `
        <div class="invoice">
            <!-- Header -->
            <div class="invoice-header">
                <div class="invoice-logo-section">
                    ${invoiceData.company.logo ? `<img src="${invoiceData.company.logo}" alt="Logo" class="invoice-logo">` : '<div style="width: 150px; height: 100px; background: #f0f4f8; display: flex; align-items: center; justify-content: center; border-radius: 4px;">Logo</div>'}
                    <div class="company-details">
                        <p><strong>${invoiceData.company.name || 'Company Name'}</strong></p>
                        ${invoiceData.company.address ? `<p>${invoiceData.company.address}</p>` : ''}
                        ${invoiceData.company.phone ? `<p>Phone: ${invoiceData.company.phone}</p>` : ''}
                        ${invoiceData.company.email ? `<p>Email: ${invoiceData.company.email}</p>` : ''}
                    </div>
                </div>
                <div class="invoice-title-section">
                    <h1 class="invoice-title">INVOICE</h1>
                    <div class="invoice-details">
                        <div class="invoice-detail-row">
                            <span class="invoice-detail-label">Invoice No:</span>
                            <span>${invoiceData.invoice.number || 'INV-001'}</span>
                        </div>
                        <div class="invoice-detail-row">
                            <span class="invoice-detail-label">Date:</span>
                            <span>${formatDate(invoiceData.invoice.date) || 'Date'}</span>
                        </div>
                        ${invoiceData.invoice.dueDate ? `
                        <div class="invoice-detail-row">
                            <span class="invoice-detail-label">Due Date:</span>
                            <span>${formatDate(invoiceData.invoice.dueDate)}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- Bill To Section -->
            <div class="invoice-content">
                <div class="invoice-section">
                    <div class="invoice-section-title">Bill To</div>
                    <div class="invoice-section-content">
                        <p><strong>${invoiceData.client.name || 'Client Name'}</strong></p>
                        ${invoiceData.client.company ? `<p>${invoiceData.client.company}</p>` : ''}
                        ${invoiceData.client.address ? `<p>${invoiceData.client.address}</p>` : ''}
                        ${invoiceData.client.phone ? `<p>Phone: ${invoiceData.client.phone}</p>` : ''}
                        ${invoiceData.client.email ? `<p>Email: ${invoiceData.client.email}</p>` : ''}
                    </div>
                </div>
                <div class="invoice-section">
                    <div class="invoice-section-title">From</div>
                    <div class="invoice-section-content">
                        <p><strong>${invoiceData.company.name || 'Company Name'}</strong></p>
                        ${invoiceData.company.address ? `<p>${invoiceData.company.address}</p>` : ''}
                        ${invoiceData.company.phone ? `<p>Phone: ${invoiceData.company.phone}</p>` : ''}
                        ${invoiceData.company.email ? `<p>Email: ${invoiceData.company.email}</p>` : ''}
                        ${invoiceData.company.website ? `<p>Website: ${invoiceData.company.website}</p>` : ''}
                        ${invoiceData.company.taxId ? `<p>Tax ID: ${invoiceData.company.taxId}</p>` : ''}
                    </div>
                </div>
            </div>

            <!-- Items Table -->
            <div class="invoice-items-section">
                <table class="invoice-items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th class="text-right">Quantity</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Tax %</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceData.items.map(item => `
                            <tr>
                                <td>${item.description || '-'}</td>
                                <td class="text-right">${item.quantity}</td>
                                <td class="text-right">${currencySymbol}${item.unitPrice.toFixed(2)}</td>
                                <td class="text-right">${item.taxPercentage.toFixed(2)}%</td>
                                <td class="text-right">${currencySymbol}${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        ${invoiceData.items.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 20px; color: #999;">No items added</td></tr>' : ''}
                    </tbody>
                </table>
            </div>

            <!-- Totals -->
            <div class="invoice-totals">
                <div class="totals-box">
                    <div class="total-row">
                        <span class="total-row-label">Subtotal:</span>
                        <span class="total-row-value">${currencySymbol}${totals.subtotal.toFixed(2)}</span>
                    </div>
                    ${invoiceData.invoice.discountPercentage > 0 ? `
                    <div class="total-row">
                        <span class="total-row-label">Discount (${invoiceData.invoice.discountPercentage.toFixed(2)}%):</span>
                        <span class="total-row-value">-${currencySymbol}${totals.discountAmount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div class="total-row">
                        <span class="total-row-label">Tax (${invoiceData.invoice.taxPercentage.toFixed(2)}%):</span>
                        <span class="total-row-value">${currencySymbol}${totals.tax.toFixed(2)}</span>
                    </div>
                    <div class="grand-total">
                        <span>Total:</span>
                        <span>${currencySymbol}${totals.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <!-- Notes -->
            ${invoiceData.notes ? `
            <div class="invoice-notes-section">
                <div class="invoice-notes-title">Notes:</div>
                <p>${invoiceData.notes}</p>
            </div>
            ` : ''}

            <!-- Terms -->
            ${invoiceData.terms ? `
            <div class="invoice-terms-section">
                <div class="invoice-terms-title">Terms & Conditions:</div>
                <div class="invoice-terms-content">${invoiceData.terms}</div>
            </div>
            ` : ''}

            <!-- Signature -->
            <div class="invoice-signature-section">
                <div class="signature-box">
                    ${invoiceData.signature ? `<img src="${invoiceData.signature}" alt="Signature" class="signature-image">` : ''}
                    <div class="signature-line">Authorized By</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line">Client Signature</div>
                </div>
            </div>

            <!-- Footer -->
            <div class="invoice-footer">
                <p>Thank you for your business! | Generated by Invoice Generator</p>
            </div>
        </div>
    `;

    form.invoicePreview.innerHTML = html;
}

// Generate PDF
function generatePDF() {
    const invoiceElement = document.querySelector('.invoice');
    if (!invoiceElement) {
        alert('Please fill in the invoice details first.');
        return;
    }

    const opt = {
        margin: 10,
        filename: `Invoice_${invoiceData.invoice.number || 'document'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(invoiceElement).save();
}

// Print Invoice
function printInvoice() {
    const printWindow = window.open('', '', 'height=600,width=800');
    const invoiceElement = document.querySelector('.invoice');
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');

    let stylesHtml = '';
    styles.forEach(style => {
        stylesHtml += style.outerHTML;
    });

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            ${stylesHtml}
            <style>
                body { margin: 0; padding: 20px; }
                @media print {
                    body { margin: 0; padding: 0; }
                }
            </style>
        </head>
        <body>
            ${invoiceElement.outerHTML}
            <script>
                window.print();
                window.onafterprint = function() {
                    window.close();
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Save as HTML
function saveAsHTML() {
    const invoiceElement = document.querySelector('.invoice');
    if (!invoiceElement) {
        alert('Please fill in the invoice details first.');
        return;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <link rel="stylesheet" href="invoice.css">
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            ${invoiceElement.outerHTML}
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceData.invoice.number || 'document'}.html`;
    link.click();
    URL.revokeObjectURL(url);
}

// Clear Form
function clearForm() {
    if (confirm('Are you sure you want to clear the entire form? This action cannot be undone.')) {
        Object.keys(form).forEach(key => {
            if (form[key].tagName === 'INPUT' || form[key].tagName === 'TEXTAREA' || form[key].tagName === 'SELECT') {
                form[key].value = '';
            }
        });
        invoiceData.items = [];
        invoiceData.company.logo = null;
        invoiceData.signature = null;
        document.getElementById('logoPreview').innerHTML = '';
        document.getElementById('signaturePreview').innerHTML = '';
        setDefaultInvoiceDate();
        form.taxPercentage.value = 18;
        form.discountPercentage.value = 0;
        renderItems();
        updatePreview();
    }
}

// New Invoice
function newInvoice() {
    clearForm();
    // Generate new invoice number
    const newNumber = `INV-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`;
    form.invoiceNumber.value = newNumber;
    invoiceData.invoice.number = newNumber;
    setDefaultInvoiceDate();
    updatePreview();
}

// Theme Toggle
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = form.themeToggle.querySelector('.theme-icon');
    if (document.body.classList.contains('dark-mode')) {
        icon.textContent = '☀️';
    } else {
        icon.textContent = '🌙';
    }
}
