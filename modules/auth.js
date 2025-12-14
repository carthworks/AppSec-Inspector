/**
 * Authentication & Session Checker Module
 * Analyzes cookies, session management, and authentication tokens
 */

/**
 * Analyze cookie security flags
 * @param {Object} cookie - Chrome cookie object
 * @returns {Object} Analysis result
 */
function analyzeCookie(cookie) {
    const issues = [];
    let severity = 'low';
    let status = 'PASS';

    // Check Secure flag
    if (!cookie.secure) {
        issues.push({
            flag: 'Secure',
            issue: 'Cookie can be transmitted over unencrypted HTTP',
            severity: 'high',
            recommendation: 'Set Secure flag to ensure cookie is only sent over HTTPS'
        });
        severity = 'high';
        status = 'FAIL';
    }

    // Check HttpOnly flag
    if (!cookie.httpOnly) {
        issues.push({
            flag: 'HttpOnly',
            issue: 'Cookie is accessible via JavaScript (vulnerable to XSS)',
            severity: 'high',
            recommendation: 'Set HttpOnly flag to prevent JavaScript access'
        });
        severity = 'high';
        status = 'FAIL';
    }

    // Check SameSite attribute
    if (!cookie.sameSite || cookie.sameSite === 'no_restriction') {
        issues.push({
            flag: 'SameSite',
            issue: 'Cookie vulnerable to CSRF attacks',
            severity: 'medium',
            recommendation: 'Set SameSite to Strict or Lax to prevent CSRF'
        });
        if (severity !== 'high') severity = 'medium';
        if (status === 'PASS') status = 'WARN';
    } else if (cookie.sameSite === 'lax') {
        // Lax is acceptable but not ideal for sensitive cookies
        if (isSensitiveCookie(cookie.name)) {
            issues.push({
                flag: 'SameSite',
                issue: 'Sensitive cookie uses SameSite=Lax (Strict recommended)',
                severity: 'low',
                recommendation: 'Consider using SameSite=Strict for sensitive cookies'
            });
        }
    }

    // Check expiration
    const cookieType = cookie.expirationDate ? 'Persistent' : 'Session';
    if (cookie.expirationDate) {
        const expirationDate = new Date(cookie.expirationDate * 1000);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expirationDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry > 365 && isSensitiveCookie(cookie.name)) {
            issues.push({
                flag: 'Expiration',
                issue: `Long expiration (${daysUntilExpiry} days) for sensitive cookie`,
                severity: 'low',
                recommendation: 'Use shorter expiration times for sensitive cookies'
            });
        }
    }

    // Check domain scope
    if (cookie.domain && cookie.domain.startsWith('.')) {
        issues.push({
            flag: 'Domain',
            issue: 'Cookie is accessible to all subdomains',
            severity: 'low',
            recommendation: 'Limit cookie scope to specific domain if possible'
        });
    }

    // Check path scope
    if (cookie.path === '/') {
        // This is common and often necessary, only flag for sensitive cookies
        if (isSensitiveCookie(cookie.name)) {
            issues.push({
                flag: 'Path',
                issue: 'Cookie is accessible to all paths',
                severity: 'low',
                recommendation: 'Consider limiting cookie path scope'
            });
        }
    }

    return {
        name: cookie.name,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite || 'none',
        type: cookieType,
        expirationDate: cookie.expirationDate,
        status,
        severity,
        issues,
        owaspRefs: ['OWASP A07:2021 - Authentication Failures', 'OWASP A02:2021 - Cryptographic Failures']
    };
}

/**
 * Check if cookie name suggests it contains sensitive data
 * @param {string} name - Cookie name
 * @returns {boolean} True if likely sensitive
 */
function isSensitiveCookie(name) {
    const sensitivePatternsPatterns = [
        /session/i,
        /auth/i,
        /token/i,
        /jwt/i,
        /csrf/i,
        /xsrf/i,
        /user/i,
        /login/i,
        /password/i,
        /remember/i,
        /access/i,
        /refresh/i
    ];

    return sensitivePatternsPatterns.some(pattern => pattern.test(name));
}

/**
 * Decode and analyze JWT token
 * @param {string} token - JWT token string
 * @returns {Object} Decoded token information
 */
function analyzeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return { error: 'Invalid JWT format' };
        }

        // Decode header and payload (don't verify signature - read-only analysis)
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

        const issues = [];
        let severity = 'low';

        // Check expiration
        if (payload.exp) {
            const expirationDate = new Date(payload.exp * 1000);
            const now = new Date();

            if (expirationDate < now) {
                issues.push({
                    issue: 'Token is expired',
                    severity: 'high',
                    recommendation: 'Token should be refreshed or user should re-authenticate'
                });
                severity = 'high';
            } else {
                const hoursUntilExpiry = Math.floor((expirationDate - now) / (1000 * 60 * 60));
                if (hoursUntilExpiry > 24 * 30) { // More than 30 days
                    issues.push({
                        issue: `Long expiration time (${Math.floor(hoursUntilExpiry / 24)} days)`,
                        severity: 'medium',
                        recommendation: 'Consider using shorter-lived tokens with refresh mechanism'
                    });
                    severity = 'medium';
                }
            }
        } else {
            issues.push({
                issue: 'No expiration claim (exp) found',
                severity: 'high',
                recommendation: 'JWT tokens should have expiration times'
            });
            severity = 'high';
        }

        // Check algorithm
        if (header.alg === 'none') {
            issues.push({
                issue: 'Algorithm is "none" - no signature verification',
                severity: 'critical',
                recommendation: 'Never use "none" algorithm in production'
            });
            severity = 'critical';
        } else if (header.alg && header.alg.startsWith('HS')) {
            issues.push({
                issue: `Using symmetric algorithm (${header.alg})`,
                severity: 'low',
                recommendation: 'Consider using asymmetric algorithms (RS256, ES256) for better security'
            });
        }

        // Check for sensitive data in payload
        const sensitiveFields = ['password', 'secret', 'api_key', 'private_key'];
        const foundSensitive = sensitiveFields.filter(field =>
            Object.keys(payload).some(key => key.toLowerCase().includes(field))
        );

        if (foundSensitive.length > 0) {
            issues.push({
                issue: `Potentially sensitive fields in payload: ${foundSensitive.join(', ')}`,
                severity: 'high',
                recommendation: 'Never include sensitive data in JWT payload (it\'s only base64 encoded)'
            });
            severity = 'high';
        }

        return {
            header,
            payload,
            algorithm: header.alg,
            expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
            issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
            issuer: payload.iss || null,
            subject: payload.sub || null,
            issues,
            severity
        };

    } catch (error) {
        return {
            error: 'Failed to decode JWT',
            details: error.message
        };
    }
}

/**
 * Analyze all cookies for a domain
 * @param {Array} cookies - Array of Chrome cookie objects
 * @returns {Object} Analysis results
 */
function analyzeCookies(cookies) {
    const results = {
        total: cookies.length,
        secure: 0,
        insecure: 0,
        findings: [],
        summary: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
        }
    };

    cookies.forEach(cookie => {
        const analysis = analyzeCookie(cookie);
        results.findings.push(analysis);

        if (cookie.secure) {
            results.secure++;
        } else {
            results.insecure++;
        }

        // Count by severity
        if (analysis.severity) {
            results.summary[analysis.severity]++;
        }
    });

    return results;
}

/**
 * Find and analyze JWT tokens in cookies and storage
 * @param {Array} cookies - Array of cookies
 * @param {Object} storage - localStorage and sessionStorage data
 * @returns {Array} Array of JWT analysis results
 */
function findAndAnalyzeJWTs(cookies, storage = {}) {
    const jwtFindings = [];
    const jwtPattern = /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g;

    // Check cookies
    cookies.forEach(cookie => {
        const matches = cookie.value.match(jwtPattern);
        if (matches) {
            matches.forEach(token => {
                const analysis = analyzeJWT(token);
                jwtFindings.push({
                    location: `Cookie: ${cookie.name}`,
                    token: token.substring(0, 20) + '...' + token.substring(token.length - 20),
                    analysis
                });
            });
        }
    });

    // Check localStorage
    if (storage.local) {
        Object.entries(storage.local).forEach(([key, value]) => {
            const matches = value.match(jwtPattern);
            if (matches) {
                matches.forEach(token => {
                    const analysis = analyzeJWT(token);
                    jwtFindings.push({
                        location: `LocalStorage: ${key}`,
                        token: token.substring(0, 20) + '...' + token.substring(token.length - 20),
                        analysis
                    });
                });
            }
        });
    }

    // Check sessionStorage
    if (storage.session) {
        Object.entries(storage.session).forEach(([key, value]) => {
            const matches = value.match(jwtPattern);
            if (matches) {
                matches.forEach(token => {
                    const analysis = analyzeJWT(token);
                    jwtFindings.push({
                        location: `SessionStorage: ${key}`,
                        token: token.substring(0, 20) + '...' + token.substring(token.length - 20),
                        analysis
                    });
                });
            }
        });
    }

    return jwtFindings;
}

/**
 * Perform comprehensive authentication and session check
 * @param {Object} options - Check options
 * @returns {Promise<Object>} Check results
 */
async function performAuthCheck(options = {}) {
    const {
        url,
        cookies = [],
        storage = {}
    } = options;

    try {
        // Analyze cookies
        const cookieAnalysis = analyzeCookies(cookies);

        // Find and analyze JWTs
        const jwtAnalysis = findAndAnalyzeJWTs(cookies, storage);

        // Generate recommendations
        const recommendations = generateAuthRecommendations(cookieAnalysis, jwtAnalysis);

        return {
            success: true,
            url,
            cookies: cookieAnalysis,
            jwts: jwtAnalysis,
            recommendations,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Generate authentication security recommendations
 * @param {Object} cookieAnalysis - Cookie analysis results
 * @param {Array} jwtAnalysis - JWT analysis results
 * @returns {Array} Array of recommendations
 */
function generateAuthRecommendations(cookieAnalysis, jwtAnalysis) {
    const recommendations = [];

    // Cookie recommendations
    if (cookieAnalysis.insecure > 0) {
        recommendations.push({
            priority: 'high',
            category: 'Cookies',
            recommendation: `${cookieAnalysis.insecure} cookie(s) missing Secure flag. Enable Secure flag for all cookies.`,
            impact: 'Cookies can be intercepted over unencrypted connections'
        });
    }

    if (cookieAnalysis.summary.high > 0 || cookieAnalysis.summary.critical > 0) {
        recommendations.push({
            priority: 'high',
            category: 'Cookies',
            recommendation: 'Critical cookie security issues detected. Review and fix immediately.',
            impact: 'High risk of session hijacking and CSRF attacks'
        });
    }

    // JWT recommendations
    const expiredJWTs = jwtAnalysis.filter(jwt =>
        jwt.analysis.issues && jwt.analysis.issues.some(i => i.issue.includes('expired'))
    );

    if (expiredJWTs.length > 0) {
        recommendations.push({
            priority: 'high',
            category: 'JWT',
            recommendation: `${expiredJWTs.length} expired JWT token(s) found. Implement token refresh mechanism.`,
            impact: 'Users may experience authentication failures'
        });
    }

    const insecureJWTs = jwtAnalysis.filter(jwt =>
        jwt.analysis.severity === 'critical' || jwt.analysis.severity === 'high'
    );

    if (insecureJWTs.length > 0) {
        recommendations.push({
            priority: 'critical',
            category: 'JWT',
            recommendation: `${insecureJWTs.length} JWT token(s) with security issues. Review JWT configuration.`,
            impact: 'Tokens may be vulnerable to tampering or contain sensitive data'
        });
    }

    // General recommendations
    if (recommendations.length === 0) {
        recommendations.push({
            priority: 'info',
            category: 'General',
            recommendation: 'Authentication and session security looks good. Continue monitoring.',
            impact: 'Maintain current security posture'
        });
    }

    return recommendations;
}

// Functions are globally available in browser context
// analyzeCookie, analyzeCookies, analyzeJWT, findAndAnalyzeJWTs, performAuthCheck, isSensitiveCookie
