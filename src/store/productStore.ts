import { ref, computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { defineStore } from './index'

interface Result {
  productNum: Ref<number>,
  changeProductNum: {
    (val: number): void
  },
  productTotalPrice: ComputedRef<number>,
}

const productStore = 'productStore'

const useProductStore = defineStore<string, Result>(productStore, (): Result => {
  const productNum = ref(5)
  const productTotalPrice = computed(() => productNum.value * 5)
  const changeProductNum = (num: number) => {
    productNum.value = num
  }
  return {
    productNum,
    changeProductNum,
    productTotalPrice
  }
})

export default useProductStore