// src/data/gameData.js

// Ścieżki do obrazków z folderu public/
export const IMG = {
  // BOHATEROWIE
  yennefer: "/assets/heroes/yennefer.webp",
  geralt: "/assets/heroes/geralt.webp",
  ciri: "/assets/heroes/ciri.webp",
  filippa: "/assets/heroes/filippa.webp",
  jaskier: "/assets/heroes/jaskier.webp",
  zoltan: "/assets/heroes/zoltan.webp",
  nenneke: "/assets/heroes/nenneke.webp",
  emhyr: "/assets/heroes/emhyr.webp",
  // obywatele (bez mocy)
  vernon: "/assets/heroes/vernon.webp",
  keira: "/assets/heroes/keira.webp",
  margarita: "/assets/heroes/margarita.webp",
  shani: "/assets/heroes/shani.webp",
  triss: "/assets/heroes/triss.webp",

  // POTWORY
  vampire: "/assets/monsters/vampire.webp",
  strzyga: "/assets/monsters/strzyga.webp",
  werewolf: "/assets/monsters/werewolf.webp",
  bruxa: "/assets/monsters/bruxa.webp",
  upior: "/assets/monsters/upior.webp",
};

export const ABILITIES = [
  { id: "yen-doctor", title: "Yennefer — Uzdrowicielka", description: "KAŻDEJ NOCY — budzisz się PRZED mafią i wskazujesz jedną osobę do ochrony. Jeśli zostanie zaatakowana, atak nie dochodzi do skutku. Możesz uratować SIEBIE i przetrwać noc." },
  { id: "seer", title: "Geralt/Ciri — Jasnowidz(owie)", description: "KAŻDEJ NOCY — budzisz się PIERWSZY/A (lub naprzemiennie) i poznajesz frakcję wybranego gracza (mieszczanin/potwór). Wiedzę wykorzystujesz w dzień." },
  { id: "filippa-revive", title: "Filippa Eilhart — Wskrzeszenie", description: "RAZ NA GRĘ — w DZIEŃ możesz ujawnić się i wskrzesić jedną wyeliminowaną osobę. Wraca do gry natychmiast." },
  { id: "bard-cancel-vote", title: "Jaskier — Ballada", description: "RAZ NA GRĘ — możesz zaśpiewać balladę: głosowanie w ciągu dnia zostaje ANULOWANE." },
  { id: "zoltan-shield-village", title: "Zoltan — Tarcza Wioski", description: "RAZ NA GRĘ — chronisz CAŁĄ wioskę na jedną noc. Atak potworów tej nocy NIE dochodzi do skutku." },
  { id: "nenneke-antivamp", title: "Nenneke — Uleczenie Ugryzienia", description: "PIERWSZEJ NOCY — wybierasz jedną osobę; jeśli została ugryziona przez Wampira, LECZYSZ ugryzienie (nie umrze następnej nocy)." },
  { id: "emhyr-governor", title: "Emhyr — Łaska Cesarza", description: "RAZ NA GRĘ — możesz uratować wybraną osobę z egzekucji po głosowaniu ludu (anulujesz egzekucję)." },
  { id: "citizen", title: "Obywatel", description: "Brak mocy specjalnej. Cel: przetrwać i pomóc wiosce pokonać potwory." },
];

// BOHATEROWIE: tylko wskazani poniżej są obywatelami (bez mocy)
export const HEROES = [
  // Specjalne moce
  { id: "yennefer", name: "Yennefer", baseAbilityId: "yen-doctor", image: IMG.yennefer },
  { id: "geralt", name: "Geralt", baseAbilityId: "seer", image: IMG.geralt },
  { id: "ciri", name: "Ciri", baseAbilityId: "seer", image: IMG.ciri },
  { id: "filippa", name: "Filippa Eilhart", baseAbilityId: "filippa-revive", image: IMG.filippa },
  { id: "jaskier", name: "Jaskier (Bard)", baseAbilityId: "bard-cancel-vote", image: IMG.jaskier },
  { id: "zoltan", name: "Zoltan (Krasnolud)", baseAbilityId: "zoltan-shield-village", image: IMG.zoltan },
  { id: "nenneke", name: "Nenneke", baseAbilityId: "nenneke-antivamp", image: IMG.nenneke },
  { id: "emhyr", name: "Emhyr", baseAbilityId: "emhyr-governor", image: IMG.emhyr },

  // Obywatele (bez mocy) — tylko te osoby:
  { id: "vernon",   name: "Vernon",   baseAbilityId: "citizen", image: IMG.vernon },
  { id: "keira",    name: "Keira",    baseAbilityId: "citizen", image: IMG.keira },
  { id: "margarita",name: "Margarita",baseAbilityId: "citizen", image: IMG.margarita },
  { id: "shani",    name: "Shani",    baseAbilityId: "citizen", image: IMG.shani },
  { id: "triss",    name: "Triss",    baseAbilityId: "citizen", image: IMG.triss },
];

export const MONSTERS = [
  { id: "vampire",  name: "Wampir",   image: IMG.vampire,  description: "Założyciel Mrocznego Kręgu. PIERWSZEJ NOCY dokonuje rytuału i gryzie ofiarę — ta osoba UMRZE drugiej nocy (chyba że wyleczona)." },
  { id: "strzyga",  name: "Strzyga",  image: IMG.strzyga,  description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "werewolf", name: "Wilkołak", image: IMG.werewolf, description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "bruxa",    name: "Bruxa",    image: IMG.bruxa,    description: "Nocą współdecyduje z potworami o ofierze." },
  { id: "upior",    name: "Upiór",    image: IMG.upior,    description: "Nocą współdecyduje z potworami o ofierze." },
];

export const abilityById = Object.fromEntries(ABILITIES.map((a) => [a.id, a]));
