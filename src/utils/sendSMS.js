const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Normal SMS anuppu
const sendSMS = async (to, message) => {
  const result = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: message,
  });
  return result;
};

// WhatsApp message anuppu — same code, just "whatsapp:" prefix add pannu
const sendWhatsApp = async (to, message) => {
  const result = await client.messages.create({
    from: "whatsapp:+14155238886",
    to: `whatsapp:${to}`,
    body: message,
  });
  return result;
};

module.exports = { sendSMS, sendWhatsApp };
