Promise = require('bluebird');
const ecdc = require('../config/ecdc');
const mongoose = require('../config/mongoose');
const counters = require('../models/counters.model');
const user = require('../models/user.model');
(async ()=>{
    await mongoose.connect();
    let username = "master";
    let email = "master@default.com";
    let password = "123456";
    try {
        let newIdMember = await counters.getNewIdMember().catch(err => {return {success: false, err: err}});
        if (!newIdMember){
            throw newIdMember;
        }
        let key = await ecdc.toMD5(username.concat("_", newIdMember,"_")).catch(err => {return {success: false, err: err}});
        if (!key.success){
            throw key;
        }
        let passHash = await ecdc.passEnc(key.data, password).catch(err => {return {success: false, err: err}});
        if (!passHash.success){
            throw passHash;
        }
        let master = new user({
            idMember: newIdMember,
            username: username,
            email: email,
            password: passHash.data,
            role: "premium",
            status: 1,
        });
        let create = await master.save();
        console.log(create)
        console.log("success");
    }catch (e) {
        console.log(e);
    }
})()