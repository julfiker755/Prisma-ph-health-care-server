import { userRole,PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";

const prisma = new PrismaClient();
// create-admin
const createAdmin = async (req: any) => {
    const file=req.file

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

  

const result=await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
        data:userData
    })
    const createAdminData=await transactionClient.admin.create({
        data:req.body.admim
    })
    return createAdminData
})

    return result
}

// create -doctor
const createDoctor = async (req: any) => {
    const file=req.file
    if(file){
        const uploadToCloudinaryItems=await fileUploader.uploadToCloudinary(file)
        req.body.doctor.profilePhoto=uploadToCloudinaryItems?.secure_url
    }

    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    
    const userData = {
        email: req.body.doctor.email,
        password:hashPassword,
        role: userRole.DOCTOR
    }

   

const result=await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
        data:userData
    })

    const createDoctorData=await transactionClient.doctor.create({
        data:req.body.doctor
    })
    return createDoctorData
})

    return result
}
// create-patient
const createPatient = async (req: any) => {
    const file=req.file
    if(file){
        const uploadToCloudinaryItems=await fileUploader.uploadToCloudinary(file)
        req.body.patient.profilePhoto=uploadToCloudinaryItems?.secure_url
    }

    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    
    const userData = {
        email: req.body.patient.email,
        password:hashPassword,
        role: userRole.PATIENT
    }

   

const result=await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
        data:userData
    })

    const createPatientData=await transactionClient.patient.create({
        data:req.body.patient
    })
    return createPatientData
})

    return result
}


export const userService = {
    createAdmin,
    createDoctor,
    createPatient
}