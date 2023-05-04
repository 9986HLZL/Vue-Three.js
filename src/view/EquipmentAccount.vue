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
              <v-toolbar-title>设备台账</v-toolbar-title>
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
                        <span>设备</span>
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
                              label="设备位号"
                              outlined
                              :rules="rules.id"
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
                            <v-text-field
                              v-model="form.description"
                              label="描述"
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
                              v-model="form.classify"
                              :items="items.classifyItems"
                              label="设备分类"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.type"
                              :items="items.typeItems"
                              label="设备类型"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.status"
                              :items="items.statusItems"
                              label="运行状态"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.executor"
                              :items="items.executorItems"
                              label="负责人"
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
              <!-- 上传 -->
              <v-dialog v-model="dialog3" persistent width="392px">
                <v-card>
                  <v-toolbar dark color="#168597">
                    <v-toolbar-title>
                      <span>选择文件</span>
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-card-text style="height: 100px">
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-file-input
                            multiple
                            label="File input"
                          ></v-file-input>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="#168597"
                      dark
                      @click="dialog3 = false"
                      outlined
                      small
                    >
                      <v-icon left>mdi-exit-to-app</v-icon> 取消
                    </v-btn>
                    <v-btn color="#168597" dark type="submit" outlined small>
                      <v-icon left>save</v-icon> 提交
                    </v-btn>
                  </v-card-actions>
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
              <v-btn
                @click="add"
                class="white--text"
                color="#00879e"
                style="margin-right: 8px"
              >
                <v-icon left>add</v-icon> 添加
              </v-btn>
              <v-btn @click="upload" class="white--text" color="#00879e">
                <v-icon left>add</v-icon> 导入
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
  name: "RepairTask",

  data() {
    return {
      activeUser: [],
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialogWidth: "600px",
      isChange: false,
      isPlaying: true,
      isEdit: false,
      itemId: null,
      //面包屑
      breadCrumbsItems: [
        {
          text: "设备管理",
          disabled: true,
          href: "main",
        },
        {
          text: "设备台账",
          disabled: true,
          href: "repairTask",
        },
      ],

      form: {
        id: "",
        name: "",
        description: "",
        workshop: "",
        classify: "",
        type: "",
        status: "",
        executor: "",
      },
      items: {
        workshopItems: ["成瓷车间", "原料车间", "烧成车间", "彩瓷车间"],
        classifyItems: ["静设备", "动设备", "特种设备"],
        typeItems: [
          "泵",
          "压缩机",
          "罐",
          "球磨机",
          "搅拌机",
          "磁选机",
          "压滤机",
          "输送机",
          "振动筛",
          "干燥机",
          "机械手",
        ],
        statusItems: ["运行", "停止", "未安装", "未启动"],
        executorItems: [],
      },
      search: "",
      headers: [
        {
          text: "设备位号",
          value: "id",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "名称",
          value: "name",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "描述",
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
          text: "设备分类",
          value: "classify",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "设备类型",
          value: "type",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "运行状态",
          value: "status",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "负责人",
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
        classify: "",
        type: "",
        status: "",
        executor: "",
      },
      editedIndex: -1,
      rules: {
        id: [(val) => (val || "").length > 0 || "设备位号不能为空"],
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
        .get("http://127.0.0.1/equipmentAcount/get")
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

    // 改变对话框的宽度 找下输入事件
    changeWidth() {
      this.isPlaying = !this.isPlaying;
      if (!this.isChange) {
        (this.dialogWidth = "100%"), (this.isChange = !this.isChange);
      } else {
        (this.dialogWidth = "600px"), (this.isChange = !this.isChange);
      }
    },
    //导入
    upload() {
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "设备组长"
      ) {
        this.dialog3 = true;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //点击添加
    add() {
      this.dialog1 = true;
      this.form = Object.assign({}, this.default);
      this.editedIndex = -1;
    },
    //关闭
    close() {
      this.dialog1 = false;
      setTimeout(() => {
        this.form = Object.assign({}, this.default); //关闭时，把空对象给到form，即清空
        this.editedIndex = -1;
      }, 300);
    },
    //保存
    save() {
      this.$axios
        .get(
          this.isEdit
            ? "http://127.0.0.1/equipmentAcount/update"
            : "http://127.0.0.1/equipmentAcount/add",
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
    //编辑
    editPost(item) {
      if (
        this.activeUser[1] === item.executor ||
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "设备组长"
      ) {
        this.dialog1 = true;
        this.isEdit = true;
        this.form = item;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //点击删除
    deletePost(item) {
      if (
        this.activeUser[1] === item.executor ||
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "设备组长"
      ) {
        this.dialog2 = true;
        this.itemId = item.id;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //确认删除
    handleDelete() {
      this.$axios
        .get("http://127.0.0.1/equipmentAcount/del", {
          params: { id: this.itemId },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.infoData();
            this.dialog2 = false;
            this.$message.success("删除成功");
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
    this.getExecutor();
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
// 我V13291487846 以后有问题可以直接找我，不通过平台，可以便宜写

.slide-x-reverse-transition-enter,
.slide-x-reverse-transition-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>