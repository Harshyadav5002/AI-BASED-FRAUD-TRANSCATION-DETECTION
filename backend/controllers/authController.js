const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Check existing
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'User'
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        // Create JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'super_secret_jwt_key_fallback',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
