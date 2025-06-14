document.getElementById('realizar-pago').addEventListener('click', () => {
    fetch('http://localhost:3000/paysafe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // Los datos que envíes según el backend
            merchantRefNum: "123456789",
            amount: 1000,
            currencyCode: "USD",
            paymentHandleToken: "tu_token_aquí"
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta de Paysafe:', data);
        alert('Pago realizado con éxito');
    })
    .catch(error => {
        console.error('Error al realizar el pago:', error);
        alert('Hubo un error al realizar el pago');
    });
});