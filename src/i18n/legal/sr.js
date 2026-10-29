// Tekstovi pravnih stranica (srpski). Isti sadržaj i isti raspored kao u en.js (proverava scripts/check-parity.mjs).
// Tokeni: {site} naziv sajta, {year} godina iz LEGAL u src/config.js; [tekst](https://adresa) je link.
export default {
  privacy: {
    title: "Politika privatnosti",
    description:
      "Politika privatnosti: koje podatke sajt koristi, a koje ne, kako se čuvaju i koja prava imate.",
    sections: [
      {
        h: "Koje podatke koristimo",
        blocks: [
          {
            ul: [
              "Podaci u vašem pregledaču. Ime koje upišete, izabrani lik, napredak u priči (posebno za svaki jezik) i izbor jezika čuvaju se u lokalnoj memoriji pregledača (localStorage). Ostaju na vašem uređaju i ne šaljemo ih nigde. Brišete ih brisanjem podataka sajta u podešavanjima pregledača.",
              "Tehnički podaci pri poseti. Kad otvorite sajt, vaš pregledač šalje IP adresu, tip pregledača, vreme i adresu koju tražite. Te podatke obrađuje Cloudflare, pružalac hostinga i mrežne zaštite, radi rada i bezbednosti sajta (naš legitimni interes).",
            ],
          },
        ],
      },
      {
        h: "Šta ne radimo",
        blocks: [
          {
            ul: [
              "Nema korisničkih naloga ni plaćanja.",
              "Nema oglasa, profilisanja ni analitike.",
              "Ne prodajemo podatke.",
              "Sajt ne koristi kolačiće za praćenje.",
              "Ne učitavamo fontove ni skripte sa tuđih servera.",
            ],
          },
          {
            p: "Cloudflare, kao infrastruktura sajta, može koristiti tehničke mehanizme zaštite od zloupotrebe.",
          },
          {
            p: "Ako u budućnosti uvedemo nešto od navedenog, prvo ćemo ažurirati ovu politiku.",
          },
        ],
      },
      {
        h: "Treće strane i prenos podataka",
        blocks: [
          {
            p: "Sajt se služi preko Cloudflare-a (hosting, DNS i mreža za isporuku sadržaja). Obrada može da uključuje prenos podataka van Srbije i Evropske unije, uz zaštitne mehanizme koje Cloudflare primenjuje. Više o tome: [politika privatnosti Cloudflare-a](https://www.cloudflare.com/privacypolicy/).",
          },
        ],
      },
      {
        h: "Vaša prava",
        blocks: [
          {
            p: "Prema Zakonu o zaštiti podataka o ličnosti Srbije i, za posetioce iz EU, prema GDPR-u, imate pravo na pristup, ispravku, brisanje, ograničenje obrade, prigovor i prenosivost podataka.",
          },
          {
            p: "Mi sami ne čuvamo vaše podatke na serveru, a podaci u pregledaču su pod vašom kontrolom. Za tehničke podatke koje obrađuje Cloudflare, prava ostvarujete preko Cloudflare-a.",
          },
          {
            p: "Imate i pravo na pritužbu nadležnom organu: u Srbiji to je Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti, a u EU nadzorni organ vaše države.",
          },
        ],
      },
    ],
  },
  disclaimer: {
    title: "Odricanje odgovornosti",
    description:
      "Odricanje odgovornosti: priče su fikcija, nastaju uz pomoć veštačke inteligencije i ne predstavljaju stručni savet.",
    sections: [
      {
        h: "Fikcija",
        blocks: [
          {
            p: "Sve priče, likovi, mesta, ustanove, mašine i događaji su izmišljeni. Svaka sličnost sa stvarnim osobama, firmama ili događajima je slučajna. Priče mogu biti inspirisane opštim temama, ali su potpuno prilagođene izmišljenom svetu.",
          },
          { p: "Sajt je namenjen osobama od 16 godina naviše." },
        ],
      },
      {
        h: "Nije savet i bez garancije",
        blocks: [
          {
            p: "Sadržaj je zabava. Nije politička, medicinska, pravna, finansijska ni bilo koja druga stručna preporuka. Izbori u pričama nisu ocenjivanje čitaoca.",
          },
          {
            p: "Sajt i priče nude se onakvi kakvi jesu, bez garancije tačnosti, dostupnosti ili odsustva grešaka. U meri dozvoljenoj zakonom ne odgovaramo za štetu nastalu korišćenjem sajta. Linkovi ka tuđim sajtovima su van naše kontrole.",
          },
        ],
      },
      {
        h: "Veštačka inteligencija",
        blocks: [
          {
            p: "Tekstovi i slike nastaju uz pomoć alata veštačke inteligencije, uz ljudski izbor, uređivanje i odobrenje.",
          },
        ],
      },
      {
        h: "Autorska prava",
        blocks: [
          {
            p: "© {year} {site}. Sadržaj sajta nije dozvoljeno kopirati, objavljivati ni koristiti za obuku modela bez pisane dozvole. Kratki citati sa jasnim navođenjem izvora i linkom ka sajtu su dozvoljeni.",
          },
        ],
      },
    ],
  },
};
