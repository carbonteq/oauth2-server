import {EntitySchema} from "typeorm";

const grantable = new Set([
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "BackchannelAuthenticationRequest"
]);

const Models = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "ClientCredentials",
    "Client",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest",
    "Grant",
    "BackchannelAuthenticationRequest"
].map(model => {
    return new EntitySchema({
        name: model,
        columns: {
            id: {type: String, primary: true},
            ...(grantable.has(model) ? {grantId: {type: String}} : undefined),
            ...(model === "DeviceCode" ? {userCode: {type: String}} : undefined),
            ...(model === "Session" ? {uid: {type: String}} : undefined),
            data: {type: "json", nullable: true},
            expiresAt: {type: Date, nullable: true},
            consumedAt: {type: Date, nullable: true}
        }
    });
});

export default Models;
