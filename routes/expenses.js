//IMPORT EXPRESS 
const express = require('express');

//IMPORT CONTROLLERS 
const expenseController = require('../controllers/expenses');
const authController= require('../middleware/authetication');

//CREATE AN INSTANCE OF Router
const router = express.Router();
//CREATE A ROUTER FOR EXPENSES
router.post('/addexpense',authController.authorization,expenseController.addExpenses);
router.get('/getexpenses',authController.authorization,expenseController.getExpenses);
router.get('/getexpensebyid/:eID',authController.authorization,expenseController.getExpensesbyid);
router.delete('/delete/:dID',authController.authorization,expenseController.deletebyId);
router.put('/update/:uID',authController.authorization,expenseController.updateExpensebyid);


module.exports = router;