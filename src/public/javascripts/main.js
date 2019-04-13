// main.js
function startGame(cardCount, maxTurns, cardFaces) {
    // hide and reveal appropriate elements
    const toShow = document.querySelectorAll('div.game, div.reset');
    for(const e of toShow) {
        e.classList.remove('hide');
    }
    document.querySelector('div.start').classList.add('hide');

    
}

function checkPairs(arr) {
    const s1 = new Set();
    const s2 = new Set();

    for(const val of arr) {
        if(!s1.has(val)) {
            s1.add(val);
        } else if(!s2.has(val)) {
            s2.add(val);
        } else {
            return false;
        }
    }

    return s1.size === s2.size;
}

function verifyFields() {
    const cardCount = parseInt(document.querySelector('#total-cards').value);
    const maxTurns = parseInt(document.querySelector('#max-turns').value);
    const cardFaces = document.querySelector('#card-faces').value;
    const presetArray = cardFaces.split(',');
    

    // clear old messages
    const oldMessages = document.querySelectorAll('div.error-message > p');
    document.querySelector('div.start').classList.remove('hide');
    for(const m of oldMessages) {
        m.remove();
    }

    // verify input validity
    const err = document.querySelector('div.error-message');
    if(cardCount <= 2 || cardCount > 36 || cardCount % 2 !== 0) {
        document.querySelector('div.start').classList.add('hide');
        err.classList.remove("hide");
        const p = document.createElement('p');
        p.textContent = "Total cards must be an even number in range [4, 36].\n";
        err.appendChild(p);
    }

    if(maxTurns < cardCount / 2) {
        document.querySelector('div.start').classList.add('hide');
        err.classList.remove("hide");
        const p = document.createElement('p');
        p.textContent = "Max turns must be at least half the card count.\n";
        err.appendChild(p);
    }

    if(presetArray.length !== cardCount) {
        document.querySelector('div.start').classList.add('hide');
        err.classList.remove("hide");
        const p = document.createElement('p');
        p.textContent = "Must have same number of preset values as card count.\n";
        err.appendChild(p);
    }

    if(!checkPairs(presetArray)){
        document.querySelector('div.start').classList.add('hide');
        err.classList.remove("hide");
        const p = document.createElement('p');
        p.textContent = "Preset cards must be unique pairs of values.\n";
        err.appendChild(p);
    }

    if(err.childElementCount === 1) {
        startGame(cardCount, maxTurns, cardFaces);
    }

}

function goBack() {
    document.querySelector('div.error-message').classList.add('hide');
    document.querySelector('div.start').classList.remove('hide');
}

function main() {
    const toHide = document.querySelectorAll('div.game, div.result, div.reset, div.error-message');
    for(const e of toHide){
        e.classList.add("hide");
    }
    const startBtn = document.querySelector('button.play-btn');
    startBtn.addEventListener('click', verifyFields);

    const errorBtn = document.querySelector('button.error-btn');
    errorBtn.addEventListener('click', goBack);
}

document.addEventListener("DOMContentLoaded", main);
