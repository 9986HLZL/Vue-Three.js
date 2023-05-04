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
              <v-toolbar-title>可执行工单</v-toolbar-title>
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
                        <span>任务</span>
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
                              label="工单编号"
                              outlined
                              :rules="rules.id"
                              clearable
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.name"
                              label="工单名称"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.description"
                              label="工单描述"
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
                            <v-menu
                              v-model="startMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="form.startTime"
                                  label="开始时间"
                                  append-icon="mdi-clock-outline"
                                  readonly
                                  outlined
                                  clearable
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="form.startTime"
                                @input="startMenu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-menu
                              v-model="endMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="form.endTime"
                                  label="结束时间"
                                  append-icon="mdi-clock-outline"
                                  readonly
                                  outlined
                                  clearable
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <!-- <v-date-picker
                                                v-model="endTime"
                                                @input="endMenu = false"
                                                ></v-date-picker> -->
                              <v-time-picker
                                v-model="form.endTime"
                                format="24hr"
                              ></v-time-picker>
                            </v-menu>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.status"
                              :items="items.statusItems"
                              label="工单状态"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.executor"
                              :items="items.executorItems"
                              label="执行人"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="#2C3A47" dark @click="close" outlined small>
                        关闭
                      </v-btn>
                      <v-btn
                        @click.prevent="sendOrder"
                        color="light-green darken-4"
                        dark
                        type="submit"
                        outlined
                        small
                      >
                        开始执行 </v-btn
                      ><v-btn
                        @click.prevent="finishOrder"
                        color="light-green darken-4"
                        dark
                        type="submit"
                        outlined
                        small
                      >
                        完成任务
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
              <template v-slot:item.status="{ item }">
                <v-chip :color="getColor(item.status)" dark>
                  {{ item.status }}
                </v-chip>
              </template>
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
  name: "WaitingTask",
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
          text: "工单管理",
          disabled: true,
          href: "main",
        },
        {
          text: "可验收工单",
          disabled: true,
          href: "acceptableTask",
        },
      ],

      form: {
        id: "",
        name: "",
        description: "",
        workshop: "",
        startTime: "",
        endTime: "",
        status: "",
        executor: "",
      },
      items: {
        workshopItems: ["成瓷车间", "原料车间", "烧成车间", "彩瓷车间"],
        statusItems: ["未执行", "进行中", "待验收", "已验收"],
        executorItems: ["管理员", "admin", "超级管理员"],
      },

      startMenu: "",
      endMenu: "",
      search: "",
      headers: [
        {
          text: "工单编号",
          value: "id",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "工单名称",
          value: "name",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "工单描述",
          value: "description",
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
          text: "开始时间",
          value: "startTime",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "结束时间",
          value: "endTime",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "工单状态",
          value: "status",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "执行人",
          value: "executor",
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
        name: "",
        description: "",
        workshop: "",
        startTime: "",
        endTime: "",
        status: "",
        executor: "",
      },
      editedIndex: -1,
      rules: {
        id: [(val) => (val || "").length > 0 || "工单编号不能为空"],
      },
    };
  },
  methods: {
    //初始化获得数据
    infoData() {
      this.$axios
        .get("http://127.0.0.1/repairTask/waitingTaskGet")
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
    overTime() {
      for (let i = 0; i < this.posts.length; i++) {
        const element = this.posts[i];
        if (element.startTime === this.getNowDate(this.nowDate)) {
          this.itemId = element.id;
          this.sendOrder();
          console.log("时间到，下发任务");
        }
        if (element.endTime === this.getNowDate(this.nowDate)) {
          this.itemId = element.id;
          this.finishOrder();
          console.log("时间到，完成任务");
        }
      }
    },
    callOverTime() {
      setInterval(() => {
        this.overTime();
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
    getColor(items) {
      if (items == "未执行") return "gray";
      else if (items == "进行中") return "#168597";
      else if (items == "待验收") return "blue";
      else return "green";
    },
    close() {
      this.dialog1 = false;
      setTimeout(() => {
        this.form = Object.assign({}, this.default); //关闭时，把空对象给到form，即清空
        this.editedIndex = -1;
      }, 300);
    },
    editPost(item) {
      console.log(item);
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "管理员" ||
        this.activeUser[1] === item.executor ||
        this.activeUser[1] === item.sender
      ) {
        this.dialog1 = true;
        this.form = item;
        this.itemId = item.id;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    sendOrder() {
      this.$axios
        .get("http://127.0.0.1/repairTask/sendOrder", {
          params: { id: this.itemId },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.infoData();
            this.dialog1 = false;
            this.$message.success("任务已下发");
          }
        });
    },
    finishOrder() {
      this.$axios
        .get("http://127.0.0.1/repairTask/finishOrder", {
          params: { id: this.itemId },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.infoData();
            this.dialog1 = false;
            this.$message.success("操作成功");
          }
        });
    },
  },
  beforeMount() {
    this.activeUser = JSON.parse(sessionStorage.getItem("ActiveUser"));
    this.activeUser = Object.values(this.activeUser[0]);
  },
  mounted() {
    this.infoData();
    this.getTime();
    this.getNowDate();
    this.overTime();
    this.callOverTime();
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