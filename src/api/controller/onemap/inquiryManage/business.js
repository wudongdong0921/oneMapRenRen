import serviceFuc from '../../../service/index';
let {
    getPageList,
    deleteSearch,
    queryById,
    insertSearch,
    updateSearch,
    getBusinessPageById,
    deleteBusinessProcess,
    getFlowDefList,
    getBusinessProcessById,
    getTablesbyFlowId,
    insertBusinessProcess,
    updateBusinessProcess,
    getFieldByTid
} = serviceFuc();
export function updateProcesss(data, cb, error) {
    updateBusinessProcess(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function insertProcesss(data, cb, error) {
    insertBusinessProcess(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function getTablesbyFlowIds(data, cb, error) {
    getTablesbyFlowId(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getFieldByTids(data, cb, error) {
    getFieldByTid(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}

export function getProcessByIds(data, cb, error) {
    getBusinessProcessById(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function getFlowDefLists(data, cb, error) {
    getFlowDefList(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function deleteProcesss(data, cb, error) {
    deleteBusinessProcess(data).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function getPageByIds(data, cb, error) {
    getBusinessPageById(data).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function updateSearchs(data, cb, error) {
    updateSearch(data).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function insertSearchs(data, cb, error) {
    insertSearch(data).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function queryByIds(data, cb, error) {
    queryById({ ywcxxxbId: data }).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function deleteSearchs(data, cb, error) {
    deleteSearch({ ywcxxxbIds: data }).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function getPageLists(data, cb, error) {
    getPageList(data).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}