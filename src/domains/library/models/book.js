import mongoose from "mongoose";
const { Schema, model } = mongoose;
import User from '../../user/models/user'

const bookSchema = new Schema({
    imageURL: String,
    title: {type: String, unique: true},
    yearOfPublication: Number,
    author: String,
    category: String,
    lent: {type: Schema.Types.ObjectId, ref: User, default: null}
},{
    timestamps: true,
    versionKey: false
});

bookSchema.index({title: 'text', author: 'text', category: 'text'});

export default mongoose.models.Book ||  model('Book', bookSchema);