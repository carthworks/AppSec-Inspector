/**
 * Security Headers Inspector Module
 * Analyzes HTTP response headers for security best practices
 */

/**
 * Security header configurations and expectations
 */
const SECURITY_HEADERS = {
    'content-security-policy': {
        name: 'Content-Security-Policy',
        required: true,
        severity: 'high',
        description: 'Defines approved sources of content that browsers should load',
        goodPractices: [
            "default-src 'self'",
            "script-src 'self'",
            "object-src 'none'",
            "base-uri 'self'"
        ],
        recommendation: 'Implement a strict Content Security Policy to prevent XSS and injection attacks. Start with a restrictive policy and gradually relax as needed.',
        references: ['OWASP A03:2021 - Injection', 'OWASP A05:2021 - Security Misconfiguration']
    },
    'strict-transport-security': {
        name: 'Strict-Transport-Security',
        required: true,
        severity: 'high',
        description: 'Forces browsers to use HTTPS connections only',
        goodPractices: [
            'max-age=31536000',
            'includeSubDomains',
            'preload'
        ],
        recommendation: 'Set HSTS with max-age of at least 1 year (31536000 seconds). Include subdomains and consider preload list submission.',
        references: ['OWASP A02:2021 - Cryptographic Failures']
    },
    'x-frame-options': {
        name: 'X-Frame-Options',
        required: true,
        severity: 'medium',
        description: 'Prevents clickjacking attacks by controlling iframe embedding',
        goodPractices: [
            'DENY',
            'SAMEORIGIN'
        ],
        recommendation: 'Set to DENY or SAMEORIGIN to prevent clickjacking. Use CSP frame-ancestors for more granular control.',
        references: ['OWASP A03:2021 - Injection']
    },
    'x-content-type-options': {
        name: 'X-Content-Type-Options',
        required: true,
        severity: 'medium',
        description: 'Prevents MIME-type sniffing',
        goodPractices: [
            'nosniff'
        ],
        recommendation: 'Always set to "nosniff" to prevent browsers from MIME-sniffing responses.',
        references: ['OWASP A05:2021 - Security Misconfiguration']
    },
    'referrer-policy': {
        name: 'Referrer-Policy',
        required: true,
        severity: 'medium',
        description: 'Controls how much referrer information is included with requests',
        goodPractices: [
            'no-referrer',
            'strict-origin-when-cross-origin',
            'same-origin'
        ],
        recommendation: 'Use "strict-origin-when-cross-origin" or "no-referrer" to prevent information leakage.',
        references: ['OWASP A02:2021 - Cryptographic Failures']
    },
    'permissions-policy': {
        name: 'Permissions-Policy',
        required: false,
        severity: 'low',
        description: 'Controls which browser features and APIs can be used',
        goodPractices: [
            'geolocation=()',
            'microphone=()',
            'camera=()'
        ],
        recommendation: 'Disable unnecessary browser features to reduce attack surface.',
        references: ['OWASP A05:2021 - Security Misconfiguration']
    },
    'x-xss-protection': {
        name: 'X-XSS-Protection',
        required: false,
        severity: 'low',
        description: 'Legacy XSS protection (deprecated in favor of CSP)',
        goodPractices: [
            '0'
        ],
        recommendation: 'Set to "0" to disable legacy XSS filter. Use Content-Security-Policy instead.',
        references: ['OWASP A03:2021 - Injection']
    },
    'access-control-allow-origin': {
        name: 'Access-Control-Allow-Origin',
        required: false,
        severity: 'medium',
        description: 'CORS header controlling cross-origin access',
        goodPractices: [
            'specific-origin',
            'null (avoid)'
        ],
        recommendation: 'Avoid using "*" wildcard. Specify exact origins. Never use "*" with credentials.',
        references: ['OWASP A01:2021 - Broken Access Control']
    },
    'access-control-allow-credentials': {
        name: 'Access-Control-Allow-Credentials',
        required: false,
        severity: 'medium',
        description: 'Controls whether credentials are included in CORS requests',
        goodPractices: [
            'true (with specific origin only)'
        ],
        recommendation: 'Only use with specific origins, never with "*". Ensure proper authentication checks.',
        references: ['OWASP A07:2021 - Authentication Failures']
    }
};

/**
 * Analyze a single security header
 * @param {string} headerName - Header name (lowercase)
 * @param {string} headerValue - Header value
 * @returns {Object} Analysis result
 */
function analyzeHeader(headerName, headerValue) {
    const config = SECURITY_HEADERS[headerName.toLowerCase()];

    if (!config) {
        return null; // Not a security header we track
    }

    const result = {
        header: config.name,
        value: headerValue,
        status: 'PASS',
        severity: config.severity,
        description: config.description,
        recommendation: '',
        issues: [],
        owaspRefs: config.references
    };

    // Specific header analysis
    switch (headerName.toLowerCase()) {
        case 'content-security-policy':
            analyzeCSP(headerValue, result);
            break;
        case 'strict-transport-security':
            analyzeHSTS(headerValue, result);
            break;
        case 'x-frame-options':
            analyzeXFrameOptions(headerValue, result);
            break;
        case 'x-content-type-options':
            analyzeXContentTypeOptions(headerValue, result);
            break;
        case 'referrer-policy':
            analyzeReferrerPolicy(headerValue, result);
            break;
        case 'access-control-allow-origin':
            analyzeCORS(headerValue, result);
            break;
        default:
            // Generic check - header exists
            result.status = 'PASS';
            result.recommendation = config.recommendation;
    }

    return result;
}

/**
 * Analyze Content-Security-Policy header
 */
function analyzeCSP(value, result) {
    const directives = value.toLowerCase().split(';').map(d => d.trim());

    // Check for unsafe directives
    if (value.includes("'unsafe-inline'")) {
        result.issues.push("Contains 'unsafe-inline' which allows inline scripts");
        result.status = 'WARN';
    }

    if (value.includes("'unsafe-eval'")) {
        result.issues.push("Contains 'unsafe-eval' which allows eval()");
        result.status = 'WARN';
    }

    // Check for wildcard sources
    if (value.includes('*') && !value.includes('*.')) {
        result.issues.push('Contains wildcard (*) source which is too permissive');
        result.status = 'WARN';
    }

    // Check for important directives
    const hasDefaultSrc = directives.some(d => d.startsWith('default-src'));
    const hasScriptSrc = directives.some(d => d.startsWith('script-src'));

    if (!hasDefaultSrc && !hasScriptSrc) {
        result.issues.push('Missing default-src or script-src directive');
        result.status = 'WARN';
    }

    if (result.status === 'PASS') {
        result.recommendation = 'CSP is configured. Review directives to ensure they meet your security requirements.';
    } else {
        result.recommendation = SECURITY_HEADERS['content-security-policy'].recommendation;
    }
}

/**
 * Analyze Strict-Transport-Security header
 */
function analyzeHSTS(value, result) {
    const maxAgeMatch = value.match(/max-age=(\d+)/);

    if (!maxAgeMatch) {
        result.status = 'FAIL';
        result.issues.push('Missing max-age directive');
    } else {
        const maxAge = parseInt(maxAgeMatch[1]);
        const oneYear = 31536000;

        if (maxAge < oneYear) {
            result.status = 'WARN';
            result.issues.push(`max-age is ${maxAge} seconds (recommended: at least ${oneYear})`);
        }
    }

    if (!value.includes('includeSubDomains')) {
        result.status = result.status === 'FAIL' ? 'FAIL' : 'WARN';
        result.issues.push('Missing includeSubDomains directive');
    }

    result.recommendation = SECURITY_HEADERS['strict-transport-security'].recommendation;
}

/**
 * Analyze X-Frame-Options header
 */
function analyzeXFrameOptions(value, result) {
    const validValues = ['DENY', 'SAMEORIGIN'];
    const upperValue = value.toUpperCase().trim();

    if (!validValues.includes(upperValue) && !upperValue.startsWith('ALLOW-FROM')) {
        result.status = 'FAIL';
        result.issues.push(`Invalid value: ${value}`);
    } else if (upperValue.startsWith('ALLOW-FROM')) {
        result.status = 'WARN';
        result.issues.push('ALLOW-FROM is deprecated. Use CSP frame-ancestors instead');
    }

    result.recommendation = SECURITY_HEADERS['x-frame-options'].recommendation;
}

/**
 * Analyze X-Content-Type-Options header
 */
function analyzeXContentTypeOptions(value, result) {
    if (value.toLowerCase().trim() !== 'nosniff') {
        result.status = 'FAIL';
        result.issues.push(`Invalid value: ${value} (should be "nosniff")`);
    }

    result.recommendation = SECURITY_HEADERS['x-content-type-options'].recommendation;
}

/**
 * Analyze Referrer-Policy header
 */
function analyzeReferrerPolicy(value, result) {
    const validPolicies = [
        'no-referrer',
        'no-referrer-when-downgrade',
        'origin',
        'origin-when-cross-origin',
        'same-origin',
        'strict-origin',
        'strict-origin-when-cross-origin',
        'unsafe-url'
    ];

    const policy = value.toLowerCase().trim();

    if (!validPolicies.includes(policy)) {
        result.status = 'FAIL';
        result.issues.push(`Invalid policy: ${value}`);
    } else if (policy === 'unsafe-url' || policy === 'no-referrer-when-downgrade') {
        result.status = 'WARN';
        result.issues.push(`Policy "${value}" may leak sensitive information`);
    }

    result.recommendation = SECURITY_HEADERS['referrer-policy'].recommendation;
}

/**
 * Analyze CORS headers
 */
function analyzeCORS(value, result) {
    if (value === '*') {
        result.status = 'WARN';
        result.issues.push('Wildcard (*) allows any origin to access resources');
        result.recommendation = 'Specify exact allowed origins instead of using wildcard.';
    } else if (value === 'null') {
        result.status = 'FAIL';
        result.issues.push('"null" origin is a security risk');
        result.recommendation = 'Never allow "null" origin. Specify exact origins.';
    }
}

/**
 * Check for missing security headers
 * @param {Object} headers - Headers object
 * @returns {Array} Array of missing header findings
 */
function checkMissingHeaders(headers) {
    const findings = [];
    const headerKeys = Object.keys(headers).map(h => h.toLowerCase());

    for (const [key, config] of Object.entries(SECURITY_HEADERS)) {
        if (config.required && !headerKeys.includes(key)) {
            findings.push({
                header: config.name,
                value: null,
                status: 'FAIL',
                severity: config.severity,
                description: `Missing security header: ${config.name}`,
                recommendation: config.recommendation,
                issues: ['Header not present in response'],
                owaspRefs: config.references
            });
        }
    }

    return findings;
}

/**
 * Analyze all security headers
 * @param {Object} headers - Response headers object
 * @returns {Array} Array of findings
 */
function analyzeSecurityHeaders(headers) {
    const findings = [];

    // Analyze present headers
    for (const [name, value] of Object.entries(headers)) {
        const result = analyzeHeader(name, value);
        if (result) {
            findings.push(result);
        }
    }

    // Check for missing headers
    const missingHeaders = checkMissingHeaders(headers);
    findings.push(...missingHeaders);

    return findings;
}

// Functions are globally available in browser context
// SECURITY_HEADERS, analyzeHeader, analyzeSecurityHeaders, checkMissingHeaders
