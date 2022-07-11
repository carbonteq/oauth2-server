import {EntitySchema} from "typeorm";

const Users = new EntitySchema({
    name: "Users",
    columns: {
        userId: {
            type: String,
            primary: true
        },
        firstName: {
            type: String,
            nullable: false
        },
        lastName: {
            type: String,
            nullable: false
        },
        email: {
            type: String,
            nullable: false
        },
        emailVerified: {
            type: Boolean,
            nullable: false,
            default: false
        },
        createdAt: {
            type: Date,
            nullable: false,
            createDate: true
        },
        updatedAt: {
            type: Date,
            nullable: false,
            updateDate: true
        },
        deletedAt: {
            type: Date,
            nullable: true,
            deleteDate: true
        }
    }
});

export default Users;
