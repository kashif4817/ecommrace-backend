import mongoose from "mongoose";
import seedRoles from "../utils/seedRoles.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅Mongo Db has been connected!!!!!!!!!!")
       await seedRoles();
    } catch (error) {
        console.error('❌DB Connection Failed:', error)
        process.exit(1)
    }
}

export default connectDB;   