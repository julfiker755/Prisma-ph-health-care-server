import express from 'express'
import { adminController } from './admin.controller'
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchema } from './admin.validation';

const router=express.Router()



router.get("/",adminController.getAllBD)
router.get("/:id",adminController.getSingleIdBD)
router.patch("/:id", validateRequest(adminValidationSchema.updateSchema),adminController.getSingleUpdateBD)
router.delete("/:id",adminController.getSingleDeleteBD)
router.delete("/soft/:id",adminController.getSingleSoftDeleteBD)


export const AdminRoutes=router