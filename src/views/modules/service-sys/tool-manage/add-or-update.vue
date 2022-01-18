<template>
    <el-dialog :visible.sync="visible" title="流程信息" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="dataForm" label-width="100px">
            <el-form-item label="当前类型" prop="categoryLabel">
                <el-input v-model="dataForm.categoryLabel" disabled></el-input>
            </el-form-item>
            <el-form-item label="工具名称" prop="toolName">
                <el-input v-model="dataForm.toolName" placeholder="请输入工具名称"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="dataForm.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="上传文件">
              <el-upload
                  class="upload-demo"
                  :action="uploadAction"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label-width="0" style="text-align: center;">
                <el-button type="primary" @click="saveData()">确定</el-button>
                <el-button @click="visible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

import apis from "./apis";

export default {
    data() {
        return {
            dataForm: {
                id: '',
                toolName: '',
                currentCategory: '',
                categoryLabel: '',
                uploadFileId: '',
                sort: '',
            },
            visible: false,
            fileList: [],
            menuListVisible: false,
            defaultExpandedKeys: [0],
            uploadAction: window.SITE_CONFIG['apiURL']+window.SITE_CONFIG['targetPath']['security']+'/liberalsApi/sysAttachment/upload'
        }
    },
    methods: {
        init(id,category) {
            this.fileList = [];
            this.visible = true;
            this.$nextTick(() => {
                this.dataForm = {
                  id: '',
                  toolName: '',
                  currentCategory: '',
                  categoryLabel: '',
                  uploadFileId: '',
                  sort: '',
                };
                this.dataForm.id = '';
                this.dataForm.currentCategory = category.value;
                this.dataForm.categoryLabel = category.label;

                if(id){
                  this.getInfoData(id,category);
                }

            })
        },
        getInfoData(id,category){
          apis.queryToolById(id).then((res) => {
            this.dataForm = res.data;
            this.dataForm.categoryLabel = category.label;
            //附件回显
            if(res.data.sysAttachmentEntity && res.data.sysAttachmentEntity.fileId != null){
              this.fileList = [{
                name: res.data.sysAttachmentEntity.resourceName,
                url: window.SITE_CONFIG['apiURL']+window.SITE_CONFIG['targetPath']['security'] + res.data.sysAttachmentEntity.fileViewPath
              }];
            }
          });
        },
        saveData(){
          apis.saveTool(this.dataForm).then((res) => {
            if(res.code == 200){
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              this.visible = false;
              this.$emit('refreshDataList')
            }
          });
        },
        handleSuccess(response, file, fileList){
          if(response.code == 200){
            this.dataForm.uploadFileId = response.data[0].fileId;
          }
        },
        handleRemove(file, fileList) {
          this.dataForm.uploadFileId = '';
        },
        handlePreview(file) {
          console.log(file);
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
          this.$confirm(`确定移除 ${ file.name }？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error",
          }).then(() => {

          })
        }
    }
}
</script>
