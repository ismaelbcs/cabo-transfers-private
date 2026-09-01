// src/utils/sendEmail.js

/**
 * Función auxiliar para enviar correos directamente a la API interna de Next.js
 * @param {Object} options
 * @param {string} options.to - Destinatario
 * @param {string} options.subject - Asunto
 * @param {string} options.html - Contenido en HTML
 * @param {string} [options.text] - Contenido en texto plano opcional
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html, text }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Error al enviar correo:', data);
      return { success: false, error: data.error || 'Error desconocido' };
    }

    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error de red al llamar a /api/send-email:', error);
    return { success: false, error: error.message };
  }
}
