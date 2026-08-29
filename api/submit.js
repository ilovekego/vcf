const { connectDB, Contact } = require('./db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  await connectDB();
  try {
    let { name, countryCode, phone } = req.body;
    if (!name || !countryCode || !phone) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // Clean phone number
    phone = phone.replace(/[\s\-\(\)]/g, '').replace(/^0/, '');
    const fullPhone = `+${countryCode}${phone}`;

    if (fullPhone.length < 10 || fullPhone.length > 15) {
      return res.status(400).json({ success: false, error: "Invalid phone number length." });
    }

    const currentCount = await Contact.countDocuments();
    if (currentCount >= 800) {
      return res.status(400).json({ success: false, error: "Batch is full (800/800)." });
    }

    await Contact.create({ name: name.trim(), phone: fullPhone });
    const newCount = currentCount + 1;
    res.json({ success: true, count: newCount, isFull: newCount >= 800 });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: "This phone number is already registered!" });
    }
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
