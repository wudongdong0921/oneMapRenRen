import serviceFunc from "../../../service";
let {
    getLayerDataSource,
    getLayerDataField,
    resetLayerData,
    saveLayerData,
    updataCa,
    selectSjbList,
    getLayerDataTree
} = serviceFunc();

export function getLayerDataSourceList(data, cb, error) {
    getLayerDataSource(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function getLayerDataFieldList(data, cb, error) {
    getLayerDataField(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function resetLayerDataField(data, cb, error) {
    resetLayerData(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function saveLayerDataAndField(data, cb, error) {
    saveLayerData(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}


export function updataCaData(data, cb, error) {
    updataCa(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}


export function selectSjbListBySjyId(data, cb, error) {
    selectSjbList(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}


export function getDataTableTree(data, cb, error) {
    getLayerDataTree(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}