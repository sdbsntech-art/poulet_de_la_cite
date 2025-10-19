class WebSecurity {
    constructor() {
        this.attempts = 0;
        this.maxAttempts = 3;
        this.init();
    }

    init() {
        this.disableRightClick();
        this.disableKeyboardShortcuts();
        this.disableTextSelection();
        this.createDecoyElements();
    }

    // Désactivation du clic droit
    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    // Désactivation des raccourcis clavier
    disableKeyboardShortcuts() {
        const blockedKeys = {
            'F12': 'Outils de développement',
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
            else keyCombo = key;

            // Vérification spéciale pour Ctrl+U
            if (ctrl && key.toLowerCase() === 'u') {
                e.preventDefault();
                e.stopPropagation();
                this.handleSecurityBreach('Affichage du code source bloqué');
                return;
            }

            if (blockedKeys[keyCombo]) {
                e.preventDefault();
                e.stopPropagation();
                this.handleSecurityBreach(`Raccourci bloqué: ${blockedKeys[keyCombo]}`);
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

        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Création d'éléments leurres
    createDecoyElements() {
        const decoy = document.createElement('div');
        decoy.style.cssText = `
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            opacity: 0;
            pointer-events: none;
        `;
        decoy.setAttribute('data-protected', 'true');
        document.body.appendChild(decoy);
    }

    // Gestion des violations de sécurité
    handleSecurityBreach(message) {
        this.attempts++;
        
        if (this.attempts >= this.maxAttempts) {
            this.takeAction();
        }
    }

    // Actions en cas de multiples tentatives
    takeAction() {
        window.location.reload();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new WebSecurity();
});