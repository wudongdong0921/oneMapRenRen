import axios from 'axios';
import { Message } from 'element-ui'
import http from '@/utils/request';
import Cookies from "@/utils/storage";

// 获取字典项
var getDict = function (code, success) {
    http
        .post("/specificAnalysisV2/getDicSelectList?value=" + code + "&pid=0")
        .then((res) => {
            var _data = [];
            for (let i = 0; i < res.data.data.length; i++) {
                const element = res.data.data[i];
                if (element) {
                    _data.push({
                        label: element.dictLabel,
                        value: element.dictValue,
                    });
                };
            };
            success(_data);
        });

};

//修改业务分析类别
var updateBusinessAnaylsis = function(param,success) {
    http
        .post("/caBusinessAnalysis/updateBusinessAnaylsis", param.param)
        .then((res) => {
            success(res.data);
        });
} 

// 新增业务分析类别
var saveBusinessAnaylsis = function(param, success) {
    http.post("/caBusinessAnalysis/saveBusinessAnaylsis", param.param)
    .then((res) => {
        success(res.data);
    })
}

var getLayerDataSourceList = function (success) {
    axios.post(
        window.SITE_CONFIG["apiURL"] +
        "/layerDataField/getLayerDataSourceList"
    ).then((res) => {
        success(res.data.data);
    });
}

var getLayerDataList2 = function (sjyId, success) {
    axios({
        method: "post",
        url: window.SITE_CONFIG["apiURL"] +
            "/layerDataField/getLayerDataList2?sjyId=" + sjyId,
        params: {},
        headers: {
            token: Cookies.get('token')
        },
    }).then((res) => {
        success(res.data.data);
    })
}

var findLayerDataFieldSelectList = function (sjbId, success) {
    axios.post(
        window.SITE_CONFIG["apiURL"] +
        "/layerDataField/findLayerDataFieldSelectList?sjbId=" + sjbId
    ).then((res) => {
        success(res.data.data);
    });
}

var axiosEvent = function (option) {
    if (option.hasOwnProperty('params')) {
        let params = option['params'];
        axios({
            method: option.type,
            url: window.SITE_CONFIG["apiURL"] + option.url,
            params: params,
            headers: {
                token: Cookies.get('token')
            },
        }).then((res) => {
            if (res.data.code == 200) {
                option.success(res.data.data);
            } else {
                Message({
                    message: res.data.msg,
                    type: 'error'
                }, true)
            }
        });
    } else if (option.hasOwnProperty('data')) {
        let data = option['data'];
        axios.post(window.SITE_CONFIG["apiURL"] + option.url, data, {
            headers: {
                token: Cookies.get('token')
            }
        }).then((res) => {
            if (res.data.code == 200) {
                option.success(res.data.data);
            } else {
                Message({
                    message: res.data.msg,
                    type: 'error'
                }, true)
            }
        });
    } else {
        axios[option.type](window.SITE_CONFIG["apiURL"] + option.url).then((res) => {
            if (res.data.code == 200) {
                option.success(res.data.data);
            } else {
                Message({
                    message: res.data.msg,
                    type: 'error'
                }, true)
            }
        });
    };
};

var TestConnection = function (data, success) {
    axios({
        method: 'POST',
        url: window.SITE_CONFIG["apiURL"] + '/layer/TestConnection',
        headers: {
            'token': Cookies.get('token') || ''
        },
        params: data,
    }).then((res) => {
        if (res.data.code == 0 || res.data.code == 200) {
            success(res.data);
        } else {
            Message({
                message: res.data.msg,
                type: 'error'
            }, true)
        }
    });
};


var getMapSelect = function (success) {
    axios.post(
        window.SITE_CONFIG["apiURL"] +
        "/pictureMapController/getMapSelect"
    ).then((res) => {
        success(res.data.data);
    });
}

var getFXLX = function (success, ztfxId) {
    axios.get(
        window.SITE_CONFIG["apiURL"] + '/caBusinessAnalysis/getFXLX?ztfxId=' + ztfxId
    )
        .then(res => {
            success(res.data.data);
        })
}



export default {
    getDict: getDict, // 获取字典项
    getLayerDataSourceList: getLayerDataSourceList, // 获取数据源列表
    getLayerDataList2: getLayerDataList2, // 获取数据源
    findLayerDataFieldSelectList: findLayerDataFieldSelectList, // 获取数据表详情

    updateBusinessAnaylsis: updateBusinessAnaylsis, //业务分析页面修改
    saveBusinessAnaylsis: saveBusinessAnaylsis, //业务分析页面新增
    getMapSelect, // 获取地图地址下拉数据
    TestConnection: TestConnection,
    getFXLX, // 获取二调三调
    

    Analysis: {
        // 获取专题详情
        getDetail: function (id, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/getSpecificAnalysis',
                params: {
                    ztfxId: id
                },
                success: callback,
            });
        },
        // 获取专题列表
        getList: function (data, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/querySpecificAnalysisTableTree',
                params: {
                    specialClassify: data.type,
                    specialName: data.text,
                    pageNum: data.pageNum,
                    pageSize: data.pageSize,
                },
                success: callback,
            });
        },

        // 创建或保存实体信息
        save: function (data, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/saveOrUpdateSpecificAnalysis',
                data: {
                    ztfxId: data.ztfxId || undefined, // 主键 (String) 
                    specialCode: data.specialCode, // 专题编码 (String) 必填
                    specialName: data.specialName, // 专题名称 (String) 必填
                    specialClassify: data.specialClassify, // 专题分类 (String) 必填
                    analysisType: data.analysisType, // 分析类型 (String) 必填
                    // mapAddress: data.mapAddress, // 地图地址 (String) 必填
                    isTimeIndex: data.isTimeIndex, // 是否开启时间索引（0是、1否） (Integer) 必填
                    isUniformConfiguration: data.isUniformConfiguration, // 是否统一高级配置（0是、1否） (Integer) 必填
                    dataSource: data.dataSource, // 数据基准源 (String) 
                    dataReference: data.dataReference, // 数据基准表 (String) 
                    dataYear: data.dataYear, // 数据基准年 (String) 
                    completelyText: data.completelyText, // 完全压占文本
                    completelyType: data.completelyType, // 完全压占字典选项
                    nothingText: data.nothingText, // 部分压占文本
                    nothingType: data.nothingType, // 部分压占字典选项
                    partText: data.partText, // 无压占文本
                    partType: data.partType, // 无压占字典选项
                    mapAddress: data.mapAddress // 地图地址
                },
                success: callback,
            });
        },
        // 删除实体信息
        delete: function (id, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/delSpecificAnalysis',
                params: {
                    ztfxId: id
                },
                success: callback,
            });
        },
    },

    LayerData: {
        // 保存数据源
        save: function (data, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/saveOrUpdateSpecificData',
                data: {
                    ztsjyId: data.ztsjyId || undefined, // 专题数据原表主键 (String) 修改时必填
                    ztfxId: data.ztfxId, // 专题分析表主键 (String) 必填
                    sjyId: data.sjyId, // 数据源主键 (String) 必填
                    sjbId: data.sjbId, // 数据表主键 (String) 必填
                    year: data.year, // 年份 (String) 必填
                    versionNumber: data.versionNumber || undefined, // 年份 (String) 修改时必填，添加时忽略
                    dsjbId: data.dsjbId, // 点数据表主键
                    xsjbId: data.xsjbId // 线数据表主键
                },
                success: callback,
            });
        },
        // 删除数据源中间表
        delete: function (id, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/delSpecificData',
                params: {
                    ztsjyId: id
                },
                success: callback,
            });
        }
    },
    Configuration: {
        // 获取高级配置
        getList: function (SJYID, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/getOneSourceAndConfigs',
                params: {
                    ztsjyId: SJYID
                },
                success: callback,
            });
        },
        // 保存高级配置
        save: function (data, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/saveOrUpdateSpecificConfig',
                data: {
                    gjpzId: data.gjpzId || undefined, // 主键 (String) 修改时必填，添加时忽略
                    ztfxId: data.ztfxId, // 专题分析表主键 (String) 必填
                    ztsjyId: data.ztsjyId, // 专题数据源表主键 (String) 必填
                    year: data.year, // 年份 (String) 
                    labelName: data.labelName, // 标签名称 (String) 必填
                    isOpenTree: data.isOpenTree, // 是否开启统计树（0是、1否） (String) 
                    groupDictionaries: data.groupDictionaries, // 分组参照字典 (String) 
                    showHierarchy: data.showHierarchy, // 显示层级（0全部、1一级和二级） (int) 
                    topTreeContent: data.topTreeContent, // 顶级树内容（1分组字段值、2查询个数、3图形面积总和4压占面积） (String) 
                    twoTreeContent: data.twoTreeContent, // 二级树内容（1分组字段值、2查询个数、4压占面积） (String) 
                    threeTreeContent: data.threeTreeContent, // 三级树内容（1分组字段值、2查询个数、4压占面积） (String) 
                    isOpenMap: data.isOpenMap, // 是否开启统计图（0是、1否） (int) 
                    isFormula: data.isFormula, // 是否有公式（0是、1否） (int) 
                    analysisFormula: data.analysisFormula, // 分析公式 (String) 
                    showEnglishField: data.showEnglishField, // 显示用字段英文名 (String) 
                    showChineseField: data.showChineseField, // 显示用字段中文名 (String) 
                    groupEnglishField: data.groupEnglishField, // 分组用字段英文名 (String) 
                    groupChineseField: data.groupChineseField, // 分组用字段中文名 (String) 
                    versionNumber: data.versionNumber || undefined, // 版本号(String) 修改时必填，添加时忽略
                },
                success: callback,
            });
        },
        // 删除高级配置
        delete: function (id, callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/delSpecificConfig',
                params: {
                    gjpzId: id
                },
                success: callback,
            });
        },
        // specificAnalysis/getDicSelectListForSpecific
        getDicSelectListForSpecific: function (callback) {
            axiosEvent({
                type: 'post',
                url: '/specificAnalysisV2/getDicSelectListForSpecific',
                params: {
                    remark: '一张图系统-业务分析'
                },
                success: callback,
            });
        },
    },
}