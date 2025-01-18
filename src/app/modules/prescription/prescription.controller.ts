import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { prescriptionService } from "./prescripation.services";



const prescriptionInsertBD=catchAsync(async(req:Request & {user?:any},res:Response)=>{
    const user=req.user
    const result=await prescriptionService.prescriptionInsertDB(user,req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Prescription Create successfully!",
        data:result
    })
})

const myPrescriptionInsertBD=catchAsync(async(req:Request & {user?:any},res:Response)=>{
    const user=req.user
    const result=await prescriptionService.myPrescripationBD(user)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Prescription get successfully!",
        data:result
    })
})

export const prescriptionController ={
    prescriptionInsertBD,
    myPrescriptionInsertBD
}