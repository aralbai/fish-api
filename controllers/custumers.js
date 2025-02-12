import Custumer from "../models/Custumer.js";

export const getCustumers = async (req, res) => {
  try {
    const custumers = await Custumer.find();

    res.status(200).json(custumers);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addCustumer = async (req, res) => {
  try {
    const newCustumer = new Custumer(req.body);

    await newCustumer.save();

    res.status(201).json("Клиент добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editCustumer = async (req, res) => {
  try {
    await Custumer.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json("Клиент изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteCustumer = async (req, res) => {
  try {
    await Custumer.findByIdAndDelete(req.params.id);

    res.status(200).json("Клиент удалён!");
  } catch (err) {
    res.status(500).json(err);
  }
};
