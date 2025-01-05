import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { scheduleServices } from "./schedule.services";




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
    insertIntoDB
}