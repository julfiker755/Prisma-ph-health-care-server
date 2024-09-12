import { Gender } from '@prisma/client'
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


const createDoctor=z.object({
    password:z.string({
        required_error:"Password is required"
    }),
    doctor:z.object({
        name:z.string({
            required_error:"name is required"
        }),
        email:z.string({
            required_error:"email is required"
        }),
        contactNumber:z.string({
            required_error:"contactNumber is required"
        }),
        address:z.string().optional(),
        registrationNumber :z.string({
            required_error:"registrationNumber  is required"
        }),
        experience:z.number().optional(),
        gender:z.enum([Gender.MALE,Gender.FEMALE]),
        appointmentFee:z.number({
            required_error:"appointmentFee is required"
        }),
        qualification :z.string({
            required_error:"qualification  is required"
        }),
        currentWorkingPlace:z.string({
            required_error:"CurrentWorkingPlace is required"
        }),
        designaton :z.string({
            required_error:"designaton is required"
        }),

    })
})

const createPatient = z.object({
    password: z.string(),
    patient: z.object({
        email: z.string({
            required_error: "Email is required!"
        }).email(),
        name: z.string({
            required_error: "Name is required!"
        }),
        contactNumber: z.string({
            required_error: "Contact number is required!"
        }),
        address: z.string({
            required_error: "Address is required"
        })
    })
});


export const userValidation={
    creatAdmin,
    createDoctor,
    createPatient
}