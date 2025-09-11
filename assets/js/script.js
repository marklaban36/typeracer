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
});
