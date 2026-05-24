# Poydevor — Ona tilingni bil, dunyoni zabt et 🌊

Hackathon MVP — o'zbek tili grammatikasini "Ko'lmakdan Okeangacha" konseptsiyasi orqali zamonaviy, o'yinga aylantirilgan tarzda o'rgatuvchi platforma.

> "Ona tilini bilgan odam istalgan chet tilini bir necha barobar tez o'rganadi —
>  chunki grammatika tushunchalari allaqachon ona tilida o'rnatilgan bo'ladi."

## Demo flow (hakamlar uchun 4 daqiqa)

1. **Onboarding** — 4 ta slide: salom va "Ko'lmakdan Okeangacha" metaforasi, muammoning sababi, o'qitish usuli, va hisob (email + ism) yaratish.
2. **Diagnostika** — 10 ta interaktiv savol (multi-choice va tartiblash) foydalanuvchi qaysi bosqichdan boshlashini aniqlaydi: ≥90% → Daryo, 60–89% → Buloq, <60% → Ko'lmak.
3. **Bosh sahifa** — joriy bosqich heroi, Level/XP, kunlik vazifa, statistika, so'nggi faoliyat, kun maqoli.
4. **Xarita** — 5 ta bosqichlik daryo yo'lagi, 16 ta tosh, oqim animatsiyasi, qulflar va o'tilgan toshlar.
5. **Darslar** — barcha darslar ro'yxati (filtr: hammasi / tugagan / joriy / qulflangan), davomiylik va yulduzlar bilan.
6. **Dars** — turli turdagi kartochkalar (intro, qoida, misol, tap, build, 💡 chet tili eslatmasi, outro), ranglar bilan kodlangan grammatika.
7. **Mashqlar** — bosqich bo'yicha mashqlar ro'yxati, ball va urinishlar bilan.
8. **Mashq** — har bir tosh uchun 5 xil savol turi (choice, tap, fill, true/false, order), Junior uchun yuraklar, 3 yulduzli reyting, konfetti.
9. **Yutuqlar / Sertifikat** — 8 ta badge, shareable sertifikat.
10. **Tahlil** — har bosqich bo'yicha o'rtacha ball, zaif toshlar, faollik tarixi, XP progressi.
11. **Profil** — ism va email, daraja halqasi, statistika, Junior↔Senior almashtirish, ovoz toggle, hisobdan chiqish, reset.

Top barda **Mobile / Desktop** toggle bor — qaysi rejimda ko'rinishini hozirning o'zida ko'rishingiz mumkin.

## Asosiy konsepsiyalar

- **Ko'lmakdan Okeangacha** — 5 bosqichli sayohat (Ko'lmak 💧 → Buloq 🌿 → Daryo 🏞️ → Dengiz 🌊 → Okean 🌍). MVP'da 1–4 bosqichlarda 16 ta tosh, Okean bosqichi yakuniy nuqta sifatida turadi.
- **Ranglar bilan grammatika** — EGA 🔵, KESIM 🔴, TO'LDIRUVCHI 🟢, ANIQLOVCHI 🟡, RAVISH 🟣, HOL 🩵. Bu ranglar butun ilova bo'ylab izchil ishlatiladi.
- **Junior va Senior** — bir xil kontent, ikki xil taqdimot. Junior: yuraklar, XP, konfetti, ovoz. Senior: minimalist, ovozsiz. Rejim profilda o'zgartiriladi (standart — Junior).
- **💡 Eslatma** — chet til mavzulariga (predlog, artikl) muhim joyda qisqa, interaktiv bo'lmagan ko'rsatmalar. Asosiy o'qish o'zbek tilida.

## Stack

- **Next.js 16.2.6** App Router (client-side SPA)
- **React 19.2.4** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/postcss`, `@theme inline`)
- **Zustand 5** + `persist` middleware → `localStorage`
- **Framer Motion 12** — animatsiya va o'tishlar
- **lucide-react** — ikonkalar
- **Web Audio API** — ovoz effektlari (fayllarsiz, ton sintezi)
- **Google Fonts** — `Plus Jakarta Sans` (display) + `Inter` (body)

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:3000
```

Boshqa skriptlar:

```bash
npm run build    # production
npm run start    # production serverini ishga tushirish
npm run lint     # ESLint
```

## Fayl tuzilmasi

```
src/
├─ app/
│  ├─ layout.tsx              root — fontlar va html
│  ├─ globals.css             dizayn tokenlar, animatsiyalar, bosqich foni
│  ├─ page.tsx                smart redirect (onboarding | bosh)
│  ├─ onboarding/page.tsx     4 slide: salom → sabab → usul → hisob (email + ism)
│  ├─ diagnostika/page.tsx    10 savol + natija → boshlang'ich bosqich
│  └─ (app)/                  app shell — TopBar + DeviceShell
│     ├─ layout.tsx
│     ├─ bosh/page.tsx
│     ├─ xarita/page.tsx
│     ├─ darslar/page.tsx     darslar ro'yxati (filtrlar)
│     ├─ dars/[id]/page.tsx
│     ├─ mashqlar/page.tsx    mashqlar ro'yxati
│     ├─ mashq/[id]/page.tsx
│     ├─ yutuqlar/page.tsx
│     ├─ tahlil/page.tsx
│     └─ profil/page.tsx
├─ components/
│  ├─ shell/       TopBar, BottomNav, PageHeader, Sidebar, DeviceShell, PhaseBackdrop
│  ├─ grammar/     ColorChip (rangli grammatika bloki)
│  └─ fx/          Confetti, XPFloat
├─ data/
│  ├─ types.ts          domen turlari + grammatika ranglari
│  ├─ curriculum.ts     5 bosqich, 16 ta tosh (dars kartochkalari + mashqlar)
│  ├─ badges.ts         8 ta badge
│  ├─ maqollar.ts       kunlik maqollar
│  └─ diagnostika.ts    10 ta diagnostika savoli + bosqich hisoblash
├─ store/
│  └─ usePoydevor.ts    Zustand + localStorage
└─ lib/
   ├─ sound.ts          Web Audio API ovozlari
   ├─ relativeTime.ts   "2 soat avval" kabi nisbiy vaqt
   └─ cn.ts             className helper
```

## Mock natijasiz hech narsa yo'q

Hammasi `localStorage`da — server, API, bazani sozlash shart emas. Birinchi yuklashda ilova "yashagan" akkaunt holatini ko'rsatadi (XP, 7 kun streak, ochilgan/tugatilgan toshlar, badge'lar), shuning uchun demo hech qachon bo'sh ekran ko'rsatmaydi.

Onboardingdagi email va ism shunchaki localStoragega saqlanadi — backend autentifikatsiya yo'q. `/profil` da **Hisobdan chiqish** progressni saqlab qoladi, **Reset** esa sayohatni to'liq boshidan boshlaydi.

## Hakamlar uchun yulduz funksiyalar

- **Daryo xaritasi** — har bosqich uchun animatsiyali oqim, zigzag toshlar, qulf/glow/check holatlari.
- **Rangli grammatika kodi** — har bir gap bo'lagi o'z rangi bilan, bola yodga oladi.
- **Junior/Senior dual UI** — bir xil kontent, ikki xil his.
- **💡 Eslatma kartlari** — oltin nur bilan ajratilgan chet til ko'priklari.
- **Web Audio API ovozlari** — har bir to'g'ri/noto'g'ri javob uchun procedural ton.
- **Mobile/Desktop toggle** — yagona ekrandan ikki dunyoga qarash.
- **Sertifikat** — gradient ramka, shareable kod, fonetik chiqarish.
```
