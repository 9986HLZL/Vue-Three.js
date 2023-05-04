<template>
  <v-app>
    <v-container class="scroll-y" fluid>
      <v-row>
        <v-card style="height: 600px">
          <v-sheet color="#5097BC" class="pa-4 lighten-8">
            <v-text-field
              v-model="searchNode"
              label="搜索"
              dark
              flat
              solo-inverted
              hide-details
              clearable
              clear-icon="mdi-close-circle-outline"
            ></v-text-field>

            <div style="margin-top: 10px; margin-left: 200px">
              <v-dialog v-model="dialog1" width="600px">
                <v-card>
                  <v-sheet>
                    <v-toolbar color="#168597">
                      <v-toolbar-title class="white--text"
                        >新增角色</v-toolbar-title
                      >
                    </v-toolbar>
                  </v-sheet>
                  <v-card>
                    <v-flex xs12 sm12 md12>
                      <v-text-field
                        v-model="newNode.name"
                        style="margin: 15px 10px"
                        label="角色名称"
                        outlined
                        clearable
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-text-field
                        v-model="newNode.description"
                        style="margin: 15px 10px"
                        label="权限描述"
                        outlined
                        clearable
                      ></v-text-field>
                    </v-flex>

                    <div
                      style="
                        margin-top: 15px;
                        margin-left: 400px;
                        padding-bottom: 10px;
                      "
                    >
                      <v-btn
                        @click="addNode"
                        color="#168597"
                        class="white--text"
                        >添加
                        <v-icon>add</v-icon>
                      </v-btn>
                      <v-btn
                        style="margin-left: 20px"
                        color="#168597"
                        class="white--text"
                        @click="dialog1 = false"
                        >关闭</v-btn
                      >
                    </div>
                  </v-card>
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
                        style="
                          color: #006487;
                          background-color: white;
                          border-color: white;
                          font-size: 14px;
                        "
                        dark
                        @click="handelDelete"
                        outlined
                        small
                      >
                        确定
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-card>
              </v-dialog>

              <v-icon @click="Add" color="white">mdi-plus</v-icon>
              <v-icon @click="Remove" color="white">mdi-minus</v-icon>
            </div>
          </v-sheet>
          <!-- 树视图 -->
          <v-treeview
            :active.sync="active"
            @update:active="test"
            return-object
            :items="treeItems"
            activatable
            item-key="name"
          >
            <template v-slot:prepend="{ item }">
              <v-icon v-if="!item.file"> mdi-account </v-icon>
            </template>
          </v-treeview>
        </v-card>

        <v-card style="width: 900px; height: 600px">
          <v-card-title>
            <span>详细</span>
          </v-card-title>

          <v-card-text>
            <p
              style="
                font-weight: 700;
                font-size: 16px;
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold',
                  sans-serif;
              "
            >
              角色：{{ editedItem.name }}
            </p>
            <p
              style="
                font-weight: 700;
                font-size: 16px;
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold',
                  sans-serif;
              "
            >
              权限描述：{{ editedItem.description }}
            </p>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </v-app>
</template>
  
  <script>
export default {
  name: "Role",
  data: () => ({
    searchNode: "",
    newNode: {
      name: "",
      description: "",
    },
    newNodeObj: {},
    active: [],
    dialog1: false,
    dialog2: false,
    dialog3: false,
    dialog4: false,
    editedItem: {
      name: "",
      description: "",
    },
    treeItems: [],
  }),
  methods: {
    infoData() {
      this.$axios
        .get("http://127.0.0.1/role/get")
        .then((res) => {
          this.treeItems = res.data;
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    //添加子节点
    Add() {
      this.dialog1 = true;
    },
    addNode() {
      this.$axios
        .get("http://127.0.0.1/role/add", {
          params: { form: this.newNode },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.infoData();
            this.$message.success("新增角色成功");
          }
        });
      this.dialog1 = false;
    },
    test() {
      //节点激活/切换时，将该节点给到editedItem
      for (var i = 0; i < this.treeItems.length; i++) {
        if (this.active[0] && this.treeItems[i].name == this.active[0].name) {
          this.editedItem = this.treeItems[i];
        }
      }
    },
    //删除子节点
    Remove() {
      if (this.active[0]) {
        this.dialog2 = true;
      } else {
        this.$message.warning("提示：请先选中节点！");
      }
    },
    handelDelete() {
      this.$axios
        .get("http://127.0.0.1/role/del", {
          params: { name: this.editedItem.name },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message.success("删除角色成功");
            this.infoData();
            this.dialog2 = false;
          }
        });
    },
  },
  mounted() {
    this.infoData();
  },
};
</script>
  
<style>
.tablePosition {
  position: relative;
  width: 900px;
}
</style>