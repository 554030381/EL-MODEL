<script>
import { defaultFormType } from './data'
import { hasProp, filterObj } from '../../lib/utils/object'

import ElUploadFileModel from '../ElUploadFileModel/index'

export default {
  name: 'ElFormModel',
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    // 相关字段
    formList: {
      type: Array,
      default: () => []
    },
    formStyle: {
      type: String,
      default: 'column'
    },
    formLoading: {
      type: Boolean,
      default: false
    },
    refObj: {
      type: Object,
      default: () => ({})
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    disableSlotDefaultStyle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model2formList: {}
    }
  },
  watch: {
    model: {
      handler() {
        // 将form实例返回到父级
        this.$emit('update:refObj', this.$refs.form)
      },
      deep: true // 深度监听
    },
    formList: {
      handler() {
        // 绑定初值
        this.bindInitValue()
      },
      deep: true // 深度监听
    }
  },
  created() {
    // 绑定初值
    this.rebind()
  },
  mounted() {
    // 将form实例返回到父级
    this.$emit('update:refObj', this.$refs.form)
  },
  methods: {
    // 绑定初值
    bindInitValue() {
      this.formList.forEach((item) => {
        if (item.verbose) {
          this.$set(this.model, item.verbose, item.value)
        }
      })
    },
    rebind() {
      this.formList.forEach((item, idx) => {
        this.model2formList[item.verbose] = idx
      })
    },
    // 获取字段列表
    getConfigList() {
      return this.formList.filter(
        (item) => !hasProp(item, 'show') || (hasProp(item, 'show') && item.show)
      )
    },
    // 得到placeholder的显示
    getPlaceholder(item) {
      let placeholder
      if (
        item?.attrs?.placeholder === false ||
        item?.attrs?.placeholder === ''
      ) {
        return
      }
      if (item.type === 'input' || item.type === 'count') {
        placeholder = '请输入' + item.label
      } else if (item.type === 'select' || item.type === 'date') {
        placeholder = '请选择' + item.label
      } else {
        placeholder = item.label
      }
      return placeholder
    }
  },
  render(h) {
    const self = this
    const formStyle = self.formStyle || 'column'
    let divForm

    // el-form-item
    const elFormItems = self.getConfigList().map((item, idx) => {
      let elFormItemEl, elUploadImgEl

      // attrs: { readonly = true }
      if (item?.readonly) {
        elFormItemEl = <div class='el-form-model-item'>{item.value}</div>
      } else if (item.type === 'slot') {
        // slot
        const slotEl = self.$slots[item.slotName]
        elFormItemEl = (
          <div class={self.disableSlotDefaultStyle ? '' : 'el-form-model-item'}>
            {slotEl}
          </div>
        )
      } else if (item.type === 'tag') {
        // el-tag
        elFormItemEl = h(
          'div',
          {
            class: {
              'el-form-model-item': true
            }
          },
          item?.tagList
            ? item.tagList.map((tag, idx) => {
                return h(
                  'el-tag',
                  {
                    key: idx,
                    style: { ...item.style },
                    props: { ...item.attrs, ...tag.attrs },
                    on: { ...item.fns, ...tag.fns }
                  },
                  [tag.label]
                )
              })
            : []
        )
      } else if (item.type === 'uploadFile') {
        const listeners = {
          'update:visible': (val) => {
            item.attrs.visible = val
          }
        }

        elFormItemEl = (
          <div class='el-form-model-item'>
            <el-button
              v-waves
              type='primary'
              onClick={() => {
                item.attrs.visible = true
              }}
            >
              <i class='el-icon-upload' />
              {item.label}
            </el-button>
            <el-dialog
              close-on-click-modal={false}
              {...{ on: Object.assign(listeners, item.fns), props: item.attrs }}
            >
              <ElUploadFileModel
                {...{
                  on: item.uploadFileOptions.fns,
                  props: item.uploadFileOptions.attrs
                }}
              />
            </el-dialog>
          </div>
        )
      } else {
        const elFormItemType = defaultFormType[item.type] || item.type

        // el-option
        const elOption = item?.optionList
          ? item.optionList.map((option, idx) => {
              return (
                <el-option
                  key={idx}
                  label={option?.label}
                  value={option?.value}
                ></el-option>
              )
            })
          : []

        if (item?.imgUrl && item.type === 'uploadImg') {
          elUploadImgEl = <img src={item.imgUrl} style='border-radius: 6px' />
        } else if (item.type === 'uploadImg') {
          elUploadImgEl = <i class='el-icon-plus avatar-uploader-icon'></i>
        }

        // el-form-item内部元素
        elFormItemEl = h(
          elFormItemType,
          {
            key: idx,
            style: {
              ...item.style
            },
            attrs: {
              placeholder: item?.attrs?.placeholder
                ? item.attrs.placeholder
                : self.getPlaceholder(item)
            },
            props: {
              ...item.attrs,
              value: self.model[item.verbose],
              clearable: item?.attrs?.clearable || true,
              filterable: item?.attrs?.filterable || true
            },
            on: {
              input: function (event) {
                self.$set(self.model, item.verbose, event)
                self.$set(
                  self.formList[self.model2formList[item.verbose]],
                  'value',
                  event
                )
              },
              change:
                item.fns?.change ||
                function () {
                  if (item.eventChange) {
                    self.$emit('handleEvents', item.eventChange)
                  }
                },
              focus:
                item.fns?.focus ||
                function () {
                  if (item.eventFocus) {
                    self.$emit('handleEvents', item.eventFocus)
                  }
                },
              ...filterObj(item.fns, ['change', 'focus'])
            }
          },
          elOption.concat(elUploadImgEl)
        )
      }

      return h(
        'el-form-item',
        {
          key: idx,
          attrs: {
            label: self.showLabel ? item.label : null
          },
          props: {
            required: item.required,
            rules:
              item.rules === true && item.required === true
                ? {
                    required: true,
                    message:
                      (['select', 'date'].includes(item.type)
                        ? '请选择'
                        : '请输入') + item.label,
                    trigger: ['blur', 'change']
                  }
                : item.rules,
            prop: item.verbose
          }
        },
        [elFormItemEl]
      )
    })

    // el-form
    const elForm = h(
      'el-form',
      {
        class: {
          'el-form-model-row': formStyle === 'row',
          'el-form-model-column': formStyle === 'column',
          'el-form-model-center': formStyle === 'center'
        },
        props: {
          ...self.$attrs,
          model: self.model,
          labelWidth:
            formStyle === 'center' && !self.$attrs['label-width']
              ? 'auto'
              : self.$attrs['label-width'] || '120px'
        },
        on: {
          ...this.$listeners
        },
        ref: 'form'
      },
      elFormItems
    )

    if (self.formList && self.formList.length) {
      divForm = <div v-loading={self.formLoading}>{elForm}</div>
    }

    return divForm
  }
}
</script>

<style lang="scss" scoped>
// 自定义form相关
.el-form-model-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .el-form-item {
    display: block;
    width: inherit;
    .el-form-item__content {
      .el-form-model-item,
      .el-input,
      .el-select,
      .el-textarea {
        width: 200px;
      }
      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
      .el-tag:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}

.el-form-model-column {
  .el-form-item {
    display: block;
    .el-form-item__content {
      .el-form-model-item,
      .el-input,
      .el-select,
      .el-textarea {
        width: 70%;
        max-width: 300px;
      }
      .el-input-number {
        .el-input {
          width: inherit;
        }
      }
      .el-tag:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}

.el-form-model-center {
  .el-form-item {
    display: block;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    .el-form-item__content {
      .el-form-model-item,
      .el-input,
      .el-select,
      .el-textarea,
      .el-input-number {
        width: 250px;
      }
      .el-tag:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}

::v-deep .el-upload {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border-radius: 6px;
  transition: 0.2s;

  &:hover {
    border: 1px dashed #409eff;
  }
}
</style>
