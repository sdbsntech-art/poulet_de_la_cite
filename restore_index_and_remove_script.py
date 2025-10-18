from pathlib import Path
from datetime import datetime
import shutil
import sys
import os

ROOT = Path(r"c:\Users\SDBSN\Desktop\poulet_de_la_cite")
if not ROOT.exists():
    print("Dossier introuvable:", ROOT)
    sys.exit(1)

index = ROOT / "index.html"

# trouver les backups index.html.bak_*
backups = list(ROOT.glob("index.html.bak_*")) + list(ROOT.rglob("index.html.bak_*"))
backups = [p for p in backups if p.is_file()]

if not backups:
    print("Aucune sauvegarde index.html.bak_* trouvée dans", ROOT)
    sys.exit(1)

# choisir la plus récente
backups.sort(key=lambda p: p.stat().st_mtime, reverse=True)
latest = backups[0]

ts = datetime.now().strftime("%Y%m%d%H%M%S")
# pré-backup du fichier actuel s'il existe
if index.exists():
    prebak = index.with_name(index.name + f".prerestore_{ts}")
    shutil.copy2(index, prebak)
    print("Pré-backup créé :", prebak.name)

# restaurer
shutil.copy2(latest, index)
print(f"index.html restauré depuis {latest.name}")

# supprimer le script d'injection demandé (ici block_copy_shortcuts.py)
to_remove = ["block_copy_shortcuts.py", "secure_inject.py", "restore_backups.py"]
removed = []
for name in to_remove:
    p = ROOT / name
    if p.exists():
        try:
            p.unlink()
            removed.append(name)
        except Exception as e:
            print(f"Impossible de supprimer {name} :", e)

if removed:
    print("Supprimé :", ", ".join(removed))
else:
    print("Aucun des scripts ciblés n'a été trouvé pour suppression.")

print("Terminé.")