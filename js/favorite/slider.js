document.addEventListener("DOMContentLoaded", function() {
    let carousel = document.querySelector(".carousel");
    const carouselContainer = document.querySelector(".carousel-container");
    const prevButton = document.querySelector(".prev-button");
    const nextButton = document.querySelector(".next-button");

    let isDragging = false;
    let startPoint;
    let touchOffset = 0;

    const cardWidth = 300;
    const cardGap = 20;
    let cardsPerScreen;
    let carouselWidth = carousel.offsetWidth;
    let carouselContainerWidth = carouselContainer.scrollWidth;
    let maxScroll;
    let currentScroll;

    function init() {
        currentScroll = currentIndex * (cardWidth + cardGap);
        cardsPerScreen = Math.floor((carouselWidth - cardGap) / (cardWidth + cardGap));
        carouselWidth = carousel.offsetWidth;
        maxScroll = carouselContainerWidth - carouselWidth;
        console.log(maxScroll, currentScroll)
        if (maxScroll < currentScroll) {
            console.log('2')
            carousel.style.transform = `translateX(-${maxScroll}px)`;
        }
    }

    let currentIndex = 0;
    init();

    function updateButtons() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= carousel.children.length - cardsPerScreen;
    }

    function handleTouchStart(event) {
        isDragging = true;
        startPoint = event.touches[0].clientX;
        touchOffset = 0;
    }

    function handleTouchMove(event) {
        if (isDragging) {
            const touchPoint = event.touches[0].clientX;
            touchOffset = startPoint - touchPoint;
            carousel.style.transform = `translateX(-${currentIndex * (cardWidth + cardGap) + touchOffset}px)`;
        }
    }

    function handleTouchEnd() {
        if (isDragging) {
            isDragging = false;
            currentIndex += touchOffset > 50 ? 1 : touchOffset < -50 ? -1 : 0;
            currentIndex = Math.max(0, Math.min(currentIndex, carousel.children.length - cardsPerScreen));
            if (currentIndex === 0) {
                carousel.style.transform = `translateX(0)`;
            } else if (maxScroll < currentIndex * (cardWidth + cardGap)) {
                carousel.style.transform = `translateX(-${maxScroll}px)`;
            } else {
                carousel.style.transform = `translateX(-${currentIndex * (cardWidth + cardGap)}px)`;
            }
            updateButtons();
        }
    }

    prevButton.addEventListener("click", function() {
        if (currentIndex > 0) {
            currentIndex--;
            carousel.style.transform = `translateX(-${currentIndex * (cardWidth + cardGap)}px)`;

            if (currentIndex === 0) {
                carousel.style.transform = `translateX(0)`;
            }

            updateButtons();
        }
    });

    nextButton.addEventListener("click", function() {
        if (currentIndex < carousel.children.length - cardsPerScreen) {
            currentIndex++;

            if (currentIndex === carousel.children.length - cardsPerScreen) {
                let offset = carouselContainerWidth - carouselWidth;
                carousel.style.transform = `translateX(-${offset}px)`;
            } else {
                carousel.style.transform = `translateX(-${currentIndex * (cardWidth + cardGap)}px)`;
            }

            updateButtons();
        }
    });


    window.addEventListener("resize", function() {
        init();
        // carousel.style.transform = `translateX(-${currentIndex * (cardWidth + cardGap)}px)`;
        updateButtons();
    });

    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);

    updateButtons();
});
