const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.json()); // Para poder recibir y parsear cuerpos JSON
app.set("view engine", "ejs");
app.use(express.static(__dirname));

app.get('/paysafe', async (req, res) => {
    res.render('index')
})
const API_USERNAME = 'pmle-1118740';
const API_PASSWORD = 'B-qa2-0-67e89122-0-302c02143ea7e3b495782d251fcea281888e4ce249a034db02146f77da01fa9a8e6e23283844d4850ccca19f4619';

const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64');

// Ruta para hacer la solicitud a Paysafe
app.post('/paysafe', async (req, res) => {
    try {
        const response = await fetch('https://api.test.paysafe.com/paymenthub/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`, // Encabezado de autenticación
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "paymentHandleToken": "SCAS9p8LU6yKgMvc",
                "merchantRefNum": "312730qjqeqw",
                "amount": 500,  // Asegúrate de que este monto coincida con el original
                "currencyCode": "USD"
            })
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/request', async (req, res) => {

    const idnum = () => Date.now().toString() + Math.floor(Math.random() * 1000).toString();
 
    const url = 'https://api.test.paysafe.com/paymenthub/v1/paymenthandles';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Basic cG1sZS0xMTE4NzQwOkItcWEyLTAtNjdlODkxMjItMC0zMDJjMDIxNDNlYTdlM2I0OTU3ODJkMjUxZmNlYTI4MTg4OGU0Y2UyNDlhMDM0ZGIwMjE0NmY3N2RhMDFmYTlhOGU2ZTIzMjgzODQ0ZDQ4NTBjY2NhMTlmNDYxOQ=='
        },
        body: JSON.stringify({
            merchantRefNum: `${idnum()}`,
            transactionType: "PAYMENT",
            accountId: "1002909200",
            paymentType: "CARD",
            amount: 50000,  // Ahora está en centavos
            currencyCode: "USD",
            threeDs: {
                merchantUrl: "http://localhost:3000/request",
                deviceChannel: "BROWSER",
                messageCategory: "PAYMENT",
                transactionIntent: "CHECK_ACCEPTANCE",
                authenticationPurpose: "PAYMENT_TRANSACTION",
                requestorChallengePreference: "NO_PREFERENCE"
            },
            card: {
                cardNum: "4000000000001026",
                cardExpiry: { month: 10, year: 2025 },
                cvv: "111",
                holderName: "Dilip",
                issuingCountry: "US"
            },
            billingDetails: {
                nickName: "Home",
                street: "123 Main St",  // Valor válido
                city: "New York",
                state: "NY",  // Código de estado en 2 letras
                country: "US",  // Código de país en 2 letras
                zip: "10001"
            },
            returnLinks: [
                {
                    rel: "default",
                    href: "https://yourwebsite.com/payment/return/",
                    method: "GET"
                },
                {
                    rel: "on_completed",
                    href: "https://yourwebsite.com/payment/return/success",
                    method: "GET"
                },
                {
                    rel: "on_failed",
                    href: "https://yourwebsite.com/payment/return/failed",
                    method: "GET"
                }
            ]
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        res.json(data);  // Responde con los datos obtenidos
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});