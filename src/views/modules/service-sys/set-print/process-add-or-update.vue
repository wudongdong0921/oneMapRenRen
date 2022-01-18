<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="dataForm" :rules="rules" label-width="100px">
            <el-form-item label="表单类型" prop="formTypeId">
                <el-select v-model="dataForm.formTypeId" style="width: 100%" @change="changeForm">
                    <el-option v-for="formtype in formTypeList" :key="formtype.id" :label="formtype.name" :value="formtype.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="表单名称" prop="formName">
                <el-select v-model="dataForm.formName" style="width: 100%">
                    <el-option v-for="form in formList" :key="form.id" :label="form.name" :value="form.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模板名称" prop="printTemplateName">
                <el-input v-model="dataForm.printTemplateName" placeholder="请输入模板名称"></el-input>
            </el-form-item>

            <el-form-item label="上传文件">
                <el-upload
                    class="upload-demo"
                    :action="uploadAction"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :on-success="handleSuccess"
                    multiple
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item label="视图" prop="view">
                <el-select v-model="dataForm.view" style="width: 100%">
                    <el-option v-for="item in viewList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label-width="0" style="text-align: center;">
                <el-button type="primary" @click="dataFormSubmitHandle">确定</el-button>
                <el-button @click="visible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import axiosEvent from '@/utils/axiosevent'

export default {
    data() {
        return {
            visible: false,
            formTypeList: [],
            formList: [],
            viewList: [],
            dataForm: {
                id: null,
                formTypeId: null,
                formName: null,
                printTemplateName: null,
                templateFileId: null,
                view: null,
            },

            fileList: [],
            rules: {},
            uploadAction: window.SITE_CONFIG['apiURL']+window.SITE_CONFIG['targetPath']['security']+'/liberalsApi/sysAttachment/upload'
        }
    },
    methods: {
        handleSuccess(response, file, fileList){
          if(response.code == 200){
            this.dataForm.templateFileId = response.data[0].fileId;
          }
        },

        init() {
            this.fileList = [];
            this.formList = [];
            this.formTypeList = [];
            this.viewList = [];
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['form'].resetFields()
                Promise.all([
                    this.getTdHorizonGroupAll(),
                    this.getViewAll()
                ]).then(() => {
                    if (this.dataForm.id) {
                        this.selectPrintTemplateConfigById()
                    }
                })
            })
        },

        // 查询详情
        selectPrintTemplateConfigById() {
            axiosEvent({
                type: 'post',
                url: '/PrintTemplateConfig/selectPrintTemplateConfigById',
                target: 'business',
                params: {
                    id: this.dataForm.id
                },
            }).then((res) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.dataForm = res.data;
                this.getTdHorizonPageBypageGroup(res.data.formTypeId);
                //附件回显
                if(res.data.sysAttachmentEntity && res.data.sysAttachmentEntity.fileId != null){
                  this.fileList = [{
                    name: res.data.sysAttachmentEntity.resourceName,
                    url: window.SITE_CONFIG['apiURL']+window.SITE_CONFIG['targetPath']['security'] + res.data.sysAttachmentEntity.fileViewPath
                  }];
                }

            }).catch(() => {
            })
        },

        // 查询表单类型信息
        getTdHorizonGroupAll() {
            axiosEvent({
                type: 'post',
                url: '/PrintTemplateConfig/getTdHorizonGroupAll',
                target: 'business'
            }).then((res) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.formTypeList = res.data;
            }).catch(() => {
            })
        },

        // 表单类型进行修改时对表单名称进行联动更改
        changeForm() {
            this.dataForm.formName = "";
            this.formList = [];
            console.log(this.dataForm.formTypeId)
            this.getTdHorizonPageBypageGroup(this.dataForm.formTypeId);
        },

        // 查询表单名称
        getTdHorizonPageBypageGroup(id) {
            axiosEvent({
                type: 'post',
                url: '/PrintTemplateConfig/getTdHorizonPageBypageGroup',
                params: {
                  pageGroup: id,
                  templateFormName: this.dataForm.formName
                },
                target: 'business'
            }).then((res) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.formList = res.data;
            }).catch(() => {
            })
        },

        // 获取视图
        getViewAll() {
            axiosEvent({
                type: 'post',
                url: '/PrintTemplateConfig/getViewAll',
                target: 'business'
            }).then((res) => {
                if (res.code !== 200) {
                    return this.$message.error(res.msg)
                }
                this.viewList = res.data;
            }).catch(() => {
            })
        },

        // 保存
        dataFormSubmitHandle () {
            this.$refs["form"].validate((valid) => {
                if (!valid) {
                    return false
                }

                axiosEvent({
                    type: 'post',
                    url: '/PrintTemplateConfig/savePrintTemplateConfig',
                    data: this.dataForm,
                    target: 'business'
                }).then((res) => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg)
                    }
                    this.$message({
                        message: this.$t('prompt.success'),
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            this.visible = false
                            this.$emit('refreshDataList')
                        }
                    })
                }).catch(() => {})

            })
        },

        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.dataForm.templateFileId = '';
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        }
    }
}
</script>
