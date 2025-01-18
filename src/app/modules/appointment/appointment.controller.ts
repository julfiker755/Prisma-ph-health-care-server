import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { appoinmentService } from "./appointment.service";


const pink=<T,K extends keyof T>(obj:T,keys:K[])=>{
    const filnalObj:Partial<T> ={}
  for (const key of keys){
     if(obj && Object.hasOwnProperty.call(obj,key)){
        filnalObj[key]=obj[key]
     }
  }
  return filnalObj
}


const createAppoinment=catchAsync(async(req:Request & {user?:any},res:Response)=>{
    const user=req.user
    
    const result=await appoinmentService.createAppoinment(user,req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Appointment create successfully!",
        data:result
    })
})
const MyAppoinment=catchAsync(async(req:Request & {user?:any},res:Response)=>{  
    const user=req.user
    const filters=pink(req.query,["status","paymentStatus"])
    const options=pink(req.query,["page","limit","sortBy","sortOrder"])
    const result=await appoinmentService.myAppointmentBD(user,filters,options)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"My Appointment successfully!",
        data:result
    })
})

const changeAppoinmentStatus=catchAsync(async(req:Request &{user?:any},res:Response)=>{
    const {id}=req.params
    const {status}=req.body
    const user=req.user
    const result=await appoinmentService.changeAppoinmentStatus(id,status,user)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Appointment Status change successfully!",
        data:result
    })
})

export const AppointmentController={
    createAppoinment,
    changeAppoinmentStatus,
    MyAppoinment,
}

