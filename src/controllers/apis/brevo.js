const axios = require('axios');

const API_KEY = '#';

function sendEmail(message) {
    const emailData = {
        Recipients: {
            To: ["justintaveras566@gmail.com"]
        },
        Content: {
            From: "##",  // Must be verifie
            ReplyTo: "#",
            Subject: "Tu Factura Electrónica",
            Body: [{
                ContentType: "PlainText",
                Charset: "utf-8",
                Content: message
            }]
        }
    };

    axios.post('https://api.elasticemail.com/v4/emails/transactional', emailData, {
        headers: {
            'Content-Type': 'application/json',
            'X-ElasticEmail-ApiKey': API_KEY
        }
    })
    .then(response => {
        console.log("✅ Correo enviado:", response.data);
    })
    .catch(error => {
        console.error("❌ Error al enviar:", error.response?.data || error.message);
    });
}

module.exports = {sendEmail};