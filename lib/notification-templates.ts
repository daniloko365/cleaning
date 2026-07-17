type QuoteNotice = { name: string; reference: string; item: string; estimate: string; slot: string; scopeUrl: string };

export function quoteReceived(input: QuoteNotice) {
  return {
    subject: `${input.reference}: Novaclean received your textile brief`,
    text: `Hi ${input.name}, we received the ${input.item} brief and ${input.estimate} estimate. Requested window: ${input.slot}. This window is requested until route capacity is confirmed. Review the saved scope: ${input.scopeUrl}`,
    sms: `Novaclean: ${input.reference} is saved. ${input.item}, estimate ${input.estimate}, requested ${input.slot}. The route window is not confirmed yet.`,
  };
}

export function appointmentConfirmed(input: QuoteNotice & { preparationUrl: string }) {
  return {
    subject: `${input.reference}: your Novaclean route window is confirmed`,
    text: `Your ${input.slot} arrival window is confirmed for ${input.item}. Estimate: ${input.estimate}. Scope: ${input.scopeUrl}. Preparation: ${input.preparationUrl}`,
    sms: `Novaclean: ${input.reference} is confirmed for ${input.slot}. Prepare: ${input.preparationUrl}`,
  };
}

export function arrivalUpdate(input: { reference: string; eta: string; technician: string }) {
  return {
    subject: `${input.reference}: arrival update`,
    text: `${input.technician} is assigned to your Novaclean service. Current ETA: ${input.eta}. Reply through the service-care link if access has changed.`,
    sms: `Novaclean: ${input.technician} is on the route. Current ETA ${input.eta}. Ref ${input.reference}.`,
  };
}

export function aftercareNotice(input: { name: string; reference: string; drying: string; careUrl: string }) {
  return {
    subject: `${input.reference}: aftercare and 7-day care window`,
    text: `Hi ${input.name}, follow the technician’s item-specific guidance. Expected drying guidance: ${input.drying}. If something within the agreed scope needs review after full drying, use ${input.careUrl} within 7 days.`,
    sms: `Novaclean aftercare: ${input.drying}. Need a scope review after drying? ${input.careUrl} · ${input.reference}`,
  };
}

export function commercialReceived(input: { name: string; reference: string; company: string }) {
  return {
    subject: `${input.reference}: Novaclean received the ${input.company} walkthrough brief`,
    text: `Hi ${input.name}, the commercial brief is attached to ${input.reference}. A walkthrough date and any requested COI/vendor packet are pending operational verification, not automatically confirmed by submission.`,
  };
}
