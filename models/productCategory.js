import mongoose from 'mongoose'
const produtCategoriesSchema = new mongoose.Schema({
    hotItem: { type: Boolean, default: false },
    color: [{ type: String, default: "" }],
    size: [{ type: Number, default: null }],
    discountedItem: { type: Boolean, default: false }
}, { timestamps: true })


export default mongoose.model('Category', produtCategoriesSchema);