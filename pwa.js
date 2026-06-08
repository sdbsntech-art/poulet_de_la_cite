/* PWA — Service Worker + Install Prompt — Le Poulailler */
(function () {
    'use strict';

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./sw.js').catch(function (err) {
                console.warn('SW registration failed:', err);
            });
        });
    }

    var deferredPrompt = null;
    var banner = null;

    function createBanner() {
        if (banner || localStorage.getItem('pwa-dismissed')) return;

        banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.innerHTML =
            '<img src="assettes/logo-le-poulailler.png" alt="Le Poulailler">' +
            '<div class="pwa-text"><strong>Installer Le Poulailler</strong>Ajoutez l\'app à votre écran d\'accueil</div>' +
            '<button class="pwa-install-btn" id="pwaInstallBtn">Installer</button>' +
            '<button class="pwa-dismiss-btn" id="pwaDismissBtn" aria-label="Fermer">&times;</button>';

        document.body.appendChild(banner);

        setTimeout(function () { banner.classList.add('show'); }, 3000);

        document.getElementById('pwaInstallBtn').addEventListener('click', function () {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function () {
                    deferredPrompt = null;
                    banner.classList.remove('show');
                });
            }
        });

        document.getElementById('pwaDismissBtn').addEventListener('click', function () {
            banner.classList.remove('show');
            localStorage.setItem('pwa-dismissed', '1');
        });
    }

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        createBanner();
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
        document.documentElement.classList.add('pwa-installed');
    }
})();
