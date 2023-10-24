const User = require('../models/users');


exports.createUser = async (name,email,password) => {
    try {
        const user = await User.create({
            name,
            email,
            password,
        });
        return user;
        
    } catch (error) {
        console.log(error);
        throw error
    }
}
exports.getUserbyemail = async (email) => {
try {
    let user = await User.findOne({where:{email}});
    return user;
    
} catch (error) {
    console.log(error);
    throw error
}
}