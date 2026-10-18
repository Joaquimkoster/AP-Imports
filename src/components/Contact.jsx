import { ArrowUpRight, Phone, Mail, Send } from "lucide-react";
import { contact } from "../data/contact";
import "./Contact.css";

function Contact() {
  function handleSubmit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = fields.get("name").trim();
    const message = fields.get("message").trim();
    if (!message) {
      event.currentTarget.elements.message.setCustomValidity("Escreva sua mensagem para continuar.");
      event.currentTarget.reportValidity();
      return;
    }
    if (!contact.email) return;
    const body = [name ? `Olá! Meu nome é ${name}.` : "Olá!", message].join("\n\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(fields.get("subject"))}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contato" className="contact" aria-labelledby="contact-title">
      <div className="contact-container">
        <div className="contact-content">
          <span className="contact-label">FALE COM A GENTE</span>
          <h2 id="contact-title">Sua próxima escolha<br />começa com uma <span>conversa.</span></h2>
          <p className="contact-intro">
            Quer saber mais sobre um produto ou precisa de ajuda para escolher?
            Conte o que você procura. Vamos conversar.
          </p>

          <div className="contact-channels">
            <div className="contact-channel">
              <span className="contact-channel-icon" aria-hidden="true"><Phone size={24} strokeWidth={1.5} /></span>
              <div>
                <h3>Telefone</h3>
                <p>Prefere conversar? Fale com a gente por ligação.</p>
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
                    {contact.phone} <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                ) : <span className="contact-channel-status">Telefone disponível em breve</span>}
              </div>
            </div>

            <div className="contact-channel">
              <span className="contact-channel-icon" aria-hidden="true"><Mail size={24} strokeWidth={1.5} /></span>
              <div>
                <h3>E-mail</h3>
                <p>Envie sua dúvida ou conte o que você procura.</p>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`}>{contact.email} <ArrowUpRight size={16} aria-hidden="true" /></a>
                ) : <span className="contact-channel-status">E-mail disponível em breve</span>}
              </div>
            </div>
          </div>

          <a className="contact-catalog-link" href="#produtos">Ainda explorando? Conheça o catálogo <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-heading">
            <span className="contact-form-icon" aria-hidden="true"><Send size={22} strokeWidth={1.4} /></span>
            <div>
              <h3>Como podemos ajudar?</h3>
              <p>Prepare sua mensagem por aqui.</p>
            </div>
          </div>

          <div className="contact-field">
            <label htmlFor="contact-name">Seu nome <span>(opcional)</span></label>
            <input id="contact-name" name="name" autoComplete="name" maxLength={100} placeholder="Como podemos chamar você?" />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-subject">Sobre o que você quer conversar?</label>
            <select id="contact-subject" name="subject" defaultValue="Informações sobre um produto">
              <option>Informações sobre um produto</option>
              <option>Ajuda para escolher</option>
              <option>Dúvidas sobre uma compra</option>
              <option>Outro assunto</option>
            </select>
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">Sua mensagem</label>
            <textarea id="contact-message" name="message" required maxLength={2000} rows={4} placeholder="Conte um pouco do que você precisa…" onInput={(event) => event.currentTarget.setCustomValidity("")} />
          </div>

          <button className="contact-submit" type="submit" disabled={!contact.email} aria-describedby="contact-send-note">
            Continuar no e-mail <ArrowUpRight size={19} aria-hidden="true" />
          </button>
          <p className="contact-send-note" id="contact-send-note">
            {contact.email ? "A mensagem será aberta no seu aplicativo de e-mail para você revisar e enviar." : "O envio estará disponível assim que nosso e-mail estiver ativo."}
          </p>
        </form>
        <footer className="contact-footer">
          <span>A&P IMPORTS</span>
          <span>Escolhas que inspiram.</span>
          <a href="#inicio">Voltar ao início <ArrowUpRight size={14} aria-hidden="true" /></a>
        </footer>
      </div>
    </section>
  );
}

export default Contact;
