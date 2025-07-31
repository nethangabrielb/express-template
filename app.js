const express = require("express");
const cors = require("cors");
const app = express();
const guestRouter = require("./routes/guestRouter");

app.use(cors());
app.use(express.json());

app.use("/api", guestRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
