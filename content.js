let currentUtterance = null;
let playBtn = null;
let hideTimer = null;
let activeTextEl = null;
let originalHTML = null;

function createPlayButton() {
  const btn = document.createElement('button');
  btn.innerText = '🔊 Read';
  btn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 13px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  `;
  btn.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  btn.addEventListener('mouseleave', () => startHideTimer());
  return btn;
}

function getTweetTextEl(tweetEl) {
  return tweetEl.querySelector('[data-testid="tweetText"]');
}

function wrapWordsInSpans(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach(textNode => {
    const words = textNode.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    words.forEach(word => {
      if (/^\s+$/.test(word) || word === '') {
        frag.appendChild(document.createTextNode(word));
      } else {
        const span = document.createElement('span');
        span.className = 'tweet-reader-word';
        span.textContent = word;
        frag.appendChild(span);
      }
    });
    textNode.parentNode.replaceChild(frag, textNode);
  });
}

function clearHighlights() {
  if (activeTextEl && originalHTML !== null) {
    activeTextEl.innerHTML = originalHTML;
    activeTextEl = null;
    originalHTML = null;
  }
}

function getPreferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  const isMac = navigator.platform.toUpperCase().includes('MAC') ||
                navigator.userAgent.includes('Mac');

  const macVoices = ['Karen', 'Samantha', 'Nicky'];
  const windowsVoices = ['Microsoft Jenny', 'Microsoft Aria', 'Microsoft Zira'];
  const preferred = isMac ? macVoices : windowsVoices;

  for (const name of preferred) {
    const match = voices.find(v => v.name.includes(name));
    if (match) return match;
  }
  return null;
}

function speakWithHighlight(textEl) {
  window.speechSynthesis.cancel();
  clearHighlights();

  activeTextEl = textEl;
  originalHTML = textEl.innerHTML;

  wrapWordsInSpans(textEl);
  const wordSpans = Array.from(textEl.querySelectorAll('.tweet-reader-word'));
  const fullText = wordSpans.map(s => s.textContent).join(' ');

  currentUtterance = new SpeechSynthesisUtterance(fullText);
  currentUtterance.rate = 1.2;
  currentUtterance.pitch = 1;

  currentUtterance.onboundary = (event) => {
    if (event.name !== 'word') return;
    wordSpans.forEach(s => {
      s.style.background = '';
      s.style.borderRadius = '';
      s.style.padding = '';
    });
    let charCount = 0;
    for (let i = 0; i < wordSpans.length; i++) {
      const wordLen = wordSpans[i].textContent.length;
      if (charCount >= event.charIndex) {
        wordSpans[i].style.background = '#FFD700';
        wordSpans[i].style.borderRadius = '3px';
        wordSpans[i].style.padding = '0 2px';
        break;
      }
      charCount += wordLen + 1;
    }
  };

  currentUtterance.onend = () => {
    clearHighlights();
    if (playBtn) playBtn.innerText = '🔊 Read';
  };

  const startSpeaking = () => {
    const voice = getPreferredVoice();
    if (voice) currentUtterance.voice = voice;
    window.speechSynthesis.speak(currentUtterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = startSpeaking;
  } else {
    startSpeaking();
  }
}

function startHideTimer() {
  hideTimer = setTimeout(() => {
    if (playBtn) {
      playBtn.remove();
      playBtn = null;
    }
  }, 600);
}

function attachHoverListeners() {
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');

  tweets.forEach(tweet => {
    if (tweet._tweetReaderAttached) return;
    tweet._tweetReaderAttached = true;
    tweet.style.position = 'relative';

    tweet.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);
      const textEl = getTweetTextEl(tweet);
      if (!textEl) return;

      if (playBtn) playBtn.remove();
      playBtn = createPlayButton();

      playBtn.onclick = (e) => {
        e.stopPropagation();
        speakWithHighlight(textEl);
        playBtn.innerText = '⏹ Stop';
        playBtn.onclick = (e) => {
          e.stopPropagation();
          window.speechSynthesis.cancel();
          clearHighlights();
          playBtn.innerText = '🔊 Read';
          playBtn.onclick = () => {
            speakWithHighlight(textEl);
            playBtn.innerText = '⏹ Stop';
          };
        };
      };

      tweet.appendChild(playBtn);
    });

    tweet.addEventListener('mouseleave', () => startHideTimer());
  });
}

attachHoverListeners();

const observer = new MutationObserver(() => attachHoverListeners());
observer.observe(document.body, { childList: true, subtree: true });