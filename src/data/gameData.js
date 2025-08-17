// src/data/gameData.js

// ŚCIEŻKI – masz PNG w public/assets/...
export const IMG = {
  // bohaterowie
  yennefer: "/assets/heroes/yennefer.png",
  geralt: "/assets/heroes/geralt.png",
  ciri: "/assets/heroes/ciri.png",
  filippa: "/assets/heroes/filippa.png",
  jaskier: "/assets/heroes/jaskier.png",
  zoltan: "/assets/heroes/zoltan.png",
  nenneke: "/assets/heroes/nenneke.png",
  emhyr: "/assets/heroes/emhyr.png",
  vernon: "/assets/heroes/vernon.png",
  keira: "/assets/heroes/keira.png",
  margarita: "/assets/heroes/margarita.png",
  shani: "/assets/heroes/shani.png",
  triss: "/assets/heroes/triss.png",

  // potwory
  vampire: "/assets/monsters/wampir.png",
  strzyga: "/assets/monsters/strzyga.png",
  werewolf: "/assets/monsters/wilkolak.png",
  bruxa: "/assets/monsters/bruxa.png",
  upior: "/assets/monsters/upior.png",
};

// kanoniczne moce
export const ABILITIES = [
  {
    id: "yen-healer",
    title: "Yennefer — Uzdrowicielka",
    description:
      "KAŻDEJ NOCY budzisz się PRZED mafią i wskazujesz osobę do ochrony. Jeśli zostanie zaatakowana, atak nie dochodzi do skutku. Możesz uratować SIEBIE i przetrwać noc.",
  },
  {
    id: "geralt-seer",
    title: "Geralt — Jasnowidz",
    description:
      "NOCĄ budzisz się NAPRZEMIENNIE z Ciri. W swojej turze wskazujesz gracza, a Mistrz Gry pokazuje jego frakcję (mieszczanin/potwór). Zdobyta wiedza służy w dzień.",
  },
  {
    id: "ciri-seer",
    title: "Ciri — Jasnowidzka",
    description:
      "NOCĄ budzisz się NAPRZEMIENNIE z Geraltem. W swojej turze wskazujesz gracza, a Mistrz Gry pokazuje jego frakcję (mieszczanin/potwór). Wiedzę wykorzystujesz w dzień.",
  },
  {
    id: "filippa-revive",
    title: "Filippa Eilhart — Wskrzeszenie",
    description:
      "RAZ NA GRĘ, w DZIEŃ: możesz się ujawnić i wskrzesić jedną wyeliminowaną osobę. Wraca natychmiast do gry.",
  },
  {
    id: "bard-cancel-vote",
    title: "Jaskier — Ballada",
    description:
      "RAZ NA GRĘ: możesz zaśpiewać balladę — głosowanie w ciągu dnia zostaje ANULOWANE.",
  },
  {
    id: "zoltan-shield-village",
    title: "Zoltan — Tarcza Wioski",
    description:
      "RAZ NA GRĘ: chronisz CAŁĄ wioskę na jedną noc. Atak potworów tej nocy NIE dochodzi do skutku.",
  },
  {
    id: "nenneke-antivamp",
    title: "Nenneke — Uleczenie Ugryzienia",
    description:
      "PIERWSZEJ NOCY: wybierasz jedną osobę; jeśli została ugryziona przez Wampira, LECZYSZ ugryzienie (nie umrze następnej nocy).",
  },
  {
    id: "emhyr-pardon",
    title: "Emhyr — Łaska Cesarza",
    description:
      "RAZ NA GRĘ: możesz uratować wybraną osobę z egzekucji po głosowaniu ludu (anulujesz egzekucję).",
  },
  {
    id: "citizen",
    title: "Obywatel",
    description:
      "Brak mocy specjalnej. Cel: przetrwać i pomóc wiosce pokonać potwory.",
  },
];

// BOHATEROWIE (z płcią)
export const HEROES = [
  // kobiety
  { id: "yennefer", gender: "K", name: "Yennefer",     baseAbilityId: "yen-healer",       image: IMG.yennefer },
  { id: "ciri",     gender: "K", name: "Ciri",         baseAbilityId: "ciri-seer",        image: IMG.ciri },
  { id: "filippa",  gender: "K", name: "Filippa",      baseAbilityId: "filippa-revive",   image: IMG.filippa },
  { id: "nenneke",  gender: "K", name: "Nenneke",      baseAbilityId: "nenneke-antivamp", image: IMG.nenneke },
  { id: "triss",    gender: "K", name: "Triss",        baseAbilityId: "citizen",          image: IMG.triss },
  { id: "keira",    gender: "K", name: "Keira",        baseAbilityId: "citizen",          image: IMG.keira },
  { id: "margarita",gender: "K", name: "Margarita",    baseAbilityId: "citizen",          image: IMG.margarita },
  { id: "shani",    gender: "K", name: "Shani",        baseAbilityId: "citizen",          image: IMG.shani },

  // mężczyźni
  { id: "geralt",   gender: "M", name: "Geralt",       baseAbilityId: "geralt-seer",      image: IMG.geralt },
  { id: "jaskier",  gender: "M", name: "Jaskier",      baseAbilityId: "bard-cancel-vote", image: IMG.jaskier },
  { id: "zoltan",   gender: "M", name: "Zoltan",       baseAbilityId: "zoltan-shield-village", image: IMG.zoltan },
  { id: "emhyr",    gender: "M", name: "Emhyr",        baseAbilityId: "emhyr-pardon",     image: IMG.emhyr },
  { id: "vernon",   gender: "M", name: "Vernon",       baseAbilityId: "citizen",          image: IMG.vernon },
];

export const MONSTERS = [
  { id: "vampire", name: "Wampir",   image: IMG.vampire, description: "Założyciel Mrocznego Kręgu. PIERWSZEJ NOCY gryzie ofiarę — umrze DRUGIEJ NOCY (chyba że wyleczona)." },
  { id: "strzyga", name: "Strzyga",  image: IMG.strzyga, description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "werewolf",name: "Wilkołak", image: IMG.werewolf,description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "bruxa",   name: "Bruxa",    image: IMG.bruxa,   description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "upior",   name: "Upiór",    image: IMG.upior,   description: "Nocą współdecyduje z potworami o ofierze." },
];

export const abilityById = Object.fromEntries(ABILITIES.map(a => [a.id, a]));
