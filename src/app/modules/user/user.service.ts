import { userRole,PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";

const prisma = new PrismaClient();

const createAdmin = async (req: any) => {
    const file=req.file
    // console.log(file)
    // console.log(data)
    if(file){
        const uploadToCloudinaryItems=await fileUploader.uploadToCloudinary(file)
        req.body.admin.profilePhoto=uploadToCloudinaryItems?.secure_url
        console.log(req.body)
    }

    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    
    const userData = {
        email: req.body.admin.email,
        password:hashPassword,
        role: userRole.ADMIN
    }

    const adminData = {
        name: req.body.admin.name,
        email: req.body.admin.email,
        contactNumber: req.body.admin.contactNumber,
        profilePhoto:req.body.admin.profilePhoto
    }

const result=await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
        data:userData
    })
    const createAdminData=await transactionClient.admin.create({
        data:adminData
    })
    return createAdminData
})

    return result
}

export const userService = {
    createAdmin
}