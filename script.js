const codes = {
    "1234": { hint: "In the wastes of post-cataclysm lands, Where mutants roam and danger stands, A facility of science's grace, Check within for secrets' embrace. What am I?", audio: "Sounds/1.wav", item: { name: "Health Potion", image: "images/health.png", details: "Restores 50% of health." } },
    "5678": { hint: "In the wastes of post-cataclysm lands, Where mutants roam and danger stands, A facility of science's grace, Check within for secrets' embrace. What am I?", audio: "Sounds/1.wav", item: { name: "Radiation Suit", image: "images/suit.png", details: "Protects from radiation." } },
    "9101": { hint: "The key is in the garden.", audio: "path/to/voice-hint-3.mp3", item: { name: "Ammo Pack", image: "images/ammo.png", details: "Contains 50 rounds of ammo." } },
    "1121": { hint: "Behind the waterfall.", audio: "path/to/voice-hint-4.mp3", item: { name: "Food Ration", image: "images/food.png", details: "Restores 20% of health." } }
};

const unlockedCodes = new Set();
const hintsDisplayed = new Set();
const items = [];
const newItems = new Set();
const bootupSound = new Audio('Sounds/startup.mp3');
const typingSound = new Audio('Sounds/typing.mp3');
const correctSound = new Audio('Sounds/correct.mp3');
const wrongSound = new Audio('Sounds/wrong.mp3');
const buttonClickSound = new Audio('Sounds/click.mp3');
const keyClickSound = new Audio('Sounds/char.mp3');
typingSound.volume = 0.25;
correctSound.volume = 0.25;
wrongSound.volume = 0.25;
buttonClickSound.volume = 0.25;
keyClickSound.volume = 0.25;
bootupSound.volume = 0.25;

const bootupMessages = [
    "Shelter-Tech Systems Booting...",
    "Initializing Pimp-Boy Interface...",
    "Loading Pimp-Boy 420 OS...",
    "Checking for Radroach Infestation...",
    "Connecting to Shelter-Tech Network...",
    "Establishing Secure Shelter-Tech Link...",
    "Verifying System Integrity...",
    "Synchronizing with Pimp-Boy Database...",
    "All Systems Nominal...",
    "Welcome, Survivor, to the Pimp-Boy 420!"
];

let bootupIndex = 0;

function showBootupMessage() {
    const messageElement = document.getElementById('bootup-message');
    messageElement.textContent = bootupMessages[bootupIndex];
    bootupIndex++;
    if (bootupIndex < bootupMessages.length) {
        setTimeout(showBootupMessage, 1000);
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
                const newHints = screen.querySelectorAll('.new-hint p');
                newHints.forEach(hintElement => {
                    const hintKey = hintElement.dataset.hintKey;
                    if (!hintsDisplayed.has(hintKey)) {
                        animateText(hintElement, () => fadeInAudioControls(hintElement.nextElementSibling));
                        hintsDisplayed.add(hintKey);
                    }
                });
                document.getElementById('new-item-count').textContent = '0';
            } else if (screenId === 'items') {
                displayItems();
                document.getElementById('new-items-badge').textContent = '0';
                newItems.clear();
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
    const screen = document.getElementById('pimpboy');

    function flashScreen(color) {
        let count = 0;
        const flashInterval = setInterval(() => {
            if (count % 2 === 0) {
                screen.style.borderColor = color === 'green' ? 'green' : 'red';
                screen.style.backgroundColor = color === 'green' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)';
            } else {
                screen.style.borderColor = '';
                screen.style.backgroundColor = '';
            }
            count++;
            if (count >= 4) {
                clearInterval(flashInterval);
            }
        }, 50);
    }

    if (codes[code] && !unlockedCodes.has(code)) {
        unlockedCodes.add(code);
        const hintElement = document.createElement('div');
        const hintKey = code;
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
            const newItemCount = document.getElementById('new-item-count');
            newItemCount.textContent = parseInt(newItemCount.textContent) + 1;
            flashScreen('green');
        } else {
            alert('This hint has already been displayed.');
        }
        if (codes[code].item) {
            items.push(codes[code].item);
            newItems.add(codes[code].item.name);
            document.getElementById('new-items-badge').textContent = newItems.size;
        }
    } else {
        flashScreen('red');
        wrongSound.play();
    }
}

function displayItems() {
    const itemsContent = document.getElementById('items-content');
    itemsContent.innerHTML = '';
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('item-container');
    itemsContent.appendChild(itemContainer);
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item-card');
        itemElement.innerHTML = `
            <div class="inner-card">
                <div class="item-front">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-name">${item.name}</div>
                </div>
                <div class="item-back">
                    <div class="item-details">${item.details}</div>
                </div>
            </div>
        `;
        itemContainer.appendChild(itemElement);
        itemElement.addEventListener('click', () => {
            itemElement.classList.toggle('active');
            buttonClickSound.currentTime = 0;
            buttonClickSound.play();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('pimpboy').style.display = 'none';
    showBootupMessage();
    document.body.addEventListener('copy', (e) => e.preventDefault());
    document.body.addEventListener('cut', (e) => e.preventDefault());
    document.body.addEventListener('dragstart', (e) => e.preventDefault());

    function showBootupMessage() {
        const messageElement = document.getElementById('bootup-message');
        let index = 0;
        const interval = setInterval(() => {
            const message = bootupMessages[index];
            animateText(messageElement, message, () => {
                index++;
                if (index === 9) {
                    bootupSound.play();
                }
                if (index >= bootupMessages.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        document.getElementById('bootup-screen').style.display = 'none';
                        document.getElementById('pimpboy').style.display = 'block';
                        showScreen('status');
                    }, 500);
                }
            });
        }, 1500);
    }

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
        }, 25);
    }

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            buttonClickSound.currentTime = 0;
            buttonClickSound.play();
        });
    });

    document.addEventListener('keydown', () => {
        keyClickSound.currentTime = 0;
        keyClickSound.play();
    });
});
