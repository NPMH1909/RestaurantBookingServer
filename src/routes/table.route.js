import { authenticationAdmin, requireApiKey } from '../middlewares/useApiKey.middleware.js'
import { TableController } from '../controllers/table.controller.js'
import express from "express"
const TableRouter = express.Router()
TableRouter.get('/', TableController.getAllTable)
TableRouter.get('/owner', requireApiKey, authenticationAdmin, TableController.getAllTableByUserId)
TableRouter.get('/table/:id', TableController.getTableById)
TableRouter.post('/', requireApiKey, authenticationAdmin, TableController.createTable)
TableRouter.put('/:id', requireApiKey, authenticationAdmin, TableController.updateTable)
TableRouter.delete('/:id', requireApiKey, authenticationAdmin, TableController.deleteTable)
TableRouter.post('/find-table', TableController.findTableByAnyField)

export default TableRouter 