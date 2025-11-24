class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class Validators {
  static sanitizeString(input, maxLength = 255) {
    if (typeof input !== 'string') {
      throw new ValidationError('Input must be a string');
    }
    
    let sanitized = input.replace(/\0/g, '');
    sanitized = sanitized.trim();
    
    if (sanitized.length > maxLength) {
      throw new ValidationError(`Input exceeds maximum length of ${maxLength}`);
    }
    
    return sanitized;
  }

  static validateEmail(email) {
    const sanitized = this.sanitizeString(email, 255);
    const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(sanitized)) {
      throw new ValidationError('Invalid email format');
    }
    
    const sqlPatterns = [
      /(\bOR\b|\bAND\b).*=.*/i,
      /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b)/i,
      /(--|;|\/\*|\*\/|xp_|sp_)/i,
      /'.*OR.*'/i
    ];
    
    for (const pattern of sqlPatterns) {
      if (pattern.test(sanitized)) {
        throw new ValidationError('Invalid email format');
      }
    }
    
    return sanitized;
  }

  static validatePassword(password) {
    if (typeof password !== 'string') {
      throw new ValidationError('Password must be a string');
    }
    
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      throw new ValidationError('Password is too long');
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      throw new ValidationError('Password must contain uppercase, lowercase, number, and special character');
    }
    
    return password;
  }

  static validateUsername(username) {
    const sanitized = this.sanitizeString(username, 50);
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    
    if (!usernamePattern.test(sanitized)) {
      throw new ValidationError('Username can only contain letters, numbers, and underscores');
    }
    
    if (sanitized.length < 3) {
      throw new ValidationError('Username must be at least 3 characters long');
    }
    
    return sanitized;
  }

  static validateTaskInput(title, description) {
    const sanitizedTitle = this.sanitizeString(title, 200);
    
    if (sanitizedTitle.length === 0) {
      throw new ValidationError('Task title cannot be empty');
    }
    
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<embed/gi,
      /<object/gi
    ];
    
    for (const pattern of xssPatterns) {
      if (pattern.test(sanitizedTitle)) {
        throw new ValidationError('Invalid characters in title');
      }
    }
    
    let sanitizedDescription = '';
    if (description) {
      sanitizedDescription = this.sanitizeString(description, 1000);
      
      for (const pattern of xssPatterns) {
        if (pattern.test(sanitizedDescription)) {
          throw new ValidationError('Invalid characters in description');
        }
      }
    }
    
    return { title: sanitizedTitle, description: sanitizedDescription };
  }

  static validateSearchQuery(query) {
    if (!query || typeof query !== 'string') {
      return '';
    }
    
    const sanitized = this.sanitizeString(query, 200);
    const specialCharCount = (sanitized.match(/[.*+?^${}()|[\]\\]/g) || []).length;
    
    if (specialCharCount > 5) {
      throw new ValidationError('Too many special characters in search query');
    }
    
    return sanitized;
  }

  static validatePagination(page, limit) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    if (isNaN(pageNum) || pageNum < 1) {
      throw new ValidationError('Invalid page number');
    }
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new ValidationError('Invalid limit (must be between 1 and 100)');
    }
    
    return { page: pageNum, limit: limitNum };
  }
}

module.exports = { Validators, ValidationError };
