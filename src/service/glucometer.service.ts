import { PrismaClient } from "@prisma/client";
import type { GlucometerInput } from "../types/glucometer";
import { glucometerInputSchema } from "../utils/validator";
import { errorHandle } from "../utils";
const prisma = new PrismaClient()
interface Options {
  date: string | undefined
}
export class GlucometerService {

  private bloodGlucoseLevel(value: number) { 
    if(value < 80){
      return 'Rendah'
    }else if(value >= 80 && value <= 130){
      return 'Normal'
    }else if(value > 131 && value <= 180){
      return 'Tinggi'
    }else if(value > 180){
      return 'Sangat Tinggi'
    }
  }

  async get(userId: string, options: Options) {
    try{
      const dateNow = new Date()
      const date = options.date === 'Week' ? new Date(dateNow.setDate(dateNow.getDate() - 7)) : options.date === 'Month' ? new Date(dateNow.setMonth(dateNow.getMonth() - 1)) : options.date === 'Year' ? new Date(dateNow.setFullYear(dateNow.getFullYear() - 1)) : undefined
      const getGlucometer = await prisma.report_glucometer.findMany({
        where: {
          userId: userId,
          date: {
            gte: date
          }
        }
      })
      console.log(getGlucometer.length)
      const bloodGlucoseAverage = getGlucometer.reduce((a, b) => a + b.value, 0) / getGlucometer.length
      const bloodGlucoseLevel = this.bloodGlucoseLevel(bloodGlucoseAverage)
      return {
        data: getGlucometer,
        bloodGlucoseAverage,
        bloodGlucoseLevel
      } 
    }catch(error){
      throw error
    }
  }

  async create(payload: GlucometerInput) {
    try{
      const validateArgs = glucometerInputSchema.safeParse(payload)
      if(!validateArgs.success){
        throw errorHandle(validateArgs.error)
      }
      const createGlucometer = await prisma.report_glucometer.create({
        data: {
          date: payload.date,
          time: payload.time,
          value: payload.value,
          meal: payload.meal,
          userId: payload.userId
        }
      })
      return createGlucometer
    }catch(error){
      throw error
    }
  }

  async destroy(id: string) {
    try{
      const deleteGlucometer = await prisma.report_glucometer.delete({
        where: {
          id: id
        }
      })
      return deleteGlucometer
    }catch(error){
      throw error
    }
  }

}