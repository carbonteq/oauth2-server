import dotenv from "dotenv";
import server from "./server";
import oauth from "./oauth";

dotenv.config();

export default {
    server,
    oauth
};
