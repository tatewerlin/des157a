(() => {
    "use strict";
    console.log('reading js');
    const sliders = document.querySelectorAll('input[type="range"]');
    const h3s = document.querySelectorAll('.control h3');
    const valueDisplays = document.querySelectorAll('.control p');
    const resetButton = document.querySelector('#reset');
    const guessButton = document.querySelector('#guess');
    let sliderValues = [];
    const rgb = ['red', 'green', 'blue'];

    // set up page
    setH3Color();
    initializeValues();

    // manage interactive elements and global variables
    manageSliderHover();
    manageValues();
    manageGuessButton();

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
            sliders[i].setAttribute('value', thisValue); // set the value attribute for the input
            valueDisplays[i].textContent = `${sliderValues[i]}`; // update each value display
        }
    }

    function manageValues(){ // updates value array and displays
        for(let i=0; i<sliders.length; i++){ 
            sliders[i].addEventListener('input', function() {
                let value = sliders[i].value; // define a variable for each slider's value
                sliderValues[i] = Math.floor(value); // update the value array with the slider's new value
                valueDisplays[i].textContent = value; // update the value display
            });
        }
    }

    function manageSliderHover(){ // sets element styling when a slider is hovered over
        for(let i=0; i<sliders.length; i++){
            sliders[i].addEventListener('mouseover', function() {
                valueDisplays[i].style.color = 'var(--default-dark)';
            });
            sliders[i].addEventListener('mouseout', function(){
                valueDisplays[i].style.color = 'var(--default-medium)';
            });
        }
    }

    function manageGuessButton(){ // defines button behavior
        guessButton.addEventListener('click', function(){ // defines what happens when the guess button is clicked
            console.log(`RGB: (${sliderValues[0]}, ${sliderValues[1]}, ${sliderValues[2]})`)
        });
    }
})();