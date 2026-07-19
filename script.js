document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SMOOTH SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 2. DYNAMIC GALLERY CONFIGURATION ---
    // You can effortlessly scale this array to hundreds of assets.
  
  // Pikyes AMS Canlı Web Sitesi Galeri Veritabanı
const galleryData = [
    { id: 1, src: './image1.png', category: 'Otomasyon', title: 'TAM ENTEGRE ÜRETİM', desc: 'Seri üretim hattı çözümleri.' },
    { id: 2, src: './image2.png', category: 'Teknoloji', title: 'MİKRON İŞÇİLİK', desc: 'Kusursuz dikiş performansı.' },
    { id: 3, src: './image3.png', category: 'Kapasite', title: 'KÜRESEL TEDARİK', desc: 'Sınırsız üretim gücü.' },
    { id: 4, src: './main-image.png', category: 'Vitrin', title: 'ANA ÜNİTE FÜZYONU', desc: 'Selahattin Usta mühendisliği.' },
    { id: 5, src: './image4.png', category: 'Kapasite', title: 'YÜKSEK PERFORMANS', desc: 'Durmaksızın üretim gücü.' },
    { id: 6, src: './image5.png', category: 'Teknoloji', title: 'HASSAS DOKUNUŞ', desc: 'Milimetrik dikiş hassasiyeti.' },
    { id: 7, src: './image6.png', category: 'Vitrin', title: 'ENDÜSTRİYEL GÜÇ', desc: 'Sınır tanımayan donanım.' },
    { id: 8, src: './adller-699.png', category: 'Dikiş', title: 'ADLLER 699', desc: 'Ağır ve kalın malzemelerde üstün endüstriyel performans.' },
    { id: 9, src: './pfaff-335.png', category: 'Dikiş', title: 'PFAFF 335', desc: 'Kalın malzemeler için yüksek torklu kol dikiş makinası.' },
    { id: 10, src: './pikyes-hikaye.png', category: 'Miras', title: 'BİR ATÖLYEDEN İSTANBUL\'A', desc: 'Her makinede alın teri, her işimizde helal kazanç var.' },
    { id: 11, src: './pikyes-dikis.png', category: 'Teknoloji', title: 'PİKYES AMS DİKİŞ', desc: 'Geleceğin akıllı, hassas ve verimli dikiş teknolojisi.' },
    { id: 12, src: './pikyes-kesim-poster.png', category: 'Kesim', title: 'AMS KESİM SİSTEMİ', desc: 'Endüstriyel kesimde yüksek hız ve maksimum verim.' },
    { id: 13, src: './pikyes-kesim-makine.png', category: 'Kesim', title: 'PİKYES 100-CXH', desc: 'Akıllı kontrol paneli ile güvenilir üretim standartları.' }
];

    // Extract unique categories and prepend 'Tümü' (All)
    const categories = ['Tümü', ...new Set(galleryData.map(item => item.category))];

    const galleryContainer = document.getElementById('dynamic-gallery');
    const filtersContainer = document.getElementById('gallery-filters');

    // Render Filter Buttons Dynamically
    if (filtersContainer) {
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn' + (cat === 'Tümü' ? ' active' : '');
            btn.textContent = cat;
            btn.dataset.filter = cat;
            
            btn.addEventListener('click', () => {
                // Update active state styling
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Re-render gallery with filter
                renderGallery(cat);
            });
            
            filtersContainer.appendChild(btn);
        });
    }

    // Render Gallery Items Dynamically
    function renderGallery(filter = 'Tümü') {
        if (!galleryContainer) return;
        
        galleryContainer.innerHTML = ''; // Clear current grid
        
        const filteredData = filter === 'Tümü' 
            ? galleryData 
            : galleryData.filter(item => item.category === filter);
            
        filteredData.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'grid-item';
            // Staggered fade-in animation inline
            itemDiv.style.opacity = '0';
            itemDiv.style.transform = 'translateY(20px)';
            itemDiv.style.transition = `all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.1}s`;
            
            itemDiv.innerHTML = `
                <img src="${item.src}" alt="${item.title}" class="grid-img">
                <div class="grid-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            `;
            
            // Attach Cinematic Lightbox click event
            itemDiv.addEventListener('click', () => openLightbox(item.src, item.title));
            
            galleryContainer.appendChild(itemDiv);

            // Trigger animation immediately after mount
            requestAnimationFrame(() => {
                itemDiv.style.opacity = '1';
                itemDiv.style.transform = 'translateY(0)';
            });
        });
    }

    // Execute initial render
    renderGallery();

    // --- 3. CINEMATIC LIGHTBOX SYSTEM ---
    // Injecting Lightbox DOM so HTML stays pristine
    const lightboxHTML = `
        <div class="lightbox-modal" id="lightbox">
            <div class="lightbox-content">
                <button class="lightbox-close" id="lightbox-close" aria-label="Close">&times;</button>
                <img src="" alt="Enlarged View" class="lightbox-img" id="lightbox-img">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => { lightboxImg.src = ''; }, 400); // Clear memory after CSS transition
        document.body.style.overflow = ''; // Restore background scroll
    }

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Outside-click-to-close functionality
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- 4. WHATSAPP FORM SUBMISSION ---
    window.sendToWhatsApp = function(event) {
        event.preventDefault();
        const form = event.target;
        const name = form.ad_soyad.value;
        const email = form.email.value;
        const message = form.mesaj.value;

        // URL Encode the text to handle spaces and special characters safely
        const waNumber = "905334068044";
        const waText = encodeURIComponent(`Pikyes AMS - Yeni Başvuru:\n\n*Ad Soyad:* ${name}\n*E-posta:* ${email}\n*Mesaj:* ${message}`);
        
        // Open WhatsApp
        window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
        
        // UI Feedback
        const submitBtn = form.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'WHATSAPP\'A YÖNLENDİRİLİYOR...';
        submitBtn.style.background = 'transparent';
        submitBtn.style.color = 'var(--accent-red)';
        
        setTimeout(() => {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.background = 'var(--accent-red)';
            submitBtn.style.color = '#fff';
        }, 3000);
    };
});
