import axios from "axios";
import config from "../../config";
import { PaymentStatus, PrismaClient } from "@prisma/client";
import { SSLService } from "../SSL/ssl.service";


const prisma=new PrismaClient()

const initPayment=async(appointmentId:string)=>{
    const paymentData=await prisma.payment.findFirstOrThrow({
        where:{
            appointmentId
        },
        include:{
            appoinment:{
                include:{
                    patient:true
                }
            }
        }
    })
   
const initPaymentData={
    amount:paymentData.amount,
    transactionId:paymentData.transactionId,
    name:paymentData.appoinment.patient.name,
    email:paymentData.appoinment.patient.email,
    address:paymentData.appoinment.patient.address,
    contactNumber:paymentData.appoinment.patient.contactNumber
}

const result=await SSLService.initPayment(initPaymentData)
return {
    paymentUrl:result.GatewayPageURL
}
}

//amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=progr67890f4949c40&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=e7201f514e345587078faac4f99c57b2&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id

const validationPayment=async(payload:any)=>{
    // if(!payload || !payload.status || !(payload.status == "VALID")){
    //     return {
    //         message:"Invaild Payment"
    //     }
    // }
 
    //  const response=await SSLService.validatePayment(payload)
     
    //  if(response?.status !== 'VALTD'){
    //     return {
    //         message:"Payment Fail"
    //     }
    // }

    const response=payload

  const result=  await prisma.$transaction(async(tx)=>{
      const updatePaymentData= await tx.payment.update({
           where:{
            transactionId:response?.tran_id 
           },
           data:{
             status:PaymentStatus.PAID,
             paymentGatewayData:response
           }
        })
    await tx.appointment.update({
      where:{
        id:updatePaymentData.appointmentId
      },
      data:{
        paymentStatus:PaymentStatus.PAID
      }
    })
    return {
        message:"Payment is success!"
    }
    })

    return result
}

export const paymentService={
    initPayment,
    validationPayment
}