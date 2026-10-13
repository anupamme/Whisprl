import { mail, panel, paragraph } from "#src/templates/mail/layout.js";

export default ({ name, heading, body, reason }) =>
  mail({
    title: heading,
    preheader: heading,
    body: `
${paragraph(`Hey ${name},`)}
${paragraph(body)}
${panel("Why", reason)}
${paragraph('If you think this is a mistake, reply to this email and tell us why. A person reads every reply.')}`,
    text: [`Hey ${name},`, "", body, "", "Why:", reason, "", "If you think this is a mistake, reply to this email and tell us why. A person reads every reply."],
  });
