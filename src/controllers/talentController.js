const Talent = require('../models/Talent');
const Photo = require('../models/Photo');
const { calculerTrancheAge } = require('../database/db');
const gridfsService = require('../services/gridfsService');
const path = require('path');
const fs = require('fs-extra');

// Obtenir tous les talents avec filtres
const getAllTalents = async (req, res) => {
  try {
    const { 
      specialite, 
      genre, 
      tranche_age, 
      type_acting, 
      statut, 
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Construire le filtre
    const filter = {};

    if (specialite) filter.specialite = specialite;
    if (genre) filter.genre = genre;
    if (tranche_age) filter.tranche_age = tranche_age;
    if (type_acting) filter.type_acting = type_acting;
    if (statut) filter.statut = statut;

    // Recherche textuelle
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Tri
    const allowedSortBy = ['nom', 'prenom', 'date_naissance', 'createdAt', 'specialite'];
    const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortColumn]: sortOrder };

    const talents = await Talent.find(filter).sort(sort);

    // Récupérer les photos pour chaque talent
    const talentsWithPhotos = await Promise.all(
      talents.map(async (talent) => {
        const photos = await Photo.find({ talent_id: talent._id });
        const talentObj = talent.toObject();
        return {
          ...talentObj,
          id: talentObj._id.toString(),
          _id: talentObj._id.toString(),
          photos: photos.map(photo => ({
            ...photo.toObject(),
            id: photo._id.toString(),
            gridfs_id: photo.gridfs_id || null
          }))
        };
      })
    );

    res.json(Array.isArray(talentsWithPhotos) ? talentsWithPhotos : []);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des talents' });
  }
};

// Obtenir un talent par ID
const getTalentById = async (req, res) => {
  try {
    const { id } = req.params;

    const talent = await Talent.findById(id);

    if (!talent) {
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    // Récupérer les photos
    const photos = await Photo.find({ talent_id: talent._id });
    const talentObj = talent.toObject();

    res.json({
      ...talentObj,
      id: talentObj._id.toString(),
      _id: talentObj._id.toString(),
      photos: photos.map(photo => ({
        ...photo.toObject(),
        id: photo._id.toString(),
        gridfs_id: photo.gridfs_id || null
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un talent
const createTalent = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      date_naissance,
      genre,
      specialite,
      type_acting,
      cv_texte,
      statut,
      note_interne,
      commentaire
    } = req.body;

    if (!nom || !prenom || !date_naissance || !specialite) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const tranche_age = calculerTrancheAge(date_naissance);

    const talent = await Talent.create({
      nom,
      prenom,
      email: email || null,
      telephone: telephone || null,
      date_naissance,
      genre: genre || null,
      specialite,
      type_acting: type_acting || null,
      tranche_age,
      cv_texte: cv_texte || null,
      statut: statut || 'Actif',
      note_interne: note_interne || null,
      commentaire: commentaire || null
    });

    res.status(201).json({
      message: 'Talent créé avec succès',
      id: talent._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du talent' });
  }
};

// Mettre à jour un talent
const updateTalent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Calculer la tranche d'âge si la date de naissance change
    if (updateData.date_naissance) {
      updateData.tranche_age = calculerTrancheAge(updateData.date_naissance);
    }

    // Supprimer les champs undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const talent = await Talent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!talent) {
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    res.json({ message: 'Talent mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

// Supprimer un talent
const deleteTalent = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le talent avant de le supprimer
    const talent = await Talent.findById(id);
    
    if (!talent) {
      return res.status(404).json({ error: 'Talent non trouvé' });
    }

    // Récupérer les chemins des fichiers associés
    const photos = await Photo.find({ talent_id: id });

    // Supprimer les fichiers de GridFS
    for (const photo of photos) {
      if (photo.gridfs_id) {
        await gridfsService.deleteFile(photo.gridfs_id);
      }
    }

    // Supprimer les photos de la base de données
    await Photo.deleteMany({ talent_id: id });
    
    // Supprimer le CV et la vidéo de GridFS si ils existent
    if (talent.cv_pdf_gridfs_id) {
      await gridfsService.deleteFile(talent.cv_pdf_gridfs_id);
    }
    if (talent.video_presentation_gridfs_id) {
      await gridfsService.deleteFile(talent.video_presentation_gridfs_id);
    }

    // Supprimer le talent
    await Talent.findByIdAndDelete(id);

    res.json({ message: 'Talent supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllTalents,
  getTalentById,
  createTalent,
  updateTalent,
  deleteTalent
};
