import mongoose from 'mongoose'
import { config } from "./config";

const connectDb = async () => {
    try {
        mongoose.connection.on('connected', ()=>{
            console.log('Connected Successfully!')
        })
        mongoose.connection.on('error', (err)=>{
            console.log('Error in Connecting to Database!', err)
        })
        await mongoose.connect(config.databaseUrl as string)
    } catch (error) {
        console.log('Failed to Connect Database!', error)
        process.exit(1)
    }
}

export default connectDb