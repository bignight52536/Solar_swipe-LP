// Wait for DOM
document.addEventListener("DOMContentLoaded", function () {
    const img = document.getElementById('mainAnimeImg');
    const imgClone = document.getElementById('mainAnimeImgClone');
    const container = img.parentElement;

    // Set image height after load
    img.onload = function () {
        const imgHeight = img.height;
        container.style.height = imgHeight + "px";
        imgClone.style.top = imgHeight + "px";
        animate(imgHeight);
    };

    // If already loaded
    if (img.complete) {
        const imgHeight = img.height;
        container.style.height = imgHeight + "px";
        imgClone.style.top = imgHeight + "px";
        animate(imgHeight);
    }

    function animate(imgHeight) {
        let pos = 0;
        const speed = 0.7; // px per frame
        function loop() {
            pos -= speed;
            if (pos <= -imgHeight) {
                pos = 0;
            }
            img.style.top = pos + "px";
            imgClone.style.top = (pos + imgHeight) + "px";
            requestAnimationFrame(loop);
        }
        loop();
    }
});