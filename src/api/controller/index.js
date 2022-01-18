import onemap from './onemap/index';
import commons from './commons/index'
const allModule = {
    onemap,
    commons
}
/**
* 函数描述
* 数据案例
* {
*   onemap:{
*       otherModule:{
*           func1:()=>{}
*       }
*       ...
*   } 
*   ...
* }
* @param {Array} pathStr ['onemap:otherModule']
* @param {Object} api 返回调取接口方法
* 注意：方法名称不能重复
*/
export default {
    get: function (pathStr) {
        var api = {};
        for (let i = 0; i < pathStr.length; i++) {
            const strItem = pathStr[i];
            let strArray = strItem.split(':');
            if (allModule.hasOwnProperty(strArray[0])){
                if(allModule[strArray[0]].hasOwnProperty([strArray[1]])){
                    let allObj = allModule[strArray[0]][strArray[1]];
                    for (const key in allObj[strArray[1]]) {
                        if (allObj[strArray[1]].hasOwnProperty.call(allObj[strArray[1]], key)) {
                            const item = allObj[strArray[1]][key];
                            api[key] = item
                        }
                    }
                }
            }
        }
        return api;
    }
}