Promise = require('bluebird');
const mongoose = require('../config/mongoose');
const video = require('../models/video.model');
const axios = require('axios');
(async ()=>{
    await mongoose.connect();
    let getVideoDetails = await axios({
        method: 'GET',
        responseType: 'JSON',
        url: 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=0qU6M9flTp4&key=AIzaSyBkC8tex6VBrmaOBxc9LQAapOZT6hCDju8'
    }).catch(err => { status: 404});
    if (parseInt(getVideoDetails.status) === 200){
        let data = getVideoDetails.data;
        let items = data.items[0];
        console.log(items);
        try {
            let newVideo = new video({
                youtubeVideoId: items.id,
                snippet: items.snippet,
                status: 1,
            });
            let create = await newVideo.save();
            console.log(create)
            console.log("success");
        }catch (e) {
            console.log(e);
        }
    }
})()