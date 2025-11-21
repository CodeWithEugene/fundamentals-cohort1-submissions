

# FRONTEND

**Repository:** `legacybridge-frontend`
**Stack:** React, Vite, TypeScript

---

# 1. Overview

This frontend consumes the modernized endpoints provided by the LegacyBridge backend. It displays transformed legacy data and handles loading, error, and success states clearly.

---

# 2. Features

* React-Vite application
* Displays transformed `/v2/payments` data
* Loading states
* Error states
* API environment variable support
* Clean component structure

---

# 3. Running Locally

### **1. Clone**

```bash
git clone https://github.com/olamarvel/legacybridge-frontend.git
cd legacybridge-frontend
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Run dev server**

```bash
npm run dev
```

### **4. Build**

```bash
npm run build
```

---

# 4. Environment Variables

Create `.env`:

```
VITE_API_URL=http://localhost:3000
```

---

# 5. Pages

| Page     | Description                    |
| -------- | ------------------------------ |
| Payments | Shows transformed payment data |

---

# 6. Deployment

**Frontend URL:** *your deployed URL here*

Deploy to Vercel, Netlify, or GitHub Pages.
