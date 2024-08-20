<template>
  <div class="dashboard-container">
    <el-link href="https://element.eleme.cn/#/zh-CN/component/installation" type="primary" target="_blank">Element UI 神一般的UI框架 </el-link>
    <br/>
    <el-tag type="info">用户: {{ name }}</el-tag>
    <br/>
    <el-tag type="info">租户: {{ tenant }}</el-tag>
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="(item, index) in images" :key="index">
        <img :src="item" alt="" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'tenant'
    ])
  },
  data() {
    return {
      images: [
        'https://www.invengo.cn/upload/ztyImg/2021-07/60e5486f71553.jpg',
        'https://www.invengo.cn/upload/ztyImg/2021-08/610bb0e1f01ff.jpg',
        'https://www.invengo.cn/upload/ztyImg/2021-08/610bb0f0e18e3.jpg',
        'https://www.invengo.cn/upload/ztyImg/2021-08/610bb24684c30.jpg',
        'https://www.invengo.cn/upload/ztyImg/2021-08/610bb0e1f01ff.jpg',
        'https://www.invengo.cn/upload/ztyImg/2021-08/610bb0f0e18e3.jpg',
        'https://www.invengo.cn/upload/ztyImg/2021-08/610bb24684c30.jpg',
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}


.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.carousel-image {
  width: 100%;
  height: 100%; /* 高度填满轮播图容器 */
  object-fit: cover; /* 保持图片比例并填满容器 */
}

</style>
