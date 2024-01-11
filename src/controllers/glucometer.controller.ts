import { Request, Response } from 'express';
import { getResponse, getHttpCode } from '../utils';
import { GlucometerService } from '../service';
const glucometerService = new GlucometerService()

const create = async (req: Request, res: Response) => {
  try{
    const user = req.user
    if(!user){
      throw 'User Tidak Ditemukan'
    }
    const payload = {
      ...req.body,
      userId: user.id,
      date : new Date(req.body.date)
    }
    const result = await glucometerService.create(payload)
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

const get = async (req: Request, res: Response) => {
  try{
    const user = req.user
    const options = {
      date: req.query.date ? String(req.query.date) : undefined,
    }
    if(!user){
      throw 'User Tidak Ditemukan'
    }
    const result = await glucometerService.get(user.id, options)
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

const destroy = async (req: Request, res: Response) => {
  try{
    const { id } = req.params
    const result = await glucometerService.destroy(id)
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}


export {
  create,
  get,
  destroy
}