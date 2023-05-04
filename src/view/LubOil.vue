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
              <v-toolbar-title>润滑油品</v-toolbar-title>
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
                        <span>润滑油品</span>
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
                              label="油品名称"
                              outlined
                              :rules="rules.id"
                              clearable
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.description"
                              label="润滑部位"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.manufacturer"
                              label="生产厂家"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.minimum"
                              label="最低库存"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.quantity"
                              label="数量"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.unit"
                              label="单位"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="form.price"
                              label="单价"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.executor"
                              :items="items.executorItems"
                              label="责任人"
                              outlined
                              clearable
                            ></v-select>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        v-if="isEdit"
                        @click="entry"
                        color="light-green darken-4"
                        dark
                        outlined
                        small
                        >入库</v-btn
                      >
                      <v-btn
                        v-if="isEdit"
                        @click="exit"
                        color="light-green darken-4"
                        dark
                        outlined
                        small
                        >出库</v-btn
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
              <!-- 出入库 -->
              <v-dialog v-model="dialog4" persistent width="392px">
                <v-card>
                  <v-toolbar dark color="#168597">
                    <v-toolbar-title>
                      <span>选择数量</span>
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-card-text style="height: 100px">
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-text-field
                            v-model="changeData.quantity"
                            label="数量"
                            outlined
                            clearable
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
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
                      @click.prevent="change"
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
  name: "LubOil",

  data() {
    return {
      activeUser: [],
      dialog1: false,
      dialog2: false,
      dialog4: false,
      dialogWidth: "600px",
      isChange: false,
      isPlaying: true,
      isEdit: false,
      itemId: null,
      //面包屑
      breadCrumbsItems: [
        {
          text: "库存管理",
          disabled: true,
          href: "main",
        },
        {
          text: "润滑油品",
          disabled: true,
          href: "repairTask",
        },
      ],

      form: {
        id: "",
        description: "",
        manufacturer: "",
        minimum: "",
        quantity: "",
        unit: "",
        price: "",
        executor: "",
      },
      items: {
        executorItems: ["管理员", "admin", "超级管理员"],
      },
      changeData: {
        id: "",
        quantity: "",
        operate: "",
        x: "254",
        y: "0",
        z: "251",
      },
      search: "",
      headers: [
        {
          text: "油品名称",
          value: "id",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "润滑部位",
          value: "description",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "生产厂家",
          value: "manufacturer",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "最低库存",
          value: "minimum",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "数量",
          value: "quantity",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "单位",
          value: "unit",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "单价",
          value: "price",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "责任人",
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
        description: "",
        manufacturer: "",
        minimum: "",
        quantity: "",
        unit: "",
        price: "",
        executor: "",
      },
      editedIndex: -1,
      rules: {
        id: [(val) => (val || "").length > 0 || "备件不能为空"],
      },
    };
  },
  methods: {
    //初始化获得数据
    infoData() {
      this.$axios
        .get("http://127.0.0.1/lubOil/get")
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
    //点击添加
    add() {
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "管理员" ||
        this.activeUser[3] === "库存负责人"
      ) {
        this.form = Object.assign({}, this.default);
        this.dialog1 = true;
        this.editedIndex = -1;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //关闭
    close() {
      this.dialog1 = false;
      setTimeout(() => {
        this.form = Object.assign({}, this.default); //关闭时，把空对象给到form，即清空
        this.editedIndex = -1;
        this.isEdit = false;
      }, 300);
    },
    //保存
    save() {
      this.$axios
        .get(
          this.isEdit
            ? "http://127.0.0.1/lubOil/update"
            : "http://127.0.0.1/lubOil/add",
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
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "管理员" ||
        this.activeUser[3] === "库存负责人"
      ) {
        this.dialog1 = true;
        this.isEdit = true;
        this.form = item;
        this.changeData.id = item.id;
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    //点击删除
    deletePost(item) {
      if (
        this.activeUser[3] === "超级管理员" ||
        this.activeUser[3] === "管理员" ||
        this.activeUser[3] === "库存负责人"
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
        .get("http://127.0.0.1/lubOil/del", {
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
    //入库
    entry() {
      this.dialog4 = true;
      this.changeData.operate = "入库";
    },
    //出库
    exit() {
      this.dialog4 = true;
      this.changeData.operate = "出库";
    },
    //提交出入库命令
    change() {
      this.$axios
        .get("http://127.0.0.1/lubOil/change", {
          params: { form: this.changeData },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.dialog4 = false;
            this.$message.success("任务已下发");
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