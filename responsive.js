/* responsive.js - ajustements runtime pour header offset et détection overflow */
(function () {
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