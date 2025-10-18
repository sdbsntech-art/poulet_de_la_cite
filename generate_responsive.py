"""
Script d'aide : crée un fichier CSS responsive + script JS et injecte les liens dans index.html.
Usage (Windows PowerShell / CMD) depuis le dossier du projet :
    python .\generate_responsive.py
Le script crée une sauvegarde index.html.bak avant modification.
"""
from pathlib import Path
import shutil

ROOT = Path(r"c:\Users\SDBSN\Desktop\poulet_de_la_cite")
INDEX = ROOT / "index.html"
BACKUP = ROOT / "index.html.bak"
CSS_FILE = ROOT / "responsive.css"
JS_FILE = ROOT / "responsive.js"

if not INDEX.exists():
    print("Fichier introuvable :", INDEX)
    raise SystemExit(1)

# 1) backup
shutil.copy2(INDEX, BACKUP)
print(f"sauvegarde créée : {BACKUP.name}")

# 2) responsive.css (écrase si déjà existant)
css_content = """
/* responsive.css - améliorations responsive et protection overflow */

/* reset safe box-sizing */
* { box-sizing: border-box; }

/* Empêcher débordement horizontal global */
html, body {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden !important;
    -webkit-font-smoothing: antialiased;
}

/* Forcer wrap sur textes trop longs */
h1,h2,h3,h4,h5,h6,p,a,span,button {
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    white-space: normal;
}

/* Images/media sûrs */
img, video, iframe {
    max-width: 100%;
    height: auto;
    display: block;
}

/* Main wrapper sécurité */
.main-wrapper, .container {
    overflow-x: hidden;
}

/* Sections horizontales : rendre explicite et safe */
.horizontal-scroll-section {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

/* éviter que .scroll-container force overflow global */
.scroll-container {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    min-width: 100%; /* évite que min-content provoque overflow global */
    scroll-snap-type: x mandatory;
}

/* scroll items adaptatifs */
.scroll-item { flex: 0 0 auto; width: 280px; max-width: 90vw; }

/* small screens adjustments */
@media (max-width: 992px) {
    .hero { background-attachment: scroll !important; }
    .hero-content, .about-content { grid-template-columns: 1fr !important; }
}

/* corrective utility class (appliquée par JS si overflow détecté) */
.fix-overflow {
    max-width: 100% !important;
    overflow-wrap: break-word !important;
}

/* léger style pour indiquer problèmes (debug, peut être retiré) */
.debug-overflow {
    outline: 2px dashed rgba(255, 0, 0, 0.25);
}
"""

CSS_FILE.write_text(css_content.strip(), encoding="utf-8")
print(f"{CSS_FILE.name} écrit.")

# 3) responsive.js (écrase si déjà existant)
js_content = r"""
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
"""

JS_FILE.write_text(js_content.strip(), encoding="utf-8")
print(f"{JS_FILE.name} écrit.")

# 4) injecter lien CSS et script JS dans index.html (si pas déjà présent)
html = INDEX.read_text(encoding="utf-8")

def ensure_in_head(tag):
    if tag in html:
        return html
    # insérer juste avant </head>
    if "</head>" in html:
        return html.replace("</head>", tag + "\n</head>")
    # sinon préfixer au début
    return tag + "\n" + html

css_tag = '<link rel="stylesheet" href="responsive.css">'
js_tag = '<script src="responsive.js" defer></script>'

if css_tag not in html:
    html = ensure_in_head(css_tag)

# inject JS avant </body>
if js_tag not in html:
    if "</body>" in html:
        html = html.replace("</body>", js_tag + "\n</body>")
    else:
        html = html + "\n" + js_tag

INDEX.write_text(html, encoding="utf-8")
print("index.html mis à jour : lien CSS + script JS injectés (si absent).")
print("Terminé. Vérifiez le rendu et retirez la classe debug-overflow si tout est OK.")