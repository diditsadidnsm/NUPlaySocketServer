const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
    table: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        minlength: 6,
        maxlength: 25
    },
    sequence_value: {
        type: Number,
        min: 0
    }
});

counterSchema.statics = {
    async getNewIdMember (){
        let newIdMember = await this.findOneAndUpdate(
            {table: "tbl_members"},
            {$inc:{sequence_value: 1}},
            {new: true}

        );
        newIdMember = newIdMember.sequence_value.toString();
        let sb = "0000000000";
        newIdMember = "YNU"+sb.substring(0, sb.length - newIdMember.length)+newIdMember;
        return newIdMember;
    }
}
module.exports = mongoose.model('counters', counterSchema);
