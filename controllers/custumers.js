import Custumer from "../models/Custumer.js";

export const getCustumer = async (req, res) => {
  try {
    const custumer = await Custumer.findOne({ _id: req.params.id });

    res.status(200).json(custumer);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getCustumers = async (req, res) => {
  try {
    const custumers = await Custumer.find().sort({ createdAt: -1 });

    res.status(200).json(custumers);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add new custumer
export const addCustumer = async (req, res) => {
  try {
    const newCustumer = new Custumer({
      ...req.body,
      changedUserId: req.body.addedUserId,
    });

    await newCustumer.save();

    res.status(201).json("Клиент добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit custumer
export const editCustumer = async (req, res) => {
  try {
    await Custumer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json("Клиент изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit custumer limit
export const editCustumerLimit = async (req, res) => {
  try {
    await Custumer.findByIdAndUpdate(
      req.params.id,
      {
        $set: { limit: req.body.limit },
      },
      { new: true, runValidators: true }
    );

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
