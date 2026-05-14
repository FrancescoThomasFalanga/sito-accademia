const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Metodo non consentito." })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email || !email.includes("@")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email non valida." })
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"META - ATTO" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Conferma iscrizione newsletter META - ATTO",
      html: `
        <div style="background:#000; color:#fff; padding:30px; font-family:Arial, sans-serif;">
          <h1 style="letter-spacing:3px;">META - ATTO</h1>
          <p>Grazie per esserti iscritto alla newsletter.</p>
          <p>Riceverai aggiornamenti relativi al progetto META - ATTO.</p>
          <hr style="border:0; border-top:1px solid #333; margin:30px 0;">
          <p style="font-size:12px; color:#999;">
            Questa è una mail automatica di conferma iscrizione.
          </p>
        </div>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email di conferma inviata." })
    };

  } catch (error) {
    console.error("Errore newsletter:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Errore durante l'invio della mail." })
    };
  }
};