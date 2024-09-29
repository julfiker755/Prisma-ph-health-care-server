import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { specialtiesServices } from "./specialties.services";



const getIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const result=await specialtiesServices.getIntoDB()

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Specialties get successfully!",
        data:result
    })
})

const insertIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const result=await specialtiesServices.insertIntoDB(req)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Specialties create successfully!",
        data:result
    })
})


const DeleteIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params
    const result=await specialtiesServices.DeleteIntoDB(id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Specialties delete successfully!",
        data:result
    })
})

export const specialtiesController={
    insertIntoDB,
    getIntoDB,
    DeleteIntoDB
}