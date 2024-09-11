import { NextFunction, Request, Response } from "express"
import { jwtHelpers } from "../../helpers/jwtHelpers"
import config from "../config"
import ApiError from "../errors/ApiError"
import httpStatus from "http-status"

const auth=(...roles:string[])=>{
    return async(req:Request & {user?:any},res:Response,next:NextFunction)=>{
        try{
            const token=req.headers.authorization
            if(!token){
                throw new ApiError(httpStatus.UNAUTHORIZED,"You are not authorizated")
            }
            const varifyToken=jwtHelpers.varifyToken(token,config.jwt.access_token_jwt_secret as string)

            req.user=varifyToken
            
            if(roles?.length && !roles.includes(varifyToken.role)){
                throw new ApiError(httpStatus.FORBIDDEN,"Forbitdden message")
            }
            next()
           
        }catch(err){
          next(err)
        }
    }
}

export default auth