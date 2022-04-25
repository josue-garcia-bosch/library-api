import mongoose from "mongoose";
const { Schema, model } = mongoose;

const lentHistorySchema = new Schema({
    initiator: {type: Schema.Types.ObjectId, ref: 'User', default: null},
    book: {type: Schema.Types.ObjectId, ref: 'Book', default: null},
    assignee: {type: Schema.Types.ObjectId, ref: 'User', default: null},
},{
    timestamps: true,
    versionKey: false
});


//export default mongoose.models.LentHistory || model('LentHistory', lentHistorySchema);

