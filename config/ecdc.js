const CryptoJS = require("crypto-js");
const { ecdcKey } = require('./vars');

exports.toMD5 = (decObject) =>{
    return new Promise((resolve, reject) => {
        try {
            let dec = CryptoJS.MD5(decObject).toString();
            resolve({success: true, data: dec});
        }catch (e) {
            reject(e);
        }
    });
}

exports.dec = (decObject) =>{
    return new Promise((resolve, reject) => {
        let ret = {};
        try{
            let data = CryptoJS.AES.decrypt(decObject, ecdcKey);
            let jsondata = JSON.parse(data.toString(CryptoJS.enc.Utf8));
            let param = jsondata.ApiKey;
            let asli = CryptoJS.AES.decrypt(param, ecdcKey);
            ret.data = asli.toString(CryptoJS.enc.Utf8);
            ret.success = true;
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    });
}

exports.enc = (encObject) =>{
    return new Promise((resolve, reject) => {
        let ret = {};
        try{
            let aes = CryptoJS.AES.encrypt(JSON.stringify(encObject),ecdcKey);
            let hmac = CryptoJS.HmacSHA512(JSON.stringify(encObject),ecdcKey);
            let postdata = {
                params : hmac.toString(),
                ApiKey : aes.toString()
            }
            let postvar = CryptoJS.AES.encrypt(JSON.stringify(postdata), ecdcKey);
            ret.data = postvar.toString();
            ret.success = true;
            ret.message = "success";
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    });
}

exports.passDec = (keydec, enstring) => {
    //keydec = hasil md5 KEY
    return new Promise((resolve, reject) => {
        let ret = {};
        try{
            let data = CryptoJS.AES.decrypt(enstring.toString(), keydec);
            let jsondata = JSON.parse(data.toString(CryptoJS.enc.Utf8));
            let param = jsondata.ApiKey;
            let mac = jsondata.params;
            let asli = CryptoJS.AES.decrypt(param, keydec);
            ret.data = asli.toString(CryptoJS.enc.Utf8);
            ret.success = true;
            ret.message = "success";
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    });
}

exports.passEnc = (keydec, enstring) =>{
    return new Promise((resolve, reject) => {
        let ret = {};
        try {
            //proses new key dengan md5
            let newkey = CryptoJS.MD5(keydec).toString();
            let aes = CryptoJS.AES.encrypt(JSON.stringify(enstring),newkey);
            let hmac = CryptoJS.HmacSHA512(JSON.stringify(enstring),newkey);
            let postdata = {
                params : hmac.toString(),
                ApiKey : aes.toString()
            }
            let postvar = CryptoJS.AES.encrypt(JSON.stringify(postdata), newkey);
            ret.data = postvar.toString();
            ret.success = true;
            ret.message = "success";
            resolve(ret);
        }catch (e) {
            reject(e);
        }
    });
}
