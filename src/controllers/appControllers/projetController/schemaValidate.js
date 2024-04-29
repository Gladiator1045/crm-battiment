const Joi = require('joi');

const schema = Joi.object({
    // Définissez la structure de votre schéma de validation ici
    // Par exemple :
    name: Joi.string().required(),
    invoice: Joi.alternatives().try(Joi.number(), Joi.object()).required(),
  
    status: Joi.string().valid('draft', 'progress', 'terminated', 'retard').required(),
    ville: Joi.string().valid('nantue', 'paris').required(),
    description: Joi.string(),
    ref: Joi.string(),

    // Ajoutez d'autres champs si nécessaire
  });
  module.exports = schema;
