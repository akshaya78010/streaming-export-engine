const express = require("express");
const exportsRouter = require("./routes/exports");

const app = express();
app.use(express.json());

app.use("/exports", exportsRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server running on port", port);
});