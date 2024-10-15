import app from "./src/app";
import { config } from "./src/config/config";
import connectDb from "./src/config/db";

const startServer = async()=>{

    await connectDb()

    const port = config.port || 8080;
    
    app.listen(port , ()=> console.log(`App Run With http://localhost:${port}`))
}

startServer()
