const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token
            token = req.headers.authorization.split(' ')[1];
            
            // Verify the token
            const decoded = jwt.verify(token, 'secretkey'); // Use your secret key
            
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'non autorisé' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    } else {
        return res.status(401).json({ message: 'Non autorisé, pas de token' });
    }
};

const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        return res.status(403).json({ message: 'Accès interdit, rôle superadmin requis' });
    }
};
const isSuperOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'superadmin' || req.user.role === 'admin')) {
        next();
    } else {
        return res.status(403).json({ message: 'Accès interdit, rôle superadmin or admin requis' });
    }
};
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Accès interdit, rôle admin requis' });
    }
};

module.exports = {  protect, isSuperAdmin ,isAdmin,isSuperOrAdmin};
