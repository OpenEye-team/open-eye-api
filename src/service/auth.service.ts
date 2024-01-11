import { PrismaClient } from "@prisma/client";
import type { RegisterInput, LoginInput } from "../types/auth";
import { registerSchema, loginSchema } from '../utils/validator'
import { errorHandle } from "../utils";
import argon2 from 'argon2';
import { signJWT } from "../config";
const prisma = new PrismaClient()
export class AuthService {

  // private failedOrSuccessRequest(status: string, data: any) {
  //   return {
  //     status,
  //     data
  //   }
  // }

  private hashData(data: string) {
    return argon2.hash(data)
  }

  async register(payload: RegisterInput) {
    try{
      const validateArgs = registerSchema.safeParse(payload)
      if(!validateArgs.success){
        throw errorHandle(validateArgs.error)
      }
      const checkUser = await prisma.users.findUnique({
        where: { 
          email: payload.email
        }
      })
      if(checkUser){
        throw ('Email Sudah Terdaftar')
      }
      const hashPassword = await this.hashData(payload.password)
      const createUser = await prisma.users.create({
        data: {
          email: payload.email,
          name: payload.name,
          password: hashPassword,
          role: 'user'
        }
      })
      return createUser
    }catch(error){
      throw error
    }
  }

  async login(payload: LoginInput) {
    try{
      const validateArgs = loginSchema.safeParse(payload)
      if(!validateArgs.success){
        throw errorHandle(validateArgs.error)
      }
      const checkUser = await prisma.users.findUnique({
        where: { 
          email: payload.email
        }
      })

      const checkPassword = await argon2.verify(checkUser?.password || '', payload.password)
      if(!checkPassword || !checkUser){
        throw errorHandle('Password Salah')
      }

      const token = signJWT({
        id: checkUser.id,
        email: checkUser.email,
        name: checkUser.name
      }, '7d')

      return {
        token
      }

    }catch(error){
      throw error
    }
  }

  async logout(id: string) {
    try{
      const user = await prisma.users.findUnique({
        where: { id }
      })
      if(!user){
        throw 'User Tidak Ditemukan'
      }
      return user
    }catch(error){
      throw error
    }
  }

  async me(id: string) {
    try{
      const user = await prisma.users.findUnique({
        where: { id }
      })
      return user
    }catch(error){
      throw error
    }
  }

}