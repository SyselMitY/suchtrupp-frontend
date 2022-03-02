import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SucheDetail from "@/views/SucheDetail";
import Suchlist from "@/views/Suchlist";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/sucheDetail/:id',
        name: 'SucheDetail',
        component: SucheDetail,
        props: true
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Suchlist
    }
]

const router = new VueRouter({
    routes
})

export default router
