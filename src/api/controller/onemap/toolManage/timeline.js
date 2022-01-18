import serviceFunc from "../../../service";
let {
    getTimeList,
    getdeleteTimeline,
    getSelectTimeline,
    getUpdataTimeline,
    getSelectMapInfo,
    getUpdataTimelineData,
    getPageOfData,
    getSelectTimelineDataById,
    getDeleteTimelineDataById
} = serviceFunc();

// 时间轴列表查询
export function selectTimeList(data, cb, error) {
    console.log(data);
    getTimeList(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
// 时间轴删除
export function deleteTimeline(data, cb, error){
    getdeleteTimeline(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
// 修改
export function selectTimeline(data, cb, error){
    getSelectTimeline(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
// 新增
export function updataTimeline(data, cb, error){
    getUpdataTimeline(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
// 获取地图名称下拉框列表数据
export function selectMapInfo(data, cb, error){
    getSelectMapInfo(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
// 新增时间轴列表数据
export function updataTimelineData(data, cb, error){
    getUpdataTimelineData(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
// 获取时间轴列表数据
export function pageOfData(data, cb, error){
    getPageOfData(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
// 修改
export function selectTimelineDataById(data, cb, error){
    getSelectTimelineDataById(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}
// 删除
export function deleteTimelineDataById(data, cb, error){
    getDeleteTimelineDataById(data).then((res) => {
        if(res.code == 200) {
            cb(res)
        }else {
            error(res)
        }
    }).catch((err) => {
        error(err)
    })
}