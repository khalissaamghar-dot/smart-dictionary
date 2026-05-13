import { store } from './store.js';
import { handleRoute } from './router.js';
import { seedData } from './data.js';

// Expose store globally for template event handlers (onclick, etc.)
window.store = store;

function init() {
    console.log('[App] Initializing Smart Scientific Dictionary...');
    
    try {
        seedData();
        console.log('[App] Data seeded.');
        
        handleRoute();

        store.subscribe((state) => {
            console.log('[App] State changed, refreshing view.');
            handleRoute();
        });
        
        console.log('[App] Init sequence finished.');
    } catch (err) {
        console.error('[App] Fatal Startup Error:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
