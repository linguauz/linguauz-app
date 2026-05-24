import type { Phase, Stone } from "./types";

/* =================================================================
 * Phases — Ko'lmakdan Okeangacha
 * ================================================================= */
export const PHASES: Phase[] = [
  {
    id: 1,
    slug: "kolmak",
    name: "Ko'lmak",
    emoji: "💧",
    tagline: "Tinch suv — poydevor",
    description:
      "Tovushlar, harflar va so'z tuzilishi. Suv sokin, har bir tosh ko'rinib turadi.",
    accent: "#22d3a5",
    stoneIds: ["k-1", "k-2", "k-3", "k-4"],
  },
  {
    id: 2,
    slug: "buloq",
    name: "Buloq",
    emoji: "🌿",
    tagline: "Oqim boshlandi",
    description:
      "So'z ma'nolari, o'zak-qo'shimcha tizimi. Suv buloqdan otilib chiqadi.",
    accent: "#00b39d",
    stoneIds: ["b-1", "b-2", "b-3", "b-4"],
  },
  {
    id: 3,
    slug: "daryo",
    name: "Daryo",
    emoji: "🏞️",
    tagline: "Kuchli oqim",
    description:
      "So'z turkumlari — ot, fe'l, sifat, ravish. Daryoning kengayishi.",
    accent: "#00a3ff",
    stoneIds: ["d-1", "d-2", "d-3", "d-4"],
  },
  {
    id: 4,
    slug: "dengiz",
    name: "Dengiz",
    emoji: "🌊",
    tagline: "Gap qurish ustaxonasi",
    description: "Gap bo'laklari — Ega, Kesim, To'ldiruvchi, Aniqlovchi, Hol.",
    accent: "#6c8cff",
    stoneIds: ["dn-1", "dn-2", "dn-3", "dn-4"],
  },
  {
    id: 5,
    slug: "okean",
    name: "Okean",
    emoji: "🌍",
    tagline: "Erkinlik",
    description:
      "Sintaksis, uslublar va akademik yozuv. Poydevor qurilgan — endi cheksizlik.",
    accent: "#f6c46e",
    stoneIds: [],
  },
];

/* =================================================================
 * Stones — 16 ta dars (4×4)
 * ================================================================= */
export const STONES: Stone[] = [
  /* =========================================
   * PHASE 1 — KO'LMAK
   * ========================================= */
  {
    id: "k-1",
    phaseId: 1,
    index: 1,
    globalIndex: 1,
    title: "Tovushlar va Harflar",
    subtitle: "Unli · Undosh · Alifbo",
    emoji: "🔤",
    durationMin: 12,
    xp: 50,
    badgeId: "tovush",
    cards: [
      {
        type: "intro",
        title: "Tovushdan so'z — so'zdan fikr",
        hook:
          "Til — bu tovushlardan boshlanadi. O'zbek tilida 32 ta harf va 30 ta tovush bor. Birinchi qadam — ularni tanish.",
      },
      {
        type: "rule",
        title: "Unli va Undosh",
        rule:
          "Unli tovushlar nafas to'siqsiz chiqadi va bo'g'in yaratadi. O'zbek tilida 6 ta unli: a, e, i, o, u, o'.",
        examples: [
          [{ text: "u" }, { text: "y" }, { text: " — 1 bo'g'in" }],
          [{ text: "o" }, { text: "n" }, { text: "a — 2 bo'g'in" }],
        ],
      },
      {
        type: "examples",
        title: "Undosh juftliklari",
        sentences: [
          [{ text: "B — P (jarangli — jarangsiz)" }],
          [{ text: "D — T" }],
          [{ text: "G — K" }],
          [{ text: "Z — S" }],
        ],
        note:
          "Jarangli undoshlar tovush chiqaradi (bo'g'iz titraydi), jarangsizlar yo'q.",
      },
      {
        type: "build",
        title: "Bo'g'inga bo'lish",
        prompt: "Quyidagi so'zni bo'g'inga to'g'ri ajrating: maktab",
        chips: [
          { text: "mak" },
          { text: "tab" },
        ],
        slots: ["ega", "kesim"], // chip slots — not grammar here, just two
      },
      {
        type: "note",
        title: "💡 Eslatma — kelajak uchun",
        body:
          "O'zbek tilida har bir harf bitta tovushga to'g'ri keladi. Ko'p chet tillarida (masalan, ingliz) bir harf turli tovushlarni bildiradi — buni eslab qoling.",
      },
      {
        type: "outro",
        title: "Tovushlar — sizning instrumentingiz!",
        xp: 50,
      },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "O'zbek tilida nechta unli tovush bor?",
        options: ["4 ta", "6 ta", "8 ta", "10 ta"],
        answer: 1,
        explain: "6 ta unli: a, e, i, o, u, o'.",
      },
      {
        type: "choice",
        prompt: "Qaysi harf juftligi — jarangli/jarangsiz?",
        options: ["B–P", "M–N", "L–R", "Y–H"],
        answer: 0,
        explain: "B jarangli, P — uning jarangsiz juftligi.",
      },
      {
        type: "truefalse",
        prompt: "Bo'g'in tarkibida albatta unli tovush bo'ladi.",
        claim: "Har bir bo'g'inda kamida bitta unli bor.",
        answer: true,
        explain: "Unli — bo'g'inning yuragidir. Unlisiz bo'g'in bo'lmaydi.",
      },
      {
        type: "order",
        prompt: "So'zni bo'g'inlarga ajrating: kitob",
        chips: ["ki", "tob"],
        answer: [0, 1],
        hint: "💡 Ikki unli — ikki bo'g'in",
        explain: "ki + tob — ikkita unli, demak 2 bo'g'in.",
      },
      {
        type: "fill",
        prompt: "Bo'sh joyga to'g'ri so'z qo'shing",
        before: "O'zbek tilida",
        after: "harf bor.",
        options: ["28", "30", "32", "34"],
        answer: 2,
        explain: "Lotin imlosida 32 ta harf — alifbo to'liq.",
      },
    ],
  },
  {
    id: "k-2",
    phaseId: 1,
    index: 2,
    globalIndex: 2,
    title: "So'z Tuzilishi",
    subtitle: "O'zak · Qo'shimcha",
    emoji: "🧩",
    durationMin: 14,
    xp: 60,
    cards: [
      {
        type: "intro",
        title: "So'z — bu tovush + ma'no",
        hook:
          "So'z — o'zak bilan qo'shimchadan iborat. O'zak ma'no beradi, qo'shimcha unga rol qo'shadi.",
      },
      {
        type: "rule",
        title: "O'zak va qo'shimcha",
        rule: "O'zak — o'zgarmas asos. Qo'shimcha — o'zak oxiriga ulanadi.",
        examples: [
          [{ text: "uy" }, { text: "+da" }, { text: " = uyda" }],
          [{ text: "uy" }, { text: "+ga" }, { text: " = uyga" }],
          [{ text: "uy" }, { text: "+dan" }, { text: " = uydan" }],
        ],
      },
      {
        type: "examples",
        title: "So'z yasovchi qo'shimchalar",
        sentences: [
          [{ text: "ish" }, { text: "+chi" }, { text: " = ishchi (kasb)" }],
          [{ text: "bahor" }, { text: "+iy" }, { text: " = bahoriy (sifat)" }],
          [{ text: "o'qi" }, { text: "+uvchi" }, { text: " = o'quvchi" }],
        ],
      },
      {
        type: "tap",
        title: "O'zakni toping",
        prompt: "Ushbu so'zda o'zakni bosing: kitobxonlar",
        sentence: [
          { text: "kitob", role: "ega" },
          { text: "xon" },
          { text: "lar" },
        ],
        targetRole: "ega",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "O'zbek tilida qo'shimchalar so'z oxiriga ulanadi. Boshqa tillarda esa alohida so'z (predlog) bo'lib so'z oldiga keladi — ammo ma'no bir xil.",
      },
      {
        type: "outro",
        title: "So'zlar — fikrning g'ishtlari!",
        xp: 60,
      },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "'Uyga' so'zining o'zak qaysi?",
        options: ["u", "uy", "uyg", "ga"],
        answer: 1,
        explain: "uy — o'zak, -ga — jo'nalish kelishigi qo'shimchasi.",
      },
      {
        type: "fill",
        prompt: "Qo'shimchani ulang: 'ishchi'",
        before: "ish",
        after: "(kasb egasi)",
        options: ["+chi", "+sa", "+ng", "+lar"],
        answer: 0,
        explain: "-chi qo'shimchasi kasb egasini bildiradi.",
      },
      {
        type: "truefalse",
        prompt: "O'zak — so'zning o'zgarmas asosidir.",
        claim: "O'zak so'zga turli qo'shimchalar ulanganda o'zgarmaydi.",
        answer: true,
        explain: "Aynan shuning uchun uni 'o'zak' deyiladi.",
      },
      {
        type: "order",
        prompt: "So'zni o'zak+qo'shimcha bo'lib joylashtiring: bahoriy",
        chips: ["bahor", "iy"],
        answer: [0, 1],
        hint: "💡 Avval o'zak, keyin qo'shimcha",
        explain: "bahor (o'zak) + iy (sifat yasovchi qo'shimcha).",
      },
      {
        type: "choice",
        prompt: "Quyidagilardan qaysi biri so'z yasovchi qo'shimcha?",
        options: ["-da", "-ga", "-chi", "-dan"],
        answer: 2,
        explain: "-chi yangi so'z yasaydi (ish → ishchi).",
      },
    ],
  },
  {
    id: "k-3",
    phaseId: 1,
    index: 3,
    globalIndex: 3,
    title: "Ot Turkumi",
    subtitle: "Aniqlik · Noaniqlik",
    emoji: "📚",
    durationMin: 14,
    xp: 65,
    cards: [
      {
        type: "intro",
        title: "Ot — narsalarning nomi",
        hook:
          "Ot — narsa, predmet, shaxs yoki joy nomini bildiradi. Savol: Kim? Nima?",
      },
      {
        type: "rule",
        title: "Turdosh va atoqli otlar",
        rule:
          "Turdosh ot — umumiy nom (kitob, bola). Atoqli ot — yagona nom (Toshkent, Anvar). Atoqli otlar katta harf bilan yoziladi.",
        examples: [
          [{ text: "bola — Anvar" }],
          [{ text: "shahar — Toshkent" }],
          [{ text: "kitob — 'O'tkan kunlar'" }],
        ],
      },
      {
        type: "examples",
        title: "Aniqlik va noaniqlik",
        sentences: [
          [{ text: "Menga kitobni ber" }, { text: " — aniq kitob" }],
          [{ text: "Menga birorta kitob ber" }, { text: " — noaniq kitob" }],
          [{ text: "O'sha bola keldi" }, { text: " — aniq bola" }],
        ],
        note:
          "Aniqlikni '-ni', 'shu', 'o'sha' bilan, noaniqlikni 'bir', 'birorta' bilan bildiramiz.",
      },
      {
        type: "tap",
        title: "Otni toping",
        prompt: "Gapdagi otni bosing",
        sentence: [
          { text: "Kitob", role: "ega" },
          { text: "stolda" },
          { text: "yotibdi" },
        ],
        targetRole: "ega",
      },
      {
        type: "note",
        title: "💡 Eslatma — Artikl",
        body:
          "Ingliz, nemis, fransuz tillarida aniqlikni maxsus so'z — ARTIKL bildiradi: 'the book' = 'o'sha kitob', 'a book' = 'birorta kitob'.",
      },
      { type: "outro", title: "Otlarni bildingiz!", xp: 65 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "Qaysi so'z atoqli ot?",
        options: ["bola", "Samarqand", "kitob", "kun"],
        answer: 1,
        explain: "Samarqand — yagona nom, demak atoqli ot. Katta harf bilan.",
      },
      {
        type: "tap",
        prompt: "Otni toping: 'Akam yangi mashina sotib oldi'",
        sentence: ["Akam", "yangi", "mashina", "sotib", "oldi"],
        answerIndex: 0,
        explain: "Akam — Kim? savoliga javob, demak ot (ega).",
      },
      {
        type: "truefalse",
        prompt: "Atoqli otlar har doim katta harf bilan yoziladi.",
        claim: "Bu — imloning asosiy qoidalaridan biri.",
        answer: true,
        explain: "Toshkent, Anvar, O'zbekiston — barchasi katta harfdan.",
      },
      {
        type: "fill",
        prompt: "Aniqlik qo'shimchasini qo'shing",
        before: "Kitob",
        after: "menga ber",
        options: ["-ni", "-da", "-ga", "-dan"],
        answer: 0,
        explain: "-ni tushum kelishigi aniqlikni bildiradi: 'kitobni'.",
      },
      {
        type: "choice",
        prompt: "Noaniq otni qaysi so'z ko'rsatadi?",
        options: ["o'sha", "shu", "birorta", "bu"],
        answer: 2,
        explain: "'Birorta' noaniqlikni — qaysi ekani aniq emas — bildiradi.",
      },
    ],
  },
  {
    id: "k-4",
    phaseId: 1,
    index: 4,
    globalIndex: 4,
    title: "Sifat va Ravish",
    subtitle: "Predmet · Harakat belgisi",
    emoji: "🎨",
    durationMin: 15,
    xp: 70,
    cards: [
      {
        type: "intro",
        title: "Belgi bildiruvchi so'zlar",
        hook:
          "Sifat — predmetning belgisini, ravish — harakatning belgisini bildiradi.",
      },
      {
        type: "rule",
        title: "Sifat — qanday? qaysi?",
        rule:
          "Sifat ot bilan birga keladi va uni tavsiflaydi. O'zbek tilida sifat doim otdan oldin keladi.",
        examples: [
          [
            { text: "katta", role: "aniqlovchi" },
            { text: " ", role: undefined },
            { text: "uy", role: "ega" },
          ],
          [
            { text: "yaxshi", role: "aniqlovchi" },
            { text: " ", role: undefined },
            { text: "kitob", role: "ega" },
          ],
        ],
      },
      {
        type: "rule",
        title: "Ravish — qanday? qachon? qayerda?",
        rule:
          "Ravish fe'l bilan birga keladi va harakatni tavsiflaydi.",
        examples: [
          [
            { text: "tez", role: "ravish" },
            { text: " " },
            { text: "yugurdi", role: "kesim" },
          ],
          [
            { text: "ertalab", role: "ravish" },
            { text: " " },
            { text: "keldi", role: "kesim" },
          ],
        ],
      },
      {
        type: "tap",
        title: "Sifatni toping",
        prompt: "Sifatni bosing",
        sentence: [
          { text: "Yashil" },
          { text: "olma", role: "aniqlovchi" },
          { text: "shirin" },
        ],
        targetRole: "aniqlovchi",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida sifat va ravish farqi -ly qo'shimcha bilan: good → goodly. O'zbek tilida bu farq so'z o'zgarishi emas, joylashishida ko'rinadi.",
      },
      { type: "outro", title: "Phase 1 ni tugatdingiz! 💧→🌿", xp: 70 },
    ],
    quiz: [
      {
        type: "tap",
        prompt: "Sifatni toping: 'Qizil olma juda shirin'",
        sentence: ["Qizil", "olma", "juda", "shirin"],
        answerIndex: 0,
        explain: "Qizil — Qanday? savoliga javob, demak sifat (aniqlovchi).",
      },
      {
        type: "choice",
        prompt: "Quyidagilardan qaysi biri ravish?",
        options: ["chiroyli", "tez", "katta", "yangi"],
        answer: 1,
        explain: "Tez — harakatni tavsiflaydi (qanday?), demak ravish.",
      },
      {
        type: "truefalse",
        prompt: "O'zbek tilida sifat doim otdan oldin keladi.",
        claim: "'Katta uy' to'g'ri, 'uy katta' tarkibida emas.",
        answer: true,
        explain: "Sifat aniqlovchi sifatida — ot oldida.",
      },
      {
        type: "order",
        prompt: "Gapni to'g'ri tartibga keltiring",
        chips: ["Baland", "tog'lar", "ko'rinadi"],
        answer: [0, 1, 2],
        hint: "💡 Sifat (qanday?) → Ot → Kesim",
        explain: "'Baland tog'lar ko'rinadi' — sifat ot oldida.",
      },
      {
        type: "fill",
        prompt: "Ravishni qo'shing",
        before: "U",
        after: "yugurdi",
        options: ["tez", "qizil", "katta", "ko'k"],
        answer: 0,
        explain: "Tez — qanday yugurdi? savoliga javob.",
      },
    ],
  },

  /* =========================================
   * PHASE 2 — BULOQ
   * ========================================= */
  {
    id: "b-1",
    phaseId: 2,
    index: 1,
    globalIndex: 5,
    title: "So'z va Ma'no",
    subtitle: "Kontekst sehri",
    emoji: "🔍",
    durationMin: 12,
    xp: 75,
    badgeId: "kuprik",
    cards: [
      {
        type: "intro",
        title: "Bir so'z — bir necha ma'no",
        hook:
          "Bir xil yoziladigan so'zlar turli ma'nolarda kelishi mumkin. Kontekst — ma'noning kalitidir.",
      },
      {
        type: "rule",
        title: "Bir shaklli, ko'p ma'noli",
        rule:
          "O'zbek tilida ko'p so'zlar bir necha ma'noga ega. Kontekst aniqlaydi.",
        examples: [
          [{ text: "ko'z — odam ko'zi" }],
          [{ text: "ko'z — derazaning ko'zi" }],
          [{ text: "ko'z — buloqning ko'zi" }],
        ],
      },
      {
        type: "examples",
        title: "Sinonim va antonim",
        sentences: [
          [{ text: "katta = ulkan = baquvvat (sinonim)" }],
          [{ text: "katta ↔ kichik (antonim)" }],
          [{ text: "issiq ↔ sovuq (antonim)" }],
        ],
      },
      {
        type: "tap",
        title: "Aniqlovchini toping",
        prompt: "Sifatni bosing",
        sentence: [
          { text: "Yumshoq" },
          { text: "yostiq", role: "aniqlovchi" },
          { text: "yoqdi" },
        ],
        targetRole: "aniqlovchi",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Kontekst — so'zning hayotidir. Chet tilida ham bir so'z bir necha ma'noga ega bo'lishi mumkin: ingliz 'book' = kitob VA buyurtma qilmoq.",
      },
      { type: "outro", title: "Ma'no — fikrning yuragi!", xp: 75 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "'Issiq' so'zining antonim juftligi?",
        options: ["yumshoq", "sovuq", "katta", "tez"],
        answer: 1,
        explain: "Issiq ↔ sovuq — qarama-qarshi ma'nolar.",
      },
      {
        type: "choice",
        prompt: "Sinonim juftligini toping",
        options: ["katta — kichik", "tez — sekin", "go'zal — chiroyli", "issiq — sovuq"],
        answer: 2,
        explain: "Go'zal va chiroyli — bir xil ma'noni bildiradi.",
      },
      {
        type: "truefalse",
        prompt: "'Ko'z' so'zi — ko'p ma'noli so'z.",
        claim: "Odam, deraza, buloq — barchasi 'ko'z'ga ega.",
        answer: true,
        explain: "Ha — bir shakl, ko'p ma'no.",
      },
      {
        type: "fill",
        prompt: "Antonimini toping",
        before: "Tez",
        after: "—",
        options: ["sekin", "katta", "issiq", "qisqa"],
        answer: 0,
        explain: "Tez ↔ sekin — harakat tezligi bo'yicha qarama-qarshilik.",
      },
      {
        type: "order",
        prompt: "Mantiqiy ketma-ketlikka keltiring",
        chips: ["uy", "uyimiz", "uyimizdagi"],
        answer: [0, 1, 2],
        hint: "💡 O'zak → egalik → joy",
        explain: "Har bir qadamda yangi qo'shimcha qo'shilib boradi.",
      },
    ],
  },
  {
    id: "b-2",
    phaseId: 2,
    index: 2,
    globalIndex: 6,
    title: "O'zak va Qo'shimcha — chuqurroq",
    subtitle: "So'z yasovchi qo'shimchalar",
    emoji: "🧬",
    durationMin: 14,
    xp: 80,
    cards: [
      {
        type: "intro",
        title: "Qo'shimchalar tilning g'ishtlari",
        hook:
          "Qo'shimchalar so'zga ma'no qo'shadi: kasb, joy, daraja, ko'plik...",
      },
      {
        type: "rule",
        title: "So'z yasovchi qo'shimchalar",
        rule:
          "Bu qo'shimchalar yangi so'z yasaydi. Asosiylari: -chi, -iy, -li, -lik, -dor.",
        examples: [
          [{ text: "ish + chi = ishchi (kasb)" }],
          [{ text: "bahor + iy = bahoriy (sifat)" }],
          [{ text: "non + voy = nonvoy (kasb)" }],
        ],
      },
      {
        type: "examples",
        title: "Shakl yasovchi qo'shimchalar",
        sentences: [
          [{ text: "kitob+lar = kitoblar (ko'plik)" }],
          [{ text: "uy+da = uyda (o'rin)" }],
          [{ text: "uy+ga = uyga (yo'nalish)" }],
        ],
        note:
          "Bu qo'shimchalar yangi so'z yasamaydi — faqat shakl o'zgartiradi.",
      },
      {
        type: "build",
        title: "Yangi so'z yasang",
        prompt: "Tegishli qo'shimchani tanlang",
        chips: [
          { text: "non" },
          { text: "voy" },
        ],
        slots: ["ega", "kesim"],
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida -er qo'shimchasi kasbni bildiradi: teach+er = o'qituvchi. O'zbek tilidagi -chi/-voy ham xuddi shu vazifani bajaradi.",
      },
      { type: "outro", title: "Qo'shimchalar tilning xazinasi!", xp: 80 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "Qaysi qo'shimcha kasb egasini bildiradi?",
        options: ["-chi", "-da", "-lar", "-gan"],
        answer: 0,
        explain: "-chi: ish+chi, suv+chi, paxta+kor — barchasi kasb.",
      },
      {
        type: "fill",
        prompt: "Yangi so'z yasang",
        before: "non",
        after: "(kasb)",
        options: ["+voy", "+da", "+lar", "+ni"],
        answer: 0,
        explain: "Non+voy = nonvoy — non yopadigan kasb egasi.",
      },
      {
        type: "truefalse",
        prompt: "'-lar' qo'shimchasi yangi so'z yasaydi.",
        claim: "Kitob → kitoblar — yangi ma'no, yangi so'zmi?",
        answer: false,
        explain: "Yo'q — bu shakl yasovchi, ko'plikni bildiradi. So'z o'sha kitob.",
      },
      {
        type: "order",
        prompt: "Tartibga keltiring",
        chips: ["ish", "ishchi", "ishchilar"],
        answer: [0, 1, 2],
        hint: "💡 O'zak → kasb → ko'plik",
        explain: "Har qadamda qo'shimcha qo'shilib, ma'no boyiydi.",
      },
      {
        type: "choice",
        prompt: "'Toshkentlik' so'zida qaysi qo'shimcha bor?",
        options: ["-da", "-lik", "-gan", "-ni"],
        answer: 1,
        explain: "-lik joyga mansublikni bildiradi: Toshkent + lik.",
      },
    ],
  },
  {
    id: "b-3",
    phaseId: 2,
    index: 3,
    globalIndex: 7,
    title: "So'z Yasalishi",
    subtitle: "Murakkab so'zlar",
    emoji: "⚒️",
    durationMin: 13,
    xp: 80,
    cards: [
      {
        type: "intro",
        title: "Ikkita so'z — bitta ma'no",
        hook:
          "O'zbek tilida ikki so'z birikib yangi tushuncha yaratadi: qo'lbola, temir yo'l, sariq sariyog'.",
      },
      {
        type: "rule",
        title: "Qo'shma so'zlar",
        rule:
          "Ikkita o'zak qo'shilib bir tushunchani bildiradi. Ba'zilari qo'shib, ba'zilari ajratib yoziladi.",
        examples: [
          [{ text: "ko'l + bola = ko'lbola" }],
          [{ text: "temir + yo'l = temir yo'l" }],
          [{ text: "bel + bog' = belbog'" }],
        ],
      },
      {
        type: "examples",
        title: "Juft so'zlar",
        sentences: [
          [{ text: "ota-ona, opa-singil" }],
          [{ text: "kelin-kuyov, ish-faoliyat" }],
          [{ text: "kun-tun, ko'cha-ko'y" }],
        ],
        note: "Juft so'zlar — yaqin ma'noli so'zlar tire bilan yoziladi.",
      },
      {
        type: "tap",
        title: "Qo'shma so'zni toping",
        prompt: "Qo'shma so'zni bosing",
        sentence: [
          { text: "katta" },
          { text: "qo'lbola", role: "ega" },
          { text: "bola" },
        ],
        targetRole: "ega",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Nemis tilida qo'shma so'zlar juda uzun bo'ladi (Donaudampfschiffahrt!). O'zbek tilida ham qo'shma so'zlar mavjud, lekin qisqaroq.",
      },
      { type: "outro", title: "So'z yasash — ijoddir!", xp: 80 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "Qaysi so'z — qo'shma so'z?",
        options: ["maktab", "kitobxona", "uy", "olma"],
        answer: 1,
        explain: "Kitob + xona = kitobxona — ikki o'zakdan tashkil topgan.",
      },
      {
        type: "truefalse",
        prompt: "'Ota-ona' — juft so'z.",
        claim: "Ikkita yaqin ma'noli so'z tire bilan birga yozilgan.",
        answer: true,
        explain: "Bu — juft so'z, yaqin ma'no.",
      },
      {
        type: "fill",
        prompt: "Juft so'z hosil qiling",
        before: "kun",
        after: "(qarshilik)",
        options: ["-tun", "-larda", "-ga", "-dan"],
        answer: 0,
        explain: "Kun-tun — antonim juftlik, juft so'z.",
      },
      {
        type: "order",
        prompt: "Qo'shma so'zga ajrating",
        chips: ["temir", "yo'l"],
        answer: [0, 1],
        hint: "💡 Material + obyekt",
        explain: "Temir yo'l — temirdan qurilgan yo'l.",
      },
      {
        type: "choice",
        prompt: "Qaysi tartibda qo'shma so'z to'g'ri yoziladi?",
        options: ["kitob xona", "kitobxona", "kitob-xona", "kitob/xona"],
        answer: 1,
        explain: "Qo'shib yoziladi — bir ma'noni bildiradi.",
      },
    ],
  },
  {
    id: "b-4",
    phaseId: 2,
    index: 4,
    globalIndex: 8,
    title: "Ko'plik va Birlik",
    subtitle: "-lar qo'shimchasi",
    emoji: "🔢",
    durationMin: 12,
    xp: 85,
    badgeId: "soz-ustasi",
    cards: [
      {
        type: "intro",
        title: "Bir — ko'p",
        hook:
          "O'zbek tilida ko'plik -lar qo'shimchasi bilan hosil qilinadi. Lekin bir nechta nozik holatlar ham bor.",
      },
      {
        type: "rule",
        title: "Ko'plik hosil qilish",
        rule: "Birlik shaklga -lar qo'shamiz.",
        examples: [
          [{ text: "kitob → kitoblar" }],
          [{ text: "bola → bolalar" }],
          [{ text: "talaba → talabalar" }],
        ],
      },
      {
        type: "examples",
        title: "Ko'plik shakli kerak emas paytlar",
        sentences: [
          [{ text: "uch bola (sondan keyin -lar yo'q)" }],
          [{ text: "ko'p kitob (miqdor so'zlardan keyin)" }],
          [{ text: "bir-ikki gap" }],
        ],
        note:
          "Aniq son yoki miqdor ko'rsatilsa, -lar qo'shimchasini takrorlamaslik kerak.",
      },
      {
        type: "tap",
        title: "Ko'plik shaklni toping",
        prompt: "Ko'plikdagi otni bosing",
        sentence: [
          { text: "bir" },
          { text: "uy" },
          { text: "uylar", role: "ega" },
        ],
        targetRole: "ega",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida ko'plik -s qo'shimchasi bilan: book → books. Lekin istisnolar bor: child → children, foot → feet. O'zbek tilida -lar deyarli har doim ishlaydi.",
      },
      { type: "outro", title: "Phase 2 ni tugatdingiz! 🌿→🏞️", xp: 85 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "Qaysi gapda ko'plik to'g'ri ishlatilgan?",
        options: [
          "Ikki bolalar keldi",
          "Bolalar keldi",
          "Ikki bola keldi",
          "B va C to'g'ri",
        ],
        answer: 3,
        explain:
          "Aniq sondan keyin -lar shart emas, lekin sondan tashqari -lar mumkin.",
      },
      {
        type: "fill",
        prompt: "Ko'plikni hosil qiling",
        before: "talaba",
        after: "—",
        options: ["+lar", "+da", "+ga", "+ni"],
        answer: 0,
        explain: "Talaba → talabalar — eng oddiy ko'plik.",
      },
      {
        type: "truefalse",
        prompt: "'Ko'p odamlar' — to'g'ri ifoda.",
        claim: "Miqdor so'zidan keyin -lar takrorlanmaydi.",
        answer: false,
        explain: "To'g'risi: 'ko'p odam'. Miqdor so'zi -lar bilan takrorlanmaydi.",
      },
      {
        type: "tap",
        prompt: "Ko'plikdagi otni toping: 'Bola kitoblar o'qiydi'",
        sentence: ["Bola", "kitoblar", "o'qiydi"],
        answerIndex: 1,
        explain: "Kitoblar — ko'plik shaklida (kitob + lar).",
      },
      {
        type: "order",
        prompt: "To'g'ri tartibda joylashtiring",
        chips: ["uch", "talaba", "keldi"],
        answer: [0, 1, 2],
        hint: "💡 Son + ot + kesim",
        explain: "Aniq son bo'lganda -lar shart emas.",
      },
    ],
  },

  /* =========================================
   * PHASE 3 — DARYO (So'z Turkumlari)
   * ========================================= */
  {
    id: "d-1",
    phaseId: 3,
    index: 1,
    globalIndex: 9,
    title: "Ot So'z Turkumi",
    subtitle: "Predmet · Shaxs · Joy",
    emoji: "📚",
    durationMin: 14,
    xp: 90,
    cards: [
      {
        type: "intro",
        title: "Ot — gapning bosh ishtirokchisi",
        hook:
          "Otlar bizning olamizdagi predmet, shaxs, joy va tushunchalarni nomlaydi.",
      },
      {
        type: "rule",
        title: "Ot turlari",
        rule:
          "Konkret ot — qo'l bilan tutiladigan (stol). Mavhum ot — sezilmaydi (sevgi, vatan).",
        examples: [
          [
            { text: "Konkret: stol, daraxt, kitob", role: "ega" },
          ],
          [
            { text: "Mavhum: sevgi, vatan, bilim", role: "ega" },
          ],
        ],
      },
      {
        type: "examples",
        title: "Otlarning kelishik shakllari",
        sentences: [
          [{ text: "uy — bosh kelishik" }],
          [{ text: "uy+ni — tushum kelishigi" }],
          [{ text: "uy+da — o'rin-payt" }],
          [{ text: "uy+ga — jo'nalish" }],
        ],
      },
      {
        type: "tap",
        title: "Otni toping",
        prompt: "Mavhum otni bosing",
        sentence: [
          { text: "Katta" },
          { text: "sevgi", role: "ega" },
          { text: "kuchli" },
        ],
        targetRole: "ega",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida atoqli otlar har doim katta harf bilan — xuddi o'zbek tilidagi kabi: Tashkent, Anvar.",
      },
      { type: "outro", title: "Otlar — fikrning ramkasidir!", xp: 90 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "Quyidagilardan qaysi biri mavhum ot?",
        options: ["stol", "kitob", "do'stlik", "uy"],
        answer: 2,
        explain: "Do'stlik — qo'l bilan tutilmas tushuncha, mavhum ot.",
      },
      {
        type: "tap",
        prompt: "Otni toping: 'Talaba bilimga intiladi'",
        sentence: ["Talaba", "bilimga", "intiladi"],
        answerIndex: 0,
        explain: "Talaba — kim? savoliga javob, asosiy ot (ega).",
      },
      {
        type: "truefalse",
        prompt: "Otlar gapda har xil rolda kelishi mumkin.",
        claim: "Ega, to'ldiruvchi, aniqlovchi — barcha rollarda.",
        answer: true,
        explain: "Otlar gapning eng faol qatnashchilari.",
      },
      {
        type: "fill",
        prompt: "O'rin kelishigini hosil qiling",
        before: "Bog'",
        after: "gulladi",
        options: ["+da", "+ni", "+ga", "+dan"],
        answer: 0,
        explain: "Bog'+da = bog'da — qayerda? savoliga javob.",
      },
      {
        type: "choice",
        prompt: "Konkret otni toping",
        options: ["fikr", "sevgi", "stol", "bilim"],
        answer: 2,
        explain: "Stol — ko'rinadi, ushlanadi, demak konkret ot.",
      },
    ],
  },
  {
    id: "d-2",
    phaseId: 3,
    index: 2,
    globalIndex: 10,
    title: "Fe'l va Zamonlar",
    subtitle: "Harakat · Holat",
    emoji: "⚡",
    durationMin: 15,
    xp: 95,
    cards: [
      {
        type: "intro",
        title: "Fe'l — gapning harakatlantiruvchisi",
        hook:
          "Fe'l harakat, holat yoki o'zgarishni bildiradi. Savol: nima qildi? nima qilyapti?",
      },
      {
        type: "rule",
        title: "Zamonlar",
        rule: "O'zbek tilida 3 ta asosiy zamon: o'tgan, hozirgi, kelasi.",
        examples: [
          [{ text: "bordi — o'tgan zamon" }],
          [{ text: "bormoqda — hozirgi zamon" }],
          [{ text: "boradi — kelasi zamon" }],
        ],
      },
      {
        type: "examples",
        title: "Fe'l shaxs qo'shimchalari",
        sentences: [
          [{ text: "Men bor+a+man" }],
          [{ text: "Sen bor+a+san" }],
          [{ text: "U bor+a+di" }],
          [{ text: "Biz bor+a+miz" }],
        ],
        note: "Fe'l shaxs va songa qarab o'zgaradi.",
      },
      {
        type: "tap",
        title: "Fe'lni toping",
        prompt: "Kesimni bosing",
        sentence: [
          { text: "Bola" },
          { text: "tez" },
          { text: "yugurdi", role: "kesim" },
        ],
        targetRole: "kesim",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida 12 ta zamon shakli bor (Past Simple, Present Perfect, Future Continuous...). Lekin barchasi o'zbek tilidagi 3 zamondan kelib chiqadi.",
      },
      { type: "outro", title: "Zamonlar — vaqtga ega bo'ldingiz!", xp: 95 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "'Borgan' fe'li qaysi zamonda?",
        options: ["hozirgi", "o'tgan", "kelasi", "buyruq"],
        answer: 1,
        explain: "-gan qo'shimchasi o'tgan zamonni bildiradi.",
      },
      {
        type: "fill",
        prompt: "Kelasi zamon shaklini tanlang",
        before: "Men maktabga",
        after: "",
        options: ["bordim", "boraman", "bormoqdaman", "borganman"],
        answer: 1,
        explain: "'Boraman' — kelasi zamon, 1-shaxs birlik.",
      },
      {
        type: "tap",
        prompt: "Fe'lni toping: 'Akam kitobni o'qidi'",
        sentence: ["Akam", "kitobni", "o'qidi"],
        answerIndex: 2,
        explain: "O'qidi — nima qildi? savoliga javob, demak fe'l (kesim).",
      },
      {
        type: "truefalse",
        prompt: "O'zbek tilida 3 ta asosiy zamon bor.",
        claim: "O'tgan, hozirgi va kelasi.",
        answer: true,
        explain: "Boshqa nozik shakllar bo'lsa-da, asosi shu uchtasi.",
      },
      {
        type: "order",
        prompt: "Tartibga keltiring",
        chips: ["Men", "kitobni", "o'qidim"],
        answer: [0, 1, 2],
        hint: "💡 EGA → TO'LDIRUVCHI → KESIM",
        explain: "Standart o'zbek gap tartibi.",
      },
    ],
  },
  {
    id: "d-3",
    phaseId: 3,
    index: 3,
    globalIndex: 11,
    title: "Sifat darajalari",
    subtitle: "Oddiy · Qiyosiy · Orttirma",
    emoji: "📈",
    durationMin: 14,
    xp: 100,
    cards: [
      {
        type: "intro",
        title: "Sifatlarni solishtiraylik",
        hook:
          "Sifat 3 darajaga ega: oddiy (yaxshi), qiyosiy (yaxshiroq), orttirma (eng yaxshi).",
      },
      {
        type: "rule",
        title: "Sifat darajalarini hosil qilish",
        rule:
          "Qiyosiy daraja -roq qo'shimchasi bilan, orttirma daraja 'eng' so'zi bilan.",
        examples: [
          [{ text: "katta — kattaroq — eng katta" }],
          [{ text: "yaxshi — yaxshiroq — eng yaxshi" }],
          [{ text: "shirin — shirinroq — eng shirin" }],
        ],
      },
      {
        type: "examples",
        title: "Misollar gap ichida",
        sentences: [
          [
            { text: "Bu olma", role: undefined },
            { text: "shirin", role: "aniqlovchi" },
          ],
          [
            { text: "Bu olma", role: undefined },
            { text: "shirinroq", role: "aniqlovchi" },
          ],
          [
            { text: "Bu — ", role: undefined },
            { text: "eng shirin", role: "aniqlovchi" },
            { text: " olma", role: undefined },
          ],
        ],
      },
      {
        type: "tap",
        title: "Orttirma darajani toping",
        prompt: "Orttirma darajadagi sifatni bosing",
        sentence: [
          { text: "yaxshi" },
          { text: "yaxshiroq" },
          { text: "eng yaxshi", role: "aniqlovchi" },
        ],
        targetRole: "aniqlovchi",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida ham 3 daraja bor: good → better → best. Xuddi shu mantiqda! O'zbekcha bilgan — inglizcha tushundi.",
      },
      { type: "outro", title: "Sifatlar — taqqoslash qudratiga ega!", xp: 100 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "'Eng katta' — qaysi daraja?",
        options: ["oddiy", "qiyosiy", "orttirma", "kichiklatma"],
        answer: 2,
        explain: "'Eng' so'zi orttirma darajani bildiradi.",
      },
      {
        type: "fill",
        prompt: "Qiyosiy darajani hosil qiling",
        before: "U mendan",
        after: "",
        options: ["aqlli", "aqlliroq", "eng aqlli", "aqllimi"],
        answer: 1,
        explain: "-roq qo'shimchasi qiyosiy darajani hosil qiladi.",
      },
      {
        type: "truefalse",
        prompt: "Orttirma daraja 'eng' so'zi bilan ifodalanadi.",
        claim: "'Eng yaxshi', 'eng katta' — orttirma darajadir.",
        answer: true,
        explain: "Aynan shunday.",
      },
      {
        type: "tap",
        prompt: "Qiyosiy darajadagi sifatni toping",
        sentence: ["Bu", "kitob", "qiziqroq"],
        answerIndex: 2,
        explain: "Qiziqroq — qiyosiy daraja (-roq).",
      },
      {
        type: "order",
        prompt: "Darajalarni tartibga keltiring",
        chips: ["chiroyli", "chiroyliroq", "eng chiroyli"],
        answer: [0, 1, 2],
        hint: "💡 Oddiy → qiyosiy → orttirma",
        explain: "Daraja ortib boradi.",
      },
    ],
  },
  {
    id: "d-4",
    phaseId: 3,
    index: 4,
    globalIndex: 12,
    title: "Ravish, Olmosh, Bog'lovchi",
    subtitle: "Yordamchi so'z turkumlari",
    emoji: "🔗",
    durationMin: 15,
    xp: 100,
    badgeId: "turkum-bilimdon",
    cards: [
      {
        type: "intro",
        title: "Yordamchi turkumlar",
        hook:
          "Olmosh — ot o'rnida (men, sen, u). Ravish — harakat belgisi (tez). Bog'lovchi — gaplarni bog'laydi (va, lekin).",
      },
      {
        type: "rule",
        title: "Olmosh — Kim? Nima?",
        rule: "Olmosh ot o'rnida ishlatiladi.",
        examples: [
          [{ text: "men, sen, u (kishilik)" }],
          [{ text: "bu, shu, o'sha (ko'rsatish)" }],
          [{ text: "kim?, nima? (so'roq)" }],
        ],
      },
      {
        type: "examples",
        title: "Bog'lovchilar",
        sentences: [
          [{ text: "va — qo'shilish: men VA sen" }],
          [{ text: "lekin — qarshilik: borardim LEKIN ulgurmadim" }],
          [{ text: "chunki — sabab: keldim CHUNKI sog'indim" }],
        ],
      },
      {
        type: "tap",
        title: "Olmoshni toping",
        prompt: "Olmoshni bosing",
        sentence: [
          { text: "Kitob" },
          { text: "men", role: "ega" },
          { text: "ga" },
        ],
        targetRole: "ega",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida bog'lovchilar bir xil ma'noda: and (va), but (lekin), because (chunki). Mantiq bir xil — faqat so'z boshqa.",
      },
      { type: "outro", title: "Phase 3 ni tugatdingiz! 🏞️→🌊", xp: 100 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "Qaysi so'z — olmosh?",
        options: ["bola", "men", "yaxshi", "tez"],
        answer: 1,
        explain: "Men — kishilik olmoshi (ot o'rnida).",
      },
      {
        type: "fill",
        prompt: "Bog'lovchini qo'shing",
        before: "Borardim",
        after: "ulgurmadim",
        options: ["va", "lekin", "chunki", "agar"],
        answer: 1,
        explain: "'Lekin' qarshilikni bildiradi.",
      },
      {
        type: "tap",
        prompt: "Bog'lovchini toping: 'Akam va opam keldi'",
        sentence: ["Akam", "va", "opam", "keldi"],
        answerIndex: 1,
        explain: "'Va' — bog'lovchi, ikki egani birlashtiradi.",
      },
      {
        type: "truefalse",
        prompt: "'U' — ko'rsatish olmoshi.",
        claim: "U — uchinchi shaxs kishilik olmoshi.",
        answer: false,
        explain: "U — kishilik olmoshi. 'Bu/shu/o'sha' ko'rsatish olmoshi.",
      },
      {
        type: "order",
        prompt: "Tartibga keltiring",
        chips: ["Men", "va", "do'stim", "keldik"],
        answer: [0, 1, 2, 3],
        hint: "💡 Egalar bog'lovchi bilan birikadi",
        explain: "Olmosh + bog'lovchi + ot + kesim — to'g'ri tartib.",
      },
    ],
  },

  /* =========================================
   * PHASE 4 — DENGIZ (Gap Bo'laklari)
   * ========================================= */
  {
    id: "dn-1",
    phaseId: 4,
    index: 1,
    globalIndex: 13,
    title: "Ega — gap Egasi",
    subtitle: "Kim? Nima?",
    emoji: "🟦",
    durationMin: 15,
    xp: 110,
    cards: [
      {
        type: "intro",
        title: "Ega — gapning yuragi",
        hook:
          "Ega — gapda KIM yoki NIMA harakat qilayotganini bildiradi. Endi rang kodi bilan!",
      },
      {
        type: "rule",
        title: "EGA = ko'k rang 🔵",
        rule:
          "Bundan keyin har bir gapda ega ko'k rang bilan belgilanadi. Esda tuting!",
        example: [
          { text: "Kamola", role: "ega" },
          { text: "maktabga", role: "ega" },
          { text: "bordi", role: "kesim" },
        ],
      },
      {
        type: "examples",
        title: "Egalarni rangda ko'ring",
        sentences: [
          [
            { text: "Kitob", role: "ega" },
            { text: " stolda yotibdi" },
          ],
          [
            { text: "Akam", role: "ega" },
            { text: " kelyapti" },
          ],
          [
            { text: "Bahor", role: "ega" },
            { text: " keldi" },
          ],
        ],
      },
      {
        type: "tap",
        title: "Egani bosing",
        prompt: "Ko'k rang bilan EGA ni belgilang",
        sentence: [
          { text: "Onam", role: "ega" },
          { text: "ovqat" },
          { text: "pishirdi" },
        ],
        targetRole: "ega",
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida ega doim oldida keladi: 'I went' (men ketdim). Lekin o'zbek tilida ega ham boshida — bu erda farq yo'q. Asosiy farq kesim joyida.",
      },
      { type: "outro", title: "Egani bildingiz — gapning yuragi!", xp: 110 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "Egani toping: 'Bola kitobni o'qidi'",
        options: ["Bola", "kitobni", "o'qidi", "kitob"],
        answer: 0,
        explain: "Bola — kim o'qidi? savoliga javob, demak ega.",
      },
      {
        type: "tap",
        prompt: "Egani toping: 'Bahor erta keldi'",
        sentence: ["Bahor", "erta", "keldi"],
        answerIndex: 0,
        explain: "Bahor — nima keldi? javobi, ega.",
      },
      {
        type: "truefalse",
        prompt: "Egasiz gap ham bo'lishi mumkin.",
        claim: "Buyruq gaplarda ('Bor!') ega yashirin bo'ladi.",
        answer: true,
        explain: "'Bor!' = '(Sen) bor!' — ega yashirin.",
      },
      {
        type: "fill",
        prompt: "Egani qo'shing",
        before: "",
        after: "har kuni yuguradi",
        options: ["U", "Tez", "Yaxshi", "Bordi"],
        answer: 0,
        explain: "U — kim yuguradi? Ega bo'la oladigan yagona so'z.",
      },
      {
        type: "order",
        prompt: "Tartibga keltiring",
        chips: ["Kitob", "stolda", "yotibdi"],
        answer: [0, 1, 2],
        hint: "💡 EGA → JOY → KESIM",
        explain: "Standart tartib: ega birinchi.",
      },
    ],
  },
  {
    id: "dn-2",
    phaseId: 4,
    index: 2,
    globalIndex: 14,
    title: "Kesim — gap Yuragi",
    subtitle: "Nima qildi? Qanday?",
    emoji: "🟥",
    durationMin: 15,
    xp: 110,
    cards: [
      {
        type: "intro",
        title: "Kesim — harakat va holat",
        hook:
          "Kesim — gapda eganing nima qilganini yoki qanaqaligini bildiradi. Rang: qizil 🔴.",
      },
      {
        type: "rule",
        title: "KESIM = qizil rang 🔴",
        rule:
          "O'zbek tilida kesim ko'pincha gap oxirida turadi. Bu — eng katta farqlardan biri.",
        example: [
          { text: "Men", role: "ega" },
          { text: " maktabga " },
          { text: "bordim", role: "kesim" },
        ],
      },
      {
        type: "examples",
        title: "Kesim turlari",
        sentences: [
          [
            { text: "U", role: "ega" },
            { text: " ", role: undefined },
            { text: "shifokor", role: "kesim" },
            { text: " (ot kesim)" },
          ],
          [
            { text: "Bola", role: "ega" },
            { text: " ", role: undefined },
            { text: "charchagan", role: "kesim" },
            { text: " (sifat kesim)" },
          ],
          [
            { text: "Biz", role: "ega" },
            { text: " ", role: undefined },
            { text: "o'qiymiz", role: "kesim" },
            { text: " (fe'l kesim)" },
          ],
        ],
      },
      {
        type: "tap",
        title: "Kesimni bosing",
        prompt: "Qizil rang bilan KESIM ni belgilang",
        sentence: [
          { text: "Bog'da", role: undefined },
          { text: "qushlar", role: "ega" },
          { text: "sayraydi", role: "kesim" },
        ],
        targetRole: "kesim",
      },
      {
        type: "note",
        title: "💡 Eslatma — eng muhim farq",
        body:
          "O'zbek: 'Men maktabga bordim' — kesim OXIRDA. Ingliz: 'I went to school' — kesim 2-O'RINDA. Bu — chet til o'rganganda eng ko'p qiynaladigan joy.",
      },
      { type: "outro", title: "Kesimni bildingiz — fikr to'liq!", xp: 110 },
    ],
    quiz: [
      {
        type: "choice",
        prompt: "Kesimni toping: 'Yomg'ir kechqurun yog'di'",
        options: ["Yomg'ir", "kechqurun", "yog'di", "yog'"],
        answer: 2,
        explain: "Yog'di — nima qildi? savoliga javob, kesim.",
      },
      {
        type: "tap",
        prompt: "Kesimni toping: 'U shifokor edi'",
        sentence: ["U", "shifokor", "edi"],
        answerIndex: 2,
        explain: "Edi — kesimning yordamchi qismi (bog'lama).",
      },
      {
        type: "truefalse",
        prompt: "O'zbek tilida kesim ko'pincha oxirda keladi.",
        claim: "'Men kitob o'qiyman' — kesim 'o'qiyman' oxirda.",
        answer: true,
        explain: "Bu — o'zbek gapining tabiiy tuzilishi.",
      },
      {
        type: "fill",
        prompt: "Kesimni qo'shing",
        before: "U mashhur",
        after: "edi",
        options: ["shoir", "tez", "katta", "mashina"],
        answer: 0,
        explain: "Shoir — ot kesim shaklida (kim edi?).",
      },
      {
        type: "order",
        prompt: "To'g'ri tartibni tuzing",
        chips: ["Bolalar", "bog'da", "o'ynashyapti"],
        answer: [0, 1, 2],
        hint: "💡 EGA → JOY → KESIM",
        explain: "Standart o'zbek tartibi.",
      },
    ],
  },
  {
    id: "dn-3",
    phaseId: 4,
    index: 3,
    globalIndex: 15,
    title: "To'ldiruvchi va Aniqlovchi",
    subtitle: "🟩 Yashil · 🟨 Sariq",
    emoji: "🎨",
    durationMin: 16,
    xp: 120,
    cards: [
      {
        type: "intro",
        title: "Gapni rang bilan to'ldiramiz",
        hook:
          "To'ldiruvchi — yashil 🟢 (Nimani? Kimga?). Aniqlovchi — sariq 🟡 (Qanday? Qaysi?).",
      },
      {
        type: "rule",
        title: "To'ldiruvchi — yashil 🟢",
        rule:
          "To'ldiruvchi kesim talab qilgan savolga javob beradi: nimani, kimga, kim bilan...",
        example: [
          { text: "Men", role: "ega" },
          { text: " ", role: undefined },
          { text: "kitobni", role: "toldiruvchi" },
          { text: " ", role: undefined },
          { text: "o'qiyman", role: "kesim" },
        ],
      },
      {
        type: "rule",
        title: "Aniqlovchi — sariq 🟡",
        rule: "Aniqlovchi ot oldidan keladi va uni tavsiflaydi.",
        example: [
          { text: "katta", role: "aniqlovchi" },
          { text: " ", role: undefined },
          { text: "uy", role: "ega" },
          { text: " ", role: undefined },
          { text: "ko'rindi", role: "kesim" },
        ],
      },
      {
        type: "tap",
        title: "Aniqlovchini bosing",
        prompt: "Sariq rang bilan ANIQLOVCHI ni belgilang",
        sentence: [
          { text: "Yangi", role: "aniqlovchi" },
          { text: "kitob", role: "ega" },
          { text: "keldi", role: "kesim" },
        ],
        targetRole: "aniqlovchi",
      },
      {
        type: "build",
        title: "Ranglarga ajrating",
        prompt: "Har bir so'zni o'z rolida joylashtiring",
        chips: [
          { text: "Men", role: "ega" },
          { text: "qizil", role: "aniqlovchi" },
          { text: "olma", role: "toldiruvchi" },
          { text: "yedim", role: "kesim" },
        ],
        slots: ["ega", "aniqlovchi", "toldiruvchi", "kesim"],
      },
      {
        type: "note",
        title: "💡 Eslatma",
        body:
          "Ingliz tilida ham aniqlovchi otdan oldin keladi: 'big house' (katta uy). Tartib bir xil!",
      },
      { type: "outro", title: "Ranglar bilan gapni ko'rdingiz!", xp: 120 },
    ],
    quiz: [
      {
        type: "tap",
        prompt: "Aniqlovchini toping: 'Yashil daraxt salqin soya beradi'",
        sentence: ["Yashil", "daraxt", "salqin", "soya", "beradi"],
        answerIndex: 0,
        explain: "Yashil — qanday daraxt? Aniqlovchi.",
      },
      {
        type: "choice",
        prompt: "To'ldiruvchini toping: 'Onam menga sovg'a berdi'",
        options: ["Onam", "menga", "sovg'a", "berdi"],
        answer: 2,
        explain: "Sovg'a — nimani berdi? Tushum kelishigida to'ldiruvchi.",
      },
      {
        type: "truefalse",
        prompt: "Aniqlovchi ko'pincha otdan oldin keladi.",
        claim: "'Katta uy' to'g'ri, 'uy katta' tarkibida emas.",
        answer: true,
        explain: "Standart tartib: aniqlovchi + ot.",
      },
      {
        type: "fill",
        prompt: "Aniqlovchini qo'shing",
        before: "",
        after: "olma shirin",
        options: ["Qizil", "Tez", "Kecha", "Yaxshi"],
        answer: 0,
        explain: "Qizil — qaysi olma? Aniqlovchi.",
      },
      {
        type: "order",
        prompt: "Tartibga keltiring",
        chips: ["Kichik", "qush", "uchib ketdi"],
        answer: [0, 1, 2],
        hint: "💡 ANIQLOVCHI → EGA → KESIM",
        explain: "Aniqlovchi avval, keyin ot, keyin kesim.",
      },
    ],
  },
  {
    id: "dn-4",
    phaseId: 4,
    index: 4,
    globalIndex: 16,
    title: "Hol — gapning Bezagi",
    subtitle: "🟣 Vaqt · Joy · Sabab",
    emoji: "🟣",
    durationMin: 16,
    xp: 130,
    badgeId: "gap-quruvchi",
    cards: [
      {
        type: "intro",
        title: "Hol — gapga ma'no bo'yog'i",
        hook:
          "Hol — Qachon? Qayerda? Qanday? Nima uchun? savollariga javob beradi. Rang: binafsha 🟣.",
      },
      {
        type: "rule",
        title: "Hol turlari",
        rule:
          "Vaqt holi (kecha), o'rin holi (maktabda), ravish holi (tez), sabab holi (qo'rqib).",
        examples: [
          [
            { text: "Men", role: "ega" },
            { text: " ", role: undefined },
            { text: "kecha", role: "hol" },
            { text: " keldim", role: "kesim" },
          ],
          [
            { text: "Akam", role: "ega" },
            { text: " ", role: undefined },
            { text: "maktabda", role: "hol" },
            { text: " ishlaydi", role: "kesim" },
          ],
        ],
      },
      {
        type: "examples",
        title: "To'liq gap — barcha rangda",
        sentences: [
          [
            { text: "Men", role: "ega" },
            { text: " " },
            { text: "kecha", role: "hol" },
            { text: " " },
            { text: "yangi", role: "aniqlovchi" },
            { text: " " },
            { text: "kitobni", role: "toldiruvchi" },
            { text: " " },
            { text: "o'qidim", role: "kesim" },
          ],
        ],
        note:
          "Ko'k EGA + binafsha HOL + sariq ANIQLOVCHI + yashil TO'LDIRUVCHI + qizil KESIM. Hammasi joyida!",
      },
      {
        type: "tap",
        title: "Vaqt holini bosing",
        prompt: "Vaqt holini belgilang",
        sentence: [
          { text: "Men" },
          { text: "ertalab", role: "hol" },
          { text: "uyg'ondim" },
        ],
        targetRole: "hol",
      },
      {
        type: "note",
        title: "💡 Eslatma — eng katta farq",
        body:
          "O'zbek: 'Men KECHA maktabda o'qidim' — vaqt boshlang'ich. Ingliz: 'I studied at school YESTERDAY' — vaqt OXIRGA o'tadi! Eslab qoling.",
      },
      {
        type: "outro",
        title: "Phase 4 ni tugatdingiz! 🌊→🌍 Poydevor tayyor!",
        xp: 130,
      },
    ],
    quiz: [
      {
        type: "tap",
        prompt: "Vaqt holini toping: 'Biz kecha kinoga bordik'",
        sentence: ["Biz", "kecha", "kinoga", "bordik"],
        answerIndex: 1,
        explain: "Kecha — qachon? Vaqt holi.",
      },
      {
        type: "choice",
        prompt: "O'rin holini toping: 'Bola bog'da o'ynaydi'",
        options: ["Bola", "bog'da", "o'ynaydi", "bog'"],
        answer: 1,
        explain: "Bog'da — qayerda? O'rin holi.",
      },
      {
        type: "truefalse",
        prompt: "Hol gap mazmunini boyitadi.",
        claim: "Hol vaqt, joy, sabab kabi ma'lumotlarni qo'shadi.",
        answer: true,
        explain: "Holsiz gap quruq bo'ladi.",
      },
      {
        type: "fill",
        prompt: "Vaqt holini qo'shing",
        before: "Men",
        after: "uxlayman",
        options: ["kechqurun", "kitob", "tez", "katta"],
        answer: 0,
        explain: "Kechqurun — qachon? Vaqt holi.",
      },
      {
        type: "order",
        prompt: "5 rang bilan to'liq gap qurushing",
        chips: ["Men", "kecha", "yangi", "kitobni", "o'qidim"],
        answer: [0, 1, 2, 3, 4],
        hint: "💡 EGA → HOL → ANIQLOVCHI → TO'LDIRUVCHI → KESIM",
        explain: "Standart to'liq tartib — 5 rangda.",
      },
    ],
  },
];

/* =================================================================
 * Indexes — quick lookups
 * ================================================================= */
export function stoneById(id: string): Stone | undefined {
  return STONES.find((s) => s.id === id);
}

export function phaseById(id: number): Phase | undefined {
  return PHASES.find((p) => p.id === id);
}

export function stonesInPhase(phaseId: number): Stone[] {
  return STONES.filter((s) => s.phaseId === phaseId);
}

export function totalStones(): number {
  return STONES.length;
}

export function nextStone(currentId: string): Stone | undefined {
  const idx = STONES.findIndex((s) => s.id === currentId);
  if (idx === -1 || idx === STONES.length - 1) return undefined;
  return STONES[idx + 1];
}

export function previousStone(currentId: string): Stone | undefined {
  const idx = STONES.findIndex((s) => s.id === currentId);
  if (idx <= 0) return undefined;
  return STONES[idx - 1];
}
