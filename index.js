import ElFormModel from './packages/ElFormModel'
import ElTableModel from './packages/ElTableModel'
import ElUploadFileModel from './packages/ElUploadFileModel'
import ElArticleModel from '@/components/ElModel/packages/ElArticleModel'

const ElModel = {
  install: function (Vue) {
    Vue.component('ElFormModel', ElFormModel)
    Vue.component('ElTableModel', ElTableModel)
    Vue.component('ElUploadFileModel', ElUploadFileModel)
    Vue.component('ElArticleModel', ElArticleModel)
  }
}

export default ElModel
