import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAuthUser } from "../../interface/comman";


const pink=<T,K extends keyof T>(obj:T,keys:K[])=>{
  const filnalObj:Partial<T> ={}
for (const key of keys){
   if(obj && Object.hasOwnProperty.call(obj,key)){
      filnalObj[key]=obj[key]
   }
}
return filnalObj
}


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

// getAlBD
 const getAllBD=catchAsync(async(req,res)=>{
  const filters=pink(req.query,["email","role","status","search"])
  const options=pink(req.query,["page","limit","sortBy","sortOrder"])

  const result= await userService.getAllBD(filters,options)
  sendResponse(res,{
     statusCode:httpStatus.OK,
     success:true,
     message:"User Data get successfull",
     meta:result.meta,
     data:result.data
  })
})

// changeStatus
const changeProfileStatus=catchAsync(async(req:Request,res:Response)=>{
  const {id}=req.params
  const result= await userService.changeProfileStatus(id,req.body)
  sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"Change user Status",
    data:result
  })
})

// changeStatus
const getMyProfile=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
  const user=req.user
  const result= await userService.getMyProfile(user as IAuthUser)
  sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"Profile get successfull",
    data:result
  })
})


// update -my-profile
const updateMyProfile=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
  const user=req.user
  const result= await userService.updateMyProfile(user as IAuthUser,req)
  sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:"Profile update successfull",
    data:result
  })
})


export const userController={
    createAdmin,
    createDoctor,
    createPatient,
    getAllBD,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}