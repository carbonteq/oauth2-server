import {Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn} from "typeorm";

const grantable = new Set([
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "BackchannelAuthenticationRequest"
]);

@Entity("PushedAuthorizationRequest")
class PushedAuthorizationRequest {
    @PrimaryColumn()
    id: string;

    // @Column({
    //     type: "string",
    //     nullable: true
    // })
    // grantId: string;

    // @Column({
    //     type: "string",
    //     nullable: true
    // })
    // userCode: string;

    // @Column({
    //     type: "string",
    //     nullable: true
    // })
    // uid: string;

    @Column({
        type: "json"
    })
    data;

    @Column({
        type: "date",
        nullable: true,
    })
    expiresAt;

    @Column({
        type: "date",
        nullable: true
    })
    consumedAt;

    // @CreateDateColumn({
    //     nullable: false
    // })
    // createdAt: Date;

    // @UpdateDateColumn({
    //     nullable: false
    // })
    // updatedAt: Date;

    // @DeleteDateColumn({
    //     nullable: true
    // })
    // deletedAt: Date;
}

export default PushedAuthorizationRequest;
