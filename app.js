// ✅ VERSION SÉCURISÉE avec Firebase Auth - DEC 2024
// Configuration Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, get, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

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
let isAdminAuthenticated = false; // ✅ NOUVEAU: Track si on est vraiment admin

// ✅ CREDENTIALS ADMIN - À CRÉER DANS FIREBASE CONSOLE
const ADMIN_EMAIL = 'admin@ceremonie-grades.com';
const ADMIN_PASSWORD_CHECK = 'admin2026'; // Mot de passe que l'utilisateur tape

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    console.log('✅ Firebase initialisé');
    
    // Attendre que l'authentification soit prête
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('✅ Utilisateur authentifié:', user.uid);
            console.log('📧 Email:', user.email || 'Anonyme');
            isAuthReady = true;
            
            // ✅ NOUVEAU: Vérifier si c'est un admin
            if (user.email === ADMIN_EMAIL) {
                isAdminAuthenticated = true;
                console.log('🔑 Mode Admin activé via Firebase Auth');
                setMode('admin'); // Activer automatiquement le mode admin
            } else {
                isAdminAuthenticated = false;
            }
        } else {
            console.log('⏳ Authentification en cours...');
            // Authentification anonyme automatique
            signInAnonymously(auth)
                .then(() => {
                    console.log('✅ Authentification anonyme réussie');
                    isAuthReady = true;
                    isAdminAuthenticated = false;
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

// ✅ NOUVEAU: Fonction de login admin sécurisée
async function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password !== ADMIN_PASSWORD_CHECK) {
        document.getElementById('loginError').textContent = 'Mot de passe incorrect';
        return;
    }
    
    try {
        // ✅ Se déconnecter de la session anonyme d'abord
        await signOut(auth);
        
        // ✅ Se connecter avec le compte admin Firebase
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD_CHECK);
        
        console.log('🔑 Connexion admin réussie');
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').textContent = '';
        
        // Le mode admin sera activé automatiquement par onAuthStateChanged
        
    } catch (error) {
        console.error('❌ Erreur de connexion admin:', error);
        
        if (error.code === 'auth/user-not-found') {
            document.getElementById('loginError').textContent = 'Compte admin non configuré. Contactez l\'administrateur.';
        } else if (error.code === 'auth/wrong-password') {
            document.getElementById('loginError').textContent = 'Mot de passe incorrect';
        } else {
            document.getElementById('loginError').textContent = 'Erreur de connexion: ' + error.message;
        }
    }
}

// ✅ MODIFIÉ: Fonction pour changer de mode
function setMode(mode) {
    // ✅ SÉCURITÉ: Empêcher l'accès au mode admin si pas authentifié
    if (mode === 'admin' && !isAdminAuthenticated) {
        console.warn('⚠️ Tentative d\'accès au mode admin sans authentification Firebase');
        alert('⚠️ Vous devez vous connecter avec le mot de passe admin');
        return;
    }
    
    appMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'admin') {
        document.getElementById('modeAdmin').classList.add('active');
    } else if (mode === 'employee') {
        document.getElementById('modeEmployee').classList.add('active');
    } else {
        document.getElementById('modeRead').classList.add('active');
    }
    
    renderEvent(currentEvent);
}

// ✅ NOUVEAU: Fonction de déconnexion admin
async function logoutAdmin() {
    if (isAdminAuthenticated) {
        await signOut(auth);
        // La reconnexion anonyme se fera automatiquement via onAuthStateChanged
        console.log('👋 Déconnexion admin, retour en mode lecture seule');
    }
}

// ✅ À AJOUTER dans tes event listeners
document.getElementById('modeEmployee').addEventListener('click', async () => {
    if (isAdminAuthenticated) {
        await logoutAdmin();
    }
    setMode('employee');
});

document.getElementById('modeRead').addEventListener('click', async () => {
    if (isAdminAuthenticated) {
        await logoutAdmin();
    }
    setMode('read');
});

document.getElementById('modeAdmin').addEventListener('click', () => {
    if (!isAdminAuthenticated) {
        document.getElementById('loginModal').style.display = 'block';
        document.getElementById('adminPassword').focus();
    }
});

document.getElementById('loginBtn').addEventListener('click', loginAdmin);

// ✅ RESTE DE TON CODE ICI (tout le reste reste identique)
// ...
