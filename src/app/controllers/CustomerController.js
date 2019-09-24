const Customer = require('../models/Customer')

class CustomerController {
  async show (req, res) {
    const { server } = req.params;

    const customers = await Customer.findOne({ hostname: server })

    if (customers) {
      return res.json({ message: 'customer exists' });
    }

    return res.status(400).json({
      error: 'customer already exists'
    })
  }
}

module.exports = new CustomerController()
