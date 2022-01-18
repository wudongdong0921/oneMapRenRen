<template>
  <el-form v-loading="loading" ref="from" :model="dataForm" :rules="rules">
    <el-form-item label="流程分类" label-width="100px" prop="lclxId">
        <el-select style="width: 100%;" v-model="dataForm.lclxId" @change="lclxIdChange" placeholder="请选择">
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="包含流程" label-width="100px">
        <el-input v-model="includeProcess" disabled></el-input>
    </el-form-item>

    <el-form-item label="专题地图" label-width="100px">
      <el-select v-model="dataForm.specialMap" placeholder="请选择" style="width:100%;"> <!-- @change="specialMapChange" -->
        <el-option
          v-for="(item,index) in mapAddressList"
          :key="index"
          :label="item.mapName"
          :value="item.mapId">
        </el-option>
      </el-select>
    </el-form-item>

    <div style="display: flex;">
      <el-form-item label="数据库地址" label-width="100px" prop="databaseAddress">
          <el-input v-model="dataForm.databaseAddress" placeholder="数据库地址" style="width: 600px;"></el-input>
      </el-form-item>
      <el-form-item label="端口号" label-width="100px" prop="portNumber">
          <el-input v-model="dataForm.portNumber" placeholder="端口号"></el-input>
      </el-form-item>
    </div>
    <el-form-item label="数据库类型" label-width="100px" prop="sjklxId">
      <el-select v-model="dataForm.sjklxId" placeholder="请选择" style="width: 100%;">
        <el-option label='ORACLE' value="ORACLE"></el-option>
        <el-option label='MONGODB' value="MONGODB"></el-option>
        <el-option label='POSTGRE' value="POSTGRE"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据库名" label-width="100px" prop="databaseName">
      <el-input v-model="dataForm.databaseName" placeholder="数据库名"></el-input>
    </el-form-item>
    <el-form-item label="用户名" label-width="100px" prop="username">
        <el-input type="text" v-model="dataForm.username" placeholder="数据库账号"></el-input>
    </el-form-item>
    <el-form-item label="密码" label-width="100px" prop="password">
        <el-input type="password" v-model="dataForm.password" placeholder="数据库密码"></el-input>
    </el-form-item>
    <div style="display: flex;">
     <el-form-item label="存储数据表" label-width="100px" prop="storageDt">
        <el-select style="width: 650px; margin-right: 50px;" v-model="dataForm.storageDt" placeholder="点击右侧加载数据表获取选项">
          <el-option
            v-for="(item,index) in dataSheetOptions"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-button @click="loadData" type="primary">加载数据表</el-button>
      </el-form-item>
    </div>
    <el-form-item style="text-align:right; margin:0; margin-top: 50px;">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="verification">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import apis from './apis'

export default {
  props: {
    options: Array
  },
  data() {
    return {
      loading:false,
      dataForm: {
        "lclxId":"",
        "sjklxId":"",
        "specialMap": "", //专题地图
        "databaseAddress":"", // 数据库地址
        "portNumber":"", // 端口号
        "databaseName":"", //数据库名
        "username":"",  // 用户名
        "password":"",  // 密码
        "storageDt":""  //存储数据表
      },
      rules:{
        lclxId: {required: true, message:'必填项不能为空', trigger: 'blur'},
        databaseAddress: {required: true, message:'必填项不能为空', trigger: 'blur'},
        sjklxId: {required: true, message:'必填项不能为空', trigger: 'blur'},
        portNumber: {required: true, message:'必填项不能为空', trigger: 'blur'},
        databaseName: {required: true, message:'必填项不能为空', trigger: 'blur'},
        username: {required: true, message:'必填项不能为空', trigger: 'blur'},
        password: {required: true, message:'必填项不能为空', trigger: 'blur'},
        storageDt: {required: true, message:'必填项不能为空', trigger: 'blur'},
      },
      dataSheetOptions: [],
      includeProcess: '',
      mapAddressList: []
    };
  },
  mounted() {
  },
  methods: {
    // 提交
    verification(){},
    //点击取消
    close(){
      this.$emit('dialogClose')
    },
    //接收指定行数据
    rowData(data){
      this.dataForm = data
      delete this.dataForm.createUser
      this.dataForm.updateUser = this.$store.state.user.name
      this.includeProcess = this.dataForm.lcmcs
    },
    init(){
      delete this.dataForm.updateUser
      this.dataForm.createUser = this.$store.state.user.name
    },
    loadData(){},
    lclxIdChange(e) {}
  }
}
</script>