const mongoose = require('mongoose');

// Middleware pour la gestion des factures accessibles uniquement par le personnel
exports.hasPermissionInvoice = async (userModel) => {
  return async function (req, res, next) {
    const User = mongoose.model(userModel);
    
    try {
      // Récupérer l'utilisateur connecté en utilisant son ID
      const currentUser = await User.findById(req.userId); // Supposons que l'ID de l'utilisateur soit stocké dans req.userId
      
      // Vérification si l'utilisateur est du personnel (staff)
      if (currentUser.role === 'staff') {
        // Récupérer les factures de l'utilisateur actuel
        const currentUserInvoices = await getInvoicesCreatedByUser(currentUser.id);
  
        // Envoyer les factures de l'utilisateur dans la réponse
        res.status(200).json({
          success: true,
          invoices: currentUserInvoices,
        });
      } else {
        // Si l'utilisateur n'est pas du personnel (staff), renvoyer un message d'erreur
        return res.status(403).json({
          success: false,
          result: null,
          message: 'Access denied: you are not granted permission to access this page.',
        });
      }
    } catch (error) {
      // En cas d'erreur, renvoyer une erreur serveur
      console.error(error);
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Internal server error.',
      });
    }
  };
};
