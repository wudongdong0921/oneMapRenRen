import serviceFunc from "../../../service";
let {
    queryTreeData,
    deleteData,
    queryDataDirById,
    getMapSelectForMap,
    getBusinessAnaylsisForSelect,
    getDicSelectList,
    updateDataDir,
    insertData
} = serviceFunc();

export function queryTreeDataDir(data, cb, error) {
    let sendData = {
        targetType: data
    }
    queryTreeData(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function deleteDataDir(data, cb, error) {
    let sendData = {
        sjmlxxbId: data
    }
    deleteData(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function getDataDirDetail(data, cb, error) {
    queryDataDirById(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function getMapData(data, cb, error) {
    getMapSelectForMap(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function getBusinessAnalysis(data, cb, error) {
    let sendData = {
        theCategory: data
    }
    getBusinessAnaylsisForSelect(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}


export function getDict(data, cb, error) {
    let sendData = {
        value: data,
        pid: 0
    }
    getDicSelectList(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function changeDataDir(data, cb, error) {
    updateDataDir(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function insertDataDir(data, cb, error) {
    insertData(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}