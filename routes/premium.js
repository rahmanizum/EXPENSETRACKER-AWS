//IMPORT EXPRESS 
const express = require('express');

//IMPORT CONTROLLERS 
const premiumController = require('../controllers/premium');
const authController= require('../middleware/authetication');

//CREATE AN INSTANCE OF Router
const router = express.Router();

//CREATE A ROUTER FOR PREMIUM USERS
router.get('/leaderborddata',authController.authorization,premiumController.getLeaderboardExpenses);
router.get('/download',authController.authorization,premiumController.getDownloadURL);
router.get('/downloadhistory',authController.authorization,premiumController.getDownloadhistory);

module.exports = router;