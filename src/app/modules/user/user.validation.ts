import {z} from 'zod'
const creatAdmin=z.object({
    password:z.string({
        required_error:"Password is required"
    }),
    admin:z.object({
        name:z.string({
            required_error:"name is required"
        }),
        email:z.string({
            required_error:"email is required"
        }),
        contactNumber:z.string({
            required_error:"contactNumber is required"
        }),
    })
})

export const userValidation={
    creatAdmin
}