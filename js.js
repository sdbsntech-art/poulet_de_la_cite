class WebSecurity {
    constructor() {
        this.securityLevel = 'high';
        this.attempts = 0;
        this.maxAttempts = 3;
        this.init();
    }

    init() {
        this.disableDevTools();
        this.disableRightClick();
        this.disableKeyboardShortcuts();
        this.disableTextSelection();
        this.monitorNetworkActivity();
        this.detectInspection();
        this.createDecoyElements();
        this.obfuscateCode();
    }

    // Désactivation des outils de développement
    disableDevTools() {
        const devToolsCheck = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            
            if (widthThreshold || heightThreshold) {
                this.triggerAlert('DevTools détectés');
                window.location.reload();
            }
        };

        setInterval(devToolsCheck, 1000);

        // Détection via debugger
        const debuggerCheck = () => {
            const start = Date.now();
            debugger;
            if (Date.now() - start > 100) {
                this.triggerAlert('Debugger détecté');
                this.redirectToSafePage();
            }
        };

        setInterval(debuggerCheck, 2000);
    }

    // Désactivation du clic droit
    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.triggerAlert('Clic droit bloqué');
            return false;
        });
    }

    // Désactivation des raccourcis clavier
    disableKeyboardShortcuts() {
        const blockedKeys = {
            'F12': 'Outils de développement',
            'F11': 'Plein écran',
            'F5': 'Rafraîchissement',
            'F7': 'Navigation curseur',
            'Ctrl+Shift+I': 'Inspecteur',
            'Ctrl+Shift+J': 'Console',
            'Ctrl+Shift+C': 'Inspecteur',
            'Ctrl+U': 'Code source',
            'Ctrl+S': 'Sauvegarde'
        };

        document.addEventListener('keydown', (e) => {
            const key = e.key;
            const ctrl = e.ctrlKey;
            const shift = e.shiftKey;

            let keyCombo = '';
            if (ctrl && shift) keyCombo = `Ctrl+Shift+${key}`;
            else if (ctrl) keyCombo = `Ctrl+${key}`;
            else if (shift) keyCombo = `Shift+${key}`;
            else keyCombo = key;

            if (blockedKeys[keyCombo]) {
                e.preventDefault();
                e.stopPropagation();
                this.triggerAlert(`Raccourci bloqué: ${blockedKeys[keyCombo]}`);
            }
        }, true);
    }

    // Désactivation de la sélection de texte
    disableTextSelection() {
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });

        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });

        // CSS pour empêcher la sélection
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Surveillance de l'activité réseau
    monitorNetworkActivity() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            console.warn('⚠️ Activité réseau détectée:', args[0]);
            return originalFetch.apply(this, args);
        };

        // Détection des requêtes XHR
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            console.warn('⚠️ Requête XHR détectée:', method, url);
            return originalXHROpen.apply(this, arguments);
        };
    }

    // Détection d'inspection d'éléments
    detectInspection() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    this.triggerAlert('Inspection d\'élément détectée');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style', 'class'],
            subtree: true
        });
    }

    // Création d'éléments leurres
    createDecoyElements() {
        const decoyStyles = `
            .decoy-element {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: 9999;
                opacity: 0.001;
                pointer-events: none;
            }
            .fake-console {
                display: none;
                position: absolute;
                background: #000;
                color: #0f0;
                font-family: monospace;
                padding: 10px;
                border: 1px solid #0f0;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = decoyStyles;
        document.head.appendChild(styleSheet);

        // Élément leurre
        const decoy = document.createElement('div');
        decoy.className = 'decoy-element';
        decoy.setAttribute('data-protected', 'true');
        document.body.appendChild(decoy);
    }

    // Obfuscation du code
    obfuscateCode() {
        // Changement dynamique du code
        setInterval(() => {
            const randomString = Math.random().toString(36).substring(7);
            document.body.setAttribute('data-hash', randomString);
        }, 5000);
    }

    // Déclenchement d'alerte
    triggerAlert(message) {
        this.attempts++;
        
        const alertMessage = `🚨 ALERTE SÉCURITÉ: ${message} | Tentative: ${this.attempts}/${this.maxAttempts}`;
        
        // Console
        console.error(`%c${alertMessage}`, 
            'color: red; font-weight: bold; font-size: 16px; background: black; padding: 10px;');
        
        // Notification visuelle
        this.showVisualAlert(alertMessage);
        
        // Son d'alerte (optionnel)
        this.playAlertSound();

        if (this.attempts >= this.maxAttempts) {
            this.takeAction();
        }
    }

    // Affichage d'alerte visuelle
    showVisualAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 300px;
        `;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 5000);
    }

    // Son d'alerte
    playAlertSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.warn('Audio non supporté');
        }
    }

    // Actions en cas de multiples tentatives
    takeAction() {
        const actions = [
            () => window.location.reload(),
            () => window.location.href = '/404',
            () => document.body.innerHTML = '<h1>Accès non autorisé</h1>',
            () => {
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    color: red;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    z-index: 100000;
                `;
                overlay.textContent = '🚫 ACTIVITÉ SUSPECTE DÉTECTÉE';
                document.body.appendChild(overlay);
            }
        ];

        const action = actions[Math.floor(Math.random() * actions.length)];
        action();
    }

    // Redirection vers une page sécurisée
    redirectToSafePage() {
        window.location.href = '/security-warning';
    }
}

// Initialisation avec configuration avancée
const securityConfig = {
    enableSoundAlerts: true,
    enableVisualAlerts: true,
    enableAutoRedirect: true,
    securityLevel: 'high'
};

// Démarrage de la protection
document.addEventListener('DOMContentLoaded', () => {
    const webSecurity = new WebSecurity();
    
    // Protection supplémentaire contre la suppression
    Object.defineProperty(window, 'webSecurity', {
        value: webSecurity,
        writable: false,
        configurable: false
    });
});

// Protection contre la navigation arrière
history.pushState(null, null, document.URL);
window.addEventListener('popstate', () => {
    history.pushState(null, null, document.URL);
    webSecurity.triggerAlert('Tentative de navigation arrière');
});

// Détection de fermeture d'onglet
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = 'Êtes-vous sûr de vouloir quitter ?';
});

console.log('🔒 Système de sécurité activé - Protection F12, clic droit et raccourcis désactivés');