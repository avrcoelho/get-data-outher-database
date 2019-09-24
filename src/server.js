// variaveis de ambiente
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const validate = require('express-validation')
// formatador de erros. Deica os erros mais legigeis
const Youch = require('youch')

const databaseConfig = require('./config/database')

class App {
  constructor () {
    this.express = express()
    // verifica se é dev ou prod
    this.isDev = process.env.NODE_ENV !== 'production'

    this.database()
    this.middlewares()
    this.routes()
    // tem que vir depois das configurações das rotas
    this.exception()
  }

  database () {
    mongoose.connect(databaseConfig.uri, {
      // somenet para o mongoose saber que esta sendo usado uma nova versçao do node
      // e fazer adaptações
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares () {
    this.express.use(cors())
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    this.express.use(async (err, req, res, next) => {
      // verifica se o erro é de uma instacia de validate.ValidationError
      // se é error dos validates
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)

        return res.json(await youch.toJSON())
      }

      // se existir um status no erro, ele vai ser retornado, senão, envia status 500
      return res
        .status(err.status || 500)
        .json({
          error: 'Internal server error'
        })
    })
  }
}

// só vai precisar passar o express para ser usado em outros arquivos
module.exports = new App().express
