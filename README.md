# EL-MODEL
基于element ui对表单提交的封装el form model，以及基于element ui和el form model对表格的封装el table model

## 目录

- [EL FORM MODEL](#el-form-model)
- [EL TABLE MODEL](#el-table-model)

## 使用
```
// 全局引入
import ElModel from '${ElModel所在目录}'
Vue.use(ElModel)
```

------

## EL FORM MODEL

基于element ui对表单提交的封装，支持所有element ui的组件类型

### el-form-model参数

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| model | 表单数据对象 | object | / | / |
| form-list | 构建表单的相关字段(详见下文) | array | / | / |
| form-loading | 整体表单加载数据时显示的loading | boolean | / | false |
| form-style | 整体表单样式 | string | row（横向排列） / column（纵向排列）/ center（居中排列）  | column |
| ref-obj | 获取整体form表单的ref对象（使用时必须`ref-obj.sync` ！！！） | object | / | / |
| show-label | 是否显示整体表单的label | boolean | / | true |
| disable-slot-default-style | 是否禁用slot的默认样式 | boolean | / | false |
| ... | 支持其他所有el-form的参数 | / | / | / |

<br/>

**EVENT**

| 事件名 | 说明 | 回调参数 |
| ---- | ---- | ---- |
| handleEvents | 获取focus或change事件 | 获取field-list内每个item自定义的eventChange或eventFocus的值 |
| ... | 支持其他所有el-form的事件 | / |

<br/>

**METHOD**
| 事件名 | 说明 | 回调参数 |
| ---- | ---- | ---- |
| rebind | 重新将model内各项的值与formList中相对应verbose的value双向绑定 |

参考
```
<el-form-model
  :model="formData"
  :form-list="formList"
  form-style="row"
  @handleEvents="handleEvents"
></el-form-model>
```

### form-list构建

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| type | 表单类型 | string | 支持所有element ui的组件全名（驼峰法和带中横线的名称都支持），对部分常用类型做了简写，`input = el-input` `count = el-input-number` `select = el-select` `date = el-date-picker` `tag = el-tag` `uploadImg = el-upload` `slot = slot` `uploadFile = uploadFile` | / |
| verbose | 字段名 | string | / | / |
| value | 绑定值，与model内相应属性的值双向绑定，即可定义初值，动态的在form-list构建字段时需调用rebind函数重新实现双向绑定 | string | / | / |
| label | form-item的标题 | string | / | / |
| required | 表单是否是必填内容 | boolean | / | false |
| rules | 表单校验规则（同el-form的rules），当`rules = true && required = true`时，rules的message有默认值 `请输入/请选择 + item.label` | object | / | / |
| eventChange | handleEvents事件的自定义回调内容 | any | / | / |
| eventFocus | handleEvents事件的自定义回调内容 | any | / | / |
| readonly | 表单内容只读，只显示value内容 | boolean | / | false |
| slotName | 具名插槽名 | string | / | / |
| attrs | 支持相对应的element组件的所有属性，其中placeholder有默认值，input和count的placeholder的默认值为：`请输入+label`，select和data的placeholder的默认值为：`请选择+label`，其他placeholder的默认值为：`label`。clearable有默认值为：`true`。filterable有默认值为：`true`。在type = uploadFile时attrs对应el-dialog中所有的属性 | object | / | / |
| fns | 支持相对应的element组件的所有事件，可覆盖handleEvents对应的focus和change事件。在type = uploadFile时fns对应el-dialog中所有的方法 | object | / | / |
| style | 支持相对应的element组件的样式修改 | object | / | / |
| optionList | 当type = select时，el-select的选项内容，`[{ label: 'label', value: 'value' }]`，value和label与el-option一致 | array | / | / |
| tagList | 当type = tag时，el-tag的内容，`[{ label: 'label', attrs: { ... }, fns: { ... } }]`，label为tag内显示内容，attrs内可填el-tag的全部属性，fns内可填写el-tag的全部事件，可对单个el-tag的属性和事件进行控制。el-tag的属性和方法也可由外部的attrs和fns进行控制，属于整体控制。单个控制的优先级高于整体控制 | array | / | / |
| uploadFileOptions | 当type = uploadFile时，`{ attrs: { ... }, fns: { ... } }`，attrs对应el-dialog内部上传组件的属性，fns对应el-dialog内部上传组件的方法 | object | / | / |
| imageUrl | 当type = uploadImg时显示的图片路径 | string | / | / |

参考
```
[
  {
    label: '测试',
    verbose: 'test',
    value: '',
    type: 'input',
    eventChange: true,
    attrs: {
      placeholder: '这是一个测试'
    },
    fns: {
      focus: () => console.log('test')
    },
    required: true
  }
]
```

------

## EL-TABLE-MODEL

基于element ui和el form model对表格的封装

### el-table-model参数

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| table-data | 表格数据 | array | / | / |
| search-list | 搜索区域，基于el-form-model构建 | array | / | / |
| tool-list | 工具栏区域构建 | array | / | / |
| table-header-list | table区域构建（详见下文） | array | / | / |
| pagination-total | 分页总数 | number | / | 0 |
| table-loading | table加载显示的loading | boolean | / | false |
| show-table-selection | 是否显示table的勾选框 | boolean | / | false |
| fuzzy-search | 搜索区域是否开启模糊搜索，日期大于小于 | boolean | / | true |

| 事件名 | 说明 | 回调参数 |
| ---- | ---- | ---- |
| pagination | 获取当前页参数 | { page: 'page', page_size: 'page_size' } |
| search | 获取搜索区域搜索结果，如果fuzzy-search = true，则获取相对应处理过后的数据 | searchData |
| select | 获取table的勾选框的勾选结果 | selection, row |
| select-all | 获取table的勾选框顶端全部勾选结果 | selection |
| handleClick | table操作列表按钮点击，会被item.fn覆盖 | item, row |


参考
```
<el-table-model
  :table-loading="tableLoading"
  :table-data="tableData"
  :search-list="searchList"
  :tool-list="toolList"
  :table-header-list="tableHeaderList"
  :pagination-total="pagination.total"
  @pagination="getPageInfo"
  @search="handleSearch"
/>
```

### search-list构建
详见el-form-list中对于form-list的构建

>当fuzzy-search = true时，form-list的每个item必须相对应添加以下参数fuzzy-search才会生效！！！

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| fuzzySearch | 是否开启文字的模糊搜索 | boolean | / | / |
| fuzzyName | 文字的模糊字段名 | string | / | item.verbose + '__icontains' |
| fuzzyDate | 是否开启日期的大小选择 | boolean | / | / |
| fuzzyDateName | 日期的大小选择，大于或大于等于或小于或小于等于某个日期 | boolean | / | item.verbose + '__gte' |
| fuzzyDateRange | 是否开启日期的大小区间选择 | boolean | / | / |
| fuzzyDateRangeName | 日期的大小区间选择，大于或大于等于或小于或小于等于某个日期，{ start: 'startDate', end: 'endDate' }，start为左侧的开始日期，end为右侧的结束日期 | boolean | / | start默认item.verbose + '__gte'，end默认item.verbose + '__lte' |

### tool-list构建
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| type | 类型 | string | slot | 默认为按钮 |
| label | 按钮上显示的文字 | string | / | / |
| btnType | 按钮样式类型 | string | primary，success，warning，danger，info，text | primary |
| icon | 按钮文字前的icon显示 | string | / | / |
| fn | 按钮点击时绑定的事件，会覆盖handleClick | function | / | / |
| slotName | 具名插槽名 | string | / | / |

| 事件名 | 说明 | 回调参数 |
| ---- | ---- | ---- |
| handleClick | toolList中按钮点击，会被item.fn覆盖 | item |

### table-header-list构建
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| type | table每个cell的内容类型 | string | btn/button，tag，txt/text | txt/text |
| fixed | 表头是否固定 | string、boolean | true, left, right | 当prop = 'operation'时默认为center |
| label | 显示的标题 | string | / | / |
| width | 列表宽度 | string | / | 当prop = 'id'时默认为80px，当prop = 'operation'时默认为operationList.length * 100 |
| prop | 对应列内容的字段名 | string | / | / |
| align | 对齐方式 | string | / | center |
| operationList | 当type = 'btn' \|\| 'button'时，显示的按钮列表 { label: 'label', prop: 'prop', btnType: 'btnType', fn: () => {} }，label为显示的内容，prop为对应列内容的字段名，btnType为对应el-button的显示按钮样式类型，fn为按钮点击时绑定的事件，回调参数为每行的row值，会覆盖handleClick事件 | array | / | / |


