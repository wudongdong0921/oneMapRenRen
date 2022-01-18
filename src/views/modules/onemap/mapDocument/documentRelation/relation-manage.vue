<template>
  <div>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      class="filter-tree"
      :data="data"
      show-checkbox
      node-key="id"
      ref="treeRef"
      :props="defaultProps"
    >
    </el-tree>
    <div class="button">
      <el-button @click="clickClose">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      selectArray: [],
      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      newList: {},
    };
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    },
  },
  methods: {
    // 初始化，读取穿梭框里的数据
    init(option) {
      this.mapId = option.mapId;
      this.$api.getFileTree(
        {
          mapId: option.mapId,
        },
        (res) => {
          this.selectArray = res.checkedNode;
          this.data = res.treeData;
          this.$nextTick(() => {
            this.selectArray.forEach((value) => {
              this.$refs.treeRef.setChecked(value, true, false);
            });
          });
        }
      );
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 取消
    clickClose() {
      this.$emit("clickClose");
    },
    save() {
      this.$api.saveMapFile(
        {
          mapId: this.mapId,
          fileList: this.$refs.treeRef.getCheckedKeys(),
        },
        (res) => {
          if (res == null) {
            this.$message({
              message: "关联成功",
              type: "success",
            });
          }
          this.$emit("clickClose");
        }
      );
    },
  },
  mounted() {
    this.$api = this.$API.get(["onemap:mapDocument"]);
    // this.init()
  },
};
</script>

<style>
/* @import url("//unpkg.com/element-ui@2.15.5/lib/theme-chalk/index.css"); */
.el-transfer-panel__item.el-checkbox .el-checkbox__label {
  margin-right: 30px;
}
.button {
  margin-top: 40px;
  width: 100%;
  text-align: center;
}
.filter-tree {
  margin-top: 20px;
}
.el-tree-node__content > .el-checkbox {
  margin-right: 8px !important;
}
</style>