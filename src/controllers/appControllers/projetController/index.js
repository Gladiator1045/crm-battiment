const mongoose = require('mongoose');

const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const read = require('./read');

const remove = require('./remove');
const paginatedList = require('./paginatedList');
const create = require('./create');
const schemaValidate = require('./schemaValidate');
function modelController() {
  const Model = mongoose.model('Projet');
  const methods = createCRUDController('Projet');

  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  methods.create = (req, res) => create(Model, req, res);

  return methods;
}

module.exports = modelController();
