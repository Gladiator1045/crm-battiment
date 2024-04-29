const fs = require('fs');
const custom = require('@/controllers/pdfController');
const { SendQuote } = require('@/emailTemplate/SendEmailTemplate');
const mongoose = require('mongoose');
const QuoteModel = mongoose.model('Quote');
const { Resend } = require('resend');
const { loadSettings } = require('@/middlewares/settings');

const mail = async (req, res) => {
  const { id, action } = req.body;

  // Throw error if no id
  if (!id) {
    throw { name: 'ValidationError', message: 'ID is required' };
  }

  // Throw error if no action
  if (!action) {
    throw { name: 'ValidationError', message: 'Action is required' };
  }

  const result = await QuoteModel.findOne({ _id: id, removed: false }).exec();

  // Throw error if no result
  if (!result) {
    throw { name: 'NotFoundError', message: 'Quote not found' };
  }

  // Continue process if result is returned
  const { client } = result;
  const { name } = client;
  const email = client[client.type].email;

  const modelName = 'Quote';

  const fileId = modelName.toLowerCase() + '-' + result._id + '.pdf';
  const folderPath = modelName.toLowerCase();
  const targetLocation = `src/public/download/${folderPath}/${fileId}`;

  await custom.generatePdf(
    modelName,
    { filename: folderPath, format: 'A4', targetLocation },
    result,
    async () => {
      let mailSubject = '';
      let mailMessage = '';

      if (action === 'accept') {
        mailSubject = 'Quote Accepted';
        mailMessage = `Your quote ${id} has been accepted.`;
      } else if (action === 'reject') {
        mailSubject = 'Quote Rejected';
        mailMessage = `Your quote ${id} has been rejected.`;
      }

      const { id: mailId } = await sendViaApi(email, name, targetLocation, mailSubject, mailMessage);

      if (mailId) {
        QuoteModel.findByIdAndUpdate({ _id: id, removed: false }, { status: action })
          .exec()
          .then(() => {
            return res.status(200).json({
              success: true,
              result: mailId,
              message: `Successfully sent ${action === 'accept' ? 'acceptance' : 'rejection'} email for quote ${id} to ${email}`,
            });
          });
      }
    }
  );
};

const sendViaApi = async (email, name, filePath, subject, message) => {
  const settings = await loadSettings();
  const appEmail = settings['app-erp-crm_email'];
  const resend = new Resend(process.env.RESEND_API);

  const attachedFile = fs.readFileSync(filePath);

  const { data } = await resend.emails.send({
    from: appEmail,
    to: email,
    subject: subject,
    attachments: [
      {
        filename: 'Quote.pdf',
        content: attachedFile,
      },
    ],
    html: SendQuote({ name, message }),
  });

  return data;
};

module.exports = mail;
