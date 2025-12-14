/**
 * Background Service Worker
 * Handles header capture, network monitoring, and message routing
 */

// Store captured headers and network requests
let capturedData = {
    headers: {},
    requests: [],
    tabId: null,
    url: null
};

// Listen for web requests to capture headers
chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        // Only capture main_frame requests
        if (details.type === 'main_frame' && details.tabId >= 0) {
            const headers = {};

            if (details.responseHeaders) {
                details.responseHeaders.forEach(header => {
                    headers[header.name.toLowerCase()] = header.value;
                });
            }

            capturedData.headers[details.tabId] = {
                url: details.url,
                headers: headers,
                statusCode: details.statusCode,
                timestamp: Date.now()
            };
        }

        // Capture all requests for secret scanning
        if (details.tabId >= 0) {
            const request = {
                url: details.url,
                method: details.method,
                type: details.type,
                responseHeaders: details.responseHeaders,
                statusCode: details.statusCode,
                timestamp: Date.now()
            };

            // Limit stored requests to prevent memory issues
            if (!capturedData.requests[details.tabId]) {
                capturedData.requests[details.tabId] = [];
            }

            capturedData.requests[details.tabId].push(request);

            // Keep only last 100 requests per tab
            if (capturedData.requests[details.tabId].length > 100) {
                capturedData.requests[details.tabId].shift();
            }
        }
    },
    { urls: ['<all_urls>'] },
    ['responseHeaders']
);

// Capture request headers
chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        if (details.tabId >= 0) {
            // Find the request in our stored data and add request headers
            const tabRequests = capturedData.requests[details.tabId];
            if (tabRequests && tabRequests.length > 0) {
                const lastRequest = tabRequests[tabRequests.length - 1];
                if (lastRequest.url === details.url) {
                    lastRequest.requestHeaders = details.requestHeaders;
                }
            }
        }
    },
    { urls: ['<all_urls>'] },
    ['requestHeaders']
);

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request.action);

    switch (request.action) {
        case 'getHeaders':
            handleGetHeaders(request, sendResponse);
            return true; // Keep channel open for async response

        case 'getCookies':
            handleGetCookies(request, sendResponse);
            return true;

        case 'getNetworkRequests':
            handleGetNetworkRequests(request, sendResponse);
            return true;

        case 'clearData':
            handleClearData(request, sendResponse);
            return false;

        default:
            sendResponse({ error: 'Unknown action' });
            return false;
    }
});

/**
 * Handle getHeaders request
 */
function handleGetHeaders(request, sendResponse) {
    const tabId = request.tabId;

    if (!tabId) {
        sendResponse({ error: 'No tab ID provided' });
        return;
    }

    const headerData = capturedData.headers[tabId];

    if (!headerData) {
        sendResponse({
            error: 'No headers captured. Please refresh the page and try again.',
            headers: {},
            url: null
        });
        return;
    }

    sendResponse({
        success: true,
        headers: headerData.headers,
        url: headerData.url,
        statusCode: headerData.statusCode,
        timestamp: headerData.timestamp
    });
}

/**
 * Handle getCookies request
 */
async function handleGetCookies(request, sendResponse) {
    try {
        const url = request.url;

        if (!url) {
            sendResponse({ error: 'No URL provided' });
            return;
        }

        // Get all cookies for the URL
        const cookies = await chrome.cookies.getAll({ url });

        sendResponse({
            success: true,
            cookies,
            count: cookies.length
        });

    } catch (error) {
        console.error('Error getting cookies:', error);
        sendResponse({
            error: 'Failed to retrieve cookies: ' + error.message
        });
    }
}

/**
 * Handle getNetworkRequests request
 */
function handleGetNetworkRequests(request, sendResponse) {
    const tabId = request.tabId;

    if (!tabId) {
        sendResponse({ error: 'No tab ID provided' });
        return;
    }

    const requests = capturedData.requests[tabId] || [];

    sendResponse({
        success: true,
        requests,
        count: requests.length
    });
}

/**
 * Handle clearData request
 */
function handleClearData(request, sendResponse) {
    const tabId = request.tabId;

    if (tabId) {
        // Clear data for specific tab
        delete capturedData.headers[tabId];
        delete capturedData.requests[tabId];
    } else {
        // Clear all data
        capturedData = {
            headers: {},
            requests: [],
            tabId: null,
            url: null
        };
    }

    sendResponse({ success: true });
}

// Clean up data when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
    delete capturedData.headers[tabId];
    delete capturedData.requests[tabId];
});

// Clean up old data periodically (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    // Clean old headers
    Object.keys(capturedData.headers).forEach(tabId => {
        const data = capturedData.headers[tabId];
        if (now - data.timestamp > maxAge) {
            delete capturedData.headers[tabId];
        }
    });

    // Clean old requests
    Object.keys(capturedData.requests).forEach(tabId => {
        const requests = capturedData.requests[tabId];
        capturedData.requests[tabId] = requests.filter(req =>
            now - req.timestamp <= maxAge
        );

        if (capturedData.requests[tabId].length === 0) {
            delete capturedData.requests[tabId];
        }
    });
}, 5 * 60 * 1000);

console.log('AppSec Inspector background service worker initialized');
