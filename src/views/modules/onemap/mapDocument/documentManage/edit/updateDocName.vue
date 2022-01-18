<template>
  <el-form :model="formData" ref="elForm" label-width="100px" :rules="rules">
    <el-form-item label="名称" prop="fileRealName">
      <el-input
        v-model="formData.fileRealName"
        maxlength="20"
        show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number :min="0" v-model="formData.sort"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit" style="float: right"
        >确定</el-button
      >
      <el-button @click="clickClose" style="float: right; margin-right: 10px"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        id: null,
        fileRealName: null,
        sort: 0,
      },

      rules: {
        fileRealName: [
          {
            required: true,
            message: "请填写文件名",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  mounted() {
    this.$api = this.$API.get(["onemap:mapDocument"]);
  },
  methods: {
    init(data) {
      this.formData.id = data.id;
      this.formData.fileRealName = data.fileRealName.split(".")[0];
      this.formData.sort = data.sort;
    },

    submit() {
      this.$api.updateFile(
        this.formData,
        (res) => {
          console.log(res);
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.$emit("clickClose");
        },
        (err) => {
          this.$message({
            message: "修改失败",
            type: "error",
          });
        }
      );
    },

    // 关闭弹窗
    clickClose() {
      this.$emit("clickClose");
    },
  },
};
</script>
