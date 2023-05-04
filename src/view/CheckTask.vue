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
              <v-toolbar-title>巡检任务</v-toolbar-title>
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
              <!-- 查看 -->
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
                        <span>{{ form.id }}</span>
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
                              label="任务编号"
                              outlined
                              clearable
                              disabled
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.workshop"
                              :items="items.workshopItems"
                              label="工艺单元"
                              outlined
                              clearable
                              disabled
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.executor"
                              :items="items.executorItems"
                              label="检查人员"
                              outlined
                              clearable
                              disabled
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.status"
                              label="完成状态"
                              outlined
                              clearable
                              disabled
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.check_Point"
                              label="巡检点编号"
                              outlined
                              clearable
                              disabled
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.pathId"
                              label="巡检路线编号"
                              outlined
                              clearable
                              disabled
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.checkSequence"
                              label="巡检顺序"
                              outlined
                              clearable
                              disabled
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        @click="checkCarStart"
                        color="light-green darken-4"
                        dark
                        outlined
                        small
                        >开始执行</v-btn
                      >
                      <v-spacer></v-spacer>
                      <v-btn
                        @click.prevent="finish"
                        color="light-green darken-4"
                        dark
                        type="submit"
                        outlined
                        small
                      >
                        完成任务
                      </v-btn>
                      <v-btn color="#2C3A47" dark @click="close" outlined small>
                        关闭
                      </v-btn>
                    </v-card-actions>
                  </v-form>
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
              <v-spacer></v-spacer>
            </v-card-title>

            <v-data-table
              item-key="id"
              :headers="headers"
              :items="posts"
              :search="search"
            >
              <!-- 下面：解决v-slot不支持任何修饰符的问题 -->
              <!-- eslint-disable-next-line -->
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="success"
                  class="mx-2"
                  x-small
                  @click="editPost(item)"
                  outlined
                >
                  <v-icon small>mdi-pencil</v-icon>查看
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
  name: "CheckRecord",

  data() {
    return {
      nowDate: new Date().getTime(),
      activeUser: [],
      dialog1: false,
      dialogWidth: "600px",
      isChange: false,
      isPlaying: true,
      itemId: null,

      //面包屑
      breadCrumbsItems: [
        {
          text: "巡检管理",
          disabled: true,
          href: "main",
        },
        {
          text: "巡检任务",
          disabled: true,
          href: "checkTask",
        },
      ],

      form: {
        id: "",
        workshop: "",
        executor: "",
        status: "",
        check_Point: "",
        pathId: "",
        checkSequence: "",
      },
      items: {
        workshopItems: ["成瓷车间", "原料车间", "烧成车间", "彩瓷车间"],
        executorItems: ["管理员", "admin", "超级管理员"],
      },
      search: "",
      headers: [
        {
          text: "任务编号",
          value: "id",
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
          text: "检查人员",
          value: "executor",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "完成状态",
          value: "status",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "巡检点编号",
          value: "check_Point",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "巡检路线编号",
          value: "pathId",
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
      posts: [],
      default: {
        id: "",
        workshop: "",
        executor: "",
        status: "",
        check_Point: "",
        pathId: "",
        checkSequence: "",
      },
      editedIndex: -1,
    };
  },
  methods: {
    //初始化获得数据
    infoData() {
      this.$axios
        .get("http://127.0.0.1/checkTask/get")
        .then((res) => {
          this.posts = res.data;
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
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
    // 改变对话框的宽度
    changeWidth() {
      this.isPlaying = !this.isPlaying;
      if (!this.isChange) {
        (this.dialogWidth = "100%"), (this.isChange = !this.isChange);
      } else {
        (this.dialogWidth = "600px"), (this.isChange = !this.isChange);
      }
    },
    close() {
      this.dialog1 = false;
      setTimeout(() => {
        this.form = Object.assign({}, this.default); //关闭时，把空对象给到form，即清空
        this.editedIndex = -1;
      }, 300);
    },
    editPost(item) {
      this.dialog1 = true;
      this.form = item;
      this.itemId = item.id;
    },
    //开始巡检
    checkCarStart() {
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "巡检组长"
      ) {
        this.$axios
          .get("http://127.0.0.1/checkTask/checkCarStart", {
            params: { id: this.itemId },
          })
          .then((res) => {
            if (res.status == 200) {
              this.dialog1 = false;
              this.infoData();
              this.$message.success("任务已下发");
            }
          });
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //完成任务
    finish() {
      if (
        this.activeUser[1] === this.form.executor ||
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "巡检组长"
      ) {
        this.$axios
          .get("http://127.0.0.1/checkTask/finish", {
            params: { id: this.itemId },
          })
          .then((res) => {
            if (res.data.status == 200) {
              this.dialog1 = false;
              this.infoData();
              let checkRecord = {
                id: "",
                workshop: "",
                checkTime: "",
                executor: "",
                check_Point: "",
                pathId: "",
                checkSequence: "",
              };
              checkRecord.id = this.form.id;
              checkRecord.workshop = this.form.workshop;
              checkRecord.checkTime = this.getNowDate(this.nowDate);
              checkRecord.executor = this.form.executor;
              checkRecord.check_Point = this.form.check_Point;
              checkRecord.pathId = this.form.pathId;
              checkRecord.checkSequence = this.form.checkSequence;
              this.$axios
                .get("http://127.0.0.1/checkRecord/createRecord", {
                  params: { form: checkRecord },
                })
                .then((res) => {
                  if (res.data.status == 200) {
                    //更新巡检路线最近巡检时间
                    this.$axios
                      .get("http://127.0.0.1/checkTask/updatePathTime", {
                        params: {
                          form: {
                            latestTime: checkRecord.checkTime,
                            latestExecutor: checkRecord.executor,
                            id: checkRecord.pathId,
                          },
                        },
                      })
                      .then((res) => {
                        if (res.data.status == 200) {
                          console.log("success");
                        }
                      });
                    //更新巡检点最近巡检时间，检查人
                    this.$axios
                      .get("http://127.0.0.1/checkTask/updatePointTime", {
                        params: {
                          form: {
                            lastTime: checkRecord.checkTime,
                            lastExecutor: checkRecord.executor,
                            id: checkRecord.check_Point,
                          },
                        },
                      })
                      .then((res) => {
                        if (res.data.status == 200) {
                          console.log("success");
                        }
                      });
                  }
                });
            }
          });
        this.$message.success("一条巡检任务已完成");
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
    this.getTime();
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