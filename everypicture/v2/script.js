(function(){
    "use strict";
    console.log('reading js')
    const allImages = document.querySelectorAll('img');
    // const imageOffsets = [];
    const imageStartWidths = [];
    const allButtonIDs = []; // array to store button IDs
    const allButtons = document.querySelectorAll('button');
    const myControls = document.querySelector('h2');
    const controlsList = document.querySelectorAll('p');
    for(let i=0; i<controlsList.length; i++){
        controlsList[i].setAttribute('class', 'hidden');
    }
    let modeSelector = 0; // set the mode selector to 1 by default
    console.log(`mode selector: ${modeSelector}`);

    for(let i=0; i<allButtons.length; i++){
        allButtonIDs[i] = allButtons[i].getAttribute('id'); // populate the array for button IDs

        //the following handles behavior when a button is clicked
        allButtons[i].addEventListener('click', function(){
            for(let j=0; j<allButtons.length; j++){
                // iterate through buttons again and compare against the button being clicked
                if(j!==i){ // if the button IS NOT the one being clicked, style it as inactive
                    allButtons[j].setAttribute('class', 'inactive-button');
                } else { // if the button IS the one being clicked, style it as active
                    allButtons[i].setAttribute('class', 'active-button');
                }
            }
            modeSelector = i; // the mode selector should be equal to the index of the button being clicked
            // the following handles visibility of "controls" hover h2
            console.log(`mode selector: ${modeSelector}`);
            if (i==0){
                myControls.setAttribute('class','hidden');
            } else if (i==1){
                myControls.setAttribute('class','visible');
            }
        });
    }

    for (let i=0; i<allImages.length; i++){
        //some of the styling stuff was earier to have in the js while I was playing with the code
        allImages[i].style.position = 'absolute';
        allImages[i].style.left='50%'; // start images in the center of the window
        allImages[i].style.top = '54%'; // this is modified further down
        allImages[i].style.transform = 'translate(-50%, -50%)';
        //the width attributes, though technically numbers, are strings. The following converts them to integers.
        imageStartWidths[i] = parseInt(allImages[i].getAttribute('height'));
    }

    document.addEventListener("mousemove", function(e){
        if(modeSelector==1){ // the following only happns when the mode selector is 1
            let imageRefX = 50;
            let imageRefY = 54;
            let mouseX = e.clientX;
            let mouseY = e.clientY;
            let windowCenterX = window.innerWidth/2;
            let windowCenterY = window.innerHeight/2;
            let xDist = mouseX - windowCenterX;
            let yDist = windowCenterY - mouseY;
            let mouseRadius = Math.sqrt(xDist*xDist+yDist+yDist);
            // let mouseAngleRad = Math.atan2(xDist, yDist);
            // let mouseAngleDeg = mouseAngleRad * (180/Math.PI);
            let imageScaler = mouseY / window.innerHeight;
            let imageSpacer = 0;
            let mouseSignX;
            if (mouseX>=windowCenterX){
                mouseSignX = 1;
            } else {
                mouseSignX = -1;
            }
            for (let i=0; i<allImages.length; i++){
                let imageSign;
                if ((i+1)%2==0){
                    imageSign = 1;
                } else {
                    imageSign = -1;
                }

                //image spacer spaces out the images at regular intervals
                // for the first image (index 0) it should be 0. It should increment every two images thereafter.
                if (i==0){
                    imageSpacer = 0;
                } else if (i!=0 && (i+1)%2==0){
                    imageSpacer++;
                }
                //the last factor is arbitrary and controls the maximum width of the image spread. between 10 and 20 seems to be best for desktop
                allImages[i].style.left=`${(imageRefX+mouseSignX*imageSign*(mouseRadius/windowCenterX)*imageSpacer*15)}%`;
                allImages[i].style.width = `${imageStartWidths[i]*imageScaler}px`;
                //console.log(`${(imageRefX+mouseSignX*imageSign*(mouseRadius/windowCenterX)*i*5)}%`);
                console.log(imageSpacer);
            }
        }
    });

    document.addEventListener('click', function(){
    });

    //these handle the behavior of <p> elements when hovering over the <h2>
    myControls.addEventListener('mouseover', function(){
        if(modeSelector==1){
            for(let i=0; i<controlsList.length; i++){
                controlsList[i].setAttribute('class', 'visible');
            }
        }
    });
    myControls.addEventListener('mouseout', function(){
        if(modeSelector==1){
            for(let i=0; i<controlsList.length; i++){
                controlsList[i].setAttribute('class', 'hidden');
            }
        }
    });

    //this handles all keypressed events
    document.addEventListener("keydown", function(e){
        let pressedKey = e.key;
        console.log(pressedKey);
        if (pressedKey=='h'||pressedKey=='H'){
            for(let i=0; i<allImages.length; i++){
                if(allImages[i].getAttribute('class')=='visible'){
                    allImages[i].setAttribute('class', 'hidden');
                } else {
                    allImages[i].setAttribute('class', 'visible');
                }
            }
        } else if ((pressedKey=='c'||pressedKey=='C') && modeSelector==1){
            let r = Math.random()*100;
            let g = Math.random()*100;
            let b = Math.random()*100;
            document.querySelector('html').style.backgroundColor=`rgb(${r}, ${g}, ${b})`
        } else if(pressedKey=='r'||pressedKey=='R'){
            document.querySelector('html').style.backgroundColor=`var(--default-dark)`
        };
    });
})();