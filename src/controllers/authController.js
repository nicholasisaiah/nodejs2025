const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;

/**
 * Register a new user
 */
const register = async (req, res) => {
    try {
        const { username, password, role = "user" } = req.body;

        // Cek format password
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password harus minimal 8 karakter, mengandung huruf besar dan karakter spesial."
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        return res.status(201).json({ 
            success: true,
            message: "Registration successful. Please login.",
            redirectTo: "/login"
        });
    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({ message: "Registration failed" });
    }
};

/**
 * User login
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Send token via HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        // Return user info
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            },
            redirectTo: user.role === "admin" ? "/admin-page" : "/home-page"
        });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Login failed" });
    }
};

/**
 * User logout
 */
const logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
};

/**
 * Get current user information
 */
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({
            id: user._id,
            username: user.username,
            role: user.role
        });
    } catch (err) {
        console.error("Get user error:", err);
        return res.status(500).json({ message: "Failed to get user information" });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};