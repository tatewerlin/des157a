(() => {
    "use strict";
    console.log('reading js');
    const tile = document.querySelector('#tile');
    const sliders = document.querySelectorAll('input[type="range"]');
    const h3s = document.querySelectorAll('.control h3');
    const instructions = document.querySelector('#instructions');
    const roundDisplay = document.querySelector('#round-counter span')
    const valueDisplays = document.querySelectorAll('.control p');
    const scoreDisplay = document.querySelector('#score-display span:last-of-type');
    const resetButton = document.querySelector('#reset');
    const guessButton = document.querySelector('#guess');
    const instructButton = document.querySelector('#instruct');
    const previewSpans = document.querySelectorAll('#guess-preview p span');
    const resultStack = document.querySelector('#result-container');
    let score = 0;
    let roundScores = [];
    let currentRound = 1; // stores which round the player is on
    let currentRGB = []; // stores the actual rgb values of the displayed color. This is the target rgb
    let sliderValues = []; // stores the value of each slider
    const rgb = ['red', 'green', 'blue'];

    // set up page
    switchColor(); // update the target color
    setH3Color();
    initializeValues();

    // manage interactive elements and global variables
    displayRound(currentRound);
    displayScore();
    manageSliderMouse();
    manageValues();
    manageGuessButton();
    manageResetButton();
    manageIntructButton();

    function setH3Color(){ // sets each h3 background to it's corresponding color
        for (let i=0; i<h3s.length; i++){
            h3s[i].style.backgroundColor = rgb[i];
        }
    }

    function initializeValues(){ // this ensures the sliders start at roughly 50%
        for (let i=0; i<sliders.length; i++){
            let thisMin = sliders[i].getAttribute('min'); // get the min attribute for the slider
            let thisMax = sliders[i].getAttribute('max'); // get the max attribute for the slider
            let thisValue = (thisMax - thisMin)/2; // let the value be the average of the min and max
            sliderValues[i] = Math.floor(thisValue) // update the value array
            sliders[i].value = thisValue; // set the value attribute for the input
            valueDisplays[i].textContent = `${sliderValues[i]}`; // update each value display
            previewSpans[i].textContent = `${sliderValues[i]}`;
        }
    }

    function switchColor(){
        let r = Math.floor(Math.random()*255); // random r value as an integer
        let g = Math.floor(Math.random()*255); // random g value as an integer
        let b = Math.floor(Math.random()*255); // random b value as an integer
        updateCurrentRGB(r, g, b); // update the target rgb value array
        tile.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        console.log(currentRGB);
    }

    function updateCurrentRGB(r, g, b){
        currentRGB[0] = r;
        currentRGB[1] = g;
        currentRGB[2] = b;
    }

    function displayRound(current){
        roundDisplay.textContent = `${current}`;
    }

    function displayScore(){
        scoreDisplay.textContent = `${score}`;
    }

    function manageValues(){ // updates value array and displays
        for(let i=0; i<sliders.length; i++){ 
            sliders[i].addEventListener('input', function() {
                let value = sliders[i].value; // define a variable for each slider's value
                sliderValues[i] = Math.floor(value); // update the value array with the slider's new value
                valueDisplays[i].textContent = value; // update the value display
                previewSpans[i].textContent = value;
            });
        }
    }

    function manageSliderMouse(){ // sets element styling when a slider is hovered over
        for(let i=0; i<sliders.length; i++){
            sliders[i].addEventListener('mouseover', function() {
                valueDisplays[i].style.color = 'var(--default-dark)';
                previewSpans[i].style.color = 'var(--default-dark)';
                sliders[i].style.backgroundColor = 'var(--darker)';

            });
            sliders[i].addEventListener('mouseout', function(){
                valueDisplays[i].style.color = 'var(--default-medium)';
                previewSpans[i].style.color = 'var(--default-medium)';
                sliders[i].style.backgroundColor = 'var(--offlight)';
            });
        }
    }

    function incrementScore (){
        let localScore = 0;
        let roundScore;

        for (let i=0; i<sliderValues.length; i++){
            let thisDistance = Math.abs(sliderValues[i] - currentRGB[i]);
            localScore += thisDistance;
        }

        roundScore = Math.floor(localScore / 3);
        roundScores.push(roundScore);
        score += roundScore; // the round score is the average distance from guess value to target value, rounded down
    }

    function createResult (){
        const gr = sliderValues[0];
        const gg = sliderValues[1];
        const gb = sliderValues[2];
        const ar = currentRGB[0];
        const ag = currentRGB[1];
        const ab = currentRGB[2];
        const colorPair = [ 
            `rgb(${gr}, ${gg}, ${gb})`,
            `rgb(${ar}, ${ag}, ${ab})`
        ];
        const swatchClasses = [
            'guess-swatch',
            'actual-swatch'
        ];

        const newCard = document.createElement('div');
        newCard.classList.add('result-card');

        // create the index
        const cardIndex = document.createElement('p');
        cardIndex.textContent = currentRound;
        newCard.appendChild(cardIndex); // add to the card

        // create the guess column
        const guessCol = document.createElement('div');
        const guessH3 = document.createElement('h3');
        const guessP = document.createElement('p');
        guessH3.textContent = 'guess';
        guessP.textContent = `${gr}, ${gg}, ${gb}`;
        guessCol.appendChild(guessH3);
        guessCol.appendChild(guessP);
        guessCol.classList.add('card-column');
        newCard.appendChild(guessCol);

        // create the comparison div
        const comparison = document.createElement('div');
        for (let i=0; i<colorPair.length; i++){
            const swatch = document.createElement('div');
            swatch.style.backgroundColor = colorPair[i];
            swatch.classList.add(swatchClasses[i]);
            comparison.appendChild(swatch);
        }
        comparison.classList.add('comparison');
        newCard.appendChild(comparison);

        // create the actual column
        const actualCol = document.createElement('div');
        const actualH3 = document.createElement('h3');
        const actualP = document.createElement('p');
        actualH3.textContent = 'actual';
        actualP.textContent = `${ar}, ${ag}, ${ab}`;
        actualCol.appendChild(actualH3);
        actualCol.appendChild(actualP);
        actualCol.classList.add('card-column');
        newCard.appendChild(actualCol);

        // create the score column
        const scoreCol = document.createElement('div');
        const scoreH3 = document.createElement('h3');
        const scoreP = document.createElement('p');
        scoreH3.textContent = 'score';
        scoreP.textContent = roundScores[currentRound-1];
        scoreCol.appendChild(scoreH3);
        scoreCol.appendChild(scoreP);
        scoreCol.classList.add('card-column');
        newCard.appendChild(scoreCol);

        // append the card
        resultStack.appendChild(newCard);
    }

    function removeResults (){
        const toRemove = resultStack.querySelectorAll('.result-card');
        for(let i=0; i<toRemove.length; i++){
            resultStack.removeChild(toRemove[i]);
        }
    }

    function manageGuessButton(){ // defines what happens when guess button is clicked
        guessButton.addEventListener('click', () => { // defines what happens when the guess button is clicked
            if(currentRound == 1){
                instructions.classList.add('hide');
            }
            incrementScore(); // update the score
            displayScore(); // display updated score
            createResult(); // append a round result to the stack
            initializeValues(); // reset the slider values
            switchColor(); // choose a new color for the tile
            console.log(`Your Guess: (${sliderValues[0]}, ${sliderValues[1]}, ${sliderValues[2]})`);
            currentRound++;
            displayRound(currentRound);
            console.log(`score: ${score}`);
        });
    }

    function manageResetButton(){ // defines what happens when reset is clicked
        resetButton.addEventListener('click', () => {
            removeResults(); // clear the round result stack
            switchColor(); // choose a new color for the tile
            initializeValues(); // reset the slider values
            score = 0; // reset the score
            currentRound = 1; // set the current round to 1
            roundScores = []; // clear the round scores array
            displayRound(currentRound); // display the new round
            displayScore();
        });
    }

    function manageIntructButton(){
        instructButton.addEventListener('click', () => {
            instructions.classList.toggle('hide');
        });
    }
})();