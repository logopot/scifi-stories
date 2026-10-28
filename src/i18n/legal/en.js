// Legal page texts (English). Same content and layout as sr.js (checked by scripts/check-parity.mjs).
// Tokens: {site} site name, {year} year from LEGAL in src/config.js; [text](https://address) is a link.
export default {
  privacy: {
    title: 'Privacy Policy',
    description: 'What data this site uses and what it does not, and your rights.',
    sections: [
      {
        h: 'What data we use',
        blocks: [
          {
            ul: [
              'Data in your browser. The name you type, the character you pick, your progress in a story (kept separately for each language) and your language choice are stored in your browser’s local storage (localStorage). They stay on your device and we do not send them anywhere. You delete them by clearing the site’s data in your browser settings.',
              'Technical data when you visit. When you open the site, your browser sends your IP address, browser type, the time and the address you ask for. This data is handled by Cloudflare, our hosting and network protection provider, to run and secure the site (our legitimate interest).',
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
          { p: 'Cloudflare, as the site’s infrastructure, may use technical mechanisms to protect against abuse.' },
          { p: 'If we ever introduce any of the things listed above, we will update this policy first.' },
        ],
      },
      {
        h: 'Third parties and transfers',
        blocks: [
          { p: 'The site is served through Cloudflare (hosting, DNS and content delivery network). Processing may involve transfers of data outside Serbia and the European Union, with the safeguards Cloudflare applies. More about this: [Cloudflare’s privacy policy](https://www.cloudflare.com/privacypolicy/).' },
        ],
      },
      {
        h: 'Your rights',
        blocks: [
          { p: 'Under Serbia’s Law on Personal Data Protection and, for visitors from the EU, under the GDPR, you have the right to access, rectification, erasure, restriction of processing, objection and data portability.' },
          { p: 'We do not store your data on a server ourselves, and the data in your browser is under your control. For the technical data handled by Cloudflare, you exercise your rights through Cloudflare.' },
          { p: 'You also have the right to lodge a complaint with the competent authority: in Serbia, the Commissioner for Information of Public Importance and Personal Data Protection, and in the EU, the supervisory authority of your country.' },
        ],
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
          { p: 'The site is intended for people aged 16 and over.' },
        ],
      },
      {
        h: 'Not advice, no warranty',
        blocks: [
          { p: 'The content is entertainment. It is not political, medical, legal, financial or any other professional advice. The choices in the stories are not an assessment of the reader.' },
          { p: 'The site and the stories are offered as they are, with no guarantee of accuracy, availability or freedom from errors. To the extent permitted by law, we are not liable for damage arising from use of the site. Links to other people’s sites are outside our control.' },
        ],
      },
      {
        h: 'Artificial intelligence',
        blocks: [{ p: 'Texts and images are made with the help of artificial intelligence tools, with human selection, editing and approval.' }],
      },
      {
        h: 'Copyright',
        blocks: [
          { p: '© {year} {site}. The content of the site may not be copied, published or used to train models without written permission. Short quotations with clear credit to the source and a link to the site are allowed.' },
        ],
      },
    ],
  },
};
