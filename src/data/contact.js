// WhatsApp comercial com DDI e DDD, somente números.
export const contact = {
  phone: "",
  whatsapp: "",
  email: "",
  instagram: "",
};

export function whatsappUrl(message) {
  if (!contact.whatsapp) return null;
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
