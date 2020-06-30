# 靓仔不才，请多指点

## 组件说明
```
这个日历组件主要用来出来每天不同逻辑：比如旅游的项目每天的出团价不一样，就可以使用
```

### 安装方法
```
npm i vdate-pc-mobile
```

### 如何使用？
```
在 `main.js` 文件中引入插件并注册

``` bash
# main.js
import vDatePcMobile from 'vdate-pc-mobile'
Vue.use(vDatePcMobile)
```
在项目中用使用 vdate-pc --- PC端的日历
注意：标签为 `<vdatePc>`
```js
<template>
  <vdatePc borderColor="colorStr"></vdatePc>
</template>
<script>
  export default {
    data () {
      return {
        colorStr: 'red'
      }
    }
  }
</script>
```
在项目中用使用 vdate-mobeil --- 移动端的日历
注意：标签为 `<vdateMobeil>`
```js
<template>
  <vdateMobeil borderColor="colorStr"></vdateMobeil>
</template>
<script>
  export default {
    data () {
      return {
        colorStr: 'red'
      }
    }
  }
</script>
```


## 参数

| 参数 | 说明 | 类型 | 默认值 | 是否必传 |
| ------ | ------ | ------ | ------ | ------ |
| boxWidth | 盒子宽度 | Number | 600 | 否---PC端取传进的值，移动端取父盒子百分百 |
| borderColor | 边框颜色 | String | #ccc | 否 |
| disableStyle | 禁止日期的样式 | String | "color:#000" | 否 |
| initDate | 初始化日期，如："2020-05-01" | String | 当月 | 否 |
| options | 日历中每天的配置项 | Array | [{key:'price',name:'价格'}] | 否 |
| interactiveData | 请求后台日历数据返回来进行更新视图 | Array | [] | 否 |

## 事件

| 事件名称 | 说明 | 回调参数 |
| ------ | ------ | ------ |
| getDays | 获取当月日历数据返回(切记不要修改返回数组的长度) | Array -- 日历表格数据 |
| dayItemBtn | 日历表格某一天点击 | Number -- 日历数组中点击的索引 |
