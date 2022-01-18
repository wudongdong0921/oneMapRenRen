<template>
  <el-form v-loading="loading" ref="form" :model="dataForm" :rules="rules">
    <div style="text-align: right;margin-bottom: 20px;">
      <span style="margin-right: 20px;">全部显示</span>
      <el-switch style="user-select:none;" :width="55" v-model="switchFlag" :active-text='switchActiveText' @change='monitorFlag' active-color="#13ce66"></el-switch>
    </div>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column prop="prop" label="序号" width="width"></el-table-column>
      <el-table-column prop="prop" label="字段名" width="width"></el-table-column>
      <el-table-column prop="prop" label="字段中文名" width="width"></el-table-column>
      <el-table-column prop="prop" label="是否显示" width="width">
        <template slot-scope="scope">
          <div>
            {{scope.row}}
            <el-checkbox v-model="ifShow" ></el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="排序值" width="width"></el-table-column>
    </el-table>
    <el-form-item>
      <div style="text-align: right;margin-top: 20px;">
        <el-button style="margin-right: 20px;" @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import apis from "./apis";

export default {
  //import引入的组件
  components: {},
  data() {
    return {
      loading: false,
      dataForm: {
      },
      rules: {},
      tableData: [],
      switchFlag: true,
      switchActiveText: 'NO',
      ifShow: false
    };
  },
  //方法集合
  methods: {
    monitorFlag(e){
      if(e) this.switchActiveText = 'NO'
      else if(!e) this.switchActiveText = 'OFF'
    },
    submit(){

    },
    close(){
      this.$emit('closeDailog')
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    //this.getdataSourceList();
  },
};
</script>

<style lang='scss' scoped>
/deep/ .el-switch {
    position: relative;
    height: 24px;
    line-height: 24px;
    &.is-checked {
      .el-switch__core {
        background: #179bff;
        &:after {
          margin-left: -22px;
        }
      }
    }
    .el-switch__label,
    .el-switch__core {
      height: 24px;
    }
    .el-switch__core {
      border-radius: 12px;
      border: none;
      background: #f1f1f1;
      &:after {
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
        width: 22px;
        height: 22px;
      }
    }
    .el-switch__label.is-active {
      color: #333;
    }
    .el-switch__label--right {
      margin-left: 0px;
      &.is-active {
        color: #fff;
        right: 30px;
      }
      position: absolute;
      right: 5px;
      color: #999;
      > span {
        font-size: 12px;
      }
    }
  }
  .carousel-time{
    position: absolute;
    left: 15%;
    top: 0;
  }
</style>
