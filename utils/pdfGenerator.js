const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');

const generateDeliveryNotePDF = (deliveryNoteData) => {
    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream());

    // Header
    doc
        .fontSize(20)
        .text('Gabrisp', 50, 50)
        .fontSize(10)
        .text(deliveryNoteData.user.name || 'gabriel sanchez', 50, 75)
        .text(deliveryNoteData.user.nif || '40000000W', 50, 90)
        .text(deliveryNoteData.user.address || 'Calle san vicente martir, 25', 50, 105)
        .text(deliveryNoteData.user.postalCode + ', ' + deliveryNoteData.user.city || '28043, Madrid', 50, 120)
        .text(deliveryNoteData.user.email || 'gabrielsanpal@gmail.com', 50, 135);

    // Client data
    doc
        .fontSize(12)
        .text('ALBARÁN', 400, 50)
        .fontSize(10)
        .text('Facturar a:', 400, 75)
        .text(deliveryNoteData.client.name || 'Zara', 400, 90)
        .text(deliveryNoteData.client.address || 'AVENIDA DEPUTACION, 1', 400, 105)
        .text(deliveryNoteData.client.postalCode + ' ' + deliveryNoteData.client.city || '15142 ARTEIXO', 400, 120)
        .text('CIF: ' + (deliveryNoteData.client.nif || 'A15022510'), 400, 135);

    // Delivery note details
    doc
        .fontSize(10)
        .text('Fecha del albarán: ' + new Date(deliveryNoteData.workdate).toLocaleDateString(), 50, 180)
        .text('Código proyecto cliente: ' + deliveryNoteData.projectId, 50, 195);

    // Work table header
    doc
        .fontSize(10)
        .text('NOMBRE DEL TRABAJADOR', 50, 230)
        .text('DESCRIPCIÓN DEL TRABAJO', 200, 230)
        .text('HORAS', 380, 230)
        .text('PRECIO(Ud)', 440, 230)
        .text('IMPORTE', 510, 230)
        .moveTo(50, 245)
        .lineTo(550, 245)
        .stroke();

    // Work row
    doc
        .text(deliveryNoteData.user.name || 'gabriel sanchez', 50, 260)
        .text(deliveryNoteData.description || 'nuevo albaran 2', 200, 260)
        .text(deliveryNoteData.format === 'hours' ? deliveryNoteData.hours.toString() : '', 380, 260)
        .text('', 440, 260)
        .text('', 510, 260);

    // Observations and signature
    doc
        .moveDown()
        .fontSize(10)
        .text('Observaciones', 50, 320)
        .text('Firmado', 50, 340)
        .text(deliveryNoteData.signed ? 'Firmado' : 'Pendiente de Firma', 110, 340);

    // Footer
    doc
        .moveDown()
        .text('Albarán firmado y elaborado con Gabrisp, aplicación especializada en la firma digital de albaranes. Muchas gracias.', 50, 380, {
            width: 500,
            align: 'justify'
        });

    // Finalize document
    doc.end();
    
    return new Promise((resolve, reject) => {
        stream.on('finish', () => {
            resolve(stream.toBlobURL('application/pdf'));
        });
        stream.on('error', reject);
    });
};

module.exports = { generateDeliveryNotePDF }; 