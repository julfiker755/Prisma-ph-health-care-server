import { PaymentStatus, PrismaClient, userRole } from "@prisma/client";

const prisma = new PrismaClient();

const fatchDashboardMetaData = async (user: any) => {
 let metaData
  switch (user?.role) {
    case userRole.SUPER_ADMIN:
      metaData=getSuperAdminMetaData();
      break;
    case userRole.ADMIN:
      metaData=getAdminMetaData();
      break;
    case userRole.DOCTOR:
      metaData=getDoctorMetaData(user);
      break;
    case userRole.PATIENT:
      metaData=getPatientMetaData(user);
      break;
    default:
        throw new Error("InVaild user Role")
  }
  return metaData
};

// super-admin
const getSuperAdminMetaData = async () => {
    const appoinmentCount=await prisma.appointment.count()
    const patientCount=await prisma.patient.count()
    const doctorCount=await prisma.patient.count()
    const paymentcount=await prisma.payment.count()
    const admincount=await prisma.admin.count()
    const totalReview=await prisma.payment.aggregate({
      _sum:{amount:true},
      where:{
        status:PaymentStatus.PAID
     }
    })
 
  return {appoinmentCount,patientCount, admincount,doctorCount,paymentcount,totalReview}
};

// admin
const getAdminMetaData = async () => {
   const appoinmentCount=await prisma.appointment.count()
   const patientCount=await prisma.patient.count()
   const doctorCount=await prisma.patient.count()
   const paymentcount=await prisma.payment.count()
   const totalReview=await prisma.payment.aggregate({
     _sum:{amount:true},
     where:{
        status:PaymentStatus.PAID
     }
   })

  return {appoinmentCount,patientCount,doctorCount,paymentcount,totalReview}
};

// doctor
const getDoctorMetaData = async (user:any) => {
    const doctorData=await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })
const appoinmentCount=await prisma.appointment.count({
    where:{
        doctorId:doctorData.id
    }
})
const patientCount=await prisma.appointment.groupBy({
    by:['patientId'],
    _count:{
        id:true
    }
})

const reviewCount=await prisma.review.count({
    where:{
        doctorId:doctorData.id
    }
})

const totalrevenue=await prisma.payment.aggregate({
    _sum:{
        amount:true
    },
    where:{
        appoinment:{
            doctorId:doctorData.id
        },
        status:PaymentStatus.PAID
    }
})
const appoinmentStatusDistribution=await prisma.appointment.groupBy({
    by:["status"],
    _count:{id:true},
    where:{
        doctorId:doctorData.id
    }
})

const formatterAppoinmentStatusDistribution=appoinmentStatusDistribution.map((count)=>({
    status:count.status,
    count:Number(count._count.id)
}))
 return {
    appoinmentCount,
    reviewCount,
    patientCount:patientCount?.length,
    totalrevenue,
    formatterAppoinmentStatusDistribution
 }
};

// patient
const getPatientMetaData = async (user:any) => {
    const patientData=await prisma.patient.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })
const appoinmentCount=await prisma.appointment.count({
    where:{
        patientId:patientData.id
    }
})
const prescripatonCount=await prisma.prescription.count({
    where:{
        patientId:patientData.id
    }
})

const reviewCount=await prisma.review.count({
    where:{
        patientId:patientData.id
    }
})


const appoinmentStatusDistribution=await prisma.appointment.groupBy({
    by:["status"],
    _count:{id:true},
    where:{
        patientId:patientData.id
    }
})

const formatterAppoinmentStatusDistribution=appoinmentStatusDistribution.map((count)=>({
    status:count.status,
    count:Number(count._count.id)
}))
return {
    appoinmentCount,
    prescripatonCount,
    reviewCount,
    formatterAppoinmentStatusDistribution
}
};

export const metaService = {
  fatchDashboardMetaData,
};
