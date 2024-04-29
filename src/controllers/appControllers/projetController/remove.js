const mongoose = require('mongoose');

const invoice = mongoose.model('Invoice');


const remove = async (Model, req, res) => {
  // cannot delete client it it have one invoice or Client:
  // check if client have invoice or quotes:
  const { id } = req.params;
  console.log('🚀 ~ projetController: remove.js:10 ~ remove ~ id:', id);

  // first find if there alt least one quote or invoice exist corresponding to the client
  
 

  // if no People or quote, delete the client
  const result = await Model.findOneAndUpdate(
    { _id: id, removed: false },
    {
      $set: {
        removed: true,
      },
    }
  ).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No projet found by this id: ' + id,
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Deleted the projet by id: ' + id,
  });
};
module.exports = remove;
