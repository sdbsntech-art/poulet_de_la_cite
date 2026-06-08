/* responsive.js - header, menu mobile, offsets */
(function () {
    function initMobileMenu() {
        var header = document.getElementById('header');
        var mobileMenuBtn = document.getElementById('mobileMenuBtn');
        var nav = document.getElementById('nav');
        if (!mobileMenuBtn || !nav) return;

        mobileMenuBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = nav.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            mobileMenuBtn.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        document.addEventListener('click', function (e) {
            if (!nav.classList.contains('active')) return;
            if (header && header.contains(e.target)) return;
            nav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });

        if (header) {
            window.addEventListener('scroll', function () {
                header.classList.toggle('scrolled', window.scrollY > 100);
            }, { passive: true });
        }
    }

    function initWaFloat() {
        var wa = document.getElementById('waFloat');
        var btn = document.getElementById('waFloatToggle');
        if (!wa || !btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            wa.classList.toggle('open');
        });

        wa.querySelectorAll('.wa-float-menu a').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        });

        document.addEventListener('click', function (e) {
            if (!wa.contains(e.target)) wa.classList.remove('open');
        });
    }

    function updateBodyOffsets() {
        var header = document.getElementById('header');
        if (!header) return;
        var h = header.getBoundingClientRect().height;
        document.body.style.paddingTop = h + 'px';
        // safe bottom padding (mobile gestures)
        var bottom = Math.max(12, Math.round(window.innerHeight * 0.02));
        document.body.style.paddingBottom = 'env(safe-area-inset-bottom, ' + bottom + 'px)';
    }

    function clampOverflowingElements() {
        // détecte éléments plus larges que la fenêtre et applique une classe corrective
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var els = Array.prototype.slice.call(document.querySelectorAll('body *'));
        els.forEach(function (el) {
            try {
                var r = el.getBoundingClientRect();
                if (r.width > w + 1) {
                    el.classList.add('fix-overflow', 'debug-overflow');
                    console.warn('Overflow fixer appliqué:', el, Math.round(r.width), 'px >', w, 'px');
                } else {
                    // retire la classe debug si plus nécessaire
                    if (el.classList.contains('debug-overflow')) {
                        el.classList.remove('debug-overflow');
                    }
                }
            } catch (e) { /* certains éléments peuvent échouer */ }
        });
    }

    // Exécutions initiales
    window.addEventListener('load', function () {
        initMobileMenu();
        initWaFloat();
        updateBodyOffsets();
        clampOverflowingElements();
    }, {passive: true});

    // Au redimensionnement et rotation
    var to;
    window.addEventListener('resize', function () {
        clearTimeout(to);
        to = setTimeout(function () {
            updateBodyOffsets();
            clampOverflowingElements();
        }, 150);
    });

    // observe mutations (chargement d'images, contenu dynamique)
    if (window.MutationObserver) {
        var mo = new MutationObserver(function () {
            clampOverflowingElements();
        });
        mo.observe(document.body, { childList: true, subtree: true, attributes: true });
    }
})();