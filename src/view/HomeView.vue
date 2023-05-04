<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="scroll-y" fluid>
        <v-row>
          <v-col cols="8" md="8">
            <v-card>
              <v-form
                ref="postData"
                lazy-validation
                enctype="multipart/form-data"
                autocomplete="off"
              >
                <v-card-title>
                  <span class="headline">个人中心</span>
                </v-card-title>
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              label="用户名"
                              disabled
                              v-model="postData.id"
                              color="#2C3A47"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              label="名称"
                              disabled
                              v-model="postData.role"
                              color="#2C3A47"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              label="手机号码"
                              v-model="postData.phone"
                              color="#2C3A47"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              label="邮箱"
                              v-model="postData.email"
                              color="#2C3A47"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                  </v-window-item>

                  <v-window-item :value="2">
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              label="旧密码"
                              v-model="password.oldPass"
                              color="#2C3A47"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              label="新密码"
                              v-model="password.newPass"
                              color="#2C3A47"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              label="确认密码"
                              v-model="password.checkPass"
                              color="#2C3A47"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                  </v-window-item>
                </v-window>

                <v-card-actions>
                  <v-btn
                    @click="step++"
                    :disabled="step === 2"
                    text
                    color="light-green darken-4"
                    dark
                    outlined
                    >修改密码</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn color="#2C3A47" dark @click="goback" outlined small>
                    <v-icon left>mdi-exit-to-app</v-icon> 返回
                  </v-btn>
                  <v-btn
                    @click.prevent="saveUser"
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
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      step: 1,
      activeUser: [],
      postData: {
        id: "",
        role: "",
        phone: "",
        email: "",
      },
      password: {
        oldPass: "",
        newPass: "",
        checkPass: "",
      },
    };
  },
  props: {
    source: String,
  },
  methods: {
    //保存个人信息
    saveUser() {
      if (this.step === 1) {
        this.$axios
          .get("http://127.0.0.1/user/saveUser", {
            params: { form: this.postData },
          })
          .then((res) => {
            if (res.data.status == 200) {
              this.$message.success("保存成功");
            }
          });
      } else if (this.step === 2) {
        if (this.password.oldPass === this.activeUser[2]) {
          if (this.password.newPass === this.password.checkPass) {
            this.$axios
              .get("http://127.0.0.1/user/updatePass", {
                params: {
                  form: {
                    id: this.postData.id,
                    password: this.password.newPass,
                  },
                },
              })
              .then((res) => {
                if (res.data.status == 200) {
                  this.$message.success("密码修改成功，请重新登录");
                  this.$router.push("/login", () => {});
                }
              });
          } else {
            this.$message.error("请重新确认密码");
          }
        } else {
          this.$message.error("旧密码错误");
        }
      }
    },
    goback() {
      if (this.step === 2) {
        this.step = 1;
      } else if (this.step === 1) {
        this.$router.push("/layout/main", () => {});
      }
    },
  },
  beforeMount() {
    this.activeUser = JSON.parse(sessionStorage.getItem("ActiveUser"));
    this.activeUser = Object.values(this.activeUser[0]);
    this.postData.id = this.activeUser[0];
    this.postData.role = this.activeUser[3];
    this.postData.phone = this.activeUser[4];
    this.postData.email = this.activeUser[5];
  },
  mounted() {},
};
</script>
