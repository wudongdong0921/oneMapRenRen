<template>
    <div>
        <el-form :model="formData" ref="elForm" label-width="100px" :rules="rules">
            <el-form-item label="名称" prop="dicName">
                <el-input v-model="formData.dicName" placeholder="请填写文档名称" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number :min="0" v-model="formData.sort"></el-input-number>
            </el-form-item>
            <el-form-item prop="dicIcon" label="图标" class="icon-list">
                <el-popover v-model="iconListVisible" ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-sys__menu-icon-popover">
                    <div class="mod-sys__menu-icon-inner">
                        <div class="mod-sys__menu-icon-list">
                            <el-button v-for="(item, index) in iconList" :key="index" @click="iconListCurrentChangeHandle(item)" :class="{ 'is-active': formData.dicIcon === item }">
                                <svg class="icon-svg" aria-hidden="true">
                                    <use :xlink:href="`#${item}`"></use>
                                </svg>
                            </el-button>
                        </div>
                    </div>
                </el-popover>
                <el-input v-model="formData.dicIcon" clearable v-popover:iconListPopover placeholder="请选择图标"></el-input>
            </el-form-item>

            <el-form-item label="背景颜色" prop="dicColor">
                <el-color-picker v-model="formData.dicColor"></el-color-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit" style="float:right;">确定</el-button>
                <el-button @click="clickClose" style="float:right;margin-right:10px">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import api from './apis'
import { getIconList } from '@/utils'
export default {
    data() {
        return {
            iconListVisible: false,
            iconList: [],  // 图标列表
            formData: {
                id: null,
                dicName: '',
                sort: 0,
                dicIcon: "",
                dicColor: ""
            },

            rules: {
                dicName: [{
                    required: true,
                    message: '请填写文档名称',
                    trigger: ["blur", "change"]
                }]
            }
        }
    },
    methods: {
        init(data) {
            this.$refs["elForm"].resetFields();
            this.iconList = getIconList();
            if (data) {
                this.formData.id = data.id
                this.formData.dicName = data.dicName
                this.formData.sort = data.sort
                this.formData.dicIcon = data.dicIcon
                this.formData.dicColor = data.dicColor
            }
        },

        // 图标列表
        iconListCurrentChangeHandle(icon) {
            this.formData.dicIcon = icon
            this.iconListVisible = false
        },

        submit() {
            this.$refs["elForm"].validate((valid) => {
                if (valid) {
                    if (!this.formData.id) {
                        this.$api.addDocument(this.formData, res => {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });

                            this.$emit("clickClose")  
                        })
                    } else {
                        this.$api.updateDocument(this.formData,res => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });

                            this.$emit("clickClose")
                        })
                    }

                }
            })
        },

        // 关闭弹窗
        clickClose() {
            this.$emit("clickClose")
        },
    },
    mounted() {
        this.$api = this.$API.get(['onemap:mapDocument']);
        this.init();
    }
}
</script>

<style lang="scss">
.mod-sys__menu {
    .menu-list,
    .icon-list {
        .el-input__inner,
        .el-input__suffix {
            cursor: pointer;
        }
    }

    &-icon-popover {
        width: 458px;
        overflow: hidden;
    }

    &-icon-inner {
        width: 478px;
        max-height: 258px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    &-icon-list {
        width: 458px;
        padding: 0;
        margin: -8px 0 0 -8px;

        > .el-button {
            padding: 8px;
            margin: 8px 0 0 8px;

            > span {
                display: inline-block;
                vertical-align: middle;
                width: 18px;
                height: 18px;
                font-size: 18px;
            }
        }
    }
}
</style>
