const codes = {
    "1234": { hint: "In the wastes of post-nuclear lands, Where mutants roam and danger stands, A facility of science's grace, Check within for secrets' embrace. What am I?", audio: "Sounds/1.wav" },
    "5678": { hint: "In the wastes of post-nuclear lands, Where mutants roam and danger stands, A facility of science's grace, Check within for secrets' embrace. What am I?", audio: "Sounds/1.wav" },
    "9101": { hint: "The key is in the garden.", audio: "path/to/voice-hint-3.mp3" },
    "1121": { hint: "Behind the waterfall.", audio: "path/to/voice-hint-4.mp3" },
};

const unlockedCodes = new Set();
const hintsDisplayed = new Set();
const bootupSound = new Audio('Sounds/startup.mp3');
const typingSound = new Audio('Sounds/typing.mp3');
const correctSound = new Audio('Sounds/correct.mp3');
const wrongSound = new Audio('Sounds/wrong.mp3');
const buttonClickSound = new Audio('Sounds/click.mp3');
const keyClickSound = new Audio('Sounds/char.mp3');
typingSound.volume = 0.5;
correctSound.volume = 0.5;
wrongSound.volume = 0.5;
buttonClickSound.volume = 0.5;
keyClickSound.volume = 0.5;
bootupSound.volume = 1.0;

const bootupMessages = [
    "Vault-Tec Systems Booting...",
    "Initializing Pip-Boy Interface...",
    "Loading Pimp-Boy 420 OS...",
    "Checking for Radroach Infestation...",
    "Connecting to Vault-Tec Network...",
    "Establishing Secure Vault-Tec Link...",
    "Verifying System Integrity...",
    "Synchronizing with Pip-Boy Database...",
    "All Systems Nominal...",
    "Welcome, Vault Dweller, to the Pimp-Boy 420!"
];

let bootupIndex = 0;

function showBootupMessage() {
    const messageElement = document.getElementById('bootup-message');
    messageElement.textContent = bootupMessages[bootupIndex];
    bootupIndex++;
    if (bootupIndex < bootupMessages.length) {
        setTimeout(showBootupMessage, 1000); // Show each message for 1 second
    } else {
        const bootupScreen = document.getElementById('bootup-screen');
        bootupScreen.style.display = 'none';
        showScreen('status');
    }
}

function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen-content');
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.add('active');
            if (screenId === 'data') {
                // Trigger typing animation for all new hints on the Hints page
                const newHints = screen.querySelectorAll('.new-hint p');
                newHints.forEach(hintElement => {
                    const hintKey = hintElement.dataset.hintKey;
                    if (!hintsDisplayed.has(hintKey)) {
                        animateText(hintElement, () => fadeInAudioControls(hintElement.nextElementSibling));
                        hintsDisplayed.add(hintKey);
                    }
                });
                // Clear the new item count badge
                document.getElementById('new-item-count').textContent = '0';
            }
        } else {
            screen.classList.remove('active');
        }
    });
}

function animateText(element, callback) {
    const text = element.innerText;
    element.innerText = '';
    let index = 0;
    const typing = setInterval(() => {
        element.textContent += text[index];
        typingSound.play();
        index++;
        if (index >= text.length) {
            clearInterval(typing);
            typingSound.pause();
            callback();
        }
    }, 25);
}

function fadeInAudioControls(audioElement) {
    let opacity = 0;
    audioElement.style.opacity = 0;
    audioElement.style.display = 'block';
    const fadeInInterval = setInterval(() => {
        opacity += 0.1;
        audioElement.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeInInterval);
            audioElement.volume = 0.5;
            audioElement.play();
        }
    }, 50);
}

let hintCounter = 1;

function unlockCode() {
    const code = document.getElementById('codeInput').value;
    const dataContent = document.getElementById('data-content');
    const screen = document.getElementById('pipboy');

    function flashScreen(color) {
        let count = 0;
        const flashInterval = setInterval(() => {
            if (count % 2 === 0) {
                screen.style.borderColor = color === 'green' ? 'green' : 'red'; // Set border color based on input color
                screen.style.backgroundColor = color === 'green' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'; // Set background color based on input color
            } else {
                screen.style.borderColor = ''; // Revert to default border color
                screen.style.backgroundColor = ''; // Revert to default background color
            }
            count++;
            if (count >= 4) { // Flash twice (4 times to include both green/red and default color)
                clearInterval(flashInterval);
            }
        }, 50); // Flash every 250 milliseconds
    }

    if (codes[code] && !unlockedCodes.has(code)) {
        unlockedCodes.add(code);
        const hintElement = document.createElement('div');
        const hintKey = code; // Use the code as the hint key
        if (!hintsDisplayed.has(hintKey)) {
            hintElement.classList.add('new-hint');
            hintElement.innerHTML = `
                <h3>Hint ${hintCounter}:</h3>
                <p data-hint-key="${hintKey}">${codes[code].hint}</p>
                <audio controls style="display: none;">
                    <source src="${codes[code].audio}" type="audio/wav">
                    Your browser does not support the audio element.
                </audio>
            `;
            dataContent.appendChild(hintElement);
            hintCounter++;
            correctSound.play();

            // Update the new item count badge
            const newItemCount = document.getElementById('new-item-count');
            newItemCount.textContent = parseInt(newItemCount.textContent) + 1;

            flashScreen('green'); // Flash screen green for correct code
        } else {
            alert('This hint has already been displayed.');
        }
    } else {
        flashScreen('red'); // Flash screen red for incorrect code
        wrongSound.play();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Hide the Pimp-Boy interface initially
    document.getElementById('pipboy').style.display = 'none';

    // Show bootup message and initiate bootup process
    showBootupMessage();

    // Function to show bootup message with typing animation
    function showBootupMessage() {
        const messageElement = document.getElementById('bootup-message');
        let index = 0;
        const interval = setInterval(() => {
            const message = bootupMessages[index];
            animateText(messageElement, message, () => {
                index++;
                if (index === 9) { // Adjust index based on the initiating part
                    bootupSound.play(); // Play bootup sound after the initiating part
                }
                if (index >= bootupMessages.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        // Hide bootup screen and show Pimp-Boy interface
                        document.getElementById('bootup-screen').style.display = 'none';
                        document.getElementById('pipboy').style.display = 'block';
                        showScreen('status');
                    }, 500); // Adjust delay as needed
                }
            });
        }, 1500); // Adjust interval as needed
    }

    // Function to animate text typing
    function animateText(element, text, callback) {
        element.innerText = '';
        let index = 0;
        const typing = setInterval(() => {
            element.textContent += text[index];
            typingSound.play();
            index++;
            if (index >= text.length) {
                clearInterval(typing);
                typingSound.pause();
                callback();
            }
        }, 25); // Adjust typing speed as needed
    }

    // Add event listener to play sound on button click
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            buttonClickSound.currentTime = 0; // Reset the audio to start
            buttonClickSound.play();
        });
    });

    // Add event listener to play sound on key press
    document.addEventListener('keydown', () => {
        keyClickSound.currentTime = 0; // Reset the audio to start
        keyClickSound.play();
    });
});



