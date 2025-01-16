import { Prisma, PrismaClient, userRole, userStatus } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { v4 as uuidv4 } from 'uuid';



const prisma = new PrismaClient();


const createAppoinment=async(user:any,data:any)=>{
    const patientData=await prisma.patient.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })
const doctorData=await prisma.doctor.findUniqueOrThrow({
    where:{
        id:data.doctorId
    }
}) 

const doctorScheduleData=await prisma.doctorSchedule.findFirstOrThrow({
    where:{
        doctorId:doctorData.id,
        scheduleId:data.scheduleId,
        isBooked:false
    }
})
const videoCallingIdNum:string=uuidv4()

 const result=await prisma.$transaction(async(tx)=>{
    const appoinmentData=await tx.appointment.create({
        data:{
            patientId:patientData.id,
            doctorId:doctorData.id,
            scheduleId:data.scheduleId,
            videoCallingId:videoCallingIdNum
        }as any,
        include:{
            patient:true,
            doctor:true,
            schedule:true
        }
    })
   await tx.doctorSchedule.update({
    where:{
        doctorId_scheduleId:{
            doctorId:doctorData.id,
            scheduleId:data.scheduleId
        }
    },
    data:{
        isBooked:true,
        appointmentId:appoinmentData.id
    }
})

const today=new Date()
const transactionId="ph-helathCare-"+today.getFullYear()+"-"+today.getMonth()+"-"+today.getHours()
await tx.payment.create({
    data:{
        appointmentId:appoinmentData.id,
        amount:doctorData.appointmentFee,
        transactionId:transactionId,
    }
})

return appoinmentData
 })

    return result
}



const myAppointmentBD=async(user:any,filters:any,options:any)=>{
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const {search, specialties, ...filterData } = filters;

    const andConditions: Prisma.AppointmentWhereInput[] = [];

   if(user?.role === userRole.PATIENT){
    andConditions.push({
        patient:{
            email:user.email
        }
    })
   }else if(user?.role === userRole.DOCTOR){
    andConditions.push({
        doctor:{
            email:user.email
        }
    })
   }
  
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
          [key]: {
            equals: (filterData as any)[key],
          },
        }));
        andConditions.push(...filterConditions);
      }


      const whereConditions: Prisma.AppointmentWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};
  
    const result = await prisma.appointment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { createdAt: 'desc' },
      include: user.role === userRole.PATIENT ? {
        doctor:true,
        schedule:true
      } :{
        patient:{
            include:{
                PatientHealthData:true,
                medicalReport:true,
               }
        },
        schedule:true
      }
    });
  
    const total = await prisma.appointment.count({
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

}

export const appoinmentService={
    createAppoinment,
    myAppointmentBD
}