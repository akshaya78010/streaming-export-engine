const express = require("express");
const exportsRouter = require("./routes/exports");

const app = express();
app.use(express.json());

app.use("/exports", exportsRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server running on port", port);
});
// non-functional formatting pass 1

// non-functional formatting pass 2

// non-functional formatting pass 3

// non-functional formatting pass 4

// non-functional formatting pass 5

// non-functional formatting pass 6

// non-functional formatting pass 7

// non-functional formatting pass 8

// non-functional formatting pass 9

// non-functional formatting pass 10

// non-functional formatting pass 11

// non-functional formatting pass 12

// non-functional formatting pass 13

// non-functional formatting pass 14
