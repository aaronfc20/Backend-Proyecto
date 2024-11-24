const nodemailer = require('nodemailer');

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'prueba20191568@gmail.com',
    pass: 'vglr pwkj tiby qryk',
  },
});

// Función para enviar correos electrónicos
const enviarCorreo = async ({ to, subject, text }) => {
  const mailOptions = {
    from: 'prueba20191568@gmail.com',
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to}`);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
};

module.exports = { enviarCorreo };
