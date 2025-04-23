const User = require('../models/userModel');
const Record = require('../models/recordModel');

exports.adminPage = async (req, res) => {
  try {
    const users = await User.find();
    const records = await Record.find().populate('user'); // pastikan `user` di-record adalah ObjectId refer ke User

    const recordsWithUsername = records.map(r => ({
      ...r._doc,
      username: r.user?.username || 'Unknown'
    }));

    res.render('admin', { users, records: recordsWithUsername });
    console.log(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};
