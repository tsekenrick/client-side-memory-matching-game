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

function startGame(cardCount, maxTurns, cardFaces, isPreset) {
    document.querySelector('button.reset-btn').textContent = "Quit";

    // gameplay variables
    const selectedCards = []; 
    let turn = 0;
    let matches = 0;

    if(cardFaces.length !== cardCount) {
        cardFaces = [];
        for(let i = 0; i < cardCount/2; i++) {
            cardFaces.push(i+1);
            cardFaces.push(i+1);
        }
    }

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

    // generate card divs and append them to the document
    const gameField = document.querySelector('div.game');
    const turnCounter = document.createElement('h2');
    turnCounter.setAttribute('id', 'turnCounter');
    turnCounter.textContent = `TURN ${turn}/${maxTurns}`;
    gameField.appendChild(turnCounter);

    for(let i = 0; i < rowCount; i++) {
        const br = document.createElement('br');
        gameField.appendChild(br);
        for(let j = 0; j < colCount; j++) {
            const cardToAdd = createCard('div', {'class': 'card'});

            if(isPreset) {
                const content = cardFaces[0];
                cardFaces.splice(0, 1);
                cardToAdd.children[0].textContent = content;
            } else {
                const rand = cardFaces[Math.floor(Math.random() * cardFaces.length)];
                cardFaces.splice(cardFaces.indexOf(rand), 1);
                cardToAdd.children[0].textContent = rand;
            }
            
            cardToAdd.children[0].classList.add('hide');
            cardToAdd.addEventListener('click', function selectCard() {
                if(selectedCards.length === 2) { return; }
                selectedCards.push(this);
                this.children[0].classList.remove('hide');
                
                if(selectedCards.length === 2) {
                    // match
                    if(selectedCards[1].children[0].textContent === selectedCards[0].children[0].textContent) {
                        matches++;
                        turn++;
    
                        const contBtn = document.createElement('button');
                        contBtn.setAttribute('type', 'button');
                        contBtn.setAttribute('class', 'continue-btn');
                        contBtn.textContent = "Continue";
                        gameField.appendChild(contBtn);
                        contBtn.addEventListener('click', function nextTurn() {
                            document.querySelector('#turnCounter').textContent = `TURN ${turn}/${maxTurns}`;
                            document.querySelector('button.continue-btn').remove();
                            selectedCards.splice(0, selectedCards.length);
                        });
                        
                    // no match, reset
                    } else {
                        // clear list of selected, turn over cards
                        turn++;
                        const contBtn = document.createElement('button');
                        contBtn.setAttribute('type', 'button');
                        contBtn.setAttribute('class', 'continue-btn');
                        contBtn.textContent = "Continue";
                        gameField.appendChild(contBtn);
                        contBtn.addEventListener('click', function nextTurn() {
                            for(const c of selectedCards) {
                                document.querySelector('#turnCounter').textContent = `TURN ${turn}/${maxTurns}`;
                                c.children[0].classList.add('hide');
                            }
                            selectedCards.splice(0, selectedCards.length);
                            document.querySelector('button.continue-btn').remove();
                        });
                    }
                    
                    // win/loss conditions
                    if(matches === cardCount / 2) {
                        document.querySelector('div.game').classList.add('hide');
                        const results = document.querySelector('div.result');
                        results.classList.remove('hide');
                        const h2 = document.createElement('h2');
                        h2.textContent = `YOU WON! :)\n ${turn}/${maxTurns} Turns`;
                        results.appendChild(h2);
                        document.querySelector('button.reset-btn').textContent = "Another Round";

                    } else if(turn >= maxTurns) {
                        document.querySelector('div.game').classList.add('hide');
                        const results = document.querySelector('div.result');
                        results.classList.remove('hide');
                        const h2 = document.createElement('h2');
                        h2.textContent = `YOU LOST :(\n ${turn}/${maxTurns} Turns`;
                        results.appendChild(h2);
                        document.querySelector('button.reset-btn').textContent = "Try Again";
                    }

                }
            });
            gameField.appendChild(cardToAdd);
        }
    }
    const br = document.createElement('br');
    gameField.appendChild(br);
}

function checkPairs(arr) {
    if(arr.length === 1) { return true; }

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

    if(presetArray.length !== cardCount && presetArray.length !== 1) {
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

    if(err.childElementCount === 1 && presetArray.length === cardCount) {
        startGame(cardCount, maxTurns, presetArray, true);
    } else if(err.childElementCount === 1 && presetArray.length <= 1) {
        startGame(cardCount, maxTurns, presetArray, false);
    }

}

function reset() {
    const oldCards = document.querySelector('div.game');
    while(oldCards.firstChild) {
        oldCards.removeChild(oldCards.firstChild);
    }

    const oldResults = document.querySelector('div.result');
    while(oldResults.firstChild) {
        oldResults.removeChild(oldResults.firstChild);
    }

    document.querySelector('div.reset').classList.add('hide');
    document.querySelector('div.error-message').classList.add('hide');
    document.querySelector('div.result').classList.add('hide');

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
    errorBtn.addEventListener('click', reset);
    
    const resetBtn = document.querySelector('button.reset-btn');
    resetBtn.addEventListener('click', reset);

}

document.addEventListener("DOMContentLoaded", main);
