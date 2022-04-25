import mongoose from "mongoose";
import config from "./config";

console.log(`database: ${config.MONGODB_URI}`)

if (mongoose.models.User) {
  delete mongoose.models.User
}

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_db) => console.log(`DB is connected`))
  .catch((err) => console.log(err));
