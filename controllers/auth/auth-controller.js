import bcrypt from "bcrypt";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

// REGISTER
const registerUser = async (req, res) => {
    const { userName, email, password, role } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.json({
                success: false,
                message: "User already exists with the same email!",
            });

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
            role,
        });

        await newUser.save();

        res.status(200).json({
            success: true,
            message: "Registration successful",
            newUser,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({
                success: false,
                message: "User doesn't exist! Please register first.",
            });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({
                success: false,
                message: "Incorrect password! Please try again.",
            });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred",
        });
    }
};

// Server-side logout controller
const logoutController = (req, res) => {
    res
        .clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",

        })
        .status(200)
        .json({
            success: true,
            message: "Logged out successfully",
        });
};

// AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user! No token provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized user! Invalid or expired token.",
        });
    }
};

export { registerUser, loginUser, logoutController, authMiddleware };
