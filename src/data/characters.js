export const CHARACTERS = [
  // KOBIETY
  { id:'yen', name:'Yennefer', sex:'K', role:'Bohaterka', what:'Uzdrowicielka', img:'/characters/yen.jpg', abilityKey:'yen-healer' },
  { id:'ciri', name:'Ciri', sex:'K', role:'Bohaterka', what:'Jasnowidzka', img:'/characters/ciri.jpg', abilityKey:'ciri-seer' },
  { id:'keira', name:'Keira Metz', sex:'K', role:'Bohaterka', what:'Czarodziejka', img:'/characters/keira.jpg', abilityKey:'citizen' },
  { id:'filippa', name:'Filippa Eilhart', sex:'K', role:'Bohaterka', what:'Magini', img:'/characters/filippa.jpg', abilityKey:'filippa-revive' },
  { id:'margarita', name:'Margarita Laux-Antille', sex:'K', role:'Bohaterka', what:'Czarodziejka', img:'/characters/margarita.jpg', abilityKey:'citizen' },
  { id:'nenneke', name:'Nenneke', sex:'K', role:'Bohaterka', what:'Kapłanka', img:'/characters/nenneke.jpg', abilityKey:'nenneke-antivamp' },
  { id:'milva', name:'Milva', sex:'K', role:'Bohaterka', what:'Łowczyni', img:'/characters/milva.jpg', abilityKey:'citizen' },

  // MĘŻCZYŹNI
  { id:'geralt', name:'Geralt', sex:'M', role:'Bohater', what:'Jasnowidz', img:'/characters/geralt.jpg', abilityKey:'geralt-seer' },
  { id:'dandelion', name:'Jaskier', sex:'M', role:'Bohater', what:'Bard', img:'/characters/jaskier.jpg', abilityKey:'bard-cancel-vote' },
  { id:'zoltan', name:'Zoltan', sex:'M', role:'Bohater', what:'Wojownik', img:'/characters/zoltan.jpg', abilityKey:'zoltan-shield-village' },
  { id:'emhyr', name:'Emhyr', sex:'M', role:'Bohater', what:'Cesarz', img:'/characters/emhyr.jpg', abilityKey:'emhyr-pardon' },
  { id:'vernon', name:'Vernon Roche', sex:'M', role:'Bohater', what:'Żołnierz', img:'/characters/vernon.jpg', abilityKey:'citizen' },
  { id:'avallach', name:'Avallac’h', sex:'M', role:'Bohater', what:'Mędrzec', img:'/characters/avallach.jpg', abilityKey:'citizen' },
  { id:'fringilla', name:'Fringilla Vigo', sex:'K', role:'Bohaterka', what:'Czarodziejka', img:'/characters/fringilla.jpg', abilityKey:'citizen' },

  // DODATKOWY OBYWATEL (bez mocy) — żeby było 15
  { id:'citizen1', name:'Mieszczanin', sex:'M', role:'Bohater', what:'Obywatel', img:'/characters/citizen.jpg', abilityKey:'citizen' },
].slice(0,15)
