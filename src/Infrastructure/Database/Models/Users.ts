import {EntitySchema} from "typeorm";

const Users = new EntitySchema({
    name: "Users",
    columns: {
        userId: {
            type: Number,
            primary: true,
            generated: true
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
        }
    }
});

export default Users;
