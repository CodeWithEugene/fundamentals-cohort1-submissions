const express = require('express');
const app = express();
app.get('/legacy/payments', (req, res) => {
    res.json([
        { pay_id: 'p_123', amt_cents: 12500, cust: { id: 'c_1', fullname: 'Jane Doe' }, timestamp: 1690000000 }
    ]);
});
app.listen(4000, () => console.log('Legacy mock running on 4000'));