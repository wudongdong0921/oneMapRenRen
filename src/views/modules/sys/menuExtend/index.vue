<template>
    <div>
        <div style="display:flex">
            <div style="margin-right: 6px;margin-top: 4px;">文档管理</div>
            <el-tree :data="fileList" :default-checked-keys="selectFileArray" 
            @check-change="changeValue('selectFileArray','fileTree')" :props="defaultProps" show-checkbox node-key="id" ref="fileTree"></el-tree>
        </div>
        <div style="display:flex">
            <div style="margin-right: 6px;margin-top: 4px;">数据统计</div>
            <el-tree :data="staticList" :default-checked-keys="selectStaticArray" 
           @check-change="changeValue('selectStaticArray','manageTree')" :props="defaultProps" show-checkbox node-key="id" ref="manageTree"></el-tree>
        </div>
    </div>
</template>

<script>
// import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
// ...mapState('mentExtend', ['name'])
// ...mapMutations('mentExtend', ['changeName']),
import API from './api'
export default {
    data() {
        return {
            fileList: [],
            defaultProps: {
                label: 'name',
                children: 'children'
            },
            staticList: [{
                name: '数据统计',
                id: '1'
            }]
        }
    },
    props: ['selectFileArray', 'selectStaticArray'],
    methods: {
        init() {
            // console.log('selectFileArray%o',this.selectFileArray)
            // console.log('selectStaticArray%o',this.selectStaticArray)
            this.$api.getFileManageList({}).then(data => {
                this.fileList = data.data;
            })
        },

        changeValue(key,type){
            this.$emit('change-extendTree',key,this.$refs[type].getCheckedKeys())
        },
    },
    mounted() {
        this.$api = API;
        this.init()
    }
}
</script>

<style>
</style>