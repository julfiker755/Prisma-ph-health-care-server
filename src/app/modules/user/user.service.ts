import { userRole,PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
    const hashPassword = bcrypt.hashSync(data.password, 10);
    
    const userData = {
        email: data.admin.email,
        password:hashPassword,
        role: userRole.ADMIN
    }

    const adminData = {
        name: data.admin.name,
        email: data.admin.email,
        contactNumber: data.admin.contactNumber
    }

const result=await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
        data:userData
    })
    const createAdminData=await transactionClient.admin.create({
        data:adminData
    })
    return createAdminData
})

    return result
}

export const userService = {
    createAdmin
}