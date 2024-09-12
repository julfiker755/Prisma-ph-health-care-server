import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";



const createAdmin=catchAsync(async(req:Request,res:Response)=>{
    const result= await userService.createAdmin(req)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Admin user Create successfull",
      data:result
    })
 })


const createDoctor=catchAsync(async(req:Request,res:Response)=>{
    const result= await userService.createDoctor(req)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Doctor Create successfull",
      data:result
    })
 })

const createPatient=catchAsync(async(req:Request,res:Response)=>{
    const result= await userService.createPatient(req)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Patient Create successfull",
      data:result
    })
 })


export const userController={
    createAdmin,
    createDoctor,
    createPatient
}