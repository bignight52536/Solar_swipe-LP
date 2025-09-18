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

    // ----- Survey Flow with Data Collection -----
    const sections = Array.from(document.querySelectorAll('.survey-section'));
    if (sections.length === 0) return;

    // Survey data storage
    const surveyData = {
        houseType: '',
        electricPrice: '',
        age: '',
        installPeriod: '',
        address: '',
        name: '',
        phone: '',
        email: '',
        timestamp: ''
    };

    // Response mapping for display
    const responseLabels = {
        houseType: {
            'home-one': '一戸建て',
            'home-two': 'マンション',
            'home-three': 'アパート'
        },
        electricPrice: {
            'price-blue': '〜10,000円',
            'price-sky': '10,001〜15,000円',
            'price-green': '15,001〜20,000円',
            'price-red': '20,001円〜'
        },
        age: {
            '20years': '20代',
            '30years': '30代',
            '40years': '40代',
            '50years': '50代',
            '60years': '60代',
            '70years': '70代以上'
        },
        installPeriod: {
            'period-blue': 'すぐにでも',
            'period-sky': '3ヶ月以内',
            'period-green': '半年以内',
            'period-red': '1年以内'
        }
    };

    // Ensure only the first section is visible initially
    sections.forEach((sec, idx) => {
        if (idx === 0) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    let currentStepIndex = 0;

    function setIconPosition(section, percent) {
        const icon = section.querySelector('.progress-icon');
        const bar = section.querySelector('.progress-bar');
        if (!icon || !bar) return;
        const barRect = bar.getBoundingClientRect();
        const barWidth = barRect.width;
        const leftBase = barRect.left;
        const progressContainer = section.querySelector('.progress');
        if (!(progressContainer instanceof HTMLElement)) return;
        const progressLeft = progressContainer.getBoundingClientRect().left;
        const offsetWithinBar = (barWidth * percent) / 100;
        const iconCenterX = (leftBase - progressLeft) + offsetWithinBar;
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

    // Data collection functions
    function saveHouseType(element) {
        const imgSrc = element.querySelector('img')?.src || '';
        if (imgSrc.includes('home-one')) surveyData.houseType = 'home-one';
        else if (imgSrc.includes('home-two')) surveyData.houseType = 'home-two';
        else if (imgSrc.includes('home-three')) surveyData.houseType = 'home-three';
        console.log('House type saved:', surveyData.houseType);
    }

    function saveElectricPrice(element) {
        const imgSrc = element.querySelector('img')?.src || '';
        if (imgSrc.includes('price-button-blue')) surveyData.electricPrice = 'price-blue';
        else if (imgSrc.includes('price-button-sky')) surveyData.electricPrice = 'price-sky';
        else if (imgSrc.includes('price-button-green')) surveyData.electricPrice = 'price-green';
        else if (imgSrc.includes('price-button-red')) surveyData.electricPrice = 'price-red';
        console.log('Electric price saved:', surveyData.electricPrice);
    }

    function saveAge(element) {
        const imgSrc = element.src || '';
        if (imgSrc.includes('20years')) surveyData.age = '20years';
        else if (imgSrc.includes('30years')) surveyData.age = '30years';
        else if (imgSrc.includes('40years')) surveyData.age = '40years';
        else if (imgSrc.includes('50years')) surveyData.age = '50years';
        else if (imgSrc.includes('60years')) surveyData.age = '60years';
        else if (imgSrc.includes('70years')) surveyData.age = '70years';
        console.log('Age saved:', surveyData.age);
    }

    function saveInstallPeriod(element) {
        const imgSrc = element.querySelector('img')?.src || '';
        if (imgSrc.includes('period-btn-blue')) surveyData.installPeriod = 'period-blue';
        else if (imgSrc.includes('period-btn-sky')) surveyData.installPeriod = 'period-sky';
        else if (imgSrc.includes('period-btn-green')) surveyData.installPeriod = 'period-green';
        else if (imgSrc.includes('period-btn-red')) surveyData.installPeriod = 'period-red';
        console.log('Install period saved:', surveyData.installPeriod);
    }

    function populateAuditSection() {
        // Check if audit elements exist before setting textContent
        const auditElements = {
            house: document.getElementById('audit-house'),
            price: document.getElementById('audit-price'),
            age: document.getElementById('audit-age'),
            period: document.getElementById('audit-period'),
            address: document.getElementById('audit-address'),
            name: document.getElementById('audit-name'),
            phone: document.getElementById('audit-phone'),
            email: document.getElementById('audit-email')
        };

        if (auditElements.house) auditElements.house.textContent = responseLabels.houseType[surveyData.houseType] || '';
        if (auditElements.price) auditElements.price.textContent = responseLabels.electricPrice[surveyData.electricPrice] || '';
        if (auditElements.age) auditElements.age.textContent = responseLabels.age[surveyData.age] || '';
        if (auditElements.period) auditElements.period.textContent = responseLabels.installPeriod[surveyData.installPeriod] || '';
        if (auditElements.address) auditElements.address.textContent = surveyData.address;
        if (auditElements.name) auditElements.name.textContent = surveyData.name;
        if (auditElements.phone) auditElements.phone.textContent = surveyData.phone;
        if (auditElements.email) auditElements.email.textContent = surveyData.email;
    }

    // Google Sheets integration
    async function sendToGoogleSheets(data) {
        try {
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyOHWWzYTiqCVHKrOZvS3r5aSDkTu4_HSBsKCPcpFyoB-0LzfhAk_7AN4AbRMyPxU8U/exec';

            console.log('Sending payload to Google Sheets:', data);

            // Prepare form data
            const params = new URLSearchParams();
            Object.entries(data).forEach(([key, value]) => {
                params.append(key, String(value ?? ''));
            });

            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (response.ok) {
                console.log('Form submitted successfully');
                return true;
            } else {
                console.error('Google Sheets response error:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error sending data to Google Sheets:', error);
            return false;
        }
    }
    

    updateProgress();

    // Auto-advance for first 4 sections with data collection
    sections.slice(0, 4).forEach((section, sectionIndex) => {
        const answer = section.querySelector('.answer');
        if (!answer) return;
        
        answer.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;
            const backBtn = target.closest('.back-btn');
            if (backBtn) return;
            
            let clickable = null;
            
            // Handle different section types
            if (sectionIndex === 0) { // House type
                clickable = target.closest('.house-survey');
                if (clickable) saveHouseType(clickable);
            } else if (sectionIndex === 1) { // Electric price
                clickable = target.closest('.price-survey');
                if (clickable) saveElectricPrice(clickable);
            } else if (sectionIndex === 2) { // Age
                clickable = target.closest('img');
                if (clickable && clickable.alt.includes('years')) saveAge(clickable);
            } else if (sectionIndex === 3) { // Install period
                clickable = target.closest('.period-survey');
                if (clickable) saveInstallPeriod(clickable);
            }
            
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

    // Address section (step 5)
    const addressSection = sections[4];
    if (addressSection) {
        const backBtn = addressSection.querySelector('.back-btn');
        if (backBtn) backBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            setActiveSection(currentStepIndex - 1); 
        });
        
        const nextBtn = addressSection.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const select = addressSection.querySelector('select.address-select');
                if (select && select instanceof HTMLSelectElement && select.value) {
                    surveyData.address = select.options[select.selectedIndex].text;
                    console.log('Address saved:', surveyData.address);
                    setActiveSection(currentStepIndex + 1);
                } else if (select) {
                    select.focus();
                }
            });
        }
    }

    // Info section (step 6)
    const infoSection = sections[5];
    if (infoSection) {
        const backBtn = infoSection.querySelector('.back-btn');
        if (backBtn) backBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            setActiveSection(currentStepIndex - 1); 
        });
        
        const nextBtn = infoSection.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const name = infoSection.querySelector('#name');
                const phone = infoSection.querySelector('#phone');
                const email = infoSection.querySelector('#email');
                const valid = (el) => el && el instanceof HTMLInputElement && el.value.trim() !== '';
                
                if (valid(name) && valid(phone) && valid(email)) {
                    surveyData.name = name.value.trim();
                    surveyData.phone = phone.value.trim();
                    surveyData.email = email.value.trim();
                    surveyData.timestamp = new Date().toISOString();
                    
                    console.log('Contact info saved:', {
                        name: surveyData.name,
                        phone: surveyData.phone,
                        email: surveyData.email
                    });
                    
                    populateAuditSection();
                    setActiveSection(currentStepIndex + 1);
                } else {
                    if (!valid(name) && name && name instanceof HTMLInputElement) name.focus();
                    else if (!valid(phone) && phone && phone instanceof HTMLInputElement) phone.focus();
                    else if (!valid(email) && email && email instanceof HTMLInputElement) email.focus();
                }
            });
        }
    }

    // Audit section (step 7)
    const auditSection = sections[6];
    if (auditSection) {
        const backBtn = auditSection.querySelector('.back-btn');
        if (backBtn) backBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            setActiveSection(currentStepIndex - 1); 
        });
        
        const submitBtn = auditSection.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                submitBtn.disabled = true;
                submitBtn.textContent = '送信中...';
                
                // Prepare data for Google Sheets
                const sheetData = {
                    timestamp: surveyData.timestamp,
                    houseType: responseLabels.houseType[surveyData.houseType] || surveyData.houseType,
                    electricPrice: responseLabels.electricPrice[surveyData.electricPrice] || surveyData.electricPrice,
                    age: responseLabels.age[surveyData.age] || surveyData.age,
                    installPeriod: responseLabels.installPeriod[surveyData.installPeriod] || surveyData.installPeriod,
                    address: surveyData.address,
                    name: surveyData.name,
                    phone: surveyData.phone,
                    email: surveyData.email
                };
                
                console.log('Submitting survey data:', sheetData);
                
                const success = await sendToGoogleSheets(sheetData);
                
                if (success) {
                    setActiveSection(currentStepIndex + 1); // Go to thanks page
                } else {
                    alert('送信に失敗しました。もう一度お試しください。');
                    submitBtn.disabled = false;
                    submitBtn.textContent = '送信する';
                }
            });
        }
    }

    // Keep progress aligned on resize
    window.addEventListener('resize', updateProgress);
});