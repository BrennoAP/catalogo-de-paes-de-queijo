import app from "./app.js";

const PORT = parseInt(process.env.PORT);
app.listen(PORT, () => console.log("server running"));
