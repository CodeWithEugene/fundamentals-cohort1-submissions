import bcrypt from 'bcryptjs';
import * as db from '../services/db';

export const createInitialAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = db.getUserByEmail('sam@example.com');
    if (existingAdmin) {
      console.log('Initial admin already exists');
      return;
    }

    // Create initial admin account
    const passwordHash = await bcrypt.hash('mayowa123', 10);
    const adminUser = db.createUser({
      id: 'admin_initial',
      email: 'sam@example.com',
      passwordHash,
      name: 'Samuel Admin',
      role: 'admin'
    });

    console.log('Initial admin account created:', adminUser.email);
  } catch (error) {
    console.error('Failed to create initial admin:', error);
  }
};

export default createInitialAdmin;