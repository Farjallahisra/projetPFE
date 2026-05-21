const User = require('../models/User');
const bcrypt = require('bcryptjs'); // 1. Ajout de l'import de bcrypt

const createDefaultSuperAdmin = async () => {
    try {
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
        if (!existingSuperAdmin) {
            
            // 2. On crypte le mot de passe avant de l'enregistrer
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                username: 'Super Admin',
                email: 'service.info@emkamed.tn',
                myadmin: 'service.info@emkamed.tn',
                password: hashedPassword, // 3. On utilise le mot de passe crypté ici
                role: 'superadmin',
                agencies: [] 
            });

            console.log('✅ Compte Super Admin créé avec succès.');
        } else {
            console.log('✅ Compte Super Admin existe déjà.');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la création du Super Admin :', error.message);
    }
};

module.exports = createDefaultSuperAdmin;
