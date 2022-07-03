import {Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn} from "typeorm";

const grantable = new Set([
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "BackchannelAuthenticationRequest"
]);
