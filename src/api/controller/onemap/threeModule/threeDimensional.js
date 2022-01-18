import serviceFuc from '../../../service/index';
let {
    getBaseMapList,
    deleteById,
    selectById,
    updatePictureTdMap
} = serviceFuc();
// 三维地图读取地图列表
export function getMapList(data, cb, error) {
    let obj = {
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        mapName: data.mapName,
        mapType: data.mapType
    }
    getBaseMapList(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
// 删除地图
export function deleteMap(id, cb, error) {
    let obj = {
        tdDtxxbId: id
    }
    deleteById(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

// 地图详情
export function getMapDetail(id, cb, error) {
    let obj = {
        'tdDtxxbId': id
    }
    selectById(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

// 新增/修改地图
// 不传tdDtxxbId是新增否则为修改
export function updateMap(data, cb, error) {
    let obj = {}
    if (data.tdDtxxbId) {
        obj = {
            mapName: data.mapName,
            mapAddress: data.mapAddress,
            mapType: data.mapType,
            mapOrder: data.mapOrder,
            status: data.status,
            tdDtxxbId: data.tdDtxxbId,
            isShow: data.isShow,
            minShowLevel: data.minShowLevel,
            maxShowLevel: data.maxShowLevel,
        }
    } else {
        obj = {
            mapName: data.mapName,
            mapAddress: data.mapAddress,
            mapType: data.mapType,
            mapOrder: data.mapOrder,
            status: data.status,
            minShowLevel: data.minShowLevel,
            maxShowLevel: data.maxShowLevel,
        }
    }
    updatePictureTdMap(obj).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}