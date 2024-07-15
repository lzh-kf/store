<template>
  <div>
    测试页面
    <ul>
      <li>页面数据{{ store.productNum }}</li>
      <li>页面数据{{ store1.productNum }}</li>
      <li>页面数据{{ store2.productNum }}</li>
    </ul>
    <button @click="store.changeProductNum(50)">修改数量</button>
    <button @click="store.changeProductNum(10)">修改数据</button>
  </div>
</template>

<script setup lang="ts">
import useProductStore from './store/productStore'
const store = useProductStore()
const store1 = useProductStore()
const store2 = useProductStore()
</script>

<style scoped></style>