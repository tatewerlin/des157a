(function(){
    "use strict";
    console.log('reading js')
    const allImages = document.querySelectorAll('img');
    const imageOffsets = [];
    for (let i=0; i<allImages.length; i++){
        //some of the styling stuff was earier to have in the js while I was playing with the code
        allImages[i].style.position = 'absolute';
        allImages[i].style.left='50%'; // start images in the center iof the window
        allImages[i].style.top = '54%'; // this is modified further down
        allImages[i].style.transform = 'translate(-50%, -50%)';
    }
    document.addEventListener("mousemove", function(e){
        let mouseX = e.clientX;
        let windowWidth = window.innerWidth;
        let mouseDist = Math.abs(windowWidth/2 - mouseX);
        console.log(mouseDist);
        for (let i=0; i<allImages.length; i++){

            //alternate positive and negative sign for each image. Add 1 to i to avoid requesting 0%2.
            let imageSign;
            if ((i+1)%2==0){
                imageSign = 1;
            } else {
                imageSign = -1;
            }

            // add if the mouse is on the right side of the screen, subtract if it's on the left
            let mouseSign;
            if (mouseX>=windowWidth/2){
                mouseSign = 1;
            } else {
                mouseSign = -1;
            }

            //move EACH IMAGE ('for' loop) every time the MOUSE MOVES (event listener)
            let imageRefX = 50+mouseSign*Math.pow(mouseDist, 1/4);
            imageOffsets[i] = imageRefX+mouseSign*imageSign*Math.sqrt(mouseDist)/1.5*Math.sqrt(i);
            allImages[i].style.left = `${imageOffsets[i]}%`;
        }
        console.log(`mouse x: ${mouseX}`);
    });
})();