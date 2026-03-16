const multer = require("multer");

// memoryStorage — file ah RAM la hold pannum (Cloudinary ku anuppa)
// Old: diskStorage — see archive/old-code-reference.js
const storage = multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
