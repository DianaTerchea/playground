import {verify} from "jsonwebtoken";
export const APP_SECRET = "hello-world-app-secret"
import { Context } from './context'

interface Token {
   adminId: string
}

export function decodeToken(context: Context){
    const authHeader = context.req.get('Authorization')
    if(authHeader){
        const token= authHeader.replace('Bearer ', '')
        const isTokenValid = verify(token, APP_SECRET) as Token
        return isTokenValid && Number(isTokenValid.adminId)
    }
}