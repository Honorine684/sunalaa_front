Tu travailles sur un backend NestJS. L'objectif est de t'assurer qu'un email de bienvenue est bien envoyé lors d'une inscription via OAuth Google, exactement comme lors d'une inscription classique.

---

## Contexte

Le projet a deux flux d'inscription :
1. **Inscription classique** — `POST /auth/register` → un email de bienvenue est envoyé avec le prénom/nom de l'utilisateur
2. **Inscription OAuth Google** — `GET /auth/google/callback` → un code UUID one-time est généré (TTL 60s Redis), le frontend l'échange via `POST /auth/oauth/exchange` → les cookies HttpOnly sont posés et `{ user, isNewUser }` est retourné

La question : **est-ce qu'un email de bienvenue est envoyé lors de l'inscription OAuth ?**

---

## Ce que tu dois faire

### Étape 1 — Vérifier

Dans le handler `GET /auth/google/callback` (ou le service associé), cherche :
- Est-ce qu'il y a un appel au service d'envoi d'email ?
- Est-ce qu'il y a une condition `if (isNewUser)` qui déclenche un email ?
- Compare avec ce qui se passe dans `POST /auth/register`

### Étape 2 — Corriger si manquant

Si l'email de bienvenue n'est pas envoyé pour les nouveaux utilisateurs OAuth, l'ajouter dans le bon endroit. Le bon moment c'est quand `isNewUser === true`, c'est-à-dire au moment où l'utilisateur est créé pour la première fois via OAuth.

L'email doit utiliser le prénom si disponible (`user.firstName`), sinon le username, sinon l'email. Exemple :

```ts
// Dans le handler OAuth, après création de l'utilisateur
if (isNewUser) {
  await this.mailService.sendWelcomeEmail({
    to: user.email,
    name: user.firstName ?? user.username ?? user.email,
  });
}
```

### Étape 3 — Vérifier le contenu de l'email de bienvenue

S'assurer que le template n'utilise pas de variable non définie. Exemple de bug connu : si le template utilise `user.firstName` mais que l'utilisateur OAuth n'a pas de prénom renseigné au moment de la création, le mail affiche "Hello undefined,". Utiliser un fallback :

```ts
name: user.firstName ?? user.username ?? "là",
// ou en anglais
name: user.firstName ?? user.username ?? "there",
```

### Étape 4 — Tester

Créer un compte test via Google OAuth et vérifier que :
1. L'email de bienvenue arrive bien dans la boîte mail
2. Il affiche un nom correct (pas "undefined" ou vide)
3. Il n'est envoyé qu'une seule fois (pas à chaque connexion OAuth, seulement à la première inscription)

---

## Points d'attention

- Ne pas envoyer l'email à chaque connexion OAuth — seulement quand `isNewUser === true`
- Le flow OAuth actuel : backend génère un code UUID → redirige vers `https://sunalaa.com/auth/callback?code=XXXX` → frontend fait `POST /auth/oauth/exchange { code }` → backend valide + pose les cookies + retourne `{ user, isNewUser }`
- L'email doit partir **avant** de retourner la réponse au frontend (ou en async sans bloquer la réponse)
