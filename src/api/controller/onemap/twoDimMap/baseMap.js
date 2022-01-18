import serviceFunc from "../../../service";
let {
    selectBaseMap,
    saveBaseMap,
    deleteBaseMap,
    selectBaseMapDetail,
    selectRegion
} = serviceFunc();

// 获取底图列表
export function getBaseMapList(data, cb, error) {
    let sendData = { 
        'baseMapName': data 
    }
    selectBaseMap(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

// 批量删除底图数据接口
export function deleteBaseMapData(data, cb, error) {
    let sendData = {
        dtxxbIds: data.join(','), 
    }
    deleteBaseMap(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data);
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err);
    })
}

//查询底图信息
export function getbaseMapDetail(data, cb) {
    let sendData = {
        dtxxbId: data, 
    }
    selectBaseMapDetail(sendData).then((res) => {
        cb(res.data)
    })
}

// 添加或修改底图数据
export function saveBaseMapData(data, cb, error) {
    let sendData = {
        dtxxbId: data.dtxxbId, // 底图信息ID
        baseMapName: data.baseMapName, // 底图名称
        serverName: data.serverName, // 服务名称
        baseMapAddress: data.baseMapAddress, // 底图地址
        codeProvince: data.codeProvince, // 省代码
        codeCity: data.codeCity, // 市代码
        codeDistrict: data.codeDistrict, // 区代码
        baseMapStatus: data.baseMapStatus, // 地图状态
        baseMapSort: data.baseMapSort, // 地图排序
        remark: data.remark, // 地图备注
    }
    saveBaseMap(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data);
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function getRegionTree(data, cb, error) {
    selectRegion().then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}