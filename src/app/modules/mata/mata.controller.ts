import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { metaService } from "./mata.service";





const fatchDashboardMetaData=catchAsync(async(req:Request & {user?:any},res:Response)=>{
   const user=req.user
    const result= await metaService.fatchDashboardMetaData(user)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Meta Data get successfull",
      data:result
    })
 })

 export const mataController={
    fatchDashboardMetaData
 }