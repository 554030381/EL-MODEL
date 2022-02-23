<template>
  <div class="upload-file">
    <div style="margin: 0 0 50px 50px">
      <div style="font-weight: bold; margin-bottom: 20px">已上传附件</div>
      <div
        v-if="fileArr.length == 0"
        style="color: rgb(144, 147, 153); text-align: center"
      >
        暂无附件
      </div>
      <el-table
        v-else
        :key="tableKey"
        v-loading="listLoading"
        :data="fileArr"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="ID" prop="ID" align="center" width="80">
          <template slot-scope="{ row }">
            <span>{{ row['id'] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文件名"
          prop="文件名"
          align="center"
          min-width="200"
        >
          <template slot-scope="{ row }">
            <span>{{ row['file_name'] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文件大小"
          prop="文件大小"
          align="center"
          width="120"
        >
          <template slot-scope="{ row }">
            <span>{{ row['file_size'] }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="downloadFile(row)">
              下载
            </el-button>
            <el-button size="mini" type="danger" @click="handleDeleteFile(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.page_size"
        @pagination="getPageInfo"
      />
    </div>
    <div>
      <div style="font-weight: bold; margin-left: 50px">上传附件区</div>
      <el-upload
        ref="upload"
        class="upload-demo"
        :file-list="uploadFileArr"
        drag
        :show-file-list="false"
        style="margin: 10px 0 30px 50px"
        action=""
        :http-request="uploadFile"
        multiple
        :on-change="fileOnChange"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处上传，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div
        v-for="(item, index) of uploadFileArr"
        :key="index"
        style="margin: 0 0 20px 50px"
      >
        <div style="display: inline-block; width: 30%">{{ item.name }}</div>
        <el-progress
          :percentage="fileOnProgressList[index]"
          :status="fileOnProgressList[index] == 100 ? 'success' : null"
          :stroke-width="parseInt(8)"
          style="display: inline-block; width: 60%; vertical-align: top"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ElUploadFileModel',
  components: { Pagination },
  props: {
    id: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: '文件上传'
    },
    fetchFile: {
      type: Function,
      default: () => {}
    },
    createFile: {
      type: Function,
      default: () => {}
    },
    readFile: {
      type: Function,
      default: () => {}
    },
    deleteFile: {
      type: Function,
      default: () => {}
    }
  }, // eslint-disable-line
  data() {
    return {
      fileArr: [],
      uploadFileArr: [],
      tableKey: 1,
      listLoading: false,
      fileOnProgressList: [],
      total: 0,
      listQuery: {
        page: 1,
        page_size: 10
      },
      bool: {
        t: true,
        f: false
      }
    }
  },
  watch: {
    id: () => {
      this.getFileArr()
    }
  },
  methods: {
    getFileArr() {
      this.listLoading = true
      this.fileArr = []
      const uploadData = {
        relocation_plan_id: this.id,
        page: this.listQuery.page,
        page_size: this.listQuery.page_size // 获取所有文件
      }
      this.fetchFile(uploadData).then((response) => {
        this.total = response.count
        this.fileArr = []
        const data = response.results
        data.forEach((currentValue) => {
          const obj = {}
          obj['file_name'] = currentValue.file_name
          obj['file_size'] = this.handleFileSize(currentValue.file_size)
          obj['id'] = currentValue.id
          this.fileArr.push(obj)
        })
        this.tableKey++
        this.listLoading = false
      })
    },
    getPageInfo(pageInfo) {
      // window.console.log(pageInfo)
      this.listQuery.page = pageInfo.page
      this.listQuery.page_size = pageInfo.limit
      this.getFileArr()
    },
    fileOnChange(file, fileList) {
      this.uploadFileArr = fileList
    },
    uploadFile(file) {
      this.fileOnProgressList = []
      const id = this.id
      this.$confirm(
        '会直接上传附件, 是否确定？上传时请勿进行任何操作，否则可能导致上传失败，请耐心等待',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        // eslint-disable-next-line
        .then(async () => {
          let i = 0
          // window.console.log(this.uploadFileArr)
          for (const currentFile of this.uploadFileArr) {
            // window.console.log(currentFile)
            const fd = new FormData()
            fd.append('relocation_plan_id', id)
            fd.append('file', currentFile.raw)
            const res = await this.createFile(fd, this, i)
            const obj = {}
            obj['file_name'] = res.file_name
            obj['file_size'] = this.handleFileSize(res.file_size)
            obj['id'] = res.id
            this.fileArr.unshift(obj)
            this.tableKey++
            i++
            this.total++
            this.$notify({
              title: '成功',
              message: res.file_name + '上传成功',
              type: 'success',
              duration: 2000
            })
          }
          this.uploadFileArr = []
        })
        .catch(() => {
          this.$refs['upload'].clearFiles()
          this.uploadFileArr = []
        })
    },
    downloadFile(row) {
      const id = row['id']
      const relocation_plan_id = this.id
      this.readFile(relocation_plan_id, id).then((response) => {
        // window.console.log(response)
        const url = response.file
        const filename = response.file_name
        const a = document.createElement('a')
        a.target = '_blank'
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    handleDeleteFile(row) {
      const id = row['id']
      const relocation_plan_id = this.id
      const filename = row['file_name']
      this.$confirm('是否确定删除' + filename + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteFile(relocation_plan_id, id).then((response) => {
            this.$notify({
              title: '成功',
              message: '删除' + filename + '成功',
              type: 'success',
              duration: 2000
            })
            this.getFileArr()
          })
        })
        .catch(() => {})
    },
    handleFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1000 // or 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    }
  }
}
</script>
