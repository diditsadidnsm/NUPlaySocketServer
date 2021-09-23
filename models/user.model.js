const mongoose = require('mongoose');
const ecdc = require('../config/ecdc');
/**
 * User Roles
 */
const roles = ['basic', 'premium'];

const tbl_memberSchema = new mongoose.Schema({
    idMember:{
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        minlength: 6,
        maxlength: 25
    },
    username:{
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        minlength: 6,
        maxlength: 25
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    lastName: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    socialMedia: {
        facebook: String,
        google: String,
    },
    role: {
        type: String,
        enum: roles,
        default: 'basic',
    },
    status: {
        type: Number,
        enum: [0,1],
        default: 0
    },
    banned: {
        type: Number,
        enum: [0,1],
        default: 0
    },
    profilePicture: {
        type: String,
        trim: true,
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
});

tbl_memberSchema.pre('save', async function save(next) {
    try {
        if (this.isModified('password')) return next();

        const hash = await ecdc.passEnc(this.password);
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

tbl_memberSchema.statics = {
    roles,
    async getById(id) {
        let user;
        if (mongoose.Types.ObjectId.isValid(id)) {
            user = await this.findById(id).exec();
        }
        if (user) {
            return user;
        }
        throw null;
    },
    async getByUsername(username) {
        let user = await this.findOne({username: username});
        if (user) {
            return user;
        }
        return user;
    },
    async findOneUsername(username){
        let getUsername = await this.findOne({username: username});
        if (getUsername) {
            return getUsername;
        }
        return  null;
    }
}

module.exports = mongoose.model('tbl_members', tbl_memberSchema);
