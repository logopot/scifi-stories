// Legal page texts (English). Same content and layout as sr.js (checked by scripts/check-parity.mjs).
// Tokens: {site} site name, {operator} {email} {country} {year} from LEGAL in src/config.js; [text](https://address) is a link.
export default {
  privacy: {
    title: 'Privacy Policy',
    description: 'What data this site handles and what it does not, and how you can exercise your rights.',
    sections: [
      {
        h: 'Who we are',
        blocks: [
          { p: '“{site}” (otherworldstories.com) is run by {operator}, {country}. For any privacy question you can write to us at {email}.' },
        ],
      },
      {
        h: 'What data we handle',
        blocks: [
          { p: 'The site is built to know as little about you as possible. We handle only the following:' },
          {
            ul: [
              'Data in your browser. The name you type, the character you pick, your progress in a story (kept separately for each language) and your language choice are stored in your browser’s local storage (localStorage). This data stays on your device and we do not send it anywhere. You delete it by clearing the site’s data in your browser settings.',
              'Technical data when you visit. When you open the site, your browser sends your IP address, browser type, the time and the address you ask for. This data is handled by Cloudflare, our hosting and network protection provider, to deliver the site and keep it secure.',
              'Messages you send us. If you write to us by email, we have your address and the content of your message.',
            ],
          },
        ],
      },
      {
        h: 'What we do not do',
        blocks: [
          {
            ul: [
              'There are no user accounts or payments.',
              'There are no ads, profiling or analytics.',
              'We do not sell data.',
              'The site does not use tracking cookies.',
              'We do not load fonts or scripts from other people’s servers.',
            ],
          },
          { p: 'Cloudflare, as the site’s infrastructure, may use technical mechanisms to protect against abuse. If we ever introduce any of the things listed above, we will update this policy first.' },
        ],
      },
      {
        h: 'Why and on what basis',
        blocks: [
          { p: 'We handle technical data to run and secure the site; this is our legitimate interest. We use messages you send us to reply to you, based on your consent, which you give by sending the message. Data in your browser is used only by the site itself, so that it works the way you set it up.' },
        ],
      },
      {
        h: 'Third parties and transfers',
        blocks: [
          { p: 'The site is served through Cloudflare (hosting, DNS and content delivery network). Processing may involve transfers of data outside Serbia and the European Union, with the safeguards Cloudflare applies. More about this: [Cloudflare’s privacy policy](https://www.cloudflare.com/privacypolicy/).' },
        ],
      },
      {
        h: 'How long we keep data',
        blocks: [
          {
            ul: [
              'Data in your browser: until you delete it.',
              'Technical logs: according to Cloudflare’s rules.',
              'Email: for as long as it is needed to reply to your message.',
            ],
          },
        ],
      },
      {
        h: 'Your rights',
        blocks: [
          { p: 'Under Serbia’s Law on Personal Data Protection and, for visitors from the EU, under the GDPR, you have the right to:' },
          {
            ul: ['access your data', 'rectification', 'erasure', 'restriction of processing', 'object', 'data portability'],
          },
          { p: 'To exercise your rights, write to us at {email}. You also have the right to lodge a complaint with the competent authority: in Serbia, the Commissioner for Information of Public Importance and Personal Data Protection, and in the EU, the supervisory authority of your country.' },
        ],
      },
      {
        h: 'Children',
        blocks: [{ p: 'The site is not intended for people under 16.' }],
      },
      {
        h: 'Changes to this policy',
        blocks: [{ p: 'We may change this policy. The date of the latest change is at the top of the page.' }],
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'The stories are fiction, made with the help of artificial intelligence, and are not professional advice.',
    sections: [
      {
        h: 'Fiction',
        blocks: [
          { p: 'All stories, characters, places, institutions, machines and events are invented. Any resemblance to real people, companies or events is coincidental. The stories may be inspired by general themes from public news, but they are fully adapted to an invented world.' },
          { p: 'The site is intended for adults and young people aged 16 and over.' },
        ],
      },
      {
        h: 'Not advice',
        blocks: [
          { p: 'The content is entertainment. It is not political, medical, legal, financial or any other professional advice. The choices in the stories are not an assessment of the reader.' },
        ],
      },
      {
        h: 'Artificial intelligence',
        blocks: [{ p: 'Texts and images are made with the help of artificial intelligence tools, with human selection, editing and approval.' }],
      },
      {
        h: 'Content “as is”',
        blocks: [
          { p: 'The site and the stories are offered as they are, with no guarantee of accuracy, availability or freedom from errors. To the extent permitted by law, we are not liable for damage arising from use of the site. Links to other people’s sites are outside our control.' },
        ],
      },
      {
        h: 'Copyright',
        blocks: [
          { p: '© {year} {operator}. The content of the site may not be copied, published or used to train models without written permission. Short quotations with clear credit to the source and a link to the site are allowed.' },
        ],
      },
      {
        h: 'Contact',
        blocks: [{ p: 'For reports and questions, write to {email}.' }],
      },
    ],
  },
};
