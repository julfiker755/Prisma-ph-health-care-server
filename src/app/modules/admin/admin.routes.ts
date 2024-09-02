import express from 'express'
import { adminController } from './admin.controller'

const router=express.Router()

router.get("/",adminController.getAllBD)
router.get("/:id",adminController.getSingleIdBD)
router.patch("/:id",adminController.getSingleUpdateBD)
router.delete("/:id",adminController.getSingleDeleteBD)
router.delete("/soft/:id",adminController.getSingleSoftDeleteBD)


export const AdminRoutes=router