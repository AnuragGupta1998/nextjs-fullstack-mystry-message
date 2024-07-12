import mongoose from "mongoose";


//object return from mongoDB after connection is isConnected
type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

//DB connection..
//db connection return type is  Promise
async function dbConnect(): Promise<void> {

    //if there is already DB connection estabilized..
    if (connection.isConnected) {
        console.log("Already connected to the Database")
        return;
    }

    //new DB Connection...
    try {
       const db = await mongoose.connect(process.env.MONGODB_URI || "",{dbName:"mystrymessage"}) ;

       //assignment
       console.log("DB",db)
       console.log("DB",db.connections)

       connection.isConnected = db.connections[0].readyState;


       console.log("Database connected successfully")

    } catch (error) {
        console.log("Database connection failed", error)
        process.exit();

    }

}

export default dbConnect