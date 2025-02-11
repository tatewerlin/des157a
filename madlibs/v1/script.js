(function(){
    "use strict";
    console.log('reading js');
    const myForm = document.querySelector('#myForm');
    const myOverlay = document.querySelector('#overlay');
    const myXButton = document.querySelector('#overlay-x')
    const myResetButton = document.querySelector('#reset-button');
    const inputIDs = ['furniture-item','animal','verb-ing','adjective','adjective-2','plural-noun','number','noun','noun-2'];
    const inputValues = [];
    const spanIDs = [];
    let labelHasError = [];
    for(let i=0; i<inputIDs.length; i++){
        labelHasError[i]=false;
    }
    let validInputCounter = 0; // increments with each true text input upon submit input
    
    myForm.addEventListener('submit', function(e){ //runs when submit button clicked
        e.preventDefault(); // stop page from refreshing
        for(let i=0; i<inputIDs.length; i++){ // iterate over inputIDs

            inputValues[i] = document.querySelector(`#${inputIDs[i]}`).value; // retrive values using inputIDs array
            spanIDs[i] = `span-${inputIDs[i]}`; // populate spanIDs array. These should match the relevant ids in the html

            if(inputValues[i]){ // increment the validInputCounter if an input is true
                validInputCounter++;
            }

            const currentLabel = document.querySelector(`label[for="${inputIDs[i]}"]`); // Fix querySelector syntax
            const labelAddOn = document.createElement('span'); 
            const labelAddOnText = document.createTextNode('!');
            if (inputValues[i] && labelHasError[i]){ // if there is an input value and the label has an error span
                let existingError = currentLabel.querySelector('.display-error'); // assign variable to access the error span
                if (existingError){ // if it exists
                    existingError.remove(); // get rid of it
                    labelHasError[i] =false; // label no longer has the error span, so this gets set to false
                }
            } else if (!inputValues[i] && !labelHasError[i]){ // if there is no input and the label has no error span
                labelAddOn.appendChild(labelAddOnText); // append the error message to the span
                labelAddOn.setAttribute('class', 'display-error'); // set its class for future access
                currentLabel.appendChild(labelAddOn); // append the span to the label
                labelHasError[i] =true; // label now has a span, so this gets set to true
            }

            let containerSpan = document.querySelector(`#${spanIDs[i]}`); // access relevant span using spanIDs array
            let tempSpan = document.createElement('span'); // create temporary span which will be deleted after the overlay is closed
            let tempSpanText = document.createTextNode(inputValues[i]); // take the value of the relevant input and create a text node with it
            tempSpan.appendChild(tempSpanText); // populate temporary span with text
            tempSpan.setAttribute('class','temp-span-handle'); // give the span a class by which it can be "grabbed" and removed later
            containerSpan.appendChild(tempSpan); // insert the text node into relevant span
        }

        if (validInputCounter >= inputIDs.length){ // only show overlay if the appropriate number of inputs were received
            myOverlay.setAttribute('class','.showing');
        } else {
            console.log('not enough values');
            removeTempSpans(); //[FIX A] this prevents duplicate strings in the same output span, fixes bugs [1] and [2]
        }
    });

    function removeTempSpans(){ // remove the temporary spans from overlay
        let tempSpans = document.querySelectorAll('.temp-span-handle');
        for(let i=0; i<tempSpans.length; i++){
            tempSpans[i].remove(); // remove all temporary spans when the overlay is closed. They will be repopulated when submit is pressed again.
        }
    }

    function resetInputs(){ // reset the input values
        for(let i=0; i<inputIDs.length; i++){
            document.querySelector(`#${inputIDs[i]}`).value = '';
        }
    }

    myXButton.addEventListener('click', function(){
        myOverlay.setAttribute('class', 'hidden'); // close overlay when x is pressed
        validInputCounter = 0;
        removeTempSpans();
    });

    myResetButton.addEventListener('click', function(){
        myOverlay.setAttribute('class','hidden');
        validInputCounter = 0;
        removeTempSpans();
        resetInputs();
    });
})();
//bugs:
//[1] *all forms filled* SUBMIT > X > *one field deleted* SUBMIT > *same field refilled* > SUBMIT = results in duplicate strings in all but the refilled field [FIXED: FIX A]
//[2] *one field untrue* SUBMIT > *field made true* > SUBMIT = results in duplicate strings for all but the modified field [FIXED: FIX A]