// Slider Sederhana untuk index.html
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        // Jalankan slide setiap 4 detik
        setInterval(nextSlide, 2000);
    }

    const gallery = document.querySelector(".gallery-grid");

    if (gallery) {
        const items = Array.from(gallery.querySelectorAll('.gallery-item'));
        const totalOriginalItems = items.length;
        
        // Clone 4 items (maksimal item yang terlihat di layar) untuk seamless loop
        for (let i = 0; i < 4; i++) {
            if (items[i]) {
                const clone = items[i].cloneNode(true);
                gallery.appendChild(clone);
            }
        }

        // Fungsi easing (ease-in-out) untuk pergerakan yang sangat smooth
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        function smoothScrollTo(element, target, duration) {
            const start = element.scrollLeft;
            const change = target - start;
            let startTime = null;

            function animateScroll(currentTime) {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                
                const val = easeInOutQuad(timeElapsed, start, change, duration);
                element.scrollLeft = val;
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animateScroll);
                } else {
                    element.scrollLeft = target; // Pastikan posisi akhir presisi
                }
            }
            requestAnimationFrame(animateScroll);
        }

        let isAnimating = false;

        setInterval(() => {
            if (isAnimating) return; 
            
            // Hitung lebar 1 item + gap (20px) secara dinamis
            const itemWidth = gallery.querySelector('.gallery-item').offsetWidth + 20; 
            
            // Tentukan index saat ini berdasarkan posisi scroll aktual (mendukung resize/geser manual)
            let currentIndex = Math.round(gallery.scrollLeft / itemWidth);
            currentIndex++;

            const targetScroll = currentIndex * itemWidth;
            const animationDuration = 600; // 600ms duration (smooth)

            isAnimating = true;
            smoothScrollTo(gallery, targetScroll, animationDuration);

            // Setelah animasi selesai, cek apakah sudah masuk ke area clone
            setTimeout(() => {
                isAnimating = false;
                if (currentIndex >= totalOriginalItems) {
                    // Reset ke awal tanpa terlihat (karena visual clone sama persis)
                    gallery.scrollLeft = 0;
                }
            }, animationDuration + 50);
        }, 2000); 
    }

    // Interaksi Formulir Kontak (Simulasi)
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Terima kasih! Pesan Anda telah dikirim ke tim Wardah.');
            form.reset();
        });
    }

    // Intersection Observer untuk animasi Fade-In saat scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animasi hanya berjalan sekali
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});