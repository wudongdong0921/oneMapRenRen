import serviceFunc from "../../../service";
let {
    getCoordinate,
    updateStatu
} = serviceFunc();

// 获取底图列表
export function getCoordinateList(data, cb, error) {
    let sendData = {
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        prjName: data.prjName,
        status: data.status,
    }
    getCoordinate(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

// 启用、禁用的传输数值要和后端商量一下，现在的有问题
export function updateStatus(data, cb, error) {
    updateStatu(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}