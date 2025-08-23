import mongoose from 'mongoose'

const userProductSchema  = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
    },
{ timestamps: true },
)

export default mongoose.model("UserProduct", userProductSchema);