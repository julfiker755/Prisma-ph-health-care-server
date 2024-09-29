import {z} from 'zod'

const specialtiesShema=z.object({
    title:z.string({
        required_error:"Title is required"
    })
})

export const specialtiesValidation={
   specialtiesShema
}