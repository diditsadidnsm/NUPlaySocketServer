let param = {
    mode: "serverside",
    app : "youtube_nu",
    version: 1
}
let param2 = {
    mode: "clientside",
    app : "youtube_nu",
    username : "master",
    password : "zevitsoft2021",
    version: 1
}
const ecdc = require('../config/ecdc');
(async function (){
    let ec = await ecdc.enc(param2).catch(console.log);
    if (ec.success){
        console.log(ec.data)
    }
})();