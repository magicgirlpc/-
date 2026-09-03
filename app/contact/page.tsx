import Link from "next/link";
import "../pacome.css";
import "./contact.css";

const providers = [
  {
    label: "Gmail",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=1579713724%40qq.com",
    ariaLabel: "Compose an email in Gmail in a new tab",
  },
  {
    label: "Outlook",
    href: "https://outlook.live.com/mail/0/deeplink/compose?to=1579713724%40qq.com",
    ariaLabel: "Compose an email in Outlook in a new tab",
  },
  {
    label: "QQ Mail",
    href: "https://mail.qq.com/",
    ariaLabel: "Open QQ Mail in a new tab",
  },
] as const;

export default function ContactPage() {
  return (
    <main className="pp-contact">
      <Link className="pp-contact__back" href="/">
        back to portfolio
      </Link>

      <article className="pp-contact__card">
        <p className="pp-contact__eyebrow">CONTACT</p>
        <h1 className="pp-contact__heading">Send me an email</h1>
        <p className="pp-contact__recipient">1579713724@qq.com</p>
        <p className="pp-contact__description">
          Choose a mail service below. The recipient address is already filled wherever the provider supports it.
        </p>

        <nav className="pp-contact__providers" aria-label="Choose a mail service">
          {providers.map((provider) => (
            <a
              className="pp-contact__provider"
              href={provider.href}
              key={provider.label}
              target="_blank"
              rel="noreferrer"
              aria-label={provider.ariaLabel}
            >
              <span>{provider.label}</span>
              <i aria-hidden="true" />
            </a>
          ))}
        </nav>

        <a className="pp-contact__fallback" href="mailto:1579713724@qq.com">
          Use my email app
        </a>
      </article>
    </main>
  );
}
