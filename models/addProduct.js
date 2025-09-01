import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: {
    type: String,
    required: true,
    default: ["https://via.placeholder.com/300"],
  },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);


