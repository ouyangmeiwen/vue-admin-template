<template>
  <div class="app-container">

    <!-- Search Bar -->
    <el-row :gutter="10">
      <el-col :span="3">
        <el-input v-model="Skip" placeholder="Search by Skip" class="mb-1" clearable />
      </el-col>
      <el-col :span="3">
        <el-input v-model="MaxResult" placeholder="Search by MaxResult" class="mb-1" clearable />
      </el-col>
      <el-col :span="8">
        <el-input v-model="searchQuery" placeholder="Search by title or author" class="mb-4" clearable />
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="filteredList" element-loading-text="Loading" border fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Barcode" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.barcode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, getALL } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      Skip:0,
      MaxResult:100,
      searchQuery: '',
      filteredList: []
    }
  },
  watch: {
    searchQuery: 'filterData'
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getALL().then(response => {
        this.list = response.data.items
        this.filterData() // 初次获取数据后，调用 filterData 初始化 filteredList
        this.listLoading = false
      })
    },
    filterData() {
      this.filteredList = this.list.filter(item => {
        const title = item.title ? item.title.toLowerCase() : '';
        const author = item.author ? item.author.toLowerCase() : '';
        return title.includes(this.searchQuery.toLowerCase()) ||
          author.includes(this.searchQuery.toLowerCase());
      });
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
</style>
