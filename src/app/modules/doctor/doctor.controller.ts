import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { DoctorService } from "./doctor.service";



const pink=<T,K extends keyof T>(obj:T,keys:K[])=>{
    const filnalObj:Partial<T> ={}
  for (const key of keys){
     if(obj && Object.hasOwnProperty.call(obj,key)){
        filnalObj[key]=obj[key]
     }
  }
  return filnalObj
}



// get doctors
const getIntoBD=catchAsync(async(req:Request,res:Response)=>{
    const filters=pink(req.query,['name','email','contactNumber','address','qualification','designation'])
    const options=pink(req.query,["page","limit","sortBy","sortOrder"])
    const result=await DoctorService.getIntoBD(filters,options)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"update in successfully!",
        data:result
    })
})



// doctors update one by one
const updateIntoBD=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params
    const result=await DoctorService.updateIntoBD(id,req.body)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"update in successfully!",
        data:result
    })
})

export const DoctorController={
    updateIntoBD,
    getIntoBD
}