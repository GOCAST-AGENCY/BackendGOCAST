const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFSBucket } = require('mongodb');

let gfs;
let gridFSBucket;

// Initialiser GridFS
const initGridFS = () => {
  const conn = mongoose.connection;
  
  // GridFSBucket (méthode moderne)
  gridFSBucket = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  
  // GridFS Stream (pour compatibilité)
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  
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
const uploadFile = (file, filename, metadata = {}) => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: metadata
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
    uploadStream.end(file.buffer);
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
const streamFile = (fileId, res) => {
  const bucket = getGridFSBucket();
  const ObjectId = mongoose.Types.ObjectId;
  
  try {
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    downloadStream.on('error', (error) => {
      if (error.message.includes('FileNotFound')) {
        return res.status(404).json({ error: 'Fichier non trouvé' });
      }
      res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
    });
    
    // Définir les headers appropriés
    downloadStream.on('file', (file) => {
      res.set({
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Length': file.length,
        'Content-Disposition': `inline; filename="${file.filename}"`
      });
    });
    
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
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

