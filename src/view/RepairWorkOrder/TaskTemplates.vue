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
              <v-toolbar-title>工单模板</v-toolbar-title>
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
                        <span>工单模板</span>
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
                              v-model="form.name"
                              label="工单名称"
                              outlined
                              clearable
                              :rules="rules.name"
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
                            <v-text-field
                              v-model="form.fault"
                              label="故障信息"
                              outlined
                              clearable
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="form.workType"
                              :items="items.workTypeItems"
                              label="工单类型"
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
  name: "RepairTask",

  data() {
    return {
      dialog1: false,
      dialog2: false,
      dialogWidth: "600px",
      isChange: false,
      isPlaying: true,
      isEdit: false,
      itemId: null,
      //面包屑
      breadCrumbsItems: [
        {
          text: "工单管理",
          disabled: true,
          href: "main",
        },
        {
          text: "工单模板",
          disabled: true,
          href: "repairTask",
        },
      ],

      form: {
        name: "",
        description: "",
        fault: "",
        workType: "",
      },
      items: {
        workTypeItems: ["维修工单", "润滑工单"],
      },

      search: "",
      headers: [
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
          text: "故障信息",
          value: "fault",
          sortable: false,
          align: "center",
          width: "100px",
        },
        {
          text: "工单类型",
          value: "workType",
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
        name: "",
        description: "",
        fault: "",
        workType: "",
      },
      editedIndex: -1,
      rules: {
        name: [(val) => (val || "").length > 0 || "工单名称不能为空"],
        description: [(val) => (val || "").length > 0 || "工单描述不能为空"],
        workType: [(val) => (val || "").length > 0 || "工单类型不能为空"],
      },
    };
  },
  methods: {
    //初始化获得数据
    infoData() {
      this.$axios
        .get("http://127.0.0.1/taskTemplates/get")
        .then((res) => {
          this.posts = res.data;
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
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
      this.form = Object.assign({}, this.default);
      this.dialog1 = true;
      this.editedIndex = -1;
    },
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
            ? "http://127.0.0.1/taskTemplates/update"
            : "http://127.0.0.1/taskTemplates/add",
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
    editPost(item) {
      this.dialog1 = true;
      this.isEdit = true;
      this.form = item;
    },
    deletePost(item) {
      this.dialog2 = true;
      this.itemId = item.name;
    },
    //确认删除
    handleDelete() {
      this.$axios
        .get("http://127.0.0.1/taskTemplates/del", {
          params: { name: this.itemId },
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
  mounted() {
    this.infoData();
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