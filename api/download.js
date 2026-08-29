const { connectDB, Contact } = require('./db');

module.exports = async (req, res) => {
  await connectDB();
  try {
    const contacts = await Contact.find();
    let vcfData = "";
    contacts.forEach(c => {
      vcfData += `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL;TYPE=CELL:${c.phone}\nEND:VCARD\n`;
    });

    res.setHeader('Content-Type', 'text/vcard');
    res.setHeader('Content-Disposition', 'attachment; filename="Batch_Contacts_800.vcf"');
    res.send(vcfData);
  } catch (err) {
    res.status(500).send("Error generating VCF file.");
  }
};
