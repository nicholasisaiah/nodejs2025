const mongoose = require('mongoose');
//const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

const dbConnect = async () => {
    try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
        `Database connected : ${connect.connection.host}, ${connect.connection.name}`
    );
} catch (err) {
    console.log(err);
    process.exit(1);
}
};

// Check database connected or not
// connect.then(() => {
//     console.log("Database Connected Successfully");
// })
//     .catch(() => {
//         console.log("Database cannot be Connected");
//     });


module.exports = dbConnect;