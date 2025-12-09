import mongoose from "mongoose"
export const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongobd connected successfully");
    } catch (error) {
        console.log("oops error connecting to mongodb");
        process.exit(1);
        
    }

}