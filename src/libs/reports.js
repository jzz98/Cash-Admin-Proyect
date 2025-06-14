const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const moment = require('moment');

function buildPDF(data, outputPath, callback) {
    // Configuración del documento
    const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        bufferPages: true
    });

    // Paleta de colores
    const primaryColor = '#2c3e50';
    const secondaryColor = '#7f8c8d';
    const lightGray = '#f5f5f5';

    // Crear stream de escritura
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Encabezado del reporte
    doc.fillColor(primaryColor)
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('REPORTE DE VENTAS', { align: 'center' });
    
    doc.fillColor(secondaryColor)
       .fontSize(12)
       .text(`Generado el: ${moment().format('DD [de] MMMM [de] YYYY - h:mm a')}`, { align: 'center' });
    
    doc.moveDown(2);

    // Sección de gráficos comparativos (diseño original)
    doc.fillColor(primaryColor)
       .fontSize(16)
       .text('ANÁLISIS GRÁFICO', { align: 'center' });
    
    doc.moveDown();

    // Rutas de las imágenes
    const imagePath1 = path.join(__dirname, '..', data.char1);
    const imagePath2 = path.join(__dirname, '..', data.char2);

    // Gráficos lado a lado como en el primer modelo
    if (fs.existsSync(imagePath1) && fs.existsSync(imagePath2)) {
        const startY = doc.y;
        const imgWidth = 240;
        const imgHeight = 160;
        const spacing = 30;

        // Marco para gráfico 1
        doc.fillColor(lightGray)
           .roundedRect(50, startY, imgWidth, imgHeight + 30, 5)
           .fill();
        
        doc.image(imagePath1, 60, startY + 10, { 
            width: imgWidth - 20, 
            height: imgHeight
        });
        
        doc.fillColor(primaryColor)
           .fontSize(10)
           .text('Tendencia de Ventas', 50, startY + imgHeight + 15, {
               width: imgWidth,
               align: 'center'
           });

        // Marco para gráfico 2
        doc.fillColor(lightGray)
           .roundedRect(50 + imgWidth + spacing, startY, imgWidth, imgHeight + 30, 5)
           .fill();
        
        doc.image(imagePath2, 60 + imgWidth + spacing, startY + 10, { 
            width: imgWidth - 20, 
            height: imgHeight
        });
        
        doc.fillColor(primaryColor)
           .fontSize(10)
           .text('Comparación por Categoría', 50 + imgWidth + spacing, startY + imgHeight + 15, {
               width: imgWidth,
               align: 'center'
           });

        doc.moveDown(imgHeight / 50 + 2);
    }

    // Sección de análisis textual (SIN COLUMNAS)
    doc.addPage()
       .fillColor(primaryColor)
       .fontSize(16)
       .text('ANÁLISIS DETALLADO', { align: 'center' });
    
    doc.moveDown();

    if (data.response) {
        doc.fillColor(secondaryColor)
           .fontSize(11)
           .text(data.response, {
               align: 'left',  // Texto alineado a la izquierda
               width: 500,     // Ancho completo
               lineGap: 5      // Espaciado entre líneas
           });
    }

    // Pie de página
    let pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fillColor(secondaryColor)
           .fontSize(8)
           .text(
               `Página ${i + 1} de ${pages.count + 1}`,
               doc.page.margins.left,
               doc.page.height - 30,
               { align: 'left' }
           );
    }

    // Finalizar documento
    writeStream.on('finish', () => callback());
    doc.end();
}

module.exports = buildPDF;