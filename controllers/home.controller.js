const niv = require('node-input-validator');
const video = require('../models/video.model');
module.exports = (io, socket) => {

    const recommendedVideos = async (data, callback) => {
        let res = {};
        if (typeof data !== "object"){
            res.success = false;
            res.message = "failed - data is not an object";
            return callback(res);
        }
        let v = new niv.Validator(data, {
            page: 'required|integer|min:1'
        });
        let matched = await v.check();
        if (!matched){
            res.success = false;
            res.message = v.errors;
            return callback(res);
        }
        let page = parseInt(data.page);
        page = page - 1;
        let satu = page * 25;
        let dua = 25;
        let getData = await video.getRecommended(satu, dua);
        if (!getData){
            res.success = false;
            res.message = "failed - response server error. Err code: LRV00001";
            return callback(res);
        }
        res.data = getData;
        res.success = true;
        res.message = "success";
        return callback(res);
    }

    const trendingVideos = async (data, callback) => {
        let res = {};
        if (typeof data !== "object"){
            res.success = false;
            res.message = "failed - data is not an object";
            return callback(res);
        }
        let v = new niv.Validator(data, {
            page: 'required|integer|min:1'
        });
        let matched = await v.check();
        if (!matched){
            res.success = false;
            res.message = v.errors;
            return callback(res);
        }
        let page = parseInt(data.page);
        page = page - 1;
        let satu = page * 25;
        let dua = 25;
        let getData = await video.getData(satu, dua).catch(err =>{ return {success: false, errors: err}});
        if (!getData.success){
            res.success = false;
            res.message = "failed - response server error. Err code: LTV00001";
            return callback(res);
        }
        res.data = getData;
        res.success = true;
        res.message = "success";
        return callback(res);
    }

    socket.on("home:list_recommended", recommendedVideos);

    socket.on("home:list_trending", trendingVideos);
}