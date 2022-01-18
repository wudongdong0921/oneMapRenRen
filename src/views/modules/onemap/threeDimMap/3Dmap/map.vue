<template>
    <div class="mapM">
        <div class="querybox">
            <div class="form-item">
                <el-input clearable v-model="param.mapName" placeholder="请输入地图名称"></el-input>
            </div>
            <div class="form-item">
                <el-select v-model="param.mapType" style="width: 100%" placeholder="请选择地图类型" clearable>
                    <el-option v-for="item in maptypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </div>
            <div class="form-item" style="width: 60%;">
                <el-button @click="search">查询</el-button>
                <el-button type="primary" @click="add">新增</el-button>
            </div>
        </div>
        <div class="tableBox" v-loading="showLoading">
            <div class="empty" v-if="showNodata">暂无数据</div>
            <el-row v-else>
                <div class="map-box">
                    <el-col style="width:20%;" v-for="(item,index) in tableData" :key="item.id">
                        <div class="grid-content" @click="updateMap(item)">
                            <div class="mapBox">
                                <i class="el-icon-delete" @click.stop="deletemap(item)"></i>
                                <img src="~@/assets/img/placehoder.png" class="placeImg" />
                                <img :src='item.mapAddress' class="realImg" @error="checkImg(index)" />
                                <div class="mapname">{{item.mapName}}</div>
                            </div>
                        </div>
                    </el-col>
                </div>
            </el-row>
        </div>
        <div class="tableBox">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
            </el-pagination>
        </div>
        <el-dialog :title="type==0?'新增':'修改'" :visible.sync="dialogVisible" width="40%" :destroy-on-close="true">
            <addMap @closeDailog="closeE" ref="mapform" />
        </el-dialog>
    </div>
</template>

<script>
import addMap from "./addMap"

export default {
    //import引入的组件
    components: {
        addMap
    },
    data() {
        return {
            type: 0,
            url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
            showNodata: false,
            param: {
                mapName: null,
                mapType: '',
                pageNum: 1,
                pageSize: 10,
            },
            currentPage: 1,
            totalNum: 0,
            showLoading: false,
            maptypeList: [{
                label: "三维地图",
                id: 0,
            },
            {
                label: "三维地形",
                id: 1,
            },
            ],
            tableData: [],
            multipleSelection: [],
            dialogVisible: false,
        };
    },
    //方法集合
    methods: {
        initData() {
            this.showLoading = true;
            this.$api.getMapList(this.param,(res) => {
                this.showLoading = false;
                if (res.list.length == 0) {
                    this.showNodata = true
                } else {
                    this.showNodata = false
                }
                this.tableData = res.list;
                this.totalNum = parseInt(res.total)
                for (let item of this.tableData) {
                    item.mapAddress = item.mapAddress + '/image.png'
                }
            })
        },
        checkImg(index) {
            this.tableData[index].mapAddress = require('@/assets/img/onemap/default-thumbnails.png')
        },
        search() {
            this.param.pageNum = 1
            this.initData()
        },
        add() {
            this.type = 0
            this.dialogVisible = true
        },
        deletemap(data) {
            //console.log(data)
            this.$confirm('是否确认删除该地图?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteMap(data.tdDtxxbId).then((res) => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    this.initData()
                })
            }).catch(() => { });
        },
        closeE() {
            this.dialogVisible = false;
            this.initData()
        },
        updateMap(data) {
            this.type = 1
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.mapform.init(data);
            })
        },
        currentPageChange(e) {
            this.param.pageNum = e;
            this.initData();
        },
        handleSizeChange(val) {
            this.param.pageSize = val;
            this.initData();
        },
        handleCurrentChange(val) {
            this.param.pageNum = val;
            this.initData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.$api = this.$API.get(['onemap:threeModule']);
        this.initData()
    },
};
</script>

<style scoped>
.mapM {
    background: #fff;
    padding: 20px;
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 15px;
    top: 15px;
    overflow-y: auto;
}

.mapM .querybox {
    display: flex;
}

.mapM .form-item {
    width: 15%;
    margin-right: 20px;
}

.mapM .tableBox {
    margin-top: 20px;
}

.mapBox {
    position: relative;
    margin: 15px;
    border: 1px solid #ccc;
}

.mapBox i {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 18px;
    cursor: pointer;
    z-index: 999;
    color: #fff;
}

.mapBox i:hover {
    color: #ccc;
}

/* HLJSSJDXT-602 */
.mapBox .mapname {
    text-align: center;
    line-height: 40px;
    color: #3671e6;
    font-weight: bold;
    width: 100%;
    height: auto;
    word-break: break-all;
    overflow: hidden;
}

.mapBox img {
    width: 100%;
}

.mapBox .realImg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.mapM .empty {
    width: 100%;
    text-align: center;
    line-height: 110px;
    color: #aaa;
    font-size: 16px;
    font-weight: bold;
}
.map-box {
    display: flex;
    flex-wrap: wrap;
}
</style>
