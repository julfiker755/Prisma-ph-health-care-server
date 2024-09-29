import { userRole,PrismaClient, Prisma, userStatus } from "@prisma/client"
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { IPaginationOptions } from "../admin/admin.interface";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { Request } from "express";
import { IAuthUser } from "../../interface/comman";

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
// get -data
const getAllBD = async (filters:any, options:IPaginationOptions) => {
    const { search, ...filderData } = filters
    const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const addCondition: Prisma.UserWhereInput[] = []
  
    
  
    if (filters.search) {
      addCondition.push({
        OR: ["email"]?.map((field) => ({
          [field]: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }))
      })
    }
  
  
  
  
    // spesifig value search
    if (Object.keys(filderData).length > 0) {
      addCondition.push({
        AND: Object.keys(filderData).map((key) => ({
          [key]: {
            equals: (filderData as any)[key]
          }
        }))
      })
    }
  

  
    const whereConditions: Prisma.UserWhereInput = addCondition.length > 0 ? { AND: addCondition } : {}
  
  
  
    const result = await prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: sortBy && sortOrder ? {
        [sortBy]: sortOrder
      } : {
        createdAt: 'desc'
      },
      include:{
        admin:true,
        doctor:true, 
        patient:true
      }
    })
  
    const count = await prisma.user.count({
      where: whereConditions
    })
  
  
    return {
      meta: {
        page,
        limit,
        total: count
      },
      data: result
    }
  }
// changeProfileStatus
const changeProfileStatus=async(id:string,status:userRole)=>{
    await prisma.user.findUniqueOrThrow({
       where:{
        id
       }
    })

const updateStatus=await prisma.user.update({
    where:{
        id
    },
    data:status
})
return updateStatus
}

// getMyProfile
const getMyProfile=async(user:IAuthUser)=>{
   const userInfo=await prisma.user.findUniqueOrThrow({
    where:{
        email:user?.email
    }
   })


   let profileInfo
   if(user?.role === userRole.SUPER_ADMIN){
     profileInfo=await prisma.admin.findUnique({
        where:{
            email:userInfo.email
        }
     })
   }else if(user?.role === userRole.ADMIN){
    profileInfo=await prisma.admin.findUnique({
        where:{
            email:userInfo.email
        }
     })
   }else if(user?.role === userRole.DOCTOR){
    profileInfo=await prisma.doctor.findUnique({
        where:{
            email:userInfo.email
        }
     })
   }else if(user?.role === userRole.PATIENT){
    profileInfo=await prisma.patient.findUnique({
        where:{
            email:userInfo.email
        }
     })
   }
  
   return {...userInfo,...profileInfo}
}


// update my profile
const updateMyProfile=async(user:IAuthUser,req:Request)=>{
    const userInfo=await prisma.user.findUniqueOrThrow({
        where:{
            email:user?.email,
            status:userStatus.ACTIVE
        }
       })
    
       const file=req.file
       if(file){
           const uploadToCloudinaryItems=await fileUploader.uploadToCloudinary(file)
           req.body.profilePhoto=uploadToCloudinaryItems?.secure_url
       }
    
       let profileInfo
       if(user?.role === userRole.SUPER_ADMIN){
         profileInfo=await prisma.admin.update({
            where:{
                email:userInfo.email
            },
            data:req.body
         })
       }else if(user?.role === userRole.ADMIN){
        profileInfo=await prisma.admin.update({
            where:{
                email:userInfo.email
            },
            data:req.body
         })
       }else if(user?.role === userRole.DOCTOR){
        profileInfo=await prisma.doctor.update({
            where:{
                email:userInfo.email
            },
            data:req.body
         })
       }else if(user?.role === userRole.PATIENT){
        profileInfo=await prisma.patient.update({
            where:{
                email:userInfo.email
            },
            data:req.body
         })
       }
      
       return {...profileInfo}
}


export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllBD,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}