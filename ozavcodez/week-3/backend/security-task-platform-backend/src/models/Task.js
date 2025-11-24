class Task {
  constructor(db) {
    this.db = db;
  }

  async create(userId, title, description, status = 'pending') {
    const result = await this.db.run(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, description, status]
    );
    return result.id;
  }

  async findById(id) {
    return await this.db.get('SELECT * FROM tasks WHERE id = ?', [id]);
  }

  async findByUserId(userId) {
    return await this.db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  }

  async findAll() {
    return await this.db.query('SELECT * FROM tasks ORDER BY created_at DESC');
  }

  async update(id, title, description, status) {
    await this.db.run(
      'UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, status, id]
    );
  }

  async delete(id) {
    const result = await this.db.run('DELETE FROM tasks WHERE id = ?', [id]);
    return result.changes > 0;
  }

  async search(userId, query, isAdmin, page, limit) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;
    
    let sql, params;
    if (isAdmin) {
      sql = `SELECT * FROM tasks 
             WHERE title LIKE ? OR description LIKE ? 
             ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [searchPattern, searchPattern, limit, offset];
    } else {
      sql = `SELECT * FROM tasks 
             WHERE user_id = ? AND (title LIKE ? OR description LIKE ?)
             ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [userId, searchPattern, searchPattern, limit, offset];
    }
    
    const tasks = await this.db.query(sql, params);
    
    // Get total count
    let countSql, countParams;
    if (isAdmin) {
      countSql = 'SELECT COUNT(*) as count FROM tasks WHERE title LIKE ? OR description LIKE ?';
      countParams = [searchPattern, searchPattern];
    } else {
      countSql = 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND (title LIKE ? OR description LIKE ?)';
      countParams = [userId, searchPattern, searchPattern];
    }
    
    const countResult = await this.db.get(countSql, countParams);
    
    return {
      tasks,
      total: countResult.count
    };
  }

  async filter(userId, status, dateFrom, dateTo, isAdmin, page, limit) {
    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as count FROM tasks WHERE 1=1';
    const params = [];
    
    if (!isAdmin) {
      sql += ' AND user_id = ?';
      countSql += ' AND user_id = ?';
      params.push(userId);
    }
    
    if (status) {
      sql += ' AND status = ?';
      countSql += ' AND status = ?';
      params.push(status);
    }
    
    if (dateFrom) {
      sql += ' AND created_at >= ?';
      countSql += ' AND created_at >= ?';
      params.push(dateFrom);
    }
    
    if (dateTo) {
      sql += ' AND created_at <= ?';
      countSql += ' AND created_at <= ?';
      params.push(dateTo);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const queryParams = [...params, limit, offset];
    
    const tasks = await this.db.query(sql, queryParams);
    const countResult = await this.db.get(countSql, params);
    
    return {
      tasks,
      total: countResult.count
    };
  }
}

module.exports = Task;
