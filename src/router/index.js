import VueRouter from 'vue-router';
import Layout from '../components/Layout.vue';
import Factory from '../components/Factory.vue'
import Main from '../view/Main.vue';
import Role from '../view/Role.vue';
import SpareParts from '../view/SpareParts.vue';
import LubOil from '../view/LubOil.vue'; 
import InventoryRecord from '../view/InventoryRecord.vue';
import EquipmentAccount from '../view/EquipmentAccount.vue';
import EquipmentParts from '../view/EquipmentParts.vue';
import CheckPoint from '../view/CheckPoint.vue';
import CheckRecord from '../view/CheckRecord.vue';
import CheckPath from '../view/CheckPath.vue';
import CheckTask from '../view/CheckTask.vue';
import Login from '../view/Login.vue';
import Register from '../view/Register.vue';
import HomeView from '../view/HomeView.vue';
import Account from '../view/Account.vue';
import RepairTask from '../view/RepairWorkOrder/RepairTask.vue';
import TaskTemplates from '../view/RepairWorkOrder/TaskTemplates.vue';
import AcceptableTask from '../view/RepairWorkOrder/AcceptableTask.vue';
import WaitingTask from '../view/RepairWorkOrder/WaitingTask.vue';

export default new VueRouter({
    mode:'history',
    routes:[
        {
            path:'/',
            redirect:'/login'
        },
        {
            name:'login',
            path:'/login',
            component:Login
        },
        {
            name:'register',
            path:'/register',
            component:Register
        },
        {
            name: 'Factory',
            path: '/factory',
            component:Factory
        },
        {
            name:'Layout',
            path:'/layout',
            component:Layout,
            children:[
                {
                    name:'Main',
                    path:'main',
                    component:Main
                },
                {
                    name:'Role',
                    path:'role',
                    component:Role
                },
                {
                    name:'SpareParts',
                    path:'spareParts',
                    component:SpareParts
                },
                {
                    name:'LubOil',
                    path:'lubOil',
                    component:LubOil
                },
                {
                    name:'InventoryRecord',
                    path:'inventoryRecord',
                    component:InventoryRecord
                },
                {
                    name:'EquipmentAccount',
                    path:'equipmentAccount',
                    component:EquipmentAccount
                },
                {
                    name:'EquipmentParts',
                    path:'equipmentParts',
                    component:EquipmentParts
                },
                {
                    name:'CheckPoint',
                    path:'checkPoint',
                    component:CheckPoint
                },
                {
                    name:'CheckRecord',
                    path:'checkRecord',
                    component:CheckRecord
                },
                {
                    name:'CheckPath',
                    path:'checkPath',
                    component:CheckPath
                },
                {
                    name:'CheckTask',
                    path:'checkTask',
                    component:CheckTask
                },
                {
                    name:'RepairTask',
                    path:'repairTask',
                    component:RepairTask
                },
                {
                    name:'TaskTemplates',
                    path:'taskTemplates',
                    component:TaskTemplates
                },
                {
                    name:'AcceptableTask',
                    path:'acceptableTask',
                    component:AcceptableTask
                },
                {
                    name:'WaitingTask',
                    path:'waitingTask',
                    component:WaitingTask
                },
                {
                    name:'HomeView',
                    path:'homeView',
                    component:HomeView
                },
                {
                    name:'Account',
                    path:'account',
                    component:Account
                }
            ]
        },
        
    ]
})
