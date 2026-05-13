import { db, collection, getDocs, updateDoc, doc } from "./firebase-config.js";

const wordImages = {
    // Astronomy
    "black hole": "img/blackhole.png",
    "supernova": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Keplers_supernova.jpg",
    "quasar": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Quasar_with_jet_artist_concept.jpg",
    
    // Chemistry
    "catalyst": "img/cataliseur.png",
    "covalent bond": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Covalent_bond_hydrogen.svg/800px-Covalent_bond_hydrogen.svg.png",
    "polymer": "https://upload.wikimedia.org/wikipedia/commons/1/18/Polymer_Ket.png",
    "chemical equilibrium": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Chemical_equilibrium.svg/800px-Chemical_equilibrium.svg.png",
    "acid": "img/acide.jpg",
    "molecule": "img/molecule.png",
    "oxidation": "img/oxidation.jfif",
    "periodic table": "img/tableau-periodique.jpg",
    
    // Physics
    "entropy": "img/entropy.png",
    "quantum entanglement": "img/Capture d’écran 2026-05-11 154916.png",
    "superconductivity": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Meissner_effect.jpg",
    "mechanical waves": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Ondes_compression_2d_20_m.gif",
    "radioactivity": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Radioactive.svg/800px-Radioactive.svg.png",
    "nuclear fusion": "img/fusion-nucleaire.mp4",
    
    // Biology
    "crispr": "img/crispr.png",
    "biodiversity": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Biodiversity.jpg/800px-Biodiversity.jpg",
    "enzyme": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Enzyme_mechanism_1.jpg/800px-Enzyme_mechanism_1.jpg",
    "atp": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/ATP_structure.svg/800px-ATP_structure.svg.png",
    "genetics": "img/genome.jfif",
    "gene": "img/genome.jfif",
    "genome": "img/genome.jfif",
    "hormone": "img/hormone.png",
    
    // Fauna
    "blue whale": "img/Baleine-Bleue.png",
    "chameleon": "img/chameleon.png",
    "wolf": "img/wolf.png",
    
    // Flora & Plants
    "sequoia": "https://upload.wikimedia.org/wikipedia/commons/a/a6/General_Sherman_Tree_2013.jpg",
    "venus flytrap": "img/Dionée Attrape-mouche.jfif",
    "sunflower": "https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg",
    
    // Geology
    "tectonic plates": "img/tectonics.png",
    "stalactite": "https://upload.wikimedia.org/wikipedia/commons/5/52/Stalactites_in_Treak_Cliff_Cavern.jpg",
    
    // Mathematics
    "fibonacci sequence": "img/fibonacci.png",
    
    // Computer Science
    "artificial intelligence": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Neural_network.svg",
    
    // Engineering/Tech
    "actuator": "img/actuator.png",
    
    // Special Animations
    "photosynthesis": "img/photoSynthese.gif",
    
    // App Logo
    "logo": "img/logo.png"
};

export async function updateMissingImages() {
    console.log("Applying specific animated and static images to all dictionary words...");
    const snapshot = await getDocs(collection(db, "words"));
    let updatedCount = 0;

    for (const d of snapshot.docs) {
        const wordData = d.data();
        const enWord = (wordData.translations?.en?.word || "").toLowerCase().trim();
        
        let newImageUrl = wordImages[enWord];
        
        if (newImageUrl) {
            try {
                await updateDoc(doc(db, "words", d.id), { imageUrl: newImageUrl });
                console.log(`Updated specific image for word: ${enWord}`);
                updatedCount++;
            } catch (e) {
                console.error(`Error updating ${d.id}:`, e);
            }
        }
    }

    console.log(`--- Update Complete ---`);
    console.log(`Total specific images applied: ${updatedCount}`);
    console.log(`Now your dictionary uses the exact animated and static images!`);
}
