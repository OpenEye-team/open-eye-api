import { Request, Response } from 'express';
import { getResponse, getHttpCode } from '../utils';
import { ArticleService } from '../service';
const articleService = new ArticleService()

const create = async (req: Request, res: Response) => {
  try{
    const user = req.user
    if(!user){
      throw 'User Tidak Ditemukan'
    }
    const payload = {
      ...req.body,
      authorId: user.id
    }
    const result = await articleService.create(payload)
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

const update = async (req: Request, res: Response) => {
  try{
    const { id } = req.params
    const payload = req.body
    const result = await articleService.update(id, payload)
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

const get = async (req: Request, res: Response) => {
  try{
    const result = await articleService.get()
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

const getById = async (req: Request, res: Response) => {
  try{
    const { id } = req.params
    const result = await articleService.getById(id)
    if(!result){
      throw 'Artikel Tidak Ditemukan'
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

const destroy = async (req: Request, res: Response) => {
  try{
    const { id } = req.params
    const result = await articleService.destroy(id)
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

const uploadThumbnail = async (req: Request, res: Response) => {
  try{
    const file = req.file
    if(!file){
      throw 'Gambar Harus Diupload'
    }
    const fileName = file?.filename
    return getResponse(res, getHttpCode.OK, 'Berhasil', fileName)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

export {
  create,
  get,
  update,
  destroy,
  uploadThumbnail,
  getById
}