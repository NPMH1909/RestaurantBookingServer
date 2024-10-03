/* eslint-disable camelcase */
import axios from 'axios'
import { NotFoundError } from '../errors/notFound.error.js'
import mongoose, { Types } from 'mongoose'
import { payOS } from '../configs/payos.config.js'
import RestaurantModel from '../models/restaurant.model.js'
import { MailService } from './mail.service.js'
import StaffModel from '../models/staffs.model.js'
import OrderModel from '../models/orders.model.js'

const getAllOrder = async (page = 1, size = 5) => {
    const orders = await OrderModel.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'restaurants',
                localField: 'restaurant_id',
                foreignField: '_id',
                as: 'restaurant'
            }
        },
        {
            $unwind: '$restaurant'
        },
        {
            $skip: (page - 1) * size
        },
        {
            $limit: size
        },
        {
            $project: {
                _id: 1,
                user: '$user',
                restaurant: '$restaurant',
                total_people: 1,
                name: 1,
                phone_number: 1,
                payment: 1,
                menu_list: 1,
                status: 1,
                checkin: 1,
                orderCode: 1,
                total: 1,
                checkout: 1,
                email: 1
            }
        }
    ])
    const list = []
    for (const order of orders) {
        list.push(order)
    }
    return {
        data: list,
        info: {
            total: await OrderModel.countDocuments(),
            page,
            size,
            number_of_pages: Math.ceil((await OrderModel.countDocuments()) / size)
        }
    }
}
const getAllOrderByStaffId = async (id, page = 1, size = 5) => {
    const staff = await StaffModel.findOne({ staff_id: id, deleted_at: null }).orFail(() => {
        throw new NotFoundError('Nhân viên không tồn tại')
    })
    const orders = await OrderModel.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'restaurants',
                localField: 'restaurant_id',
                foreignField: '_id',
                as: 'restaurant'
            }
        },
        {
            $unwind: '$restaurant'
        },
        {
            $match: {
                'restaurant._id': staff.restaurant_id,
                'restaurant.deleted_at': null
            }
        },
        {
            $skip: (page - 1) * size
        },
        {
            $limit: size
        },
        {
            $project: {
                _id: 1,
                user: '$user',
                restaurant: '$restaurant',
                total_people: 1,
                name: 1,
                phone_number: 1,
                payment: 1,
                menu_list: 1,
                status: 1,
                checkin: 1,
                orderCode: 1,
                total: 1,
                checkout: 1,
                email: 1
            }
        }
    ])
    const list = []
    for (const order of orders) {
        list.push(order)
    }
    const total = await OrderModel.countDocuments({
        deleted_at: null,
        restaurant_id: {
            $in: await RestaurantModel.find({ _id: staff.restaurant_id, deleted_at: null }).distinct('_id')
        }
    })
    return {
        data: list,
        info: {
            total,
            page,
            size,
            number_of_pages: Math.ceil(total / size)
        }
    }
}
const getAllOrderByUserId = async (id, page = 1, size = 5) => {
    const orders = await OrderModel.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'restaurants',
                localField: 'restaurant_id',
                foreignField: '_id',
                as: 'restaurant'
            }
        },
        {
            $unwind: '$restaurant'
        },
        {
            $match: {
                'restaurant.user_id': id,
                'restaurant.deleted_at': null
            }
        },
        {
            $skip: (page - 1) * size
        },
        {
            $limit: size
        },
        {
            $project: {
                _id: 1,
                user: '$user',
                restaurant: '$restaurant',
                total_people: 1,
                name: 1,
                phone_number: 1,
                payment: 1,
                menu_list: 1,
                status: 1,
                checkin: 1,
                orderCode: 1,
                total: 1,
                checkout: 1,
                email: 1
            }
        }
    ])
    const list = []
    for (const order of orders) {
        list.push(order)
    }
    const total = await OrderModel.countDocuments({
        deleted_at: null,
        restaurant_id: {
            $in: await RestaurantModel.find({ user_id: id, deleted_at: null }).distinct('_id')
        }
    })
    return {
        data: list,
        info: {
            total,
            page,
            size,
            number_of_pages: Math.ceil(total / size)
        }
    }
}
const getOrderById = async (id) => {
    const orders = await OrderModel.aggregate([
        {
            $match: {
                _id: Types.ObjectId.createFromHexString(id),
                deleted_at: null
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'restaurants',
                localField: 'restaurant_id',
                foreignField: '_id',
                as: 'restaurant'
            }
        },
        {
            $unwind: '$restaurant'
        },
        {
            $project: {
                _id: 1,
                user: '$user',
                restaurant: '$restaurant',
                total_people: 1,
                name: 1,
                phone_number: 1,
                payment: 1,
                menu_list: 1,
                status: 1,
                checkin: 1,
                orderCode: 1,
                total: 1,
                checkout: 1,
                email: 1
            }
        }
    ])
    const list = []
    for (const order of orders) {
        list.push(order)
    }
    return list
}
const createOrder = async (
    id,
    { total_people, email, name, phone_number, payment, menu_list, checkin, restaurant_id, total }
) => {
    const order = await OrderModel.create({
        _id: new mongoose.Types.ObjectId(),
        user_id: id,
        total_people,
        name,
        phone_number,
        payment,
        list_menu: menu_list,
        status: 'PENDING',
        checkin: new Date(checkin),
        orderCode: Number(String(new Date().getTime()).slice(-6)),
        restaurant_id,
        total: Number(total).toFixed(0),
        email
    })
    if (payment === 'CREDIT_CARD') {
        const paymentLinkRes = await payOrder({ orderCode: order.orderCode, total })
        return { order, paymentLinkRes }
    }
    return order
}

const updateOrder = async (id, { menu_list, total }) => {
    await OrderModel.findById(id).orFail(new NotFoundError('Order not found'))
    return await OrderModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
        menu_list,
        total,
        updated_at: Date.now()
    })
}

const confirmOrder = async (id) => {
    const order = await OrderModel.findOne({ orderCode: id })
    if (!order) {
        throw new NotFoundError('Order not found')
    }
    if (order.payment === 'CASH') {
        const result = await OrderModel.aggregate([
            {
                $match: { orderCode: Number(id) }
            },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: 'restaurant_id',
                    foreignField: '_id',
                    as: 'restaurant'
                }
            },
            {
                $unwind: '$restaurant'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    user: '$user',
                    restaurant: '$restaurant',
                    total_people: 1,
                    name: 1,
                    phone_number: 1,
                    payment: 1,
                    status: 1,
                    checkin: 1,
                    orderCode: 1,
                    total: 1,
                    checkout: 1,
                    email: 1,
                    list_menu: 1
                }
            }
        ])

        const subject = 'Xác nhận đơn hàng'
        const html =
            `<p>Đơn hàng của bạn đã được xác nhận</p>
                  <p>Mã đơn hàng: ${result[0].orderCode}</p>
                  <p>Ngày nhận bàn: ${Date(result[0].checkin).slice(0, 11)}</p>
                  <p>Thời gian nhận bàn: ${Date(result[0].checkin).slice(11, 16)}</p>
                  <p>Địa chỉ nhà hàng: ${result[0].restaurant.address}</p>
                  <p>Địa chỉ email: ${result[0].email}</p>
                  <p>Số điện thoại: ${result[0].phone_number}</p>
                  <p>Người nhận bàn: ${result[0].name}</p>
                  <p>Số người: ${result[0].total_people}</p>
                  <p>Phương thức thanh toán: ${result[0].payment}</p>
                  <p>Menu: 
                  ` +
            result[0].list_menu
                .map((item) => `<p>${item.name} - ${Number(item.price).toFixed(0)} đ - ${item.quantity} - ${item.unit} </p>`)
                .join('') +
            `
                  </p>
                  <p>Tổng tiền: ${Number(result[0].total).toFixed(0).toLocaleString('vi-VN')} đ</p>
                  `
        MailService.sendMail({ to: result[0].email, subject, html })
        return order
    }
    const status = await axios.get(`https://api-merchant.payos.vn/v2/payment-requests/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-client-id': process.env.PAYOS_CLIENT_ID,
            'x-api-key': process.env.PAYOS_API_KEY
        }
    })
    if (status.data.data.status === 'CANCELLED') {
        return await OrderModel.findOneAndUpdate({ orderCode: order.orderCode }, { status: 'CANCELLED' })
    }
    if (status.data.data.status === 'PAID') {
        const result = await OrderModel.aggregate([
            {
                $match: { orderCode: Number(id) }
            },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: 'restaurant_id',
                    foreignField: '_id',
                    as: 'restaurant'
                }
            },
            {
                $unwind: '$restaurant'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    user: '$user',
                    restaurant: '$restaurant',
                    total_people: 1,
                    name: 1,
                    phone_number: 1,
                    payment: 1,
                    status: 1,
                    checkin: 1,
                    orderCode: 1,
                    total: 1,
                    checkout: 1,
                    email: 1,
                    list_menu: 1
                }
            }
        ])

        const subject = 'Xác nhận đơn hàng'
        const html =
            `<p>Đơn hàng của bạn đã được xác nhận</p>
                  <p>Mã đơn hàng: ${result[0].orderCode}</p>
                  <p>Ngày nhận bàn: ${Date(result[0].checkin).slice(0, 11)}</p>
                  <p>Thời gian nhận bàn: ${Date(result[0].checkin).slice(11, 16)}</p>
                  <p>Địa chỉ nhà hàng: ${result[0].restaurant.address}</p>
                  <p>Địa chỉ email: ${result[0].email}</p>
                  <p>Số điện thoại: ${result[0].phone_number}</p>
                  <p>Người nhận bàn: ${result[0].name}</p>
                  <p>Số người: ${result[0].total_people}</p>
                  <p>Phương thức thanh toán: ${result[0].payment}</p>
                  <p>Menu: 
                  ` +
            result[0].list_menu
                .map((item) => `<p>${item.name} - ${Number(item.price).toFixed(0)} đ - ${item.quantity} - ${item.unit} </p>`)
                .join('') +
            `
                  </p>
                  <p>Tổng tiền: ${Number(result[0].total).toFixed(0).toLocaleString('vi-VN')} đ</p>
                  `
        MailService.sendMail({ to: result[0].email, subject, html })
        return await OrderModel.findOneAndUpdate({ orderCode: order.orderCode }, { status: 'SUCCESS' })
    }
}


const payOrder = async ({ orderCode, total }) => {
    const YOUR_DOMAIN = 'http://localhost:5173'
    const body = {
        orderCode,
        amount: Math.ceil(Number(total)),
        description: 'Thanh toán đơn hàng',
        returnUrl: `${YOUR_DOMAIN}/checkout?step=1`,
        cancelUrl: `${YOUR_DOMAIN}/checkout?step=1`
    }
    return await payOS.createPaymentLink(body)
}
const deleteOrder = async (id) => {
    const order = await OrderModel.findById(id).orFail(new NotFoundError('Order not found'))
    return await OrderModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { deleted_at: Date.now() })
}

export const OrderService = {
    getAllOrder,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    confirmOrder,
    payOrder,
    getAllOrderByUserId,
    getAllOrderByStaffId
}
