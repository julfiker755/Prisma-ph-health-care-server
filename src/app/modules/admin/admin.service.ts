import { Admin, Prisma, PrismaClient, userStatus } from "@prisma/client"
import { paginationHelper } from "../../../helpers/paginationHelpers"


const prisma = new PrismaClient()




const getAllBD = async (filters: any, options: any) => {
  const { search, ...filderData } = filters
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
  const addCondition: Prisma.AdminWhereInput[] = []

  // if(params.search){
  //   addCondition.push({
  //     OR:[
  //       {
  //         name:{
  //           contains:params.search,
  //           mode:'insensitive'
  //         }
  //       },
  //       {
  //         email:{
  //           contains:params.search,
  //           mode:'insensitive'
  //         }
  //       }
  //     ]
  //   })
  // }


  if (filters.search) {
    addCondition.push({
      OR: ["name", "email"]?.map((field) => ({
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
          equals: filderData[key]
        }
      }))
    })
  }

//  is conditon false data
  addCondition.push({
    isDeleted:false
  })

  const whereConditions: Prisma.AdminWhereInput = { AND: addCondition }



  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? {
      [sortBy]: sortOrder
    } : {
      createdAt: 'desc'
    }
  })

  const count = await prisma.admin.count({
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

// get-single-data
const getSingleIdBD = async (id: string):Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id: id,
      isDeleted:false
    }
  })
  return result
}


const getSingleUpdateBD = async (id: string, data: Partial<Admin>):Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where:{
      id,
      isDeleted:false
    }
  })

  const result = await prisma.admin.update({
    where: {
         id
       },
    data
  })
  return result
}


const getSingleDeleteBD=async(id:string)=>{
  await prisma.admin.findUniqueOrThrow({
    where:{
      id:id,
    }
  })
  const result=await prisma.$transaction(async(transactionClient)=>{
    const adminDeleteData=await transactionClient.admin.delete({
      where:{
        id
      }
    })
    const userDeleteData=await transactionClient.user.delete({
      where:{
        email:adminDeleteData.email
      }
    })
    return userDeleteData
  })
  return result
}


// soft delete
const getSingleSoftDeleteBD=async(id:string)=>{
  await prisma.admin.findUniqueOrThrow({
    where:{
      id:id,
      isDeleted:false
    }
  })

  const result=await prisma.$transaction(async(transactionClient)=>{
    const adminDeleteData=await transactionClient.admin.update({
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


export const adminServies = {
  getAllBD,
  getSingleIdBD,
  getSingleUpdateBD,
  getSingleDeleteBD,
  getSingleSoftDeleteBD
}