import serviceFuc from '../../../service/index';
let {
    inquiryListS,
    deleteDatasS,
    deleteViewS,
    insertOrUpdateS,
    getPropertyInfoS,
    saveConfigS,
    propertySearchShowConfig,
    getLayerDataList2,
    getLayerDataSource,
    alterView,
    createView
} = serviceFuc();
export function createViews(data,cb,error){
    createView(data).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function alterViews(data,cb,error){
    alterView(data).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function inquiryList(data, cb, error) {
    let obj = {
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        propertyName: data.propertyName
    }
    inquiryListS(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function deleteDatas(data,cb,error){
    let obj = {
        sxcxId: data
    }
    deleteDatasS(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function propertySearchShowConfigs(data, cb, error){
    let obj = {
        sxcxId:data
    }
    propertySearchShowConfig(obj).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getPropertyInfo(data,cb,error){
    let obj = {
        sxcxId:data
    }
    getPropertyInfoS(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}


export function getLayerDataList2s(data,cb,error){
    let obj = {
        sjyId: data
    }
    getLayerDataList2(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}


export function getLayerDataSourceList(data,cb,error){
    getLayerDataSource(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function deleteView(data,cb,error){
    deleteViewS({sxcxId:data}).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function saveConfig(data,cb,error){
    saveConfigS(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}


export function insertOrUpdate(data,cb,error){
    insertOrUpdateS(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}