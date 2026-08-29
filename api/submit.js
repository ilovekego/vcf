const { connectDB, Contact } = require('./db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  await connectDB();
  try {
    let { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // Clean phone number: keep the plus, remove spaces/dashes
    phone = phone.trim().replace(/[\s\-\(\)]/g, '');

    // Ensure it starts with a plus
    if (!phone.startsWith('+')) {
      return res.status(400).json({ success: false, error: "Please include the '+' sign and country code (e.g., +254...)." });
    }

    if (phone.length < 10 || phone.length > 16) {
      return res.status(400).json({ success: false, error: "Invalid phone number length." });
    }

    const currentCount = await Contact.countDocuments();
    if (currentCount >= 500) {
      return res.status(400).json({ success: false, error: "Batch is full (500/500)." });
    }

    await Contact.create({ name: name.trim(), phone });
    const newCount = currentCount + 1;
    res.json({ success: true, count: newCount, isFull: newCount >= 500 });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: "This phone number is already registered!" });
    }
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
