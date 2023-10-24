// IMPORT EXPRESS 
const express = require('express');

//IMPORT CONTROLLERS 
const passwordController = require('../controllers/password');
//CREATE AN INSTANCE OF Router
const router = express.Router();

//CREATE A ROUTER FOR PASSWORD RESET
router.get('/reset/:id', passwordController.resetpasswordform);
router.post('/reset',passwordController.resetpassword);
router.post('/forgotpassword',passwordController.requestresetpassword);

module.exports = router;
