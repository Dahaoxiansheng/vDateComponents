<template>
  <div :style="{width:boxWidth+'px'}" class="vdate-pc">
    <div class="vdate-header" :style="{borderColor:borderColor}">
      <div class="header-black">
        <div @click="yearBtn('upper')" style="margin-right: 15px;">上一年</div>
        <div @click="monthBtn('upper')">上月</div>
      </div>
      <div class="header-black year-month-box">
        <div @click="setNewDate('year')" style="margin-right: 10px;">{{newYear}}年</div>
        <div @click="setNewDate('month')">{{newMonth}}月</div>
        <div class="year-month-content" v-if="this.yearList.length > 0">
          <div class="year-month-fix" :style="{borderColor:borderColor}">
            <div
              v-for="(e,m) in this.yearList"
              :key="m"
              class="year-month-black"
              :class="setMateStr == 'year' ? (e === newYear ? 'prohibit-year' : 'year-month-son') : (e === newMonth ? 'prohibit-year' : 'year-month-son')"
              :style="{borderColor:borderColor}"
              @click="newDateSonBtn(e)"
            >{{setMateStr == 'year' ? e + '年' : e + '月'}}</div>
          </div>
        </div>
      </div>
      <div class="header-black">
        <div @click="monthBtn('lower')" style="margin-right: 15px;">下月</div>
        <div @click="yearBtn('lower')">下一年</div>
      </div>
    </div>
    <div class="vdate-week" :style="{borderColor:borderColor}">
      <div
        v-for="(v,i) in weekStrArr"
        :key="i"
        class="week-item"
        :style="{borderColor:borderColor}"
      >星期{{v}}</div>
    </div>
    <div class="vdate-content" :style="{borderColor:borderColor}">
      <div
        class="v-date-balck"
        v-for="(item,inx) in days"
        :key="inx"
        :style="{borderColor:borderColor}"
        @click="balckBtn(item,inx)"
      >
        <div v-if="inspectName(item)" class="prohibit balck-item" :style="disableStyle">
          <div>{{formatDate(item.dateline,true)}}</div>
          <div v-for="(value,index) in options" :key="index">
            <span>{{value.name}}：</span>
            <span>{{item[value.key]}}</span>
          </div>
        </div>
        <div v-else class="balck-item">
          <div>{{formatDate(item.dateline,true)}}</div>
          <div v-for="(value,index) in options" :key="index">
            <span>{{value.name}}：</span>
            <span>{{item[value.key]}}</span>
          </div>
        </div>
        <!-- <div>售价:xxx</div>
        <div>库存:xxx</div>-->
      </div>
    </div>
    <div class="mask-box" v-if="maskType" @click="maskBtn"></div>
  </div>
</template>

<script>
  export default {
    name: "vdate-pc",
    props: {
      // 盒子的宽度
      boxWidth: {
        type: Number,
        default: () => {
          return 800;
        }
      },
      // 边框颜色
      borderColor: {
        type: String,
        default: () => {
          return "#ccc";
        }
      },
      // 禁止的样式
      disableStyle: {
        type: String,
        default: () => {
          return "background-color: #bebebe;color: #666;";
        }
      },
      // 初始化日期---2020-05-01
      initDate: {
        type: String,
        default: () => {
          return "";
        }
      },
      // 日历中每天的配置项
      options: {
        type: Array,
        default: () => {
          return [];
        }
      },
      // 后台返回的交互数据
      interactiveData: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    data() {
      return {
        newYear: null,
        newMonth: null,
        newDay: null,
        days: [],
        yearList: [],
        leftYear: "<<",
        leftMonth: "<",
        setMateStr: "", // 选择年月的时候控制
        weekStrArr: ["一", "二", "三", "四", "五", "六", "日"],
        maskType: false
      };
    },
    computed: {},
    watch: {
      interactiveData: {
        handler(newval) {
          this.days = newval;
          // console.log(oldval[0], "interactiveData");
        },
        deep: true
      }
    },
    created() {
      this.init(this.initDate);
    },
    mounted() {},
    methods: {
      inspectName(item) {
        let newType =
          new Date(item.dateline).getFullYear() != this.newYear ||
          new Date(item.dateline).getMonth() + 1 != this.newMonth;
        return newType;
      },
      formatDate(data, type = false) {
        let y, m;
        let d = 1;
        if (data) {
          y = new Date(data).getFullYear();
          m = new Date(data).getMonth() + 1;
          if (type) {
            d = new Date(data).getDate();
          }
        } else {
          y = new Date().getFullYear();
          m = new Date().getMonth() + 1;
        }
        if (m < 10) m = "0" + m;
        return y + "-" + m + "-" + d;
      },
      init(val) {
        // if (!val) {
        //   // 取这个月的一号
        //   console.log("取本月的一号", this.formatDate(val));
        // } else {
        //   console.log("穿值了", this.formatDate(val));
        // }
        this.initDataArr(this.formatDate(val));
      },
      balckBtn(val, index) {
        if (!this.inspectName(val)) {
          this.$emit("dayItemBtn", index);
        }
      },
      initDataArr(cur) {
        // 生成日历数据
        // cur --- 2020-05-01
        let date;
        if (cur) {
          date = new Date(cur);
        } else {
          let d = new Date(this.formatDate());
          d.setDate(42);
          date = new Date(this.formatDate());
        }
        this.newYear = date.getFullYear();
        this.newMonth = date.getMonth() + 1;
        this.newDay = date.getDate();
        let newWeek = date.getDay(); // 1...6,0 取上个月还存有多少天，这里取的是这个月一号的getDay
        // eslint-disable-next-line
        if (newWeek == 0) {
          newWeek = 7;
        }
        let str = this.formatDate(cur);
        this.days.length = 0;
        // 获取上个月的时间
        for (let i = newWeek - 1; i >= 0; i--) {
          let d = new Date(str);
          d.setDate(d.getDate() - i); // setDate返回距离一号调整过的日期的毫秒
          let dayObj = {}; // 用一个对象包装Date对象  以便为以后预定功能添加属性 --- 看自己实际情况而定
          dayObj.dateline = d;
          // dayObj.dataArr = this.options;
          this.options.forEach(v => {
            dayObj[v.key] = 0;
          });
          this.days.push(dayObj); // 将日期放入data 中的days数组 供页面渲染使用
        }
        // 获取本月以及下个月的时间
        for (let i = 1; i <= 42 - newWeek; i++) {
          let d = new Date(str);
          d.setDate(d.getDate() + i);
          let dayObj = {}; // 用一个对象包装Date对象  以便为以后预定功能添加属性 --- 看自己实际情况而定
          dayObj.dateline = d;
          // dayObj.dataArr = this.options;
          this.options.forEach(v => {
            dayObj[v.key] = 0;
          });
          this.days.push(dayObj);
        }
        this.$emit("getDays", this.days);
        // this.days.sort((a, b) => {
        //   // 利用array的sort进行一个排序刚好利用时间戳把日期排序好
        //   // console.log(
        //   //   a.dateline.getFullYear(),
        //   //   a.dateline.getMonth() + 1,
        //   //   a.dateline.getDate(),
        //   //   "-------",
        //   //   b.dateline.getFullYear(),
        //   //   b.dateline.getMonth() + 1,
        //   //   b.dateline.getDate()
        //   // );
        //   return a.dateline.getTime() - b.dateline.getTime();
        // });
      },
      // 月份点击
      monthBtn(type) {
        console.log(this.newYear, this.newMonth);
        if (!this.newYear || !this.newMonth) {
          return false;
        }
        let newStr = "";
        // 判断是否点击上个月
        if (type === "upper") {
          // 判断是否为一月
          if (this.newMonth === 1) {
            newStr = `${this.newYear - 1}-12-1`;
          } else {
            newStr = `${this.newYear}-${this.newMonth - 1}-1`;
          }
        } else {
          // 判断是否为十二月
          if (this.newMonth === 12) {
            newStr = `${this.newYear + 1}-01-1`;
          } else {
            newStr = `${this.newYear}-${this.newMonth + 1}-1`;
          }
        }
        this.initDataArr(newStr);
      },
      // 年份点击
      yearBtn(type) {
        // console.log(this.newYear, this.newMonth);
        if (!this.newYear || !this.newMonth) {
          return false;
        }
        let newStr = "";
        // 判断是否点击上一年
        if (type === "upper") {
          newStr = `${this.newYear - 1}-${this.newMonth}-1`;
        } else {
          newStr = `${this.newYear + 1}-${this.newMonth}-1`;
        }
        this.initDataArr(newStr);
      },
      setNewDate(type) {
        this.yearList = [];
        this.setMateStr = type;
        // 点击的是年
        if (type == "year") {
          // let upNum = Math.ceil(this.newYear / 12);
          // let floorNum = Math.floor(this.newYear / 12);
          for (let index = this.newYear - 8; index < this.newYear + 8; index++) {
            this.yearList.push(index);
          }
        } else {
          // 点击的是月
          for (let index = 1; index < 13; index++) {
            this.yearList.push(index);
          }
        }
        this.maskType = true;
      },
      newDateSonBtn(val) {
        // 判断是否点击的是年
        let newDateStr = "";
        let setDateType = true;
        if (this.setMateStr == "year") {
          if (val == this.newYear) {
            setDateType = false;
          } else {
            newDateStr = `${val}-${this.newMonth}-1`;
          }
        } else {
          if (val == this.newMonth) {
            setDateType = false;
          } else {
            newDateStr = `${this.newYear}-${val}-1`;
          }
        }
        this.maskBtn();
        if (setDateType) {
          this.initDataArr(newDateStr);
        }
      },
      maskBtn() {
        this.setMateStr = "";
        this.maskType = false;
        this.yearList = [];
      }
    },
    beforeDestroy() {}
  };
</script>
<style lang='scss' scoped>
  div,
  span,
  p {
    box-sizing: border-box;
  }
  .vdate-pc {
    margin: 0 auto;
    position: relative;
    .mask-box {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba($color: #000000, $alpha: 0.5);
    }
    .vdate-header {
      width: 100%;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #cccccc;
      border-bottom: none;
      .header-black {
        display: flex;
        align-content: center;
        > div {
          cursor: pointer;
        }
      }
      .year-month-box {
        position: relative;
        .year-month-content {
          position: absolute;
          top: 30px;
          left: 50%;
          width: 400px;
          transform: translateX(-50%);
          background-color: #fff;
          z-index: 666;
          .year-month-fix {
            display: flex;
            flex-wrap: wrap;
            border-top: 1px solid #666;
            border-right: 1px solid #666;
            border-color: rgb(204, 204, 204);
            box-shadow: 0px 0px 20px 5px #666;
            .year-month-black {
              width: 25%;
              padding: 15px;
              border-left: 1px solid #666;
              border-bottom: 1px solid #666;
            }
            .prohibit-year {
              cursor: no-drop;
              background-color: #ccc;
            }
            .year-month-son:hover {
              background-color: #82e2ff;
              color: #fff;
            }
          }
        }
      }
    }
    .vdate-week {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      border-top: 1px solid #666;
      border-right: 1px solid #666;
      .week-item {
        cursor: pointer;
        width: 14.28%;
        border-left: 1px solid #666;
        text-align: center;
        padding: 10px;
      }
    }
    .vdate-content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      border-top: 1px solid #666;
      border-right: 1px solid #666;
      .v-date-balck {
        cursor: pointer;
        width: 14.28%;
        border-left: 1px solid #666;
        border-bottom: 1px solid #666;
        overflow: hidden;
      }
      .balck-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 20px 0;
      }
      .balck-item:hover {
        background-color: #82e2ff;
        color: #fff;
      }
      .prohibit {
        cursor: no-drop;
        background-color: #bebebe;
        color: #666;
      }
    }
  }
</style>