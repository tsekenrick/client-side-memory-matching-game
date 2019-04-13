// main.js
function createCard(eleName, attrObj) {
    const ele = document.createElement(eleName);
    for(const entry of Object.entries(attrObj)) {
        ele.setAttribute(entry[0], entry[1]);
    }
    const p = document.createElement('p');
    ele.appendChild(p);

    return ele;
}

function startGame(cardCount, maxTurns, cardFaces) {

    // hide and reveal appropriate elements
    const toShow = document.querySelectorAll('div.game, div.reset');
    for(const e of toShow) {
        e.classList.remove('hide');
    }
    document.querySelector('div.start').classList.add('hide');

    // finds optimal tiling configuration
    let rowCount = Math.floor(Math.sqrt(cardCount));
    while(cardCount/rowCount % 1 !== 0) {
        rowCount--;
    }
    const colCount = cardCount/rowCount;
    

    const gameField = document.querySelector('div.game');
    for(let i = 0; i < rowCount; i++) {
        const br = document.createElement('br');
        gameField.appendChild(br);
        for(let j = 0; j < colCount; j++) {
            const cardToAdd = createCard('div', {'class': 'card'});
            const rand = cardFaces[Math.floor(Math.random() * cardFaces.length)];
            cardFaces.splice(cardFaces.indexOf(rand), 1);
            cardToAdd.children[0].textContent = rand;
            gameField.appendChild(cardToAdd);
        }
    }

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
        startGame(cardCount, maxTurns, presetArray);
    }

}

function goBack() {
    // clear old game elements?
    const oldCards = document.querySelectorAll('div.game > div.card');
    if(oldCards.length > 0) {
        for(const e of oldCards) {
            e.remove();
        }
    }

    document.querySelector('div.error-message, div.reset').classList.add('hide');
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
    
    const resetBtn = document.querySelector('button.reset-btn');
    resetBtn.addEventListener('click', goBack);

}

document.addEventListener("DOMContentLoaded", main);
