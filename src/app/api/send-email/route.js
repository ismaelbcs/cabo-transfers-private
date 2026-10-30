// src/app/api/send-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request) {
  try {
    const { to, subject, html, text } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (to, subject, html/text)' },
        { status: 400, headers: corsHeaders }
      );
    }

    const emailUser = process.env.EMAIL_USER || 'reservationballard@gmail.com';
    const emailPass = process.env.EMAIL_PASS || 'rdtmmazjsjolpbwm';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"Ballard Tours Los Cabos" <${emailUser}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito:', info.messageId);

    return NextResponse.json(
      { success: true, messageId: info.messageId },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error al enviar correo vía Nodemailer:', error);
    return NextResponse.json(
      { error: 'Error al enviar el correo', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
