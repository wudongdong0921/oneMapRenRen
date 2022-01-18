import serviceFuc from '../../../service/index';
let {
    queryTdTreeDataDirs,
    deleteTdDataDir,
    queryTdDataDirById,
    getMapSelect,
    getMapSelectForMap,
    updateTdDataDir,
    insertTdDataDir
} = serviceFuc();
// 根据目录类型进行查询: 三维
//?targetType='+type
export function queryTdTreeDataDir(data, cb, error) {
    queryTdTreeDataDirs(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function deleteDataDir(id, cb, error) {
    let obj = {
        tdSjmlxxbId: id
    }
    deleteTdDataDir(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getDataDirDetail(data, cb, error) {
    queryTdDataDirById(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
// 获取地图下拉列表数据:三维
export function getTdMapData(data, cb, error) {
    getMapSelect(data, cb, error).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
// 获取地图下拉列表数据：二维
export function getMapData(data,cb,error){
    getMapSelectForMap(data, cb, error).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
// 修改数据目录
export function changeDataDir(data,cb,error){
    updateTdDataDir(data, cb, error).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function insertDataDir(data,cb,error){
    insertTdDataDir(data).then((res)=>{
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}