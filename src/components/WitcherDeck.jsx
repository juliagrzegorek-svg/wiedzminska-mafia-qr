// src/components/WitcherDeck.jsx
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Szepty Lasu — Wiedźmińska Mafia
 * Wersja: animacje premium + rejestracja gracza + losowanie wg płci
 * ---------------------------------------------------------------
 * ✅ Ekran startowy: imię i nazwisko + płeć (K/M)
 * ✅ Losowanie postaci zgodnie z płcią
 * ✅ Animacja: ręka chwyta prawy dolny róg rewersu → peel 3D → flip → przybliżenie
 * ✅ Tła: postacie (teal) / potwory (bordo)
 * ✅ Los 5 potworów (~5/15)
 * ✅ Zdolność przypisana do roli (bez eliksirów)
 */

const COLOR_TEAL = {
  bg: "radial-gradient(120% 100% at 20% 0%, rgba(120,180,190,0.18) 0%, rgba(8,26,29,0.8) 42%, rgba(5,14,16,0.95) 70%), linear-gradient(160deg, #16383F 0%, #0A0F10 70%)",
};
const COLOR_BORDO = {
  bg: "radial-gradient(120% 100% at 20% 0%, rgba(185,36,48,0.18) 0%, rgba(40,3,6,0.85) 42%, rgba(15,4,6,0.95) 70%), linear-gradient(160deg, #6F0F16 0%, #0C0304 70%)",
};

const ASSETS = {
  frame: "/assets/frame.png",
  back: "/assets/card-back.png",
  hand: "/assets/hand.png",
};

const FEMALE = [
  { id: "triss", name: "Triss Merigold", canonPower: "Ochrona", img: "/assets/characters/triss.png" },
  { id: "yennefer", name: "Yennefer z Vengerbergu", canonPower: "Uzdrowicielka", img: "/assets/characters/yennefer.png" },
  { id: "philippa", name: "Philippa Eilhart", canonPower: "Intryga", img: "/assets/characters/philippa.png" },
  { id: "ciri", name: "Ciri", canonPower: "Jasnowidz", img: "/assets/characters/ciri.png" },
  { id: "fringilla", name: "Fringilla Vigo", canonPower: "Klątwa", img: "/assets/characters/fringilla.png" },
  { id: "keira", name: "Keira Metz", canonPower: "Iluzja", img: "/assets/characters/keira.png" },
  { id: "margarita", name: "Margarita Laux-Antille", canonPower: "Błogosławieństwo", img: "/assets/characters/margarita.png" },
  { id: "shani", name: "Shani", canonPower: "Medyczka", img: "/assets/characters/shani.png" },
  { id: "nenneke", name: "Matka Nenneke", canonPower: "Błogosławieństwo", img: "/assets/characters/nenneke.png" },
];

const MALE = [
  { id: "emhyr", name: "Emhyr var Emreis", canonPower: "Dekret", img: "/assets/characters/emhyr.png" },
  { id: "geralt", name: "Geralt z Rivii", canonPower: "Łowca (Igni)", img: "/assets/characters/geralt.png" },
  { id: "vernon", name: "Vernon Roche", canonPower: "Tropiciel", img: "/assets/characters/vernon.png" },
  { id: "avallach", name: "Avallac'h", canonPower: "Przejścia", img: "/assets/characters/avallach.png" },
  { id: "zoltan", name: "Zoltan Chivay", canonPower: "Wabik", img: "/assets/characters/zoltan.png" },
  { id: "jaskier", name: "Jaskier", canonPower: "Urok", img: "/assets/characters/jaskier.png" },
];

const MONSTERS = [
  { id: "bruxa", name: "Bruxa", desc: "Wampirzyca o przerażającym skowycze.", img: "/assets/monsters/bruxa.png" },
  { id: "vampire", name: "Wampir", desc: "Elegancka groza nocy.", img: "/assets/monsters/vampire.png" },
  { id: "werewolf", name: "Wilkołak", desc: "Księżycowy szał i pazury.", img: "/assets/monsters/werewolf.png" },
  { id: "striga", name: "Strzyga", desc: "Przeklęta moc i nienasycony głód.", img: "/assets/monsters/striga.png" },
  { id: "wraith", name: "Upiór", desc: "Echo krzywd i niedokończonych spraw.", img: "/assets/monsters/wraith.png" },
];

function mulberry32(a){return function(){let t=(a+=0x6d2b79f5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}}
function pickRand(rng, arr){return arr[Math.floor(rng()*arr.length)];}

export default function WitcherDeck() {
  const [phase, setPhase] = useState("register");
  const [player, setPlayer] = useState({ name: "", gender: "F" });

  const [seed] = useState(() => Math.floor((Date.now() / (1000 * 60)) % 100000));
  const rng = useMemo(() => mulberry32(seed), [seed]);

  const [assignedCharacter, setAssignedCharacter] = useState(null);
  const [monsterAssigned, setMonsterAssigned] = useState(null);

  const playerIsMonster = useMemo(() => {
    const hash = [...(player.name || "?")].reduce((a, c) => a + c.charCodeAt(0), 0);
    const localRng = mulberry32(seed + hash);
    return localRng() < 5 / 15; // ≈5/15
  }, [player.name, seed]);

  const startDeal = () => {
    const pool = player.gender === "M" ? MALE : FEMALE;
    const char = pickRand(rng, pool);
    setAssignedCharacter(char);
    setPhase("char-reveal");
  };

  const placeCharacter  = () => setPhase("char-placed");
  const revealMonster   = () => { if (playerIsMonster) setMonsterAssigned(pickRand(rng, MONSTERS)); setPhase("monster-reveal"); setTimeout(()=>setPhase("monster-placed"),1200); };
  const revealAbility   = () => { setPhase("ability-reveal"); setTimeout(()=>setPhase("done"),1200); };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Header seed={seed} />

        {phase === "register" && <Register onSubmit={(p)=>{setPlayer(p); startDeal();}} />}

        {phase !== "register" && (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <StepCard title="1) Twoja Postać" active={phase==="char-reveal"} done={phase!=="char-reveal"&&phase!=="register"}>
              {phase==="char-reveal" ? (
                <RevealSequence
                  type="character"
                  card={{
                    title: assignedCharacter?.name,
                    subtitle: `Pierwotna moc: ${assignedCharacter?.canonPower || "—"}`,
                    img: assignedCharacter?.img,
                  }}
                  onPlaced={placeCharacter}
                />
              ) : (
                <Placed type="character" title={assignedCharacter?.name} subtitle={`Pierwotna moc: ${assignedCharacter?.canonPower || "—"}`} img={assignedCharacter?.img}/>
              )}
            </StepCard>

            <StepCard title="2) Czy jesteś potworem?" active={phase==="monster-reveal"} done={["monster-placed","ability-reveal","done"].includes(phase)}>
              {phase==="char-placed" && (
                <button onClick={revealMonster} className="w-full rounded-xl border border-emerald-600/60 bg-emerald-600/15 px-4 py-2 text-sm hover:bg-emerald-600/25">Losuj</button>
              )}
              {phase==="monster-reveal" && (
                playerIsMonster ? (
                  <RevealSequence type="monster" card={{ title: monsterAssigned?.name, subtitle: monsterAssigned?.desc, img: monsterAssigned?.img }} onPlaced={()=>setPhase("monster-placed")} />
                ) : <Info text="Nie wylosowano potwora." />
              )}
              {phase!=="monster-reveal" && phase!=="char-placed" && phase!=="register" && !playerIsMonster && <Info text="Brak karty potwora" />}
              {playerIsMonster && phase!=="monster-reveal" && phase!=="char-placed" && (
                <Placed type="monster" title={monsterAssigned?.name} subtitle={monsterAssigned?.desc} img={monsterAssigned?.img}/>
              )}
            </StepCard>

            <StepCard title="3) Twoja zdolność" active={phase==="ability-reveal"} done={phase==="done"}>
              {phase==="monster-placed" && (
                <button onClick={revealAbility} className="w-full rounded-xl border border-amber-500/60 bg-amber-500/15 px-4 py-2 text-sm hover:bg-amber-500/25">Pokaż</button>
              )}
              {phase==="ability-reveal" && (
                <RevealSequence
                  type={playerIsMonster ? "monster" : "character"}
                  card={{
                    title: playerIsMonster ? `Moc potwora: ${monsterAssigned?.name}` : `Zdolność: ${assignedCharacter?.canonPower || "—"}`,
                    subtitle: playerIsMonster ? (monsterAssigned?.desc || "") : `Zdolność przypisana do roli ${assignedCharacter?.name}`,
                    img: playerIsMonster ? monsterAssigned?.img : assignedCharacter?.img,
                  }}
                  onPlaced={()=>setPhase("done")}
                />
              )}
              {phase==="done" && (
                <Placed
                  type={playerIsMonster ? "monster" : "character"}
                  title={playerIsMonster ? `Moc potwora: ${monsterAssigned?.name}` : `Zdolność: ${assignedCharacter?.canonPower || "—"}`}
                  subtitle={playerIsMonster ? (monsterAssigned?.desc || "") : `Zdolność przypisana do roli ${assignedCharacter?.name}`}
                  img={playerIsMonster ? monsterAssigned?.img : assignedCharacter?.img}
                />
              )}
            </StepCard>
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ seed }){
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">Szepty Lasu — Wiedźmińska Mafia</h1>
      <div className="text-xs text-neutral-400">seed sesji: {seed}</div>
    </header>
  );
}

function Register({ onSubmit }){
  const [name,setName]=useState("");
  const [gender,setGender]=useState("F");
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <div className="mb-3 text-sm text-neutral-300">Podaj dane, żeby wylosować postać.</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span>Imię i nazwisko</span>
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="np. Julia G."
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none focus:border-neutral-500"/>
          </label>
          <div className="grid gap-1 text-sm">
            <span>Płeć</span>
            <div className="flex gap-2">
              <button onClick={()=>setGender("F")} className={`flex-1 rounded-lg px-3 py-2 border ${gender==="F"?"border-emerald-600/60 bg-emerald-600/15":"border-neutral-700 bg-neutral-800"}`}>Kobieta</button>
              <button onClick={()=>setGender("M")} className={`flex-1 rounded-lg px-3 py-2 border ${gender==="M"?"border-emerald-600/60 bg-emerald-600/15":"border-neutral-700 bg-neutral-800"}`}>Mężczyzna</button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={()=> name.trim() && onSubmit({ name: name.trim(), gender })}
            className="w-full rounded-xl border border-emerald-600/60 bg-emerald-600/15 px-4 py-2 text-sm hover:bg-emerald-600/25">
            Rozdaj kartę
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-300">
        <div className="font-medium mb-2">Jak to działa?</div>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Podajesz imię i wybierasz płeć.</li>
          <li>System losuje bohatera z odpowiedniej puli.</li>
          <li>Potem (dla ~5/15) losuje się karta potwora.</li>
          <li>Na końcu — pokazujemy Twoją zdolność przypisaną do roli.</li>
        </ol>
      </div>
    </div>
  );
}

function RevealSequence({ type, card, onPlaced }){
  const conf = useMemo(()=>({ bg: type==="monster" ? COLOR_BORDO.bg : COLOR_TEAL.bg }),[type]);
  const [step,setStep]=useState(1);
  useEffect(()=>{
    const t1=setTimeout(()=>setStep(2),350);
    const t2=setTimeout(()=>setStep(3),850);
    const t3=setTimeout(()=>setStep(4),1350);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  },[]);
  return (
    <div className="relative grid place-items-center">
      <div className="relative h-[420px] w-[280px]">
        <motion.div className="absolute inset-0"
          initial={{x:60,y:60,rotate:8,scale:0.9,opacity:0}}
          animate={{x:0,y:0,rotate:0,scale:1,opacity:1,transition:{type:"spring",stiffness:140,damping:16}}}>
          <AnimatePresence initial={false} mode="wait">
            {step<4 ? (
              <motion.div key="back" className="absolute inset-0" style={{transformOrigin:"100% 100%"}}
                animate={step===3?{rotateX:22,rotateZ:-2,y:-6,x:-8,boxShadow:"0 20px 40px rgba(0,0,0,0.6)"}:{rotateX:0,rotateZ:0,y:0,x:0}}
                transition={{type:"spring",stiffness:120,damping:14}}>
                <CardBack/>
              </motion.div>
            ) : (
              <motion.div key="front" className="absolute inset-0" style={{transformOrigin:"100% 100%"}}
                initial={{rotateY:-180,scale:0.96}}
                animate={{rotateY:0,scale:1,transition:{type:"spring",stiffness:160,damping:18}}}>
                <CardFront background={conf.bg} title={card.title} subtitle={card.subtitle} img={card.img}/>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {step<=3 && (
            <motion.img alt="hand" src={ASSETS.hand}
              className="pointer-events-none absolute -bottom-12 -right-10 h-44 w-auto"
              initial={{opacity:0,x:80,y:40,rotate:-10}}
              animate={{opacity:1,x:0,y:0,rotate:0,transition:{type:"spring",stiffness:120,damping:14}}}
              exit={{opacity:0,y:10}}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3">
        <button onClick={onPlaced} className="rounded-lg border border-neutral-700 bg-neutral-800/70 px-3 py-1.5 text-xs hover:bg-neutral-700">
          Odłóż na stół
        </button>
      </div>
    </div>
  );
}

function Placed({ type, title, subtitle, img }){
  const background = type==="monster" ? COLOR_BORDO.bg : COLOR_TEAL.bg;
  return (
    <div className="grid place-items-center">
      <motion.div className="relative h-[360px] w-[240px]"
        initial={{y:-8,rotate:-2,scale:0.98}}
        animate={{y:0,rotate:0,scale:1,transition:{type:"spring",stiffness:140,damping:16}}}>
        <CardFront background={background} title={title} subtitle={subtitle} img={img}/>
      </motion.div>
    </div>
  );
}

function CardBack(){
  return (
    <div className="relative h-full w-full rounded-[22px] overflow-hidden" style={{boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.06), 0 10px 26px rgba(0,0,0,0.6)"}}>
      <img src={ASSETS.back} alt="back" className="absolute inset-0 h-full w-full object-cover"/>
    </div>
  );
}

function CardFront({ background, title, subtitle, img }){
  return (
    <div className="relative h-full w-full rounded-[22px] overflow-hidden"
      style={{boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.06), 0 10px 26px rgba(0,0,0,0.6)", backgroundImage: background}}>
      <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-screen"
        style={{backgroundImage:"radial-gradient(40% 25% at 70% 0%, rgba(255,200,120,0.15), transparent 60%), radial-gradient(30% 20% at 20% 80%, rgba(255,160,100,0.12), transparent 60%)"}}/>
      {img ? (
        <img src={img} alt={title} className="absolute left-[14px] right-[14px] top-[14px] h-[62%] w-[calc(100%-28px)] rounded-[14px] object-cover object-center"/>
      ) : (
        <div className="absolute left-[14px] right-[14px] top-[14px] h-[62%] rounded-[14px] grid place-items-center text-neutral-300/70">
          <div className="text-center text-xs">(Dodaj /assets/...)</div>
        </div>
      )}
      <img src={ASSETS.frame} alt="frame" className="pointer-events-none absolute inset-0 h-full w-full object-cover"/>
      <div className="absolute bottom-20 left-0 right-0 px-4">
        <div className="text-center text-[15px] font-semibold tracking-[0.04em] drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">{title}</div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="text-center text-[12px] leading-snug text-neutral-200/90">{subtitle}</div>
      </div>
    </div>
  );
}

function StepCard({ title, active, done, children }){
  return (
    <div className={`rounded-2xl border p-4 ${done ? "border-emerald-600/60 bg-emerald-600/10" : active ? "border-amber-500/60 bg-amber-500/10" : "border-neutral-800 bg-neutral-900/40"}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <div className="text-xs uppercase tracking-wider">{done ? "Gotowe" : active ? "Aktywne" : "Czeka"}</div>
      </div>
      {children}
    </div>
  );
}

function Info({ text }){ return <div className="text-xs text-neutral-400">{text}</div>; }
