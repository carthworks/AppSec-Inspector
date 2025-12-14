/**
 * Security Score Calculator
 * Calculates overall security score and grade based on findings
 */

/**
 * Calculate security score based on all findings
 * @param {Object} results - All scan results (headers, secrets, auth)
 * @returns {Object} Score, grade, and breakdown
 */
function calculateSecurityScore(results) {
    let totalPoints = 0;
    let maxPoints = 0;
    const breakdown = {
        headers: { score: 0, max: 0, weight: 40 },
        secrets: { score: 0, max: 0, weight: 35 },
        auth: { score: 0, max: 0, weight: 25 }
    };

    // Calculate Headers Score (40% weight)
    if (results.headers && results.headers.length > 0) {
        const headerResults = calculateHeadersScore(results.headers);
        breakdown.headers.score = headerResults.score;
        breakdown.headers.max = headerResults.max;
    }

    // Calculate Secrets Score (35% weight)
    if (results.secrets && results.secrets.length >= 0) {
        const secretsResults = calculateSecretsScore(results.secrets);
        breakdown.secrets.score = secretsResults.score;
        breakdown.secrets.max = secretsResults.max;
    }

    // Calculate Auth Score (25% weight)
    if (results.auth && results.auth.length >= 0) {
        const authResults = calculateAuthScore(results.auth);
        breakdown.auth.score = authResults.score;
        breakdown.auth.max = authResults.max;
    }

    // Calculate weighted total
    totalPoints =
        (breakdown.headers.score / breakdown.headers.max * breakdown.headers.weight) +
        (breakdown.secrets.score / breakdown.secrets.max * breakdown.secrets.weight) +
        (breakdown.auth.score / breakdown.auth.max * breakdown.auth.weight);

    maxPoints = breakdown.headers.weight + breakdown.secrets.weight + breakdown.auth.weight;

    // Handle edge cases
    if (isNaN(totalPoints) || !isFinite(totalPoints)) {
        totalPoints = 0;
    }

    const score = Math.round((totalPoints / maxPoints) * 100);
    const grade = getGrade(score);

    return {
        score: Math.max(0, Math.min(100, score)), // Clamp between 0-100
        grade,
        breakdown,
        summary: generateScoreSummary(score, grade, breakdown)
    };
}

/**
 * Calculate score for headers
 * @param {Array} headers - Header findings
 * @returns {Object} Score and max points
 */
function calculateHeadersScore(headers) {
    let score = 0;
    const maxPoints = headers.length * 10; // 10 points per header check

    headers.forEach(finding => {
        if (finding.status === 'PASS') {
            score += 10;
        } else if (finding.status === 'WARN') {
            score += 5;
        } else if (finding.status === 'INFO') {
            score += 7;
        }
        // FAIL = 0 points
    });

    return { score, max: maxPoints || 100 }; // Default to 100 if no headers
}

/**
 * Calculate score for secrets
 * @param {Array} secrets - Secret findings
 * @returns {Object} Score and max points
 */
function calculateSecretsScore(secrets) {
    const maxPoints = 100;

    if (secrets.length === 0) {
        return { score: 100, max: maxPoints }; // Perfect score if no secrets found
    }

    // Deduct points based on severity
    let deductions = 0;
    secrets.forEach(secret => {
        switch (secret.severity) {
            case 'critical':
                deductions += 25;
                break;
            case 'high':
                deductions += 15;
                break;
            case 'medium':
                deductions += 8;
                break;
            case 'low':
                deductions += 3;
                break;
        }
    });

    const score = Math.max(0, maxPoints - deductions);
    return { score, max: maxPoints };
}

/**
 * Calculate score for auth/cookies
 * @param {Array} authFindings - Auth findings
 * @returns {Object} Score and max points
 */
function calculateAuthScore(authFindings) {
    const maxPoints = 100;

    if (authFindings.length === 0) {
        return { score: 100, max: maxPoints }; // Perfect score if no issues
    }

    // Count issues
    let criticalIssues = 0;
    let warnings = 0;

    authFindings.forEach(finding => {
        if (finding.status === 'FAIL' || finding.severity === 'high' || finding.severity === 'critical') {
            criticalIssues++;
        } else if (finding.status === 'WARN' || finding.severity === 'medium') {
            warnings++;
        }
    });

    const deductions = (criticalIssues * 15) + (warnings * 5);
    const score = Math.max(0, maxPoints - deductions);

    return { score, max: maxPoints };
}

/**
 * Get letter grade from score
 * @param {number} score - Score (0-100)
 * @returns {string} Letter grade
 */
function getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

/**
 * Get grade color
 * @param {string} grade - Letter grade
 * @returns {string} Color class
 */
function getGradeColor(grade) {
    const colors = {
        'A': '#48bb78', // Green
        'B': '#4299e1', // Blue
        'C': '#ed8936', // Orange
        'D': '#f56565', // Red
        'F': '#c53030'  // Dark Red
    };
    return colors[grade] || colors['F'];
}

/**
 * Generate score summary text
 * @param {number} score - Overall score
 * @param {string} grade - Letter grade
 * @param {Object} breakdown - Score breakdown
 * @returns {string} Summary text
 */
function generateScoreSummary(score, grade, breakdown) {
    const messages = {
        'A': '🎉 Excellent! Your security posture is strong.',
        'B': '👍 Good security practices, but room for improvement.',
        'C': '⚠️ Moderate security. Several issues need attention.',
        'D': '⚠️ Poor security posture. Immediate action required.',
        'F': '🚨 Critical security issues detected. Fix immediately!'
    };

    return messages[grade] || messages['F'];
}

/**
 * Get detailed recommendations based on score
 * @param {Object} scoreData - Score calculation result
 * @returns {Array} List of recommendations
 */
function getScoreRecommendations(scoreData) {
    const recommendations = [];

    // Headers recommendations
    if (scoreData.breakdown.headers.score < scoreData.breakdown.headers.max * 0.7) {
        recommendations.push({
            category: 'Headers',
            priority: 'high',
            message: 'Implement missing security headers to protect against common attacks'
        });
    }

    // Secrets recommendations
    if (scoreData.breakdown.secrets.score < 80) {
        recommendations.push({
            category: 'Secrets',
            priority: 'critical',
            message: 'Remove exposed secrets immediately and rotate compromised credentials'
        });
    }

    // Auth recommendations
    if (scoreData.breakdown.auth.score < 70) {
        recommendations.push({
            category: 'Authentication',
            priority: 'high',
            message: 'Improve cookie security and session management practices'
        });
    }

    return recommendations;
}

// Functions are globally available in browser context
// calculateSecurityScore, getGrade, getGradeColor, getScoreRecommendations
