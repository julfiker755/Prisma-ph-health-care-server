import {PrismaClient, Schedule} from "@prisma/client"
import { paginationHelper } from "../../../helpers/paginationHelpers";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";


const prisma = new PrismaClient();


const  getAllFromDB= async (options:any,filters:any,user:any)=> {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
   const {startDate,endDate,...filterData}=filters
 
  
    const andConditions = [];
  
  if(startDate && endDate){
    andConditions.push({
       AND:[
          {
             schedule:{
              startDateTime:{
                gte:startDate
             }
             }
          },{
             schedule:{
              endDateTime:{
                lte:endDate
             }
             }
          }
       ]
    })
  }
 
  if (Object.keys(filterData).length > 0) {
    if(typeof filterData.isBooked === "string" &&  filterData.isBooked === "true"){
      filterData.isBooked=true
    }else if(typeof filterData.isBooked === "string" &&  filterData.isBooked === "false"){
      filterData.isBooked=false
    }


    const filterConditions = Object.keys(filterData).map(key => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions =
  andConditions.length > 0 ? { AND: andConditions } : {};
 

 
 
    const result = await prisma.doctorSchedule.findMany({
     where:whereConditions,
      skip,
      take: limit,
      orderBy: options.sortBy && options.sortOrder ? {
        [options.sortBy]: options.sortOrder
      } : {
       
      },
    });
  
    const total = await prisma.doctorSchedule.count({
       where:whereConditions,
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
 
const getMySchedule=async (options:any,filters:any,user:any)=> {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
 const {startDate,endDate,...filterData}=filters


        const andConditions = [];

      if(startDate && endDate){
        andConditions.push({
          AND:[
              {
                schedule:{
                  startDateTime:{
                    gte:startDate
                }
                }
              },{
                schedule:{
                  endDateTime:{
                    lte:endDate
                }
                }
              }
          ]
        })
      }

if (Object.keys(filterData).length > 0) {
  if(typeof filterData.isBooked === "string" &&  filterData.isBooked === "true"){
    filterData.isBooked=true
  }else if(typeof filterData.isBooked === "string" &&  filterData.isBooked === "false"){
    filterData.isBooked=false
  }


  const filterConditions = Object.keys(filterData).map(key => ({
    [key]: {
      equals: (filterData as any)[key],
    },
  }));
  andConditions.push(...filterConditions);
}

const whereConditions =
andConditions.length > 0 ? { AND: andConditions } : {};




  const result = await prisma.doctorSchedule.findMany({
   where:whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? {
      [options.sortBy]: options.sortOrder
    } : {
     
    },
  });

  const total = await prisma.doctorSchedule.count({
     where:whereConditions,
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


const insertIntoDB=async(user:any,payload:{scheduleIds:string[]})=>{
    const doctorData=await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })
   
    const doctorScheduleData=payload?.scheduleIds.map(scheduleId=>({
        doctorId:doctorData.id,
        scheduleId,
        isBooked: false
    }))
   const result=await prisma.doctorSchedule.createMany({
    data:doctorScheduleData
   })

   return  result
}


const deleteFormDB=async(id:string,user:any)=>{
  const doctorData=await prisma.doctor.findUniqueOrThrow({
    where:{
      email:user?.email
    }
  })
  const isBookedSchedule=await prisma.doctorSchedule.findFirst({
    where:{
        doctorId:doctorData.id,
        scheduleId:id,
        isBooked:true
      },
  })

  if(isBookedSchedule){
    throw new ApiError(httpStatus.BAD_REQUEST,"You can not delte schedule becase of this schedule alreay booked")
  }
  const result=await prisma.doctorSchedule.delete({
    where:{
      doctorId_scheduleId:{
        doctorId:doctorData.id,
        scheduleId:id
      }
    }
  })
  return result
}




export const doctorScheduleServices={
    insertIntoDB,
    getAllFromDB,
    deleteFormDB,
    getMySchedule
}