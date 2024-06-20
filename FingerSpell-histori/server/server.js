const express = require("express");
const uploadRoute = require("./handler");
const app = express();
const port = process.env.PORT || 3000;

app.use("/upload", uploadRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
