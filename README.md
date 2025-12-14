# 🔒 AppSec Inspector

**Professional Web Application Security Inspection Tool for Chrome**

AppSec Inspector is a powerful, privacy-focused Chrome extension designed for Application Security, DevSecOps, SOC, and QA teams. Perform comprehensive security audits directly in your browser - all analysis runs locally with zero data transmission.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Features

### 🛡️ Security Header Inspector
- Analyze HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- OWASP Top 10 2021 mapping
- Severity-based findings (PASS/WARN/FAIL)
- Detailed remediation recommendations
- Best practice guidance

### 🔑 Token & Secret Leak Detector
- Scan DOM, JavaScript, and network requests
- Detect 30+ types of secrets:
  - JWT tokens
  - AWS access keys & secrets
  - Google API keys
  - Stripe keys
  - GitHub tokens
  - OAuth tokens
  - And many more...
- Smart secret masking
- False positive filtering
- Location tracking (DOM/JS/Network/Storage)

### 🔐 Auth & Session Checker
- Cookie security analysis (Secure, HttpOnly, SameSite)
- JWT token decoding and validation
- Session management audit
- Token expiration checking
- Authentication best practices

## 🎨 Modern UI

- **Glassmorphism Design**: Premium, modern interface
- **Dark/Light Themes**: Automatic theme switching
- **Smooth Animations**: Micro-interactions for better UX
- **Responsive Layout**: Optimized for all screen sizes
- **Color-Coded Results**: Instant visual feedback

## 📤 Export & Share

Export your findings in multiple formats:
- **JSON**: Machine-readable for automation
- **TXT**: Plain text reports
- **PDF**: Professional reports for stakeholders

Share results via:
- Twitter
- LinkedIn
- Copy to clipboard

## 🔐 Privacy First

- ✅ **100% Local Analysis**: All scans run in your browser
- ✅ **Zero Data Collection**: No telemetry or analytics
- ✅ **No Remote Servers**: No data transmission
- ✅ **Read-Only**: Non-destructive inspection only
- ✅ **User-Initiated**: Manual scans only, no background activity

## 🚀 Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `AppSec Inspector` folder
6. The extension icon will appear in your toolbar

### From Chrome Web Store

*Coming soon - pending review*

## 📖 How to Use

### Security Headers Scan

1. Navigate to the website you want to inspect
2. Click the AppSec Inspector icon
3. Go to the **Headers** tab
4. Click **Scan Security Headers**
5. Review findings with severity levels and recommendations

### Secret Detection Scan

1. Navigate to the target application
2. Click the **Secrets** tab
3. Click **Scan for Secrets**
4. Review detected tokens and their locations
5. Follow remediation guidance

### Authentication & Session Audit

1. Navigate to an authenticated application
2. Click the **Auth & Session** tab
3. Click **Check Auth**
4. Review cookie security and JWT analysis
5. Implement recommended fixes

## 🛠️ Technical Details

### Architecture

```
AppSec Inspector
│
├── Popup UI (popup/)
│   ├── popup.html - Main interface
│   ├── popup.css - Styling with themes
│   └── popup.js - UI logic & orchestration
│
├── Background (background/)
│   └── service-worker.js - Header capture & message routing
│
├── Content Scripts (content/)
│   └── content-script.js - DOM & storage scanning
│
├── Analysis Modules (modules/)
│   ├── headers.js - Security header analysis
│   ├── secrets.js - Secret detection
│   └── auth.js - Authentication & session checks
│
└── Utilities (utils/)
    ├── regex.js - Secret detection patterns
    ├── risk-engine.js - Risk assessment
    └── owasp-map.js - OWASP Top 10 mapping
```

### Permissions

- `activeTab`: Access current tab for analysis
- `storage`: Save user preferences (theme, welcome modal)
- `cookies`: Read cookies for security analysis
- `webRequest`: Capture HTTP headers
- `host_permissions`: Analyze any website

### Technologies

- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No external dependencies
- **Modern CSS**: Glassmorphism, animations, themes
- **Chrome APIs**: webRequest, cookies, storage, tabs

## 🔍 What We Detect

### Security Headers
- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- CORS headers

### Secrets & Tokens
- JWT Tokens
- AWS Access Keys & Secrets
- Google API Keys & OAuth
- Stripe Keys (Secret & Publishable)
- GitHub Tokens (Personal & OAuth)
- Slack Tokens & Webhooks
- Twilio API Keys
- SendGrid API Keys
- Mailgun API Keys
- Firebase Keys
- Azure Storage Keys
- Heroku API Keys
- Private Keys (RSA, EC, DSA)
- OAuth Access Tokens
- Bearer Tokens
- Basic Auth Credentials
- Generic API Keys & Secrets
- Hardcoded Passwords

### Cookie Security
- Secure flag
- HttpOnly flag
- SameSite attribute
- Domain scope
- Path scope
- Expiration times
- Session vs Persistent cookies

### JWT Analysis
- Algorithm verification
- Expiration checking
- Issuer validation
- Sensitive data detection
- Token structure validation

## 🎯 Use Cases

- **Security Audits**: Comprehensive security posture assessment
- **Penetration Testing**: Initial reconnaissance and vulnerability identification
- **DevSecOps**: Continuous security validation in CI/CD
- **Compliance**: OWASP Top 10 compliance checking
- **QA Testing**: Security regression testing
- **Bug Bounty**: Quick security assessment of targets
- **Training**: Security awareness and education

## ⚠️ Disclaimer

This tool is designed for **authorized security testing only**. Users are responsible for ensuring they have permission to test target applications. The tool performs read-only analysis and does not:

- Exploit vulnerabilities
- Inject payloads
- Modify application state
- Perform attacks
- Bypass security controls

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🐛 Bug Reports

Found a bug? Please report it:
- GitHub Issues: [Create an issue]
- Email: support@appsec-inspector.com

## 🌟 Roadmap

- [ ] Chrome Web Store publication
- [ ] Additional secret patterns
- [ ] Custom rule creation
- [ ] Report templates
- [ ] Team collaboration features
- [ ] API for automation
- [ ] Firefox support
- [ ] Edge support

## 📞 Support

- **Documentation**: See "How to Use" in the extension
- **Email**: support@appsec-inspector.com
- **GitHub**: [Issues & Discussions]

## 🙏 Acknowledgments

- OWASP Top 10 Project
- Security research community
- Chrome Extension developers

---

**Made with ❤️ for the security community**

*AppSec Inspector - Secure the Web, One Scan at a Time* 🔒
