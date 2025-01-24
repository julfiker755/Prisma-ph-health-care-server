import { addHours, addMinutes, format, getDate } from "date-fns"
import {PrismaClient, Schedule} from "@prisma/client"
import { ISchedule } from "./schedule.interface";
import { paginationHelper } from "../../../helpers/paginationHelpers";
const prisma = new PrismaClient();


const convartDateTime=async(date:Date)=>{
    const offset=date.getTimezoneOffset() * 60000
    return new Date(date.getTime() + offset)
}

const insertIntoDB=async(payload:ISchedule)=>{
   const {startDate,endDate,startTime,endTime}=payload

    const currentDate=new Date(startDate)    
    const lastDate=new Date(endDate)

    const intervalTime=30
   
    const schedules=[]

    while (currentDate <= lastDate){
       // start date
      const startDateTime=new Date(
        addMinutes(
           addHours(
              `${format(currentDate,'yyyy-MM-dd')}`,
              Number(startTime.split(':')[0])
           ),
           Number(startTime.split(':')[1])
        )
      )
   //  end date
   const endDateTime=new Date(
       addMinutes(
        addHours(
           `${format(currentDate,'yyyy-MM-dd')}`,
           Number(endTime.split(':')[0])
        ),
        Number(endTime.split(':')[1])
       )
     )
     

     while(startDateTime < endDateTime){
    
        const scheduleData={
           startDateTime:startDateTime,
           endDateTime:addMinutes(startDateTime,intervalTime)
          }
         
          const exsistingSchedule=await prisma.schedule.findFirst({
           where:{
              startDateTime:scheduleData.startDateTime,
              endDateTime:scheduleData.endDateTime
           }
          })
        
          if(!exsistingSchedule){
           const result=await prisma.schedule.create({
              data:scheduleData
             })
             
             schedules.push(result)
          }

          startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime)
     }
     currentDate.setDate(currentDate.getDate()+1)
     
    }
return schedules

}


const  getAllFromDB= async (options:any,filters:any,user:any)=> {
   const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const {startDate,endDate}=filters

 
   const andConditions = [];
 

  
 if(startDate && endDate){
   andConditions.push({
      AND:[
         {
            startDateTime:{
               gte:startDate
            }
         },{
            endDateTime:{
               lte:endDate
            }
         }
      ]
   })
 }

 const whereConditions =
 andConditions.length > 0 ? { AND: andConditions } : {};

  const doctorSchedules=await prisma.doctorSchedule.findMany({
    where:{
      doctor:{
         email:user.email
      }
    }
  })

  const doctorSchedulesIds=doctorSchedules.map(schedule=>schedule.scheduleId)



   const result = await prisma.schedule.findMany({
    where:{
      ...whereConditions,
      id:{
         notIn:doctorSchedulesIds
      }
    },
     skip,
     take: limit,
     orderBy: options.sortBy && options.sortOrder ? {
       [options.sortBy]: options.sortOrder
     } : {
       createdAt: 'desc'
     },
   });
 
   const total = await prisma.schedule.count({
      where:{
         ...whereConditions,
         id:{
            notIn:doctorSchedulesIds
         }
       },
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


 const getSingleget=async(id:any)=>{
    const result=await prisma.schedule.findUnique({
      where:{
         id:id
      }
    })
    return result
 }

 const deleteintoBD=async(id:any)=>{
    const result=await prisma.schedule.delete({
      where:{
         id:id
      }
    })
    return result
 }





export const scheduleServices={
    getAllFromDB,
    insertIntoDB,
    getSingleget,
    deleteintoBD
}