const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gridFSBucket;

// Initialiser GridFS
const initGridFS = () => {
  const conn = mongoose.connection;
  
  // GridFSBucket (méthode moderne)
  gridFSBucket = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  
  console.log('✅ GridFS initialisé');
};

// Obtenir GridFSBucket
const getGridFSBucket = () => {
  if (!gridFSBucket) {
    const conn = mongoose.connection;
    gridFSBucket = new GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
  }
  return gridFSBucket;
};

// Uploader un fichier dans GridFS
// file doit être un Buffer Node.js
const uploadFile = (fileBuffer, filename, metadata = {}) => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    
    // S'assurer que c'est un Buffer
    const buffer = fileBuffer instanceof Buffer 
      ? fileBuffer 
      : Buffer.from(fileBuffer);
    
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        ...metadata,
        contentType: metadata.contentType || 'application/octet-stream'
      }
    });

    uploadStream.on('error', (error) => {
      reject(error);
    });

    uploadStream.on('finish', () => {
      resolve({
        fileId: uploadStream.id.toString(),
        filename: filename
      });
    });

    // Écrire le buffer du fichier
    uploadStream.end(buffer);
  });
};

// Télécharger un fichier depuis GridFS
const downloadFile = (fileId) => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    const ObjectId = mongoose.Types.ObjectId;
    
    try {
      const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
      const chunks = [];
      
      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      downloadStream.on('error', (error) => {
        reject(error);
      });
      
      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Obtenir les informations d'un fichier
const getFileInfo = async (fileId) => {
  const bucket = getGridFSBucket();
  const ObjectId = mongoose.Types.ObjectId;
  
  try {
    const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();
    return files[0] || null;
  } catch (error) {
    return null;
  }
};

// Supprimer un fichier de GridFS
const deleteFile = async (fileId) => {
  const bucket = getGridFSBucket();
  const ObjectId = mongoose.Types.ObjectId;
  
  try {
    await bucket.delete(new ObjectId(fileId));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return false;
  }
};

// Stream un fichier (pour servir directement)
const streamFile = async (fileId, res) => {
  const bucket = getGridFSBucket();
  const ObjectId = mongoose.Types.ObjectId;
  
  try {
    // Vérifier que le fichier existe
    const fileInfo = await getFileInfo(fileId);
    if (!fileInfo) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    // Définir les headers
    res.set({
      'Content-Type': fileInfo.contentType || 'application/octet-stream',
      'Content-Length': fileInfo.length,
      'Content-Disposition': `inline; filename="${fileInfo.filename}"`,
      'Cache-Control': 'public, max-age=31536000' // Cache 1 an
    });
    
    // Stream le fichier
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    downloadStream.on('error', (error) => {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
      }
    });
    
    downloadStream.pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
    }
  }
};

module.exports = {
  initGridFS,
  uploadFile,
  downloadFile,
  getFileInfo,
  deleteFile,
  streamFile,
  getGridFSBucket
};

