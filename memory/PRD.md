# Afroboost - Product Requirements Document

## Original Problem Statement
Application de réservation de casques audio pour des cours de fitness Afroboost. Design sombre néon avec fond noir pur (#000000) et accents rose/violet.

**Extension - Système de Lecteur Média Unifié** : Création de pages de destination vidéo épurées (`afroboosteur.com/v/[slug]`) avec miniatures personnalisables, bouton d'appel à l'action (CTA), et aperçus riches (OpenGraph) pour le partage sur les réseaux sociaux.

## User Personas
- **Utilisateurs**: Participants aux cours de fitness qui réservent des casques audio
- **Coach**: Administrateur qui gère les cours, offres, réservations, codes promo et campagnes marketing

## Core Requirements

### Système de Réservation
- [x] Sélection de cours et dates
- [x] Choix d'offres (Cours à l'unité, Carte 10 cours, Abonnement)
- [x] Formulaire d'information utilisateur (Nom, Email, WhatsApp)
- [x] Application de codes promo avec validation en temps réel
- [x] Liens de paiement (Stripe, PayPal, Twint)
- [x] Confirmation de réservation avec code unique

### Mode Coach Secret
- [x] Accès par 3 clics rapides sur le copyright
- [x] Login avec Google OAuth (contact.artboost@gmail.com)
- [x] Tableau de bord avec onglets multiples

### Système de Lecteur Média Unifié (V5 FINAL - 23 Jan 2026)
- [x] **Lecteur HTML5 natif** : iframe Google Drive sans marquage YouTube
- [x] **ZÉRO MARQUAGE** : Aucun logo YouTube, contrôles Google Drive
- [x] **Bouton Play rose #E91E63** : Design personnalisé au centre de la thumbnail
- [x] **Bouton CTA rose #E91E63** : Point focal centré sous la vidéo
- [x] **Responsive mobile** : Testé sur iPhone X (375x812)
- [x] **Template Email V5** : Anti-promotions avec texte brut AVANT le header violet

### Gestion des Campagnes (23 Jan 2026)
- [x] **Création de campagnes** : Nom, message, mediaUrl, contacts ciblés, canaux
- [x] **Modification de campagnes** : Bouton ✏️ pour éditer les campagnes draft/scheduled
- [x] **Lancement de campagnes** : Envoi via Resend (email) avec template V5
- [x] **Historique** : Tableau avec statuts (draft, scheduled, sending, completed)

---

## What's Been Implemented (23 Jan 2026)

### Fonctionnalité "Modifier une Campagne"
1. ✅ **Bouton ✏️ (Modifier)** : Visible dans le tableau pour campagnes draft/scheduled
2. ✅ **Pré-remplissage du formulaire** : Nom, message, mediaUrl, contacts, canaux
3. ✅ **Titre dynamique** : "Nouvelle Campagne" → "✏️ Modifier la Campagne"
4. ✅ **Bouton de soumission dynamique** : "🚀 Créer" → "💾 Enregistrer les modifications"
5. ✅ **Bouton Annuler** : Réinitialise le formulaire et sort du mode édition
6. ✅ **API PUT /api/campaigns/{id}** : Met à jour les champs et renvoie la campagne modifiée

### Template Email V5 Anti-Promotions
1. ✅ **3 lignes de texte brut** AVANT le header violet
2. ✅ **Fond clair #f5f5f5** : Plus neutre pour Gmail
3. ✅ **Card compacte 480px** : Réduit de 20%
4. ✅ **Image 400px** : Taille optimisée
5. ✅ **Preheader invisible** : Pour l'aperçu Gmail

### Tests Automatisés - Iteration 34
- **Backend** : 15/15 tests passés (100%)
- **Fichier** : `/app/backend/tests/test_campaign_modification.py`

---

## Technical Architecture

```
/app/
├── backend/
│   ├── server.py       # FastAPI avec Media API, Campaigns API, Email Template V5
│   └── .env            # MONGO_URL, RESEND_API_KEY, FRONTEND_URL
└── frontend/
    ├── src/
    │   ├── App.js      # Point d'entrée, routage /v/{slug}
    │   ├── components/
    │   │   ├── CoachDashboard.js # Gestion campagnes avec édition
    │   │   └── MediaViewer.js    # Lecteur vidéo - Google Drive iframe
    │   └── services/
    └── .env            # REACT_APP_BACKEND_URL
```

### Key API Endpoints - Campaigns
- `GET /api/campaigns`: Liste toutes les campagnes
- `GET /api/campaigns/{id}`: Récupère une campagne
- `POST /api/campaigns`: Crée une nouvelle campagne (status: draft)
- `PUT /api/campaigns/{id}`: **NOUVEAU** - Modifie une campagne existante
- `DELETE /api/campaigns/{id}`: Supprime une campagne
- `POST /api/campaigns/{id}/launch`: Lance l'envoi

### Data Model - campaigns
```json
{
  "id": "uuid",
  "name": "string",
  "message": "string",
  "mediaUrl": "/v/{slug} ou URL directe",
  "mediaFormat": "16:9",
  "targetType": "all | selected",
  "selectedContacts": ["contact_id_1", "contact_id_2"],
  "channels": {"whatsapp": true, "email": true, "instagram": false},
  "status": "draft | scheduled | sending | completed",
  "scheduledAt": "ISO date ou null",
  "results": [...],
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

---

## Prioritized Backlog

### P0 - Completed ✅
- [x] Lecteur Google Drive sans marquage YouTube
- [x] Template Email V5 Anti-Promotions
- [x] Fonctionnalité "Modifier une Campagne"
- [x] Tests automatisés iteration 34
- [x] **Scheduler de campagnes DAEMON** (24 Jan 2026) - RÉPARÉ ✅
- [x] **Configuration Twilio Production** (24 Jan 2026) - VERROUILLÉE ✅

### P1 - À faire
- [ ] **Activation numéro WhatsApp Suisse (+41)** : En attente approbation Meta
- [ ] **Refactoring CoachDashboard.js** : Extraire composants (>6000 lignes)
- [ ] **Export CSV contacts CRM** : Valider le flux de bout en bout

### P2 - Backlog
- [ ] Dashboard analytics pour le coach
- [ ] Support upload vidéo direct depuis le dashboard
- [ ] Manuel utilisateur

---

## Scheduler de Campagnes - MODE DAEMON (24 Jan 2026)

### Fichiers
- `/app/backend/scheduler.py` - Script autonome en mode DAEMON
- `/app/backend/start_scheduler.sh` - Script de démarrage
- `/var/log/scheduler.log` - Logs du scheduler

### Fonctionnalités
- ✅ **MODE DAEMON** : Boucle `while True` avec `time.sleep(30)`
- ✅ **Comparaison UTC** : `datetime.now(timezone.utc)` pour toutes les dates
- ✅ **Support multi-dates** : `scheduledDates[]` et `sentDates[]`
- ✅ **Isolation des canaux** : Email et WhatsApp dans des `try/except` séparés
- ✅ **Gestion des retries** : 3 tentatives max avant `failed`
- ✅ **Statut automatique** : `completed` seulement si TOUTES les dates sont dans `sentDates`

### Configuration Twilio (VERROUILLÉE)
```
TWILIO_ACCOUNT_SID=ACff5e3137bc55a71df65e7887b3175f0d (34 chars)
TWILIO_AUTH_TOKEN=3f89310aa2db1d7370dfa5d55ab51afd
TWILIO_FROM_NUMBER=+17813324010 (PRODUCTION)
```

### Lancement du Scheduler
```bash
# Mode DAEMON (défaut) - Tourne en arrière-plan
cd /app/backend && python3 scheduler.py &

# Exécution unique
python3 scheduler.py --once

# Mode test sans envoi
python3 scheduler.py --dry-run --once

# Vérifier les logs
tail -f /var/log/scheduler.log
```

### Comportement par canal
- **Email** : Envoi via `/api/campaigns/send-email` (Resend)
- **WhatsApp** : Envoi via Twilio API (numéro +17813324010)
- **Échec d'un canal** : N'affecte PAS l'autre canal

### Notes importantes
- Le scheduler tourne actuellement en mode daemon (PID visible via `ps aux | grep scheduler`)
- Le quota Resend peut bloquer les emails (reset quotidien)
- Le numéro WhatsApp +17813324010 nécessite une configuration dans Twilio Console comme "WhatsApp Sender"

---

## Credentials & URLs de Test
- **Coach Access**: 3 clics rapides sur "© Afroboost 2026" → Login Google OAuth
- **Email autorisé**: contact.artboost@gmail.com
- **Test Media Slug**: test-final
- **URL de test**: https://video-landing-1.preview.emergentagent.com/v/test-final
- **Vidéo Google Drive**: https://drive.google.com/file/d/1AkjHltEq-PAnw8OE-dR-lPPcpP44qvHv/view
