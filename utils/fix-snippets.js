/**
 * Auto-Fix Code Snippets
 * Provides copy-paste ready configuration fixes for various platforms
 */

const FIX_SNIPPETS = {
    // HSTS (Strict-Transport-Security)
    'strict-transport-security': {
        nginx: `# Add to your nginx server block
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;`,
        apache: `# Add to your Apache configuration or .htaccess
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"`,
        express: `// Add to your Express.js app
const helmet = require('helmet');
app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
}));`,
        spring: `// Add to your Spring Boot application.properties
server.ssl.enabled=true
# Or use SecurityFilterChain
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.headers()
        .httpStrictTransportSecurity()
        .maxAgeInSeconds(31536000)
        .includeSubDomains(true);
    return http.build();
}`
    },

    // CSP (Content-Security-Policy)
    'content-security-policy': {
        nginx: `# Add to your nginx server block
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';" always;`,
        apache: `# Add to your Apache configuration or .htaccess
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"`,
        express: `// Add to your Express.js app
const helmet = require('helmet');
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"]
    }
}));`,
        spring: `// Add to your Spring Security configuration
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.headers()
        .contentSecurityPolicy("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';");
    return http.build();
}`
    },

    // X-Frame-Options
    'x-frame-options': {
        nginx: `# Add to your nginx server block
add_header X-Frame-Options "DENY" always;`,
        apache: `# Add to your Apache configuration or .htaccess
Header always set X-Frame-Options "DENY"`,
        express: `// Add to your Express.js app
const helmet = require('helmet');
app.use(helmet.frameguard({ action: 'deny' }));`,
        spring: `// Add to your Spring Security configuration
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.headers().frameOptions().deny();
    return http.build();
}`
    },

    // X-Content-Type-Options
    'x-content-type-options': {
        nginx: `# Add to your nginx server block
add_header X-Content-Type-Options "nosniff" always;`,
        apache: `# Add to your Apache configuration or .htaccess
Header always set X-Content-Type-Options "nosniff"`,
        express: `// Add to your Express.js app
const helmet = require('helmet');
app.use(helmet.noSniff());`,
        spring: `// Add to your Spring Security configuration
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.headers().contentTypeOptions();
    return http.build();
}`
    },

    // Referrer-Policy
    'referrer-policy': {
        nginx: `# Add to your nginx server block
add_header Referrer-Policy "strict-origin-when-cross-origin" always;`,
        apache: `# Add to your Apache configuration or .htaccess
Header always set Referrer-Policy "strict-origin-when-cross-origin"`,
        express: `// Add to your Express.js app
const helmet = require('helmet');
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));`,
        spring: `// Add to your Spring Security configuration
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.headers().referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN);
    return http.build();
}`
    },

    // Permissions-Policy
    'permissions-policy': {
        nginx: `# Add to your nginx server block
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;`,
        apache: `# Add to your Apache configuration or .htaccess
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"`,
        express: `// Add to your Express.js app
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
});`,
        spring: `// Add to your Spring Security configuration
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.headers().addHeaderWriter(new StaticHeadersWriter("Permissions-Policy", "geolocation=(), microphone=(), camera=()"));
    return http.build();
}`
    },

    // X-XSS-Protection (legacy but still useful)
    'x-xss-protection': {
        nginx: `# Add to your nginx server block
add_header X-XSS-Protection "1; mode=block" always;`,
        apache: `# Add to your Apache configuration or .htaccess
Header always set X-XSS-Protection "1; mode=block"`,
        express: `// Add to your Express.js app
const helmet = require('helmet');
app.use(helmet.xssFilter());`,
        spring: `// Add to your Spring Security configuration
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.headers().xssProtection();
    return http.build();
}`
    }
};

/**
 * Get fix snippets for a specific header
 * @param {string} headerName - Name of the header (lowercase with hyphens)
 * @returns {Object} Fix snippets for different platforms
 */
function getFixSnippets(headerName) {
    return FIX_SNIPPETS[headerName.toLowerCase()] || null;
}

/**
 * Get all available platforms for fixes
 * @returns {Array} List of platform names
 */
function getAvailablePlatforms() {
    return ['nginx', 'apache', 'express', 'spring'];
}

/**
 * Format fix snippet for display
 * @param {string} snippet - Code snippet
 * @param {string} platform - Platform name
 * @returns {string} Formatted snippet with platform label
 */
function formatFixSnippet(snippet, platform) {
    const platformLabels = {
        nginx: 'Nginx',
        apache: 'Apache',
        express: 'Node.js/Express',
        spring: 'Spring Boot'
    };

    return {
        platform: platformLabels[platform] || platform,
        code: snippet.trim()
    };
}

// Functions are globally available in browser context
// FIX_SNIPPETS, getFixSnippets, getAvailablePlatforms, formatFixSnippet
