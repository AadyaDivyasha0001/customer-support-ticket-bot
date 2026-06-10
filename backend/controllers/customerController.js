const Customer =
require("../models/Customer");

exports.getCustomers = async (
  req,
  res
) => {
  try {
    const customers =
      await Customer.find();

    res.json(customers);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createCustomer =
  async (req, res) => {
    try {
      const customer =
        await Customer.create(
          req.body
        );

      res.status(201).json(
        customer
      );
    } catch (err) {
      res.status(500).json(err);
    }
  };