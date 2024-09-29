import { fileUploader } from "../../../helpers/fileUploader"
import {PrismaClient} from "@prisma/client"


const prisma = new PrismaClient();


  const  getIntoDB=async()=>{
     const result=await prisma.specialties.findMany()
     return result
  }


const insertIntoDB =async(req:any)=>{
    const file=req.file

    if(file){
        const uploadToCloudinaryItems=await fileUploader.uploadToCloudinary(file)
        req.body.icon=uploadToCloudinaryItems?.secure_url
        console.log(req.body)
    }
    const result=await prisma.specialties.create({
        data:req.body
    })
    return result
}

const  DeleteIntoDB=async(id:string)=>{
    const result=await prisma.specialties.delete({
        where:{
            id:id
        }
    })
    return result
 }

export const specialtiesServices={
    insertIntoDB,
    getIntoDB,
    DeleteIntoDB
}