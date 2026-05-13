const https = require('https');

const PROJECT_ID = 'smart-dictionnary';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/words`;

function fetchWords() {
    return new Promise((resolve, reject) => {
        https.get(BASE_URL, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const parsed = JSON.parse(data);
                    resolve(parsed.documents || []);
                } else {
                    reject(new Error(`Failed to fetch: ${res.statusCode} ${data}`));
                }
            });
        }).on('error', reject);
    });
}

function deleteWord(name) {
    return new Promise((resolve, reject) => {
        const req = https.request(`https://firestore.googleapis.com/v1/${name}`, { method: 'DELETE' }, (res) => {
            res.on('data', () => {});
            res.on('end', resolve);
        });
        req.on('error', reject);
        req.end();
    });
}

async function run() {
    console.log('Fetching words...');
    const docs = await fetchWords();
    console.log(`Found ${docs.length} words.`);
    
    const seen = new Set();
    let deletedCount = 0;
    
    for (const doc of docs) {
        try {
            // The structure is document.fields.translations.mapValue.fields.en.mapValue.fields.word.stringValue
            const enWordValue = doc.fields?.translations?.mapValue?.fields?.en?.mapValue?.fields?.word?.stringValue;
            if (!enWordValue) continue;
            
            const lowerWord = enWordValue.toLowerCase();
            if (seen.has(lowerWord)) {
                console.log(`Deleting duplicate: ${enWordValue} (${doc.name})`);
                await deleteWord(doc.name);
                deletedCount++;
            } else {
                seen.add(lowerWord);
            }
        } catch(e) {
            console.log(`Could not parse term: ${doc.name}`);
        }
    }
    
    console.log(`Done. Deleted ${deletedCount} duplicates.`);
}

run().catch(console.error);
