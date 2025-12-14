/**
 * OWASP Top 10 mapping and reference guide
 * Maps security findings to OWASP categories with detailed information
 */

const OWASP_TOP_10_2021 = {
    A01: {
        id: 'A01:2021',
        name: 'Broken Access Control',
        description: 'Restrictions on what authenticated users are allowed to do are often not properly enforced.',
        risk: 'High',
        url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'
    },
    A02: {
        id: 'A02:2021',
        name: 'Cryptographic Failures',
        description: 'Failures related to cryptography which often lead to exposure of sensitive data.',
        risk: 'High',
        url: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'
    },
    A03: {
        id: 'A03:2021',
        name: 'Injection',
        description: 'Application is vulnerable to injection attacks such as SQL, NoSQL, OS command injection.',
        risk: 'High',
        url: 'https://owasp.org/Top10/A03_2021-Injection/'
    },
    A04: {
        id: 'A04:2021',
        name: 'Insecure Design',
        description: 'Missing or ineffective control design.',
        risk: 'Medium',
        url: 'https://owasp.org/Top10/A04_2021-Insecure_Design/'
    },
    A05: {
        id: 'A05:2021',
        name: 'Security Misconfiguration',
        description: 'Missing appropriate security hardening or improperly configured permissions.',
        risk: 'Medium',
        url: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
    },
    A06: {
        id: 'A06:2021',
        name: 'Vulnerable and Outdated Components',
        description: 'Using components with known vulnerabilities.',
        risk: 'Medium',
        url: 'https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/'
    },
    A07: {
        id: 'A07:2021',
        name: 'Identification and Authentication Failures',
        description: 'Confirmation of user identity, authentication, and session management is critical.',
        risk: 'High',
        url: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'
    },
    A08: {
        id: 'A08:2021',
        name: 'Software and Data Integrity Failures',
        description: 'Code and infrastructure that does not protect against integrity violations.',
        risk: 'Medium',
        url: 'https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/'
    },
    A09: {
        id: 'A09:2021',
        name: 'Security Logging and Monitoring Failures',
        description: 'Without logging and monitoring, breaches cannot be detected.',
        risk: 'Medium',
        url: 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'
    },
    A10: {
        id: 'A10:2021',
        name: 'Server-Side Request Forgery (SSRF)',
        description: 'SSRF flaws occur when a web application fetches a remote resource without validating the user-supplied URL.',
        risk: 'Medium',
        url: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/'
    }
};

/**
 * Security header to OWASP mapping
 */
const HEADER_OWASP_MAPPING = {
    'content-security-policy': {
        owasp: ['A03', 'A05'],
        category: 'Injection & Misconfiguration',
        description: 'CSP helps prevent XSS and other injection attacks'
    },
    'strict-transport-security': {
        owasp: ['A02', 'A05'],
        category: 'Cryptographic Failures & Misconfiguration',
        description: 'HSTS enforces secure HTTPS connections'
    },
    'x-frame-options': {
        owasp: ['A03', 'A05'],
        category: 'Injection & Misconfiguration',
        description: 'Prevents clickjacking attacks'
    },
    'x-content-type-options': {
        owasp: ['A05'],
        category: 'Security Misconfiguration',
        description: 'Prevents MIME-type sniffing'
    },
    'referrer-policy': {
        owasp: ['A02', 'A05'],
        category: 'Cryptographic Failures & Misconfiguration',
        description: 'Controls referrer information leakage'
    },
    'permissions-policy': {
        owasp: ['A05'],
        category: 'Security Misconfiguration',
        description: 'Controls browser features and APIs'
    },
    'access-control-allow-origin': {
        owasp: ['A01', 'A05'],
        category: 'Broken Access Control & Misconfiguration',
        description: 'CORS policy controls cross-origin access'
    },
    'access-control-allow-credentials': {
        owasp: ['A01', 'A07'],
        category: 'Access Control & Authentication',
        description: 'Controls credential sharing in CORS'
    }
};

/**
 * Secret type to OWASP mapping
 */
const SECRET_OWASP_MAPPING = {
    'JWT Token': {
        owasp: ['A02', 'A07'],
        category: 'Cryptographic Failures & Authentication',
        description: 'Exposed JWT tokens can lead to session hijacking'
    },
    'AWS Access Key': {
        owasp: ['A02', 'A05'],
        category: 'Cryptographic Failures & Misconfiguration',
        description: 'Exposed AWS credentials can lead to cloud resource compromise'
    },
    'AWS Secret Key': {
        owasp: ['A02', 'A05'],
        category: 'Cryptographic Failures & Misconfiguration',
        description: 'Critical AWS credential exposure'
    },
    'Google API Key': {
        owasp: ['A02', 'A05'],
        category: 'Cryptographic Failures & Misconfiguration',
        description: 'Exposed API keys can lead to unauthorized service access'
    },
    'Stripe Secret Key': {
        owasp: ['A02', 'A05'],
        category: 'Cryptographic Failures & Misconfiguration',
        description: 'Payment credential exposure - critical security issue'
    },
    'GitHub Token': {
        owasp: ['A02', 'A07'],
        category: 'Cryptographic Failures & Authentication',
        description: 'Source code and repository access compromise'
    },
    'Private Key': {
        owasp: ['A02'],
        category: 'Cryptographic Failures',
        description: 'Critical cryptographic key exposure'
    },
    'Hardcoded Password': {
        owasp: ['A02', 'A07'],
        category: 'Cryptographic Failures & Authentication',
        description: 'Hardcoded credentials violate security best practices'
    },
    'OAuth Access Token': {
        owasp: ['A02', 'A07'],
        category: 'Cryptographic Failures & Authentication',
        description: 'OAuth token exposure can lead to account takeover'
    },
    'Bearer Token': {
        owasp: ['A02', 'A07'],
        category: 'Cryptographic Failures & Authentication',
        description: 'Bearer token exposure enables unauthorized access'
    }
};

/**
 * Cookie security to OWASP mapping
 */
const COOKIE_OWASP_MAPPING = {
    'missing-secure': {
        owasp: ['A02', 'A05'],
        category: 'Cryptographic Failures & Misconfiguration',
        description: 'Cookies without Secure flag can be intercepted over HTTP'
    },
    'missing-httponly': {
        owasp: ['A03', 'A07'],
        category: 'Injection & Authentication',
        description: 'Cookies without HttpOnly flag are vulnerable to XSS attacks'
    },
    'missing-samesite': {
        owasp: ['A01', 'A05'],
        category: 'Broken Access Control & Misconfiguration',
        description: 'Cookies without SameSite are vulnerable to CSRF attacks'
    },
    'weak-samesite': {
        owasp: ['A01', 'A05'],
        category: 'Broken Access Control & Misconfiguration',
        description: 'SameSite=None increases CSRF attack surface'
    }
};

/**
 * Get OWASP references for a security finding
 * @param {Object} finding - Security finding object
 * @returns {Array} Array of relevant OWASP references
 */
function getOwaspReferences(finding) {
    let mapping;

    // Determine which mapping to use based on finding type
    if (finding.header) {
        mapping = HEADER_OWASP_MAPPING[finding.header.toLowerCase()];
    } else if (finding.type) {
        mapping = SECRET_OWASP_MAPPING[finding.type];
    } else if (finding.cookieIssue) {
        mapping = COOKIE_OWASP_MAPPING[finding.cookieIssue];
    }

    if (!mapping) {
        return [];
    }

    // Get full OWASP details
    const references = mapping.owasp.map(code => ({
        ...OWASP_TOP_10_2021[code],
        relevance: mapping.description
    }));

    return references;
}

/**
 * Generate OWASP compliance report
 * @param {Array} findings - Array of all security findings
 * @returns {Object} OWASP compliance summary
 */
function generateOwaspReport(findings) {
    const owaspCoverage = {};

    // Initialize all OWASP categories
    Object.keys(OWASP_TOP_10_2021).forEach(key => {
        owaspCoverage[key] = {
            ...OWASP_TOP_10_2021[key],
            findings: [],
            count: 0
        };
    });

    // Map findings to OWASP categories
    findings.forEach(finding => {
        const references = getOwaspReferences(finding);
        references.forEach(ref => {
            const key = ref.id.split(':')[0];
            if (owaspCoverage[key]) {
                owaspCoverage[key].findings.push(finding);
                owaspCoverage[key].count++;
            }
        });
    });

    return owaspCoverage;
}

/**
 * Get remediation guidance based on OWASP category
 * @param {string} owaspCode - OWASP code (e.g., 'A02')
 * @returns {Object} Remediation guidance
 */
function getOwaspGuidance(owaspCode) {
    const guidance = {
        A01: {
            prevention: [
                'Implement proper access control checks',
                'Deny by default',
                'Use centralized access control mechanisms',
                'Log access control failures'
            ]
        },
        A02: {
            prevention: [
                'Classify data and apply controls',
                'Encrypt sensitive data at rest and in transit',
                'Use strong encryption algorithms',
                'Implement proper key management'
            ]
        },
        A03: {
            prevention: [
                'Use parameterized queries',
                'Validate and sanitize all inputs',
                'Use safe APIs',
                'Implement Content Security Policy'
            ]
        },
        A04: {
            prevention: [
                'Establish secure development lifecycle',
                'Use threat modeling',
                'Integrate security testing',
                'Implement defense in depth'
            ]
        },
        A05: {
            prevention: [
                'Implement security hardening',
                'Remove unnecessary features',
                'Keep software updated',
                'Use automated configuration verification'
            ]
        },
        A06: {
            prevention: [
                'Monitor component versions',
                'Remove unused dependencies',
                'Only obtain components from official sources',
                'Use software composition analysis tools'
            ]
        },
        A07: {
            prevention: [
                'Implement multi-factor authentication',
                'Use strong password policies',
                'Implement proper session management',
                'Use secure password storage (bcrypt, Argon2)'
            ]
        },
        A08: {
            prevention: [
                'Use digital signatures',
                'Verify software integrity',
                'Implement CI/CD pipeline security',
                'Use dependency verification'
            ]
        },
        A09: {
            prevention: [
                'Log all authentication and access control events',
                'Ensure logs are tamper-proof',
                'Implement effective monitoring',
                'Establish incident response procedures'
            ]
        },
        A10: {
            prevention: [
                'Sanitize and validate all user input',
                'Implement URL allowlists',
                'Disable HTTP redirections',
                'Use network segmentation'
            ]
        }
    };

    return guidance[owaspCode] || { prevention: [] };
}

// Functions are globally available in browser context
// OWASP_TOP_10_2021, HEADER_OWASP_MAPPING, SECRET_OWASP_MAPPING, COOKIE_OWASP_MAPPING, getOwaspReferences, generateOwaspReport, getOwaspGuidance
