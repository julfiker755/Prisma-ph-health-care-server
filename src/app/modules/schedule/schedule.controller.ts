import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { scheduleServices } from "./schedule.services";


const pink=<T,K extends keyof T>(obj:T,keys:K[])=>{
    const filnalObj:Partial<T> ={}
  for (const key of keys){
     if(obj && Object.hasOwnProperty.call(obj,key)){
        filnalObj[key]=obj[key]
     }
  }
  return filnalObj
}



const getAllFromDB=catchAsync(async(req:Request & {user?:any},res:Response)=>{
    const options=pink(req.query,["page","limit","sortBy","sortOrder"])
    const filters=pink(req.query,["startDate","endDate"])
     const user=req.user
    const result=await scheduleServices.getAllFromDB(options,filters,user)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Schedule get successfully!",
        data:result
    })
})
const getIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params
    const result=await scheduleServices.getSingleget(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Schedule Single get successfully!",
        data:result
    })
})

const deleteIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params
    const result=await scheduleServices.deleteintoBD(id)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Schedule delete successfully!",
        data:result
    })
})
const insertIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const result=await scheduleServices.insertIntoDB(req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Schedule Create successfully!",
        data:result
    })
})


export const scheduleController={
    getAllFromDB,
    insertIntoDB,
    getIntoDB,
    deleteIntoDB
}