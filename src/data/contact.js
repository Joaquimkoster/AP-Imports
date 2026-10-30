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
    description: "Conte à Adriana o que você procura e encontre uma opção que combine com você.",
    initials: "A",
    image: "/images/contacts/adriana.jpeg",
    phone: "+55 (11) 95602-9153",
    whatsapp: "5511956029153",
  },
  {
    name: "Gessica",
    description: "Ficou em dúvida? A Gessica te ajuda com os detalhes para escolher com confiança.",
    initials: "G",
    image: "/images/contacts/gessica.jpeg",
    phone: "+55 (45) 9956-7888",
    whatsapp: "554599567888",
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
