import {AppointmentStatus, PaymentStatus, PrismaClient} from "@prisma/client"
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";


const prisma = new PrismaClient();


const prescriptionInsertDB=async(user:any,data:any)=>{
    const appointmentData=await prisma.appointment.findUniqueOrThrow({
        where:{
            id:data.appointmenId,
            status:AppointmentStatus.COMPLETED,
            paymentStatus:PaymentStatus.PAID
        },
        include:{
            doctor:true
        }
    })
    


    if(user.email !== appointmentData.doctor.email){
        throw new ApiError(httpStatus.BAD_REQUEST,"This is not your appoinmenta")
    }
  
    const result=await prisma.prescription.create({
        data:{
            appointmentId:appointmentData.id,
            doctorId:appointmentData.doctor.id,
            patientId:appointmentData.patientId,
            instructions:data.instructions
        },
        include:{
            patient:true
        }
    })

   return result
}

const myPrescripationBD=async(user:any)=>{
    const result=await prisma.prescription.findMany({
        where:{
            patient:{
                email:user.email
            }
        }
    })
   return result
}

export const prescriptionService={
    prescriptionInsertDB,
    myPrescripationBD
}