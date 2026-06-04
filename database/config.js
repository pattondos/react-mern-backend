const mongoose = require('mongoose');

const dbConnection = async() =>{
    try {

        await mongoose.connect(process.env.MONGO_DB_URL);

        console.log('Data Base connected. ')
    } catch (error) {
        console.log("ERROR ORIGINAL: "+error);
        throw error;
        
    }
}

module.exports = {
    dbConnection,
}