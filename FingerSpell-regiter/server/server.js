const express = require("express");
const routes = require("./routes");

const app = express();
const port = 3000;

app.use(express.json()); // Middleware untuk memparsing JSON

// Use the routes
app.use(routes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
