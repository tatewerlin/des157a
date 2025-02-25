(function(){
    "use strict";
    console.log('reading js')
    const allImages = document.querySelectorAll('img');
    const imageStartWidths = []; // this array probably won't be used in this version, but populated nonetheless
    const allButtonIDs = []; // this array stores button IDs
    const allButtons = document.querySelectorAll('button');
    const myControls = document.querySelector('h2');
    const controlsList = document.querySelectorAll('.control-item');
    const overlay = document.querySelector('#overlay');
    const backArrow = document.querySelector('#back-arrow');
    for(let i=0; i<controlsList.length; i++){
        controlsList[i].setAttribute('class', 'hidden');
    }
    let lastMode;
    let modeSelector; // initialize modeSelector
    window.addEventListener('load', function(){ // run following functions to initialize page
        let firstMode = 0;
        modeSelector = firstMode;
        changeMode(firstMode);
        checkButtons(firstMode);
        for(let i = 0; i<allImages.length; i++){
            allImages[i].style.opacity = '1';
        }
    });

    for(let i=0; i<allButtons.length; i++){
        allButtonIDs[i] = allButtons[i].getAttribute('id'); // populate the array for button IDs

        allButtons[i].addEventListener('click', function(){
            checkButtons(i);
            lastMode = modeSelector;
            modeSelector = i; // the mode selector should be equal to the index of the button being clicked
            changeMode(i);
            console.log(`mode selector: ${modeSelector}\nlast mode: ${lastMode}`);
        });
    }

    for (let i=0; i<allImages.length; i++){
        //some of the styling stuff was earier to have in the js while I was playing with the code
        // this preps the images for the movement which occurs hereafter
        allImages[i].style.position = 'absolute';
        allImages[i].style.left='50%'; // start images in the center of the window
        allImages[i].style.top = '54%'; // this is modified further down
        allImages[i].style.transform = 'translate(-50%, -50%)';
        //the width attributes, though technically numbers, are strings. The following converts them to integers.
        imageStartWidths[i] = parseInt(allImages[i].getAttribute('height'));
    }

    function displayBehavior(mode){ // this should always run when the "overview" button is pressed
        if (mode == 0){ // make sure the correct mode is set for the respective button
            showImages(); // this line is redundant but im leaving it in. for redundancy.
            let imageFactor = 0;
            for(let i=0; i<allImages.length; i++){
                // imageFactor and imageSign are used to space images essentially
                // they have nearly identical functions in next function, and are discussed more there
                let imageSign;
                if (i%2==0){
                    imageSign = 1;
                } else {
                    imageSign = -1;
                }
                if (i==0){
                    imageFactor = 0;
                } else if (i!=0 && (i+1)%2==0){
                    imageFactor++;
                }
                allImages[i].style.top = '52%';
                allImages[i].style.left = `${50 + imageFactor * imageSign * 20}%`;
                allImages[i].style.width = '18vw';
                console.log(`i = ${i}\nimageSign = ${imageSign}\nimageFactor = ${imageFactor}\nimageSign * imageFactor = ${imageSign * imageFactor}`)
            }
        } else { // for troubleshooting
            console.log('not in display mode');
        }
    }

    document.addEventListener("mousemove", function(e){
        if(modeSelector==1){ // the following only happns when the mode selector is 1
            let mouseX = e.clientX;
            let mouseY = e.clientY;
            let imageFactor = 0;
            // windowCenterX and windowCenterY are not the true center, but what is to be considered the center for the interaction
            // the center on the Y axis is further down than halfway to accomodate the header.
            let windowCenterX = window.innerWidth * 0.5;
            let windowCenterY = window.innerHeight * 0.52;
            let xDist = mouseX - windowCenterX;
            let yDist = mouseY - windowCenterY;
            // uses polar coordinates. I was using cartesian at first and ran into issues with float imprecision when the mouse was near the axes.
            let r = Math.sqrt(xDist * xDist + yDist * yDist);
            let theta = Math.atan2(yDist, xDist);
            let imageScaler = mouseY / window.innerHeight;

            //image sign determines which side of the first/center image a given image will display on
            for (let i=0; i<allImages.length; i++){
                let imageSign;
                if ((i+1)%2==0){
                    imageSign = 1;
                } else {
                    imageSign = -1;
                }

                // image spacer spaces out the images at regular intervals
                // for the first image (index 0) it should be 0. It should increment every two images thereafter.
                if (i==0){
                    imageFactor = 0;
                } else if (i!=0 && (i+1)%2==0){
                    imageFactor++;
                }

                let imageSpacing = imageFactor * imageSign * r * 0.2; // this spaces the images. The final factor is arbitrary. The larger the bigger the spread with mouse movement
                let imageX = windowCenterX + Math.cos(theta) * imageSpacing;
                let imageY = windowCenterY + Math.sin(theta) * imageSpacing;
                
                // move the images relative to the mouse position using their CSS properties based on the above math
                allImages[i].style.left = `${imageX}px`;
                allImages[i].style.top = `${imageY}px`;
                allImages[i].style.width = `${1000 * imageScaler}px`;
            }
        }
    });

    //the following handles interaction with the back arrow icon on the overlay
    backArrow.addEventListener('mouseover', function(){
        backArrow.style.color = 'var(--default-light)';
    });
    backArrow.addEventListener('mouseout', function(){
        backArrow.style.color = 'var(--default-dark)';
    });
    backArrow.addEventListener('click', function(){
        modeSelector = lastMode;
        changeMode(lastMode);
        checkButtons(lastMode);
        console.log(`mode selector: ${modeSelector}\nlast mode: ${lastMode}`);
        lastMode = modeSelector;
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

    //basic functions to toggle image visibility across modes
    function hideImages(){
        for(let i=0; i<allImages.length; i++){
            allImages[i].setAttribute('class', 'hidden');
        }
    }
    function showImages(){
        for(let i=0; i<allImages.length; i++){
            allImages[i].setAttribute('class', 'visible');
        }
    }

    function checkButtons(i){
        for(let j=0; j<allButtons.length; j++){
            // iterate through buttons again and compare against the button being clicked
            if(j!==i){ // if the button IS NOT the one being clicked, style it as inactive
                allButtons[j].setAttribute('class', 'inactive-button');
            } else { // if the button IS the one being clicked, style it as active
                allButtons[i].setAttribute('class', 'active-button');
            }
        }
    }

    // called whenever the mode needs to be changed
    function changeMode(m){
        if (m==0){
            myControls.setAttribute('class','hidden');
            overlay.setAttribute('class', 'hidden');
            showImages();
        } else if (m==1){
            myControls.setAttribute('class','visible');
            showImages();
            overlay.setAttribute('class', 'hidden');
        } else if (m==2){
            myControls.setAttribute('class', 'hidden');
            overlay.setAttribute('class', 'visible');
            hideImages();
        }
        
        // display behavior has a statment which checks for a 0 as an input, which is required for it to run. 
        //Inputting other values does nothing
        displayBehavior(m); 
    }
})();