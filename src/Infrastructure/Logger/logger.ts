import winston from "winston";

const logFormat = winston.format.printf(({level, message, label, timestamp}) => {
    return `${timestamp} ${label} ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: "debug",
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.label({label: "DEV"}),
                winston.format.colorize({all: true}),
                winston.format.simple(),
                logFormat
            )
        })
    ],
    exitOnError: false
});

export default logger;
