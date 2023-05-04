<template>
  <v-app style="-webkit-app-region: drag">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent=""
      color="#fbfbfb"
      app
    >
      <v-list-item class="px-2 pt-1">
        <v-list-item-avatar>
          <v-img
            src="https://img2.baidu.com/it/u=4150407193,2151982205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
            alt="admin"
            class="mx-auto"
          />
        </v-list-item-avatar>
        <v-list-item-title class="ml-4 text-capitalize"
          >SIEMENS</v-list-item-title
        >
      </v-list-item>

      <v-list shaped class="clickable">
        <template v-for="item in items">
          <v-list-group
            v-if="item.children"
            :key="item.text"
            :prepend-icon="item['icon-ctr']"
            :append-icon="item.model ? item.icon : item['icon-alt']"
            active-class="blue--text"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              route
              :to="child.route"
              active-class="blue--text"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-item
            v-else
            :key="item.text + ''"
            active-class="blue--text"
            route
            :to="item.route"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#fbfbfb">
      <v-app-bar-nav-icon @click.stop="mini = !mini" class="clickable" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">AnicornApp</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon v-on:click="logout" class="clickable">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <!-- <v-container
      class="scroll-y"
      fluid
      >
        <v-row align="center" justify="center">
          <router-view></router-view>
        </v-row>
      </v-container> -->
      <transition>
        <router-view></router-view>
      </transition>
    </v-main>
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
export default {
  name: "Layout",
  props: {
    source: String,
  },
  data() {
    return {
      drawer: null,
      mini: false,
      fab: false,
      items: [
        { icon: "mdi-home", text: "权限管理", route: "/layout/main" },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          "icon-ctr": "mdi-cogs",
          text: "设备管理",
          children: [
            { text: "设备台账", route: "/layout/equipmentAccount" },
            { text: "设备部件", route: "/layout/equipmentParts" },
          ],
        },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          "icon-ctr": "mdi-shield-account",
          text: "巡检管理",
          children: [
            { text: "巡检点", route: "/layout/checkPoint" },
            { text: "巡检记录", route: "/layout/checkRecord" },
            { text: "巡检路线", route: "/layout/checkPath" },
            { text: "巡检任务", route: "/layout/checkTask" },
          ],
        },
        {
          icon: "mdi-finance",
          "icon-alt": "mdi-chevron-down",
          "icon-ctr": "mdi-clipboard-text-multiple-outline",
          text: "工单管理",
          children: [
            { text: "工单列表", route: "/layout/repairTask" },
            { text: "工单模板", route: "/layout/taskTemplates" },
            { text: "可验收工单", route: "/layout/acceptableTask" },
            { text: "可执行工单", route: "/layout/waitingTask" },
          ],
        },
        {
          icon: "mdi-finance",
          "icon-alt": "mdi-chevron-down",
          "icon-ctr": "mdi-warehouse",
          text: "库存管理",
          children: [
            { text: "备品备件", route: "/layout/spareParts" },
            { text: "润滑油品", route: "/layout/lubOil" },
            { text: "出入库记录", route: "/layout/inventoryRecord" },
          ],
        },
      ],
    };
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    //登录后跳转到main
    logout() {
      this.$router.push("/factory", () => {});
    },
  },
  //挂载
  mounted() {
    // this.logout();
  },
};
</script>

<style>
.body {
  background-color: #e7e9eb;
}
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
.v-enter {
  opacity: 0;
  transform: translateX(-100%);
}
v.leave-to {
  opacity: 0;
  transform: translateX(100%);
  position: absolute;
}
.v-enter-active,
v-leave-active {
  transition: all 2.5s ease;
}
</style>