/* responsive.js - header, navigation pills, offsets */
(function () {
    function initHeader() {
        var header = document.getElementById('header');
        if (!header) return;

        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 100);
        }, { passive: true });

        var navLinks = document.querySelectorAll('nav#nav a[href^="#"]');
        if (!navLinks.length || !('IntersectionObserver' in window)) return;

        var map = [];
        navLinks.forEach(function (link) {
            var id = link.getAttribute('href').slice(1);
            if (!id) return;
            var sec = document.getElementById(id);
            if (sec) map.push({ link: link, sec: sec });
        });

        if (!map.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    map.forEach(function (item) {
                        item.link.classList.toggle('active', item.sec === entry.target);
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-90px 0px -55% 0px' });

        map.forEach(function (item) {
            observer.observe(item.sec);
        });
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
        var bottom = Math.max(12, Math.round(window.innerHeight * 0.02));
        document.body.style.paddingBottom = 'env(safe-area-inset-bottom, ' + bottom + 'px)';
    }

    function clampOverflowingElements() {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var els = Array.prototype.slice.call(document.querySelectorAll('body *'));
        els.forEach(function (el) {
            try {
                var r = el.getBoundingClientRect();
                if (r.width > w + 1) {
                    el.classList.add('fix-overflow', 'debug-overflow');
                } else if (el.classList.contains('debug-overflow')) {
                    el.classList.remove('debug-overflow');
                }
            } catch (e) { /* ignore */ }
        });
    }

    window.addEventListener('load', function () {
        initHeader();
        initWaFloat();
        updateBodyOffsets();
        clampOverflowingElements();
    }, { passive: true });

    var to;
    window.addEventListener('resize', function () {
        clearTimeout(to);
        to = setTimeout(function () {
            updateBodyOffsets();
            clampOverflowingElements();
        }, 150);
    });

    if (window.MutationObserver) {
        var mo = new MutationObserver(function () {
            updateBodyOffsets();
            clampOverflowingElements();
        });
        mo.observe(document.body, { childList: true, subtree: true, attributes: true });
    }
})();
