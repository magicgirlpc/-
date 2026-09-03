# ContactPage Specification

## Overview
- **Target files:** `app/contact/page.tsx`, `app/contact/contact.css`
- **Route:** `/contact`
- **Interaction model:** click-driven browser-safe mail-provider chooser

## Purpose
Embedded browsers may reject the operating-system `mailto:` protocol even when the link is valid. Clicking the homepage email must therefore navigate to this local HTTP page, which always renders and lets visitors choose a browser-based mail service. No form is submitted and no message is sent automatically.

## DOM Structure
- Full-height `.pp-contact` page using the same black background, dotted texture, white color and Indivisible font as the portfolio.
- Top-left back link to `/` labeled `back to portfolio`.
- Centered `.pp-contact__card` with eyebrow `CONTACT`, heading `Send me an email`, recipient row showing `1579713724@qq.com`, explanatory text and provider actions.
- Primary provider links open in a new tab:
  - Gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=1579713724%40qq.com`
  - Outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=1579713724%40qq.com`
  - QQ Mail: `https://mail.qq.com/` (the recipient remains visibly displayed for manual paste because QQ's historic prefilled-compose URL is unreliable)
- Final secondary link retains `mailto:1579713724@qq.com` as an optional native-app fallback, clearly labeled `Use my email app`.

## Styles
- Page: min-height `100dvh`, display grid, place-items center, background `#0a0a0a`, color `#fafafa`, padding `30px`, overflow hidden.
- Dotted texture: same repeating radial dot treatment as the entry screen, low opacity, pointer-events none.
- Back link: fixed top/left `30px`, font-size `14px`, opacity `.7`; underline scales in on hover/focus.
- Card: width `min(560px, calc(100vw - 60px))`, border `1px solid rgba(250,250,250,.16)`, radius `24px`, padding `clamp(28px,5vw,56px)`, background `rgba(14,14,14,.82)`, backdrop-filter `blur(18px)`.
- Eyebrow: 12px, letter-spacing `.14em`, opacity `.55`.
- Heading: `clamp(40px,7vw,72px)`, weight 500, line-height `.92`, letter-spacing `-.055em`.
- Recipient: 18px, padded rounded row, subtle white translucent background, overflow-wrap anywhere.
- Description: 15px, line-height 1.45, opacity `.65`.
- Provider links: flex-wrap row, 14px/500, white pill with black text; hover/focus translates `-2px` and scales trailing dot.
- Native fallback: 14px, opacity `.6`, underline on hover/focus.

## Accessibility and Behavior
- Provider links use `target="_blank" rel="noreferrer"` and descriptive accessible labels.
- `/contact` contains no JavaScript requirement.
- External links only open compose/login pages; they never submit or send mail.
- Focus-visible outlines are high contrast.

## Responsive Behavior
- Desktop/tablet: centered card, three provider pills wrap as needed.
- Mobile 390px: page padding 18px; back link 18px; card width `calc(100vw - 36px)`, padding 28px 22px, radius 20px; provider links stack full width; no horizontal overflow.
