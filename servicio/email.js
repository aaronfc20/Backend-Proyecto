// services/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto si usas otro proveedor como Outlook, Yahoo, etc.
    auth: {
        user: 'tu-email@gmail.com',
        pass: 'tu-contraseña-app', // Usa una contraseña de aplicación si es Gmail
    },
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'tu-email@gmail.com',
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${to}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

module.exports = { sendEmail };
