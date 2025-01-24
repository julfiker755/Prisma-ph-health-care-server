import {Doctor, Prisma, PrismaClient, userRole, userStatus} from "@prisma/client"
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { fileUploader } from "../../../helpers/fileUploader";
import bcrypt from "bcrypt";



const prisma = new PrismaClient();

const getIntoBD = async (filters:any,options:any)=> {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const {search, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  console.log(search)

  if (search) {
    andConditions.push({
      OR:['name','email','contactNumber','address','qualification','designaton'].map(field => ({
        [field]: {
          contains:search,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    // Corrected specialties condition
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: 'insensitive',
            },
          },
        },
      },
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

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { averageRating: 'desc' },
    include: {
      // review: {
      //   select: {
      //     rating: true,
      //   },
      // },
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
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

const  createIntoBD = async (req:any):Promise<Doctor> => {
  const file=req?.file 
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




  const updateIntoBD=async(id:any,payload:any)=>{
    const {specialties,...doctorData}=payload


   const doctorInfo=await prisma.doctor.findUniqueOrThrow({
        where:{
            id
        }
    })

   await prisma.$transaction(async(transactionClient)=>{
         await transactionClient.doctor.update({
            where:{
                id
            },
            data:doctorData,
            include:{
                doctorSpecialties:true
            }
        })


        if(specialties && specialties?.length > 0){
         const deleteSpecialtiesId=specialties.filter((specialty:any)=>(specialty.isDeleted))
            for(const specialty of deleteSpecialtiesId ){
                await transactionClient.doctorSpecialties.deleteMany({
                    where:{
                        doctorId: doctorInfo.id,
                        specialitiesId:specialty.specialtiesId,
                        
                    }
                })
             }

        //  create
        const createSpecialtiesIds=specialties.filter((specialty:any)=>(!specialty.isDeleted))
        for(const specialty of createSpecialtiesIds){
            await transactionClient.doctorSpecialties.create({
                data:{
                    doctorId:doctorInfo.id,
                    specialitiesId:specialty.specialtiesId,
                    
                }
            })
         }
        }
    })
   
    // find the data response sent my client side
    const result=await prisma.doctor.findUnique({
        where:{
            id:doctorInfo.id
        },
        include:{
            doctorSpecialties:{
                include:{
                    specialties:true
                }
            }
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


// in of the soft delete
  const doctorSoftDelete=async(id:string)=>{
    await prisma.doctor.findUniqueOrThrow({
      where:{
        id:id,
        isDeleted:false
      }
    })
  
    const result=await prisma.$transaction(async(transactionClient)=>{
      const adminDeleteData=await transactionClient.doctor.update({
        where:{
          id
        },
        data:{
          isDeleted:true
        }
      })
  
      const userDeleteData=await transactionClient.user.update({
        where:{
          email:adminDeleteData.email
        },
        data:{
          status:userStatus.DELETED
        }
      })
      return userDeleteData
    })
    return result
  }

  export const DoctorService={
        createIntoBD,
        updateIntoBD ,
        getIntoBD,
        doctorDelete,
        doctorSoftDelete
  }