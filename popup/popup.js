/**
 * AppSec Inspector - Popup UI Controller
 * Handles all UI interactions, scan orchestration, and result display
 */

// Global state
let currentTab = null;
let currentResults = {
    headers: [],
    secrets: [],
    auth: []
};
let currentTheme = 'dark';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('AppSec Inspector popup loaded');

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;

    // Initialize UI
    initializeUI();

    // Check if welcome modal should be shown
    checkWelcomeModal();

    // Load saved theme
    loadTheme();
});

/**
 * Initialize UI event listeners
 */
function initializeUI() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Scan buttons
    document.getElementById('scanHeaders').addEventListener('click', () => scanHeaders());
    document.getElementById('scanSecrets').addEventListener('click', () => scanSecrets());
    document.getElementById('scanAuth').addEventListener('click', () => scanAuth());

    // Action buttons
    document.getElementById('clearResults').addEventListener('click', () => clearResults());
    document.getElementById('exportJson').addEventListener('click', () => exportResults('json'));
    document.getElementById('exportTxt').addEventListener('click', () => exportResults('txt'));
    document.getElementById('exportPdf').addEventListener('click', () => exportResults('pdf'));
    document.getElementById('shareBtn').addEventListener('click', () => shareResults());

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => toggleTheme());

    // Help button
    document.getElementById('helpBtn').addEventListener('click', () => showHowToModal());

    // Modal controls
    document.getElementById('closeWelcome').addEventListener('click', () => closeWelcomeModal());
    document.getElementById('getStarted').addEventListener('click', () => closeWelcomeModal());
    document.getElementById('closeHowTo').addEventListener('click', () => closeHowToModal());

    // Footer links
    document.getElementById('privacyLink').addEventListener('click', (e) => {
        e.preventDefault();
        showPrivacyPolicy();
    });

    document.getElementById('supportLink').addEventListener('click', (e) => {
        e.preventDefault();
        showSupport();
    });
}

/**
 * Switch between tabs
 */
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

/**
 * Show loading overlay
 */
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

/**
 * Scan security headers
 */
async function scanHeaders() {
    showLoading();

    try {
        // Get headers from background script
        const response = await chrome.runtime.sendMessage({
            action: 'getHeaders',
            tabId: currentTab.id
        });

        if (response.error) {
            showError('headers', response.error);
            hideLoading();
            return;
        }

        // Analyze headers
        const findings = analyzeSecurityHeaders(response.headers);
        currentResults.headers = findings;

        // Display results
        displayHeadersResults(findings, response.url);
        updateSecurityScore();

    } catch (error) {
        console.error('Error scanning headers:', error);
        showError('headers', 'Failed to scan headers: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Scan for secrets
 */
async function scanSecrets() {
    showLoading();

    try {
        // Get DOM data from content script
        const domResponse = await chrome.tabs.sendMessage(currentTab.id, {
            action: 'scanDOM'
        });

        // Get storage data
        const storageResponse = await chrome.tabs.sendMessage(currentTab.id, {
            action: 'scanStorage'
        });

        // Get network requests
        const networkResponse = await chrome.runtime.sendMessage({
            action: 'getNetworkRequests',
            tabId: currentTab.id
        });

        // Perform secret scan
        const findings = await performComprehensiveSecretScan({
            dom: domResponse.data,
            storage: storageResponse.data,
            network: networkResponse.requests || []
        });

        currentResults.secrets = findings;

        // Display results
        displaySecretsResults(findings);
        updateSecurityScore();

    } catch (error) {
        console.error('Error scanning secrets:', error);
        showError('secrets', 'Failed to scan for secrets: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Scan auth & session
 */
async function scanAuth() {
    showLoading();

    try {
        // Get cookies from background script
        const cookieResponse = await chrome.runtime.sendMessage({
            action: 'getCookies',
            url: currentTab.url
        });

        if (cookieResponse.error) {
            showError('auth', cookieResponse.error);
            hideLoading();
            return;
        }

        // Get storage data for JWT scanning
        const storageResponse = await chrome.tabs.sendMessage(currentTab.id, {
            action: 'scanStorage'
        });

        // Analyze cookies and auth
        const findings = performAuthAnalysis({
            cookies: cookieResponse.cookies,
            storage: storageResponse.data,
            url: currentTab.url
        });

        currentResults.auth = findings;

        // Display results
        displayAuthResults(findings);
        updateSecurityScore();

    } catch (error) {
        console.error('Error scanning auth:', error);
        showError('auth', 'Failed to scan authentication: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Perform comprehensive secret scan
 */
async function performComprehensiveSecretScan(data) {
    const allFindings = [];

    // Scan DOM HTML
    if (data.dom && data.dom.html) {
        const htmlFindings = scanForSecrets(data.dom.html, 'DOM - HTML');
        allFindings.push(...htmlFindings);
    }

    // Scan inline scripts
    if (data.dom && data.dom.inlineScripts) {
        data.dom.inlineScripts.forEach((script, index) => {
            const scriptFindings = scanForSecrets(script.content, `DOM - Inline Script #${index + 1}`);
            allFindings.push(...scriptFindings);
        });
    }

    // Scan data attributes
    if (data.dom && data.dom.dataAttributes) {
        data.dom.dataAttributes.forEach(attr => {
            const attrFindings = scanForSecrets(attr.value, `DOM - ${attr.element}.${attr.attribute}`);
            allFindings.push(...attrFindings);
        });
    }

    // Scan localStorage
    if (data.storage && data.storage.localStorage) {
        Object.entries(data.storage.localStorage).forEach(([key, value]) => {
            const storageFindings = scanForSecrets(value, `LocalStorage - ${key}`);
            allFindings.push(...storageFindings);
        });
    }

    // Scan sessionStorage
    if (data.storage && data.storage.sessionStorage) {
        Object.entries(data.storage.sessionStorage).forEach(([key, value]) => {
            const storageFindings = scanForSecrets(value, `SessionStorage - ${key}`);
            allFindings.push(...storageFindings);
        });
    }

    // Scan network requests
    if (data.network && data.network.length > 0) {
        data.network.forEach(request => {
            // Scan URL
            const urlFindings = scanForSecrets(request.url, 'Network - URL');
            allFindings.push(...urlFindings);

            // Scan headers
            if (request.requestHeaders) {
                request.requestHeaders.forEach(header => {
                    const headerFindings = scanForSecrets(header.value, `Network - Header (${header.name})`);
                    allFindings.push(...headerFindings);
                });
            }
        });
    }

    // Remove duplicates
    return removeDuplicateFindings(allFindings);
}

/**
 * Perform auth analysis
 */
function performAuthAnalysis(data) {
    const findings = {
        cookies: [],
        jwts: [],
        summary: {}
    };

    // Analyze cookies
    if (data.cookies && data.cookies.length > 0) {
        findings.cookies = data.cookies.map(cookie => analyzeCookie(cookie));
    }

    // Find and analyze JWTs
    const storage = {
        local: data.storage.localStorage || {},
        session: data.storage.sessionStorage || {}
    };
    findings.jwts = findAndAnalyzeJWTs(data.cookies, storage);

    // Generate summary
    findings.summary = {
        totalCookies: data.cookies.length,
        secureCookies: findings.cookies.filter(c => c.secure).length,
        insecureCookies: findings.cookies.filter(c => !c.secure).length,
        totalJWTs: findings.jwts.length,
        expiredJWTs: findings.jwts.filter(j =>
            j.analysis.issues && j.analysis.issues.some(i => i.issue.includes('expired'))
        ).length
    };

    return findings;
}

/**
 * Display headers results
 */
function displayHeadersResults(findings, url) {
    const container = document.getElementById('headersResults');

    if (findings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-text">No security header issues found!</div>
            </div>
        `;
        return;
    }

    let html = '';
    findings.forEach(finding => {
        const statusClass = finding.status.toLowerCase();
        const severityClass = finding.severity ? `severity-${finding.severity}` : '';

        html += `
            <div class="result-card">
                <div class="result-header">
                    <div class="result-title">${finding.header}</div>
                    <div>
                        <span class="badge badge-${statusClass}">${finding.status}</span>
                        ${finding.severity ? `<span class="severity-badge ${severityClass}">${finding.severity}</span>` : ''}
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-description">${finding.description}</div>
                    ${finding.value ? `<div class="masked-value">${escapeHtml(finding.value)}</div>` : ''}
                    ${finding.issues && finding.issues.length > 0 ? `
                        <div class="result-meta">
                            <strong>Issues:</strong>
                            <ul>
                                ${finding.issues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${finding.recommendation ? `
                        <div class="result-recommendation">
                            <strong>💡 Recommendation:</strong> ${finding.recommendation}
                        </div>
                    ` : ''}
                    ${finding.owaspRefs && finding.owaspRefs.length > 0 ? `
                        <div class="result-meta">
                            <strong>OWASP:</strong> ${finding.owaspRefs.join(', ')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    // Add fix snippets to FAIL and WARN findings
    setTimeout(() => {
        const cards = container.querySelectorAll('.result-card');
        findings.forEach((finding, index) => {
            if ((finding.status === 'FAIL' || finding.status === 'WARN') && cards[index]) {
                addFixSnippets(finding.header.toLowerCase(), cards[index]);
            }
        });
    }, 100);
    

}

/**
 * Display secrets results
 */
function displaySecretsResults(findings) {
    const container = document.getElementById('secretsResults');

    if (findings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-text">No exposed secrets detected!</div>
            </div>
        `;
        return;
    }

    let html = '';
    findings.forEach(finding => {
        const severityClass = finding.severity ? `severity-${finding.severity}` : '';

        html += `
            <div class="result-card">
                <div class="result-header">
                    <div class="result-title">${finding.type}</div>
                    <div>
                        <span class="badge badge-fail">FOUND</span>
                        ${finding.severity ? `<span class="severity-badge ${severityClass}">${finding.severity}</span>` : ''}
                    </div>
                </div>
                <div class="result-content">
                    <div class="result-description">${finding.description}</div>
                    <div class="masked-value">${finding.maskedValue}</div>
                    <div class="result-meta">
                        <div class="result-location">
                            <strong>📍 Location:</strong> ${finding.location}
                        </div>
                    </div>
                    <div class="result-recommendation">
                        <strong>💡 Recommendation:</strong> ${getSecretRecommendation(finding.type)}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    

}

/**
 * Display auth results
 */
function displayAuthResults(findings) {
    const container = document.getElementById('authResults');

    let html = '';

    // Display summary
    html += `
        <div class="result-card">
            <div class="result-header">
                <div class="result-title">📊 Summary</div>
                <span class="badge badge-info">INFO</span>
            </div>
            <div class="result-content">
                <div class="result-meta">
                    <div>Total Cookies: ${findings.summary.totalCookies}</div>
                    <div>Secure: ${findings.summary.secureCookies}</div>
                    <div>Insecure: ${findings.summary.insecureCookies}</div>
                    <div>JWT Tokens: ${findings.summary.totalJWTs}</div>
                </div>
            </div>
        </div>
    `;

    // Display cookie findings
    if (findings.cookies.length > 0) {
        findings.cookies.forEach(cookie => {
            if (cookie.issues.length > 0) {
                const statusClass = cookie.status.toLowerCase();
                const severityClass = cookie.severity ? `severity-${cookie.severity}` : '';

                html += `
                    <div class="result-card">
                        <div class="result-header">
                            <div class="result-title">🍪 ${cookie.name}</div>
                            <div>
                                <span class="badge badge-${statusClass}">${cookie.status}</span>
                                ${cookie.severity ? `<span class="severity-badge ${severityClass}">${cookie.severity}</span>` : ''}
                            </div>
                        </div>
                        <div class="result-content">
                            <div class="result-meta">
                                <div>Secure: ${cookie.secure ? '✅' : '❌'}</div>
                                <div>HttpOnly: ${cookie.httpOnly ? '✅' : '❌'}</div>
                                <div>SameSite: ${cookie.sameSite || 'none'}</div>
                                <div>Type: ${cookie.type}</div>
                            </div>
                            ${cookie.issues.length > 0 ? `
                                <div class="result-recommendation">
                                    <strong>⚠️ Issues:</strong>
                                    <ul>
                                        ${cookie.issues.map(issue => `
                                            <li><strong>${issue.flag}:</strong> ${issue.issue} - ${issue.recommendation}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        });
    }

    // Display JWT findings
    if (findings.jwts.length > 0) {
        findings.jwts.forEach(jwt => {
            const severityClass = jwt.analysis.severity ? `severity-${jwt.analysis.severity}` : '';

            html += `
                <div class="result-card">
                    <div class="result-header">
                        <div class="result-title">🔑 JWT Token</div>
                        <div>
                            ${jwt.analysis.severity ? `<span class="severity-badge ${severityClass}">${jwt.analysis.severity}</span>` : ''}
                        </div>
                    </div>
                    <div class="result-content">
                        <div class="result-meta">
                            <div><strong>Location:</strong> ${jwt.location}</div>
                            ${jwt.analysis.algorithm ? `<div><strong>Algorithm:</strong> ${jwt.analysis.algorithm}</div>` : ''}
                            ${jwt.analysis.expiresAt ? `<div><strong>Expires:</strong> ${new Date(jwt.analysis.expiresAt).toLocaleString()}</div>` : ''}
                        </div>
                        ${jwt.analysis.issues && jwt.analysis.issues.length > 0 ? `
                            <div class="result-recommendation">
                                <strong>⚠️ Issues:</strong>
                                <ul>
                                    ${jwt.analysis.issues.map(issue => `
                                        <li>${issue.issue} - ${issue.recommendation}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }

    if (html === '') {
        html = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-text">No authentication issues found!</div>
            </div>
        `;
    }

    container.innerHTML = html;
    

}

/**
 * Show error message
 */
function showError(tab, message) {
    const container = document.getElementById(`${tab}Results`);
    container.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <div class="result-title">❌ Error</div>
                <span class="badge badge-fail">ERROR</span>
            </div>
            <div class="result-content">
                <div class="result-description">${escapeHtml(message)}</div>
            </div>
        </div>
    `;
}

/**
 * Clear all results
 */
async function clearResults() {
    currentResults = {
        headers: [],
        secrets: [],
        auth: []
    };

    document.getElementById('headersResults').innerHTML = '';
    document.getElementById('secretsResults').innerHTML = '';
    document.getElementById('authResults').innerHTML = '';

    // Clear background data
    await chrome.runtime.sendMessage({
        action: 'clearData',
        tabId: currentTab.id
    });
}

/**
 * Export results
 */
function exportResults(format) {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const results = currentResults[activeTab];

    if (!results || results.length === 0) {
        alert('No results to export. Please run a scan first.');
        return;
    }

    switch (format) {
        case 'json':
            exportAsJSON(activeTab, results);
            break;
        case 'txt':
            exportAsTXT(activeTab, results);
            break;
        case 'pdf':
            exportAsPDF(activeTab, results);
            break;
    }
}

/**
 * Export as JSON
 */
function exportAsJSON(tab, results) {
    const data = {
        tool: 'AppSec Inspector',
        version: '1.0.0',
        scan: tab,
        url: currentTab.url,
        timestamp: new Date().toISOString(),
        results: results
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, `appsec-inspector-${tab}-${Date.now()}.json`);
}

/**
 * Export as TXT
 */
function exportAsTXT(tab, results) {
    let text = `AppSec Inspector Report\n`;
    text += `======================\n\n`;
    text += `Scan Type: ${tab.toUpperCase()}\n`;
    text += `URL: ${currentTab.url}\n`;
    text += `Date: ${new Date().toLocaleString()}\n`;
    text += `Total Findings: ${Array.isArray(results) ? results.length : Object.keys(results).length}\n\n`;
    text += `======================\n\n`;

    if (tab === 'headers' && Array.isArray(results)) {
        results.forEach((finding, index) => {
            text += `Finding #${index + 1}\n`;
            text += `Header: ${finding.header}\n`;
            text += `Status: ${finding.status}\n`;
            text += `Severity: ${finding.severity || 'N/A'}\n`;
            text += `Description: ${finding.description}\n`;
            if (finding.value) text += `Value: ${finding.value}\n`;
            if (finding.recommendation) text += `Recommendation: ${finding.recommendation}\n`;
            text += `\n`;
        });
    } else if (tab === 'secrets' && Array.isArray(results)) {
        results.forEach((finding, index) => {
            text += `Finding #${index + 1}\n`;
            text += `Type: ${finding.type}\n`;
            text += `Severity: ${finding.severity}\n`;
            text += `Location: ${finding.location}\n`;
            text += `Masked Value: ${finding.maskedValue}\n`;
            text += `\n`;
        });
    } else if (tab === 'auth') {
        text += `Cookie Analysis:\n`;
        text += `Total Cookies: ${results.summary.totalCookies}\n`;
        text += `Secure Cookies: ${results.summary.secureCookies}\n`;
        text += `Insecure Cookies: ${results.summary.insecureCookies}\n\n`;

        if (results.cookies) {
            results.cookies.forEach((cookie, index) => {
                if (cookie.issues.length > 0) {
                    text += `Cookie #${index + 1}: ${cookie.name}\n`;
                    text += `Status: ${cookie.status}\n`;
                    text += `Severity: ${cookie.severity}\n`;
                    cookie.issues.forEach(issue => {
                        text += `  - ${issue.flag}: ${issue.issue}\n`;
                    });
                    text += `\n`;
                }
            });
        }
    }

    const blob = new Blob([text], { type: 'text/plain' });
    downloadFile(blob, `appsec-inspector-${tab}-${Date.now()}.txt`);
}

/**
 * Export as PDF (simplified - creates HTML and prints)
 */
function exportAsPDF(tab, results) {
    // Create a new window with printable content
    const printWindow = window.open('', '_blank');

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>AppSec Inspector Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #667eea; }
                h2 { color: #4a5568; margin-top: 20px; }
                .finding { border: 1px solid #e2e8f0; padding: 15px; margin: 10px 0; border-radius: 8px; }
                .header { background: #f7fafc; padding: 10px; margin-bottom: 10px; }
                .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; }
                .badge-pass { background: #c6f6d5; color: #22543d; }
                .badge-warn { background: #feebc8; color: #7c2d12; }
                .badge-fail { background: #fed7d7; color: #742a2a; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <h1>🔒 AppSec Inspector Report</h1>
            <div class="header">
                <p><strong>Scan Type:</strong> ${tab.toUpperCase()}</p>
                <p><strong>URL:</strong> ${currentTab.url}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Total Findings:</strong> ${Array.isArray(results) ? results.length : Object.keys(results).length}</p>
            </div>
            <h2>Findings</h2>
    `;

    if (tab === 'headers' && Array.isArray(results)) {
        results.forEach((finding, index) => {
            html += `
                <div class="finding">
                    <h3>${index + 1}. ${finding.header} <span class="badge badge-${finding.status.toLowerCase()}">${finding.status}</span></h3>
                    <p><strong>Description:</strong> ${finding.description}</p>
                    ${finding.value ? `<p><strong>Value:</strong> ${escapeHtml(finding.value)}</p>` : ''}
                    ${finding.recommendation ? `<p><strong>Recommendation:</strong> ${finding.recommendation}</p>` : ''}
                </div>
            `;
        });
    }

    html += `
            <div class="no-print" style="margin-top: 30px;">
                <button onclick="window.print()">Print / Save as PDF</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
}

/**
 * Share results
 */
function shareResults() {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const results = currentResults[activeTab];

    if (!results || (Array.isArray(results) && results.length === 0)) {
        alert('No results to share. Please run a scan first.');
        return;
    }

    // Create shareable summary
    const summary = `I just scanned ${currentTab.url} with AppSec Inspector and found ${Array.isArray(results) ? results.length : Object.keys(results).length} security findings!`;

    // Show share options
    const shareText = encodeURIComponent(summary);
    const shareUrl = encodeURIComponent(currentTab.url);

    const shareOptions = `
        <div class="modal active" id="shareModal">
            <div class="modal-content glass-effect" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>Share Results</h2>
                    <button onclick="document.getElementById('shareModal').remove()" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 20px;">Share your security findings:</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" class="action-btn primary-btn" style="text-decoration: none; text-align: center;">
                            🐦 Share on Twitter
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" class="action-btn primary-btn" style="text-decoration: none; text-align: center;">
                            💼 Share on LinkedIn
                        </a>
                        <button onclick="copyToClipboard('${summary.replace(/'/g, "\\'")}'); alert('Copied to clipboard!');" class="action-btn secondary-btn">
                            📋 Copy Summary
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', shareOptions);
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

/**
 * Download file
 */
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Toggle theme
 */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('themeIcon').textContent = currentTheme === 'light' ? '🌙' : '☀️';

    // Save theme preference
    chrome.storage.local.set({ theme: currentTheme });
}

/**
 * Load saved theme
 */
async function loadTheme() {
    const { theme } = await chrome.storage.local.get('theme');
    currentTheme = theme || 'dark'; // Default to dark
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('themeIcon').textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

/**
 * Check if welcome modal should be shown
 */
async function checkWelcomeModal() {
    const { dontShowWelcome } = await chrome.storage.local.get('dontShowWelcome');
    if (!dontShowWelcome) {
        showWelcomeModal();
    }
}

/**
 * Show welcome modal
 */
function showWelcomeModal() {
    document.getElementById('welcomeModal').classList.add('active');
}

/**
 * Close welcome modal
 */
async function closeWelcomeModal() {
    const dontShow = document.getElementById('dontShowAgain').checked;
    if (dontShow) {
        await chrome.storage.local.set({ dontShowWelcome: true });
    }
    document.getElementById('welcomeModal').classList.remove('active');
}

/**
 * Show how-to modal
 */
function showHowToModal() {
    document.getElementById('howToModal').classList.add('active');
}

/**
 * Close how-to modal
 */
function closeHowToModal() {
    document.getElementById('howToModal').classList.remove('active');
}

/**
 * Show privacy policy
 */
function showPrivacyPolicy() {
    const modal = `
        <div class="modal active" id="privacyModal">
            <div class="modal-content glass-effect">
                <div class="modal-header">
                    <h2>Privacy Policy</h2>
                    <button onclick="document.getElementById('privacyModal').remove()" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <h3>Data Collection</h3>
                    <p>AppSec Inspector does NOT collect, store, or transmit any data. All analysis is performed locally in your browser.</p>
                    
                    <h3>What We Access</h3>
                    <ul>
                        <li>HTTP headers from the current page (read-only)</li>
                        <li>Page DOM and JavaScript (read-only)</li>
                        <li>Cookies for the current domain (read-only)</li>
                        <li>Browser storage (localStorage, sessionStorage) (read-only)</li>
                    </ul>
                    
                    <h3>What We DON'T Do</h3>
                    <ul>
                        <li>Send data to external servers</li>
                        <li>Track your browsing history</li>
                        <li>Collect analytics or telemetry</li>
                        <li>Modify page content</li>
                        <li>Inject scripts or payloads</li>
                    </ul>
                    
                    <h3>Your Data</h3>
                    <p>All scan results are stored temporarily in your browser's memory and are cleared when you close the extension or clear results.</p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
}

/**
 * Show support
 */
function showSupport() {
    const modal = `
        <div class="modal active" id="supportModal">
            <div class="modal-content glass-effect">
                <div class="modal-header">
                    <h2>Support</h2>
                    <button onclick="document.getElementById('supportModal').remove()" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <h3>Need Help?</h3>
                    <p>If you encounter any issues or have questions:</p>
                    <ul>
                        <li>Check the "How to Use" guide (? button)</li>
                        <li>Report issues on GitHub</li>
                        <li>Contact: support@appsec-inspector.com</li>
                    </ul>
                    
                    <h3>Disclaimer</h3>
                    <p>This tool is for security auditing purposes only. Use responsibly and only on applications you have permission to test.</p>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Get secret recommendation
 */
function getSecretRecommendation(type) {
    const recommendations = {
        'JWT Token': 'Store JWT tokens in HttpOnly cookies. Never expose in client-side code.',
        'AWS Access Key': 'Immediately rotate this key. Use IAM roles instead of hardcoded credentials.',
        'Google API Key': 'Restrict API key by IP/referrer. Rotate if exposed.',
        'Stripe Secret Key': 'CRITICAL: Rotate immediately. Use environment variables.',
        'GitHub Token': 'Revoke this token immediately. Use GitHub Apps where possible.',
        'Private Key': 'CRITICAL: Generate new key pair. Use HSM for production.',
        'Hardcoded Password': 'Remove hardcoded password. Use secure secret management.',
        'Generic API Key': 'Move to environment variables. Implement key rotation.'
    };

    return recommendations[type] || 'Secure this credential using proper secret management.';
}

/**
 * Remove duplicate findings
 */
function removeDuplicateFindings(findings) {
    const seen = new Set();
    return findings.filter(finding => {
        const key = `${finding.type}-${finding.maskedValue}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

/**
 * Update security score display
 */
function updateSecurityScore() {
    const scoreData = calculateSecurityScore(currentResults);
    
    // Show score card
    document.getElementById('scoreCard').classList.remove('hidden');
    
    // Update score number
    document.getElementById('scoreNumber').textContent = scoreData.score;
    
    // Update grade
    const gradeLetter = document.getElementById('gradeLetter');
    gradeLetter.textContent = scoreData.grade;
    gradeLetter.style.color = getGradeColor(scoreData.grade);
    
    // Update summary
    document.getElementById('scoreSummary').textContent = scoreData.summary;
    
    // Update breakdown
    document.getElementById('scoreBreakdown').classList.remove('hidden');
    const headersPercent = Math.round((scoreData.breakdown.headers.score / scoreData.breakdown.headers.max) * 100);
    const secretsPercent = Math.round((scoreData.breakdown.secrets.score / scoreData.breakdown.secrets.max) * 100);
    const authPercent = Math.round((scoreData.breakdown.auth.score / scoreData.breakdown.auth.max) * 100);
    
    document.getElementById('headersBreakdown').textContent = headersPercent + '%';
    document.getElementById('secretsBreakdown').textContent = secretsPercent + '%';
    document.getElementById('authBreakdown').textContent = authPercent + '%';
}

/**
 * Add fix snippets to header result card
 */
function addFixSnippets(headerName, resultElement) {
    const snippets = getFixSnippets(headerName);
    if (!snippets) return;
    
    const fixDiv = document.createElement('div');
    fixDiv.className = 'fix-snippets';
    
    const snippetId = 'snippet-' + headerName.replace(/[^a-z0-9]/g, '-');
    
    fixDiv.innerHTML = `
        <div class="fix-snippets-header">
            <div class="fix-snippets-title">
                <span></span>
                <span>Quick Fix</span>
            </div>
        </div>
        <div class="platform-tabs">
            <button class="platform-tab active" data-platform="nginx" data-snippet-id="{snippetId}">Nginx</button>
            <button class="platform-tab" data-platform="apache" data-snippet-id="{snippetId}">Apache</button>
            <button class="platform-tab" data-platform="express" data-snippet-id="{snippetId}">Express</button>
            <button class="platform-tab" data-platform="spring" data-snippet-id="{snippetId}">Spring</button>
        </div>
        <div class="code-snippet">
            <button class="copy-btn" onclick="copyFixSnippet(this)">
                <span></span> Copy
            </button>
            <code id="{snippetId}">{escapeHtml(snippets.nginx)}</code>
        </div>
    `;
    
    // Add platform switching
    fixDiv.querySelectorAll('.platform-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const parentFix = tab.closest('.fix-snippets');
            parentFix.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const platform = tab.dataset.platform;
            const codeElement = parentFix.querySelector('code');
            codeElement.textContent = snippets[platform];
        });
    });
    
    resultElement.appendChild(fixDiv);
}

/**
 * Copy fix snippet to clipboard
 */
function copyFixSnippet(button) {
    const code = button.parentElement.querySelector('code').textContent;
    navigator.clipboard.writeText(code);
    
    button.innerHTML = '<span></span> Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
        button.innerHTML = '<span></span> Copy';
        button.classList.remove('copied');
    }, 2000);
}
