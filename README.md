# Tweet Reader 🔊

A Chrome extension that reads tweets aloud on X (Twitter) with word-by-word highlighting.

![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Manifest](https://img.shields.io/badge/manifest-v3-orange)

## Features

- 🔊 Hover over any tweet to reveal a **Read** button
- ✨ Word-by-word highlight as the tweet is read aloud
- 🎙️ Uses your device's built-in text-to-speech — no internet required
- 🔒 Zero data collection — everything stays on your device
- ♿ Accessibility-first design
- ⚡ Works on both x.com and twitter.com
- 🔄 Supports infinite scroll — new tweets are automatically detected


## Installation

### From Chrome Web Store
Coming soon — currently under review.

### Manual installation (developer mode)
1. Clone this repo:
   ```bash
   git clone https://github.com/pratip_patel/tweet-reader-extension.git
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the cloned folder

## How to use

1. Go to [x.com](https://x.com) or [twitter.com](https://twitter.com)
2. Hover over any tweet
3. Click the 🔊 **Read** button that appears
4. Words are highlighted in yellow as they are read
5. Click **⏹ Stop** to stop at any time

## File structure

```
tweet-reader-extension/
├── manifest.json       # Extension config
├── content.js          # Main logic — hover detection + TTS
├── images/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Tech stack

- Vanilla JavaScript
- Chrome Extension Manifest V3
- Web Speech API (SpeechSynthesis)
- MutationObserver for infinite scroll support

## Privacy

This extension does not collect, store, or transmit any user data.
Tweet text is passed directly to your device's built-in speech engine and never leaves your browser.

See the full [Privacy Policy](https://gist.github.com/pratip_patel/your-gist-id).

## License

MIT — feel free to use, modify and distribute.
