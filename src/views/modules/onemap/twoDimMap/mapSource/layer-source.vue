<template>
<div>
    <el-card shadow="never" class="aui-card--fill">
        <el-row class="tac">
            <el-col :span="4">
                <div class="layer-box" @click="addOrUpdateHandle()">
                    <div class="add-layer-source1 add-layer-source"><span class="layer-add-icon el-icon-plus"></span></div>
                </div>
            </el-col>
            <el-col :span="4" v-for="(item,index) in dataList" :key="index">
                <div class="layer-box">
                    <div class="add-layer-source" style="position:relative"><img :src="item.dataType | imgurl" alt="">
                        <div class="layer-bg">
                            <div class="layer-bg-box">
                                <div @click="addOrUpdateHandle(item.sjyId)" class="layer-inline"><span class="el-icon-delete"></span><br><span>修改</span></div>
                                <div @click="modifyLayer(item.sjyId)" class="layer-inline"><span class="el-icon-document"></span><br><span>明细</span></div>
                                <div @click="deleteHandle(item.sjyId)" class="layer-inline"><span class="el-icon-delete"></span><br><span>删除</span></div>
                            </div>
                        </div>
                        <div class="layer-box-title">{{item.sjyName}}</div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <add-layer-source v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-layer-source>
        <layer-detail v-if="modifyVisible" ref="modifyUpdate" @refreshDataList="getDataList"></layer-detail>
    </el-card>
</div>
</template>

<script>
import AddLayerSource from './add-layer-source'
import LayerDetail from './layer-detail'
import mixinViewModule from '@/mixins/source-module'
const databaseType = [{
        id: '1',
        name: 'Qrcale',
        value: '1',
        url: require('@/assets/img/source/san.png')
    },
    {
        id: '2',
        name: 'Mysql',
        value: '2',
        url: require('@/assets/img/source/mysql.png')
    },
    {
        id: '3',
        name: 'Hbase',
        value: '3',
        url: require('@/assets/img/source/hb.png')
    },
    {
        id: '4',
        name: 'Gp',
        value: '4',
        url: require('@/assets/img/source/gp.png')
    }
]

export default {
    mixins: [mixinViewModule],
    data() {
        return {
            dataList: [],
            mixinViewModuleOptions: {
                getDataListURL: '/layer/selectLayerDataInfoList',
                getDataListIsPage: true,
                deleteURL: '/layer/deleteLayerDataInfo',
                deleteIsBatch: true,
                method: 'post',
                treeBool: true
            }
        }
    },
    components: {
        AddLayerSource,
        LayerDetail
    },
    filters: {
        imgurl(val) {
            if(val){
                return databaseType[val - 1].url
            }
            
        }
    },
    created() {

    },
    methods: {

    }
}
</script>

<style scoped>
.layer-add-icon {
    font-size: 30px;
}

.layer-box {
    padding: 10px 20px;
}

.add-layer-source1 {
    line-height: 220px;
}

.add-layer-source {
    height: 220px;
    cursor: pointer;
    border: solid 1px #ddd;
    border-radius: 4px;
    text-align: center;
}

.add-layer-source img {
    width: 100%;
    height: 100%;
}

.layer-bg {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: none;
}

.layer-bg-box {
    display: flex;
    align-items: center;
    justify-items: center;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
}

.layer-inline {
    width: 33.3333%;
    color: #fff;
}

.layer-inline span {
    display: inline-block;
    font-size: 18px;
}

.layer-box:hover .layer-bg {
    display: block;
}

.layer-inline:hover {
    color: #409eff;
}

.layer-box-title {
    position: absolute;
    width: 100%;
    bottom: 5px;
    left: 0;
    text-align: center;
    font-size: 18px;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
