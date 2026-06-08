/* Slider chic + Lightbox — Le Poulailler */
(function () {
    'use strict';

    var GALLERY_IMAGES = [
        { src: 'assettes/FB_IMG_1755942816079.jpg', title: 'Élevage en plein air', desc: 'Nos poulets profitent d\'un espace naturel' },
        { src: 'assettes/FB_IMG_1755942915738.jpg', title: 'Habitat naturel', desc: 'Un environnement sain et respectueux' },
        { src: 'assettes/FB_IMG_1755943153761.jpg', title: 'Bien-être animal', desc: 'Le respect de nos volailles est notre priorité' },
        { src: 'assettes/FB_IMG_1755943422726.jpg', title: 'Qualité supérieure', desc: 'Des poulets de chair d\'exception' },
        { src: 'assettes/FB_IMG_1756028450643.jpg', title: 'Ferme familiale', desc: 'Une tradition transmise de génération en génération' },
        { src: 'assettes/FB_IMG_1756028568958.jpg', title: 'Alimentation naturelle', desc: 'Céréales sans OGM, produites sur place' },
        { src: 'assettes/FB_IMG_1756028754785.jpg', title: 'Soins quotidiens', desc: 'Une attention constante à chaque volaille' },
        { src: 'assettes/FB_IMG_1756064943410.jpg', title: 'Plein air garanti', desc: 'Liberté de mouvement en permanence' },
        { src: 'assettes/FB_IMG_1756065039171.jpg', title: 'Excellence', desc: 'Des standards élevés à chaque étape' },
        { src: 'assettes/FB_IMG_1756065057404.jpg', title: 'Tradition', desc: 'Plus de 8 ans d\'expérience et de passion' },
        { src: 'assettes/IMG-20250828-WA0022.jpg', title: 'Passion', desc: 'Élevés avec amour et dévouement' },
        { src: 'assettes/IMG-20250828-WA0023.jpg', title: 'Quotidien à la ferme', desc: 'Chaque jour, le soin de nos poulets' },
        { src: 'assettes/IMG-20250828-WA0024.jpg', title: 'Croissance saine', desc: 'Un développement naturel et harmonieux' },
        { src: 'assettes/IMG-20250828-WA0025.jpg', title: 'Notre équipe', desc: 'Des professionnels passionnés' },
        { src: 'assettes/IMG-20250828-WA0026.jpg', title: 'Livraison directe', desc: 'Fraîcheur garantie à votre porte' }
    ];

    var currentSlide = 0;
    var totalSlides = GALLERY_IMAGES.length + 1;
    var autoplayInterval = null;
    var autoplayDelay = 5000;
    var isPlaying = true;
    var progressRAF = null;
    var progressStart = 0;

    function buildSlider() {
        var container = document.getElementById('chicSlider');
        if (!container) return;

        var html = '';

        html += '<div class="chic-slide chic-slide-vlog active" data-index="0">';
        html += '  <div class="vlog-badge"><i class="fas fa-play-circle"></i> Notre Vlog</div>';
        html += '  <div class="vlog-mosaic">';
        GALLERY_IMAGES.forEach(function (img, i) {
            html += '<div class="vlog-tile" style="animation-delay:' + (i * 0.08) + 's" data-lightbox="' + i + '">';
            html += '  <img src="' + img.src + '" alt="' + img.title + '" loading="lazy">';
            html += '</div>';
        });
        html += '  </div>';
        html += '  <div class="vlog-overlay">';
        html += '    <h3>La vie au Poulailler</h3>';
        html += '    <p>Découvrez notre quotidien en images</p>';
        html += '  </div>';
        html += '</div>';

        GALLERY_IMAGES.forEach(function (img, i) {
            html += '<div class="chic-slide chic-slide-single" data-index="' + (i + 1) + '">';
            html += '  <div class="slide-image-wrap" data-lightbox="' + i + '">';
            html += '    <img src="' + img.src + '" alt="' + img.title + '" loading="lazy">';
            html += '  </div>';
            html += '  <div class="slide-caption">';
            html += '    <h4>' + img.title + '</h4>';
            html += '    <p>' + img.desc + '</p>';
            html += '  </div>';
            html += '</div>';
        });

        container.innerHTML = html;

        var dotsContainer = document.getElementById('sliderDots');
        if (dotsContainer) {
            var dotsHtml = '<button class="slider-dot vlog-dot active" data-slide="0" aria-label="Vlog"></button>';
            GALLERY_IMAGES.forEach(function (_, i) {
                dotsHtml += '<button class="slider-dot" data-slide="' + (i + 1) + '" aria-label="Image ' + (i + 1) + '"></button>';
            });
            dotsContainer.innerHTML = dotsHtml;
        }
    }

    function goToSlide(index) {
        var slides = document.querySelectorAll('.chic-slide');
        var dots = document.querySelectorAll('.slider-dot');
        if (!slides.length) return;

        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;

        slides.forEach(function (s, i) {
            s.classList.toggle('active', parseInt(s.dataset.index) === currentSlide);
        });

        dots.forEach(function (d) {
            d.classList.toggle('active', parseInt(d.dataset.slide) === currentSlide);
        });

        var counter = document.getElementById('sliderCounter');
        if (counter) {
            counter.textContent = (currentSlide + 1) + ' / ' + totalSlides;
        }

        resetProgress();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function resetProgress() {
        var bar = document.getElementById('sliderProgress');
        if (!bar) return;
        bar.style.width = '0%';
        progressStart = Date.now();
        if (progressRAF) cancelAnimationFrame(progressRAF);
        if (isPlaying) animateProgress();
    }

    function animateProgress() {
        var bar = document.getElementById('sliderProgress');
        if (!bar || !isPlaying) return;
        var elapsed = Date.now() - progressStart;
        var pct = Math.min((elapsed / autoplayDelay) * 100, 100);
        bar.style.width = pct + '%';
        if (pct < 100) {
            progressRAF = requestAnimationFrame(animateProgress);
        }
    }

    function startAutoplay() {
        stopAutoplay();
        if (!isPlaying) return;
        resetProgress();
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
        if (progressRAF) {
            cancelAnimationFrame(progressRAF);
            progressRAF = null;
        }
    }

    function toggleAutoplay() {
        isPlaying = !isPlaying;
        var btn = document.getElementById('autoplayBtn');
        if (btn) btn.classList.toggle('paused', !isPlaying);
        if (isPlaying) startAutoplay();
        else stopAutoplay();
    }

    /* Lightbox */
    var lightboxIndex = 0;

    function openLightbox(index) {
        lightboxIndex = index;
        var lb = document.getElementById('lightbox');
        var img = document.getElementById('lightboxImage');
        var counter = document.getElementById('lightboxCounter');
        if (!lb || !img) return;
        img.src = GALLERY_IMAGES[index].src;
        img.alt = GALLERY_IMAGES[index].title;
        if (counter) counter.textContent = (index + 1) + ' / ' + GALLERY_IMAGES.length;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
        stopAutoplay();
    }

    function closeLightbox() {
        var lb = document.getElementById('lightbox');
        if (lb) lb.classList.remove('active');
        document.body.style.overflow = '';
        if (isPlaying) startAutoplay();
    }

    function lightboxNav(dir) {
        lightboxIndex = (lightboxIndex + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
        var img = document.getElementById('lightboxImage');
        var counter = document.getElementById('lightboxCounter');
        if (img) {
            img.style.opacity = '0';
            setTimeout(function () {
                img.src = GALLERY_IMAGES[lightboxIndex].src;
                img.alt = GALLERY_IMAGES[lightboxIndex].title;
                img.style.opacity = '1';
            }, 200);
        }
        if (counter) counter.textContent = (lightboxIndex + 1) + ' / ' + GALLERY_IMAGES.length;
    }

    function bindEvents() {
        var prevBtn = document.getElementById('sliderPrev');
        var nextBtn = document.getElementById('sliderNext');
        var autoplayBtn = document.getElementById('autoplayBtn');

        if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoplay(); });
        if (autoplayBtn) autoplayBtn.addEventListener('click', toggleAutoplay);

        document.getElementById('sliderDots').addEventListener('click', function (e) {
            var dot = e.target.closest('.slider-dot');
            if (!dot) return;
            goToSlide(parseInt(dot.dataset.slide));
            startAutoplay();
        });

        document.getElementById('chicSlider').addEventListener('click', function (e) {
            var tile = e.target.closest('[data-lightbox]');
            if (tile) openLightbox(parseInt(tile.dataset.lightbox));
        });

        document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
        document.getElementById('lightboxPrev').addEventListener('click', function () { lightboxNav(-1); });
        document.getElementById('lightboxNext').addEventListener('click', function () { lightboxNav(1); });

        document.getElementById('lightbox').addEventListener('click', function (e) {
            if (e.target === this) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            var lb = document.getElementById('lightbox');
            if (lb && lb.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') lightboxNav(-1);
                if (e.key === 'ArrowRight') lightboxNav(1);
            } else {
                if (e.key === 'ArrowLeft') { prevSlide(); startAutoplay(); }
                if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
            }
        });

        var touchStartX = 0;
        var slider = document.getElementById('chicSlider');
        if (slider) {
            slider.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
            slider.addEventListener('touchend', function (e) {
                var diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) nextSlide(); else prevSlide();
                    startAutoplay();
                }
            }, { passive: true });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        buildSlider();
        bindEvents();
        startAutoplay();
    });
})();
