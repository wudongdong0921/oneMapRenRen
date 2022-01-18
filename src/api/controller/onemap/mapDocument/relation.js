import serviceFuc from '../../../service/index';
let {
    getMapList,
    saveMap,
    deleteItems,
    getFileTrees,
    saveMapFiles,
    findList,
    getDocfindList,
} = serviceFuc();
export function getAddMapList(data, cb, error) {
    getMapList(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function addRelation(data, cb, error) {
    saveMap(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getList(data, cb) {
    findList(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function DocfindList(data, cb) {
    getDocfindList(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function deleteItem(data, cb, error) {
    deleteItems(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function getFileTree(data, cb, error) {
    getFileTrees(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function saveMapFile(data, cb, error) {
    saveMapFiles(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}