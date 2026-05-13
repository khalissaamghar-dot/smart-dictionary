import { db, collection, getDocs } from "./firebase-config.js";

// List of placeholder identifiers to treat as missing images
const PLACEHOLDERS = [
  null,
  undefined,
  "",
  /picsum\.photos/i,
  "PHOTOSYNTHESIS_ANIMATION",
];

function isPlaceholder(url) {
  if (!url) return true;
  if (typeof url === "string") {
    for (const ph of PLACEHOLDERS) {
      if (ph instanceof RegExp) {
        if (ph.test(url)) return true;
      } else if (url === ph) {
        return true;
      }
    }
  }
  return false;
}

export async function listMissingImages() {
  console.log("Scanning dictionary for missing or placeholder images...");
  const snapshot = await getDocs(collection(db, "words"));
  const missing = [];
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const imageUrl = data.imageUrl;
    if (isPlaceholder(imageUrl)) {
      missing.push({ id: docSnap.id, word: data.translations?.en?.word || "(no EN)" });
    }
  }
  if (missing.length === 0) {
    console.log("✅ All dictionary entries have proper image URLs.");
  } else {
    console.log(`⚠️ Found ${missing.length} entries without proper images:`);
    missing.forEach(entry => console.log(`- ${entry.id}: ${entry.word}`));
  }
}

// Run when executed directly
if (import.meta.url === process.argv[1]) {
  listMissingImages().catch(err => console.error("Error:", err));
}
