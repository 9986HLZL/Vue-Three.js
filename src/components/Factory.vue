<template>
  <!-- 3d -->
  <v-app>
    <div id="container">
      <div class="title-view">
        <div class="title-left">
          <div @click="back_btn" class="back-btn">返回</div>
        </div>
        <v-btn
          color="#00879e"
          class="white--text"
          small
          dark
          outlined
          style="position: relative; top: 1000px; left: -360px"
          @click="carStart"
        >
          货车启动
        </v-btn>
        <v-btn
          style="position: relative; top: 1000px; left: 860px"
          @click="checkCarStart"
          color="#00879e"
          class="white--text"
          small
          dark
          outlined
          >巡检车启动</v-btn
        >
        <v-btn
          style="position: relative; top: 1000px; left: 880px"
          @click="checkCarStop"
          color="#00879e"
          class="white--text"
          small
          dark
          outlined
          >巡检完成</v-btn
        >
        <v-btn
          color="#00879e"
          class="white--text"
          small
          dark
          outlined
          style="position: relative; top: 1000px; left: -510px"
          @click="carStop"
        >
          货车停止
        </v-btn>

        <div class="title-center">
          <div class="text">
            <dv-border-box-10>工厂生产实时数据</dv-border-box-10>
          </div>
        </div>

        <div class="title-right">
          <span>{{ getNowDate(nowDate) }}</span>
        </div>
      </div>
      <dv-border-box-10
        v-if="isShow"
        style="
          width: 400px;
          height: 220px;
          position: relative;
          top: 1200px;
          left: 400px;
        "
      >
        <div
          class="moveText"
          id="moveText"
          :style="{ top: dragTop + 'px', left: dragLeft + 'px' }"
        >
          <v-btn
            @click="onMouseMove"
            style="position: relative; top: -5px; left: 350px"
            icon
            dark
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template v-if="isShowTask">
            <p>当前车间: {{ texts.type }}</p>
            <p>进行中工单: {{ tasks.isWorking }}</p>
            <p>待验收工单: {{ tasks.acceptable }}</p>
          </template>
          <template v-if="isShowParts">
            <p>当前车间: {{ texts.type }}</p>
            <p>今日入库: {{ inventory.pentry }}</p>
            <p>今日出库: {{ inventory.pexit }}</p>
          </template>
          <template v-if="isShowOil">
            <p>当前车间: {{ texts.type }}</p>
            <p>今日入库: {{ inventory.oentry }}</p>
            <p>今日出库: {{ inventory.oexit }}</p>
          </template>
          <template v-if="isShowR">
            <p>{{ texts.type }}</p>
            <p>当前液位: {{ productionData.rLevel }} L</p>
            <p>当前温度: {{ productionData.rTemp }}℃</p>
          </template>
          <template v-if="isShowM">
            <p>{{ texts.type }}</p>
            <p>当前液位: {{ productionData.mLevel }} L</p>
          </template>
          <template v-if="isShowP">
            <p>{{ texts.type }}</p>
            <p>制造商: Siemens</p>
            <p>产品名称: SITRANS P DS III</p>
            <p>一级高压泵后压力: {{ this.productionData.pressure }}</p>
          </template>
        </div>
      </dv-border-box-10>

      <dv-border-box-10
        style="
          width: 490px;
          height: 320px;
          margin-left: 10px;
          position: relative;
          top: 140px;
        "
      >
        <div id="bar2" class="bar2"></div>
        <div class="title2">液位</div>
      </dv-border-box-10>

      <dv-border-box-10
        style="
          width: 490px;
          height: 320px;
          margin-left: 10px;
          position: relative;
          top: -180px;
          left: 1000px;
        "
      >
        <div id="pieDemo" class="pieDemo"></div>
        <div class="title3">压力传感器</div>
      </dv-border-box-10>

      <dv-border-box-10
        style="
          width: 490px;
          height: 320px;
          margin-left: 10px;
          position: relative;
          top: -500px;
          left: 500px;
        "
      >
        <div id="test_ecarts" class="bar"></div>
        <div class="title1">反应罐温度</div>
      </dv-border-box-10>
    </div>
    <v-btn
      v-scroll="onScroll"
      bottom
      color="#1867c0"
      dark
      fab
      fixed
      right
      @click="toTop"
      class="clickable"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-app>
</template>
   
  <script>
import * as echarts from "echarts";
import * as THREE from "three";
import Mock from "mockjs";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import TWEEN from "@tweenjs/tween.js";
import water from "../assets/wud.jpg";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  data() {
    return {
      direction: "top",
      fab: false,
      hover: false,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: "slide-y-reverse-transition",

      value2T: null,
      dataT: null,

      nowDate: new Date().getTime(),
      activeUser: [],
      texts: {
        code: "",
        type: "",
      },
      texture: null,
      composer: null,
      outlinePass: null,
      renderPass: null,
      dragTop: 1000,
      dragLeft: 500,
      cabinetData: [
        { code: "Mesh_2", type: "原料车间" },
        { code: "Mesh_2_2", type: "烧成车间" },
        { code: "Mesh_2_4", type: "成瓷车间" },
        { code: "Mesh_2_1", type: "彩瓷车间" },
        { code: "Obj3d66-818680-10293-883_3", type: "反应罐" },
        { code: "Obj3d66-818680-6586-410", type: "原料罐" },
        { code: "网格211_14", type: "压力传感器" },
        { code: "Obj3d66-9137221-8892-162_2", type: "润滑油品库房" },
        { code: "Obj3d66-9137221-10849-21", type: "备品备件库房" },
      ],
      //车间工单
      tasks: {
        isWorking: null,
        acceptable: null,
      },
      //库存变化

      inventory: {
        pentry: 0,
        pexit: 0,
        oentry: 0,
        oexit: 0,
      },
      meshArr: [],
      truck: [],
      check: [],
      checkPosition: null,
      shperePathIndex: [1001, 750, 500, 250],
      truckPath: [1000],
      checkPath: [1000],

      isShow: false,
      isShowTask: false,
      isShowParts: false,
      isShowOil: false,
      isShowR: false,
      isShowM: false,
      isShowP: false,

      mLevel: [], // 原料罐液位
      rLevel: [], // 反应罐液位
      rTemp: [], // 反应罐温度
      productionData: {
        mLevel: null,
        rLevel: null,
        rTemp: null,
        pressure: null,
      },

      highLightObj: [],
      itemId: null,
      changeId: null,
      operate: null, //操作：出，入库
      quantity: null, //数量
      whatH: null, // 哪个仓库
      xData: [],
      yData: [],
    };
  },
  created() {},
  //在生命周期中注册对象，提高性能
  beforeMount() {
    this.activeUser = JSON.parse(sessionStorage.getItem("ActiveUser"));
    this.activeUser = Object.values(this.activeUser[0]);
  },
  mounted() {
    (this.cx = null),
      (this.cy = null),
      (this.cz = null),
      (this.tx = null),
      (this.ty = null),
      (this.tz = null),
      (this.publicPath = process.env.BASE_URL),
      (this.mesh = null),
      (this.camera = null),
      (this.scene = null),
      (this.renderer = null),
      //巡逻车
      (this.patrolCar = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(400, 0, 1000),
          new THREE.Vector3(-600, 0, 1000),
          new THREE.Vector3(-600, 0, -400),
          new THREE.Vector3(400, 0, -400),
        ],
        true
      ));
    //卡车
    this.truckCar = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-900, 0, 350),
        new THREE.Vector3(-600, 0, 390),
        new THREE.Vector3(200, 0, 390),
        new THREE.Vector3(250, 0, -50),
        new THREE.Vector3(250, 0, -200),
        new THREE.Vector3(-10, 0, -200),
      ],
      true
    );
    //巡检车
    this.checkCar = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-900, 0, 480),
        new THREE.Vector3(-600, 0, 480),
        new THREE.Vector3(-600, 0, 900),
        new THREE.Vector3(300, 0, 900),
        new THREE.Vector3(300, 0, 480),
      ],
      true
    );
    (this.requestAnimationId = null),
      (this.checkAnimation = null),
      (this.timer_truck = null),
      (this.controls = null),
      (this.raycaster = new THREE.Raycaster()),
      (this.mouse = new THREE.Vector2());
    this.init();
    this.test();
    this.getTime();
    this.getNowDate();

    //echarts示例-折线图
    this.getRandomData();
    //echarts示例-柱状图
    this.infoData();
    // 温度和压力表数据;
    // this.testData();

    //压力传感器
    this.getPressure();
  },
  beforeDestroy() {
    // 清空设置，注销事件
    (this.mesh = null),
      (this.camera = null),
      (this.scene = null),
      (this.renderer = null),
      (this.controls = null),
      (this.patrolCar = null),
      (this.timer_truck = null),
      document.removeEventListener("dblclick", this.onMouseClick, false);
  },
  methods: {
    testData() {
      setInterval(() => {
        let mockData1 = Mock.Random.float(20, 20.5, 5, 5);
        let mockData2 = Mock.Random.float(5, 5.5, 5, 5);
        this.$axios
          .get("http://127.0.0.1/factory/addProdution", {
            params: { pressure: mockData2, temperature: mockData1 },
          })
          .then((res) => {
            if (res.data.status == 200) {
              this.productionData.pressure = mockData2;
            }
          });
      }, 1000);
    },
    // test获取Mysql数据给折线图
    infoData() {
      let bar2 = echarts.init(document.querySelector(".bar2"));
      // 指定配置和数据
      const time = (function () {
        // 立即执行函数
        let now = new Date(); // 获得当前的时间
        let res = []; // 存放时间的数组
        let len = 5; // 要存几个时间？
        while (len--) {
          res.unshift(now.toLocaleTimeString().replace(/^\D*/, "")); // 转换时间，大家可以打印出来看一下
          now = new Date(+now - 1000); // 延迟几秒存储一次？
        }
        return res;
      })();
      const dataOne = (function () {
        // 5个随机数，大家可随意定义
        let res = [];
        let len = 5;
        while (len--) {
          res.push(Math.round(Math.random() * 1000));
        }
        return res;
      })();
      const dataTwo = (function () {
        // 5个随机数
        let res = [];
        let len = 5;
        while (len--) {
          res.push(Math.round(Math.random() * 1000));
        }
        return res;
      })();
      //配置项，可以去查一下官方文档
      let options = {
        title: {
          text: "动态",
          textStyle: {
            color: "black",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#283b56",
            },
          },
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ["bar", "line", "stack"] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          data: time, // 把时间组成的数组接过来，放在x轴上
          boundaryGap: true,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: dataOne,
            type: "line",
            name: "原料罐液位",
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
          {
            data: dataTwo,
            name: "反应罐液位",
            type: "line",
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
        ],
      };
      setInterval(() => {
        let nowTime = new Date().toLocaleTimeString().replace(/^\D*/, "");
        time.shift();
        time.push(nowTime);
        this.$axios.get("http://127.0.0.1/factory/getLevel").then((res) => {
          let data = res.data;

          const element = Object.values(this.showData(data));
          dataOne.shift();
          dataOne.push(element[2]);
          dataTwo.shift();
          dataTwo.push(element[1]);
        });
        bar2.setOption({
          xAxis: [
            {
              data: time,
            },
          ],
          series: [
            {
              data: dataOne,
            },
            {
              data: dataTwo,
            },
          ],
        });
      }, 1000);
      bar2.setOption(options);

      // 让图标跟随屏幕自动的去缩放;
      // window.addEventListener("resize", () => {
      //   bar2.resize();
      // });
    },
    getRandomData() {
      var chartDom = document.getElementById("test_ecarts");
      var myChart = echarts.init(chartDom);
      // 指定配置和数据
      const time = (function () {
        // 立即执行函数
        let now = new Date(); // 获得当前的时间
        let res = []; // 存放时间的数组
        let len = 10; // 要存几个时间？
        while (len--) {
          res.unshift(now.toLocaleTimeString().replace(/^\D*/, "")); // 转换时间，大家可以打印出来看一下
          now = new Date(+now - 1000); // 延迟几秒存储一次？
        }
        return res;
      })();
      const dataOne = (function () {
        // 5个随机数，大家可随意定义
        let res = [];
        let len = 10;
        while (len--) {
          res.push(Math.round(Math.random() * 1000));
        }
        return res;
      })();
      //配置项，可以去查一下官方文档
      let options = {
        title: {
          text: "动态",
          textStyle: {
            color: "black",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#283b56",
            },
          },
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ["bar", "line", "stack"] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          data: time, // 把时间组成的数组接过来，放在x轴上
          boundaryGap: true,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: dataOne,
            type: "line",
          },
        ],
      };
      setInterval(() => {
        let nowTime = new Date().toLocaleTimeString().replace(/^\D*/, "");
        time.shift();
        time.push(nowTime);
        this.$axios.get("http://127.0.0.1/factory/getLevel").then((res) => {
          let data = res.data;

          const element = Object.values(this.showData(data));
          dataOne.shift();
          dataOne.push(element[0]);
        });

        myChart.setOption({
          xAxis: [
            {
              data: time,
            },
          ],
          series: [
            {
              data: dataOne,
            },
          ],
        });
      }, 1000);
      myChart.setOption(options);
    },
    //压力传感器
    getPressure() {
      let pieDemo = echarts.init(document.querySelector(".pieDemo"));
      // 指定配置和数据
      const time = (function () {
        // 立即执行函数
        let now = new Date(); // 获得当前的时间
        let res = []; // 存放时间的数组
        let len = 10; // 要存几个时间？
        while (len--) {
          res.unshift(now.toLocaleTimeString().replace(/^\D*/, "")); // 转换时间，大家可以打印出来看一下
          now = new Date(+now - 1000); // 延迟几秒存储一次？
        }
        return res;
      })();
      const dataOne = (function () {
        // 5个随机数，大家可随意定义
        let res = [];
        let len = 10;
        while (len--) {
          res.push(Math.round(Math.random() * 1000));
        }
        return res;
      })();
      //配置项，可以去查一下官方文档
      let options = {
        title: {
          text: "动态",
          textStyle: {
            color: "black",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#283b56",
            },
          },
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ["bar", "line", "stack"] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          data: time, // 把时间组成的数组接过来，放在x轴上
          boundaryGap: true,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: dataOne,
            type: "line",
          },
        ],
      };
      setInterval(() => {
        let nowTime = new Date().toLocaleTimeString().replace(/^\D*/, "");
        time.shift();
        time.push(nowTime);
        this.$axios.get("http://127.0.0.1/factory/getProdution").then((res) => {
          let data = res.data;

          const element = Object.values(data[data.length - 1]);
          dataOne.shift();
          dataOne.push(element[0]);
        });

        pieDemo.setOption({
          xAxis: [
            {
              data: time,
            },
          ],
          series: [
            {
              data: dataOne,
            },
          ],
        });
      }, 1000);
      pieDemo.setOption(options);
    },
    /* 获取当前时间 */
    getNowDate(val) {
      return this.dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    },
    getTime() {
      setInterval(() => {
        this.nowDate = new Date().getTime();
      }, 1000);
    },
    //返回系统界面
    back_btn() {
      this.$router.push("/layout/main", () => {});
    },
    //鼠标点击事件
    test() {
      document.addEventListener("dblclick", this.onMouseClick, false);
    },
    onMouseClick(event) {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;

      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      // 计算物体和射线的焦点
      let intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      );

      // 获取选中最近的 Mesh 对象
      if (
        intersects.length !== 0 &&
        intersects[0].object instanceof THREE.Mesh
      ) {
        let selectObject = intersects[0].object;
        let highLightObj = this.highLightObj;
        highLightObj.push(selectObject);
        // this.outlineObj(highLightObj);//模型高亮
        this.showObject(selectObject, event);
      }
    },
    onMouseMove() {
      this.isShow = false;
      this.isShowTask = false;
      this.isShowParts = false;
      this.isShowOil = false;
      this.isShowR = false;
      this.isShowM = false;
      this.isShowP = false;
    },

    showObject(obj) {
      console.log(obj);
      let key = obj.name;
      let objs = this.cabinetData.filter((item) => {
        return item.code === key;
      });
      // 显示内容，高亮
      if (objs.length > 0) {
        this.isShow = true;
        this.texts = objs[0];
        if (this.texts.code === "Mesh_2") {
          //原料车间
          this.$axios
            .get("http://127.0.0.1/factory/working", {
              params: { workshop: "原料车间" },
            })
            .then((res) => {
              this.tasks.isWorking = res.data.length;
              this.$axios
                .get("http://127.0.0.1/factory/acceptable", {
                  params: { workshop: "原料车间" },
                })
                .then((res) => {
                  this.tasks.acceptable = res.data.length;
                });
            });
          this.isShowTask = true;
        }
        if (this.texts.code === "Mesh_2_4") {
          //成瓷车间
          this.$axios
            .get("http://127.0.0.1/factory/working", {
              params: { workshop: "成瓷车间" },
            })
            .then((res) => {
              this.tasks.isWorking = res.data.length;
              this.$axios
                .get("http://127.0.0.1/factory/acceptable", {
                  params: { workshop: "成瓷车间" },
                })
                .then((res) => {
                  this.tasks.acceptable = res.data.length;
                });
            });
          this.isShowTask = true;
        }
        if (this.texts.code === "Mesh_2_2") {
          //烧成车间
          this.$axios
            .get("http://127.0.0.1/factory/working", {
              params: { workshop: "烧成车间" },
            })
            .then((res) => {
              this.tasks.isWorking = res.data.length;
              this.$axios
                .get("http://127.0.0.1/factory/acceptable", {
                  params: { workshop: "烧成车间" },
                })
                .then((res) => {
                  this.tasks.acceptable = res.data.length;
                });
            });
          this.isShowTask = true;
        }
        if (this.texts.code === "Mesh_2_1") {
          //彩瓷车间
          this.$axios
            .get("http://127.0.0.1/factory/working", {
              params: { workshop: "彩瓷车间" },
            })
            .then((res) => {
              this.tasks.isWorking = res.data.length;
              this.$axios
                .get("http://127.0.0.1/factory/acceptable", {
                  params: { workshop: "彩瓷车间" },
                })
                .then((res) => {
                  this.tasks.acceptable = res.data.length;
                });
            });
          this.isShowTask = true;
        }
        if (this.texts.code === "Obj3d66-9137221-10849-21") {
          //备品备件库房
          this.isShowParts = true;
        }
        if (this.texts.code === "Obj3d66-9137221-8892-162_2") {
          //润滑油品库房
          this.isShowOil = true;
        }
        if (this.texts.code === "Obj3d66-818680-10293-883_3") {
          //反应罐
          this.$axios.get("http://127.0.0.1/factory/getLevel").then((res) => {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              const element = Object.values(data[i]);
              this.rLevel.push(element[1]);
              this.rTemp.push(element[0]);
            }
          });
          setInterval(() => {
            this.productionData.rLevel = this.showData(this.rLevel);
            this.productionData.rTemp = this.showData(this.rTemp);
          }, 1000);
          this.isShowR = true;
        }
        if (this.texts.code === "Obj3d66-818680-6586-410") {
          //原料罐
          this.$axios.get("http://127.0.0.1/factory/getLevel").then((res) => {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              const element = Object.values(data[i]);
              this.mLevel.push(element[2]);
            }
          });
          setInterval(() => {
            this.productionData.mLevel = this.showData(this.mLevel);
          }, 1000);
          this.isShowM = true;
        }
        if (this.texts.code === "网格211_14") {
          this.isShowP = true;
        }
      }
    },
    showData(arr) {
      var i = arr[Math.floor(Math.random() * arr.length)];
      return i;
    },
    //高亮显示模型（呼吸灯）
    outlineObj(highLightObj) {
      // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
      this.composer = new EffectComposer(this.renderer);
      // 新建一个场景通道  为了覆盖到原理来的场景上
      this.renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(this.renderPass);
      // 物体边缘发光通道
      this.outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera,
        highLightObj
      );
      this.outlinePass.highLightObj = highLightObj;
      this.outlinePass.edgeStrength = 10.0; // 边框的亮度
      this.outlinePass.edgeGlow = 1; // 光晕[0,1]
      this.outlinePass.usePatternTexture = false; // 是否使用父级的材质
      this.outlinePass.edgeThickness = 1.0; // 边框宽度
      this.outlinePass.downSampleRatio = 1; // 边框弯曲度
      this.outlinePass.pulsePeriod = 5; // 呼吸闪烁的速度
      this.outlinePass.visibleEdgeColor.set(parseInt(0xffffff)); // 呼吸显示的颜色
      this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
      this.outlinePass.clear = true;
      this.composer.addPass(this.outlinePass);
      // 自定义的着色器通道 作为参数
      var effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms.resolution.value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      effectFXAA.renderToScreen = true;
      this.composer.addPass(effectFXAA);
    },

    // 初始化
    init() {
      this.createScene(); // 创建场景
      this.loadGLTF1(); // 加载GLTF模型
      this.loadGLTF2();
      this.loadGLTF3();
      this.loadGLTF4();
      this.loadGLTF5();
      this.loadGLTF6();
      this.loadGLTF7();
      this.loadGLTF8();
      this.loadGLTF9();
      this.createLight(); // 创建光源
      this.createCamera(); // 创建相机
      this.createRender(); // 创建渲染器
      this.createControls(); // 创建控件对象
      this.render(); // 渲染
      this.initTubeModel();
    },

    //管道点位
    initTubeModel() {
      var pointsArr = [
        [420, 0, 50],
        [210, 0, 50],
        [210, 0, -100],
        [150, 0, -100],
        [150, 0, 70],
        // [-100, 0, 50],
        // [10, 0, 50],
        // [10, 0, 240],
        // [-270, 0, 240],
        // [-270, 0, 180],
        // [-460, 0, 190],
        // [-460, 0, -40],
        // [-250, 0, -60],
        // [-250, 0, -190],
        // [-350, 0, -200],
        // [-350, 0, -260],
        // [-300, 0, -300],
        // [30, 0, -300]
      ];
      var curve = this.createPath(pointsArr);
      var tubeGeometry = new THREE.TubeGeometry(curve, 1000, 0.5, 100, false);
      var textureLoader = new THREE.TextureLoader();
      this.texture = textureLoader.load(water); //./ZS箭头.svg  ./arrow.jpg
      // 设置阵列模式为 RepeatWrapping
      this.texture.wrapS = THREE.RepeatWrapping;
      this.texture.wrapT = THREE.RepeatWrapping;
      this.texture.repeat.x = 50;
      this.texture.repeat.y = 2;
      // this.texture.offset.y = 0.5;

      var tubeMaterial = new THREE.MeshPhongMaterial({
        map: this.texture,
        transparent: true,
        color: 0x47d8fa,
        side: THREE.DoubleSide,
        //opacity: 0.4,
      });

      // 设置数组材质对象作为网格模型材质参数
      var mesh = new THREE.Mesh(tubeGeometry, tubeMaterial); //网格模型对象Mesh
      mesh.position.y = 2;
      mesh.rotateZ(3.14);
      mesh.scale.set(2, 2, 2);
      this.scene.add(mesh); //网格模型添加到场景中
    },
    //
    createPath(pointsArr) {
      pointsArr = pointsArr.map((point) => new THREE.Vector3(...point)); // 将参数数组转换成点数组的形式
      // 方法一：自定义三维路径 curvePath
      const path = new THREE.CurvePath();
      for (let i = 0; i < pointsArr.length - 1; i++) {
        const lineCurve = new THREE.LineCurve3(pointsArr[i], pointsArr[i + 1]); // 每两个点之间形成一条三维直线
        path.curves.push(lineCurve); // curvePath有一个curves属性，里面存放组成该三维路径的各个子路径
      }
      return path;
    },

    // 创建场景
    createScene() {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(this.scene.background, 3000, 5000);
    },
    // 加载GLTF模型

    //Demo1 蓝色房子
    loadGLTF1() {
      const loader1 = new GLTFLoader();
      loader1.load(this.publicPath + "static/geeDemo/Demo1.gltf", (model) => {
        model.scene.children[0].position.set(-100, 0, 270);
        model.scene.children[0].scale.set(5, 5, 5);
        this.scene.add(model.scene.children[0]);
      });

      //Demo2 红色车间
    },
    loadGLTF2() {
      const loader2 = new GLTFLoader();
      loader2.load(this.publicPath + "static/geeDemo/Demo2.gltf", (model) => {
        model.scene.children[0].scale.set(10, 10, 10);
        this.scene.add(model.scene.children[0]);
      });
    },

    //Demo3 粮仓
    loadGLTF3() {
      const loader1 = new GLTFLoader();
      loader1.load(this.publicPath + "static/geeDemo/Demo3.gltf", (model) => {
        model.scene.children[0].position.set(-300, 0, -200);
        model.scene.children[0].scale.set(5, 5, 5);
        this.scene.add(model.scene.children[0]);
      });
      const loader2 = new GLTFLoader();
      loader2.load(this.publicPath + "static/geeDemo/Demo3.gltf", (model) => {
        model.scene.children[0].position.set(-400, 0, -200);
        model.scene.children[0].scale.set(5, 5, 5);
        this.scene.add(model.scene.children[0]);
      });
    },

    //Demo4 水箱
    loadGLTF4() {
      const loader4 = new GLTFLoader();
      loader4.load(this.publicPath + "static/geeDemo/Demo4.gltf", (model) => {
        model.scene.children[0].position.set(-400, 0, 100);
        model.scene.children[0].scale.set(10, 10, 10);
        this.scene.add(model.scene.children[0]);
      });
    },

    //Demo5 巡逻车
    loadGLTF5() {
      //参考路径上取1000个点，可以将模型安置在某个点位上
      const pathPoints = this.patrolCar.getPoints(1000);

      //引入三维模型
      const loader1 = new GLTFLoader();
      for (let i = 0; i < 4; i++) {
        loader1.load(this.publicPath + "static/geeDemo/Demo5.gltf", (model) => {
          //巡逻车方向
          // model.scene.children[0].traverse(function(child){
          //   child.name="patrolCar";
          // })
          // console.log(model.scene.children[0]);
          this.meshArr[i] = model.scene.children[0];
          //这里就是将模型安置在i*333这个点位上
          this.meshArr[i].position.set(
            pathPoints[i * 250].x,
            pathPoints[i * 250].y,
            pathPoints[i * 250].z
          );
          // model.scene.children[0].rotation.set(0,0,0,"XYZ")   //z:-400~1000，x:-600~400
          //巡逻车巡逻距离
          // model.scene.children[0].position.set(-600,0,-400)   //z:-400~1000，x:-600~400
          // model.scene.children[0].scale.set(15,15,15);
          // this.scene.add(model.scene.children[0]);
          this.meshArr[i].scale.set(15, 15, 15);
          this.scene.add(this.meshArr[i]);

          //绘制一条路径参考线
          const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
          const material = new THREE.LineBasicMaterial({
            color: 0xf00,
            linewidth: 1,
          });
          const curveObject = new THREE.Line(geometry, material);
          this.scene.add(curveObject);
        });
      }
    },

    //Demo6 车间
    loadGLTF6() {
      const loader1 = new GLTFLoader();
      loader1.load(this.publicPath + "static/geeDemo/Demo6.gltf", (model) => {
        model.scene.children[0].position.set(-340, 0, 550);
        model.scene.children[0].scale.set(10, 10, 10);
        this.scene.add(model.scene.children[0]);
      });
      const loader2 = new GLTFLoader();
      loader2.load(this.publicPath + "static/geeDemo/Demo6.gltf", (model) => {
        model.scene.children[0].position.set(50, 0, 550);
        model.scene.children[0].scale.set(10, 10, 10);
        this.scene.add(model.scene.children[0]);
      });
      const loader3 = new GLTFLoader();
      loader3.load(this.publicPath + "static/geeDemo/Demo6.gltf", (model) => {
        model.scene.children[0].position.set(-340, 0, 800);
        model.scene.children[0].scale.set(10, 10, 10);
        this.scene.add(model.scene.children[0]);
      });
      const loader4 = new GLTFLoader();
      loader4.load(this.publicPath + "static/geeDemo/Demo6.gltf", (model) => {
        model.scene.children[0].position.set(50, 0, 800);
        model.scene.children[0].scale.set(10, 10, 10);
        this.scene.add(model.scene.children[0]);
      });
    },
    //Demo7 卡车
    loadGLTF7() {
      // const truckPathPoints = this.truckCar.getPoints(1000);
      // //绘制一条路径参考线
      // const geometry = new THREE.BufferGeometry().setFromPoints(
      //   truckPathPoints
      // );
      // const material = new THREE.LineBasicMaterial({
      //   color: 0x4488ff,
      //   linewidth: 1,
      // });
      // const curveObject = new THREE.Line(geometry, material);
      // this.scene.add(curveObject);

      //导入模型
      const loader1 = new GLTFLoader();
      loader1.load(this.publicPath + "static/geeDemo/Demo9.gltf", (model) => {
        model.scene.children[0].position.set(-900, 0, 350);
        model.scene.children[0].rotation.set(0, Math.PI / 2, 0, "XZY");
        this.truck[0] = model.scene.children[0];
        model.scene.children[0].scale.set(13, 13, 13);
        this.scene.add(model.scene.children[0]);
      });
    },
    //Demo5 巡检车
    loadGLTF8() {
      //导入模型
      const loader1 = new GLTFLoader();
      loader1.load(this.publicPath + "static/geeDemo/Demo5.gltf", (model) => {
        model.scene.children[0].position.set(-900, 0, 480);
        model.scene.children[0].rotation.set(0, Math.PI / 2, 0, "XZY");
        this.check[0] = model.scene.children[0];
        model.scene.children[0].scale.set(15, 15, 15);
        this.scene.add(model.scene.children[0]);
      });
    },
    loadGLTF9() {
      //导入模型
      const loader1 = new GLTFLoader();
      loader1.load(this.publicPath + "static/geeDemo/Demo10.gltf", (model) => {
        model.scene.children[0].position.set(-600, 0, 100);
        model.scene.children[0].rotation.set(0, -Math.PI / 2, 0, "XZY");
        this.check[0] = model.scene.children[0];
        model.scene.children[0].scale.set(3, 3, 3);
        this.scene.add(model.scene.children[0]);
      });
    },

    //卡车启动
    carStart() {
      this.$axios.get("http://127.0.0.1/factory/changeTask").then((res) => {
        if (res.data.status == 200) {
          let resData = res.data.data;
          console.log(resData);
          this.changeId = resData[0].id;
          this.operate = resData[0].operate;
          this.quantity = resData[0].quantity;
          this.tx = resData[0].x;
          this.ty = resData[0].y;
          this.tz = resData[0].z;
          if (this.tx == "250" && this.tz == "-50") {
            this.whatH = true;
          }
          this.carRender();
        }
      });
    },
    //巡检车启动
    checkCarStart() {
      this.$axios.get("http://127.0.0.1/factory/checkTask").then((res) => {
        if (res.data.status == 200) {
          let resData = res.data.data;
          let workshop = resData[0].workshop;
          this.itemId = resData[0].id;
          this.$axios
            .get("http://127.0.0.1/factory/getPosition", {
              params: { workshop: workshop },
            })
            .then((res) => {
              let p = res.data[0];
              this.checkPosition = p;
              this.cx = this.checkPosition.x;
              this.cy = this.checkPosition.y;
              this.cz = this.checkPosition.z;
            });
          this.checkCarRender();
        }
      });
    },
    //卡车停止
    carStop() {
      cancelAnimationFrame(this.requestAnimationId);
      setTimeout(() => {
        this.$axios
          .get("http://127.0.0.1/factory/finishChange", {
            params: { id: this.changeId },
          })
          .then((res) => {
            if (res.data.status == 200) {
              // console.log("操作完成");
              // console.log(this.truck[0].position);
              let quantity = Number(this.quantity);
              let a = parseInt(this.truck[0].position.x);
              a = String(a);
              let b = parseInt(this.truck[0].position.z);
              b = String(b);
              if (this.operate === "出库") {
                if (a == 250 && b == -50) {
                  this.inventory.pexit = this.inventory.pexit + quantity;
                } else {
                  this.inventory.oexit = this.inventory.oexit + quantity;
                }
                quantity = -quantity;
              } else if (this.operate === "入库") {
                if (a == 250 && b == -50) {
                  this.inventory.pentry = this.inventory.pentry + quantity;
                } else {
                  this.inventory.oentry = this.inventory.oentry + quantity;
                }
              }
              this.$axios
                .get(
                  this.whatH
                    ? "http://127.0.0.1/factory/updateQuantity"
                    : "http://127.0.0.1/factory/updateOil",
                  {
                    params: { quantity: quantity, id: this.changeId },
                  }
                )
                .then((res) => {
                  if (res.data.status == 200) {
                    let inventoryRecord = {
                      id: "",
                      quantity: "",
                      latestTime: "",
                      executor: "",
                      operate: "",
                    };
                    inventoryRecord.id = this.changeId;
                    inventoryRecord.quantity = this.quantity;
                    inventoryRecord.latestTime = this.getNowDate(this.nowDate);
                    inventoryRecord.executor = this.activeUser[1];
                    inventoryRecord.operate = this.operate;
                    this.$axios
                      .get("http://127.0.0.1/inventoryRecord/createRecord", {
                        params: { form: inventoryRecord },
                      })
                      .then((res) => {
                        if (res.data.status == 200) {
                          this.$message.success("库存更新成功");
                        }
                      });
                  }
                });
            }
          });
      }, 1000);
    },
    //巡检完成
    checkCarStop() {
      cancelAnimationFrame(this.checkAnimation);
      setTimeout(() => {
        this.$axios
          .get("http://127.0.0.1/checkTask/finish", {
            params: { id: this.itemId },
          })
          .then((res) => {
            if (res.data.status == 200) {
              this.$message.success("巡检任务完成");
            }
          });
      }, 1000);
    },
    getCP() {
      let a = parseInt(this.check[0].position.x);
      a = String(a);
      let b = parseInt(this.check[0].position.z);
      b = String(b);
      if (a == this.cx && b == this.cz) {
        this.$message.success("到达巡检点");
        this.checkCarStop();
      }
    },
    getTP() {
      let a = parseInt(this.truck[0].position.x);
      a = String(a);
      let b = parseInt(this.truck[0].position.z);
      b = String(b);
      if (a == this.tx && b == this.tz) {
        console.log("到达目的仓库");
        this.carStop();
      }
    },
    carRender() {
      if (this.truckPath[0] === 0) {
        this.truckPath[0] = 1000;
      }
      this.truckPath[0] -= 1;
      //取相参考径上当前点的坐标
      const sphereCurveIndex = this.truckPath[0] / 1000; //取值0~1
      const tmpSpherePosition = this.truckCar.getPointAt(sphereCurveIndex);
      this.truck[0].position.set(
        tmpSpherePosition.x,
        tmpSpherePosition.y,
        tmpSpherePosition.z
      );
      //这个部分是处理小车的模型始终与切线相切，这样就能让小车始终围绕曲线中心运动
      // 当前点在线条上的位置
      this.truck[0].position.copy(tmpSpherePosition);
      // 返回一个点t在曲线上位置向量的法线向量
      const tangent = this.truckCar.getTangentAt(sphereCurveIndex);
      // 位置向量和切线向量相加即为所需朝向的点向量
      const lookAtVec = tangent.add(tmpSpherePosition);
      this.truck[0].lookAt(lookAtVec);
      //统一改变模型车头车尾的方向，使车头朝前（可以注释掉看一下）
      this.truck.forEach((item) => {
        item.rotateY(Math.PI);
      });
      this.requestAnimationId = requestAnimationFrame(this.carRender);
      this.getTP();
    },
    checkCarRender() {
      if (this.checkPath[0] === 0) {
        this.checkPath[0] = 1000;
      }
      this.checkPath[0] -= 1;
      //取相参考径上当前点的坐标
      const sphereCurveIndex = this.checkPath[0] / 1000; //取值0~1
      const tmpSpherePosition = this.checkCar.getPointAt(sphereCurveIndex);
      this.check[0].position.set(
        tmpSpherePosition.x,
        tmpSpherePosition.y,
        tmpSpherePosition.z
      );
      //这个部分是处理小车的模型始终与切线相切，这样就能让小车始终围绕曲线中心运动
      // 当前点在线条上的位置
      this.check[0].position.copy(tmpSpherePosition);
      // 返回一个点t在曲线上位置向量的法线向量
      const tangent = this.checkCar.getTangentAt(sphereCurveIndex);
      // 位置向量和切线向量相加即为所需朝向的点向量
      const lookAtVec = tangent.add(tmpSpherePosition);
      this.check[0].lookAt(lookAtVec);
      //统一改变模型车头车尾的方向，使车头朝前（可以注释掉看一下）
      this.check.forEach((item) => {
        item.rotateY(Math.PI);
      });
      this.checkAnimation = requestAnimationFrame(this.checkCarRender);
      this.getCP();
    },

    // 创建光源
    createLight() {
      // 环境光
      // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // 创建环境光
      // this.scene.add(ambientLight); // 将环境光添加到场景

      // const spotLight = new THREE.SpotLight(0xffffff); // 创建聚光灯
      // spotLight.position.set(150, 150, 150);
      // spotLight.castShadow = true;
      // this.scene.add(spotLight);

      let directionalLight = new THREE.DirectionalLight(0xffffff, 0.3); //模拟远处类似太阳的光源
      directionalLight.color.setHSL(0.5, 0.5, 0.8);
      directionalLight.position.set(0, 200, 0).normalize();
      this.scene.add(directionalLight);

      let ambient = new THREE.AmbientLight(0xffffff, 1); //AmbientLight,影响整个场景的光源
      ambient.position.set(0, 0, 0);
      this.scene.add(ambient);
    },
    // 创建相机
    createCamera() {
      // const element = document.getElementById("container");
      // const width = element.clientWidth; // 窗口宽度
      // const height = element.clientHeight; // 窗口高度
      // const k = width / height; // 窗口宽高比
      // // PerspectiveCamera( fov, aspect, near, far )
      // this.camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000);
      // this.camera.position.set(150, 150, 150); // 设置相机位置

      // this.camera.lookAt(new THREE.Vector3(10, 40, 0)); // 设置相机方向

      this.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        3000
      );
      this.camera.position.set(0, 200, 280);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.scene.add(this.camera);
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById("container");
      // this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      // this.renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
      // this.renderer.shadowMap.enabled = true; // 显示阴影
      // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // // this.renderer.setClearColor(0x3f3f3f, 1); // 设置背景颜色
      // this.renderer.setClearColor(0xf5f5f5, 1); // 设置背景颜色
      // element.appendChild(this.renderer.domElement);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x4682b4, 1.0); // 渲染场景的颜色
      this.renderer.setPixelRatio(window.devicePixelRatio);
      element.appendChild(this.renderer.domElement);
    },

    render() {
      //参考路径的索引由每个汽车的位置逐渐向0减少，然后又设为1001使其做往复运动
      if (this.shperePathIndex[0] === 0) {
        this.shperePathIndex[0] = 1001;
      }
      if (this.shperePathIndex[1] === 0) {
        this.shperePathIndex[1] = 1001;
      }
      if (this.shperePathIndex[2] === 0) {
        this.shperePathIndex[2] = 1001;
      }
      if (this.shperePathIndex[3] === 0) {
        this.shperePathIndex[3] = 1001;
      }
      this.shperePathIndex[1] -= 1;
      this.shperePathIndex[0] -= 1;
      this.shperePathIndex[2] -= 1;
      this.shperePathIndex[3] -= 1;
      // 设置小车的位置为参考路径上当前点的位置
      if (this.meshArr[0]) {
        //取相参考径上当前点的坐标
        const sphereCurveIndex = this.shperePathIndex[0] / 1000; //取值0~1
        const tmpSpherePosition = this.patrolCar.getPointAt(sphereCurveIndex);
        this.meshArr[0].position.set(
          tmpSpherePosition.x,
          tmpSpherePosition.y,
          tmpSpherePosition.z
        );
        //这个部分是处理小车的模型始终与切线相切，这样就能让小车始终围绕曲线中心运动
        // 当前点在线条上的位置
        this.meshArr[0].position.copy(tmpSpherePosition);
        // 返回一个点t在曲线上位置向量的法线向量
        const tangent = this.patrolCar.getTangentAt(sphereCurveIndex);
        // 位置向量和切线向量相加即为所需朝向的点向量
        const lookAtVec = tangent.add(tmpSpherePosition);
        this.meshArr[0].lookAt(lookAtVec);
      }
      if (this.meshArr[1]) {
        //取相参考径上当前点的坐标
        const sphereCurveIndex = this.shperePathIndex[1] / 1000; //取值0~1
        const tmpSpherePosition = this.patrolCar.getPointAt(sphereCurveIndex);
        this.meshArr[1].position.set(
          tmpSpherePosition.x,
          tmpSpherePosition.y,
          tmpSpherePosition.z
        );
        //这个部分是处理小车的模型始终与切线相切，这样就能让小车始终围绕曲线中心运动
        // 当前点在线条上的位置
        this.meshArr[1].position.copy(tmpSpherePosition);
        // 返回一个点t在曲线上位置向量的法线向量
        const tangent = this.patrolCar.getTangentAt(sphereCurveIndex);
        // 位置向量和切线向量相加即为所需朝向的点向量
        const lookAtVec = tangent.add(tmpSpherePosition);
        this.meshArr[1].lookAt(lookAtVec);
      }
      if (this.meshArr[2]) {
        //取相参考径上当前点的坐标
        const sphereCurveIndex = this.shperePathIndex[2] / 1000; //取值0~1
        const tmpSpherePosition = this.patrolCar.getPointAt(sphereCurveIndex);
        this.meshArr[2].position.set(
          tmpSpherePosition.x,
          tmpSpherePosition.y,
          tmpSpherePosition.z
        );
        //这个部分是处理小车的模型始终与切线相切，这样就能让小车始终围绕曲线中心运动
        // 当前点在线条上的位置
        this.meshArr[2].position.copy(tmpSpherePosition);
        // 返回一个点t在曲线上位置向量的法线向量
        const tangent = this.patrolCar.getTangentAt(sphereCurveIndex);
        // 位置向量和切线向量相加即为所需朝向的点向量
        const lookAtVec = tangent.add(tmpSpherePosition);
        this.meshArr[2].lookAt(lookAtVec);
      }
      if (this.meshArr[3]) {
        //取相参考径上当前点的坐标
        const sphereCurveIndex = this.shperePathIndex[3] / 1000; //取值0~1
        const tmpSpherePosition = this.patrolCar.getPointAt(sphereCurveIndex);
        this.meshArr[3].position.set(
          tmpSpherePosition.x,
          tmpSpherePosition.y,
          tmpSpherePosition.z
        );
        //这个部分是处理小车的模型始终与切线相切，这样就能让小车始终围绕曲线中心运动
        // 当前点在线条上的位置
        this.meshArr[3].position.copy(tmpSpherePosition);
        // 返回一个点t在曲线上位置向量的法线向量
        const tangent = this.patrolCar.getTangentAt(sphereCurveIndex);
        // 位置向量和切线向量相加即为所需朝向的点向量
        const lookAtVec = tangent.add(tmpSpherePosition);
        this.meshArr[3].lookAt(lookAtVec);
      }
      //统一改变模型车头车尾的方向，使车头朝前（可以注释掉看一下）
      this.meshArr.forEach((item) => {
        item.rotateY(Math.PI);
      });
      // if (this.mesh) {
      //   this.mesh.rotation.z += 0.006;
      // }
      // this.patrolCar = this.scene.getObjectByName("patrolCar");
      // console.log(this.scene.getObjectByName("patrolCar"));
      // console.log(this.patrolCar);
      // this.patrolCar.position.x+=0.01;
      // this.patrolCar.rotation.x+=0.01;
      // if(this.patrolCar.position.x>1000){
      //   this.patrolCar.position.x=0;
      // }
      TWEEN.update();
      /* eslint-disable */
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render);
      if (this.composer) {
        this.composer.render();
      }
      // this.texture.offset.x = 0.4
    },
    // 创建控件对象
    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.2;
      // 视角最小距离
      this.controls.minDistance = 100;
      // 视角最远距离
      this.controls.maxDistance = 5000;
      // 最大角度
      this.controls.maxPolarAngle = Math.PI / 1.9;
      // this.controls.maxPolarAngle = 0;
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>

  <style lang='less' scoped>
.clickable {
  -webkit-app-region: no-drag;
}
::-webkit-scrollbar {
  width: 8px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
::-webkit-scrollbar-thumb {
  background-color: rgb(147, 147, 153, 0.5);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
#container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #4682b4;
  position: relative;
}
.title-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100px;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  color: #eeeeee;
}
.title-view .title-left {
  width: 25%;
}
.title-view .title-left .back-btn {
  width: 80px;
  border-radius: 0 0 5px 0;
  text-align: center;
  background: #2e3755;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #efefef;
  padding: 10px;
}
.title-view .title-left .back-btn:hover {
  cursor: pointer;
  color: #2e3755;
  background: #70b4de;
}
.title-view .title-center {
  width: 50%;
  text-align: center;
  position: relative;
  left: -331px;
}
// .title-view .title-center img {
//   width: auto;
//   height: 60px;
// }
.title-view .title-center .text {
  position: absolute;
  top: 0;
  width: 100%;
  padding-top: 5px;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}
.title-view .title-right {
  width: 25%;
  padding: 15px;
  left: 1100px;
  position: relative;
  top: -46px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: right;
}
.moveText {
  padding: 10px;

  p {
    font-size: 20px;
    text-align: left;
    color: #fff;
  }
}

#test_ecarts {
  width: 85%;
  height: 200px;
  position: relative;
  top: 60px;
  left: 20px;
}
.title1 {
  position: relative;
  left: 195px;
  top: -175px;
  color: #efefefdf;
  font-weight: bold;
}

#bar2 {
  width: 85%;
  height: 200px;
  position: relative;
  top: 60px;
  left: 20px;
}
.title2 {
  position: relative;
  left: 195px;
  top: -175px;
  color: #efefefdf;
  font-weight: bold;
}
#pieDemo {
  width: 85%;
  height: 200px;
  position: relative;
  top: 60px;
  left: 20px;
}
.title3 {
  position: relative;
  left: 195px;
  top: -175px;
  color: #efefefdf;
  font-weight: bold;
}
</style>