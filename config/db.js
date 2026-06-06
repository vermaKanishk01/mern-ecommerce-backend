const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI + "my-ecommerce");
        console.log("Database connect successfully");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDb;