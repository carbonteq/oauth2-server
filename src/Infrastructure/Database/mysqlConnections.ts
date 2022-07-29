import {DataSource, DataSourceOptions} from "typeorm";

import Config from "../Config";

const {database} = Config;

const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: database.HOST,
    port: +database.PORT,
    username: database.USERNAME,
    password: database.PASSWORD,
    database: database.DB,
    entities: [__dirname + "/Models/*{.ts, .js}"],
    migrations: [__dirname + "/Migration/*{.ts, .js}"],
    synchronize: database.SYNCHRONIZE === "true",
    logging: database.LOGGING === "true"
};

export const dataSource = new DataSource(dataSourceOptions);
