const cloudinary = require('cloudinary').v2;

// Configuration Cloudinary depuis les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Uploader un fichier vers Cloudinary
const uploadFile = async (fileBuffer, folder, filename, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder || 'gocast',
      public_id: filename.replace(/\.[^/.]+$/, ''), // Enlever l'extension
      resource_type: 'auto', // Détecte automatiquement image/video/raw
      ...options
    };

    // Convertir le buffer en stream pour Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            resource_type: result.resource_type
          });
        }
      }
    );

    // Écrire le buffer dans le stream
    uploadStream.end(fileBuffer);
  });
};

// Supprimer un fichier de Cloudinary
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Erreur suppression Cloudinary:', error);
    return false;
  }
};

// Obtenir l'URL d'une image avec transformations
const getImageUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations
  });
};

module.exports = {
  uploadFile,
  deleteFile,
  getImageUrl,
  cloudinary
};

