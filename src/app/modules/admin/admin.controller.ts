import { adminServies } from "./admin.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";


const pink=<T,K extends keyof T>(obj:T,keys:K[])=>{
    const filnalObj:Partial<T> ={}
  for (const key of keys){
     if(obj && Object.hasOwnProperty.call(obj,key)){
        filnalObj[key]=obj[key]
     }
  }
  return filnalObj
}




const getAllBD=catchAsync(async(req,res)=>{
   const filters=pink(req.query,["search","email","name"])
   const options=pink(req.query,["page","limit","sortBy","sortOrder"])

   const result= await adminServies.getAllBD(filters,options)
   sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Admin Data get successfull",
      meta:result.meta,
      data:result.data
   })
})



const getSingleIdBD=catchAsync(async(req,res)=>{
   const {id}=req.params
   const result= await adminServies.getSingleIdBD(id)
   sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Single Data get successfull",
      data:result
   })
})



const getSingleUpdateBD=catchAsync(async(req,res)=>{
   const {id}=req.params
   const result= await adminServies.getSingleUpdateBD(id,req.body)
   sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Single data Update successfull",
      data:result
   })
})


const getSingleDeleteBD=catchAsync(async(req,res)=>{
   const {id}=req.params
   const result= await adminServies.getSingleDeleteBD(id)
   sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Single data Delete successfull",
      data:result
   })
}
)


const getSingleSoftDeleteBD=catchAsync(async(req,res)=>{
   const {id}=req.params
   const result= await adminServies.getSingleSoftDeleteBD(id)
   sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:"Single Soft data Delete successfull",
      data:result
   })
})




export const adminController={
    getAllBD,
    getSingleIdBD,
    getSingleUpdateBD,
    getSingleDeleteBD,
    getSingleSoftDeleteBD
}