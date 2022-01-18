import serviceFuc from '../../../service/index';
let {
    getUpdateBusiness,
    getDicSelectList,
    getSaveBusiness,
    getLayerDataSource,
    getLayerDataList2,
    findLayerDataFieldSelectLists,
    getSpecificAnalysis,
    getQuerySpecificAnalysisTableTree,
    getSaveOrUpdateSpecificAnalysis,
    getDelSpecificAnalysis,
    getSaveOrUpdateSpecificData,
    getDelSpecificData,
    getOneSourceAndConfigs,
    getSaveOrUpdateSpecificConfig,
    getDelSpecificConfig,
    getMapSelectForMap,
    getFXLX,
    getBusinessAnaylsisById2,
    getBusinessAnaylsisList,
    updateBusinessAnaylsisState,
    getDicSelectListForSpecific
} = serviceFuc();
export function updateBusiness(data, cb, error) { // 获取字典项
    getUpdateBusiness(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function dicSelectList(data, cb, error) {
    getDicSelectList(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function saveBusiness(data, cb, error) { // 新增业务分析类别
    getSaveBusiness(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function lyerDataSource(data, cb, error) {
    getLayerDataSource(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function layerDataList2(data, cb, error) {
    getLayerDataList2(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function findLayerSelectList(data, cb, error) {
    findLayerDataFieldSelectLists(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function specificAnalysis(data, cb, error) {  
    getSpecificAnalysis(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function qerySpecificAnalysisTableTree(data, cb, error) {  
    getQuerySpecificAnalysisTableTree(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function saveOrUpdateSpecificAnalysis(data, cb, error) {
    getSaveOrUpdateSpecificAnalysis(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function delSpecificAnalysis(data, cb, error) {  
    getDelSpecificAnalysis(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function saveOrUpdateSpecificData(data, cb, error) {  
    getSaveOrUpdateSpecificData(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function delSpecificData(data, cb, error) {  
    getDelSpecificData(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function oneSourceAndConfigs(data, cb, error) {  
    getOneSourceAndConfigs(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function saveOrUpdateSpecificConfig(data, cb, error) {  
    getSaveOrUpdateSpecificConfig(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function delSpecificConfig(data, cb, error) {  
    getDelSpecificConfig(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function dcSelectListForSpecific(data, cb, error) {  
    getDicSelectListForSpecific(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function mapSelectForMap(data, cb, error) {
    getMapSelectForMap(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function selectFXLX(data, cb, error) {
    getFXLX(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function businessAnaylsisById2(data, cb, error) {
    getBusinessAnaylsisById2(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function businessAnaylsisList(data, cb, error) {
    getBusinessAnaylsisList(data).then((res) => {
        if (res.code == 200) {
            cb(res.data)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}
export function updateBusinessAnay(data, cb, error) {
    updateBusinessAnaylsisState(data).then((res) => {
        if (res.code == 200) {
            cb(res)
        } else {
            if (error) {
                error(res)
            }
        }
    })
}