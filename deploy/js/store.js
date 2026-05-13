import { translations as uiTranslations } from './i18n/index.js';
import {
    auth, db,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc,
    addDoc, serverTimestamp, orderBy, onSnapshot, deleteDoc, or
} from './firebase-config.js';

class Store {
    constructor() {
        let favorites = [];
        try {
            const saved = localStorage.getItem('favorites');
            if (saved) favorites = JSON.parse(saved);
        } catch (e) {
            console.warn('[Store] Could not parse favorites from localStorage', e);
        }

        this.state = {
            user: null,
            lang: localStorage.getItem('lang') || 'en',
            dictionary: [], // Normalized approved words
            favorites: favorites,
            prepopulatedWord: null,
            editingWordId: null,
            authLoaded: false,
            searchQuery: '',
            selectedTermId: null,
            backend_url: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : ''
        };
        this.listeners = [];

        // listen for auth changes
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        this.state.user = { id: firebaseUser.uid, ...userDoc.data() };
                    } else {
                        this.state.user = { id: firebaseUser.uid, email: firebaseUser.email, role: 'student', status: 'approved', name: firebaseUser.email.split('@')[0] };
                    }
                } catch (err) {
                    console.error("Error fetching user profile:", err);
                    this.state.user = { id: firebaseUser.uid, email: firebaseUser.email, role: 'student', status: 'approved', name: 'User' };
                }
            } else {
                this.state.user = null;
            }
            this.state.authLoaded = true;
            this.setupDictionaryListener(); // Re-setup with user context
            this.notify();
        });

        // Real-time listener for words: Approved OR authored by current user
        this.setupDictionaryListener();
    }

    setupDictionaryListener() {
        if (this.unsubDictionary) this.unsubDictionary();

        let q;
        const userEmail = this.state.user?.email;

        if (userEmail) {
            q = query(
                collection(db, "words"),
                or(
                    where("status", "==", "approved"),
                    where("author", "==", userEmail)
                )
            );
        } else {
            q = query(
                collection(db, "words"),
                where("status", "==", "approved")
            );
        }

        this.unsubDictionary = onSnapshot(q, (snapshot) => {
            this.state.dictionary = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.notify();
        }, (err) => {
            console.error("Firestore dictionary listener error:", err);
        });
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setLang(lang) {
        this.state.lang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;

        const rtlLangs = ['ar'];
        document.documentElement.dir = rtlLangs.includes(lang) ? 'rtl' : 'ltr';

        const titles = {
            'en': 'Smart Scientific Dictionary | Modern Science Tools',
            'fr': 'Dictionnaire Scientifique Intelligent | Outils Modernes',
            'ar': 'قاموسي العلمي الذكي | أدوات العلوم الحديثة',
            'zgh': 'ⴰⵎⴰⵡⴰⵍ ⵓⵙⵙⵏⴰⵏ ⴰⵎⵓⵟⵟⵓⵏ | Smart Dictionary'
        };
        document.title = titles[lang] || titles['en'];

        this.notify();
    }

    async apiRegister(userData) {
        try {
            const { email, password, name, role, lastName, institution } = userData;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const profile = {
                uid: user.uid,
                email,
                name,
                lastName: lastName || '',
                institution: institution || '',
                role,
                status: role === 'teacher' ? 'pending' : 'approved',
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, "users", user.uid), profile);
            return { message: 'Registration successful', status: profile.status };
        } catch (err) {
            console.error("Firebase Register Error:", err);
            throw err;
        }
    }

    async apiLogin(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            let userDoc = await getDoc(doc(db, "users", user.uid));
            
            let profile;
            if (!userDoc.exists()) {
                console.warn("User profile missing in Firestore, creating default...");
                profile = {
                    uid: user.uid,
                    email: user.email,
                    name: user.email.split('@')[0],
                    lastName: '',
                    institution: '',
                    role: 'student',
                    status: 'approved',
                    createdAt: serverTimestamp()
                };
                await setDoc(doc(db, "users", user.uid), profile);
            } else {
                profile = userDoc.data();
            }

            if (profile.status === 'pending') {
                await signOut(auth);
                throw new Error('Your teacher account is pending administrator approval.');
            }

            this.state.user = { id: user.uid, ...profile };
            this.notify();
            return this.state.user;
        } catch (err) {
            console.error("Firebase Login Error:", err);
            throw err;
        }
    }

    async getPendingTeachers() {
        try {
            const q = query(collection(db, "users"), where("role", "==", "teacher"), where("status", "==", "pending"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
            console.error("Firestore Fetch Error:", err);
            return [];
        }
    }

    async getPendingWords() {
        try {
            const q = query(collection(db, "words"), where("status", "==", "pending"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
            console.error("Firestore Fetch Words Error:", err);
            return [];
        }
    }

    async approveTeacher(userId, action) {
        try {
            const status = action === 'approved' ? 'approved' : 'rejected';
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status: status });
            return { message: `User ${action}` };
        } catch (err) {
            console.error("Firestore Update Error:", err);
            throw err;
        }
    }

    async logout() {
        await signOut(auth);
        this.state.user = null;
        this.notify();
        window.location.hash = '#login';
    }

    async apiChat(message) {
        try {
            const response = await fetch(`${this.state.backend_url}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    lang: this.state.lang
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Chat API Error Status:", response.status, errorData);
                return errorData.reply || `Server error (${response.status}). Please check console for details.`;
            }

            const data = await response.json();
            return data.reply;

        } catch (err) {
            console.error("Chat API Network/Parsing Error:", err);
            return "Unable to reach the scientific assistant. Please ensure your internet connection is stable and the API is correctly configured.";
        }
    }


    // --- Dictionary Firestore Actions ---

    async addWord(wordData) {
        if (!this.state.user) return;
        try {
            const docRef = await addDoc(collection(db, "words"), {
                ...wordData,
                author: this.state.user.email,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (err) {
            console.error("Firestore Add Word Error:", err);
            throw err;
        }
    }

    async updateWord(id, updates) {
        try {
            const wordRef = doc(db, "words", id);
            await updateDoc(wordRef, updates);
        } catch (err) {
            console.error("Firestore Update Word Error:", err);
            throw err;
        }
    }

    async approveWord(id) {
        return this.updateWord(id, { status: 'approved' });
    }

    async rejectWord(id) {
        return this.updateWord(id, { status: 'rejected' });
    }

    async deleteWord(id) {
        try {
            await deleteDoc(doc(db, "words", id));
        } catch (err) {
            console.error("Firestore Delete Word Error:", err);
            throw err;
        }
    }

    toggleFavorite(termId) {
        if (this.state.favorites.includes(termId)) {
            this.state.favorites = this.state.favorites.filter(id => id !== termId);
        } else {
            this.state.favorites.push(termId);
        }
        localStorage.setItem('favorites', JSON.stringify(this.state.favorites));
        this.notify();
    }

    isFavorite(termId) { return this.state.favorites.includes(termId); }

    t(key) {
        const dict = uiTranslations[this.state.lang] || uiTranslations['en'];
        return dict[key] || key;
    }

    getDictionary() {
        return this.state.dictionary;
    }

    setEditingWord(id) { this.state.editingWordId = id; this.notify(); }
    clearEditingWord() { this.state.editingWordId = null; this.notify(); }
    setPrepopulatedWord(word) { this.state.prepopulatedWord = word; this.notify(); }
    clearPrepopulatedWord() { this.state.prepopulatedWord = null; this.notify(); }

    setSearchQuery(q) {
        if (this.state.searchQuery === q) return;
        this.state.searchQuery = q;
        this.notify();
    }
    setSelectedTermId(id) { this.state.selectedTermId = id; }
}

export const store = new Store();
if (store.state.lang) {
    store.setLang(store.state.lang);
}
