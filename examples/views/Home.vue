<template>
  <div class="home">
    <div @click="setDaysBtn">模拟后台数据</div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <vdatePc
      :options="dateOptions"
      @getDays="getDaysFn"
      :interactiveData="newDays"
      @dayItemBtn="dayBlackFn"
    ></vdatePc>
  </div>
</template>

<script>
  // @ is an alias to /src
  // import HelloWorld from '@/components/HelloWorld.vue'
  import vdatePc from "../../packages/vdate-pc/vdate-pc.vue";
  export default {
    name: "Home",
    data() {
      return {
        dateOptions: [
          {
            key: "price",
            name: "价格"
          },
          {
            key: "stock",
            name: "库存"
          },
          {
            key: "supplier",
            name: "供应价"
          }
        ],
        oldDays: [],
        newDays: []
      };
    },
    components: {
      // HelloWorld,
      vdatePc
    },
    methods: {
      getDaysFn(val) {
        console.log(val);
        this.oldDays = JSON.parse(JSON.stringify(val));
      },
      setDaysBtn() {
        setTimeout(() => {
          this.newDays = this.oldDays.map((v, i) => {
            v.supplier = (i + 1) * 1;
            v.stock = i * 2;
            v.price = (i + 1) * 3;
            return v;
          });
        }, 200);
      },
      dayBlackFn(index) {
        console.log(index);
        this.oldDays[index].supplier = this.oldDays[index].supplier * index;
        this.oldDays[index].stock = this.oldDays[index].stock * index;
        this.oldDays[index].price = this.oldDays[index].price * index;
      }
    }
  };
</script>
