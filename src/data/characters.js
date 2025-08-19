import { CHAR_IMG } from '../assetsMap.js';

export const CHARACTERS = [
  { id:'yennefer',  name:'Yennefer',        sex:'K', role:'Bohaterka', what:'Uzdrowicielka',  img:CHAR_IMG.yennefer,  abilityKey:'yen-healer' },
  { id:'ciri',      name:'Ciri',            sex:'K', role:'Bohaterka', what:'Jasnowidzka',    img:CHAR_IMG.ciri,      abilityKey:'ciri-seer' },
  { id:'keira',     name:'Keira Metz',      sex:'K', role:'Bohaterka', what:'Czarodziejka',   img:CHAR_IMG.keira,     abilityKey:'citizen' },
  { id:'filippa',   name:'Filippa Eilhart', sex:'K', role:'Bohaterka', what:'Magini',         img:CHAR_IMG.filippa,   abilityKey:'filippa-revive' },
  { id:'margarita', name:'Margarita Laux-Antille', sex:'K', role:'Bohaterka', what:'Czarodziejka', img:CHAR_IMG.margarita, abilityKey:'citizen' },
  { id:'nenneke',   name:'Nenneke',         sex:'K', role:'Bohaterka', what:'Kapłanka',       img:CHAR_IMG.nenneke,   abilityKey:'nenneke-antivamp' },
  { id:'triss',     name:'Triss Merigold',  sex:'K', role:'Bohaterka', what:'Czarodziejka',   img:CHAR_IMG.triss,     abilityKey:'citizen' },
  { id:'shani',     name:'Shani',           sex:'K', role:'Bohaterka', what:'Lekarka',        img:CHAR_IMG.shani,     abilityKey:'citizen' },
  { id:'fringilla', name:'Fringilla Vigo',  sex:'K', role:'Bohaterka', what:'Czarodziejka',   img:CHAR_IMG.fringilla, abilityKey:'citizen' },

  { id:'geralt',    name:'Geralt',          sex:'M', role:'Bohater',   what:'Jasnowidz',      img:CHAR_IMG.geralt,    abilityKey:'geralt-seer' },
  { id:'jaskier',   name:'Jaskier',         sex:'M', role:'Bohater',   what:'Bard',           img:CHAR_IMG.jaskier,   abilityKey:'bard-cancel-vote' },
  { id:'zoltan',    name:'Zoltan',          sex:'M', role:'Bohater',   what:'Wojownik',       img:CHAR_IMG.zoltan,    abilityKey:'zoltan-shield-village' },
  { id:'emhyr',     name:'Emhyr',           sex:'M', role:'Bohater',   what:'Cesarz',         img:CHAR_IMG.emhyr,     abilityKey:'emhyr-pardon' },
  { id:'vernon',    name:'Vernon Roche',    sex:'M', role:'Bohater',   what:'Żołnierz',       img:CHAR_IMG.vernon,    abilityKey:'citizen' },
  { id:'avallach',  name:"Avallac’h",       sex:'M', role:'Bohater',   what:'Mędrzec',        img:CHAR_IMG.avallach,  abilityKey:'citizen' },
];
