import { PrismaClient } from "@prisma/client";
import type { ArticleInput } from "../types/article";
import { articleInputSchema } from "../utils/validator";
import { errorHandle } from "../utils";
const prisma = new PrismaClient()
export class ArticleService {
  async get() {
    try{
      const getArticle = await prisma.articles.findMany()
      return getArticle 
    }catch(error){
      throw error
    }
  }

  async getById(id: string) {
    try{
      const getArticle = await prisma.articles.findUnique({
        where: {
          id: id
        }
      })
      return getArticle 
    }catch(error){
      throw error
    }
  }

  async create(payload: ArticleInput) {
    try{
      const validateArgs = articleInputSchema.safeParse(payload)
      if(!validateArgs.success){
        throw errorHandle(validateArgs.error)
      }
      const checkAuthor = await prisma.users.findFirst({
        where: {
          id: payload.authorId,
          role: 'admin'
        }
      })
      if(!checkAuthor){
        throw 'Author Tidak Ditemukan'
      }
      return await prisma.articles.create({
        data: {
          image: payload.image,
          title: payload.title,
          content: payload.content,
          authorId: payload.authorId
        }
      })
    }catch(error){
      throw error
    }
  }

  async update(id: string, payload: ArticleInput) {
    try{
      const validateArgs = articleInputSchema.safeParse(payload)
      if(!validateArgs.success){
        throw errorHandle(validateArgs.error)
      }
      const checkAuthor = await prisma.users.findFirst({
        where: {
          id: payload.authorId,
          role: 'admin'
        }
      })
      if(!checkAuthor){
        throw 'Author Tidak Ditemukan'
      }
      return await prisma.articles.update({
        where: {
          id: id
        },
        data: {
          image: payload.image,
          title: payload.title,
          content: payload.content,
          authorId: payload.authorId
        }
      })
    }catch(error){
      throw error
    }
  }

  async destroy(id: string) {
    try{
      const deleteArticle = await prisma.articles.delete({
        where: {
          id: id
        }
      })
      return deleteArticle
    }catch(error){
      throw error
    }
  }


}