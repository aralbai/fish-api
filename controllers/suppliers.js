import Supplier from "../models/Supplier.js";

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();

    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);

    await newSupplier.save();

    res.status(201).json("Поставщик добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json("Поставщик изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);

    res.status(200).json("Поставщик удалён!");
  } catch (err) {
    res.status(500).json(err);
  }
};
