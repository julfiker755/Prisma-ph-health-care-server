import { PrismaClient, userStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const prisma = new PrismaClient();



const loginUser=async(payload:{
    email:string,
    password:string
})=>{
    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:userStatus.ACTIVE
        }
    })

    const isCorrectPassword:Boolean=await bcrypt.compare(payload.password,userData.password)

    if(!isCorrectPassword){
        throw new Error("Password is not vaild")
    }
 
    const accessToken=jwtHelpers.generateToken({
        email:userData.email,
        role:userData.role
    },
    config.jwt.access_token_jwt_secret as string,
    config.jwt.access_token_expires_in as string
 )
   // refreshToken
   const refreshToken=jwtHelpers.generateToken({
    email:userData.email,
    role:userData.role
},
config.jwt.refresh_token_jwt_secret as string,
config.jwt.refresh_token_expires_in as string
)
   return {
    accessToken,
    refreshToken,
    needPasswordChange:userData.needPasswordChange
   }
}




const refreshToken=async(token:string)=>{
    let decodedToken
    try{
        decodedToken = jwtHelpers.varifyToken(token, 'julfiker')
        console.log(decodedToken)
    }catch(err){
      throw new Error("You are not authorized")
    }
    const isUserExsis=await prisma.user.findUniqueOrThrow({
        where:{
            email:decodedToken.email,
            status:userStatus.ACTIVE
        }
    })
    const accessToken=jwtHelpers.generateToken({
        email:isUserExsis.email,
        role:isUserExsis.role
    },
    config.jwt.access_token_jwt_secret as string,
    config.jwt.access_token_expires_in as string
 )

 return {
    accessToken,
    needPasswordChange:isUserExsis.needPasswordChange
   }
}





const  changePassword=async(user:any,payload:any)=>{
  const userData=await prisma.user.findUniqueOrThrow({
    where:{
        email:user.email,
        status:userStatus.ACTIVE
    }
  })
  const isCorrectPassword:Boolean=await bcrypt.compare(payload.oldPassword,userData.password)

  if(!isCorrectPassword){
      throw new Error("Password is not vaild")
  }
  const hashPassword = bcrypt.hashSync(payload.newPassword, 10);
  await prisma.user.update({
    where:{
        email:userData.email
    },
    data:{
        password:hashPassword,
        needPasswordChange:false
    }
  })
  return {
    message:"Password Change successfull"
  }
}




const forgotPassword=async(payload:{email:string})=>{
    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:userStatus.ACTIVE
        }
    })

    const resetPasswordToken=jwtHelpers.generateToken(
        {
        email:userData.email,
         role:userData.role
        },
        config.jwt.reset_pass_token as string,
        300 as number
    )
    // http://localhost:5555/

    const resetPasswordLink=config.reset_pass_link + `?userId=${userData.id}&token=${resetPasswordToken}`
    console.log(resetPasswordLink)
    await emailSender(userData.email,`
        <div>
           <p>Dear User</p>
           <p>Your Password Reset Link
             <a href=${resetPasswordLink}>
               <button>Reset Password</button>
             </a>
           </p>
        </div>
        `)
}


// reset password
const resetPassword=async(token:any,payload:any)=>{
   
    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            id:payload.id,
            status:userStatus.ACTIVE
        }
    })
    const isVaildToken=jwtHelpers.varifyToken(token,config.jwt.reset_pass_token as string)

    if(!isVaildToken){
        throw new ApiError(httpStatus.FORBIDDEN,"Forbidden")
    }
    // hash password
    const password = await bcrypt.hash(payload.password, 12);

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
}



export const AuthServices={
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}