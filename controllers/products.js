import Product from "../models/Product.js";

export const getProduct = async (req, res) => {
  try {
    const products = await Product.findOne({ _id: req.params.id });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add new product
export const addProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findOne({ title: req.body.title });

    if (existingProduct) {
      return res.status(400).json({ message: "Есть товар с таким названием!" });
    }

    const newProduct = new Product(req.body);

    await newProduct.save();

    res.status(201).json("Продукт создан!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit product
export const editProduct = async (req, res) => {
  try {
    const { changedUserId, title } = req.body;

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(400).json({ message: "Есть товар с таким названием!" });
    }

    await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          changedUserId,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json("Товар был изменен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json("Товар удален!");
  } catch (err) {
    res.status(500).json(err);
  }
};
