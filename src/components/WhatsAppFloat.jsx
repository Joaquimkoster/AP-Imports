import { MessageCircle } from "lucide-react";
import { teamContacts, whatsappUrl } from "../data/contact";

function WhatsAppFloat() {
  const member = teamContacts[0];
  const url = whatsappUrl("Olá! Vim pelo site da A&P Imports e gostaria de mais informações sobre os produtos.", member?.whatsapp);
  if (!url) return null;

  return (
    <a className="whatsapp-float" href={url} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}

export default WhatsAppFloat;
