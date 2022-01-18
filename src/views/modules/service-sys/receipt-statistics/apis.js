import request from '@/utils/axiosevent';

var queryCategory = function () {
    return request({
        type: 'post',
        params: {type:'TJPZLB'},
        url: '/sys/dict/data/queryChildListByType',
        target: 'security',
        token: true,
    });
}

var queryStatisticsConfig = function (data) {
    return request({
        type: 'post',
        params: {category:data},
        url: '/statisticsConfig/selectStatisticsConfigByCategoryTree',
        target: 'business',
        token: true,
    });
}

var deleteStatisticsConfig = function (data) {
    return request({
        type: 'post',
        params: {id:data},
        url: '/statisticsConfig/deleteStatisticsConfigById',
        target: 'business',
        token: true,
    });
}

var queryStatisticsConfigById = function (data) {
    return request({
        type: 'post',
        params: {id:data},
        url: '/statisticsConfig/selectStatisticsConfigById',
        target: 'business',
        token: true,
    });
}

var saveStatisticsConfig = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/statisticsConfig/savestatisticsConfig',
        target: 'business',
        token: true,
    });
}

var testStatisticsConfig = function (data) {
    return request({
        type: 'post',
        data: data,
        url: '/statisticsConfig/testStatisticsConfig',
        target: 'business',
        token: true,
    });
}

export default {
    queryCategory: queryCategory,
    queryStatisticsConfig: queryStatisticsConfig,
    saveStatisticsConfig: saveStatisticsConfig,
    queryStatisticsConfigById:queryStatisticsConfigById,
    deleteStatisticsConfig: deleteStatisticsConfig,
    testStatisticsConfig: testStatisticsConfig
}