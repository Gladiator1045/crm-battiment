const mongoose = require('mongoose');

const paginatedList = async (Model, req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    // Vérifier le rôle de l'utilisateur connecté
    if (req.admin && (req.admin.role === 'admin' || req.admin.role === 'superadmin')) {
      // Si c'est un administrateur ou un super administrateur, récupérer toutes les entrées sans filtre par utilisateur
      const resultsPromise = Model.find({ removed: false })
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' })
        .populate('createdBy', 'name')
        .populate('invoice', 'number')
        .exec();
      
      // Compter le nombre total de documents
      const countPromise = Model.countDocuments({ removed: false });

      // Résoudre les promesses en parallèle
      const [result, count] = await Promise.all([resultsPromise, countPromise]);

      // Calculer le nombre total de pages
      const pages = Math.ceil(count / limit);

      // Obtenir l'objet Pagination
      const pagination = { page, pages, count };

      // Renvoyer la réponse avec toutes les entrées
      if (count > 0) {
        return res.status(200).json({
          success: true,
          result,
          pagination,
          message: 'Successfully found all documents',
        });
      } else {
        return res.status(203).json({
          success: false,
          result: [],
          pagination,
          message: 'Collection is Empty',
        });
      }
    } else {
      // Si ce n'est pas un administrateur ou un super administrateur, procéder en filtrant par l'utilisateur connecté
      const userId = req.admin._id;

      const resultsPromise = Model.find({ createdBy: userId, removed: false })
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' })
        .populate('createdBy', 'name')
        .populate('invoice', 'number')
        .exec();

      const countPromise = Model.countDocuments({ createdBy: userId, removed: false });

      const [result, count] = await Promise.all([resultsPromise, countPromise]);

      const pages = Math.ceil(count / limit);
      const pagination = { page, pages, count };

      if (count > 0) {
        return res.status(200).json({
          success: true,
          result,
          pagination,
          message: 'Successfully found all documents',
        });
      } else {
        return res.status(203).json({
          success: false,
          result: [],
          pagination,
          message: 'Collection is Empty',
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = paginatedList;
