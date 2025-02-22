import Outcome from "../models/Outcome.js";

export const getOutcomes = async (req, res) => {
  try {
    const outcomes = await Outcome.find().sort({ createdAt: -1 });

    res.status(200).json(outcomes);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addOutcome = async (req, res) => {
  try {
    const newOutcome = new Outcome(req.body);

    await newOutcome.save();

    res.status(201).json("Клиент добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editOutcome = async (req, res) => {
  try {
    await Outcome.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json("Клиент изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteOutcome = async (req, res) => {
  try {
    await Outcome.findByIdAndDelete(req.params.id);

    res.status(200).json("Клиент удалён!");
  } catch (err) {
    res.status(500).json(err);
  }
};
