const express = require('express')
const routes = express.Router()

const CustomerController = require('./app/controllers/CustomerController')

routes.get('/customers/:server', CustomerController.show)

module.exports = routes
