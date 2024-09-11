import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";


const loginUser=catchAsync(async(req:Request,res:Response)=>{
    const result=await AuthServices.loginUser(req.body)
    const {refreshToken}=result
    res.cookie("refreshToken",refreshToken,{secure:false,httpOnly:true})

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Logged in successfully!",
        data:{
            accessToken:result.accessToken,
            needPasswordChange:result.needPasswordChange
        }
    })
})


const refreshToken=catchAsync(async(req:Request,res:Response)=>{
    const {refreshToken}=req.cookies

    const result=await AuthServices.refreshToken(refreshToken)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Logged in successfully!",
        data:result
    })
})



const changePassword=catchAsync(async(req:Request & {user?:any},res:Response)=>{
    const result=await AuthServices.changePassword(req.user,req.body)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"password change  successfully!",
        data:result
    })
})



const forgotPassword=catchAsync(async(req:Request,res:Response)=>{
    await AuthServices.forgotPassword(req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Check Your Email,Sir",
        data:null
    })
})

const resetPassword=catchAsync(async(req:Request,res:Response)=>{
    const token=req.headers.authorization || undefined
    const result=await AuthServices.resetPassword(token,req.body)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"password change successfull",
        data:result
    })
})

export const AuthController={
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}