// Wait for DOM
document.addEventListener("DOMContentLoaded", function () {
    const img = document.getElementById('mainAnimeImg');
    const imgClone = document.getElementById('mainAnimeImgClone');
    const container = img?.parentElement;

    // Set image height after load
    if (img) {
        img.onload = function () {
            const imgHeight = img.height;
            if (container) container.style.height = imgHeight + "px";
            if (imgClone) imgClone.style.top = imgHeight + "px";
            animate(imgHeight);
        };

        // If already loaded
        if (img.complete) {
            const imgHeight = img.height;
            if (container) container.style.height = imgHeight + "px";
            if (imgClone) imgClone.style.top = imgHeight + "px";
            animate(imgHeight);
        }
    }

    function animate(imgHeight) {
        let pos = 0;
        const speed = 0.7; // px per frame
        function loop() {
            pos -= speed;
            if (pos <= -imgHeight) {
                pos = 0;
            }
            if (img) img.style.top = pos + "px";
            if (imgClone) imgClone.style.top = (pos + imgHeight) + "px";
            requestAnimationFrame(loop);
        }
        loop();
    }

    // ----- Survey Flow -----
    const sections = Array.from(document.querySelectorAll('.survey-section'));
    if (sections.length === 0) return;

    // Ensure only the first section is visible initially
    sections.forEach((sec, idx) => {
        if (idx === 0) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    let currentStepIndex = 0;

    function getBarWidthPx(section) {
        const bar = section.querySelector('.progress-bar');
        if (!bar) return 0;
        const rect = bar.getBoundingClientRect();
        return rect.width; // responsive actual width
    }

    function setIconPosition(section, percent) {
        const icon = section.querySelector('.progress-icon');
        const bar = section.querySelector('.progress-bar');
        if (!icon || !bar) return;
        const barRect = bar.getBoundingClientRect();
        const barWidth = barRect.width; // px
        const leftBase = barRect.left; // viewport left of bar
        // parent .progress is positioned with left padding; we will set icon's left relative to .progress container
        const progressContainer = section.querySelector('.progress');
        if (!(progressContainer instanceof HTMLElement)) return;
        const progressLeft = progressContainer.getBoundingClientRect().left;
        const offsetWithinBar = (barWidth * percent) / 100;
        const iconCenterX = (leftBase - progressLeft) + offsetWithinBar;
        // Center the icon (32px) on the position
        icon.style.left = Math.max(0, iconCenterX - 16) + 'px';
    }

    function setActiveSection(index) {
        if (index < 0 || index >= sections.length) return;
        const prev = sections[currentStepIndex];
        const next = sections[index];
        if (prev === next) return;
        prev.classList.remove('active');
        next.classList.add('active');
        currentStepIndex = index;
        updateProgress();
        next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function overallPercent() {
        const total = sections.length - 1; // last is thanks
        const clamped = Math.min(currentStepIndex, total);
        return Math.round((clamped) / total * 100);
    }

    function updateProgress() {
        const percent = overallPercent();
        sections.forEach((sec, idx) => {
            const bar = sec.querySelector('.progress-bar');
            if (bar) {
                const fill = idx <= currentStepIndex ? percent : 0;
                bar.style.setProperty('--progress', fill + '%');
            }
            setIconPosition(sec, idx < currentStepIndex ? 100 : idx === currentStepIndex ? percent : 0);
        });
    }

    updateProgress();

    // Auto-advance for first 4 sections only when clicking inside the answer container
    sections.slice(0, 4).forEach((section) => {
        const answer = section.querySelector('.answer');
        if (!answer) return;
        answer.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;
            const backBtn = target.closest('.back-btn');
            if (backBtn) return; // ignore clicks on back button area
            const clickable = target.closest('.house-survey, .price-survey, .age-survey, .period-survey, img');
            if (!clickable) return;
            e.preventDefault();
            setActiveSection(currentStepIndex + 1);
        });
        const backBtn = section.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveSection(currentStepIndex - 1);
            });
        }
    });

    // Back buttons for sections 5–6, and next handlers
    const addressSection = sections[4];
    if (addressSection) {
        const backBtn = addressSection.querySelector('.back-btn');
        if (backBtn) backBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); setActiveSection(currentStepIndex - 1); });
        const nextBtn = addressSection.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const select = addressSection.querySelector('select.address-select');
                if (select && select instanceof HTMLSelectElement && select.value) {
                    setActiveSection(currentStepIndex + 1);
                } else if (select) {
                    select.focus();
                }
            });
        }
    }

    const infoSection = sections[5];
    if (infoSection) {
        const backBtn = infoSection.querySelector('.back-btn');
        if (backBtn) backBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); setActiveSection(currentStepIndex - 1); });
        const nextBtn = infoSection.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const name = infoSection.querySelector('#name');
                const phone = infoSection.querySelector('#phone');
                const email = infoSection.querySelector('#email');
                const valid = (el) => el && el instanceof HTMLInputElement && el.value.trim() !== '';
                if (valid(name) && valid(phone) && valid(email)) {
                    setActiveSection(currentStepIndex + 1);
                } else {
                    if (!valid(name) && name && name instanceof HTMLInputElement) name.focus();
                    else if (!valid(phone) && phone && phone instanceof HTMLInputElement) phone.focus();
                    else if (!valid(email) && email && email instanceof HTMLInputElement) email.focus();
                }
            });
        }
    }

    // Keep progress aligned on resize
    window.addEventListener('resize', updateProgress);
});