import serviceFuc from '../../../service/index';
let {getProcessPage,getProcessPage2} = serviceFuc();

export function seleLsit(data,cb){
    getList(data).then((res)=>{
        cb(res)
    })
}

export function seleLsit2(value,cb){
    let obj=
    getList(data).then((res)=>{
        cb(res)
    })
}