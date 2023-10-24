// IMPORT EXPRESS 
const express = require('express');


//IMPORT CONTROLLERS 
const purchaseController = require('../controllers/purachase');
const authController= require('../middleware/authetication');

//CREATE AN INSTANCE OF Router
const router = express.Router();

//CREATE A ROUTER FOR PURCHASINNG
router.get('/premiummembership',authController.authorization,purchaseController.premiummembership);
router.put('/updatetransactionstatus',authController.authorization,purchaseController.updatetransactionstatus); 

module.exports = router;

