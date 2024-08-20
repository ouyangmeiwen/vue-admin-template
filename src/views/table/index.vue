<template>
  <div class="app-container">

    <!-- Search Bar -->
    <el-row :gutter="10">
      <el-col :span="3" v-if="isVisible">
        <el-input v-model="Skip" placeholder="Search by Skip" class="mb-1" clearable>
          <template #prepend>Offset(0):</template>
        </el-input>
      </el-col>
      <el-col :span="3" v-if="isVisible">
        <el-input v-model="MaxResult" placeholder="Search by MaxResult" class="mb-1" clearable>
          <template #prepend>Limit(100):</template>
        </el-input>
      </el-col>
      <el-col :span="3" v-if="isVisible">
        <el-input v-model="Total" class="mb-1" clearable>
          <template #prepend>总量:</template>
        </el-input>
      </el-col>

      <el-col :span="10">
        <el-input v-model="searchQuery" @keyup.native.enter="handleQuery" placeholder="Search by title or barcode"
          class="mb-4" clearable>
          <template #prepend>条码书名查询:</template>
        </el-input>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="primary" @click="handlePrevPage">上一页</el-button>
        <el-button type="primary" @click="handleNextPage">下一页</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="filteredList" element-loading-text="Loading" border fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="条码" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.barcode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="书名">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="400" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="索书号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.callNo }}
        </template>
      </el-table-column>
      <el-table-column label="ISBN" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.isbn }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="getTagType(scope.row.itemState)">{{ getTagText(scope.row.itemState) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="creationTime" label="创建时间" width="250">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.creationTime }}</span>
        </template>
      </el-table-column>
    </el-table>


    <!-- Page Info -->
    <el-row :gutter="10" class="mt-4" justify="center">
      <el-col :span="24" class="text-center">
        <span>当前页: {{ currentPage }} / {{ totalPages }},总共{{ Total }}条数据</span>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getList, getALL } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      Skip: 0,
      MaxResult: 10,
      searchQuery: '',
      filteredList: [],
      Total: 0,
      isVisible: false,
      currentPage: 0,
      totalPages: 0
    }
  },
  watch: {
    //searchQuery: 'fetchData', //内存中过滤
    //Skip: 'fetchData', //数据库中过滤
    //MaxResult: 'fetchData', //数据库中过滤
  },
  created() {
    this.Skip = 0
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        Skip: this.Skip ? this.Skip : 0,
        MaxResult: this.MaxResult ? this.MaxResult : 100,
        Filter: this.searchQuery ? this.searchQuery : ''
      }
      getALL(params).then(response => {
        this.list = response.data.items
        //this.filterData() // 初次获取数据后，调用 filterData 初始化 filteredList
        this.listLoading = false
        this.Total = response.data.total
        this.currentPage = Math.ceil(this.Skip / this.MaxResult) + 1
        this.totalPages = Math.ceil(this.Total / this.MaxResult)
        this.filteredList = this.list
      })
    },
    filterData() {
      this.filteredList = this.list.filter(item => {
        const title = item.title ? item.title.toLowerCase() : '';
        const author = item.author ? item.author.toLowerCase() : '';
        const barcode = item.author ? item.barcode.toLowerCase() : '';
        return title.includes(this.searchQuery.toLowerCase()) ||
          barcode.includes(this.searchQuery.toLowerCase()) ||
          author.includes(this.searchQuery.toLowerCase());
      });
    },
    handleQuery() {
      if (this.Skip === 0) {
        this.fetchData()
      } else {
        this.Skip = 0
        this.fetchData()
      }
    },
    handlePrevPage() {
      if (this.Skip <= 0) {
        this.Skip = 0
      } else {
        if (this.Skip - this.MaxResult <= 0) {
          this.Skip = 0
        } else {
          this.Skip = this.Skip - this.MaxResult
        }
      }
      this.fetchData()
    },
    handleNextPage() {
      if (this.Skip >= this.Total) {
        this.Skip = this.Total
      } else {
        if (this.Skip + this.MaxResult >= this.Total) {
          //this.Skip = this.Total
        } else {
          this.Skip = this.Skip + this.MaxResult
        }
      }
      this.fetchData()
    },
    getTagType(itemState) {
      switch (itemState) {
        case 2:
          return 'danger';
        default:
          return 'success';
      }
    },
    getTagText(itemState) {
      switch (itemState) {
        case 1:
          return '其他';
        case 2:
          return '借出';
        case 3:
          return '在馆';
        case 4:
          return '收费';
        case 5:
          return '收费（最早归还日期前不可召回）';
        case 6:
          return '加工中';
        case 7:
          return '召回';
        case 8:
          return '等待上架';
        case 9:
          return '等待取出';
        case 10:
          return '馆际调拨';
        case 11:
          return '要求归还';
        case 12:
          return '丢失';
        case 13:
          return '残缺';
        case 14:
          return '生日图书';
        case 15:
          return '委托图书';
        default:
          return '未知状态';
      }
    }
  }
}
</script>
<style scoped>
.app-container .mb-4 {
  margin-bottom: 16px;
  width: 600px;
  /* 设置搜索栏的宽度，可以根据需求调整 */
  max-width: 100%;
  /* 确保搜索栏在小屏幕上不会超出容器宽度 */
}

.mt-4 {
  margin-top: 1rem;
}

.el-input__prepend {
  display: inline-block;
}
</style>
