const filterCurrentUser = async (Model, req, res) => {
    try {
      // Récupérer l'ID de l'utilisateur connecté à partir de la requête
      const userId = req.user._id;
  
      // Filtre pour trouver uniquement les documents associés à l'utilisateur connecté
      const result = await Model.find({ createdBy: userId, removed: false }).exec();
  
      if (result.length > 0) {
        return res.status(200).json({
          success: true,
          result,
          message: 'Successfully found documents created by the current user',
        });
      } else {
        return res.status(203).json({
          success: false,
          result: [],
          message: 'No documents found for the current user',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };
  
  module.exports = filterCurrentUser;
  