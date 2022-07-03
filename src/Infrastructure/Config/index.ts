import dotenv from "dotenv";
import path from "path";

import server from "./server";
import oauth from "./oauth";
import database from "./database"

dotenv.config();

const storagePath = path.resolve(__dirname, "../../../storage/");

export default {
    storagePath,
    server,
    oauth,
    database
};
