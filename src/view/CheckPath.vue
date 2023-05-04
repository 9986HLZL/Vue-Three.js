<template>
  <v-app>
    <v-container class="scroll-y" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" md="12">
          <v-card>
            <v-app-bar dark color="2C3A47">
              <v-btn icon>
                <v-icon>local_offer</v-icon>
              </v-btn>
              <v-toolbar-title>巡检路线</v-toolbar-title>
              <!-- 面包屑 -->
              <v-row>
                <v-col>
                  <v-breadcrumbs :items="breadCrumbsItems">
                    <template v-slot:divider>
                      <v-icon>mdi-forward</v-icon>
                    </template>
                  </v-breadcrumbs>
                </v-col>
              </v-row>
              <v-spacer></v-spacer>
              <!-- 添加 -->
              <v-dialog
                v-model="dialog1"
                persistent
                :width="dialogWidth"
                scrollable
                transition="slide-x-reverse-transition"
              >
                <v-card>
                  <v-form
                    ref="form"
                    lazy-validation
                    enctype="multipart/form-data"
                    autocomplete="off"
                  >
                    <v-toolbar dark color="primary">
                      <v-toolbar-title>
                        <v-icon style="padding-bottom: 5px" left>add</v-icon>
                        <span>巡检路线</span>
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn dark icon @click="changeWidth">
                          <v-icon v-if="isPlaying">mdi-crop-free</v-icon>
                          <v-icon v-else>mdi-fullscreen-exit</v-icon>
                        </v-btn>
                        <v-btn icon dark @click="dialog1 = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-toolbar-items>
                    </v-toolbar>

                    <v-card-text class="fixed-card">
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.id"
                              label="编号"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.name"
                              label="名称"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.workshop"
                              :items="items.workshopItems"
                              label="工艺单元"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.executor"
                              :items="items.executorItems"
                              label="路线负责人"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.latestTime"
                              label="最近巡检时间"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.latestExecutor"
                              label="最近巡检人员"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.status"
                              :items="items.statusItems"
                              label="完成状态"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-menu
                              v-model="lastMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="form.lastTime"
                                  label="上一次巡检日期"
                                  append-icon="mdi-clock-outline"
                                  readonly
                                  outlined
                                  clearable
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.lastTime"
                                @input="lastMenu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-menu
                              v-model="nextMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="form.nextTime"
                                  label="下一次巡检日期"
                                  append-icon="mdi-clock-outline"
                                  readonly
                                  outlined
                                  clearable
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.nextTime"
                                @input="nextMenu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.period"
                              label="维护周期/天"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>

                          <v-switch
                            v-if="isEdit"
                            v-model="form.isStart"
                            label="是否启用"
                          ></v-switch>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        v-if="isEdit"
                        @click="checkPoints"
                        dark
                        color="light-green darken-4"
                        outlined
                        small
                        >巡检点集合</v-btn
                      >
                      <v-spacer></v-spacer>
                      <v-btn color="#2C3A47" dark @click="close" outlined small>
                        <v-icon left>mdi-exit-to-app</v-icon> 关闭
                      </v-btn>
                      <v-btn
                        @click.prevent="save"
                        color="light-green darken-4"
                        dark
                        type="submit"
                        outlined
                        small
                      >
                        <v-icon left>save</v-icon> 保存
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
              <!-- 巡检点集合 -->
              <v-dialog v-model="dialog3" persistent max-width="600px">
                <v-card>
                  <v-form
                    ref="loadForm"
                    lazy-validation
                    enctype="multipart/form-data"
                    autocomplete="off"
                  >
                    <v-sheet>
                      <v-toolbar color="#168597">
                        <v-toolbar-title class="white--text"
                          >巡检点集合</v-toolbar-title
                        >
                      </v-toolbar>
                    </v-sheet>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-card-title>
                          <v-text-field
                            v-model="search"
                            append-icon="search"
                            label="搜索"
                            single-line
                            hide-details=""
                            color="#2C3A47"
                          >
                          </v-text-field>
                          <v-spacer></v-spacer>
                          <v-btn
                            @click="addPoint"
                            dark
                            outlined
                            color="#006487"
                          >
                            <v-icon left>add</v-icon>
                            <span style="color: #168597">添加</span>
                          </v-btn>
                        </v-card-title>

                        <v-data-table
                          item-key="id"
                          :headers="checkHeaders"
                          :items="checkPosts"
                        >
                          <!-- 下面：解决v-slot不支持任何修饰符的问题 -->

                          <!-- eslint-disable-next-line -->
                          <template v-slot:item.actions="{ item }">
                            <v-btn
                              color="success"
                              class="mx-2"
                              fab
                              x-small
                              @click="editCheckPoint(item)"
                              outlined
                            >
                              <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn
                              color="pink"
                              fab
                              x-small
                              @click="deleteCheckPoint(item)"
                              outlined
                            >
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </template>
                        </v-data-table>
                        <v-dialog v-model="dialog4" persistent width="392px">
                          <v-card>
                            <v-toolbar dark color="#168597">
                              <v-toolbar-title>
                                <span>添加巡检点</span>
                              </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text style="height: 200px">
                              <v-container grid-list-md>
                                <v-layout wrap>
                                  <v-flex xs12 sm12 md12>
                                    <v-select
                                      v-model="points.check_Point"
                                      :items="pointsItems"
                                      label="巡检点"
                                      outlined
                                      clearable
                                    ></v-select>
                                  </v-flex>
                                  <v-flex xs12 sm12 md12>
                                    <v-text-field
                                      v-model="points.checkSequence"
                                      label="巡检顺序"
                                      outlined
                                      clearable
                                      type="number"
                                    ></v-text-field>
                                  </v-flex>
                                </v-layout>
                              </v-container>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn
                                v-if="isEditPoint"
                                @click="finishCheck"
                                dark
                                color="light-green darken-4"
                                outlined
                                small
                                >完成检查</v-btn
                              >
                              <v-spacer></v-spacer>
                              <v-btn
                                color="#168597"
                                dark
                                @click="dialog4 = false"
                                outlined
                                small
                              >
                                <v-icon left>mdi-exit-to-app</v-icon> 取消
                              </v-btn>
                              <v-btn
                                color="#168597"
                                @click.prevent="savaCheckPoints"
                                dark
                                type="submit"
                                outlined
                                small
                              >
                                <v-icon left>save</v-icon> 提交
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="#2C3A47"
                        dark
                        @click="dialog3 = false"
                        outlined
                        small
                      >
                        <v-icon left>mdi-exit-to-app</v-icon> 关闭
                      </v-btn>
                      <v-btn
                        @click.prevent="dialog3 = false"
                        color="light-green darken-4"
                        dark
                        type="submit"
                        outlined
                        small
                      >
                        <v-icon left>save</v-icon> 提交
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
              <!-- 删除 -->
              <v-dialog v-model="dialog2" width="400px">
                <v-card>
                  <v-sheet>
                    <v-toolbar color="#f07d44">
                      <v-icon color="white">mdi-delete-alert-outline</v-icon>
                      <v-toolbar-title class="white--text"
                        >提示</v-toolbar-title
                      >
                    </v-toolbar>
                  </v-sheet>
                  <v-card>
                    <v-card-text
                      >您确定要删除该数据吗？操作无法撤销</v-card-text
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        style="
                          color: #9e9e9e;
                          background-color: white;
                          border-color: white;
                          font-size: 14px;
                        "
                        dark
                        @click="dialog2 = false"
                        outlined
                        small
                      >
                        取消
                      </v-btn>
                      <v-btn
                        @click="handleDelete"
                        style="
                          color: #006487;
                          background-color: white;
                          border-color: white;
                          font-size: 14px;
                        "
                        dark
                        type="submit"
                        outlined
                        small
                      >
                        确定
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-card>
              </v-dialog>
            </v-app-bar>

            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details=""
                color="#2C3A47"
              >
              </v-text-field>
              <v-btn
                @click="createTask"
                dark
                outlined
                color="#006487"
                style="
                  background-color: white;
                  border-color: white;
                  margin-top: 20px;
                  margin-left: 50px;
                "
              >
                <span style="color: #168597">扫描巡检路线</span>
                <v-icon style="margin-left: 7px" color="#168597"
                  >mdi-refresh</v-icon
                >
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                @click="add"
                class="white--text"
                color="#00879e"
                style="margin-right: 8px"
              >
                <v-icon left>add</v-icon> 添加
              </v-btn>
            </v-card-title>

            <v-data-table
              item-key="id"
              :headers="headers"
              :items="posts"
              :search="search"
            >
              <!-- 下面：解决v-slot不支持任何修饰符的问题 -->
              <!-- eslint-disable-next-line -->
              <template v-slot:item.isStart="{ item }">
                <v-chip :color="getColor(item)" dark>
                  {{ item.isStart == true ? "是" : "否" }}
                </v-chip>
              </template>
              <!-- eslint-disable-next-line -->
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="success"
                  class="mx-2"
                  fab
                  x-small
                  @click="editPost(item)"
                  outlined
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  color="pink"
                  fab
                  x-small
                  @click="deletePost(item)"
                  outlined
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <template v-slot:no-results>
                <v-alert :value="true" color="pink" icon="warning" dark>
                  Your Search {{ search }} does not exist.
                </v-alert>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
  
  <script>
export default {
  name: "CheckPath",

  data() {
    return {
      activeUser: [],
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialogWidth: "600px",
      isChange: false,
      isPlaying: true,
      isEdit: false,
      isDelPoint: false,
      isEditPoint: false,

      itemId: null,
      pathId: null,
      //面包屑
      breadCrumbsItems: [
        {
          text: "巡检管理",
          disabled: true,
          href: "main",
        },
        {
          text: "巡检路线",
          disabled: true,
          href: "checkPath",
        },
      ],

      form: {
        id: "",
        name: "",
        workshop: "",
        status: "",
        latestTime: "",
        latestExecutor: "",
        executor: "",
        lastTime: "",
        nextTime: "",
        period: "",
        isStart: false,
      },
      points: {
        id: "",
        check_Point: "",
        checkSequence: "",
        workshop: "",
      },
      items: {
        workshopItems: ["成瓷车间", "原料车间", "烧成车间", "彩瓷车间"],
        statusItems: ["未开始", "已完成"],
        executorItems: [],
        typeItems: ["设备资料", "技术方案", "操作卡", "操作规程"],
        labelItems: ["静设备", "动设备", "特种设备"],
      },
      pointsItems: [],

      startMenu: "",
      lastMenu: "",
      nextMenu: "",
      endMenu: "",
      search: "",
      headers: [
        {
          text: "路线编号",
          value: "id",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "路线名称",
          value: "name",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "工艺单元",
          value: "workshop",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "是否启用",
          value: "isStart",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "最近巡检时间",
          value: "latestTime",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "最近巡检人员",
          value: "latestExecutor",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "路线负责人",
          value: "executor",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "上一次巡检日期",
          value: "lastTime",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "下一次巡检日期",
          value: "nextTime",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "维护周期",
          value: "period",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "操作",
          value: "actions",
          sortable: false,
          align: "center",
          width: "200px",
        },
      ],
      checkHeaders: [
        {
          text: "巡检点编号",
          value: "check_Point",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "巡检顺序",
          value: "checkSequence",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "操作",
          value: "actions",
          sortable: false,
          align: "center",
          width: "200px",
        },
      ],
      checkPosts: [],
      posts: [],

      default: {
        id: "",
        name: "",
        workshop: "",
        status: "",
        latestTime: "",
        latestExecutor: "",
        executor: "",
        lastTime: "",
        nextTime: "",
        period: "",
        isStart: false,
      },
      editedIndex: -1,
      rules: {
        id: [(val) => (val || "").length > 0 || "工单编号不能为空"],
        name: [(val) => (val || "").length > 0 || "工单名称不能为空"],
        description: [(val) => (val || "").length > 0 || "工单描述不能为空"],
        workshop: [(val) => (val || "").length > 0 || "工艺单元不能为空"],
        status: [(val) => (val || "").length > 0 || "工单状态不能为空"],
        executor: [(val) => (val || "").length > 0 || "执行人不能为空"],
      },
    };
  },
  methods: {
    //初始化获得数据
    infoData() {
      this.$axios
        .get("http://127.0.0.1/checkPath/get")
        .then((res) => {
          this.posts = res.data;
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    getExecutor() {
      this.$axios.get("http://127.0.0.1/user/userGet").then((res) => {
        let person = res.data;
        for (let i = 0; i < person.length; i++) {
          const element = Object.values(person[i]);
          this.items.executorItems.push(element[1]);
        }
      });
    },
    //获得巡检点给到select
    getPoints() {
      this.$axios
        .get("http://127.0.0.1/checkPath/getPoints")
        .then((res) => {
          let points = res.data;
          for (let i = 0; i < points.length; i++) {
            const element = Object.values(points[i]);
            this.pointsItems.push(element);
          }
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    //巡检点集合
    checkPoints() {
      this.dialog3 = true;
      this.$axios
        .get("http://127.0.0.1/checkPath/checkPoints", {
          params: { id: this.pathId },
        })
        .then((res) => {
          this.checkPosts = res.data;
        });
    },
    // 改变对话框的宽度
    changeWidth() {
      this.isPlaying = !this.isPlaying;
      if (!this.isChange) {
        (this.dialogWidth = "100%"), (this.isChange = !this.isChange);
      } else {
        (this.dialogWidth = "600px"), (this.isChange = !this.isChange);
      }
    },
    //点击添加
    add() {
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "巡检组长"
      ) {
        this.dialog1 = true;
        this.form = Object.assign({}, this.default);
        this.editedIndex = -1;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //添加、保存巡检点
    savaCheckPoints() {
      this.$axios
        .get("http://127.0.0.1/checkPoint/getWorkShop", {
          params: { id: this.points.check_Point },
        })
        .then((res) => {
          this.points.workshop = Object.values(res.data[0]);
          this.points.workshop = this.points.workshop[0];
          this.points.id = this.pathId;
          this.points.check_Point = this.points.check_Point[0];
          console.log(this.points);
          this.$axios
            .get("http://127.0.0.1/checkPath/savaCheckPoints", {
              params: { form: this.points },
            })
            .then((res) => {
              if (res.data.status == 200) {
                this.dialog4 = false;
                this.$message.success("保存成功");
                this.checkPoints();
              }
            });
        });
    },
    getColor(item) {
      item.isStart = JSON.parse(item.isStart);
      if (item.isStart == true) return "blue";
      else return "gray";
    },
    close() {
      this.dialog1 = false;
      this.isEdit = false;
      setTimeout(() => {
        this.form = Object.assign({}, this.default); //关闭时，把空对象给到form，即清空
        this.editedIndex = -1;
      }, 300);
    },
    //保存
    save() {
      this.form.isStart = String(this.form.isStart);
      this.$axios
        .get(
          this.isEdit
            ? "http://127.0.0.1/checkPath/update"
            : "http://127.0.0.1/checkPath/add",
          {
            params: { form: this.form },
          }
        )
        .then((res) => {
          if (res.data.status == 200) {
            this.infoData();
            this.isEdit = false;
            this.dialog1 = false;
            this.$message.success("保存成功");
          }
        });
    },
    //编辑巡检路线
    editPost(item) {
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "巡检组长"
      ) {
        this.dialog1 = true;
        this.form = item;
        this.form.isStart = JSON.parse(this.form.isStart);
        this.isEdit = true;
        this.pathId = item.id;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //删除巡检路线
    deletePost(item) {
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "巡检组长"
      ) {
        this.dialog2 = true;
        this.itemId = item.id;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //编辑巡检点
    editCheckPoint(item) {
      this.dialog4 = true;
      this.isEditPoint = true;
      this.points.check_Point = item.check_Point;
      this.points.checkSequence = item.checkSequence;
    },
    //完成检查
    finishCheck() {
      this.isEditPoint = false;
      this.dialog4 = false;
    },
    //删除巡检点
    deleteCheckPoint(item) {
      this.dialog2 = true;
      this.isDelPoint = true;
      this.points.id = this.pathId;
      this.points.check_Point = item.check_Point;
      this.points.checkSequence = item.checkSequence;
    },
    //确认删除
    handleDelete() {
      if (this.isDelPoint) {
        this.$axios
          .get("http://127.0.0.1/checkPath/delPoint", {
            params: { form: this.points },
          })
          .then((res) => {
            if (res.status == 200) {
              this.checkPoints();
              this.dialog2 = false;
              this.isDelPoint = false;
              this.$message.success("删除成功");
            }
          });
      } else {
        this.$axios
          .get("http://127.0.0.1/checkPath/del", {
            params: { id: this.itemId },
          })
          .then((res) => {
            if (res.data.status == 200) {
              this.infoData();
              this.dialog2 = false;
            }
          });
      }
    },
    addPoint() {
      this.dialog4 = true;
    },
    //根据当前时间和随机数生成流水号
    setTimeDateFmt(s) {
      return s < 10 ? "0" + s : s;
    },
    randomNumber() {
      const now = new Date();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let hour = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      month = this.setTimeDateFmt(month);
      hour = this.setTimeDateFmt(hour);
      minutes = this.setTimeDateFmt(minutes);
      seconds = this.setTimeDateFmt(seconds);
      return (
        "GD" +
        now.getFullYear().toString() +
        month.toString() +
        day +
        hour +
        minutes +
        seconds +
        Math.round(Math.random() * 23 + 100).toString()
      );
    },
    //自动生成巡检任务
    createTask() {
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "巡检组长"
      ) {
        let checkTask = {
          id: "",
          workshop: "",
          executor: "",
          status: "",
          check_Point: "",
          pathId: "",
          checkSequence: "",
        };
        for (let i = 0; i < this.posts.length; i++) {
          const element = this.posts[i];
          if (element.isStart === true) {
            this.$axios
              .get("http://127.0.0.1/checkPath/checkPoints", {
                params: { id: element.id },
              })
              .then((res) => {
                for (let i = 0; i < res.data.length; i++) {
                  let el = res.data[i];
                  checkTask.workshop = el.workshop;
                  checkTask.check_Point = el.check_Point;
                  checkTask.checkSequence = el.checkSequence;
                  checkTask.id = this.randomNumber();
                  checkTask.executor = element.executor;
                  checkTask.status = "未执行";
                  checkTask.pathId = element.id;
                  this.$axios
                    .get("http://127.0.0.1/checkTask/createTask", {
                      params: { form: checkTask },
                    })
                    .then((res) => {
                      if (res.data.status == 200) {
                        console.log("sucess");
                        this.$message.success("任务下发成功");
                        checkTask = {
                          id: "",
                          workshop: "",
                          executor: "",
                          status: "",
                          check_Point: "",
                          pathId: "",
                          checkSequence: "",
                        };
                      }
                    });
                }
              });
          }
        }
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
  },
  beforeMount() {
    this.activeUser = JSON.parse(sessionStorage.getItem("ActiveUser"));
    this.activeUser = Object.values(this.activeUser[0]);
  },
  mounted() {
    this.infoData();
    this.getExecutor();
    this.getPoints();
  },
};
</script>
  
  <style lang="scss">
table {
  border: 0.3px solid rgba(0, 0, 0, 0.074);
  margin: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
th,
td {
  border: 0.1px solid rgba(0, 0, 0, 0.084);
}
th:hover {
  background-color: #82d7ff59;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 12px;
}
.v-card__text.fixed-card {
  .container {
    height: 500px;
    overflow: scroll;
  }
}

.v-dialog {
  transition: all 0.7s ease-in-out !important;
}
.v-dialog__content {
  align-items: center;
  display: flex;
  height: 790px;
  justify-content: right;
  left: -30px;
  pointer-events: none;
  position: fixed;
  top: -76px;
  transition: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), z-index 1ms;
  width: 1584px;
  z-index: 6;
}

.slide-x-reverse-transition-enter,
.slide-x-reverse-transition-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>