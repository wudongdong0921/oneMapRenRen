import serviceFunc from "../../../service";
let {
    getPage,
    deleteByMapManageId,
    findList,
    saveMapUpdate,
    deleteMapMsgData,
    getLayerDataList2,
    selectByMapManageId,
    getLayerDataSource,
    updataPictureMap
} = serviceFunc();

export function getMapList(data, cb, error) {
    let sendData = { 
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        mapName: data.mapName,
        mapDataType: data.mapDataType
    }
    getPage(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function deleteMap(data, cb, error) {
    let sendData = { 
        dtxxbId: data
    }
    deleteByMapManageId(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function findMapMsgList(data, cb, error) {
    let sendData = { 
        dtxxbId: data
    }
    findList(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function saveMapUpdates(data, cb, error) {
    saveMapUpdate(data).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function deleteMapMsg(data, cb, error) {
    let sendData = {
        id: data
    }
    deleteMapMsgData(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function getLayerDataListByMap(data, cb, error) {
    let sendData = {
        sjyId: data
    }
    getLayerDataList2(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}

export function getMapDetail(data, cb, error) {
    let sendData = {
        dtxxbId: data
    }
    selectByMapManageId(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}


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

export function updateMap(data, cb, error) {
    let sendData = {
        dtxxbId: data.dtxxbId,
        mapName: data.mapName,
        mapAddress: data.mapAddress,
        mapDataType: data.mapDataType,
        mapOrder: data.mapOrder,
        mapServerName: data.mapServerName,
        // mapServerAddress: data.mapServerAddress,
        sjyId: data.sjyId,
        sjbId: data.sjbId,
        legendAddress: data.legendAddress,
        minShowLevel: data.minShowLevel,
        maxShowLevel: data.maxShowLevel,
        twoDimensionalIsdisplay: data.twoDimensionalIsdisplay,
        threeDimensionalIsdisplay: data.threeDimensionalIsdisplay,
        dynamicProjection: data.dynamicProjection,
    }
    updataPictureMap(sendData).then((res) => {
        if(res.code == 200) {
            cb(res.data)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
