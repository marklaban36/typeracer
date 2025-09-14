const sampleTexts = {
    easy: [
        "The cat sat on the mat.",
        "Dogs bark at night.",
        "Birds fly in the sky.",
        "I love to read books."
    ],
    medium: [
        "Typing quickly requires practice and patience.",
        "She bought fresh vegetables from the market.",
        "The weather today is sunny with a gentle breeze.",
        "Learning new languages can be both fun and challenging."
    ],
    hard: [
        "Despite the rain, the enthusiastic crowd gathered for the outdoor concert.",
        "Innovative solutions often arise from collaborative brainstorming sessions.",
        "The ancient manuscript was discovered hidden beneath the crumbling stone wall.",
        "Technological advancements have significantly transformed modern communication methods."
    ],
};

// Add these variables to track shuffled samples and current index for each difficulty
const shuffledSamples = {
    easy: [],
    medium: [],
    hard: []
};
const sampleIndices = {
    easy: 0,
    medium: 0,
    hard: 0
};
let lastSampleText = {
    easy: "",
    medium: "",
    hard: ""
};

function shuffleArray(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
    // Shuffle if not already shuffled or all samples have been shown
    if (
        !shuffledSamples[difficulty].length ||
        sampleIndices[difficulty] >= shuffledSamples[difficulty].length
    ) {
        shuffledSamples[difficulty] = shuffleArray([...sampleTexts[difficulty]]);
        sampleIndices[difficulty] = 0;
    }

    let nextText = shuffledSamples[difficulty][sampleIndices[difficulty]];

    // Ensure not repeating the last sample
    if (nextText === lastSampleText[difficulty]) {
        sampleIndices[difficulty]++;
        if (sampleIndices[difficulty] >= shuffledSamples[difficulty].length) {
            shuffledSamples[difficulty] = shuffleArray([...sampleTexts[difficulty]]);
            sampleIndices[difficulty] = 0;
        }
        nextText = shuffledSamples[difficulty][sampleIndices[difficulty]];
    }

    sampleIndices[difficulty]++;
    lastSampleText[difficulty] = nextText;

    const sampleTextElem = document.getElementById('sample-text');
    sampleTextElem.textContent = nextText;
    sampleTextElem.setAttribute('data-original', nextText);
    document.getElementById('level').textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

document.getElementById('difficulty').addEventListener('change', function() {
    setRandomSampleText(this.value);
});

// Optionally, set initial text based on default selection
window.addEventListener('DOMContentLoaded', () => {
    setRandomSampleText(document.getElementById('difficulty').value);
});

let startTime = null;
let endTime = null;
let testStarted = false;

function handleFirstInputStartTest() {
    if (!testStarted) {
        startTestOnInput();
    }
}

function startTestOnInput() {
    startTime = performance.now();
    endTime = null;
    testStarted = true;
    document.getElementById('time').textContent = '0';
    renderSampleTextWithFeedback();
}

function handleRetryButtonClick() {
    resetTestState(); // Reset all test state first
    const currentDifficulty = document.getElementById('difficulty').value;
    setRandomSampleText(currentDifficulty); // Set new sample sentence
    document.getElementById('user-input').disabled = false; // Enable textarea for typing
    document.getElementById('retry-btn').disabled = true; // Disable retry button while test is running
}

function resetTestState() {
    startTime = null;
    endTime = null;
    testStarted = false;
    document.getElementById('user-input').value = '';
    document.getElementById('user-input').disabled = false;
    document.getElementById('retry-btn').disabled = true;
    document.getElementById('time').textContent = '0';
    document.getElementById('wpm').textContent = '0';
    renderSampleTextWithFeedback();
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
    if (startTime && testStarted) {
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
    document.getElementById('user-input').disabled = true;
    document.getElementById('retry-btn').disabled = false;
    testStarted = false;
    renderSampleTextWithFeedback();
}

function handleTestStopByEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey && testStarted) {
        event.preventDefault();
        stopTest();
    }
}

document.getElementById('user-input').addEventListener('input', function() {
    renderSampleTextWithFeedback();
    handleFirstInputStartTest();
});

document.getElementById('user-input').addEventListener('keydown', handleTestStopByEnter);
document.getElementById('retry-btn').addEventListener('click', handleRetryButtonClick);

window.addEventListener('DOMContentLoaded', () => {
    setRandomSampleText(document.getElementById('difficulty').value);
    resetTestState();
});
