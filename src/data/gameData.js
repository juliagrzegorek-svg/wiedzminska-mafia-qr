// src/data/gameData.js

// Ścieżki do obrazów (public/assets/*)
export const IMG = {
  // BOHATEROWIE – .png
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
  fringilla: "/assets/heroes/fringilla.png",
  avallach: "/assets/heroes/avallach.png",

  // POTWORY – .png
  bruxa: "/assets/monsters/bruxa.png",
  strzyga: "/assets/monsters/strzyga.png",
  upior: "/assets/monsters/upior.png",
  wampir: "/assets/monsters/wampir.png",
  wilkolak: "/assets/monsters/wilkolak.png",
};

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
  // z mocami
  { id: "yennefer", name: "Yennefer", baseAbilityId: "yen-healer", gender: "f", image: IMG.yennefer },
  { id: "geralt", name: "Geralt", baseAbilityId: "geralt-seer", gender: "m", image: IMG.geralt },
  { id: "ciri", name: "Ciri", baseAbilityId: "ciri-seer", gender: "f", image: IMG.ciri },
  { id: "filippa", name: "Filippa Eilhart", baseAbilityId: "filippa-revive", gender: "f", image: IMG.filippa },
  { id: "jaskier", name: "Jaskier", baseAbilityId: "bard-cancel-vote", gender: "m", image: IMG.jaskier },
  { id: "zoltan", name: "Zoltan (Krasnolud)", baseAbilityId: "zoltan-shield-village", gender: "m", image: IMG.zoltan },
  { id: "nenneke", name: "Nenneke", baseAbilityId: "nenneke-antivamp", gender: "f", image: IMG.nenneke },
  { id: "emhyr", name: "Emhyr", baseAbilityId: "emhyr-pardon", gender: "m", image: IMG.emhyr },

  // obywatele (bez mocy)
  { id: "vernon", name: "Vernon", baseAbilityId: "citizen", gender: "m", image: IMG.vernon },
  { id: "keira", name: "Keira", baseAbilityId: "citizen", gender: "f", image: IMG.keira },
  { id: "margarita", name: "Margarita", baseAbilityId: "citizen", gender: "f", image: IMG.margarita },
  { id: "shani", name: "Shani", baseAbilityId: "citizen", gender: "f", image: IMG.shani },
  { id: "triss", name: "Triss", baseAbilityId: "citizen", gender: "f", image: IMG.triss },
  { id: "fringilla", name: "Fringilla", baseAbilityId: "citizen", gender: "f", image: IMG.fringilla },
  { id: "avallach", name: "Avallach", baseAbilityId: "citizen", gender: "m", image: IMG.avallach },
];

export const MONSTERS = [
  { id: "wampir", name: "Wampir", image: IMG.wampir, description: "PIERWSZEJ NOCY gryzie ofiarę — ta osoba umrze drugiej nocy (chyba że wyleczona)." },
  { id: "strzyga", name: "Strzyga", image: IMG.strzyga, description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "wilkolak", name: "Wilkołak", image: IMG.wilkolak, description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "bruxa", name: "Bruxa", image: IMG.bruxa, description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "upior", name: "Upiór", image: IMG.upior, description: "Nocą współdecyduje z potworami o ofierze." },
];

export const abilityById = Object.fromEntries(ABILITIES.map((a) => [a.id, a]));
