const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// File buffer ah Cloudinary ku upload pannum, URL return pannum
const uploadToCloudinary = (fileBuffer, folder = "node_codeio") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
