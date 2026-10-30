import { ArrowUpRight, Bot, MessageCircle } from "lucide-react";
import { teamContacts, chatbotContact, whatsappUrl } from "../data/contact";
import { scrollToSection } from "../utils/scrollToSection";
import "./Contact.css";

function Contact() {
  const contacts = [...teamContacts, { ...chatbotContact, isBot: true }];

  return (
    <section id="contato" className="contact" aria-labelledby="contact-title">
      <div className="contact-container">
        <div className="contact-heading">
          <span className="contact-label">ATENDIMENTO A&P IMPORTS</span>
          <h2 id="contact-title">Fale com nossa <span>equipe.</span></h2>
        </div>

        <div className="contact-team">
          {contacts.map((member) => {
            const url = whatsappUrl(`Olá, ${member.name}! Vim pelo site da A&P Imports e gostaria de mais informações sobre os produtos.`, member.whatsapp);
            const pending = !url;

            return (
              <article className={`contact-person${member.isBot ? " contact-person-bot" : ""}`} key={member.name}>
                <span className="contact-role">{member.isBot ? "ASSISTENTE VIRTUAL" : "ATENDIMENTO PESSOAL"}</span>
                <div className="contact-avatar" aria-hidden="true">
                  {member.image ? (
                    <img src={member.image} alt="" width="72" height="72" loading="lazy" decoding="async" />
                  ) : member.isBot ? <Bot size={32} strokeWidth={1.5} /> : member.initials}
                </div>
                <h3>{member.name}</h3>
                <p className="contact-description">
                  {member.isBot
                    ? (pending ? "Em breve, tire suas dúvidas e explore nosso catálogo com um assistente no WhatsApp." : "Tire suas dúvidas com nosso assistente virtual pelo WhatsApp.")
                    : member.description}
                </p>
                {member.phone ? (
                  <a className="contact-phone" href={`tel:+${member.whatsapp}`}>{member.phone}</a>
                ) : <span className="contact-phone contact-note">{pending ? "Novidade em preparação" : "Atendimento pelo WhatsApp"}</span>}
                {url ? (
                  <a className="contact-whatsapp" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Chamar ${member.name} no WhatsApp`}>
                    <MessageCircle size={18} aria-hidden="true" />
                    Chamar no WhatsApp
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ) : (
                  <button className="contact-whatsapp" type="button" disabled>
                    <Bot size={18} aria-hidden="true" />
                    Em breve no WhatsApp
                  </button>
                )}
              </article>
            );
          })}
        </div>

        <footer className="contact-footer">
          <span>A&P IMPORTS</span>
          <span>© {new Date().getFullYear()} A&P Imports. Todos os direitos reservados.</span>
          <a href="#catalogo" onClick={(event) => scrollToSection(event, "catalogo")}>Voltar ao catálogo <ArrowUpRight size={14} aria-hidden="true" /></a>
        </footer>
      </div>
    </section>
  );
}

export default Contact;
