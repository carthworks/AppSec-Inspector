/**
 * Content Script
 * Runs in the context of web pages to scan DOM and storage
 */

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request.action);

    switch (request.action) {
        case 'ping':
            sendResponse({ success: true });
            return false;

        case 'scanDOM':
            handleScanDOM(sendResponse);
            return true; // Keep channel open for async response

        case 'scanStorage':
            handleScanStorage(sendResponse);
            return false;

        case 'getPageInfo':
            handleGetPageInfo(sendResponse);
            return false;

        default:
            sendResponse({ error: 'Unknown action' });
            return false;
    }
});

/**
 * Handle DOM scanning request
 */
async function handleScanDOM(sendResponse) {
    try {
        const domData = {
            // Get page HTML
            html: document.documentElement.outerHTML,

            // Get all text content
            bodyText: document.body ? document.body.innerText : '',

            // Get inline scripts
            inlineScripts: Array.from(document.querySelectorAll('script:not([src])')).map((script, index) => ({
                index,
                content: script.textContent,
                length: script.textContent.length
            })),

            // Get external script URLs
            externalScripts: Array.from(document.querySelectorAll('script[src]')).map(script => script.src),

            // Get data attributes
            dataAttributes: [],

            // Get meta tags
            metaTags: Array.from(document.querySelectorAll('meta[content]')).map(meta => ({
                name: meta.name || meta.property,
                content: meta.content
            }))
        };

        // Collect data attributes and value attributes
        // Note: Can't use [data-*] selector, so we get all elements and filter
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            for (const attr of element.attributes) {
                if (attr.name.startsWith('data-') || attr.name === 'value') {
                    domData.dataAttributes.push({
                        element: element.tagName,
                        attribute: attr.name,
                        value: attr.value,
                        length: attr.value.length
                    });
                }
            }
        });

        sendResponse({
            success: true,
            data: domData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error scanning DOM:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

/**
 * Handle storage scanning request
 */
function handleScanStorage(sendResponse) {
    try {
        const storageData = {
            localStorage: {},
            sessionStorage: {}
        };

        // Get localStorage
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                storageData.localStorage[key] = localStorage.getItem(key);
            }
        } catch (error) {
            console.warn('Could not access localStorage:', error);
        }

        // Get sessionStorage
        try {
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                storageData.sessionStorage[key] = sessionStorage.getItem(key);
            }
        } catch (error) {
            console.warn('Could not access sessionStorage:', error);
        }

        sendResponse({
            success: true,
            data: storageData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error scanning storage:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

/**
 * Handle page info request
 */
function handleGetPageInfo(sendResponse) {
    try {
        const pageInfo = {
            url: window.location.href,
            title: document.title,
            origin: window.location.origin,
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            pathname: window.location.pathname,
            isHTTPS: window.location.protocol === 'https:',
            hasServiceWorker: 'serviceWorker' in navigator,
            userAgent: navigator.userAgent
        };

        sendResponse({
            success: true,
            data: pageInfo
        });

    } catch (error) {
        console.error('Error getting page info:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

console.log('AppSec Inspector content script loaded');
