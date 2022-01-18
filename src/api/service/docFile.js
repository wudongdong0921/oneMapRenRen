import request from '@/utils/axiosevent';
import Cookies from "@/utils/storage";

const URL = '/doc.file';

export function getDocFilePage(data) {
    return request({
        type: 'get',
        params: data,
        token: true,
        target: 'onemap',
        url: URL + '/page'
    })
}

export function docFileType(data) {
    let type = data.type
    delete data.type
    var arr = []
    for (let i in data) {
        arr.push(data[i]); //属性
    }
    return request({
        type: type,
        data: type == 'delete' ? arr : data,
        token: true,
        target: 'onemap',
        url: URL
    })
}

export function importRusult(data) {
    return request({
        type: 'post',
        token: true,
        target: 'onemap',
        url: URL+'/imports'
    })
}

export function moveFiles(data){
    return request({
        type: 'post',
        data:data,
        token: true,
        target: 'onemap',
        url: URL+'/movefile'
    })
}