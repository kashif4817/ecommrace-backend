import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        required: true,
        unique: true
    }
});
export default mongoose.model("Role", roleSchema);
