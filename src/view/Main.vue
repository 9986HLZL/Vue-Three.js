<template>
  <v-layout>
    <v-row class="clickable">
      <v-col cols="12" md="12">
        <v-card class="ml-5 mr-5">
          <v-app-bar dark color="2C3A47">
            <v-btn icon>
              <v-icon>mdi-home</v-icon>
            </v-btn>
            <v-toolbar-title>Access Control</v-toolbar-title>
          </v-app-bar>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4">
                <v-hover v-slot:default="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    class="mx-auto"
                    max-width="344"
                    outlined
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1"
                          >个人中心</v-list-item-title
                        >
                      </v-list-item-content>
                      <v-list-item-avatar title size="80" color="#009432">
                        <v-icon dark>mdi-account</v-icon>
                      </v-list-item-avatar>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-icon flab color="#009432">mdi-account-star</v-icon>
                      <v-btn text
                        ><span>当前用户：</span>{{ activeUser[0] }}</v-btn
                      >
                      <v-spacer></v-spacer>
                      <v-btn @click="toUser" icon>
                        <v-icon flab color="2c3A47">mdi-chevron-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="12" sm="4">
                <v-hover v-slot:default="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    class="mx-auto"
                    max-width="344"
                    outlined
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1"
                          >账户管理</v-list-item-title
                        >
                      </v-list-item-content>
                      <v-list-item-avatar title size="80" color="red">
                        <v-icon dark>mdi-account-group</v-icon>
                      </v-list-item-avatar>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="toAccount" icon>
                        <v-icon flab color="2c3A47">mdi-chevron-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="12" sm="4">
                <v-hover v-slot:default="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    class="mx-auto"
                    max-width="344"
                    outlined
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1"
                          >角色管理</v-list-item-title
                        >
                      </v-list-item-content>
                      <v-list-item-avatar title size="80" color="blue">
                        <v-icon dark>mdi-account-supervisor</v-icon>
                      </v-list-item-avatar>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="toRole" icon>
                        <v-icon flab color="2c3A47">mdi-chevron-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      activeUser: [],
    };
  },
  methods: {
    toUser() {
      this.$router.push("/layout/homeView", () => {});
    },
    toAccount() {
      if (this.activeUser[3] === "超级管理员") {
        this.$router.push("/layout/account", () => {});
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
    toRole() {
      if (this.activeUser[3] === "超级管理员") {
        this.$router.push("/layout/role", () => {});
      } else {
        this.$message.warning("提示：您无该权限！");
      }
    },
  },
  beforeMount() {
    this.activeUser = JSON.parse(sessionStorage.getItem("ActiveUser"));
    this.activeUser = Object.values(this.activeUser[0]);
  },
};
</script>

<style>
</style>