<template>
    <v-app style="-webkit-app-region: drag">
        <v-navigation-drawer
          v-model="drawer"
          :mini-variant.sync="mini"
          permanent=""
          color="#2C3A47"
          dark
          app
          style="height:100%"
        >
          
            <v-list-item class="px-2 pt-1">
              <v-list-item-avatar>
                <v-img src="https://randomuser.me/api/portraits/men/81.jpg" alt="admin" class="mx-auto" />
              </v-list-item-avatar>
              <v-list-item-title class="ml-4 text-capitalize">AAE IdeaPro</v-list-item-title>
              
            </v-list-item>
  
            <v-list shaped class="clickable">
                <template v-for="item in items">
                    <v-list-group
                    v-if="item.children"
                    :key="item.text"
                    :prepend-icon="item['icon-ctr']"
                    :append-icon="item.model ? item.icon : item['icon-alt']"
                    active-class="orange--text"
                    >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                    v-for="(child,i) in item.children"
                    :key="i"
                    route :to="child.route"
                    active-class="orange--text"
                    >
                    <v-list-item-action v-if="child.icon">
                        <v-icon>{{ child.icon }}</v-icon>
                    </v-list-item-action>
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
                    active-class="orange--text"
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
    </v-app>
</template>

<script>
export default {
    name:'Aside',
    props:{
        source:String,
    },
    data () {
        return {
            drawer: null,
            mini:false,
            fab:false,
            items: [
            {icon:'mdi-home',text:'权限管理',route:'/'},
            {
                icon:'mdi-chevron-up',
                'icon-alt':'mdi-chevron-down',
                'icon-ctr':'mdi-cart-arrow-right',
                text:'设备管理',
                children:[
                    {icon:'mdi-account-box-outline',text:'设备台账',route:'/equipmentAccount'},
                    {icon:'mdi-account-arrow-right',text:'设备部件',route:'/equipmentParts'}
                ]
            },
            {
                icon:'mdi-chevron-up',
                'icon-alt':'mdi-chevron-down',
                'icon-ctr':'mdi-google-maps',
                text:'巡检管理',
                children:[
                    {icon:'mdi-tooltip-account',text:'巡检点',route:'/point'},
                    {icon:'mdi-printer',text:'巡检记录',route:'/record'},
                    {icon:'mdi-printer',text:'巡检路线',route:'/way'},
                    {icon:'mdi-printer',text:'巡检任务',route:'/task'}
                ]
            },
            {icon:'mdi-finance',text:'工单管理',route:'/revenue'},
            {icon:'mdi-chart-pie',text:'知识仓库',route:'/index/projectMain'},
            {icon:'mdi-magnify',text:'库存管理',route:'/Recherche'},
            ],
        }
    },
    
}
</script>

<style>
.clickable{
    -webkit-app-region:no-drag;
}
</style>