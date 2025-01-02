import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { patientService } from "./patient.service";




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
    const filters=pink(req.query,['search','name','email','address'])
    const options=pink(req.query,["page","limit","sortBy","sortOrder"])
    const result=await patientService.getIntoBD(filters,options)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"doctor data get uccessfully!",
        data:result
    })
})


const getSingleBD=catchAsync(async(req:Request,res:Response)=>{
  const {id}=req.params
    const result= await patientService.getSingleBD(id)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"single data get successfull",
      data:result
    })
 })

const createPatient=catchAsync(async(req:Request,res:Response)=>{
    const result= await patientService.createPatientDB(req)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"patient Create successfull",
      data:result
    })
 })

const updateIntoBD=catchAsync(async(req:Request,res:Response)=>{
   const {id}=req.params
    const result= await patientService.updateIntoBD(id,req)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"patient Update successfull",
      data:result
    })
 })


const deleteIntoBD=catchAsync(async(req:Request,res:Response)=>{
   const {id}=req.params
    const result= await patientService.doctorDeletDB(id)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Patient delete successfull",
      data:result
    })
 })


export const patientController={
    getIntoBD,
    createPatient,
    getSingleBD,
    updateIntoBD,
    deleteIntoBD
}