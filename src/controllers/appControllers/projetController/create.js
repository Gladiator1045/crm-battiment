const mongoose = require('mongoose');

const Model = mongoose.model('Projet');

const { calculate } = require('@/helpers');
const { loadSettings, increaseBySettingKey } = require('@/middlewares/settings');

const schema = require('./schemaValidate');

const { generateUniqueNumber } = require('@/middlewares/inventory');

const create = async (Model, req, res) => {
  try {
    let body = req.body;

    body['createdBy'] = req.admin._id;

    const settings = await loadSettings();
    const last_projet_number = settings['last_projet_number'];

    body.number = generateUniqueNumber(last_projet_number);

    // Check if the invoice is already used in another project
    const existingProject = await Model.findOne({ invoice: body.invoice });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Invoice is already used for another project',
      });
    }

    // Creating a new document in the collection
    const result = await new Model(body).save();

    // Returning successful response
    increaseBySettingKey({ settingKey: 'last_projet_number' });
    return res.status(200).json({
      success: true,
      result,
      message: 'Projet created successfully',
    });
  } catch (error) {
    console.error('Error while creating project:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = create;
