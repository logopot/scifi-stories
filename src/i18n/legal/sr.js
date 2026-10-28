// Tekstovi pravnih stranica (srpski). Isti sadržaj i isti raspored kao u en.js (proverava scripts/check-parity.mjs).
// Tokeni: {site} naziv sajta, {operator} {email} {country} {year} iz LEGAL u src/config.js; [tekst](https://adresa) je link.
export default {
  privacy: {
    title: 'Politika privatnosti',
    description: 'Koje podatke sajt obrađuje, a koje ne, i kako možete ostvariti svoja prava.',
    sections: [
      {
        h: 'Ko smo',
        blocks: [
          { p: 'Sajt „{site}“ (otherworldstories.com) vodi {operator}, {country}. Za sva pitanja o privatnosti možete nam pisati na {email}.' },
        ],
      },
      {
        h: 'Koje podatke obrađujemo',
        blocks: [
          { p: 'Sajt je napravljen tako da o vama zna što je moguće manje. Obrađujemo samo sledeće:' },
          {
            ul: [
              'Podaci u vašem pregledaču. Ime koje upišete, izabrani lik, napredak u priči (posebno za svaki jezik) i izbor jezika čuvaju se u lokalnoj memoriji vašeg pregledača (localStorage). Ti podaci ostaju na vašem uređaju i ne šaljemo ih nigde. Brišete ih brisanjem podataka sajta u podešavanjima pregledača.',
              'Tehnički podaci pri poseti. Kad otvorite sajt, vaš pregledač šalje IP adresu, tip pregledača, vreme i adresu koju tražite. Te podatke obrađuje Cloudflare, naš pružalac hostinga i mrežne zaštite, radi isporuke i bezbednosti sajta.',
              'Poruke koje nam pošaljete. Ako nam pišete e-poštom, imamo vašu adresu i sadržaj poruke.',
            ],
          },
        ],
      },
      {
        h: 'Šta ne radimo',
        blocks: [
          {
            ul: [
              'Nema korisničkih naloga ni plaćanja.',
              'Nema oglasa, profilisanja ni analitike.',
              'Ne prodajemo podatke.',
              'Sajt ne koristi kolačiće za praćenje.',
              'Ne učitavamo fontove ni skripte sa tuđih servera.',
            ],
          },
          { p: 'Cloudflare, kao infrastruktura sajta, može koristiti tehničke mehanizme zaštite od zloupotrebe. Ako u budućnosti uvedemo nešto od navedenog, prvo ćemo ažurirati ovu politiku.' },
        ],
      },
      {
        h: 'Zašto i na osnovu čega',
        blocks: [
          { p: 'Tehničke podatke obrađujemo zbog rada i bezbednosti sajta; to je naš legitimni interes. Poruke koje nam pošaljete koristimo da vam odgovorimo, na osnovu vaše saglasnosti, koju dajete samim slanjem poruke. Podatke u pregledaču koristi samo sajt, da bi radio onako kako ste ga podesili.' },
        ],
      },
      {
        h: 'Treće strane i prenos podataka',
        blocks: [
          { p: 'Sajt se služi preko Cloudflare-a (hosting, DNS i mreža za isporuku sadržaja). Obrada može da uključuje prenos podataka van Srbije i Evropske unije, uz zaštitne mehanizme koje Cloudflare primenjuje. Više o tome: [politika privatnosti Cloudflare-a](https://www.cloudflare.com/privacypolicy/).' },
        ],
      },
      {
        h: 'Koliko dugo čuvamo podatke',
        blocks: [
          {
            ul: [
              'Podaci u pregledaču: dok ih ne obrišete.',
              'Tehnički dnevnici: prema pravilima Cloudflare-a.',
              'E-pošta: dok je potrebna da odgovorimo na vašu poruku.',
            ],
          },
        ],
      },
      {
        h: 'Vaša prava',
        blocks: [
          { p: 'Prema Zakonu o zaštiti podataka o ličnosti Srbije i, za posetioce iz EU, prema GDPR-u, imate pravo na:' },
          {
            ul: ['pristup svojim podacima', 'ispravku', 'brisanje', 'ograničenje obrade', 'prigovor', 'prenosivost podataka'],
          },
          { p: 'Za ostvarivanje prava pišite nam na {email}. Imate i pravo na pritužbu nadležnom organu: u Srbiji to je Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti, a u EU nadzorni organ vaše države.' },
        ],
      },
      {
        h: 'Deca',
        blocks: [{ p: 'Sajt nije namenjen osobama mlađim od 16 godina.' }],
      },
      {
        h: 'Izmene politike',
        blocks: [{ p: 'Ovu politiku možemo menjati. Datum poslednje izmene stoji na vrhu strane.' }],
      },
    ],
  },
  disclaimer: {
    title: 'Odricanje odgovornosti',
    description: 'Priče su fikcija, nastaju uz pomoć veštačke inteligencije i ne predstavljaju stručni savet.',
    sections: [
      {
        h: 'Fikcija',
        blocks: [
          { p: 'Sve priče, likovi, mesta, ustanove, mašine i događaji su izmišljeni. Svaka sličnost sa stvarnim osobama, firmama ili događajima je slučajna. Priče mogu biti inspirisane opštim temama iz javnih vesti, ali su potpuno prilagođene izmišljenom svetu.' },
          { p: 'Sajt je namenjen odraslima i mladima od 16 godina naviše.' },
        ],
      },
      {
        h: 'Nije savet',
        blocks: [
          { p: 'Sadržaj je zabava. Nije politička, medicinska, pravna, finansijska ni bilo koja druga stručna preporuka. Izbori u pričama nisu ocenjivanje čitaoca.' },
        ],
      },
      {
        h: 'Veštačka inteligencija',
        blocks: [{ p: 'Tekstovi i slike nastaju uz pomoć alata veštačke inteligencije, uz ljudski izbor, uređivanje i odobrenje.' }],
      },
      {
        h: 'Sadržaj „kakav jeste“',
        blocks: [
          { p: 'Sajt i priče nude se onakvi kakvi jesu, bez garancije tačnosti, dostupnosti ili odsustva grešaka. U meri dozvoljenoj zakonom ne odgovaramo za štetu nastalu korišćenjem sajta. Linkovi ka tuđim sajtovima su van naše kontrole.' },
        ],
      },
      {
        h: 'Autorska prava',
        blocks: [
          { p: '© {year} {operator}. Sadržaj sajta nije dozvoljeno kopirati, objavljivati ni koristiti za obuku modela bez pisane dozvole. Kratki citati sa jasnim navođenjem izvora i linkom ka sajtu su dozvoljeni.' },
        ],
      },
      {
        h: 'Kontakt',
        blocks: [{ p: 'Za prijave i pitanja pišite na {email}.' }],
      },
    ],
  },
};
