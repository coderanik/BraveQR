# 🦁 BraveQR Scanner

![BraveQR Logo](icons/icon128.png)

BraveQR is a premium, high-performance browser extension built specifically for the Brave ecosystem. It allows users to instantly scan entire webpages for all available QR codes, whether they are rendered as images or embedded in `<canvas>` elements (common in PDF viewers and complex web apps).

## ✨ Features

- **Full Page Deep Scan**: Scans every image and canvas element on the active tab.
- **Multi-Result Support**: Identifies and lists all unique QR codes found on a page simultaneously.
- **Native + Fallback Detection**: Uses the high-speed `BarcodeDetector` API with a robust `jsQR` fallback.
- **Privacy First**: All scanning happens locally on your machine. No data is sent to external servers.
- **Clean UI**: Minimalist, glassmorphism-inspired design that feels native to Brave.
- **Instant Copy**: One-click to copy any result to your clipboard.

## 🚀 Installation & Usage

### 1. Developer Install (Unpacked)
Since BraveQR is currently in open-source development:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/BraveQR.git
    ```
2.  **Open Brave Extensions**: Navigate to `brave://extensions`.
3.  **Enable Developer Mode**: Toggle the switch in the top-right corner.
4.  **Load Project**: Click **Load unpacked** and select the `BraveQR` folder.

### 2. How to Use
1.  Navigate to any webpage containing QR codes.
2.  Click the **BraveQR** icon in your extension toolbar.
3.  Click the **📄 Scan Page for QR Codes** button.
4.  Detected codes will appear in a list. Click any result to copy it.

## 🛠️ Tech Stack

- **Manifest V3**: Using the latest Google/Brave extension standards.
- **BarcodeDetector API**: Native browser hardware-accelerated scanning.
- **jsQR**: Pure JavaScript fallback for maximum compatibility.
- **Vanilla CSS**: Premium glassmorphism UI without heavy frameworks.

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📜 Code of Conduct

Help us maintain a positive community. Read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for our standards and enforcement policies.

## ⚖️ License

This project is open-source under the [MIT License](LICENSE).
