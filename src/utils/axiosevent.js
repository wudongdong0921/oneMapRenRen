import axios from 'axios';
import { Message } from 'element-ui'
import Cookies from "js-cookie";
// import Cookies from "@/utils/storage";
// import http from '@/utils/request';
// import Cookies from "@/utils/storage";

var axiosEvent = function (...optionList) {
   
    return new Promise(function (resolve, reject) {
        var Key,TargetKey,data,ajaxList=[],winURL,targetURL
        function request(data,fn) {
            axios(data).then((res) => {
                 if (res.data.code == 200||res.data.code==0) {
                     fn(res.data)   // 返回给接口的是res的所有值，包括code、data和msg
                 } else {
                     Message({
                         message: res.data.msg,
                         type: 'error'
                     }, true);
                 }
             }).catch((error) => {
                 Message({
                     message: error.response? JSON.stringify(error.response.data.msg) : JSON.stringify(error),
                     type: 'error'
                 }, true);
                 reject();
             });
         }
        if(optionList.length === 1){
            Key = optionList[0].DevUrl || 'apiURL';
            TargetKey = optionList[0].target || 'security';
            data = {
                method: optionList[0].type,
                url: window.SITE_CONFIG[Key] + window.SITE_CONFIG['targetPath'][TargetKey] + optionList[0].url,
                params: (optionList[0]['params'] ? optionList[0]['params'] : undefined),
                data: (optionList[0]['data'] ? optionList[0]['data'] : undefined),
                headers: (optionList[0].token ? { token: Cookies.get('token') } : { token: Cookies.get('token') })
            };
            request(data,res=>{
                resolve(res)
            })
            return
        }
        for(let item of optionList){
            let key = item.DevUrl || 'apiURL'
            let targetKey = optionList[0].target || 'security';
            winURL = window.SITE_CONFIG[key]
            targetURL = window.SITE_CONFIG['targetPath'][TargetKey]
            ajaxList.push((() => {
                return new Promise((resolve) => {
                    data = {
                        method: item.type,
                        url: winURL + targetURL + item.url,
                        params: (item['params'] ? item['params'] : undefined),
                        data: (item['data'] ? item['data'] : undefined),
                        headers: (item.token ? { token: Cookies.get('token') } : { token: Cookies.get('token') })
                    };
                    request(data,res=>{
                        resolve(res)
                    })
                })
            })(item))
        }
        Promise.all(ajaxList).then((result) => {
            resolve(result)
        }).catch((error) => {
            console.log(error)
            reject()
        })
    });
};




export default axiosEvent