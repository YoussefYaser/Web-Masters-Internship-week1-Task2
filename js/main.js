//getting the elements
const mainSlider = document.querySelector('.page .slider .main-slider');
const slides = document.querySelector('.page .slider .main-slider .slides');
const arrowLeft = document.querySelector('.page .slider .arrow-left');
const arrowRight = document.querySelector('.page .slider .arrow-right');
const sliderPagination = document.querySelector('.page  .slider-pagination');
const introAudio = document.querySelectorAll('audio');

//set the default active slide
let activeSlide = 0;
slides.children[activeSlide].style.setProperty('opacity', '1');
sliderPagination.children[activeSlide].classList.add('active');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
let setPlay = false;

// play audio
function playAudio(){
    for(let i=0; i<introAudio.length; i++){
        if(i==activeSlide){
            introAudio[i].currentTime = 0;
            introAudio[i].play();
        }
        else{
            introAudio[i].pause();
        }
    }
}

function pauseAudio(){
    for(let i=0; i<introAudio.length; i++){
        introAudio[i].pause();
    }
}

if(!isTouchDevice){
    Array.from(slides.children).forEach((slide, i)=>{
        slide.addEventListener('mouseenter', playAudio);
        slide.addEventListener('mouseleave', pauseAudio);
    });
}
else{
    Array.from(slides.children).forEach((slide, i)=>{
        slide.addEventListener('click', function(){
            setPlay = !setPlay;
            console.log(setPlay);
            
            if(setPlay){
                playAudio();
            }
            else{
                pauseAudio();
            }
        });
    });
}

// handle autoPlay
let autoPlay = setInterval(() => {
    arrowRight.click();
}, 3000);

function pause(){
    clearInterval(autoPlay);
    console.log('pause');
}

function resume(){
    console.log('resume');
    autoPlay = setInterval(() => {
        arrowRight.click();
    }, 3000); 
}

if(!isTouchDevice){
    Array.from(slides.children).forEach((slide, i)=>{
        slide.addEventListener('mouseenter', pause);
        slide.addEventListener('mouseleave', resume);
    });
    
    arrowRight.addEventListener('mouseenter', pause);
    arrowRight.addEventListener('mouseleave', resume);
    
    arrowLeft.addEventListener('mouseenter', pause);
    arrowLeft.addEventListener('mouseleave', resume);
}
else{
    let setPause = false;
    mainSlider.addEventListener('click', function(e){
        e.stopPropagation();
        pause();
    });
    document.addEventListener('click', resume);
}

//right arrow click event 
arrowRight.addEventListener('click', function (e) {
    e.stopPropagation();
    if (activeSlide == 4) {
        activeSlide = 0;
    }
    else {
        activeSlide++;
    }

    slides.style.setProperty('transform', `translateX(-${(activeSlide / 5) * 100}%)`);
    for (let i = 0; i < slides.children.length; i++) {
        if (i == activeSlide)
            slides.children[i].style.setProperty('opacity', '1');
        else
            slides.children[i].style.setProperty('opacity', '0');
    }

    for (let i = 0; i < sliderPagination.children.length; i++) {
        if (i == activeSlide)
            sliderPagination.children[i].classList.add('active');
        else
            sliderPagination.children[i].classList.remove('active');
    }

    pauseAudio();
    setPlay = false;
    console.log(setPlay);
    
});

// left arrow  click event
arrowLeft.addEventListener('click', function (e) {
    e.stopPropagation();
    if (activeSlide == 0) {
        activeSlide = 4;
    }
    else {
        activeSlide--;
    }

    slides.style.setProperty('transform', `translateX(-${(activeSlide / 5) * 100}%)`)

    for (let i = 0; i < slides.children.length; i++) {
        if (i == activeSlide)
            slides.children[i].style.setProperty('opacity', '1');
        else
            slides.children[i].style.setProperty('opacity', '0');
    }

    for (let i = 0; i < sliderPagination.children.length; i++) {
        if (i == activeSlide)
            sliderPagination.children[i].classList.add('active');
        else
            sliderPagination.children[i].classList.remove('active');
    }

    pauseAudio();
    setPlay = false;
    console.log(setPlay);

});

// pagination click event
Array.from(sliderPagination.children).forEach((pagination, i) => {
    pagination.addEventListener('click', function (e){
        e.stopPropagation();
        activeSlide = i;
        slides.style.setProperty('transform', `translateX(-${(activeSlide / 5) * 100}%)`);
        for (let i = 0; i < slides.children.length; i++) {
            if (i == activeSlide)
                slides.children[i].style.setProperty('opacity', '1');
            else
                slides.children[i].style.setProperty('opacity', '0');
        }
    
        for (let i = 0; i < sliderPagination.children.length; i++) {
            if (i == activeSlide)
                sliderPagination.children[i].classList.add('active');
            else
                sliderPagination.children[i].classList.remove('active');
        }
    });
});

// handle swipe
let startSwipe = false;
let swipeMovement = 0;

function handleStartSwipe(){
    startSwipe = true;
    mainSlider.style.setProperty('cursor', 'grabbing');
}

function handleEndSwipe(){
    if(swipeMovement < -100){
        arrowRight.click();
    }
    else if(swipeMovement > 100){
        arrowLeft.click();
    }
    else{
        slides.style.setProperty('transform', `translateX(-${(activeSlide / 5) * 100}%)`);
    }
    startSwipe = false;
    swipeMovement = 0;
    mainSlider.style.setProperty('cursor', 'grab');
}

function handleInSwipe(e){
    if(startSwipe){
        swipeMovement+=e.movementX;
        let move = `-${(activeSlide / 5) * 100}% + ${swipeMovement}px`;
        slides.style.setProperty('transform', `translateX(calc(${move}))`);
    }
}

mainSlider.addEventListener('mousedown', handleStartSwipe);

document.addEventListener('mouseup', handleEndSwipe);

mainSlider.addEventListener('mousemove',function(e){
    handleInSwipe(e)
});

// handle touch
let startTouch = false;
let touchMovement = 0;
let touchMovementStart = 0;

function handleStartTouch(e){
    startTouch = true;
    touchMovementStart = e.touches[0].pageX;
}

function handleEndTouch(){
    if(touchMovement < -100){
        arrowRight.click();
    }
    else if(touchMovement > 100){
        arrowLeft.click();
    }
    else{
        slides.style.setProperty('transform', `translateX(-${(activeSlide / 5) * 100}%)`);
    }
    startTouch = false;
    touchMovement = 0;
    touchMovementStart = 0;
}

function handleInTouch(e){
    if(startTouch){
        touchMovement = e.touches[0].pageX - touchMovementStart;
        let move = `-${(activeSlide / 5) * 100}% + ${touchMovement}px`;
        slides.style.setProperty('transform', `translateX(calc(${move}))`);
    }
}

mainSlider.addEventListener('touchstart', function(e){
    handleStartTouch(e);
});

document.addEventListener('touchend', handleEndTouch);

mainSlider.addEventListener('touchmove', function(e){
    handleInTouch(e);
});





