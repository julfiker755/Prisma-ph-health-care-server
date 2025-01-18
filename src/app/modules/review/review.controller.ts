import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { reviewService } from "./review.services";




const reviewInsertBD=catchAsync(async(req:Request & {user?:any},res:Response)=>{
    const user=req.user
    const result=await reviewService.reviewintoBD(user,req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"review Create successfully!",
        data:result
    })
})


export const reviewController={
    reviewInsertBD
}