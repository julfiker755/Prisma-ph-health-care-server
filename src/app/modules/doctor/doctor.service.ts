import {Prisma, PrismaClient} from "@prisma/client"
import { paginationHelper } from "../../../helpers/paginationHelpers";



const prisma = new PrismaClient();



const getIntoBD = async (filters:any,options:any)=> {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const {search, specialties, ...filterData } = filters;
  
    const andConditions: Prisma.DoctorWhereInput[] = [];
  
    if (search) {
      andConditions.push({
        OR:['name','email','contactNumber','address','qualification','designation'].map(field => ({
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
            //  delete
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


  export const DoctorService={
        updateIntoBD ,
        getIntoBD
  }