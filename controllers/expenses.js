const Expenses = require('../models/expenses');
const sequelize = require('../util/database');

exports.addExpenses = async (request, response, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const user = request.user;
        const { category, pmethod, amount, date } = request.body;

        await user.createExpense({
            category: category,
            pmethod: pmethod,
            amount: amount,
            date: date
        }, { transaction });
        const totalExpenses = await Expenses.sum('amount', { where: { UserId: user.id }, transaction });
        await user.update({ totalexpenses: totalExpenses }, { transaction });
        await transaction.commit();
        response.status(200).json({ message: 'Data successfully added' });

    } catch (error) {
        console.log(error);
        if (transaction) {
            await transaction.rollback();
        }
        response.status(500).json({ message: 'An error occurred' });
    }
}

exports.getExpenses = async (request, response, nex) => {
    try {
        const page = request.query.page;
        const user = request.user;
        const limit = Number(request.query.noitem);
        const offset = (page - 1) * 5;
        const expenses = await user.getExpenses({
            offset: offset,
            limit: limit
        });
        response.status(200).json({
            expenses: expenses,
            totalexpenses: user.totalexpenses,
            hasMoreExpenses : expenses.length === limit,
            hasPreviousExpenses : page > 1
        });

    } catch (error) {
        console.log(error);
        return response.status(401).json({ message: 'Unauthorized relogin required' });
    }
}
exports.deletebyId = async (request, response, next) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const dID = request.params.dID;
        const user = request.user;
        const result = await Expenses.destroy({ where: { id: dID, userId: request.user.id }, transaction });
        const totalExpenses = await Expenses.sum('amount', { where: { UserId: user.id }, transaction });
        if (totalExpenses) await user.update({ totalexpenses: totalExpenses }, { transaction });
        else await user.update({ totalexpenses: 0 });
        if (result == 0) {
            return response.status(401).json({ message: 'You are not Authorized' });
        } else {
            response.status(200).json({ message: 'Succeffully deleted' });
        }
        await transaction.commit();
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.log(error);
    }
}
exports.getExpensesbyid = async (request, response, nex) => {
    try {
        const user = request.user;
        const eID = request.params.eID;
        const expense = await user.getExpenses({ where: { id: eID } });
        response.status(200).json(expense);

    } catch (error) {
        console.log(error);
        return response.status(401).json({ message: 'Unauthorized relogin required' });
    }
}
exports.updateExpensebyid = async (request, response, next) => {
    let transaction = await sequelize.transaction();
    try {
        const uID = request.params.uID;
        const user = request.user;
        const { category, pmethod, amount, date } = request.body;
        const up = await Expenses.update({
            category: category,
            pmethod: pmethod,
            amount: amount,
            date: date
        }, { where: { id: uID } }, { transaction });
        const totalExpenses = await Expenses.sum('amount', { where: { UserId: user.id } }, { transaction });
        if (totalExpenses) await user.update({ totalexpenses: totalExpenses }, { transaction });
        else await user.update({ totalexpenses: 0 });
        response.status(200).json({ message: 'Data succesfully updated' });
        transaction.commit();

    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.log(error);
    }
}
