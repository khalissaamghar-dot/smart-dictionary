// ─── Seed Data ──────────────────────────────────────────────
// Populates localStorage with admin user and basic setings
// Only runs once (checks if data already seeded)

const SEED_KEY = 'mock_seeded_v5'; // Bumped version to reflect empty dictionary

export function seedData() {
    if (localStorage.getItem(SEED_KEY)) return;

    // Seed admin user (credentials)
    const authUsers = { 'admin@demo.com': { uid: 'uid_admin', email: 'admin@demo.com', password: 'admin123' } };
    localStorage.setItem('mock_auth_users', JSON.stringify(authUsers));
    
    // Seed admin profile
    const profiles = {
        uid_admin: { uid: 'uid_admin', email: 'admin@demo.com', name: 'Admin', lastName: 'System', role: 'admin', status: 'approved', institution: 'Smart Dictionary', createdAt: '2025-01-01T00:00:00.000Z' }
    };
    localStorage.setItem('mock_users', JSON.stringify(profiles));

    // Clear previous words and start with an empty dictionary
    // Users will now add words via the "Add Term" interface
    const words = [];
    localStorage.setItem('mock_words', JSON.stringify(words));

    localStorage.setItem(SEED_KEY, '1');
    console.log('✅ Smart Dictionary: Initial system seeded. Dictionary is now empty and ready for dynamic entries.');
}
