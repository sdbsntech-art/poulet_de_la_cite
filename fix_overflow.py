import sys
from pathlib import Path

html_path = Path(r"c:\Users\SDBSN\Desktop\poulet_de_la_cite\index.html")
if not html_path.exists():
    print("Fichier introuvable:", html_path)
    sys.exit(1)

content = html_path.read_text(encoding="utf-8")

start_marker = "/* ===== CORRECTION DU DÉFILEMENT HORIZONTAL ===== */"
end_marker = "/* ===== BASE STYLES PROFESSIONNELS ===== */"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Les marqueurs n'ont pas été trouvés. Vérifiez le fichier.")
    sys.exit(1)

new_block = """/* ===== CORRECTION DU DÉBORDEMENT HORIZONTAL ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* layout safe defaults */
html {
    scroll-behavior: smooth;
    font-size: 16px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden; /* empêcher tout débordement horizontal global */
}

body {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-dark);
    background-color: var(--white);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden; /* sécurité */
    width: 100%;
    max-width: 100%;
    position: relative;
    /* safe area pour mobiles (iOS) */
    padding-bottom: env(safe-area-inset-bottom, 16px);
}

/* Container principal pour contrôler la largeur */
.main-wrapper {
    width: 100%;
    max-width: var(--container-max-width);
    margin: 0 auto;
    overflow-x: hidden;
    position: relative;
}

/* Forcer le wrap sur textes/longs mots qui pourraient casser le layout */
h1, h2, h3, h4, h5, h6, p, a, span {
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    white-space: normal;
}

/* ===== SECTIONS À DÉFILEMENT HORIZONTAL (conservées mais sûres) ===== */
.horizontal-scroll-section {
    width: 100%;
    overflow-x: auto; /* autorise le scroll horizontal volontaire */
    overflow-y: hidden;
    padding: 5rem 0;
    background: var(--secondary-color);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) var(--light-gray);
}

/* Webkit scrollbar */
.horizontal-scroll-section::-webkit-scrollbar { height: 8px; }
.horizontal-scroll-section::-webkit-scrollbar-track { background: var(--light-gray); border-radius: 10px; }
.horizontal-scroll-section::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: 10px; }
.horizontal-scroll-section::-webkit-scrollbar-thumb:hover { background: var(--primary-dark); }

/* Container pour le contenu horizontal :
   min-width: min-content peut provoquer overflow ; utiliser min-width: 100% pour éviter dépassement global */
.scroll-container {
    display: flex;
    min-width: 100%;
    gap: 2rem;
    padding: 2rem;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
}

/* Éléments individuels du défilement horizontal */
.scroll-item {
    flex: 0 0 auto;
    width: 300px;
    scroll-snap-align: start;
    background: var(--white);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--box-shadow);
    transition: var(--transition);
}

.scroll-item:hover {
    transform: translateY(-5px);
    box-shadow: var(--box-shadow-lg);
}

.scroll-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.scroll-content {
    padding: 1.5rem;
}

.scroll-content h3 { font-size: 1.3rem; margin-bottom: 0.5rem; }
.scroll-content p { font-size: 0.95rem; margin-bottom: 1rem; }

/* Indicateurs */
.scroll-indicator { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
.scroll-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--text-muted); transition: var(--transition); cursor: pointer; }
.scroll-dot.active { background: var(--primary-color); transform: scale(1.2); }

/* petites protections supplémentaires */
img, video, iframe { max-width: 100%; height: auto; display: block; }

/* fin correction overflow */
"""

# replace the region between start_marker and end_marker (keep end marker)
new_content = content[:start_idx] + new_block + "\n" + content[end_idx:]

html_path.write_text(new_content, encoding="utf-8")
print("index.html mis à jour : section overflow remplacée avec succès.")