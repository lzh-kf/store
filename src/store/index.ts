import { isRef, isProxy, isReadonly, watch, reactive, isReactive } from 'vue'

const isObject = (val: any) => val !== null && typeof val === 'object'

interface Callback {
  (ctx: Ctx, val: Object): void
}

export interface Ctx extends Object {
  $subscribe: {
    (val: Callback): void
  },
  $patch: {
    (val: Object): void
  }
  $id: string
}

const getWatchData = <T extends Object>(data: T) => {
  let result: { [key: string]: unknown } = {}
  Object.keys(data).forEach((key) => {
    const item = data[key as keyof T]
    // 主要是为了过滤函数和计算属性，确保只拿到ref和reactive的值进行监听
    if (!isReadonly(item) && (isRef(item) || isProxy(item))) {
      result[key] = item
    }
  })
  return reactive(result)
}

const addSubscribe = (ctx: Ctx) => {
  const wathData = getWatchData(ctx)
  ctx.$subscribe = (callback) => {
    watch(wathData, (newVal) => {
      callback(ctx, newVal)
    })
  }
}

const addPatch = (ctx: Ctx) => {
  ctx.$patch = (val) => {
    if (isObject(val)) {
      for (let key in val) {
        const currentItem = val[key as keyof Object]
        const proxyItem = ctx[key as keyof Object]
        if (proxyItem !== undefined) {
          if (isRef(proxyItem)) {
            proxyItem.value = currentItem
          }
          if (isReactive(proxyItem) && isObject(currentItem)) {
            Object.assign(proxyItem, currentItem)
          }
        } else {
          try {
            console.error(`当前修改的key值---->${key}`)
            console.error(`有效的key如下--->`, Object.keys(getWatchData(ctx)).join(','))
          } catch (error) {
            console.error(error)
          }
        }
      }
    } else {
      console.error(`$patch函数调用参数必须传递对象,请检查传入的值${val}`)
    }
  }
}

const addId = (ctx: Ctx, id: string) => {
  ctx.$id = id
}

const addMethods = (ctx: Ctx, id: string) => {
  addSubscribe(ctx)
  addPatch(ctx)
  addId(ctx, id)
}

const defineStore = <T1 extends string, T2>(id: T1, callback: Function) => {
  let result: Ctx & T2
  return (): (Ctx & T2) => {
    if (result) {
      return result
    } else {
      const val = callback()
      result = val
      addMethods(val, id)
      return result
    }
  }
}

export { defineStore }
