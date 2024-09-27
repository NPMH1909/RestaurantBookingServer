import { RestaurantService } from "../services/restaurant.service"

const getAllRestaurant = async (req, res, next) => {
    // #swagger.tags=['Restaurant']
    try {
      let data
      const { upper, lower, sort, page, size, field } = req.query
      if (size) {
        const { upper, lower, sort, page } = req.query
        data = await RestaurantService.getAllRestaurant(
          Number(page) || 1,
          Number(size) || 5,
          Number(field),
          Number(sort) || -1
        )
      } else {
        data = await RestaurantService.getAllRestaurantByFilterAndSort(upper, lower, sort, Number(page) || 1)
      }
      next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).resposeHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
    }
  }

const getAllRestaurantByUserId = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const { page, size } = req.query
    const data = await RestaurantService.getAllRestaurantByUserId(req.user.id, Number(page) || 1, Number(size) || 5)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data.data, data.info).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}

const getRestaurantById = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const data = await RestaurantService.getRestaurantById(req.params.id)
    if (data === null) {
      next(new Response(HttpStatusCode.NotFound, 'Không tìm thấy nhà hàng', data).resposeHandler(res))
    }
    next(new Response(HttpStatusCode.Ok, 'Thành Công', data).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}

const createRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await RestaurantService.createRestaurant(req.user.id, req.body)
    await LogService.createLog(req.user.id, 'Thêm nhà hàng')
    next(new Response(HttpStatusCode.Created, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}

const updateRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    if (CommonUtils.checkNullOrUndefined(req.body)) {
      throw new BadRequestError('Dữ liệu là bắt buộc')
    }
    const result = await RestaurantService.updateRestaurant(req.params.id, req.body)
    next(new Response(HttpStatusCode.Ok, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}

const deleteRestaurant = async (req, res, next) => {
  // #swagger.tags=['Restaurant']
  try {
    const result = await RestaurantService.deleteRestaurant(req.params.id)
    next(new Response(HttpStatusCode.Accepted, 'Thành Công', result).resposeHandler(res))
  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
}

const getRestaurantIdAndNameByUserId = async (req, res, next) => {
    try {
      const result = await RestaurantService.getRestaurantIdAndNameByUserId(req.user.id)
      next(new Response(HttpStatusCode.Ok, 'Thành Công', result).resposeHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
    }
  }
  const findRestaurantByAnyField = async (req, res, next) => {
    // #swagger.tags=['Restaurant']
    try {
      const { page, size } = req.query
      const { searchTerm } = req.body
      if (!searchTerm) {
        throw new BadRequestError('Giá trị tìm kiếm là bắt buộc')
      }
      const result = await RestaurantService.findRestaurantsByAnyField(searchTerm, Number(page) || 1, Number(size) || 5)
      next(new Response(HttpStatusCode.Ok, 'Đã tìm thấy nhà hàng', result.data, result.info).resposeHandler(res))
    } catch (error) {
      next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
    }
  }
  
  export const RestaurantController = {
    getAllRestaurant,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    findRestaurantByAnyField,
    getRestaurantIdAndNameByUserId,
    getAllRestaurantByUserId,
  }