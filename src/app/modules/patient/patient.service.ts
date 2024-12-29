import {Patient, Prisma, PrismaClient, userRole} from "@prisma/client"
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { fileUploader } from "../../../helpers/fileUploader";
import bcrypt from "bcrypt";



const prisma = new PrismaClient();

const getIntoBD = async (filters:any,options:any)=> {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const {search, ...filterData } = filters;

  const andConditions:Prisma.PatientWhereInput[] = [];


  if (search) {
    andConditions.push({
      OR:['name','email','address'].map(field => ({
        [field]: {
          contains:search,
          mode: 'insensitive',
        },
      })),
    });
  }

 

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map(key => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? {
      [options.sortBy]: options.sortOrder
    } : {
      createdAt: 'desc'
    },
    include: {
      PatientHealthData:true,
      medicalReport:true
    },
  });

  const total = await prisma.patient.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};


const createPatientDB = async (req:any):Promise<Patient> => {
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

const getSingleBD=async(id:string)=>{
   const result=await prisma.patient.findUniqueOrThrow({
    where:{
      id
    },
    include: {
      PatientHealthData:true,
      medicalReport:true
    },
   })
   return result
}

const updateIntoBD=async(id:string,req:any)=>{
  const result=await prisma.patient.update({
    where:{
      id
    },
    data:req.body,
    include:{
      PatientHealthData:true,
      medicalReport:true
    }
  })
  return result
}

  // delete for doctors
  const doctorDelete=async(id:string)=>{
     const result=await prisma.doctor.delete({
      where:{
        id
      }
     })
     return result
  }

  export const patientService={
    getIntoBD,
    createPatientDB,
    getSingleBD,
    updateIntoBD
  }