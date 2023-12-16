const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
const dbConfig = require("./app/config/db.config");

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "api-session",
        keys: ["COOKIE_SECRET"],
        httpOnly: true
    })
);

const db = require("./app/models");

let connectionString = `mongodb+srv://vinodkumawatnotioninfosoft:zR5gjNeu0TCwiyEf@devs-club.3dbws2y.mongodb.net/`;

db.mongoose.set("strictQuery", false);

try {
    db.mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Successfully connected to MongoDB.");
} catch (err) {
    console.log('Error while connecting to database:', err);
    return;
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to backend API." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/item.routes")(app);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}.`);
});
