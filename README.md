<div align="center">

<img src="icons/icon128.png" width="96" height="96" alt="BraveQR Logo" />

# BraveQR Scanner

**A blazing-fast QR code scanner built for the Brave browser ecosystem**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blueviolet?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Brave Compatible](https://img.shields.io/badge/Brave-Compatible-FB542B?style=for-the-badge&logo=brave&logoColor=white)](https://brave.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&logo=github&logoColor=white)](CONTRIBUTING.md)

---

*Privacy-first · Local scanning · Zero data leakage*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Full Page Deep Scan** | Scans every `<img>` and `<canvas>` element on the active tab |
| 📋 **Multi-Result Support** | Identifies and lists all unique QR codes found simultaneously |
| ⚡ **Native + Fallback Detection** | High-speed `BarcodeDetector` API with a robust `jsQR` fallback |
| 🔒 **Privacy First** | All scanning happens locally — no data ever leaves your machine |
| 🎨 **Clean UI** | Minimalist, glassmorphism-inspired design native to Brave |
| 📎 **Instant Copy** | One-click to copy any detected result to your clipboard |

---

## 🛠️ Tech Stack

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Brave](https://img.shields.io/badge/Brave_Browser-FB542B?style=for-the-badge&logo=brave&logoColor=white)

</div>

| Technology | Role |
|---|---|
| **Manifest V3** | Latest Google/Brave extension standard for security & performance |
| **BarcodeDetector API** | Native browser hardware-accelerated QR scanning |
| **jsQR** | Pure JavaScript fallback for maximum compatibility |
| **Vanilla CSS** | Premium glassmorphism UI — no heavy frameworks needed |

---

## 🚀 Installation

### Developer Install (Unpacked)

BraveQR is currently in open-source development. To install manually:

**1. Clone the repository**
```bash
git clone https://github.com/coderanik/BraveQR.git
cd BraveQR
```

**2. Open Brave Extensions**
```
brave://extensions
```

**3. Enable Developer Mode**
> Toggle the switch in the top-right corner of the extensions page.

**4. Load the extension**
> Click **Load unpacked** → select the `BraveQR` folder.

---

## 📖 Usage

```
1.  Navigate to any webpage containing QR codes
2.  Click the BraveQR icon in your extension toolbar
3.  Hit the  Scan Page for QR Codes  button
4.  Detected codes appear in a list — click any to copy it
```

---

## 🤝 Contributing

Contributions are welcome and appreciated! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

```bash
# Fork → Clone → Branch → Commit → Pull Request
git checkout -b feature/your-feature-name
```

---

## 📜 Code of Conduct

Help us keep this a positive community. Please read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## ⚖️ License

Released under the [MIT License](LICENSE) — free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ for the Brave community

[![GitHub stars](https://img.shields.io/github/stars/coderanik/BraveQR?style=social)](https://github.com/coderanik/BraveQR)
[![GitHub forks](https://img.shields.io/github/forks/coderanik/BraveQR?style=social)](https://github.com/coderanik/BraveQR/fork)

</div>