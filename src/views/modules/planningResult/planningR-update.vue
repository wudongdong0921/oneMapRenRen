<template>
  <el-form ref="form" :model="dataForm" :rules="rules" v-loading="loading">
    <el-form-item label="规划成果名称:" label-width="120px" prop="planResultName">
      <el-input maxlength="33" show-word-limit v-model="dataForm.planResultName" clearable></el-input>
    </el-form-item>
    <el-form-item label="排序:" label-width="120px" prop="sort">
      <el-input-number v-model="dataForm.sort" controls-position="right" :min="0"></el-input-number>
    </el-form-item>

    <el-form-item label="备注" label-width="120px" prop="remark">
      <el-input maxlength="166" show-word-limit type="textarea" v-model="dataForm.remark" clearable></el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button type="primary" @click="submit()" style="float:right;">确定</el-button>
      <el-button @click="closeEvent" style="float:right;margin-right:10px">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import apis from "./apis";
export default {
  //import引入的组件
  components: {},
  props: ["type"],
  data() {
    return {
      dataForm: {
        ghcglxId: "",
        planResultName: "",
        sort: 0,
        remark: "",
      },
      rules: {
        planResultName: [
          {
            required: true,
            message: "请填写规划成果名称",
            trigger: "blur",
          },
        ],
      },
      loading: false,
    };
  },
  //方法集合
  methods: {
    initData(data) {
      this.loading = true;
      apis.getPlanResultInfo(data.ghcglxId).then((res) => {
        this.loading = false;
        this.dataForm = res.data;
      });
    },
    submit() {
        this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.dataForm.ghcglxId != "") {
                apis
                .updateRramsPlanResultType({
                    ghcglxId: this.dataForm.ghcglxId,
                    planResultName: this.dataForm.planResultName,
                    remark: this.dataForm.remark,
                    sort: this.dataForm.sort,
                })
                .then((res) => {
                    this.$message({
                    message: "修改成功",
                    type: "success",
                    });
                    this.closeEvent();
                });
            } else {
                apis
                .addRramsPlanResultType({
                    planResultName: this.dataForm.planResultName,
                    remark: this.dataForm.remark,
                    sort: this.dataForm.sort,
                })
                .then((res) => {
                    this.$message({
                    message: "添加成功",
                    type: "success",
                    });
                    this.closeEvent();
                });
            }
        }
      });

      
    },
    closeEvent() {
      this.$emit("closeE");
    },
  },

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>

<style >
</style>
