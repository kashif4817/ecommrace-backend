import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        mobile: {
            type: String,
            required: true,
            // match: /^03\d{9}$/, // Matches Pakistani numbers like 03xxxxxxxxx
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email pattern
        },
        password: { type: String, required: true, minlength: 6 },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true
        }
    },
    { timestamps: true }

);


// ✅ Reuse model if it already exists (avoids overwrite errors)
export default mongoose.models.User || mongoose.model("User", userSchema);