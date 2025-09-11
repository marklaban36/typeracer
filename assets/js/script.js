const sampleTexts = {
    easy: [
        "The cat sat on the mat.",
        "Dogs bark at night.",
        "Birds fly in the sky."
    ],
    medium: [
        "Typing quickly requires practice and patience.",
        "She bought fresh vegetables from the market.",
        "The weather today is sunny with a gentle breeze."
    ],
    hard: [
        "Despite the rain, the enthusiastic crowd gathered for the outdoor concert.",
        "Innovative solutions often arise from collaborative brainstorming sessions.",
        "The ancient manuscript was discovered hidden beneath the crumbling stone wall."
    ]
};

function renderSampleTextWithFeedback() {
    const sampleText = document.getElementById('sample-text').getAttribute('data-original') || document.getElementById('sample-text').textContent;
    const userInput = document.getElementById('user-input').value;
    const sampleWords = sampleText.trim().split(/\s+/);
    const userWords = userInput.trim().split(/\s+/);

    let html = '';
    for (let i = 0; i < sampleWords.length; i++) {
        let colorClass = '';
        if (userWords[i] !== undefined) {
            colorClass = sampleWords[i] === userWords[i] ? 'word-correct' : 'word-incorrect';
        }
        html += `<span class="${colorClass}">${sampleWords[i]}</span> `;
    }
    document.getElementById('sample-text').innerHTML = html.trim();
    document.getElementById('sample-text').setAttribute('data-original', sampleText);
}

function setRandomSampleText(difficulty) {
    const texts = sampleTexts[difficulty];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const sampleTextElem = document.getElementById('sample-text');
    sampleTextElem.textContent = randomText;
    sampleTextElem.setAttribute('data-original', randomText);
    document.getElementById('level').textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

document.getElementById('difficulty').addEventListener('change', function() {
    setRandomSampleText(this.value);
});

// Optionally, set initial text based on default selection
window.addEventListener('DOMContentLoaded', () => {
    setRandomSampleText(document.getElementById('difficulty').value);
    document.getElementById('user-input').disabled = true; // Disable input initially
});

let startTime = null;
let endTime = null;

function startTest() {
    startTime = performance.now();
    endTime = null;
    document.getElementById('start-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    const userInput = document.getElementById('user-input');
    userInput.value = '';
    userInput.disabled = false; // Enable input when test starts
    userInput.focus();
    document.getElementById('time').textContent = '0';
    renderSampleTextWithFeedback(); // Show initial sample text with no highlights
}

function calculateCorrectWords(sample, userInput) {
    const sampleWords = sample.trim().split(/\s+/);
    const userWords = userInput.trim().split(/\s+/);
    let correct = 0;
    for (let i = 0; i < Math.min(sampleWords.length, userWords.length); i++) {
        if (sampleWords[i] === userWords[i]) {
            correct++;
        }
    }
    return correct;
}

function stopTest() {
    if (startTime) {
        endTime = performance.now();
        const elapsedSeconds = ((endTime - startTime) / 1000).toFixed(2);
        document.getElementById('time').textContent = elapsedSeconds;

        const sampleText = document.getElementById('sample-text').getAttribute('data-original') || document.getElementById('sample-text').textContent;
        const userInput = document.getElementById('user-input').value;
        const correctWords = calculateCorrectWords(sampleText, userInput);

        // WPM = (correct words) / (minutes)
        const minutes = (endTime - startTime) / 60000;
        const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;
        document.getElementById('wpm').textContent = wpm;

        // Display difficulty level
        const difficulty = document.getElementById('difficulty').value;
        document.getElementById('level').textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
    document.getElementById('start-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
    document.getElementById('user-input').disabled = true; // Disable input when test stops
    renderSampleTextWithFeedback(); // Show final highlights
}

// Add event listener for real-time feedback
document.getElementById('user-input').addEventListener('input', function() {
    renderSampleTextWithFeedback();
});

function setupTestButtons() {
    document.getElementById('start-btn').addEventListener('click', startTest);
    document.getElementById('stop-btn').addEventListener('click', stopTest);
    document.getElementById('stop-btn').disabled = true;
}

setupTestButtons();
