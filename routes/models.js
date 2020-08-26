const router = require('express').Router();
const handler = require('../handlers/model');
const isAuth = require('../utils/isAuth');
const validations = require('../utils/validator');

router.get('/create-offer', isAuth(), handler.get.createOffer);
router.get('/details-offer/:offerId', isAuth(), handler.get.detailsOffer);
router.get('/buy-offer/:offerId', isAuth(), handler.get.buyOffer);
router.get('/delete-offer/:offerId', isAuth(), handler.get.deleteOffer);
router.get('/edit-offer/:offerId', isAuth(), handler.get.editOffer);

router.post('/create-offer', isAuth(), handler.post.createOffer)
router.post('/edit-offer/:offerId', isAuth(), handler.post.editOffer)

module.exports = router;