import React, { useEffect, useMemo, useState } from "react";

/* ====================== Pagalbinės ====================== */
const todayStr = () => new Date().toISOString().slice(0, 10);
function useLS(key, init) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV];
}

const defaultGoals = {
  steps: 8000,
  waterMl: 1500,
  screenLimitMin: 120,
  sleepHours: 8,
};

const newDay = () => ({
  date: todayStr(),
  steps: 0,
  waterMl: 0,
  screenMin: 0,
  sleepHours: 0,
  focusSessions: [],
  points: 0,
  team: "IIIa",
});

/* ===== Aiškūs pasiūlymai vietoj ekranų ===== */
const IDEAS = [
  "Padaryk 100 žingsnių po klasę ar koridorių.",
  "Kvėpuok 4–7–8 metodu (3 kartus).",
  "Skirk 5 minutes tempimo pratimams.",
  "Išgerk stiklinę vandens ir padaryk 20 pritūpimų.",
  "Perskaityk 5 puslapius knygos.",
  "2 minutes varyk arba perduok kamuolį.",
  "Atlik 60 sąmoningų įkvėpimų ir iškvėpimų.",
  "Padaryk 10 atsispaudimų (gali būti į sieną).",
  "Per 2 minutes susitvarkyk darbo vietą.",
  "Užrašyk 3 dalykus, už kuriuos šiandien esi dėkingas.",
];
const randomIdea = () => IDEAS[Math.floor(Math.random() * IDEAS.length)];

/* ====================== Dienos iššūkis ====================== */
const CHALLENGES = [
  { text: "Surink bent 6 000 žingsnių.", points: 3 },
  { text: "Išgerk 8 stiklines vandens (≈ 1,6 l).", points: 3 },
  { text: "30 minučių be ekranų vienu kartu.", points: 3 },
  { text: "Eik miegoti 30 min anksčiau nei įprastai.", points: 3 },
  { text: "Padaryk 3 gerus darbus/gestus kitiems.", points: 3 },
  { text: "5 minutes kvėpavimo pratimų dienos metu.", points: 3 },
  { text: "15 minučių aktyvios veiklos lauke.", points: 3 },
];
function getChallengeByDate(dateStr) {
  const n = parseInt(dateStr.replaceAll("-", ""), 10);
  const idx = n % CHALLENGES.length;
  return { ...CHALLENGES[idx], date: dateStr, done: false };
}

/* ====================== Dienos motyvacija ====================== */
const MOTIVATIONS = [
  "Maži žingsniai veda į didelius pokyčius.",
  "Tu gali daugiau, negu dabar galvoji.",
  "Svarbu ne tobulumas, o nuoseklumas.",
  "Vienas geras įprotis gali pakeisti visą dieną.",
  "Rūpindamasis savimi, parodai pagarbą sau ir kitiems.",
  "Pradėk šiandien – rytojus padėkos.",
  "Net maža pertrauka nuo ekranų yra pergalė.",
  "Sveikas kūnas padeda ramiau jaustis ir galvoti.",
  "Kiekviena stiklinė vandens – dovana tavo kūnui.",
  "Judėjimas – pigiausias ir veiksmingiausias vaistas.",
];
function getMotivationForDate(dateStr) {
  const n = parseInt(dateStr.replaceAll("-", ""), 10);
  const idx = n % MOTIVATIONS.length;
  return MOTIVATIONS[idx];
}

/* ====================== Pavyzdiniai receptai ir darbai (su nuotraukos vieta) ====================== */
/* 
  Pastaba: šiuo metu img yra tuščias stringas.
  Jei norėsi tikrų nuotraukų, gali įrašyti, pvz.:
  img: "https://.../mano-fotke.jpg"
  arba įkelti paveikslėlius į /public/img ir naudoti "/img/pavadinimas.jpg".
*/
const RECIPE_EXAMPLES = [
  {
    title: "Spalvingos daržovių lazdelės su jogurto padažu",
    tag: "Sveikas užkandis",
    desc: "Morkos, agurkai, paprika, cukinija supjaustomi lazdelėmis. Padažas: natūralus jogurtas, česnakas, truputis druskos ir krapų.",
    img: "https://images.delfi.lt/media-api-image-cropper/v1/d51d07b0-7b90-11ed-a628-f15cb6709fa2.jpg?w=1200&h=800&fx=0.5&fy=0.25",
  },
  {
    title: "Avižinė košė stiklainėlyje",
    tag: "Pusryčiai",
    desc: "Avižiniai dribsniai, pienas ar jogurtas, vaisiai, šaukštelis sėklų. Palikti per naktį šaldytuve.",
    img: "https://www.sauletavirtuve.lt/wp-content/uploads/Brinkinta-avizine-kose-su-silauogemis-1.jpg",
  },
  {
    title: "Jogurtinis vaisių desertas be papildomo cukraus",
    tag: "Desertas",
    desc: "Natūralus jogurtas, bananai, uogos, šaukštelis riešutų ar sėklų. Sudėti sluoksniais į stiklinę.",
    img: "https://cust.lt/wp-content/uploads/2024/10/delicious_coconut_yogurt_parfait.jpg",
  },
];

const CRAFT_EXAMPLES = [
  {
    title: "Darbai iš antrinių žaliavų",
    tag: "Perdirbimas",
    desc: "Iš dėžučių, butelių, popieriaus sukurkite pieštukines, žaislus, dekoracijas. Svarbu: saugiai naudoti žirkles ir klijus.",
    img: "",
  },
  {
    title: "Sveikatos plakatas klasei",
    tag: "Plakatas",
    desc: "Sukurkite plakatą apie sveiką mitybą, judėjimą ar miegą. Naudokite spalvas, savo nuotraukas, aprašymus.",
    img: "",
  },
  {
    title: "„Padėkos stiklainis“",
    tag: "Emocijos",
    desc: "Stiklainis, į kurį visi meta lapelius su tuo, už ką šiandien dėkingi. Galima dekoruoti sveikatos simboliais.",
    img: "",
  },
];

/* ==== Failo -> DataURL su suspaudimu (iki 1400 px) ==== */
async function fileToDataUrl(file, maxSize = 1400, quality = 0.85) {
  const read = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(f);
    });
  const base64 = await read(file);
  if (!base64.startsWith("data:image")) return base64;

  const img = new Image();
  const loaded = new Promise((res) => {
    img.onload = res;
    img.src = base64;
  });
  await loaded;

  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const scale = Math.min(1, maxSize / Math.max(w, h));
  if (scale >= 1) return base64;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

/* ====================== Mažos UI dalys ====================== */
const Tag = ({ children }) => <span className="pill">{children}</span>;

const H = ({ title, subtitle, right }) => (
  <div className="flex items-end justify-between mb-2">
    <div>
      <div className="text-base font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
    {right}
  </div>
);

const Stat = ({ label, value, unit, pct }) => (
  <div className="card">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-2xl font-bold mt-1">
      {value}
      {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
    </div>
    {typeof pct === "number" && (
      <div className="mt-3">
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-2 bg-brand-600 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
        <div className="text-[10px] text-gray-500 mt-1">
          {Math.round(Math.min(100, Math.max(0, pct)))}% tikslo
        </div>
      </div>
    )}
  </div>
);

/* ===== Paprastas SVG bar chart paskutinėms 7 dienoms ===== */
function Bars({ values, max = 1, labels = [] }) {
  const m = Math.max(max, ...values, 1);
  return (
    <svg viewBox="0 0 120 40" className="w-full">
      {values.map((v, i) => {
        const h = 30 * (v / m);
        const x = 10 + i * 15;
        const y = 35 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width="10" height={h} rx="2" className="fill-brand-600/80"></rect>
            <text x={x + 5} y="38" textAnchor="middle" fontSize="3" className="fill-gray-500">
              {labels[i] || ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ====================== Pagrindinė aplikacija ====================== */
export default function App() {
  const [tab, setTab] = useState("home");
  const [ideaFilter, setIdeaFilter] = useState("receptai"); // nauja skilties būsena
  const [goals, setGoals] = useLS("goals", defaultGoals);
  const [today, setToday] = useLS("today", newDay());
  const [notes, setNotes] = useLS("notes", "");
  const [leaders, setLeaders] = useLS("leaders", [
    { team: "IIIa", points: 0 },
    { team: "IIf", points: 0 },
    { team: "Ia", points: 0 },
  ]);
  const [history, setHistory] = useLS("history", {});
  const [badges, setBadges] = useLS("badges", []);
  const [streak, setStreak] = useLS("streak", 0);
  const [challenge, setChallenge] = useLS(
    "dailyChallenge",
    getChallengeByDate(todayStr())
  );
  const [gallery, setGallery] = useLS("gallery", []);

  // nauja diena
  useEffect(() => {
    if (today.date !== todayStr()) setToday(newDay());
  }, []);

  // jei pasikeitė diena – naujas dienos iššūkis
  useEffect(() => {
    if (challenge.date !== today.date) setChallenge(getChallengeByDate(today.date));
  }, [today.date]);

  // jei šiandienos komandos nėra lyderių sąraše – įterpti
  useEffect(() => {
    setLeaders((list) => {
      const name = (today.team || "").trim();
      if (!name) return list;
      const exists = list.some(
        (x) => (x.team || "").toLowerCase() === name.toLowerCase()
      );
      return exists ? list : [...list, { team: name, points: 0 }];
    });
  }, [today.team]);

  // dienos motyvacija
  const motivation = useMemo(
    () => getMotivationForDate(today.date),
    [today.date]
  );

  // procentai
  const pct = useMemo(
    () => ({
      steps: (today.steps / (goals.steps || 1)) * 100,
      water: (today.waterMl / (goals.waterMl || 1)) * 100,
      screen: (today.screenMin / (goals.screenLimitMin || 1)) * 100,
      sleep: (today.sleepHours / (goals.sleepHours || 1)) * 100,
    }),
    [today, goals]
  );

  // bendras taškų suteikimas (pridės ir komandai; jei jos nėra – sukurs)
  const award = (p, reason = "") => {
    setToday((t) => ({ ...t, points: t.points + p }));
    setLeaders((arr) => {
      const teamName = (today.team || "").trim();
      if (!teamName) return arr;
      let found = false;
      const updated = arr.map((x) => {
        if ((x.team || "").toLowerCase() === teamName.toLowerCase()) {
          found = true;
          return { ...x, points: x.points + p };
        }
        return x;
      });
      return found ? updated : [...updated, { team: teamName, points: p }];
    });
    if (reason) console.log(`+${p} taškai: ${reason}`);
  };

  // išsaugoti dieną
  const saveDay = () => {
    setHistory((h) => ({
      ...h,
      [today.date]: {
        steps: today.steps,
        waterMl: today.waterMl,
        screenMin: today.screenMin,
        sleepHours: today.sleepHours,
        points: today.points,
      },
    }));

    const allOk =
      today.steps >= goals.steps &&
      today.waterMl >= goals.waterMl &&
      today.sleepHours >= goals.sleepHours &&
      today.screenMin <= goals.screenLimitMin;

    setStreak((s) => (allOk ? s + 1 : 0));
    if (allOk) {
      award(5, "Įvykdyti visi dienos tikslai");
      const gained = [];
      if (today.steps >= 10000) gained.push("10 000 žingsnių ✨");
      if (today.waterMl >= 2000) gained.push("2 l vandens 💧");
      if (today.screenMin <= 60) gained.push("Mažiau nei 1 val. ekranų 📵");
      if (today.sleepHours >= 8) gained.push("8 val. miego 😴");
      if (gained.length) setBadges((b) => [...b, ...gained]);
      alert(`Išsaugota! Streak: ${streak + 1} d. +5 taškų.`);
    } else {
      alert("Išsaugota. Ne visi tikslai pasiekti – streak atstatytas.");
    }

    setToday((d) => ({ ...newDay(), team: d.team }));
  };

  // grafikas
  const weekKeys = Object.keys(history).sort().slice(-7);
  const weekSteps = weekKeys.map((k) => history[k].steps || 0);

  // automatinis perspėjimas: viršytas ekrano limitas
  const overScreen = today.screenMin > goals.screenLimitMin;
  const [idea, setIdea] = useState(randomIdea());
  useEffect(() => {
    if (overScreen) setIdea(randomIdea());
  }, [overScreen]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-extrabold tracking-tight">Sveikas įprotis</div>
            <div className="text-xs text-gray-500">Prototipas • v0.5 • PWA</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">{today.team}</div>
            <div className="text-xs text-gray-500">Taškai: {today.points}</div>
          </div>
        </div>

        {/* Tabs – PRIDĖTA „ideas“ skiltis */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["home", "focus", "goals", "leaders", "ideas", "badges", "notes"].map(
            (t, i) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-xl py-2 text-xs ${
                  tab === t ? "bg-brand-600 text-white" : "bg-white border hover:bg-sky-50"
                }`}
              >
                {["Pradžia", "Be ekranų", "Tikslai", "Lyderiai", "Idėjos", "Ženkliukai", "Užrašai"][i]}
              </button>
            )
          )}
        </div>

        {/* PRADŽIA */}
        {tab === "home" && (
          <div className="space-y-4">
            {/* Dienos motyvacija */}
            <div className="card border-brand-100 bg-gradient-to-r from-sky-50 to-white">
              <div className="flex gap-3">
                <div className="text-2xl">🌟</div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-brand-700">
                    Dienos motyvacija
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-800">
                    „{motivation}“
                  </div>
                </div>
              </div>
            </div>

            {/* Perspėjimas dėl ekranų */}
            {overScreen && (
              <div className="card border-brand-100">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📵</div>
                  <div className="flex-1">
                    <div className="font-semibold">Per daug laiko prie ekrano</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Pasiūlymas: <span className="font-medium">{idea}</span>
                    </div>
                    <div className="mt-2">
                      <button
                        className="btn-primary"
                        onClick={() => setTab("focus")}
                      >
                        Eiti į „Be ekranų“
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dienos iššūkis */}
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div className="flex-1">
                  <div className="font-semibold">Dienos iššūkis</div>
                  <div className="text-sm text-gray-600 mt-1">{challenge.text}</div>
                  {!challenge.done ? (
                    <button
                      className="btn-primary mt-2"
                      onClick={() => {
                        award(challenge.points, "Dienos iššūkis");
                        setChallenge((c) => ({ ...c, done: true }));
                        alert(
                          `Puiku! Įvykdei dienos iššūkį. +${challenge.points} tašk.`
                        );
                      }}
                    >
                      Pažymėti įvykdytą (+{challenge.points} tšk.)
                    </button>
                  ) : (
                    <div className="mt-2 text-sm text-brand-700">
                      ✔ Įvykdyta! Taškai jau pridėti.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistika */}
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Žingsniai šiandien" value={today.steps} pct={pct.steps} />
              <Stat label="Vanduo" value={today.waterMl} unit="ml" pct={pct.water} />
              <Stat
                label="Ekrano laikas"
                value={today.screenMin}
                unit="min"
                pct={pct.screen}
              />
              <Stat
                label="Miegas"
                value={today.sleepHours}
                unit="val."
                pct={pct.sleep}
              />
            </div>

            {/* Greiti veiksmai */}
            <div className="card">
              <H title="Greiti veiksmai" subtitle="Progresas ir taškai." />
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn-primary"
                  onClick={() =>
                    setToday((t) => ({ ...t, steps: t.steps + 500 }))
                  }
                >
                  +500 žingsnių
                </button>
                <button
                  className="btn-primary"
                  onClick={() =>
                    setToday((t) => ({ ...t, steps: t.steps + 1000 }))
                  }
                >
                  +1000 žingsnių
                </button>
                <button
                  className="btn-ghost"
                  onClick={() =>
                    setToday((t) => ({ ...t, waterMl: t.waterMl + 250 }))
                  }
                >
                  +250 ml
                </button>
                <button
                  className="btn-ghost"
                  onClick={() =>
                    setToday((t) => ({ ...t, waterMl: t.waterMl + 500 }))
                  }
                >
                  +500 ml
                </button>
                <button
                  className="btn-ghost"
                  onClick={() =>
                    setToday((t) => ({ ...t, screenMin: t.screenMin + 15 }))
                  }
                >
                  +15 min ekranui
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => award(1, "Rankinis +1 taškas")}
                >
                  +1 taškas
                </button>
              </div>
            </div>

            {/* Miegas */}
            <div className="card">
              <H title="Miegas" subtitle="Kiek miegojai?" />
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="rounded-xl border px-3 py-2 w-28"
                  value={today.sleepHours}
                  min={0}
                  step={0.5}
                  onChange={(e) =>
                    setToday((t) => ({
                      ...t,
                      sleepHours: parseFloat(e.target.value || 0),
                    }))
                  }
                />
                <span className="text-sm text-gray-600">val.</span>
                <div className="ml-auto text-xs text-gray-500">
                  Streak: <b>{streak}</b> d.
                </div>
              </div>
            </div>

            {/* Grafikas */}
            <div className="card">
              <H
                title="Savaitės žingsniai"
                subtitle="Paskutinės 7 dienos"
                right={<Tag>{weekKeys.length} d.</Tag>}
              />
              <Bars values={weekSteps} labels={weekKeys.map((k) => k.slice(5))} />
            </div>

            <div className="flex gap-2">
              <button className="btn-primary" onClick={saveDay}>
                Išsaugoti dieną
              </button>
              <button className="btn-ghost" onClick={() => setToday(newDay())}>
                Nauja diena
              </button>
            </div>
          </div>
        )}

        {/* BE EKRANŲ */}
        {tab === "focus" && (
          <FocusTab today={today} setToday={setToday} award={award} />
        )}

        {/* TIKSLAI */}
        {tab === "goals" && (
          <div className="space-y-4">
            <div className="card">
              <H title="Asmeniniai tikslai" subtitle="Keisk pagal poreikį." />
              {["steps", "waterMl", "screenLimitMin", "sleepHours"].map((k, i) => {
                const labels = [
                  "Žingsniai/d.",
                  "Vanduo (ml)",
                  "Ekranas (min/d.)",
                  "Miegas (val.)",
                ];
                const step = i === 3 ? 0.5 : 1;
                return (
                  <label
                    key={k}
                    className="grid grid-cols-[150px,1fr] items-center gap-3 py-1"
                  >
                    <span className="text-sm text-gray-700">{labels[i]}</span>
                    <input
                      type="number"
                      step={step}
                      className="rounded-xl border px-3 py-2"
                      value={goals[k]}
                      onChange={(e) =>
                        setGoals((g) => ({
                          ...g,
                          [k]:
                            i === 3
                              ? parseFloat(e.target.value || 0)
                              : parseInt(e.target.value || 0),
                        }))
                      }
                    />
                  </label>
                );
              })}
            </div>

            <div className="card">
              <H title="Komanda" />
              <div className="grid grid-cols-2 gap-3 items-center">
                <span className="text-sm text-gray-700">
                  Mano komanda / klasė
                </span>
                <input
                  className="rounded-xl border px-3 py-2"
                  value={today.team}
                  onChange={(e) =>
                    setToday((t) => ({ ...t, team: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* LYDERIAI */}
        {tab === "leaders" && (
          <div className="space-y-3">
            <div className="card">
              <H title="Lyderių lentelė" subtitle="Šiame įrenginyje" />
              <div className="flex gap-2 mb-2">
                <input
                  id="newTeam"
                  placeholder="Nauja komanda (pvz., IIIc)"
                  className="rounded-xl border px-3 py-2 flex-1"
                />
                <button
                  className="btn-ghost"
                  onClick={() => {
                    const el = document.getElementById("newTeam");
                    const name = (el.value || "").trim();
                    if (!name) return;
                    setLeaders((a) =>
                      a.some(
                        (x) =>
                          (x.team || "").toLowerCase() === name.toLowerCase()
                      )
                        ? a
                        : [...a, { team: name, points: 0 }]
                    );
                    el.value = "";
                  }}
                >
                  Pridėti
                </button>
              </div>
              {[...leaders]
                .filter((l) => (l.team || "").trim() !== "")
                .sort((a, b) => b.points - a.points)
                .map((l, i) => (
                  <div
                    key={l.team + i}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="font-medium">
                      {i + 1}. {l.team}
                    </div>
                    <div className="text-sm">{l.points} taškai</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* IDĖJOS – nauja atskira skiltis su pasirinkimais ir (galimomis) nuotraukomis */}
        {tab === "ideas" && (
          <div className="space-y-4">
            <div className="card">
              <H
                title="Idėjų bankas"
                subtitle="Pasirink, ką šiandien norėtum pažiūrėti ar išbandyti."
              />
              <div className="flex gap-2 mb-2 flex-wrap">
                <button
                  onClick={() => setIdeaFilter("receptai")}
                  className={`px-3 py-1 rounded-xl text-xs ${
                    ideaFilter === "receptai"
                      ? "bg-brand-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  🍽️ Receptai
                </button>
                <button
                  onClick={() => setIdeaFilter("darbai")}
                  className={`px-3 py-1 rounded-xl text-xs ${
                    ideaFilter === "darbai"
                      ? "bg-brand-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  🎨 Darbai ir kūryba
                </button>
                <button
                  onClick={() => setIdeaFilter("veiklos")}
                  className={`px-3 py-1 rounded-xl text-xs ${
                    ideaFilter === "veiklos"
                      ? "bg-brand-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  ⚡ Greitos veiklos
                </button>
              </div>

              {ideaFilter === "receptai" && (
                <div className="grid gap-3">
                  {RECIPE_EXAMPLES.map((r, i) => (
                    <ExampleCard
                      key={i}
                      item={r}
                      onTry={() => award(1, "Išbandytas recepto pavyzdys")}
                    />
                  ))}
                </div>
              )}

              {ideaFilter === "darbai" && (
                <div className="grid gap-3">
                  {CRAFT_EXAMPLES.map((c, i) => (
                    <ExampleCard
                      key={i}
                      item={c}
                      onTry={() => award(1, "Išbandytas darbelio pavyzdys")}
                    />
                  ))}
                </div>
              )}

              {ideaFilter === "veiklos" && (
                <div className="grid gap-2 text-sm mt-2">
                  {IDEAS.map((x, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border p-3 bg-white flex justify-between items-center gap-2"
                    >
                      <span>• {x}</span>
                      <button
                        className="btn-ghost text-xs"
                        onClick={() => award(1, "Išbandyta greita veikla")}
                      >
                        +1 tšk.
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ŽENKLIUKAI */}
        {tab === "badges" && (
          <div className="card">
            <H
              title="Ženkliukai"
              subtitle="Motyvaciniai pasiekimai"
              right={<Tag>{badges.length}</Tag>}
            />
            {badges.length ? (
              <div className="grid grid-cols-2 gap-2">
                {badges.map((b, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border p-3 bg-white text-sm"
                  >
                    🏅 {b}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Kol kas nėra – pasiek tikslus ir gauk!
              </div>
            )}
          </div>
        )}

        {/* UŽRAŠAI + GALERIJA (mokinių sukelti darbai) */}
        {tab === "notes" && (
          <div className="space-y-4">
            <div className="card">
              <H title="Užrašai / planas" subtitle="Automatiškai išsaugoma" />
              <textarea
                className="w-full min-h-[160px] rounded-2xl border p-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Idėjos, planas, sąrašai..."
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {notes.length} simbolių
              </div>
            </div>

            <div className="card">
              <H
                title="Galerija: jūsų receptai ir darbai"
                subtitle="Įkelk nuotrauką ir aprašą — duomenys saugomi tik šiame įrenginyje."
                right={<span className="pill">{gallery.length}</span>}
              />

              <UploadForm
                onAdd={async (file, caption, tag) => {
                  if (!file) return;
                  const dataUrl = await fileToDataUrl(file);
                  const item = {
                    id: crypto.randomUUID(),
                    img: dataUrl,
                    caption: caption?.trim() || "",
                    tag: tag || "Kita",
                    createdAt: new Date().toISOString(),
                  };
                  setGallery((g) => [item, ...g]);
                }}
              />

              {gallery.length === 0 ? (
                <div className="text-sm text-gray-500 mt-2">
                  Kol kas tuščia. Įkelk pirmą nuotrauką – gali būti receptas, darbelis,
                  plakatas ar kita sveikatos idėja.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {gallery.map((it) => (
                    <GalleryCard
                      key={it.id}
                      item={it}
                      onDelete={() =>
                        setGallery((g) => g.filter((x) => x.id !== it.id))
                      }
                      onUpdate={(patch) =>
                        setGallery((g) =>
                          g.map((x) =>
                            x.id === it.id ? { ...x, ...patch } : x
                          )
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-gray-500 mt-6">
          Duomenys saugomi tik šiame įrenginyje (localStorage). 🧠 PWA: pridėk prie
          pagrindinio ekrano.
        </footer>
      </div>
    </div>
  );
}

/* ====================== Be ekranų (laikmatis) ====================== */
function FocusTab({ today, setToday, award }) {
  const [running, setRunning] = useState(false);
  const [start, setStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let id;
    if (running) {
      id = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 60000));
      }, 1000);
    }
    return () => clearInterval(id);
  }, [running, start]);

  const startTimer = () => {
    setStart(Date.now());
    setElapsed(0);
    setRunning(true);
  };

  const finish = () => {
    setRunning(false);
    const minutes = Math.max(1, Math.floor((Date.now() - start) / 60000));
    const gained = Math.floor(minutes / 10);
    if (gained > 0) award(gained, "Laikas be ekranų");
    setToday((t) => ({
      ...t,
      focusSessions: [
        ...t.focusSessions,
        { start: new Date().toISOString(), minutes },
      ],
    }));
    alert(`Puiku! Be ekranų: ${minutes} min. Gavai +${gained} tašk.`);
  };

  return (
    <div className="space-y-4">
      <div className="card text-center">
        <H title="Laikas be ekranų" subtitle="+1 taškas kas 10 min." />
        <div className="text-5xl font-extrabold">
          {running ? `${elapsed} min` : "0 min"}
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {!running ? (
            <button className="btn-primary" onClick={startTimer}>
              Pradėti
            </button>
          ) : (
            <button className="btn-primary" onClick={finish}>
              Baigti
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <H title="Idėjos vietoj ekranų" />
        <div className="grid gap-2 text-sm">
          {IDEAS.map((x, i) => (
            <div key={i} className="rounded-xl border p-3 bg-white">
              • {x}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ====================== Įkėlimo/galerijos komponentai ====================== */
function UploadForm({ onAdd }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("Receptas");

  return (
    <div className="rounded-2xl border p-3 bg-white">
      <div className="grid sm:grid-cols-[1fr,2fr] gap-3 items-start">
        <label className="block">
          <span className="text-sm text-gray-700">Nuotrauka</span>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              setPreview(f ? URL.createObjectURL(f) : "");
            }}
          />
          {preview && (
            <img
              src={preview}
              alt="peržiūra"
              className="mt-2 h-28 w-auto rounded-xl object-cover"
            />
          )}
        </label>

        <div className="grid gap-2">
          <div>
            <span className="text-sm text-gray-700">Aprašas</span>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              placeholder="Trumpai aprašyk: pavadinimas, sudėtis, žingsniai ir pan."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm">
              Žyma
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option>Receptas</option>
                <option>Darbelis</option>
                <option>Sportas</option>
                <option>Kita</option>
              </select>
            </label>

            <button
              className="btn-primary mt-5"
              onClick={async () => {
                if (!file) {
                  alert("Pasirink nuotrauką.");
                  return;
                }
                await onAdd(file, caption, tag);
                setFile(null);
                setCaption("");
                setTag("Receptas");
                setPreview("");
              }}
            >
              Įkelti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ item, onDelete, onUpdate }) {
  const d = new Date(item.createdAt);
  const date =
    d.toLocaleDateString("lt-LT") +
    " " +
    d.toLocaleTimeString("lt-LT", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="rounded-2xl border p-3 bg-white">
      <img
        src={item.img}
        alt={item.caption || "įrašas"}
        className="h-40 w-full object-cover rounded-xl"
      />
      <div className="mt-2 text-xs text-gray-500">{date}</div>
      <div className="mt-1 flex items-center justify-between">
        <span className="pill">{item.tag}</span>
        <div className="flex gap-2">
          <a className="btn-ghost text-xs" href={item.img} download>
            Atsisiųsti
          </a>
          <button className="btn-ghost text-xs" onClick={onDelete}>
            Ištrinti
          </button>
        </div>
      </div>
      <input
        className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
        value={item.caption}
        onChange={(e) => onUpdate({ caption: e.target.value })}
        placeholder="Aprašas…"
      />
    </div>
  );
}

/* ====================== Pavyzdžių kortelė su nuotrauka ====================== */
function ExampleCard({ item, onTry }) {
  return (
    <div className="rounded-2xl border p-3 bg-white flex flex-col gap-2">
      {item.img ? (
        <img
          src={item.img}
          alt={item.title}
          className="h-32 w-full object-cover rounded-xl"
        />
      ) : (
        <div className="h-32 w-full rounded-xl bg-gradient-to-r from-sky-100 to-brand-50 flex items-center justify-center text-xs text-gray-500">
          Nuotrauka gali būti pridėta vėliau
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">{item.title}</div>
        <span className="pill text-[10px]">{item.tag}</span>
      </div>
      <div className="text-xs text-gray-700">{item.desc}</div>
      <button className="btn-ghost text-xs self-start mt-1" onClick={onTry}>
        Pažymėti kaip išbandytą (+1 tšk.)
      </button>
    </div>
  );
}
