import mongoose from "mongoose";
const { Schema, model } = mongoose;

import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.index({name: 'text', role: 'text', email: 'text'});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}

export default mongoose.models.User || model("User", userSchema);