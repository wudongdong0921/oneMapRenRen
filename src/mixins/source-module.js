import qs from 'qs'
export default {
  data() {
    return {
      addOrUpdateVisible: false,
      modifyVisible: false,
      dataList: [],
      dataForm: {},
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0,
      loading: true,
      dataListSelections: []
    }
  },
  created() {
    this.$apis = this.$API.get(['commons:mixinsModule']);
    if (this.mixinViewModuleOptions.treeBool) {
      this.query()
    }
  },
  methods: {
    query() {
      this.loading = false

      this.dataListLoading = true
      let obj = {
        page: this.page,
        limit: this.limit,
        ...this.dataForm
      }
      const params = qs.stringify(obj)
      let sendData = {
        method: this.mixinViewModuleOptions.method,
        url: this.mixinViewModuleOptions.getDataListURL,
        data: params,
      }
      this.$apis.sourceModule(sendData, (res) => {
        this.dataListLoading = false
        if (res.code !== 200) {
          this.dataList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        this.dataList = res.data=="未查询到数据"?[]:res.data
        this.total = this.mixinViewModuleOptions.getDataListIsPage ? +res.data.total : 0
      }, (err) => {
        this.dataListLoading = false
      })

    },
    getDataList: function () {
      this.page = 1
      this.dataForm.pageNum = 1
      this.mixinViewModuleOptions.getDataListIsPage = true
      this.query()
    },
    // 新增，修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        //console.log(this.$refs.addOrUpdate)
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      var ywfxIds = ''
      for (let i = 0; i < val.length; i++) {
        // console.log(99)
        // console.log(val[i].ywfxId)
        ywfxIds += val[i].ywfxId + ','
      }
      this.dataListSelections = ywfxIds
    },
    // 修改
    modifyLayer(id) {
      this.modifyVisible = true
      this.$nextTick(() => {
        // console.log(id)
        this.$refs.modifyUpdate.dataForm.sjyId = id
        this.$refs.modifyUpdate.init()
      })
    },
    // 删除
    deleteHandle(id) {
      if (!id) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        let sendData = {
          method: 'post',
          url: this.mixinViewModuleOptions.deleteURL,
          data: {
            sjyId: id
          },
        }
        this.$apis.sourceModule(sendData, (res) => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.query()
            }
          })
        }, (err) => {
          
        })

      })
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1
      this.dataForm.pageNum = 1
      this.limit = val
      this.dataForm.pageSize = val
      this.query()
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val
      this.dataForm.pageNum = val
      this.query()
    }
  }
}
