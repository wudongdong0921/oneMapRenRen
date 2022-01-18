import serviceFuc from '../../../service/index';
let {
    dataStaticGetList,
    dataStaticDelete,
    dataStaticGetById,
    getLayerDataSource,
    getLayerDataList2,
    findLayerDataFieldSelectLists,
    getDicSelectListForSpecific2,
    dataStaticSave
} = serviceFuc();
// 根据目录类型进行查询: 三维
//?targetType='+type
export function getStatisList(data, cb, error) {
    let obj = {
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        statisName: data.statisName
    }
    dataStaticGetList(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function deleteStatis(id, cb, error) {
    let obj = {
        ids: id
    }
    dataStaticDelete(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getStaticListById(id, cb, error) {
    let obj = {
        id: id
    }
    dataStaticGetById(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getLayerDataSourceList(data, cb, error) {
    getLayerDataSource().then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getLayerDataList(id, cb, error) {
    let obj = {
        sjyId: id
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

export function findLayerDataFieldSelectList(id, cb, error) {
    let obj = {
        sjbId: id
    }
    findLayerDataFieldSelectLists(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getDicSelectListForSpecific(data, cb, error) {
    let obj = {
        remark: '分析'
    }
    getDicSelectListForSpecific2(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function saveStatis(data, cb, error) {
    dataStaticSave(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}