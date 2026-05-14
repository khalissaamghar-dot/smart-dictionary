// ============================================================
// Firebase SDK Configuration & Exports
// Using standard Firebase v10+ modular SDK via CDN
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword as _createUserWithEmailAndPassword, 
    signInWithEmailAndPassword as _signInWithEmailAndPassword, 
    signOut as _signOut, 
    onAuthStateChanged as _onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    getFirestore, 
    doc as _doc, 
    setDoc as _setDoc, 
    getDoc as _getDoc, 
    collection as _collection, 
    query as _query, 
    where as _where, 
    getDocs as _getDocs, 
    updateDoc as _updateDoc, 
    addDoc as _addDoc, 
    serverTimestamp as _serverTimestamp, 
    orderBy as _orderBy, 
    onSnapshot as _onSnapshot, 
    deleteDoc as _deleteDoc,
    or as _or
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpBegj3V7vGahrHzFQby_uUoyD2K0AmNo",
    authDomain: "smart-dictionnary.firebaseapp.com",
    projectId: "smart-dictionnary",
    storageBucket: "smart-dictionnary.firebasestorage.app",
    messagingSenderId: "392063270311",
    appId: "1:392063270311:web:76cb3a772f8a094b414a82",
    measurementId: "G-9NE3RC9K5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Re-export Auth Functions
export const createUserWithEmailAndPassword = _createUserWithEmailAndPassword;
export const signInWithEmailAndPassword = _signInWithEmailAndPassword;
export const signOut = _signOut;
export const onAuthStateChanged = _onAuthStateChanged;

// Re-export Firestore Functions
export const doc = _doc;
export const setDoc = _setDoc;
export const getDoc = _getDoc;
export const collection = _collection;
export const query = _query;
export const where = _where;
export const getDocs = _getDocs;
export const updateDoc = _updateDoc;
export const addDoc = _addDoc;
export const serverTimestamp = _serverTimestamp;
export const orderBy = _orderBy;
export const onSnapshot = _onSnapshot;
export const deleteDoc = _deleteDoc;
export const or = _or;
