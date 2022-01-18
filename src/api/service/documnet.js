import request from '@/utils/axiosevent';
import Cookies from "@/utils/storage";

const URL = '/documnet';

export function getDocPage(data) {
    return request({
        type: 'get',
        params: data,
        url: URL + '/page',
        target: 'onemap',
        token: true,
    });
}

export function documnetType(data) {
    let type = data.type
    delete data.type
    var arr = []
    for (let i in data) {
        arr.push(data[i]); //属性
    }
    return request({
        type: type,
        data: type === 'delete' ? arr : data,
        url: '/documnet',
        target: 'onemap',
        token: true
    });
}

export function getDocTreeInfo(data) {
    return request({
        type: 'get',
        params: data,
        token: true,
        target: 'onemap',
        url: URL + '/info',
    })
}

export function folderSave(data) {
    return request({
        type: 'post',
        data: data,
        target: 'onemap',
        token: true,
        url: URL + '/folderSave'
    })
}

export function movefolders(data) {
    return request({
        type: 'post',
        data: data,
        target: 'onemap',
        token: true,
        url: URL + '/movefolder'
    })
}
// export function getFileManageList(data) {
//     return request({
//         type: 'get',
//         params: data,
//         target: 'onemap',
//         token: true,
//         url: URL + '/getAllRoot'
//     })
// }