# Risques long terme — Structure SUNALA Front

Audit réalisé le 2026-08-29.

---

## 🔴 Service Worker — bombe à retardement silencieuse

Le cache est versionné manuellement (`sunalaa-static-v3` dans `public/sw.js`).
À chaque deploy, si personne n'incrémente ce numéro, les users qui ont la PWA installée continuent à charger l'ancienne version HTML depuis le cache. Ils voient un bug corrigé depuis des semaines sans le savoir. Ils désinstallent ou abandonnent.

**Fix recommandé :** remplacer la version hardcodée par un hash de build (timestamp ou hash du bundle Next.js) injecté automatiquement au moment du build.

---

## 🔴 Fichiers de traduction jamais validés

`messages/en.json` et `messages/fr.json` sont maintenus à la main en parallèle. Une clé ajoutée dans un fichier et oubliée dans l'autre → texte vide ou crash silencieux pour une partie des users. Aucune CI, aucun script qui vérifie la cohérence des clés entre les deux fichiers.

**Fix recommandé :** créer `scripts/check-i18n.js` qui compare les clés de EN et FR et échoue si elles divergent. À intégrer avant chaque push.

---

## 🟡 Prompts PWA non coordonnés

`IOSInstallBanner`, `PwaInstallPrompt` et `PushNotifPrompt` s'affichent depuis le même layout sans se parler. Sur certains appareils edge case, deux banners peuvent apparaître simultanément. L'user est confus, ferme tout, et ne revient pas.

**Fix recommandé :** un seul composant coordinateur qui décide quel prompt afficher (install vs push notif), jamais deux en même temps.

---

## 🟡 Icône 512×512 floue

L'icône `public/icon.png` a été générée par upscale d'un PNG 192×192 via `sips`. À 512px la qualité est dégradée. Sur Android, l'icône sur l'écran d'accueil est la première impression visuelle après l'installation.

**Fix recommandé :** retrouver le fichier source du logo (SVG ou PNG natif ≥ 512px) et exporter un vrai 512×512.

---

## 🟡 Promesses dans les CGU créent une dette légale vivante

Les CGU mentionnent :
- Une fenêtre de conversion de 90 jours après le token launch
- L'expiration permanente des points non convertis
- L'Academy program "coming soon" avec 6 niveaux de commissions

Ces éléments doivent être enforced par le backend. Si le token launch est retardé, si l'Academy ne se fait pas, ou si la conversion ne fonctionne pas exactement comme décrit — les users ont un document légal qui dit autre chose, et le frontend aura affiché les mêmes promesses pendant des mois.

**Fix recommandé :** versionner les CGU avec une date de mise à jour visible, et maintenir une liste interne des engagements techniques à livrer pour être conforme.

---

## 🟡 Aucune gestion visible des erreurs API

La plupart des composants font des appels API. Si l'API est down ou lente, il n'y a pas de feedback cohérent pour l'user : spinner infini ou composant qui disparaît silencieusement. Les users pensent que le site est cassé.

**Fix recommandé :** définir un état d'erreur visible dans les composants critiques (stats, profil, bonus) avec un message neutre et un bouton "Réessayer".

---

## 🟠 Lien de parrainage silencieusement cassé

Si un user n'a ni `username` ni `referralCode` dans son profil (compte créé avant l'implémentation du système, ou bug d'inscription), son lien génère `/ref/` — une URL invalide. Le bouton "Copier le lien" retourne silencieusement sans rien copier ni afficher de message. L'user pense que le bouton est cassé.

**Fix recommandé :** afficher un message d'erreur explicite dans `ProfileTips` quand `username` est vide, avec un lien vers le support ou les paramètres du profil.

---

## Priorités suggérées

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Script de validation i18n | Élevé | Faible |
| 2 | Cache SW automatique (hash de build) | Élevé | Moyen |
| 3 | Icône 512×512 source haute résolution | Moyen | Faible |
| 4 | Coordinateur de prompts PWA | Moyen | Moyen |
| 5 | Message d'erreur `copy_referral` vide | Moyen | Faible |
| 6 | Gestion erreurs API dans composants critiques | Élevé | Élevé |
