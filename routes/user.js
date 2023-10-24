// IMPORT EXPRESS 
const express = require('express');


//IMPORT CONTROLLERS 
const userController = require('../controllers/user');
const authController= require('../middleware/authetication');

//CREATE AN INSTANCE OF Router
const router = express.Router();

//CREATE A ROUTER FOR USERS
router.post('/signup',userController.signupAuthentication);
router.post('/signin',userController.signinAuthentication); 
router.get('/currentuser',authController.authorization,userController.getcurrentuser);
router.get('',userController.usergethomePage);

module.exports = router;

