import { Request, Response } from 'express';
import { getResponse, getHttpCode } from '../utils';
import { AuthService } from '../service';
const authService = new AuthService()

const login = async (req: Request, res: Response) => {
  try{
    const { email, password } = req.body
    const result = await authService.login({ email, password })  
    return getResponse(res, getHttpCode.OK, 'Login Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, 'Kesalahan Server', error)
  }
}

const register = async (req: Request, res: Response) => {
  try{
    const { email, name, password, confirmPassword } = req.body
    const result = await authService.register({ email, name, password, confirmPassword })
    return getResponse(res, getHttpCode.OK, 'Register Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

const me = async (req: Request, res: Response) => {
  try{
    const user = req.user
    if(!user){
      throw 'User Tidak Ditemukan'
    }
    const result = await authService.me(user.id)
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}


const logout = async (req: Request, res: Response) => {
  try{
    const user = req.user
    if(!user){
      throw 'User Tidak Ditemukan'
    }
    const result = await authService.logout(user.id)
    return getResponse(res, getHttpCode.OK, 'Berhasil', result)
  }catch(error){
    return getResponse(res, getHttpCode.FORBIDDEN, error, null)
  }
}

export {
  register,
  login,
  logout,
  me
}