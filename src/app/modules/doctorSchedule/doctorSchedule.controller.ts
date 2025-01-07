import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { doctorScheduleServices } from "./doctorSchedule.service";



const pink=<T,K extends keyof T>(obj:T,keys:K[])=>{
    const filnalObj:Partial<T> ={}
  for (const key of keys){
     if(obj && Object.hasOwnProperty.call(obj,key)){
        filnalObj[key]=obj[key]
     }
  }
  return filnalObj
}


const insertIntoDB=catchAsync(async(req:Request & {user?:any},res:Response)=>{
   
    const user=req?.user 

    
    const result=await doctorScheduleServices.insertIntoDB(user,req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Doctor Schedule Create successfully!",
        data:result
    })
})


const deleteFormDB=catchAsync(async(req:Request & {user?:any},res:Response)=>{
    const {id}=req.params
    const user=req.user
    const result=await doctorScheduleServices.deleteFormDB(id,user)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Doctor Schedule Deleted successfully!",
        data:result
    })
})


const getIntoDB=catchAsync(async(req:Request & {user?:any},res:Response)=>{
    const options=pink(req.query,["page","limit","sortBy","sortOrder"])
    const filters=pink(req.query,["startDate","endDate","isBooked"])
     const user=req.user
    const result=await doctorScheduleServices.getAllFromDB(options,filters,user)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Doctor Schedule get successfully!",
        data:result
    })
})

export const doctorScheduleController={
    insertIntoDB,
    getIntoDB,
    deleteFormDB
}