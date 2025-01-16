import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paymentService } from "./paymnet.service";



const initPaymentBD=catchAsync(async(req:Request,res:Response)=>{
    const {appointmentId}=req.params
    const result= await paymentService.initPayment(appointmentId)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Payment intiate successfull",
      data:result
    })
 })

const validatePaymentBD=catchAsync(async(req:Request,res:Response)=>{
    const result= await paymentService.validationPayment(req.query)
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Payment validate successfull",
      data:result
    })
 })


 export const paymentController={
    initPaymentBD,
    validatePaymentBD
 }