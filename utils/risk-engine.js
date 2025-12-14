/**
 * Risk assessment engine for security findings
 * Provides severity scoring and risk categorization
 */

/**
 * Calculate risk score based on multiple factors
 * @param {Object} finding - Security finding object
 * @returns {Object} Risk assessment with score and level
 */
function assessRisk(finding) {
    let score = 0;
    let factors = [];

    // Base severity score
    const severityScores = {
        'critical': 10,
        'high': 7,
        'medium': 4,
        'low': 2,
        'info': 1
    };

    score += severityScores[finding.severity] || 0;
    factors.push(`Base severity: ${finding.severity}`);

    // Location factor (where the secret was found)
    if (finding.location) {
        const locationRisk = {
            'Network': 3,
            'DOM': 2,
            'JS': 2,
            'LocalStorage': 3,
            'SessionStorage': 2,
            'Cookie': 1
        };
        const locationScore = locationRisk[finding.location] || 1;
        score += locationScore;
        factors.push(`Location: ${finding.location} (+${locationScore})`);
    }

    // Type-specific risk adjustments
    if (finding.type) {
        const highRiskTypes = [
            'AWS Secret Key',
            'Private Key',
            'Stripe Secret Key',
            'Azure Storage Key'
        ];
        if (highRiskTypes.includes(finding.type)) {
            score += 2;
            factors.push('High-risk credential type (+2)');
        }
    }

    // Determine risk level
    let riskLevel;
    if (score >= 12) {
        riskLevel = 'critical';
    } else if (score >= 9) {
        riskLevel = 'high';
    } else if (score >= 5) {
        riskLevel = 'medium';
    } else if (score >= 2) {
        riskLevel = 'low';
    } else {
        riskLevel = 'info';
    }

    return {
        score,
        level: riskLevel,
        factors,
        recommendation: getRecommendation(finding, riskLevel)
    };
}

/**
 * Get remediation recommendation based on finding
 * @param {Object} finding - Security finding
 * @param {string} riskLevel - Calculated risk level
 * @returns {string} Recommendation text
 */
function getRecommendation(finding, riskLevel) {
    const recommendations = {
        'JWT Token': 'Store JWT tokens securely in HttpOnly cookies or use secure token storage. Never expose tokens in client-side code or URLs.',
        'AWS Access Key': 'Immediately rotate this AWS access key. Use AWS IAM roles for EC2/Lambda instead of hardcoded credentials. Enable AWS CloudTrail for monitoring.',
        'AWS Secret Key': 'CRITICAL: Rotate this secret immediately. Use AWS Secrets Manager or Parameter Store. Never commit secrets to version control.',
        'Google API Key': 'Restrict API key usage by IP, referrer, or application. Use OAuth 2.0 for user authentication. Rotate key if exposed.',
        'Stripe Secret Key': 'CRITICAL: Rotate immediately. Use environment variables for secrets. Implement webhook signature verification.',
        'GitHub Token': 'Revoke this token immediately. Use GitHub Apps or OAuth Apps instead of personal access tokens where possible.',
        'Private Key': 'CRITICAL: This private key is compromised. Generate new key pair immediately. Use hardware security modules (HSM) for production.',
        'Hardcoded Password': 'Remove hardcoded password. Use environment variables or secure secret management systems. Implement proper authentication.',
        'Generic API Key': 'Move API keys to environment variables or secure configuration. Implement key rotation policy. Use least-privilege access.',
        'OAuth Access Token': 'Implement proper token storage (HttpOnly cookies). Use short-lived tokens with refresh token rotation. Enable token revocation.',
        'Bearer Token': 'Store bearer tokens securely. Implement token expiration and refresh mechanisms. Use HTTPS for all token transmission.'
    };

    const baseRecommendation = recommendations[finding.type] || 'Review and secure this credential. Follow security best practices for secret management.';

    const urgencyPrefix = {
        'critical': '🚨 IMMEDIATE ACTION REQUIRED: ',
        'high': '⚠️ HIGH PRIORITY: ',
        'medium': '⚡ RECOMMENDED: ',
        'low': '📋 SUGGESTED: ',
        'info': 'ℹ️ NOTE: '
    };

    return (urgencyPrefix[riskLevel] || '') + baseRecommendation;
}

/**
 * Prioritize findings by risk score
 * @param {Array} findings - Array of security findings
 * @returns {Array} Sorted findings (highest risk first)
 */
function prioritizeFindings(findings) {
    return findings
        .map(finding => ({
            ...finding,
            risk: assessRisk(finding)
        }))
        .sort((a, b) => b.risk.score - a.risk.score);
}

/**
 * Generate risk summary statistics
 * @param {Array} findings - Array of security findings
 * @returns {Object} Summary statistics
 */
function generateRiskSummary(findings) {
    const summary = {
        total: findings.length,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
        overallRisk: 'low'
    };

    findings.forEach(finding => {
        const risk = assessRisk(finding);
        summary[risk.level]++;
    });

    // Determine overall risk
    if (summary.critical > 0) {
        summary.overallRisk = 'critical';
    } else if (summary.high > 0) {
        summary.overallRisk = 'high';
    } else if (summary.medium > 0) {
        summary.overallRisk = 'medium';
    } else if (summary.low > 0) {
        summary.overallRisk = 'low';
    } else {
        summary.overallRisk = 'info';
    }

    return summary;
}

/**
 * Calculate compliance score (0-100)
 * @param {Array} findings - Array of security findings
 * @param {number} totalChecks - Total number of security checks performed
 * @returns {Object} Compliance score and grade
 */
function calculateComplianceScore(findings, totalChecks) {
    const passedChecks = totalChecks - findings.filter(f =>
        f.status === 'FAIL' || f.status === 'WARN'
    ).length;

    const score = Math.round((passedChecks / totalChecks) * 100);

    let grade;
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    return {
        score,
        grade,
        passed: passedChecks,
        total: totalChecks
    };
}

/**
 * Get CVSS-like score for a finding
 * @param {Object} finding - Security finding
 * @returns {number} CVSS-like score (0-10)
 */
function getCVSSScore(finding) {
    const severityMap = {
        'critical': 9.5,
        'high': 7.5,
        'medium': 5.0,
        'low': 2.5,
        'info': 0.5
    };

    return severityMap[finding.severity] || 0;
}

// Functions are globally available in browser context
// assessRisk, getRecommendation, prioritizeFindings, generateRiskSummary, calculateComplianceScore, getCVSSScore
