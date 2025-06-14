const axios = require('axios');  // Instalar axios con npm install axios

const credentials = Buffer.from('pmle-1118740:B-qa2-0-67e89122-0-302c02143ea7e3b495782d251fcea281888e4ce249a034db02146f77da01fa9a8e6e23283844d4850ccca19f4619').toString('base64');

const data = {
    "merchantRefNum": "123456789",
    "transactionType": "PAYMENT",
    "amount": 1000,
    "currencyCode": "USD",
    "paymentType": "CARD",
    "card": {
        "cardNum": "4111111111111111",
        "cvv": "123",
        "cardExpiry": {
            "month": 12,
            "year": 2030
        }
    }
};

axios.post('https://api.test.paysafe.com/paymenthub/v1/paymenthandles', data, {
    headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
    }
})
    .then(response => {
        console.log('Payment Handle Token:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
