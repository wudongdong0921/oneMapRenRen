<template>
  <div>
    <el-upload
      ref="uploadFile"
      :action="uploadUrl"
      :data="{
        dicId: dicId,
      }"
      accept=".pdf,.jpg,.png"
      :headers="headers"
      :on-remove="handleRemove"
      :on-success="success"
      :on-error="error"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      multiple
    >
      <el-button size="small" type="primary" style="margin-left: 40px"
        >点击上传</el-button
      >
    </el-upload>

    <div style="margin-top: 15px; text-align: center">
      <el-button type="primary" size="small" @click="clickClose"
        >关闭</el-button
      >
    </div>
  </div>
</template>

<script>
import Cookies from "@/utils/storage";
import loginVue from "../../../../../pages/login.vue";

export default {
  data() {
    return {
      dicId: "",
      headers: {
        token: Cookies.get("token"),
      },
      uploadUrl:
        window.SITE_CONFIG["apiURL"] + "/renren-admin" + "/doc.file/upload",
      uploadExtension: 0, // HLJSSJDXT-1055, 提示“上传文件只能是pdf、png、jpg格式”，去除下方多余提示框。
    };
  },
  mounted() {
    this.$api = this.$API.get(["onemap:mapDocument"]);
  },
  methods: {
    init(data) {
      this.dicId = data;
    },
    success(response, file, fileList) {
      if (response.code !== 200) {
        return this.$message({
          type: "error",
          message: "上传失败",
        });
      } else {
        this.$message({
          type: "success",
          message: "上传成功",
        });
      }
    },

    error(err, file, fileList) {
      this.$message({
        type: "error",
        message: "文件上传失败",
      });
    },

    beforeUpload(file) {
      // .pdf,.jpg,.png
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "pdf" || testmsg === "PDF";
      const extension2 = testmsg === "jpg" || testmsg === "JPG";
      const extension3 = testmsg === "png" || testmsg === "PNG";
      if (!extension && !extension2 && !extension3) {
        this.uploadExtension = 1;
        this.$message({
          message: "上传文件只能是pdf、png或jpg格式!",
          type: "warning",
        });
      }
      if (file.name.split(".")[0].length > 20) {
        this.uploadExtension = 1;
        this.$message({
          message: "上传文件名称过长",
          type: "warning",
        });
      }
      return (
        (extension || extension2 || extension3) &&
        file.name.split(".")[0].length <= 20
      );
    },

    // 删除文件
    handleRemove(data) {
      let idArray = [];
      for (let i = 0; i < data.response.data.length; i++) {
        const element = data.response.data[i];
        idArray.push(element.id);
      }
      const ids = idArray;
      this.$api.deleteFile(
        ids,
        (res) => {
          this.$message({ message: "删除成功", type: "success" });
        },
        (err) => {
          this.$message({ message: "删除失败", type: "error" });
        }
      );
    },

    // 删除文件之前
    beforeRemove(file, fileList) {
      if (this.uploadExtension) {
        this.uploadExtension = 0;
        return true;
      } else {
        return this.$confirm(`确定删除 ${file.name}？`);
      }
    },

    // 关闭弹窗
    clickClose() {
      this.$emit("clickClose");
    },
  },
};
</script>

<style>
</style>
