//packages/color-picker/index.js// 导入组件，组件必须声明 name
import vdatePc from './vdate-pc.vue'

// 为组件提供 install 安装方法，供按需引入
vdatePc.install = function (Vue) {
      Vue.component(vdatePc.name, vdatePc)
}

// 默认导出组件
export default vdatePc
