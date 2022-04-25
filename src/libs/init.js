import Role from '../domains/user/models/role';
import User from "../domains/user/models/user";

import bcrypt from "bcryptjs";

export const createDefaultRoles = async () => {
    try {
     
        const count = await Role.estimatedDocumentCount();

        if (count > 0) return;

        const values = await Promise.all([
            new Role({ name: "user" }).save(),
            new Role({ name: "admin" }).save(),
        ]);

        console.log(`roles created succesfuly /n ${values}`);
    } catch (error) {
        console.error(error);
    }
};

export const createDefaultAdmin = async () => {
    
    // check for an existing admin user
    const user = await User.findOne({ email: "admin@gmail.com" });
    console.log("user already exists")

    if (!user) {        
        const role = await Role.findOne({ name: "admin"});
        console.log(role)

        await User.create({
            name: "admin",
            email: "admin@gmail.com",
            password: await bcrypt.hash("admin#1234", 10),
            role: role._id,
        });

        console.log('Admin User Created!')
    }
};