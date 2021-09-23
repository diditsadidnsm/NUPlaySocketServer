const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        minlength: 6,
        maxlength: 25
    },
    deleted: {
        type: Number,
        enum: [0,1]
    }
},{
    timestamps: true,
});

categorySchema.statics = {
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
module.exports = mongoose.model('tbl_categories', categorySchema);
