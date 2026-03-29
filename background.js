// Background service worker for text-to-speech

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'readText') {
    const utterance = new SpeechSynthesisUtterance(request.text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    speechSynthesis.speak(utterance);

    sendResponse({ status: 'success' });
  }
});