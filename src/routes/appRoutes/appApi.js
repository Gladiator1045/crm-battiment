const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const { hasPermission } = require('@/middlewares/permission');
const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');

const routerApp = (entity, controller) => {
  router
    .route(`/${entity}/create`)
    .post(hasPermission('create'), catchErrors(controller['create']));
  router
    .route(`/${entity}/read/:id`)
    .get(catchErrors(controller['read'])); // Correction ici
  router
    .route(`/${entity}/update/:id`)
    .patch(hasPermission('update'), catchErrors(controller['update']));
  router
    .route(`/${entity}/delete/:id`)
    .delete(hasPermission('delete'), catchErrors(controller['delete']));
  router
    .route(`/${entity}/search`)
    .get(catchErrors(controller['search'])); // Correction ici
  router
    .route(`/${entity}/list`)
    .get(catchErrors(controller['list'])); // Correction ici
  router
    .route(`/${entity}/filter`)
    .get(catchErrors(controller['filter'])); // Correction ici
  router
    .route(`/${entity}/summary`)
    .get(catchErrors(controller['summary'])); // Correction ici

  if (entity === 'invoice' || entity === 'quote' || entity === 'offer' || entity === 'payment') {
    router
      .route(`/${entity}/mail`)
      .post(hasPermission('update'), catchErrors(controller['mail']));
  }

  if (entity === 'quote') {
    router
      .route(`/${entity}/convert/:id`)
      .get(hasPermission('update'), catchErrors(controller['convert']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
