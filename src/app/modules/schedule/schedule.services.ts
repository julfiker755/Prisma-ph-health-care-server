import { addHours, addMinutes, format, getDate } from "date-fns"
import {PrismaClient, Schedule} from "@prisma/client"
import { ISchedule } from "./schedule.interface";
const prisma = new PrismaClient();

const insertIntoDB=async(payload:ISchedule):Promise<Schedule[]>=>{
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


export const scheduleServices={
    insertIntoDB
}