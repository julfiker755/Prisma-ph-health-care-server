import express from "express";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { userRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.routes";
import { DoctorRoutes } from "../modules/doctor/doctor.routes";



const router=express.Router()

const moduleRoutes=[
    {
        path:'/user',
        route:userRoutes
    },{
        path:'/admin',
        route:AdminRoutes
    },{
        path:"/auth",
        route:AuthRoutes
    },{
        path:'/specialties',
        route:SpecialtiesRoutes
    },{
        path:'/doctor',
        route:DoctorRoutes
    }
]

moduleRoutes.forEach(route=>router.use(route.path,route.route))


export default router