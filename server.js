const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const cors = require("cors")

dotenv.config()
connectDB()

const app = express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/wallet", require("./routes/walletRoutes"))
app.use("/api/transactions", require("./routes/transactionRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port " + PORT))