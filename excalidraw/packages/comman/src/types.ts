import {z} from "zod"

export const CreateUSerSchema = z.object({
    email:z.string().min(3).max(20),
    password:z.string(),
    name:z.string()
})

export const SignInSchema =  z.object({
    name:z.string().min(3).max(20),
    password:z.string(),
})

export const CreateRoomSchema = z.object({
    name:z.string().min(3).max(20)
})