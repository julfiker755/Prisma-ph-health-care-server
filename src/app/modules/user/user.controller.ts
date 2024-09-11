import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin=async(req:Request,res:Response)=>{
   try{
    const result= await userService.createAdmin(req)
   res.status(200).json({
    success:true,
    message:"Admin user Create successfull",
    data:result,
   })
   }catch(err){
    res.status(500).json({
        success:false,
        message:"Somethings went wrong",
        err:err?.toString()
    })
   }
}


export const userController={
    createAdmin
}