import Outcome from "../models/Outcome.js";

export const getOutcomes = async (req, res) => {
  try {
    const outcomes = await Outcome.find().sort({ createdAt: -1 });

    res.status(200).json(outcomes);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get total outcomes
export const getTotalOutcomes = async (req, res) => {
  try {
    const totalOutcomes = await Outcome.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ totalOutcomes: totalOutcomes[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all outcomes with query
export const getOutcomesQuery = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const outcomes = await Outcome.find({
      addedDate: {
        $gte: new Date(startDate), // Greater than or equal to startDate
        $lte: new Date(endDate), // Less than or equal to endDate
      },
    }).sort({ createdAt: -1 });

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
