import express from 'express'
import { adminController } from './admin.controller'
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchema } from './admin.validation';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router=express.Router()



router.get("/",auth(userRole.ADMIN,userRole.SUPER_ADMIN),adminController.getAllBD)
router.get("/:id",auth(userRole.ADMIN,userRole.SUPER_ADMIN),adminController.getSingleIdBD)
router.patch("/:id", auth(userRole.ADMIN,userRole.SUPER_ADMIN),validateRequest(adminValidationSchema.updateSchema),adminController.getSingleUpdateBD)
router.delete("/:id",auth(userRole.ADMIN,userRole.SUPER_ADMIN),adminController.getSingleDeleteBD)
router.delete("/soft/:id",auth(userRole.ADMIN,userRole.SUPER_ADMIN),adminController.getSingleSoftDeleteBD)


export const AdminRoutes=router