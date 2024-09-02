import express from "express";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { userRoutes } from "../modules/user/user.routes";

const router=express.Router()

const moduleRoutes=[
    {
        path:'/user',
        route:userRoutes,
    },{
        path:'/admin',
        route:AdminRoutes
    }
]

moduleRoutes.forEach(route=>router.use(route.path,route.route))


export default router