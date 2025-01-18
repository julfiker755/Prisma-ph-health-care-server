import {AppointmentStatus, PaymentStatus, PrismaClient} from "@prisma/client"
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";


const prisma = new PrismaClient();


const reviewintoBD=async(user:any,data:any)=>{
   const patientData=await prisma.patient.findUniqueOrThrow({
     where:{
        email:user.email
     }
   })

    const appoinmentaData=await prisma.appointment.findUniqueOrThrow({
        where:{
            id:data.appointmentId
        }
    })

    if(!(patientData.id === appoinmentaData.patientId)){
       throw new ApiError(httpStatus.BAD_REQUEST,"This is not your appointments")
    }
   return await prisma.$transaction(async(tx)=>{
    const result=await tx.review.create({
        data:{
            appointmentId:appoinmentaData.id,
            doctorId:appoinmentaData.doctorId,
            patientId:appoinmentaData.patientId,
            rating:data.rating,
            comment:data.comment
        }
       })

       const averageRating=await tx.review.aggregate({
         _avg:{
            rating:true
         }
       })

       await tx.doctor.update({
         where:{
            id:result.doctorId
         },
         data:{
            averageRating:averageRating._avg.rating as number
         }
       })
    return result

   })
}



export const reviewService={
    reviewintoBD
}