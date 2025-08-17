// src/data/gameData.js

// ŚCIEŻKI DO OBRAZKÓW Z FOLDERU public/ (WSZYSTKO .png)
export const IMG = {
  // BOHATEROWIE
  yennefer:  "/assets/heroes/yennefer.png",
  geralt:    "/assets/heroes/geralt.png",
  ciri:      "/assets/heroes/ciri.png",
  filippa:   "/assets/heroes/filippa.png",
  jaskier:   "/assets/heroes/jaskier.png",
  zoltan:    "/assets/heroes/zoltan.png",
  nenneke:   "/assets/heroes/nenneke.png",
  emhyr:     "/assets/heroes/emhyr.png",
  vernon:    "/assets/heroes/vernon.png",
  keira:     "/assets/heroes/keira.png",
  margarita: "/assets/heroes/margarita.png",
  shani:     "/assets/heroes/shani.png",
  triss:     "/assets/heroes/triss.png",
  avallach:  "/assets/heroes/avallach.png",
  fringilla: "/assets/heroes/fringilla.png",

  // POTWORY (nazwy dostosuj do plików w /public/assets/monsters)
  vampire:   "/assets/monsters/wampir.png",
  strzyga:   "/assets/monsters/strzyga.png",
  werewolf:  "/assets/monsters/wilkolak.png",
  bruxa:     "/assets/monsters/bruxa.png",
  upior:     "/assets/monsters/upior.png",
};

// ZDOLNOŚCI
export const ABILITIES = [
  {
    id: "yen-doctor",
    title: "Yennefer — Uzdrowicielka",
    description:
      "KAŻDEJ NOCY — budzisz się PRZED mafią i wskazujesz jedną osobę do ochrony. Jeśli zostanie zaatakowana, atak nie dochodzi do skutku. Możesz uratować SIEBIE i przetrwać noc.",
  },
  {
    id: "seer",
    title: "Geralt/Ciri — Jasnowidz(owie)",
    description:
      "KAŻDEJ NOCY — budzisz się PIERWSZY/A (lub naprzemiennie) i poznajesz frakcję wybranego gracza (mieszczanin/potwór). Wiedzę wykorzystujesz w dzień.",
  },
  {
    id: "filippa-revive",
    title: "Filippa Eilhart — Wskrzeszenie",
    description:
      "RAZ NA GRĘ — w DZIEŃ możesz ujawnić się i wskrzesić jedną wyeliminowaną osobę. Wraca do gry natychmiast.",
  },
  {
    id: "bard-cancel-vote",
    title: "Jaskier — Ballada",
    description:
      "RAZ NA GRĘ — możesz zaśpiewać balladę: głosowanie w ciągu dnia zostaje ANULOWANE.",
  },
  {
    id: "zoltan-shield-village",
    title: "Zoltan — Tarcza Wioski",
    description:
      "RAZ NA GRĘ — chronisz CAŁĄ wioskę na jedną noc. Atak potworów tej nocy NIE dochodzi do skutku.",
  },
  {
    id: "nenneke-antivamp",
    title: "Nenneke — Uleczenie Ugryzienia",
    description:
      "PIERWSZEJ NOCY — wybierasz jedną osobę; jeśli została ugryziona przez Wampira, LECZYSZ ugryzienie (nie umrze następnej nocy).",
  },
  {
    id: "emhyr-governor",
    title: "Emhyr — Łaska Cesarza",
    description:
      "RAZ NA GRĘ — możesz uratować wybraną osobę z egzekucji po głosowaniu ludu (anulujesz egzekucję).",
  },
  { id: "citizen", title: "Obywatel", description: "Brak mocy specjalnej. Cel: przetrwać i pomóc wiosce pokonać potwory." },
];

// BOHATEROWIE (zgodnie z Twoim podziałem K / M, same ścieżki .png)
export const HEROES = [
  { id: "yennefer",  name: "Yennefer",           baseAbilityId: "yen-doctor",          image: IMG.yennefer },
  { id: "ciri",      name: "Ciri",               baseAbilityId: "seer",                 image: IMG.ciri },
  { id: "filippa",   name: "Filippa Eilhart",    baseAbilityId: "filippa-revive",       image: IMG.filippa },
  { id: "margarita", name: "Margarita",          baseAbilityId: "citizen",              image: IMG.margarita },
  { id: "shani",     name: "Shani",              baseAbilityId: "citizen",              image: IMG.shani },
  { id: "triss",     name: "Triss",              baseAbilityId: "citizen",              image: IMG.triss },
  { id: "keira",     name: "Keira",              baseAbilityId: "citizen",              image: IMG.keira },
  { id: "fringilla", name: "Fringilla",          baseAbilityId: "citizen",              image: IMG.fringilla },

  { id: "geralt",    name: "Geralt",             baseAbilityId: "seer",                 image: IMG.geralt },
  { id: "jaskier",   name: "Jaskier",            baseAbilityId: "bard-cancel-vote",     image: IMG.jaskier },
  { id: "emhyr",     name: "Emhyr",              baseAbilityId: "emhyr-governor",       image: IMG.emhyr },
  { id: "zoltan",    name: "Zoltan (Krasnolud)", baseAbilityId: "zoltan-shield-village", image: IMG.zoltan },
  { id: "vernon",    name: "Vernon",             baseAbilityId: "citizen",              image: IMG.vernon },
  { id: "avallach",  name: "Avallach",           baseAbilityId: "citizen",              image: IMG.avallach },
];

// POTWORY (też .png)
export const MONSTERS = [
  { id: "vampire",  name: "Wampir",   image: IMG.vampire,  description: "Założyciel Mrocznego Kręgu. PIERWSZEJ NOCY gryzie ofiarę — ta osoba UMRZE drugiej nocy (chyba że wyleczona)." },
  { id: "strzyga",  name: "Strzyga",  image: IMG.strzyga,  description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "werewolf", name: "Wilkołak", image: IMG.werewolf, description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "bruxa",    name: "Bruxa",    image: IMG.bruxa,    description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "upior",    name: "Upiór",    image: IMG.upior,    description: "Nocą współdecyduje z potworami o ofierze." },
];

export const abilityById = Object.fromEntries(ABILITIES.map(a => [a.id, a]));
