<template>
  <div class="pl-container">
    <div class="pl-header">
      <div v-if="searchList && searchList.length !== 0">
        <el-form-model
          :model="searchData"
          form-style="row"
          label-width="30px"
          :form-list="
            searchList.concat([{ type: 'slot', slotName: 'form-search' }])
          "
          :show-label="bool.f"
          :disable-slot-default-style="bool.t"
          style="position: relative; left: -30px"
          @handleEvents="handleFormEvents"
        >
          <template #form-search>
            <el-button v-waves type="primary" @click="handleSearch">
              <i class="el-icon-search" />
              搜索
            </el-button>
          </template>
        </el-form-model>
      </div>
      <div style="margin: 5px 0 30px 0">
        <div v-for="(item, idx) in toolList" :key="idx">
          <slot v-if="item.type === 'slot'" :name="item.slotName" />
          <el-button
            v-else
            v-waves
            :type="item.btnType || 'primary'"
            @click="item.fn ? item.fn(item) : handleClick(item)"
          >
            <i :class="item.icon" />
            {{ item.label }}
          </el-button>
        </div>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @select="handleRowSelection"
        @select-all="handleRowSelectionAll"
      >
        <el-table-column
          v-if="showTableSelection"
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="(header, index) of tableHeaderList"
          :key="index"
          :fixed="header.prop === 'operation' ? 'right' : header.fixed"
          :label="header.label"
          :prop="header.prop"
          :width="
            (header.prop === 'id' && !header.width ? 80 : header.width) ||
              (header.prop === 'operation' && !header.width
                ? 100 * header.operationList.length
                : header.width)
          "
          :align="header.align || 'center'"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <div v-if="['btn', 'button'].includes(header.type)">
              <el-button
                v-for="(item, idx) of header.operationList"
                :key="idx"
                v-waves
                :type="item.btnType || 'primary'"
                size="mini"
                @click="item.fn ? item.fn(row) : handleClick(item, row)"
              >
                {{ item.label }}
              </el-button>
            </div>
            <el-tag v-if="header.type === 'tag'" :type="row.status">
              {{ _toString(row[header.prop]) }}
            </el-tag>
            <el-popover
              v-if="!header.type || ['txt', 'text'].includes(header.type)"
              placement="top"
              width="200"
              trigger="click"
              :content="_toString(row[header.prop])"
            >
              <span slot="reference">
                {{ _toString(row[header.prop]) }}
              </span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="paginationTotal > 0"
        :total="paginationTotal"
        :page.sync="pagination.page"
        :limit.sync="pagination.page_size"
        @pagination="getPageInfo"
      />
    </div>
  </div>
</template>

<script>
import Pagination from './components/Pagination/index'
import ElFormModel from '../ElFormModel/index'
import { _toString } from '../../lib/utils/string'
import { formAutoProcess } from '../../lib/utils/fuzzy-search'

export default {
  name: 'ElTableModel',
  components: { Pagination, ElFormModel },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    searchList: {
      type: Array,
      default: () => []
    },
    toolList: {
      type: Array,
      default: () => []
    },
    tableHeaderList: {
      type: Array,
      default: () => []
    },
    paginationTotal: {
      type: Number,
      default: 0
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    showTableSelection: {
      type: Boolean,
      default: false
    },
    fuzzySearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pagination: {
        page: 1,
        page_size: 10
      },
      searchData: {},
      bool: {
        t: true,
        f: false
      }
    }
  },
  methods: {
    getPageInfo(val) {
      this.$emit('pagination', val)
    },
    handleSearch() {
      let newSearchData = Object.assign({}, this.searchData)
      if (this.fuzzySearch) {
        newSearchData = formAutoProcess(newSearchData, this.searchList)
      }
      this.$emit('search', newSearchData)
    },
    handleFormEvents() {
      let newSearchData = Object.assign({}, this.searchData)
      if (this.fuzzySearch) {
        newSearchData = formAutoProcess(newSearchData, this.searchList)
      }
      this.$emit('search', newSearchData)
    },
    handleRowSelection(selection, row) {
      this.$emit('select', selection, row)
    },
    handleRowSelectionAll(selection) {
      this.$emit('selectAll', selection)
    },
    handleClick(item, row) {
      this.$emit('handleClick', item, row)
    },
    _toString
  }
}
</script>
