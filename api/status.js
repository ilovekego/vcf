const { connectDB, Contact } = require('./db');

module.exports = async (req, res) => {
  await connectDB();
  try {
    const count = await Contact.countDocuments();
    res.json({ count, max: 800, isFull: count >= 800 });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
