// ✅ VERSION FINALE 26-NOV-2025 21:25 - TOUTES MODIFICATIONS INCLUSES
// Configuration Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, get, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
apiKey: "AIzaSyDIxy8JZQoy1SCIP_ZWkyqIyK2qCJ6XveA",
  authDomain: "ceremomie-grades.firebaseapp.com",
  databaseURL: "https://ceremomie-grades-default-rtdb.firebaseio.com",
  projectId: "ceremomie-grades",
  storageBucket: "ceremomie-grades.firebasestorage.app",
  messagingSenderId: "1022452597434",
  appId: "1:1022452597434:web:8900474bbda9afc4347883"
};

let app, database, auth;
let isAuthReady = false;

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    console.log('✅ Firebase initialisé');
    
    // Attendre que l'authentification soit prête
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('✅ Utilisateur authentifié:', user.uid);
            isAuthReady = true;
        } else {
            console.log('⏳ Authentification en cours...');
            // Authentification anonyme automatique
            signInAnonymously(auth)
                .then(() => {
                    console.log('✅ Authentification anonyme réussie');
                    isAuthReady = true;
                })
                .catch((error) => {
                    console.error('❌ Erreur d\'authentification:', error);
                    alert('⚠️ Erreur d\'authentification. Veuillez recharger la page.');
                });
        }
    });
} catch (error) {
    console.error('❌ Erreur Firebase:', error);
}

let appMode = 'employee';
let currentEvent = 'ceremonie1';
let currentEmployeeName = '';
let allEmployees = [];
let eventData = {};

const ADMIN_PASSWORD = 'admin2026';

// 🎨 COULEURS DES SECTIONS (FOND TRÈS PÂLE + TEXTE NOIR) - ✅ DEMANDE #3
const sectionColors = {
    'AVANT': '#d4edda',     // 🟢 VERT TRÈS PÂLE (pastel)
    'PENDANT': '#fff3cd',   // 🟡 JAUNE TRÈS PÂLE (pastel)  
    'APRES': '#f8d7da',     // 🔴 ROUGE TRÈS PÂLE (pastel)
    'GENERAL': '#cfe2ff'    // 🔵 BLEU PÂLE (pastel)
};

// 🎨 COULEURS FONCÉES pour les boutons (plus visibles)
const sectionColorsDark = {
    'AVANT': '#28a745',     // 🟢 VERT FONCÉ pour boutons
    'PENDANT': '#ffc107',   // 🟡 JAUNE/ORANGE FONCÉ pour boutons  
    'APRES': '#dc3545',     // 🔴 ROUGE FONCÉ pour boutons
    'GENERAL': '#0d6efd'    // 🔵 BLEU FONCÉ pour boutons
};

// DONNÉES INITIALES
const initialData = {
    employees: [
        "Kaïm Demers", "Cindy Lavoie", "Ghislaine Patricia Misse Ngoubeyo", "Cédric Benoit",
        "Milly Isabelle", "Anthony Caron", "Geneviève Phillips", "Marie-Philippe Durand",
        "Carlos Ruiz", "Philippe Compagnon", "Maxime Lemieux-Laramée", "Marie-Josée Roy",
        "Nathalie Jolin", "Charel Traversy", "Anne-Laurence Jacob", "Caroline Turcotte",
        "Marc-André Pelletier-Lafrance", "Pierre Pinsonnault", "Martyne Desmeules", "Rachel Lemelin",
        "Amélie Hamilton", "Audray Anctil", "Kim Dingle", "Sara St-Ours", "Véronique Archambault",
        "Dany Francoeur", "Isabelle Flageole", "Alexandra Caron", "Nadia Goyette", "Mireille Collin",
        "Marie-France Milot", "Marie-Claude Biron", "Katy Gélinas", "Caroline Descôteaux",
        "Caroline Lambert", "Marie-Noël Vanasse", "Jannie Sauvageau", "Caroline Lessard",
        "Marie-ève Toupin", "Katy Baribeau", "Marilyn Vermette", "Hélène Cossette",
        "Nathalie Ayotte", "Pascale Pothier", "Amandine Thierry", "Xavier Bérubé",
        "Cathia Laporte", "Geneviève Lupien", "Maria Stéphanie Tardif-Otero", "Josée Beaulieu",
        "Jean-François Hinse", "Louis-Simon Tancrède", "Françoise Descoteaux", "Michel Lamy",
        "Manon Ruest", "Catherine Larivière", "Karolyne Desjardins", "Nancy Tremblay",
        "Gabrielle Samson", "Jessie Boulanger", "Julie Gosselin"
    ],
    montage: {
        title: "Montage dimanche (8h30 à 15h00)",
        sectors: [
            { name: "Accueil (répartition des Camions)", location: "Près des grilles d'entrée", responsables: ["Rachel Lemelin", "Gabrielle Samson", "Jessie Boulanger"], employees: [] },
            { name: "Installer le tout comme discuté pour l'accueil/stationnement", location: "Accueil/stationnement", responsables: ["Kaïm Demers"], employees: [] },
            { name: "Affiches extérieures + beachflag", location: "Extérieur", responsables: ["Julie Gosselin"], employees: [] },
            { name: "Signalisation sur route (à 9h00)", location: "Extérieur", responsables: ["Carlos Ruiz"], employees: [] },
            { name: "Installer les chaises sur la scène une fois les risers en place + backdrop", location: "Scène", responsables: ["Rachel Lemelin"], employees: [] },
            { name: "Monter les tables dans le fond du chapiteau + aux poteaux et décorer avec les nappes et coroplast", location: "Tentes de diplômés", responsables: ["Maria Stéphanie Tardif-Otero"], employees: ["Jessie Boulanger", "Gabrielle Samson"] },
            { name: "Mettre les affiches identification des stations et installer le miroir", location: "Concessions alimentaires – Préparation finissants", responsables: ["Jessie Boulanger", "Gabrielle Samson"], employees: [] },
            { name: "Préparer le vestiaire (arranger les supports)", location: "Concessions alimentaires – Préparation finissants", responsables: ["Jessie Boulanger", "Gabrielle Samson"], employees: [] },
            { name: "Installer la délimitation (poteaux de foules) selon le plan", location: "Concessions alimentaires – Préparation finissants", responsables: ["Jessie Boulanger", "Gabrielle Samson"], employees: [] },
            { name: "Installer les boites des mortiers au bon endroit", location: "Concessions alimentaires – Préparation finissants", responsables: ["Jessie Boulanger", "Gabrielle Samson"], employees: [] },
            { name: "Installer les toges par ordre de grandeurs + retirer les plastiques + Installer les épitoges par cycle", location: "Concessions alimentaires – Préparation finissants", responsables: ["Jessie Boulanger", "Gabrielle Samson"], employees: [] },
            { name: "Installer le tout comme discuté, installer les toges par ordre alphabétique avec les bonnes grandeurs, parements", location: "Couloirs des loges", responsables: ["Marie-Josée Roy", "Gabrielle Samson"], employees: [] },
            { name: "Mettre affiches sur les loges pour identification", location: "Hall des dignitaires", responsables: ["Jessie Boulanger", "Gabrielle Samson"], employees: [] },
            { name: "Installer les tables et chaise selon le plan", location: "Concessions alimentaires – Préparation finissants", responsables: [], employees: [] }
        ]
    },
    ceremonie1: {
        title: "Cérémonie 1 - Lundi 9 juin 2025 - 10h",
        sections: [
            {
                title: "AVANT LA CÉRÉMONIE",
                sectors: [
                    { name: "Accueil extérieur / Stationnement", location: "Entrée principale", responsables: [], employees: [] },
                    { name: "Fondation 1", location: "", responsables: [], employees: [] },
                    { name: "Fondation 2", location: "", responsables: [], employees: [] },
                    { name: "Dignitaires", location: "", responsables: [], employees: [] },
                    { name: "Accueil, toges et épitoges", location: "", responsables: [], employees: [] },
                    { name: "Cortège", location: "", responsables: [], employees: [] },
                    { name: "Accueil invité des DHC", location: "", responsables: [], employees: [] },
                    { name: "Registrariat", location: "Hall d'entrée", responsables: [], employees: [] },
                    { name: "Accueil des diplômés", location: "Salle d'accueil", responsables: [], employees: [] },
                    { name: "Préparation des diplômés (Toges)", location: "", responsables: [], employees: [] },
                    { name: "Préparation des diplômés (Épitoges)", location: "", responsables: [], employees: [] },
                    { name: "Préparation des diplômés (Vestiaires et sacoche)", location: "", responsables: [], employees: [] },
                    { name: "Préparation des diplômés (Mortier)", location: "", responsables: [], employees: [] },
                    { name: "Chapiteau des diplômés", location: "", responsables: [], employees: [] },
                    { name: "Consignes aux diplômés et gestion de la salle", location: "", responsables: [], employees: [] }
                ]
            },
            {
                title: "PENDANT LA CÉRÉMONIE",
                sectors: [
                    { name: "Animation", location: "Scène principale", responsables: [], employees: [] },
                    { name: "Régie", location: "Cabine technique", responsables: [], employees: [] },
                    { name: "Escaliers côté jardin - Première partie", location: "", responsables: [], employees: [] },
                    { name: "Escaliers côté cour - Première partie", location: "", responsables: [], employees: [] },
                    { name: "Escaliers côté jardin - Deuxième partie", location: "", responsables: [], employees: [] },
                    { name: "Escaliers côté cour - Deuxième partie", location: "", responsables: [], employees: [] },
                    { name: "Livre d'or - Première partie", location: "", responsables: [], employees: [] },
                    { name: "Livre d'or - Deuxième partie", location: "", responsables: [], employees: [] }
                ]
            },
            {
                title: "APRÈS LA CÉRÉMONIE",
                sectors: [
                    { name: "Retour des toges - Poste permanent", location: "Vestiaire", responsables: [], employees: [] },
                    { name: "Retour des toges - Régulier et équipe volante", location: "", responsables: [], employees: [] },
                    { name: "Popcorn au chapiteau", location: "", responsables: [], employees: [] },
                    { name: "Équipe volante", location: "", responsables: [], employees: [] },
                    { name: "Équipe de coordination", location: "", responsables: [], employees: [] }
                ]
            }
        ]
    },
    ceremonie2: {
        title: "Cérémonie 2 - Lundi 9 juin 2025 - 13h",
        sections: [
            { title: "AVANT LA CÉRÉMONIE", sectors: [
                { name: "Accueil extérieur / Stationnement", location: "Entrée principale", responsables: [], employees: [] },
                { name: "Fondation 1", location: "", responsables: [], employees: [] },
                { name: "Fondation 2", location: "", responsables: [], employees: [] },
                { name: "Dignitaires", location: "", responsables: [], employees: [] },
                { name: "Accueil, toges et épitoges", location: "", responsables: [], employees: [] },
                { name: "Cortège", location: "", responsables: [], employees: [] },
                { name: "Accueil invité des DHC", location: "", responsables: [], employees: [] },
                { name: "Registrariat", location: "Hall d'entrée", responsables: [], employees: [] },
                { name: "Accueil des diplômés", location: "Salle d'accueil", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Toges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Épitoges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Vestiaires et sacoche)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Mortier)", location: "", responsables: [], employees: [] },
                { name: "Chapiteau des diplômés", location: "", responsables: [], employees: [] },
                { name: "Consignes aux diplômés et gestion de la salle", location: "", responsables: [], employees: [] }
            ]},
            { title: "PENDANT LA CÉRÉMONIE", sectors: [
                { name: "Animation", location: "Scène principale", responsables: [], employees: [] },
                { name: "Régie", location: "Cabine technique", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Première partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Deuxième partie", location: "", responsables: [], employees: [] }
            ]},
            { title: "APRÈS LA CÉRÉMONIE", sectors: [
                { name: "Retour des toges - Poste permanent", location: "Vestiaire", responsables: [], employees: [] },
                { name: "Retour des toges - Régulier et équipe volante", location: "", responsables: [], employees: [] },
                { name: "Popcorn au chapiteau", location: "", responsables: [], employees: [] },
                { name: "Équipe volante", location: "", responsables: [], employees: [] },
                { name: "Équipe de coordination", location: "", responsables: [], employees: [] }
            ]}
        ]
    },
    ceremonie3: {
        title: "Cérémonie 3 - Lundi 9 juin 2025 - 16h",
        sections: [
            { title: "AVANT LA CÉRÉMONIE", sectors: [
                { name: "Accueil extérieur / Stationnement", location: "Entrée principale", responsables: [], employees: [] },
                { name: "Fondation 1", location: "", responsables: [], employees: [] },
                { name: "Fondation 2", location: "", responsables: [], employees: [] },
                { name: "Dignitaires", location: "", responsables: [], employees: [] },
                { name: "Accueil, toges et épitoges", location: "", responsables: [], employees: [] },
                { name: "Cortège", location: "", responsables: [], employees: [] },
                { name: "Accueil invité des DHC", location: "", responsables: [], employees: [] },
                { name: "Registrariat", location: "Hall d'entrée", responsables: [], employees: [] },
                { name: "Accueil des diplômés", location: "Salle d'accueil", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Toges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Épitoges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Vestiaires et sacoche)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Mortier)", location: "", responsables: [], employees: [] },
                { name: "Chapiteau des diplômés", location: "", responsables: [], employees: [] },
                { name: "Consignes aux diplômés et gestion de la salle", location: "", responsables: [], employees: [] }
            ]},
            { title: "PENDANT LA CÉRÉMONIE", sectors: [
                { name: "Animation", location: "Scène principale", responsables: [], employees: [] },
                { name: "Régie", location: "Cabine technique", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Première partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Deuxième partie", location: "", responsables: [], employees: [] }
            ]},
            { title: "APRÈS LA CÉRÉMONIE", sectors: [
                { name: "Retour des toges - Poste permanent", location: "Vestiaire", responsables: [], employees: [] },
                { name: "Retour des toges - Régulier et équipe volante", location: "", responsables: [], employees: [] },
                { name: "Popcorn au chapiteau", location: "", responsables: [], employees: [] },
                { name: "Équipe volante", location: "", responsables: [], employees: [] },
                { name: "Équipe de coordination", location: "", responsables: [], employees: [] }
            ]}
        ]
    },
    ceremonie4: {
        title: "Cérémonie 4 - Mardi 10 juin 2025 - 10h",
        sections: [
            { title: "AVANT LA CÉRÉMONIE", sectors: [
                { name: "Accueil extérieur / Stationnement", location: "Entrée principale", responsables: [], employees: [] },
                { name: "Fondation 1", location: "", responsables: [], employees: [] },
                { name: "Fondation 2", location: "", responsables: [], employees: [] },
                { name: "Dignitaires", location: "", responsables: [], employees: [] },
                { name: "Accueil, toges et épitoges", location: "", responsables: [], employees: [] },
                { name: "Cortège", location: "", responsables: [], employees: [] },
                { name: "Accueil invité des DHC", location: "", responsables: [], employees: [] },
                { name: "Registrariat", location: "Hall d'entrée", responsables: [], employees: [] },
                { name: "Accueil des diplômés", location: "Salle d'accueil", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Toges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Épitoges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Vestiaires et sacoche)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Mortier)", location: "", responsables: [], employees: [] },
                { name: "Chapiteau des diplômés", location: "", responsables: [], employees: [] },
                { name: "Consignes aux diplômés et gestion de la salle", location: "", responsables: [], employees: [] }
            ]},
            { title: "PENDANT LA CÉRÉMONIE", sectors: [
                { name: "Animation", location: "Scène principale", responsables: [], employees: [] },
                { name: "Régie", location: "Cabine technique", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Première partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Deuxième partie", location: "", responsables: [], employees: [] }
            ]},
            { title: "APRÈS LA CÉRÉMONIE", sectors: [
                { name: "Retour des toges - Poste permanent", location: "Vestiaire", responsables: [], employees: [] },
                { name: "Retour des toges - Régulier et équipe volante", location: "", responsables: [], employees: [] },
                { name: "Popcorn au chapiteau", location: "", responsables: [], employees: [] },
                { name: "Équipe volante", location: "", responsables: [], employees: [] },
                { name: "Équipe de coordination", location: "", responsables: [], employees: [] }
            ]}
        ]
    },
    ceremonie5: {
        title: "Cérémonie 5 - Mardi 10 juin 2025 - 13h",
        sections: [
            { title: "AVANT LA CÉRÉMONIE", sectors: [
                { name: "Accueil extérieur / Stationnement", location: "Entrée principale", responsables: [], employees: [] },
                { name: "Fondation 1", location: "", responsables: [], employees: [] },
                { name: "Fondation 2", location: "", responsables: [], employees: [] },
                { name: "Dignitaires", location: "", responsables: [], employees: [] },
                { name: "Accueil, toges et épitoges", location: "", responsables: [], employees: [] },
                { name: "Cortège", location: "", responsables: [], employees: [] },
                { name: "Accueil invité des DHC", location: "", responsables: [], employees: [] },
                { name: "Registrariat", location: "Hall d'entrée", responsables: [], employees: [] },
                { name: "Accueil des diplômés", location: "Salle d'accueil", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Toges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Épitoges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Vestiaires et sacoche)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Mortier)", location: "", responsables: [], employees: [] },
                { name: "Chapiteau des diplômés", location: "", responsables: [], employees: [] },
                { name: "Consignes aux diplômés et gestion de la salle", location: "", responsables: [], employees: [] }
            ]},
            { title: "PENDANT LA CÉRÉMONIE", sectors: [
                { name: "Animation", location: "Scène principale", responsables: [], employees: [] },
                { name: "Régie", location: "Cabine technique", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Première partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Deuxième partie", location: "", responsables: [], employees: [] }
            ]},
            { title: "APRÈS LA CÉRÉMONIE", sectors: [
                { name: "Retour des toges - Poste permanent", location: "Vestiaire", responsables: [], employees: [] },
                { name: "Retour des toges - Régulier et équipe volante", location: "", responsables: [], employees: [] },
                { name: "Popcorn au chapiteau", location: "", responsables: [], employees: [] },
                { name: "Équipe volante", location: "", responsables: [], employees: [] },
                { name: "Équipe de coordination", location: "", responsables: [], employees: [] }
            ]}
        ]
    },
    ceremonie6: {
        title: "Cérémonie 6 - Mardi 10 juin 2025 - 16h",
        sections: [
            { title: "AVANT LA CÉRÉMONIE", sectors: [
                { name: "Accueil extérieur / Stationnement", location: "Entrée principale", responsables: [], employees: [] },
                { name: "Fondation 1", location: "", responsables: [], employees: [] },
                { name: "Fondation 2", location: "", responsables: [], employees: [] },
                { name: "Dignitaires", location: "", responsables: [], employees: [] },
                { name: "Accueil, toges et épitoges", location: "", responsables: [], employees: [] },
                { name: "Cortège", location: "", responsables: [], employees: [] },
                { name: "Accueil invité des DHC", location: "", responsables: [], employees: [] },
                { name: "Registrariat", location: "Hall d'entrée", responsables: [], employees: [] },
                { name: "Accueil des diplômés", location: "Salle d'accueil", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Toges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Épitoges)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Vestiaires et sacoche)", location: "", responsables: [], employees: [] },
                { name: "Préparation des diplômés (Mortier)", location: "", responsables: [], employees: [] },
                { name: "Chapiteau des diplômés", location: "", responsables: [], employees: [] },
                { name: "Consignes aux diplômés et gestion de la salle", location: "", responsables: [], employees: [] }
            ]},
            { title: "PENDANT LA CÉRÉMONIE", sectors: [
                { name: "Animation", location: "Scène principale", responsables: [], employees: [] },
                { name: "Régie", location: "Cabine technique", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Première partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté jardin - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Escaliers côté cour - Deuxième partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Première partie", location: "", responsables: [], employees: [] },
                { name: "Livre d'or - Deuxième partie", location: "", responsables: [], employees: [] }
            ]},
            { title: "APRÈS LA CÉRÉMONIE", sectors: [
                { name: "Retour des toges - Poste permanent", location: "Vestiaire", responsables: [], employees: [] },
                { name: "Retour des toges - Régulier et équipe volante", location: "", responsables: [], employees: [] },
                { name: "Popcorn au chapiteau", location: "", responsables: [], employees: [] },
                { name: "Équipe volante", location: "", responsables: [], employees: [] },
                { name: "Équipe de coordination", location: "", responsables: [], employees: [] }
            ]}
        ]
    },
    demontage: {
        title: "Démontage mercredi (8h30 à 11h00)",
        sectors: [
            { name: "Accueil (répartition des Camions)", location: "Près des grilles d'entrée", responsables: ["Rachel Lemelin", "Gabrielle Samson", "Jessie Boulanger"], employees: [] },
            { name: "Tout approcher pour les camions", location: "Hall des dignitaires", responsables: ["Rachel Lemelin", "Gabrielle Samson", "Jessie Boulanger"], employees: ["Kaïm Demers"] },
            { name: "Rapatrier les toges pour le fournisseurs", location: "Concessions alimentaires – Préparation finissants", responsables: ["Rachel Lemelin", "Gabrielle Samson", "Jessie Boulanger"], employees: ["Manon Ruest"] },
            { name: "Tout approcher pour les camions", location: "Concessions alimentaires – Préparation finissants", responsables: ["Rachel Lemelin", "Gabrielle Samson", "Jessie Boulanger"], employees: ["Catherine Larivière"] },
            { name: "Tout approcher pour les camions", location: "Chapiteau des diplômés", responsables: ["Rachel Lemelin", "Gabrielle Samson", "Jessie Boulanger"], employees: ["Maria Stéphanie Tardif-Otero"] }
        ]
    }
};

async function initializeData() {
    console.log('📥 Chargement des données...');
    try {
        const dataRef = ref(database, '/');
        
        // ✅ ÉCOUTER LES CHANGEMENTS EN TEMPS RÉEL
        onValue(dataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('🔄 Données mises à jour depuis Firebase');
                allEmployees = data.employees || initialData.employees;
                
                // ✅ Fusionner avec initialData (ne pas écraser complètement)
                eventData = {};
                
                // D'abord, prendre tous les templates de initialData
                for (const key in initialData) {
                    if (key !== 'employees') {
                        eventData[key] = { ...initialData[key] };
                    }
                }
                
                // Ensuite, écraser avec les données Firebase
                for (const key in data) {
                    if (key !== 'employees' && data[key]) {
                        eventData[key] = data[key];
                        
                        // ✅ VALIDER ET CORRIGER LES SECTEURS
                        if (eventData[key].sections) {
                            eventData[key].sections.forEach(section => {
                                if (section.sectors) {
                                    section.sectors.forEach(sector => {
                                        if (!sector.responsables) sector.responsables = [];
                                        if (!sector.employees) sector.employees = [];
                                        if (!sector.note) sector.note = '';
                                        if (!sector.location) sector.location = '';
                                    });
                                }
                            });
                        }
                        if (eventData[key].sectors) {
                            eventData[key].sectors.forEach(sector => {
                                if (!sector.responsables) sector.responsables = [];
                                if (!sector.employees) sector.employees = [];
                                if (!sector.note) sector.note = '';
                                if (!sector.location) sector.location = '';
                            });
                        }
                    }
                }
                
                // Re-render uniquement si on est sur un événement existant
                if (eventData[currentEvent]) {
                    renderEvent(currentEvent);
                } else {
                    console.warn('⚠️ Événement', currentEvent, 'non trouvé dans eventData');
                    console.log('📋 Événements disponibles:', Object.keys(eventData));
                }
                updateEmployeeSelect();
                updateEventSelector(); // ✅ Mettre à jour le menu déroulant
            } else {
                console.log('⚠️ Aucune donnée - initialisation');
                allEmployees = initialData.employees;
                eventData = { ...initialData };
                saveData();
            }
        }, (error) => {
            console.error('❌ Erreur lors de l\'écoute Firebase:', error);
        });
        
        console.log('✅ Synchronisation temps réel activée');
    } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        allEmployees = initialData.employees;
        eventData = { ...initialData };
        renderEvent(currentEvent);
        updateEmployeeSelect();
    }
}

async function saveData() {
    console.log('💾 Tentative de sauvegarde...');
    
    // Vérifier l'authentification
    if (!isAuthReady) {
        console.log('⏳ Attente de l\'authentification...');
        // Attendre jusqu'à 5 secondes pour l'authentification
        let waitTime = 0;
        while (!isAuthReady && waitTime < 5000) {
            await new Promise(resolve => setTimeout(resolve, 100));
            waitTime += 100;
        }
        
        if (!isAuthReady) {
            console.error('❌ Authentification non prête après 5 secondes');
            alert('⚠️ Erreur: Authentification non prête.\n\nVeuillez attendre quelques secondes et réessayer.\n\nSi le problème persiste:\n1. Rechargez la page (F5)\n2. Vérifiez que l\'authentification anonyme est activée dans Firebase');
            return;
        }
    }
    
    // Vérifier que l'utilisateur est connecté
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.error('❌ Aucun utilisateur authentifié');
        alert('⚠️ Erreur: Vous n\'êtes pas authentifié.\n\nVeuillez recharger la page (F5)');
        return;
    }
    
    console.log('✅ Utilisateur authentifié, sauvegarde en cours...');
    
    try {
        const dataToSave = {
            employees: allEmployees,
            ...eventData
        };
        console.log('📦 Données à sauvegarder:', dataToSave);
        
        await set(ref(database, '/'), dataToSave);
        console.log('✅ Données sauvegardées dans Firebase avec succès !');
        
        // Vérification immédiate
        const snapshot = await get(ref(database, '/'));
        if (snapshot.exists()) {
            console.log('✅ Vérification: Données bien présentes dans Firebase');
        } else {
            console.error('⚠️ Vérification: Données non trouvées après sauvegarde !');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        console.error('❌ Détails:', error.message);
        console.error('❌ Code:', error.code);
        
        // Message d'erreur amélioré
        let errorMessage = '⚠️ Erreur de sauvegarde Firebase:\n' + error.message + '\n\n';
        
        if (error.code === 'PERMISSION_DENIED') {
            errorMessage += 'CAUSE PROBABLE:\n';
            errorMessage += '❌ L\'authentification anonyme n\'est pas activée dans Firebase\n\n';
            errorMessage += 'SOLUTION:\n';
            errorMessage += '1. Allez sur console.firebase.google.com\n';
            errorMessage += '2. Authentication → Sign-in method\n';
            errorMessage += '3. Activez "Anonymous"\n';
            errorMessage += '4. Rechargez cette page\n';
        } else {
            errorMessage += 'Vérifiez:\n';
            errorMessage += '1. La connexion Internet\n';
            errorMessage += '2. Les règles Firebase\n';
            errorMessage += '3. La console (F12)\n';
        }
        
        alert(errorMessage);
    }
}

function setMode(mode) {
    appMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    const employeeNav = document.getElementById('employeeNav');
    const readNav = document.getElementById('readNav');
    const manageEmployeesBtn = document.getElementById('manageEmployeesListBtn');
    const copyTemplateBtn = document.getElementById('copyTemplateBtn');
    
    if (mode === 'employee') {
        employeeNav.style.display = 'block';
        readNav.style.display = 'none';
        if (manageEmployeesBtn) manageEmployeesBtn.style.display = 'none';
        if (copyTemplateBtn) copyTemplateBtn.style.display = 'none';
    } else if (mode === 'read') {
        employeeNav.style.display = 'none';
        readNav.style.display = 'block';
        if (manageEmployeesBtn) manageEmployeesBtn.style.display = 'none';
        if (copyTemplateBtn) copyTemplateBtn.style.display = 'none';
    } else if (mode === 'admin') {
        employeeNav.style.display = 'none';
        readNav.style.display = 'none';
        if (manageEmployeesBtn) manageEmployeesBtn.style.display = 'inline-flex';
        if (copyTemplateBtn) copyTemplateBtn.style.display = 'inline-flex';
    }
    
    renderEvent(currentEvent);
}

function updateEmployeeSelect() {
    const select = document.getElementById('employeeSelect');
    select.innerHTML = '<option value="">-- Choisir un employé --</option>';
    allEmployees.sort().forEach(emp => {
        const option = document.createElement('option');
        option.value = emp;
        option.textContent = emp;
        select.appendChild(option);
    });
}

function selectEmployee(name) {
    currentEmployeeName = name;
    document.getElementById('exportEmployeeBtn').style.display = 'inline-block';
    renderEvent(currentEvent);
}

// ✅ DEMANDE #1 : Renommer cérémonie + mise à jour automatique du menu déroulant
function renameCeremony(eventName) {
    const modal = document.getElementById('renameCeremonyModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="edit-sector-form">
            <div class="form-group-modern">
                <label for="ceremonyNameInput" class="form-label-modern">📅 Nouveau titre de la cérémonie</label>
                <input type="text" id="ceremonyNameInput" class="form-input-modern" value="${eventData[eventName].title}" placeholder="Ex: Cérémonie 1 - Lundi 9 juin 2025 - 10h">
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Focus sur le champ
    setTimeout(() => {
        document.getElementById('ceremonyNameInput').focus();
    }, 100);
    
    // Gestion de la sauvegarde
    const saveBtn = modal.querySelector('#saveRenameCeremonyBtn');
    const cancelBtn = modal.querySelector('#cancelRenameCeremonyBtn');
    
    // Nettoyer les anciens listeners
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    newSaveBtn.addEventListener('click', () => {
        const newTitle = document.getElementById('ceremonyNameInput').value.trim();
        
        if (newTitle) {
            eventData[eventName].title = newTitle;
            
            saveData();
            updateEventSelector(); // ✅ Mettre à jour le menu
            renderEvent(currentEvent);
            modal.style.display = 'none';
            console.log(`✅ Cérémonie "${eventName}" renommée en "${newTitle}" + menu déroulant mis à jour`);
        } else {
            alert('Le titre ne peut pas être vide');
        }
    });
    
    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    // Entrée pour sauvegarder
    document.getElementById('ceremonyNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            newSaveBtn.click();
        }
    });
}

// ✅ NOUVELLE FONCTION : Mettre à jour le menu déroulant
function updateEventSelector() {
    const eventSelector = document.getElementById('eventSelector');
    const currentValue = eventSelector.value; // Sauvegarder la sélection actuelle
    
    // Vider et reconstruire le menu
    eventSelector.innerHTML = '';
    
    // Ajouter toutes les options depuis eventData
    for (const key in eventData) {
        const event = eventData[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = event.title;
        if (key === currentValue) {
            option.selected = true;
        }
        eventSelector.appendChild(option);
    }
    
    console.log('✅ Menu déroulant mis à jour');
}

function renderEvent(eventName) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';
    
    const event = eventData[eventName];
    if (!event) {
        mainContent.innerHTML = '<p>Événement non trouvé.</p>';
        return;
    }
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'event-title-section';
    titleDiv.innerHTML = `
        <h2 class="event-main-title">${event.title}</h2>
        ${appMode === 'admin' ? `<button class="btn-edit-absolute" onclick="renameCeremony('${eventName}')" title="Renommer">✏️</button>` : ''}
    `;
    mainContent.appendChild(titleDiv);
    
    if (event.sections) {
        event.sections.forEach((section, sectionIndex) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section';
            
            // ✅ DEMANDE #3 : Déterminer la couleur de fond selon le titre de la section
            let backgroundColor = '#2c3e50'; // Par défaut
            let buttonColor = '#28a745'; // Couleur bouton par défaut
            
            if (section.title.includes('AVANT')) {
                backgroundColor = sectionColors['AVANT']; // Vert pâle
                buttonColor = sectionColorsDark['AVANT']; // Vert foncé pour boutons
            } else if (section.title.includes('PENDANT')) {
                backgroundColor = sectionColors['PENDANT']; // Jaune pâle
                buttonColor = sectionColorsDark['PENDANT']; // Jaune/orange foncé pour boutons
            } else if (section.title.includes('APRÈS') || section.title.includes('APRES')) {
                backgroundColor = sectionColors['APRES']; // Rose pâle
                buttonColor = sectionColorsDark['APRES']; // Rouge foncé pour boutons
            } else if (section.title.includes('GÉNÉRAL') || section.title.includes('GENERAL')) {
                backgroundColor = sectionColors['GENERAL']; // Bleu pâle
                buttonColor = sectionColorsDark['GENERAL']; // Bleu foncé pour boutons
            }
            
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'section-header';
            // ✅ DEMANDE #3 : Background coloré + texte NOIR
            sectionHeader.style.backgroundColor = backgroundColor;
            sectionHeader.style.color = '#000000'; // Texte noir
            sectionHeader.innerHTML = `
                <div class="section-title">${section.title}</div>
            `;
            sectionDiv.appendChild(sectionHeader);
            
            // ✅ BOUTON "AJOUTER UN SECTEUR" SUPPRIMÉ
            
            if (section.sectors && section.sectors.length > 0) {
                section.sectors.forEach((sector, sectorIndex) => {
                    // ✅ VALIDER le secteur avant de le rendre
                    if (!sector.responsables) sector.responsables = [];
                    if (!sector.employees) sector.employees = [];
                    if (!sector.note) sector.note = '';
                    if (!sector.location) sector.location = '';
                    
                    const sectorRow = createSectorRow(sector, eventName, sectionIndex, sectorIndex, backgroundColor, buttonColor, section.title);
                    sectionDiv.appendChild(sectorRow);
                });
            } else {
                const emptyMsg = document.createElement('p');
                emptyMsg.style.textAlign = 'center';
                emptyMsg.style.padding = '20px';
                emptyMsg.style.color = '#999';
                emptyMsg.textContent = 'Aucun secteur configuré';
                sectionDiv.appendChild(emptyMsg);
            }
            
            mainContent.appendChild(sectionDiv);
        });
    } else if (event.sectors) {
        // ✅ BOUTON "AJOUTER UN SECTEUR" SUPPRIMÉ
        
        // ✅ Couleur très pâle pour Montage/Démontage
        const montageBackgroundColor = '#e8f4f8'; // Bleu très très pâle
        const montageButtonColor = '#5bc0de'; // Bleu moyen pour boutons
        
        event.sectors.forEach((sector, sectorIndex) => {
            // ✅ VALIDER le secteur avant de le rendre
            if (!sector.responsables) sector.responsables = [];
            if (!sector.employees) sector.employees = [];
            if (!sector.note) sector.note = '';
            if (!sector.location) sector.location = '';
            
            const sectorRow = createSectorRow(sector, eventName, null, sectorIndex, montageBackgroundColor, montageButtonColor);
            mainContent.appendChild(sectorRow);
        });
    }
}

function addSector(eventName, sectionIndex) {
    const name = prompt('Nom du nouveau secteur :');
    if (!name) return;
    
    const location = prompt('Lieu/Localisation (optionnel) :') || '';
    
    const newSector = {
        name: name.trim(),
        location: location.trim(),
        responsables: [],
        employees: []
    };
    
    if (sectionIndex !== null) {
        eventData[eventName].sections[sectionIndex].sectors.push(newSector);
    } else {
        if (!eventData[eventName].sectors) eventData[eventName].sectors = [];
        eventData[eventName].sectors.push(newSector);
    }
    
    saveData();
    renderEvent(currentEvent);
}

function editSector(eventName, sectionIndex, sectorIndex) {
    let sector;
    if (sectionIndex !== null) {
        sector = eventData[eventName].sections[sectionIndex].sectors[sectorIndex];
    } else {
        sector = eventData[eventName].sectors[sectorIndex];
    }
    
    const modal = document.getElementById('editSectorModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="edit-sector-form">
            <div class="form-group-modern">
                <label for="sectorNameInput" class="form-label-modern">📝 Nom du secteur</label>
                <input type="text" id="sectorNameInput" class="form-input-modern" value="${sector.name}" placeholder="Ex: Accueil extérieur">
            </div>
            <div class="form-group-modern">
                <label for="sectorLocationInput" class="form-label-modern">📍 Lieu / Localisation</label>
                <input type="text" id="sectorLocationInput" class="form-input-modern" value="${sector.location || ''}" placeholder="Ex: Entrée principale">
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Focus sur le premier champ
    setTimeout(() => {
        document.getElementById('sectorNameInput').focus();
    }, 100);
    
    // Gestion de la sauvegarde
    const saveBtn = modal.querySelector('#saveEditSectorBtn');
    const cancelBtn = modal.querySelector('#cancelEditSectorBtn');
    
    // Nettoyer les anciens listeners
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    newSaveBtn.addEventListener('click', () => {
        const newName = document.getElementById('sectorNameInput').value.trim();
        const newLocation = document.getElementById('sectorLocationInput').value.trim();
        
        if (newName) {
            sector.name = newName;
            sector.location = newLocation;
            saveData();
            renderEvent(currentEvent);
            modal.style.display = 'none';
        } else {
            alert('Le nom du secteur ne peut pas être vide');
        }
    });
    
    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    // Entrée pour sauvegarder
    document.getElementById('sectorNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            newSaveBtn.click();
        }
    });
}

function manageEmployeesForSector(eventName, sectionIndex, sectorIndex, type) {
    console.log('🔵 manageEmployeesForSector appelée avec:', { eventName, sectionIndex, sectorIndex, type });
    
    let sector;
    if (sectionIndex !== null) {
        sector = eventData[eventName].sections[sectionIndex].sectors[sectorIndex];
    } else {
        sector = eventData[eventName].sectors[sectorIndex];
    }
    
    const modal = document.getElementById('manageEmployeesModal');
    const modalBody = modal.querySelector('.modal-body');
    
    const listType = type === 'responsables' ? 'Responsables' : 'Employés';
    const currentList = sector[type] || [];
    
    modalBody.innerHTML = `
        <div class="sector-info-header">
            <div class="sector-name-badge">📍 ${sector.name}</div>
            ${sector.location ? `<div class="sector-location-badge">🗺️ ${sector.location}</div>` : ''}
        </div>
        
        <h3 class="employee-section-title">${listType} pour ce secteur</h3>
        
        ${currentList.length > 0 ? `
            <div class="employee-grid-modern">
                ${currentList.map((emp, idx) => `
                    <div class="employee-card-modern">
                        <span class="employee-name-modern">${emp}</span>
                        <button class="btn-remove-modern" onclick="removeEmployee('${eventName}', ${sectionIndex}, ${sectorIndex}, '${type}', ${idx})" title="Retirer">
                            ❌
                        </button>
                    </div>
                `).join('')}
            </div>
        ` : '<p class="empty-message">Aucun employé assigné pour le moment</p>'}
        
        <hr class="divider-modern">
        
        <h4 class="add-section-title">➕ Ajouter depuis la liste globale</h4>
        <div class="add-employee-section-modern">
            <select id="selectEmployeeToAdd" class="select-modern">
                <option value="">-- Choisir un employé --</option>
                ${allEmployees.sort().map(emp => `<option value="${emp}">${emp}</option>`).join('')}
            </select>
            <button class="btn-add-modern" onclick="addEmployee('${eventName}', ${sectionIndex}, ${sectorIndex}, '${type}')">
                <span class="btn-icon-modern">✓</span>
                Ajouter
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    console.log('✅ Modal affiché');
}

function addEmployee(eventName, sectionIndex, sectorIndex, type) {
    console.log('🟢 addEmployee appelée avec:', { eventName, sectionIndex, sectorIndex, type });
    
    const select = document.getElementById('selectEmployeeToAdd');
    const employeeName = select.value;
    
    if (!employeeName) {
        alert('Veuillez sélectionner un employé');
        return;
    }
    
    let sector;
    if (sectionIndex !== null) {
        sector = eventData[eventName].sections[sectionIndex].sectors[sectorIndex];
    } else {
        sector = eventData[eventName].sectors[sectorIndex];
    }
    
    if (!sector[type].includes(employeeName)) {
        sector[type].push(employeeName);
        saveData();
        manageEmployeesForSector(eventName, sectionIndex, sectorIndex, type);
        renderEvent(currentEvent);
        console.log(`✅ ${employeeName} ajouté à ${type}`);
    } else {
        alert('Cet employé est déjà dans la liste');
    }
}

function removeEmployee(eventName, sectionIndex, sectorIndex, type, employeeIndex) {
    console.log('🔴 removeEmployee appelée avec:', { eventName, sectionIndex, sectorIndex, type, employeeIndex });
    
    let sector;
    if (sectionIndex !== null) {
        sector = eventData[eventName].sections[sectionIndex].sectors[sectorIndex];
    } else {
        sector = eventData[eventName].sectors[sectorIndex];
    }
    
    if (confirm(`Retirer ${sector[type][employeeIndex]} ?`)) {
        sector[type].splice(employeeIndex, 1);
        saveData();
        manageEmployeesForSector(eventName, sectionIndex, sectorIndex, type);
        renderEvent(currentEvent);
        console.log(`✅ Employé retiré de ${type}`);
    }
}

function showManageEmployeesList() {
    const modal = document.getElementById('manageEmployeesListModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="employee-list-header">
            <h3 class="employee-list-title">📋 Liste globale des employés</h3>
            <div class="employee-count">Liste complète des employés (${allEmployees.length})</div>
        </div>
        <div class="employee-list-content">
            <div class="add-employee-section-new">
                <input type="text" id="newEmployeeName" placeholder="Nom du nouvel employé" class="employee-input-new">
                <button class="btn-add-new" onclick="addNewEmployeeToList()">➕ Ajouter</button>
            </div>
            <div class="employee-list-scroll">
                ${allEmployees.sort().map((emp, idx) => `
                    <div class="employee-item-new">
                        <span class="employee-name-new">${emp}</span>
                        <button class="btn-delete-new" onclick="removeEmployeeFromList(${idx})">🗑️ Supprimer</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function addNewEmployeeToList() {
    const input = document.getElementById('newEmployeeName');
    const name = input.value.trim();
    
    if (!name) {
        alert('Veuillez entrer un nom');
        return;
    }
    
    if (allEmployees.includes(name)) {
        alert('Cet employé existe déjà');
        return;
    }
    
    allEmployees.push(name);
    saveData();
    updateEmployeeSelect();
    showManageEmployeesList();
}

function removeEmployeeFromList(index) {
    const employeeName = allEmployees[index];
    
    if (confirm(`Supprimer "${employeeName}" de la liste globale ?\n\nATTENTION : Cela le retirera aussi de tous les événements où il est assigné.`)) {
        allEmployees.splice(index, 1);
        
        for (const eventKey in eventData) {
            const event = eventData[eventKey];
            if (event.sections) {
                event.sections.forEach(section => {
                    section.sectors.forEach(sector => {
                        sector.responsables = sector.responsables.filter(r => r !== employeeName);
                        sector.employees = sector.employees.filter(e => e !== employeeName);
                    });
                });
            } else if (event.sectors) {
                event.sectors.forEach(sector => {
                    sector.responsables = sector.responsables.filter(r => r !== employeeName);
                    sector.employees = sector.employees.filter(e => e !== employeeName);
                });
            }
        }
        
        saveData();
        updateEmployeeSelect();
        showManageEmployeesList();
        renderEvent(currentEvent);
    }
}

// ✅ DEMANDE #2 : Export PDF condensé
function exportEmployeeAssignments() {
    if (!currentEmployeeName) {
        alert('Aucun employé sélectionné');
        return;
    }
    
    // Créer une vue condensée pour l'impression
    const printWindow = window.open('', '_blank');
    const assignments = [];
    
    for (const eventKey in eventData) {
        const event = eventData[eventKey];
        let foundInEvent = false;
        
        if (event.sections) {
            event.sections.forEach(section => {
                section.sectors.forEach(sector => {
                    if (sector.responsables.includes(currentEmployeeName)) {
                        assignments.push({
                            event: event.title,
                            section: section.title,
                            sector: sector.name,
                            role: 'Responsable'
                        });
                        foundInEvent = true;
                    }
                    if (sector.employees.includes(currentEmployeeName)) {
                        assignments.push({
                            event: event.title,
                            section: section.title,
                            sector: sector.name,
                            role: 'Employé'
                        });
                        foundInEvent = true;
                    }
                });
            });
        } else if (event.sectors) {
            event.sectors.forEach(sector => {
                if (sector.responsables.includes(currentEmployeeName)) {
                    assignments.push({
                        event: event.title,
                        section: null,
                        sector: sector.name,
                        role: 'Responsable'
                    });
                    foundInEvent = true;
                }
                if (sector.employees.includes(currentEmployeeName)) {
                    assignments.push({
                        event: event.title,
                        section: null,
                        sector: sector.name,
                        role: 'Employé'
                    });
                    foundInEvent = true;
                }
            });
        }
    }
    
    // ✅ Format condensé sur une seule page
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Affectations - ${currentEmployeeName}</title>
            <style>
                @page {
                    size: A4;
                    margin: 15mm;
                }
                body {
                    font-family: Arial, sans-serif;
                    font-size: 10pt;
                    line-height: 1.3;
                    margin: 0;
                    padding: 0;
                }
                h1 {
                    font-size: 16pt;
                    margin: 0 0 10px 0;
                    color: #1a5490;
                    border-bottom: 2px solid #1a5490;
                    padding-bottom: 5px;
                }
                h2 {
                    font-size: 11pt;
                    margin: 8px 0 5px 0;
                    color: #333;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 8px;
                    font-size: 9pt;
                }
                th {
                    background: #1a5490;
                    color: white;
                    padding: 4px 6px;
                    text-align: left;
                    font-weight: bold;
                }
                td {
                    padding: 3px 6px;
                    border-bottom: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background: #f8f9fa;
                }
                .role-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 8pt;
                    font-weight: bold;
                }
                .role-responsable {
                    background: #27ae60;
                    color: white;
                }
                .role-employe {
                    background: #3498db;
                    color: white;
                }
                .section-badge {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 8pt;
                    margin-right: 5px;
                }
                .section-avant { background: #27ae60; color: white; }
                .section-pendant { background: #f39c12; color: black; }
                .section-apres { background: #e74c3c; color: white; }
            </style>
        </head>
        <body>
            <h1>🎓 Affectations de ${currentEmployeeName}</h1>
            ${assignments.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Événement</th>
                            <th>Section</th>
                            <th>Secteur</th>
                            <th>Rôle</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${assignments.map(a => {
                            let sectionClass = '';
                            let sectionText = a.section || '-';
                            
                            if (a.section) {
                                if (a.section.includes('AVANT')) {
                                    sectionClass = 'section-avant';
                                } else if (a.section.includes('PENDANT')) {
                                    sectionClass = 'section-pendant';
                                } else if (a.section.includes('APRÈS') || a.section.includes('APRES')) {
                                    sectionClass = 'section-apres';
                                }
                            }
                            
                            return `
                                <tr>
                                    <td>${a.event}</td>
                                    <td>${a.section ? `<span class="section-badge ${sectionClass}">${sectionText}</span>` : '-'}</td>
                                    <td>${a.sector}</td>
                                    <td><span class="role-badge role-${a.role.toLowerCase()}">${a.role}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            ` : '<p>Aucune affectation trouvée.</p>'}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// ✅ Nouvelle fonction : Exporter le template complet en mode Lecture
function exportTemplate() {
    const event = eventData[currentEvent];
    if (!event) {
        alert('Aucun événement sélectionné');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    
    // Générer le HTML du template complet
    let sectionsHTML = '';
    
    if (event.sections) {
        event.sections.forEach(section => {
            // Déterminer la couleur de fond
            let backgroundColor = '#f8f9fa';
            let sectionBadgeClass = '';
            
            if (section.title.includes('AVANT')) {
                backgroundColor = '#d4edda';
                sectionBadgeClass = 'section-avant';
            } else if (section.title.includes('PENDANT')) {
                backgroundColor = '#fff3cd';
                sectionBadgeClass = 'section-pendant';
            } else if (section.title.includes('APRÈS') || section.title.includes('APRES')) {
                backgroundColor = '#f8d7da';
                sectionBadgeClass = 'section-apres';
            }
            
            sectionsHTML += `
                <div class="section-export" style="margin-bottom: 20px; page-break-inside: avoid;">
                    <h2 class="section-title ${sectionBadgeClass}">${section.title}</h2>
                    ${section.sectors.map(sector => `
                        <div class="sector-export" style="background: ${backgroundColor}; padding: 12px; margin-bottom: 8px; border-radius: 8px; page-break-inside: avoid;">
                            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 15px;">
                                <div>
                                    <strong>${sector.name}</strong>
                                    ${sector.location ? `<div style="font-size: 9pt; color: #666;">📍 ${sector.location}</div>` : ''}
                                </div>
                                <div>
                                    <div style="font-weight: bold; margin-bottom: 5px;">Responsables</div>
                                    ${sector.responsables.length > 0 ? 
                                        sector.responsables.map(r => `<div style="font-size: 9pt; padding: 3px 0;">• ${r}</div>`).join('') 
                                        : '<div style="color: #999; font-size: 9pt;">Aucun</div>'}
                                </div>
                                <div>
                                    <div style="font-weight: bold; margin-bottom: 5px;">Employés</div>
                                    ${sector.employees.length > 0 ? 
                                        sector.employees.map(e => `<div style="font-size: 9pt; padding: 3px 0;">• ${e}</div>`).join('') 
                                        : '<div style="color: #999; font-size: 9pt;">Aucun</div>'}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        });
    } else if (event.sectors) {
        sectionsHTML = `
            <div class="section-export">
                ${event.sectors.map(sector => `
                    <div class="sector-export" style="background: #f8f9fa; padding: 12px; margin-bottom: 8px; border-radius: 8px; page-break-inside: avoid;">
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 15px;">
                            <div>
                                <strong>${sector.name}</strong>
                                ${sector.location ? `<div style="font-size: 9pt; color: #666;">📍 ${sector.location}</div>` : ''}
                            </div>
                            <div>
                                <div style="font-weight: bold; margin-bottom: 5px;">Responsables</div>
                                ${sector.responsables.length > 0 ? 
                                    sector.responsables.map(r => `<div style="font-size: 9pt; padding: 3px 0;">• ${r}</div>`).join('') 
                                    : '<div style="color: #999; font-size: 9pt;">Aucun</div>'}
                            </div>
                            <div>
                                <div style="font-weight: bold; margin-bottom: 5px;">Employés</div>
                                ${sector.employees.length > 0 ? 
                                    sector.employees.map(e => `<div style="font-size: 9pt; padding: 3px 0;">• ${e}</div>`).join('') 
                                    : '<div style="color: #999; font-size: 9pt;">Aucun</div>'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${event.title}</title>
            <style>
                @page {
                    size: A4 landscape;
                    margin: 15mm;
                }
                * {
                    box-sizing: border-box;
                }
                body {
                    font-family: Arial, sans-serif;
                    font-size: 10pt;
                    line-height: 1.4;
                    margin: 0;
                    padding: 0;
                }
                h1 {
                    font-size: 18pt;
                    margin: 0 0 15px 0;
                    color: #006747;
                    border-bottom: 3px solid #d4af37;
                    padding-bottom: 8px;
                    page-break-after: avoid;
                }
                h2 {
                    font-size: 14pt;
                    margin: 20px 0 10px 0;
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    page-break-after: avoid;
                    page-break-before: auto;
                }
                .section-export {
                    page-break-inside: avoid;
                    margin-bottom: 25px;
                }
                .sector-export {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    display: block;
                }
                .section-avant {
                    background: #d4edda;
                    color: #000;
                }
                .section-pendant {
                    background: #fff3cd;
                    color: #000;
                }
                .section-apres {
                    background: #f8d7da;
                    color: #000;
                }
                strong {
                    font-size: 11pt;
                }
                @media print {
                    .section-export {
                        page-break-inside: avoid !important;
                    }
                    .sector-export {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    h2 {
                        page-break-after: avoid !important;
                    }
                }
            </style>
        </head>
        <body>
            <h1>🎓 ${event.title}</h1>
            ${sectionsHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

function createSectorRow(sector, eventName, sectionIndex, sectorIndex, sectionColor, buttonColor, sectionTitle) {
    const row = document.createElement('div');
    row.className = 'sector-row';
    
    // ✅ DEMANDE #3 : Appliquer la couleur de fond pastel à toute la ligne de secteur
    row.style.backgroundColor = sectionColor;
    
    // ✅ TRAITEMENT SPÉCIAL POUR GÉNÉRAL
    if (sectionTitle && (sectionTitle.includes('GÉNÉRAL') || sectionTitle.includes('GENERAL'))) {
        row.classList.add('sector-row-general');
        row.style.display = 'block';
        row.style.padding = '25px';
        
        if (!sector.note) sector.note = '';
        
        const noteContent = document.createElement('div');
        noteContent.style.width = '100%';
        
        if (appMode === 'admin') {
            noteContent.innerHTML = '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;"><h3 style="margin: 0; font-size: 18px; color: #0d6efd; font-weight: 700;">📝 Notes générales de la cérémonie</h3><button class="btn btn-note btn-sm" onclick="manageSectorNote(\'' + eventName + '\', ' + sectionIndex + ', ' + sectorIndex + ')" title="Modifier les notes">✏️ Modifier</button></div>' + (sector.note && sector.note.trim() ? '<div style="background: #fffbf0; border: 2px solid #ffc107; border-radius: 10px; padding: 20px; min-height: 100px; white-space: pre-wrap; line-height: 1.6; text-align: center;">' + sector.note.replace(/\n/g, '<br>') + '</div>' : '<div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 10px; padding: 30px; text-align: center; color: #6c757d; font-style: italic;">Aucune note générale. Cliquez sur "Modifier" pour ajouter des notes.</div>');
        } else {
            noteContent.innerHTML = '<h3 style="margin: 0 0 15px 0; font-size: 18px; color: #0d6efd; font-weight: 700;">📝 Notes générales de la cérémonie</h3>' + (sector.note && sector.note.trim() ? '<div style="background: #fffbf0; border: 2px solid #ffc107; border-radius: 10px; padding: 20px; white-space: pre-wrap; line-height: 1.6; text-align: center;">' + sector.note.replace(/\n/g, '<br>') + '</div>' : '<div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 10px; padding: 20px; text-align: center; color: #6c757d; font-style: italic;">Aucune note générale pour cette cérémonie.</div>');
        }
        
        row.appendChild(noteContent);
        return row;
    }
    
    // ✅ INITIALISER LES CHAMPS MANQUANTS
    if (!sector.note) sector.note = '';
    if (!sector.responsables) sector.responsables = [];
    if (!sector.employees) sector.employees = [];
    if (!sector.location) sector.location = '';
    
    const infoCell = document.createElement('div');
    infoCell.className = 'sector-cell';
    
    // ✅ Déterminer la classe du bouton note (avec ou sans note)
    const noteClass = sector.note.trim() ? 'btn-note-filled' : 'btn-note-empty';
    
    // ✅ En mode admin : modal éditable
    // ✅ En mode employé/lecture : tooltip au survol
    let noteButton = '';
    if (appMode === 'admin') {
        noteButton = `<button class="btn btn-note btn-sm ${noteClass}" onclick="manageSectorNote('${eventName}', ${sectionIndex}, ${sectorIndex})" title="${sector.note.trim() ? 'Modifier la note' : 'Ajouter une note'}">📝</button>`;
    } else {
        // Mode lecture : tooltip au survol
        if (sector.note.trim()) {
            const noteEscaped = sector.note.replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/\n/g, '<br>');
            noteButton = `
                <button class="btn btn-note btn-sm ${noteClass}" title="Voir la note">
                    📝
                    <div class="note-tooltip">${noteEscaped}</div>
                </button>
            `;
        } else {
            noteButton = `<button class="btn btn-note btn-sm ${noteClass}" title="Aucune note">📝</button>`;
        }
    }
    
    infoCell.innerHTML = `
        <div class="sector-name">${sector.name}</div>
        ${sector.location ? `<div class="sector-location">📍 ${sector.location}</div>` : ''}
        <div style="margin-top: 10px; display: flex; gap: 8px; position: relative;">
            ${appMode === 'admin' ? `
                <button class="btn btn-edit btn-sm" onclick="editSector('${eventName}', ${sectionIndex}, ${sectorIndex})" title="Modifier">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSector('${eventName}', ${sectionIndex}, ${sectorIndex})" title="Supprimer">🗑️</button>
            ` : ''}
            ${noteButton}
        </div>
    `;
    row.appendChild(infoCell);
    
    const responsablesCell = document.createElement('div');
    responsablesCell.className = 'sector-cell';
    responsablesCell.innerHTML = `
        <div class="sector-cell-header" style="color: #000000;">Responsables</div>
        ${sector.responsables.length > 0 ? sector.responsables.map(r => `<div class="employee-item">${r}</div>`).join('') : '<div style="color:#999;">Aucun</div>'}
        ${appMode === 'admin' ? `<button class="btn btn-sm manage-resp-btn" style="margin-top:10px; background: ${buttonColor}; color: white; border: none;" data-event="${eventName}" data-section="${sectionIndex}" data-sector="${sectorIndex}">➕ Ajouter</button>` : ''}
    `;
    row.appendChild(responsablesCell);
    
    if (appMode === 'admin') {
        const respBtn = responsablesCell.querySelector('.manage-resp-btn');
        console.log('🔍 Recherche bouton Responsables:', respBtn);
        if (respBtn) {
            console.log('✅ Bouton Responsables trouvé, ajout du listener');
            respBtn.addEventListener('click', () => {
                console.log('🎯 CLIC DÉTECTÉ sur Gérer Responsables !');
                manageEmployeesForSector(eventName, sectionIndex, sectorIndex, 'responsables');
            });
        } else {
            console.warn('❌ Bouton Responsables NON trouvé');
        }
    }
    
    const employeeCell = document.createElement('div');
    employeeCell.className = 'sector-cell';
    employeeCell.innerHTML = `
        <div class="sector-cell-header" style="color: #000000;">Employés</div>
        ${sector.employees.length > 0 ? sector.employees.map(e => `<div class="employee-item">${e}</div>`).join('') : '<div style="color:#999;">Aucun</div>'}
        ${appMode === 'admin' ? `<button class="btn btn-sm manage-emp-btn" style="margin-top:10px; background: ${buttonColor}; color: white; border: none;" data-event="${eventName}" data-section="${sectionIndex}" data-sector="${sectorIndex}">➕ Ajouter</button>` : ''}
    `;
    row.appendChild(employeeCell);
    
    if (appMode === 'admin') {
        const empBtn = employeeCell.querySelector('.manage-emp-btn');
        console.log('🔍 Recherche bouton Employés:', empBtn);
        if (empBtn) {
            console.log('✅ Bouton Employés trouvé, ajout du listener');
            empBtn.addEventListener('click', () => {
                console.log('🎯 CLIC DÉTECTÉ sur Gérer Employés !');
                manageEmployeesForSector(eventName, sectionIndex, sectorIndex, 'employees');
            });
        } else {
            console.warn('❌ Bouton Employés NON trouvé');
        }
    }
    
    // ✅ Afficher la note toujours visible sous le secteur (si elle existe)
    if (sector.note && sector.note.trim()) {
        const noteDisplay = document.createElement('div');
        noteDisplay.className = 'note-display-inline';
        noteDisplay.innerHTML = '<strong>📝 Note:</strong> ' + sector.note.replace(/\n/g, '<br>');
        row.appendChild(noteDisplay);
    }
    
    return row;
}

async function deleteSector(eventName, sectionIndex, sectorIndex) {
    if (!confirm('Supprimer ce secteur ?')) return;
    if (sectionIndex !== null) {
        eventData[eventName].sections[sectionIndex].sectors.splice(sectorIndex, 1);
    } else {
        eventData[eventName].sectors.splice(sectorIndex, 1);
    }
    await saveData();
    renderEvent(currentEvent);
}

function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        setMode('admin');
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').textContent = '';
    } else {
        document.getElementById('loginError').textContent = 'Mot de passe incorrect';
    }
}

document.getElementById('modeEmployee').addEventListener('click', () => setMode('employee'));
document.getElementById('modeRead').addEventListener('click', () => setMode('read'));
document.getElementById('modeAdmin').addEventListener('click', () => {
    if (appMode !== 'admin') {
        document.getElementById('loginModal').style.display = 'block';
        document.getElementById('adminPassword').focus();
    }
});
document.getElementById('loginBtn').addEventListener('click', loginAdmin);
document.getElementById('cancelLoginBtn').addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').textContent = '';
});
document.getElementById('adminPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginAdmin();
});
document.getElementById('employeeSelect').addEventListener('change', (e) => {
    if (e.target.value) selectEmployee(e.target.value);
});
document.getElementById('exportEmployeeBtn').addEventListener('click', exportEmployeeAssignments);
// Fonction d'export PDF qui lit depuis le DOM
function exportToPDF() {
    const printWindow = window.open('', '_blank');
    const ceremonyTitle = document.querySelector('.event-title')?.textContent || 'Cérémonie';
    
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${ceremonyTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; color: #006747; }
        h2 { padding: 15px; margin: 20px 0 10px 0; }
        .section-avant { background: #28a745; color: white; }
        .section-pendant { background: #ffc107; color: #000; }
        .section-apres { background: #dc3545; color: white; }
        .section-general { background: #0d6efd; color: white; }
        .sector { 
            display: grid; 
            grid-template-columns: 2fr 1fr 1fr; 
            gap: 15px; 
            padding: 20px; 
            margin: 10px 0; 
            border: 1px solid #ddd; 
            page-break-inside: avoid;
        }
        .sector-avant { background: #d4edda; }
        .sector-pendant { background: #fff3cd; }
        .sector-apres { background: #f8d7da; }
        .sector-general { 
            display: block !important;
            background: #cfe2ff !important;
        }
        .sector-general .responsables-col,
        .sector-general .employees-col {
            display: none !important;
        }
        .sector-name { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
        .sector-location { color: #666; font-size: 14px; }
        .note { 
            grid-column: 1 / 4; 
            background: #fffbf0; 
            border: 2px solid #ffc107; 
            padding: 15px; 
            margin-top: 10px;
            border-radius: 5px;
            page-break-inside: avoid;
        }
        .note strong { color: #d4af37; margin-right: 8px; }
        .employee-item { padding: 5px; margin: 3px 0; background: white; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>${ceremonyTitle}</h1>
`;

    // Lire depuis le DOM actuel
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTitle = section.querySelector('.section-header .section-title')?.textContent || '';
        const sectionClass = sectionTitle.includes('AVANT') ? 'avant' :
                           sectionTitle.includes('PENDANT') ? 'pendant' :
                           sectionTitle.includes('APRÈS') || sectionTitle.includes('APRES') ? 'apres' :
                           sectionTitle.includes('GÉNÉRAL') || sectionTitle.includes('GENERAL') ? 'general' : '';
        
        html += `<h2 class="section-${sectionClass}">${sectionTitle}</h2>`;
        
        const sectorRows = section.querySelectorAll('.sector-row');
        sectorRows.forEach(row => {
            const isGeneral = row.classList.contains('sector-row-general');
            
            if (isGeneral) {
                // Section GÉNÉRAL - affichage simplifié
                html += `<div class="sector sector-general">`;
                html += `<div class="sector-name">📝 Notes générales de la cérémonie</div>`;
                
                // Chercher le contenu de la note dans la div avec fond orange
                const noteDiv = row.querySelector('div[style*="background: #fffbf0"]');
                if (noteDiv) {
                    const noteText = noteDiv.innerHTML;
                    html += `<div class="note">${noteText}</div>`;
                } else {
                    html += `<div style="color: #999; font-style: italic; padding: 15px;">Aucune note générale pour cette cérémonie.</div>`;
                }
                html += `</div>`;
            } else {
                // Secteur normal
                const sectorName = row.querySelector('.sector-name')?.textContent || '';
                const sectorLocation = row.querySelector('.sector-location')?.textContent || '';
                const responsables = Array.from(row.querySelectorAll('.sector-cell')[1]?.querySelectorAll('.employee-item') || []).map(el => el.textContent);
                const employees = Array.from(row.querySelectorAll('.sector-cell')[2]?.querySelectorAll('.employee-item') || []).map(el => el.textContent);
                const noteElement = row.querySelector('.note-display-inline');
                const noteText = noteElement ? noteElement.innerHTML.replace('<strong>📝 Note:</strong> ', '') : '';
                
                html += `<div class="sector sector-${sectionClass}">`;
                html += `<div>`;
                html += `<div class="sector-name">${sectorName}</div>`;
                if (sectorLocation) html += `<div class="sector-location">${sectorLocation}</div>`;
                html += `</div>`;
                
                html += `<div class="responsables-col"><strong>Responsables</strong><br>`;
                if (responsables.length > 0) {
                    responsables.forEach(r => html += `<div class="employee-item">${r}</div>`);
                } else {
                    html += `<div style="color:#999;">Aucun</div>`;
                }
                html += `</div>`;
                
                html += `<div class="employees-col"><strong>Employés</strong><br>`;
                if (employees.length > 0) {
                    employees.forEach(e => html += `<div class="employee-item">${e}</div>`);
                } else {
                    html += `<div style="color:#999;">Aucun</div>`;
                }
                html += `</div>`;
                
                if (noteText) {
                    html += `<div class="note"><strong>📝 Note:</strong> ${noteText}</div>`;
                }
                
                html += `</div>`;
            }
        });
    });
    
    html += `
    <script>
        window.onload = function() {
            setTimeout(() => window.print(), 500);
        };
    </script>
</body>
</html>`;
    
    printWindow.document.write(html);
    printWindow.document.close();
}

document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
document.getElementById('exportTemplateBtn').addEventListener('click', exportTemplate);
document.getElementById('manageEmployeesListBtn').addEventListener('click', showManageEmployeesList);
document.getElementById('copyTemplateBtn').addEventListener('click', copyTemplateToAllCeremonies);

document.getElementById('cancelManageEmployees').addEventListener('click', () => {
    console.log('🔴 Fermeture du modal manageEmployeesModal');
    document.getElementById('manageEmployeesModal').style.display = 'none';
});

const saveTemplateBtn = document.getElementById('saveTemplateBtn');
const loadTemplateBtn = document.getElementById('loadTemplateBtn');
if (saveTemplateBtn) {
    saveTemplateBtn.addEventListener('click', () => {
        alert('Fonctionnalité de sauvegarde de template à venir !');
    });
}
if (loadTemplateBtn) {
    loadTemplateBtn.addEventListener('click', () => {
        alert('Fonctionnalité de chargement de template à venir !');
    });
}

document.getElementById('eventSelector').addEventListener('change', (e) => {
    currentEvent = e.target.value;
    renderEvent(currentEvent);
});
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

window.renameCeremony = renameCeremony;
window.addSector = addSector;
window.editSector = editSector;
window.deleteSector = deleteSector;
window.manageEmployeesForSector = manageEmployeesForSector;
window.addEmployee = addEmployee;
window.removeEmployee = removeEmployee;
window.showManageEmployeesList = showManageEmployeesList;
window.addNewEmployeeToList = addNewEmployeeToList;
window.removeEmployeeFromList = removeEmployeeFromList;
window.exportTemplate = exportTemplate;
window.manageSectorNote = manageSectorNote;
window.copyTemplateToAllCeremonies = copyTemplateToAllCeremonies;

console.log('🚀 Démarrage...');
console.log('🔍 Vérification des fonctions globales:');
console.log('  ✅ manageEmployeesForSector:', typeof window.manageEmployeesForSector);
console.log('  ✅ addEmployee:', typeof window.addEmployee);
console.log('  ✅ removeEmployee:', typeof window.removeEmployee);
console.log('  ✅ editSector:', typeof window.editSector);
console.log('  ✅ deleteSector:', typeof window.deleteSector);
console.log('  ✅ addSector:', typeof window.addSector);
console.log('  ✅ renameCeremony:', typeof window.renameCeremony);

const requiredFunctions = [
    'manageEmployeesForSector', 
    'addEmployee', 
    'removeEmployee', 
    'editSector', 
    'deleteSector', 
    'addSector',
    'renameCeremony'
];

const missingFunctions = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
if (missingFunctions.length > 0) {
    console.error('❌ Fonctions manquantes:', missingFunctions);
} else {
    console.log('✅ Toutes les fonctions sont exposées globalement !');
}

setMode('employee');
initializeData();

// ✅ NOUVELLE FONCTION : Gérer les notes de secteur
function manageSectorNote(eventName, sectionIndex, sectorIndex) {
    let sector;
    if (sectionIndex !== null) {
        sector = eventData[eventName].sections[sectionIndex].sectors[sectorIndex];
    } else {
        sector = eventData[eventName].sectors[sectorIndex];
    }
    
    const modal = document.getElementById('sectorNoteModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="note-header-info">
            <div class="note-sector-name">📍 ${sector.name}</div>
            ${sector.location ? `<div class="note-sector-location">🗺️ ${sector.location}</div>` : ''}
        </div>
        <div class="form-group-modern">
            <label for="sectorNoteInput" class="form-label-modern">📝 Note / Commentaire</label>
            <textarea id="sectorNoteInput" class="form-textarea-modern" rows="6" placeholder="Ajoutez une note ou un commentaire pour ce secteur...">${sector.note || ''}</textarea>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Focus sur le textarea
    setTimeout(() => {
        document.getElementById('sectorNoteInput').focus();
    }, 100);
    
    // Gestion de la sauvegarde
    const saveBtn = modal.querySelector('#saveSectorNoteBtn');
    const cancelBtn = modal.querySelector('#cancelSectorNoteBtn');
    
    // Nettoyer les anciens listeners
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    newSaveBtn.addEventListener('click', () => {
        const noteText = document.getElementById('sectorNoteInput').value;
        sector.note = noteText;
        saveData();
        renderEvent(currentEvent);
        modal.style.display = 'none';
    });
    
    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

// ✅ NOUVELLE FONCTION : Copier le template de la cérémonie 1 vers les autres cérémonies
function copyTemplateToAllCeremonies() {
    // Confirmation avant de copier
    const confirmation = confirm(
        '📋 COPIER LE TEMPLATE DE LA CÉRÉMONIE 1\n\n' +
        'Cette action va copier TOUS les employés, responsables et notes\n' +
        'de la Cérémonie 1 vers les Cérémonies 2, 3, 4, 5 et 6.\n\n' +
        '⚠️ Les données actuelles des cérémonies 2-6 seront ÉCRASÉES.\n\n' +
        'Voulez-vous continuer ?'
    );
    
    if (!confirmation) {
        console.log('❌ Copie de template annulée par l\'utilisateur');
        return;
    }
    
    try {
        console.log('📋 Début de la copie du template de la cérémonie 1...');
        
        // Vérifier que la cérémonie 1 existe
        if (!eventData.ceremonie1 || !eventData.ceremonie1.sections) {
            alert('❌ Erreur: La cérémonie 1 n\'existe pas ou est invalide.');
            return;
        }
        
        // Fonction pour copier en profondeur (deep copy)
        function deepCopy(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        
        // Copier les sections de la cérémonie 1
        const templateSections = deepCopy(eventData.ceremonie1.sections);
        
        // Liste des cérémonies cibles
        const targetCeremonies = ['ceremonie2', 'ceremonie3', 'ceremonie4', 'ceremonie5', 'ceremonie6'];
        let copiedCount = 0;
        
        // Copier vers chaque cérémonie
        targetCeremonies.forEach(ceremonyKey => {
            if (eventData[ceremonyKey]) {
                console.log(`📝 Copie vers ${ceremonyKey}...`);
                
                // Sauvegarder le titre original
                const originalTitle = eventData[ceremonyKey].title;
                
                // Copier toutes les sections avec les données
                eventData[ceremonyKey].sections = deepCopy(templateSections);
                
                // Restaurer le titre original
                eventData[ceremonyKey].title = originalTitle;
                
                copiedCount++;
                console.log(`✅ ${ceremonyKey} mise à jour avec succès`);
            } else {
                console.warn(`⚠️ ${ceremonyKey} n'existe pas dans eventData`);
            }
        });
        
        // Sauvegarder dans Firebase
        console.log('💾 Sauvegarde dans Firebase...');
        saveData();
        
        // Message de confirmation
        alert(
            '✅ COPIE RÉUSSIE !\n\n' +
            `Le template de la Cérémonie 1 a été copié vers ${copiedCount} cérémonies.\n\n` +
            'Toutes les affectations d\'employés, responsables et notes\n' +
            'ont été dupliquées avec succès.'
        );
        
        console.log(`✅ Copie terminée avec succès ! ${copiedCount} cérémonies mises à jour.`);
        
        // Rafraîchir l'affichage
        renderEvent(currentEvent);
        
    } catch (error) {
        console.error('❌ Erreur lors de la copie du template:', error);
        alert(
            '❌ ERREUR lors de la copie du template\n\n' +
            'Détails: ' + error.message + '\n\n' +
            'Veuillez vérifier la console (F12) pour plus d\'informations.'
        );
    }
}


// ✅ NOUVELLE FONCTION : Migrer la structure des cérémonies
function migrateStructureToCeremonies() {
    const confirmation = confirm(
        '🔄 MISE À JOUR DE LA STRUCTURE\n\n' +
        'Cette action va mettre à jour la structure des 6 cérémonies :\n\n' +
        '✅ Ajouter 3 nouveaux secteurs dans AVANT\n' +
        '✅ Déplacer 3 secteurs de PENDANT vers APRÈS\n' +
        '✅ Conserver TOUTES vos affectations actuelles\n\n' +
        'Vos employés, responsables et notes seront préservés.\n\n' +
        'Voulez-vous continuer ?'
    );
    
    if (!confirmation) {
        console.log('❌ Migration annulée par l\'utilisateur');
        return;
    }
    
    try {
        console.log('🔄 Début de la migration de structure...');
        
        const ceremoniesToMigrate = ['ceremonie1', 'ceremonie2', 'ceremonie3', 'ceremonie4', 'ceremonie5', 'ceremonie6'];
        let migratedCount = 0;
        
        ceremoniesToMigrate.forEach(ceremonyKey => {
            if (!eventData[ceremonyKey] || !eventData[ceremonyKey].sections) {
                console.warn(`⚠️ ${ceremonyKey} n'existe pas ou est invalide`);
                return;
            }
            
            console.log(`📝 Migration de ${ceremonyKey}...`);
            
            const sections = eventData[ceremonyKey].sections;
            
            // Trouver les sections AVANT, PENDANT, APRÈS
            const avantSection = sections.find(s => s.title === 'AVANT LA CÉRÉMONIE' || s.title === 'AVANT');
            const pendantSection = sections.find(s => s.title === 'PENDANT LA CÉRÉMONIE' || s.title === 'PENDANT');
            const apresSection = sections.find(s => s.title === 'APRÈS LA CÉRÉMONIE' || s.title === 'APRÈS');
            
            if (!avantSection || !pendantSection || !apresSection) {
                console.error(`❌ Sections manquantes pour ${ceremonyKey}`);
                return;
            }
            
            // === ÉTAPE 1 : AJOUTER les nouveaux secteurs dans AVANT ===
            
            // Trouver l'index de "Préparation des diplômés (Épitoges)"
            const epitogesIndex = avantSection.sectors.findIndex(s => s.name === "Préparation des diplômés (Épitoges)");
            
            if (epitogesIndex !== -1) {
                // Vérifier si les nouveaux secteurs existent déjà
                const hasVestiaires = avantSection.sectors.some(s => s.name === "Préparation des diplômés (Vestiaires et sacoche)");
                const hasMortier = avantSection.sectors.some(s => s.name === "Préparation des diplômés (Mortier)");
                
                if (!hasVestiaires) {
                    avantSection.sectors.splice(epitogesIndex + 1, 0, {
                        name: "Préparation des diplômés (Vestiaires et sacoche)",
                        location: "",
                        responsables: [],
                        employees: [],
                        note: ""
                    });
                    console.log(`  ✅ Ajout: Vestiaires et sacoche`);
                }
                
                if (!hasMortier) {
                    const newEpitogesIndex = avantSection.sectors.findIndex(s => s.name === "Préparation des diplômés (Épitoges)");
                    const insertIndex = hasVestiaires ? newEpitogesIndex + 2 : newEpitogesIndex + 1;
                    avantSection.sectors.splice(insertIndex, 0, {
                        name: "Préparation des diplômés (Mortier)",
                        location: "",
                        responsables: [],
                        employees: [],
                        note: ""
                    });
                    console.log(`  ✅ Ajout: Mortier`);
                }
            }
            
            // Trouver l'index de "Chapiteau des diplômés"
            const chapiteauIndex = avantSection.sectors.findIndex(s => s.name === "Chapiteau des diplômés");
            
            if (chapiteauIndex !== -1) {
                const hasConsignes = avantSection.sectors.some(s => s.name === "Consignes aux diplômés et gestion de la salle");
                
                if (!hasConsignes) {
                    avantSection.sectors.splice(chapiteauIndex + 1, 0, {
                        name: "Consignes aux diplômés et gestion de la salle",
                        location: "",
                        responsables: [],
                        employees: [],
                        note: ""
                    });
                    console.log(`  ✅ Ajout: Consignes aux diplômés`);
                }
            }
            
            // === ÉTAPE 2 : DÉPLACER les secteurs de PENDANT vers APRÈS ===
            
            const secteursADeplacer = [
                "Popcorn au chapiteau",
                "Équipe volante",
                "Équipe de coordination"
            ];
            
            secteursADeplacer.forEach(nomSecteur => {
                // Trouver le secteur dans PENDANT
                const indexInPendant = pendantSection.sectors.findIndex(s => s.name === nomSecteur);
                
                if (indexInPendant !== -1) {
                    // Vérifier s'il n'est pas déjà dans APRÈS
                    const existsInApres = apresSection.sectors.some(s => s.name === nomSecteur);
                    
                    if (!existsInApres) {
                        // Extraire le secteur avec toutes ses données
                        const secteur = pendantSection.sectors[indexInPendant];
                        
                        // Retirer de PENDANT
                        pendantSection.sectors.splice(indexInPendant, 1);
                        
                        // Ajouter à APRÈS
                        apresSection.sectors.push(secteur);
                        
                        console.log(`  ✅ Déplacé: ${nomSecteur} (PENDANT → APRÈS)`);
                    } else {
                        // S'il existe déjà dans APRÈS, juste le retirer de PENDANT
                        pendantSection.sectors.splice(indexInPendant, 1);
                        console.log(`  ✅ Retiré de PENDANT: ${nomSecteur} (déjà dans APRÈS)`);
                    }
                }
            });
            
            migratedCount++;
            console.log(`✅ ${ceremonyKey} migrée avec succès`);
        });
        
        // Sauvegarder dans Firebase
        console.log('💾 Sauvegarde dans Firebase...');
        saveData();
        
        // Message de confirmation
        alert(
            '✅ MIGRATION RÉUSSIE !\n\n' +
            `${migratedCount} cérémonies ont été mises à jour.\n\n` +
            '✅ 3 nouveaux secteurs ajoutés dans AVANT\n' +
            '✅ 3 secteurs déplacés vers APRÈS\n' +
            '✅ Toutes vos affectations sont conservées\n\n' +
            'Rechargez la page pour voir les changements.'
        );
        
        console.log(`✅ Migration terminée avec succès ! ${migratedCount} cérémonies mises à jour.`);
        
        // Rafraîchir l'affichage
        renderEvent(currentEvent);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        alert(
            '❌ ERREUR lors de la migration\n\n' +
            'Détails: ' + error.message + '\n\n' +
            'Veuillez vérifier la console (F12) pour plus d\'informations.\n' +
            'Vos données n\'ont PAS été modifiées.'
        );
    }
}



async function migrateToNewStructure() {
    if (!confirm('⚠️ MIGRATION\n\nCette action va ajouter:\n- Section GÉNÉRAL (en bleu)\n- Secteur "Retour des toges réguliers"\n\nVos données existantes seront préservées.\n\nContinuer ?')) {
        return;
    }
    
    console.log('🔄 Début de la migration...');
    
    try {
        let migratedCount = 0;
        let addedRetourCount = 0;
        let addedGeneralCount = 0;
        
        ['ceremonie1', 'ceremonie2', 'ceremonie3', 'ceremonie4', 'ceremonie5', 'ceremonie6'].forEach(ceremonyKey => {
            if (!eventData[ceremonyKey] || !eventData[ceremonyKey].sections) {
                return;
            }
            
            const sections = eventData[ceremonyKey].sections;
            
            const apresSection = sections.find(s => 
                s.title === 'APRÈS LA CÉRÉMONIE' || 
                s.title === 'APRÈS' ||
                s.title.includes('APRÈS') ||
                s.title.includes('APRES')
            );
            
            if (apresSection) {
                const hasRetourReguliers = apresSection.sectors.some(s => 
                    s.name === "Retour des toges réguliers"
                );
                
                if (!hasRetourReguliers) {
                    let lastRetourIndex = -1;
                    for (let i = apresSection.sectors.length - 1; i >= 0; i--) {
                        if (apresSection.sectors[i].name.toLowerCase().includes("retour des toges")) {
                            lastRetourIndex = i;
                            break;
                        }
                    }
                    
                    if (lastRetourIndex !== -1) {
                        apresSection.sectors.splice(lastRetourIndex + 1, 0, {
                            name: "Retour des toges réguliers",
                            location: "",
                            responsables: [],
                            employees: [],
                            note: ""
                        });
                        addedRetourCount++;
                    } else {
                        apresSection.sectors.unshift({
                            name: "Retour des toges réguliers",
                            location: "",
                            responsables: [],
                            employees: [],
                            note: ""
                        });
                        addedRetourCount++;
                    }
                }
            }
            
            const hasGeneral = sections.some(s => 
                s.title === 'GÉNÉRAL' || 
                s.title === 'GENERAL'
            );
            
            if (!hasGeneral) {
                sections.push({
                    title: "GÉNÉRAL",
                    sectors: [
                        {
                            name: "Notes générales",
                            location: "",
                            responsables: [],
                            employees: [],
                            note: ""
                        }
                    ]
                });
                addedGeneralCount++;
            }
            
            migratedCount++;
        });
        
        await saveData();
        
        alert(
            '✅ MIGRATION RÉUSSIE !\n\n' +
            migratedCount + ' cérémonies ont été mises à jour.\n\n' +
            '✅ "' + addedRetourCount + '" x "Retour des toges réguliers" ajoutés\n' +
            '✅ "' + addedGeneralCount + '" x Section GÉNÉRAL ajoutées\n\n' +
            'La page va se recharger automatiquement...'
        );
        
        setTimeout(() => {
            location.reload();
        }, 1500);
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        alert(
            '❌ ERREUR lors de la migration\n\n' +
            'Détails: ' + error.message
        );
    }
}


console.log('🚀 Application Cérémonie des Grades - Démarrage...');
console.log('🔐 Système d\'authentification: ACTIVÉ');
console.log('⏳ Initialisation de l\'authentification Firebase...');
console.log('📌 Note: Attendez le message "✅ Authentification anonyme réussie" avant de modifier des données');

