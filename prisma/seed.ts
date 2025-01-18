import {PrismaClient, userRole } from "@prisma/client"
import bcrypt from "bcrypt";

const prisma=new PrismaClient()

const seedSuperAdmin=async()=>{
 try{
    const isExsisSuperAdmin=await prisma.user.findFirst({
        where:{
            role:userRole.SUPER_ADMIN
        }
    })
  if(isExsisSuperAdmin){
    console.log("super Admin Already exsis")
    return;
  }

  const hashPassword = bcrypt.hashSync("12345678", 10);
  const superAdminData=await prisma.user.create({
    data:{
        email:"super@admin.com",
        password:hashPassword,
        role:userRole.SUPER_ADMIN,
        admin:{
            create:{
                name:"SuperAdmin",
                contactNumber:"01741703755"
            }
        }
    }
  })
  console.log("Super admin create successfull",superAdminData)
 }catch(err){
    console.error(err)
 }finally{
    await prisma.$disconnect()
 }
}

seedSuperAdmin()