const { connectDB, Contact } = require('./db');

module.exports = async (req, res) => {
  await connectDB();
  try {
    const count = await Contact.countDocuments();
    res.json({ count, max: 500, isFull: count >= 500 });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
