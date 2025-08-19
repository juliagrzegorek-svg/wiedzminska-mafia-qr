// src/data/monsters.js
// Potwory – z PIERWOTNYMI zdolnościami i obrazkami
// ZASADA: zdolności potworów SIĘ NIE MIESZAJĄ – każdy dostaje swoją.

export const MONSTERS = [
  {
    id: "strzyga",
    name: "Strzyga",
    role: "Potwór",
    what: "Ugryzienie",
    img: "/assets/monsters/strzyga.png",
    baseAbilityId: "strzyga-bite",
    baseAbilityTitle: "Strzyga — Ugryzienie",
  },
  {
    id: "upior",
    name: "Upiór",
    role: "Potwór",
    what: "Klątwa",
    img: "/assets/monsters/upior.png",
    baseAbilityId: "upior-curse",
    baseAbilityTitle: "Upiór — Klątwa",
  },
  {
    id: "wilkolak",
    name: "Wilkołak",
    role: "Potwór",
    what: "Polowanie",
    img: "/assets/monsters/wilkolak.png",
    baseAbilityId: "wilkolak-hunt",
    baseAbilityTitle: "Wilkołak — Polowanie",
  },
  {
    id: "wampir",
    name: "Wampir",
    role: "Potwór",
    what: "Wysysanie",
    img: "/assets/monsters/wampir.png",
    baseAbilityId: "wampir-drain",
    baseAbilityTitle: "Wampir — Wysysanie",
  },
  {
    id: "bruxa",
    name: "Bruxa",
    role: "Potwór",
    what: "Krzyk",
    img: "/assets/monsters/bruxa.png",
    baseAbilityId: "bruxa-song",
    baseAbilityTitle: "Bruxa — Krzyk",
  },
];
