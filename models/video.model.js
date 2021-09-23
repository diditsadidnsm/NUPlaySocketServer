const mongoose = require('mongoose');

const tbl_videoSchema = new mongoose.Schema({
    youtubeVideoId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        minlength: 6,
        maxlength: 25
    },
    snippet:{
        type: mongoose.Mixed,
    },
    status:{
        type: Number,
        enum: [0,1],
        default: 0
    }
}, {
    timestamps: true,
});

tbl_videoSchema.statics = {
    async getById(id) {
        let video;
        if (mongoose.Types.ObjectId.isValid(id)) {
            video = await this.findById(id).exec();
        }
        if (video) {
            return video;
        }
        throw null;
    },
    async getByChannelId(username) {
        let user = await this.findOne({username: username});
        if (user) {
            return user;
        }
        return user;
    },
    async getRecommended(start, limit){
        let video = await this.find({}).skip(start).limit(limit).sort({_id: -1});
        if (video) {
            return video;
        }
        return  null;
    }
}

module.exports = mongoose.model('tbl_videos', tbl_videoSchema);