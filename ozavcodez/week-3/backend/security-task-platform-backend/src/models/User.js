const bcrypt = require('bcrypt');

class User {
  constructor(db) {
    this.db = db;
  }

  async create(username, email, password, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await this.db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );
    return result.id;
  }

  async findByEmail(email) {
    return await this.db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  async findById(id) {
    return await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateLastLogin(userId) {
    await this.db.run(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }
}

module.exports = User;
