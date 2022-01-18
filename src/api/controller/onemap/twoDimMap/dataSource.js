import serviceFunc from "../../../service";
let {
    selectDataSource,
    selectLayerData,
    addLayerData,
    testConnection
} = serviceFunc();

// 获取数据源应用明细
export function selectDataSourceList(data, cb, error) {
    selectDataSource(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function selectLayerDataInfo(data, cb, error) {
    selectLayerData(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function addLayerDataInfo(data, cb, error) {
    addLayerData(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function TestConnection(data, cb, error) {
    testConnection(data).then((res) => {
        if(res.code == 200 || res.code == 0) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
