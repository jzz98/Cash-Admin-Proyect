const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment/locale/es'); // Para fechas en español

function buildPDF(data, outputPath, callback) {
    const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        bufferPages: true
    });

    // Configuración de estilos
    const primaryColor = '#2c3e50';
    const secondaryColor = '#7f8c8d';
    const accentColor = '#3498db';
    const lightGray = '#f5f5f5';

    // Crear el stream de escritura
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Logo de la empresa
    const imagePath = path.join(__dirname, '..', 'uploads', path.basename(data.Logo || ''));
    if (fs.existsSync(imagePath)) {
        doc.image(imagePath, 50, 50, { width: 120, align: 'left' });
    }

    // Encabezado
    doc.fillColor(primaryColor)
       .fontSize(20)
       .font('Helvetica-Bold')
       .text(`FACTURA #${data.ID_factura}`, { align: 'right' });
    
    doc.fillColor(secondaryColor)
       .fontSize(12)
       .font('Helvetica')
       .text(`Fecha de emisión: ${moment(data.Fecha_emision).format('DD [de] MMMM [de] YYYY')}`, { align: 'right' });
    
    doc.text(`Vencimiento: ${moment(data.Fecha_Vencimiento).format('DD/MM/YYYY')}`, { align: 'right' });
    
    doc.moveDown(2);

    // Información de la empresa
    doc.fillColor(primaryColor)
       .fontSize(12)
       .text(data.Almacen, { align: 'center' });
    
    doc.fillColor(secondaryColor)
       .fontSize(10)
       .text('RNC: 1-01-12345-6', { align: 'center' }); // Deberías agregar este campo a tu DB
    
    doc.moveDown();

    // Datos del cliente y vendedor
    const clientInfoTop = doc.y;
    
    doc.fillColor(primaryColor)
       .fontSize(12)
       .text('DATOS DEL CLIENTE', 50, clientInfoTop);
    
    doc.fillColor(secondaryColor)
       .fontSize(10)
       .text('Nombre: Cliente General', 50, clientInfoTop + 20) // Deberías agregar campo cliente
       .text('RNC/Cédula: 0-00-00000-0', 50, clientInfoTop + 35) // Deberías agregar este campo
       .text('Teléfono: (809) 555-5555', 50, clientInfoTop + 50) // Deberías agregar este campo
       .text('Dirección: Av. Principal #123', 50, clientInfoTop + 65); // Deberías agregar este campo
    
    doc.fillColor(primaryColor)
       .fontSize(12)
       .text('DATOS DEL VENDEDOR', 300, clientInfoTop);
    
    doc.fillColor(secondaryColor)
       .fontSize(10)
       .text(`Nombre: ${data.Vendedor}`, 300, clientInfoTop + 20)
       .text('ID: V-001', 300, clientInfoTop + 35) // Deberías agregar este campo
       .text('Teléfono: (809) 555-5556', 300, clientInfoTop + 50) // Deberías agregar este campo
       .text('Email: ventas@empresa.com', 300, clientInfoTop + 65); // Deberías agregar este campo
    
    doc.moveDown(4);

    // Tabla de artículos
    const tableTop = doc.y;
    
    // Encabezado de la tabla con fondo
    doc.fillColor('#fff')
       .rect(50, tableTop, 500, 25)
       .fill(primaryColor);
    
    doc.fillColor('#fff')
       .font('Helvetica-Bold')
       .fontSize(10)
       .text('DESCRIPCIÓN', 55, tableTop + 5)
       .text('CANT.', 350, tableTop + 5, { width: 50, align: 'center' })
       .text('PRECIO UNIT.', 400, tableTop + 5, { width: 70, align: 'right' })
       .text('TOTAL', 480, tableTop + 5, { width: 70, align: 'right' });
    
    // Línea bajo encabezados
    doc.moveTo(50, tableTop + 25)
       .lineTo(550, tableTop + 25)
       .lineWidth(1)
       .stroke(primaryColor);
    
    // Datos de la tabla (simulados, deberían venir de una tabla relacionada)
    const productos = [
        { descripcion: 'Producto o Servicio 1', cantidad: data.Cantidad || 1, precio: data.Subtotal || 0, total: data.Subtotal || 0 }
    ];
    
    let y = tableTop + 30;
    let alternarColor = false;
    
    productos.forEach(producto => {
        // Fondo alternado para mejor lectura
        if (alternarColor) {
            doc.fillColor(lightGray)
               .rect(50, y - 5, 500, 20)
               .fill();
        }
        alternarColor = !alternarColor;
        
        doc.fillColor(secondaryColor)
           .font('Helvetica')
           .fontSize(10)
           .text(producto.descripcion, 55, y)
           .text(producto.cantidad.toString(), 350, y, { width: 50, align: 'center' })
           .text(`RD$ ${producto.precio.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 400, y, { width: 70, align: 'right' })
           .text(`RD$ ${producto.total.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 480, y, { width: 70, align: 'right' });
        
        y += 20;
    });
    
    // Totales
    const subtotal = data.Subtotal || 0;
    const descuento = subtotal * (data.Descuento / 100) || 0;
    const impuestos = data.Impuestos || 0;
    const total = data.Total || 0;
    
    // Línea divisoria
    doc.moveTo(350, y + 10)
       .lineTo(550, y + 10)
       .lineWidth(1)
       .stroke(secondaryColor);
    
    // Subtotal
    doc.fillColor(secondaryColor)
       .fontSize(10)
       .text('Subtotal:', 350, y + 15)
       .text(`RD$ ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 480, y + 15, { width: 70, align: 'right' });
    
    // Descuento
    doc.text(`Descuento (${data.Descuento}%):`, 350, y + 30)
       .text(`- RD$ ${descuento.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 480, y + 30, { width: 70, align: 'right' });
    
    // Impuestos
    doc.text(`Impuestos (${data.Impuestos}):`, 350, y + 45)
       .text(`RD$ ${impuestos.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 480, y + 45, { width: 70, align: 'right' });
    
    // Línea divisoria más gruesa
    doc.moveTo(350, y + 60)
       .lineTo(550, y + 60)
       .lineWidth(2)
       .stroke(primaryColor);
    
    // Total
    doc.fillColor(primaryColor)
       .font('Helvetica-Bold')
       .fontSize(12)
       .text('TOTAL:', 350, y + 65)
       .text(`RD$ ${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`, 480, y + 65, { width: 70, align: 'right' });
    
    // Método de pago
    doc.moveDown(2);
    doc.fillColor(primaryColor)
       .fontSize(10)
       .text('Método de pago: Efectivo/Tarjeta/Transferencia', { align: 'left' }); // Deberías agregar este campo
    
    // Términos y condiciones
    if (data.Terminos_y_condiciones) {
        doc.moveDown(2)
           .fillColor(primaryColor)
           .fontSize(10)
           .text('Términos y condiciones:', { underline: true });
        
        doc.fillColor(secondaryColor)
           .fontSize(9)
           .text(data.Terminos_y_condiciones, { align: 'justify', width: 500 });
    }
    
    // Notas
    if (data.Nota) {
        doc.moveDown()
           .fillColor(primaryColor)
           .fontSize(10)
           .text('Notas:', { underline: true });
        
        doc.fillColor(secondaryColor)
           .fontSize(9)
           .text(data.Nota, { align: 'justify', width: 500 });
    }
    
    // Pie de factura
    if (data.Pie_de_factrua) {
        doc.moveDown()
           .fillColor(primaryColor)
           .fontSize(10)
           .text(data.Pie_de_factrua, { align: 'center', width: 500 });
    }
    
    // Información de contacto
    doc.moveDown(2)
       .fillColor(secondaryColor)
       .fontSize(8)
       .text('Gracias por su preferencia', { align: 'center' })
       .text('Para cualquier consulta, contactarnos a: info@empresa.com | Tel: (809) 555-5555', { align: 'center' })
       .text(`Factura generada el: ${moment().format('DD/MM/YYYY HH:mm:ss')}`, { align: 'center' });

    // Finalizar
    writeStream.on('finish', () => callback());
    doc.end();
}

module.exports = buildPDF;