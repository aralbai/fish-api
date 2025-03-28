import Outcome from "../models/Outcome.js";

// Get single outcome
export const getOutcome = async (req, res) => {
  try {
    const outcome = await Outcome.findOne({ _id: req.params.id });

    res.status(200).json(outcome);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all outcomes
export const getOutcomes = async (req, res) => {
  try {
    const outcomes = await Outcome.find().sort({ addedDate: -1 });

    res.status(200).json(outcomes);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get total outcomes
export const getTotalOutcomes = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (startDate && endDate) {
      const totalOutcomes = await Outcome.aggregate([
        {
          $match: {
            addedDate: {
              $gte: new Date(startDate), // Start date (inclusive)
              $lte: new Date(endDate), // End date (inclusive)
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      return res
        .status(200)
        .json({ totalOutcomes: totalOutcomes[0]?.total || 0 });
    }

    const totalOutcomes = await Outcome.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ totalOutcomes: totalOutcomes[0]?.total || 0 });
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

// Add new outcome
export const addOutcome = async (req, res) => {
  try {
    const data = {
      amount: parseFloat(req.body.amount),
      purpose: req.body.purpose,
      addedDate: new Date(req.body.addedDate),
      addedUserId: req.body.addedUserId,
    };

    const newOutcome = new Outcome(data);

    await newOutcome.save();

    res.status(201).json("Расход добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit outcome
export const editOutcome = async (req, res) => {
  try {
    const data = {
      amount: parseFloat(req.body.amount),
      purpose: req.body.purpose,
      addedDate: new Date(req.body.addedDate),
      changedUserId: req.body.changedUserId,
    };

    const updateOutcome = await Outcome.findByIdAndUpdate(
      req.params.id,
      {
        $set: data,
      },
      { new: true }
    );

    if (!updateOutcome) {
      return res.status(400).json("Outcome not found!");
    }

    res.status(200).json("Расход изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete outcome
export const deleteOutcome = async (req, res) => {
  try {
    await Outcome.findByIdAndDelete(req.params.id);

    res.status(200).json("Расход удалён!");
  } catch (err) {
    res.status(500).json(err);
  }
};
