/**
 * Token & Secret Leak Detector Module
 * Scans DOM, JavaScript, and network requests for exposed secrets
 */

// Import regex patterns (will be loaded in browser context)
// const { scanForSecrets, maskSecret } = require('../utils/regex.js');

/**
 * Scan DOM for exposed secrets
 * @param {Document} document - DOM document
 * @returns {Array} Array of findings
 */
function scanDOM(document) {
    const findings = [];

    try {
        // Get all text content from DOM
        const bodyText = document.body ? document.body.innerText : '';
        const htmlContent = document.documentElement ? document.documentElement.innerHTML : '';

        // Scan visible text
        if (bodyText) {
            const textFindings = scanForSecrets(bodyText, 'DOM - Visible Text');
            findings.push(...textFindings);
        }

        // Scan HTML attributes
        const elements = document.querySelectorAll('[data-*], [value], [href], [src]');
        elements.forEach(element => {
            // Check data attributes
            for (const attr of element.attributes) {
                if (attr.name.startsWith('data-') || attr.name === 'value') {
                    const attrFindings = scanForSecrets(attr.value, `DOM - ${element.tagName}.${attr.name}`);
                    findings.push(...attrFindings);
                }
            }
        });

        // Scan inline scripts
        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach((script, index) => {
            const scriptFindings = scanForSecrets(script.textContent, `DOM - Inline Script #${index + 1}`);
            findings.push(...scriptFindings);
        });

        // Scan meta tags
        const metaTags = document.querySelectorAll('meta[content]');
        metaTags.forEach(meta => {
            const metaFindings = scanForSecrets(meta.content, `DOM - Meta Tag (${meta.name || meta.property})`);
            findings.push(...metaFindings);
        });

    } catch (error) {
        console.error('Error scanning DOM:', error);
    }

    return findings;
}

/**
 * Scan localStorage for exposed secrets
 * @returns {Array} Array of findings
 */
function scanLocalStorage() {
    const findings = [];

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);

            if (value) {
                const storageFindings = scanForSecrets(value, `LocalStorage - ${key}`);
                findings.push(...storageFindings);
            }
        }
    } catch (error) {
        console.error('Error scanning localStorage:', error);
    }

    return findings;
}

/**
 * Scan sessionStorage for exposed secrets
 * @returns {Array} Array of findings
 */
function scanSessionStorage() {
    const findings = [];

    try {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);

            if (value) {
                const storageFindings = scanForSecrets(value, `SessionStorage - ${key}`);
                findings.push(...storageFindings);
            }
        }
    } catch (error) {
        console.error('Error scanning sessionStorage:', error);
    }

    return findings;
}

/**
 * Scan JavaScript files loaded on the page
 * @param {Document} document - DOM document
 * @returns {Promise<Array>} Promise resolving to array of findings
 */
async function scanJavaScriptFiles(document) {
    const findings = [];

    try {
        const scripts = document.querySelectorAll('script[src]');
        const scriptUrls = Array.from(scripts).map(s => s.src).filter(src => src);

        // Limit to first 10 scripts to avoid performance issues
        const scriptsToScan = scriptUrls.slice(0, 10);

        for (const url of scriptsToScan) {
            try {
                // Only scan same-origin scripts for security
                if (url.startsWith(window.location.origin)) {
                    const response = await fetch(url);
                    const content = await response.text();

                    const scriptFindings = scanForSecrets(content, `JS File - ${url.split('/').pop()}`);
                    findings.push(...scriptFindings);
                }
            } catch (error) {
                // Skip scripts that can't be fetched
                console.warn(`Could not scan script: ${url}`, error);
            }
        }
    } catch (error) {
        console.error('Error scanning JavaScript files:', error);
    }

    return findings;
}

/**
 * Scan network requests (from background script)
 * @param {Array} requests - Array of captured network requests
 * @returns {Array} Array of findings
 */
function scanNetworkRequests(requests) {
    const findings = [];

    try {
        requests.forEach(request => {
            // Scan request URL
            if (request.url) {
                const urlFindings = scanForSecrets(request.url, `Network - Request URL`);
                findings.push(...urlFindings);
            }

            // Scan request headers
            if (request.requestHeaders) {
                request.requestHeaders.forEach(header => {
                    const headerFindings = scanForSecrets(
                        `${header.name}: ${header.value}`,
                        `Network - Request Header (${header.name})`
                    );
                    findings.push(...headerFindings);
                });
            }

            // Scan response headers
            if (request.responseHeaders) {
                request.responseHeaders.forEach(header => {
                    const headerFindings = scanForSecrets(
                        `${header.name}: ${header.value}`,
                        `Network - Response Header (${header.name})`
                    );
                    findings.push(...headerFindings);
                });
            }

            // Scan request body (if available)
            if (request.requestBody) {
                const bodyFindings = scanForSecrets(
                    JSON.stringify(request.requestBody),
                    `Network - Request Body`
                );
                findings.push(...bodyFindings);
            }

            // Scan response body (if available)
            if (request.responseBody) {
                const bodyFindings = scanForSecrets(
                    request.responseBody,
                    `Network - Response Body`
                );
                findings.push(...bodyFindings);
            }
        });
    } catch (error) {
        console.error('Error scanning network requests:', error);
    }

    return findings;
}

/**
 * Perform comprehensive secret scan
 * @param {Object} options - Scan options
 * @returns {Promise<Object>} Scan results
 */
async function performSecretScan(options = {}) {
    const {
        scanDom = true,
        scanStorage = true,
        scanScripts = true,
        scanNetwork = false,
        networkRequests = []
    } = options;

    const allFindings = [];
    const errors = [];

    try {
        // Scan DOM
        if (scanDom) {
            try {
                const domFindings = scanDOM(document);
                allFindings.push(...domFindings);
            } catch (error) {
                errors.push({ source: 'DOM', error: error.message });
            }
        }

        // Scan Storage
        if (scanStorage) {
            try {
                const localStorageFindings = scanLocalStorage();
                const sessionStorageFindings = scanSessionStorage();
                allFindings.push(...localStorageFindings, ...sessionStorageFindings);
            } catch (error) {
                errors.push({ source: 'Storage', error: error.message });
            }
        }

        // Scan JavaScript Files
        if (scanScripts) {
            try {
                const scriptFindings = await scanJavaScriptFiles(document);
                allFindings.push(...scriptFindings);
            } catch (error) {
                errors.push({ source: 'Scripts', error: error.message });
            }
        }

        // Scan Network Requests
        if (scanNetwork && networkRequests.length > 0) {
            try {
                const networkFindings = scanNetworkRequests(networkRequests);
                allFindings.push(...networkFindings);
            } catch (error) {
                errors.push({ source: 'Network', error: error.message });
            }
        }

        // Remove duplicates based on masked value and location
        const uniqueFindings = removeDuplicateFindings(allFindings);

        return {
            success: true,
            findings: uniqueFindings,
            totalScanned: {
                dom: scanDom,
                storage: scanStorage,
                scripts: scanScripts,
                network: scanNetwork
            },
            errors: errors.length > 0 ? errors : null,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        return {
            success: false,
            findings: [],
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Remove duplicate findings
 * @param {Array} findings - Array of findings
 * @returns {Array} Deduplicated findings
 */
function removeDuplicateFindings(findings) {
    const seen = new Set();
    const unique = [];

    findings.forEach(finding => {
        const key = `${finding.type}-${finding.maskedValue}-${finding.location}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(finding);
        }
    });

    return unique;
}

/**
 * Generate secret scan summary
 * @param {Array} findings - Array of findings
 * @returns {Object} Summary statistics
 */
function generateSecretSummary(findings) {
    const summary = {
        total: findings.length,
        byType: {},
        byLocation: {},
        bySeverity: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
        }
    };

    findings.forEach(finding => {
        // Count by type
        summary.byType[finding.type] = (summary.byType[finding.type] || 0) + 1;

        // Count by location
        const locationCategory = finding.location.split(' - ')[0];
        summary.byLocation[locationCategory] = (summary.byLocation[locationCategory] || 0) + 1;

        // Count by severity
        if (finding.severity) {
            summary.bySeverity[finding.severity]++;
        }
    });

    return summary;
}

// Functions are globally available in browser context
// scanDOM, scanLocalStorage, scanSessionStorage, scanJavaScriptFiles, scanNetworkRequests, performSecretScan, generateSecretSummary
