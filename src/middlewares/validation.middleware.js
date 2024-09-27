import { HttpStatusCode } from 'axios'
import { validationResult } from 'express-validator'
import { Response } from '../dtos/response.js'


export const handleValidationErrors = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    next(new Response(HttpStatusCode.BadRequest, 'Validation error', errors.array()).responseHandler(res))
  }
  next()
}
