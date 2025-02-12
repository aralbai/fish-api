import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);

    await newProduct.save();

    res.status(201).json("Продукт создан!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json("Товар был изменен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json("Товар удален!");
  } catch (err) {
    res.status(500).json(err);
  }
};
