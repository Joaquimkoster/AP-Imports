// WhatsApp comercial com DDI e DDD, somente números.
export const contact = {
  phone: "",
  whatsapp: "",
  email: "",
  instagram: "",
};

export const teamContacts = [
  {
    name: "Adriana",
    initials: "A",
    image: "/images/contacts/adriana.jpeg",
    phone: "+55 (11) 95602-9153",
    whatsapp: "5511956029153",
  },
  {
    name: "Duda",
    initials: "D",
    image: "/images/contacts/duda.png",
    phone: "+55 (51) 8043-9808",
    whatsapp: "555180439808",
  },
  {
    name: "Josi",
    initials: "J",
    image: "/images/contacts/josi.png",
    phone: "+55 (19) 99848-8494",
    whatsapp: "5519998488494",
  },
  {
    name: "Vanessa",
    initials: "V",
    image: "/images/contacts/vanessa.png",
    phone: "+55 (21) 97248-8640",
    whatsapp: "5521972488640",
  },
  {
    name: "Cecilia",
    initials: "C",
    image: "/images/contacts/cecilia.png",
    phone: "+55 (11) 99219-9461",
    whatsapp: "5511992199461",
  },
  {
    name: "Gessica",
    initials: "G",
    image: "/images/contacts/gessica.png",
    phone: "+55 (11) 94766-2484",
    whatsapp: "5511947662484",
  },
];

// Preencha o WhatsApp com DDI e DDD quando o chatbot estiver pronto.
// O cartão permanece como "Em breve" enquanto o número estiver vazio.
export const chatbotContact = {
  name: "Chatbot",
  whatsapp: "",
};

export function whatsappUrl(message, phone = contact.whatsapp) {
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
