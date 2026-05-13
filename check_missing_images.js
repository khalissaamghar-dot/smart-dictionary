import { updateMissingImages } from './js/update_missing_images.js';

(async () => {
  try {
    await updateMissingImages();
    console.log('✅ Image update process completed.');
  } catch (err) {
    console.error('❌ Error during image update:', err);
    process.exit(1);
  }
})();
