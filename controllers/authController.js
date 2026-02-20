const User = require("../models/User")
const Wallet = require("../models/Wallet")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ msg: "User exists" })

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, password: hash })
    await Wallet.create({ user: user._id })

    res.json({ msg: "User registered" })
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: "Invalid credentials" })
        
    if (user.isBlocked)
    return res.status(403).json({ msg: "Account is frozen" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ msg: "Invalid credentials" })

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.json({ token })
}