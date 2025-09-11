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

function setRandomSampleText(difficulty) {
    const texts = sampleTexts[difficulty];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    document.getElementById('sample-text').textContent = randomText;
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

        const sampleText = document.getElementById('sample-text').textContent;
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
}

function setupTestButtons() {
    document.getElementById('start-btn').addEventListener('click', startTest);
    document.getElementById('stop-btn').addEventListener('click', stopTest);
    document.getElementById('stop-btn').disabled = true;
}

setupTestButtons();
