# Poydevor — Ona tilingni bil, dunyoni zabt et 🌊

Hackathon MVP — o'zbek tili grammatikasini "Ko'lmakdan Okeangacha" konseptsiyasi orqali zamonaviy, o'yinga aylantirilgan tarzda o'rgatuvchi platforma.

> "Ona tilini bilgan odam istalgan chet tilini bir necha barobar tez o'rganadi —
>  chunki grammatika tushunchalari allaqachon ona tilida o'rnatilgan bo'ladi."

## Demo flow (hakamlar uchun 4 daqiqa)

1. **Onboarding** — animatsiyali "Ko'lmakdan Okeangacha" kirish, muammoning yechimi, **Junior/Senior** rejim tanlash, ism kiritish.
2. **Diagnostika** — 3 ta interaktiv savol (drag-and-drop gap qurish, multi-choice, fill-blank) foydalanuvchi qaysi bosqichdan boshlashini aniqlaydi.
3. **Bosh sahifa** — joriy bosqich heroi, Level/XP, kunlik vazifa, statistika, so'nggi faoliyat, kun maqoli.
4. **Xarita** — 5 ta bosqichlik daryo yo'lagi, 16 ta tosh, oqim animatsiyasi, qulflar va o'tilgan toshlar.
5. **Dars** — 6 ta turdagi kartochka (intro, qoida, misol, tap, build, 💡 chet tili eslatmasi, outro), ranglar bilan kodlangan grammatika.
6. **Mashq** — 5 xil savol turi (choice, tap, fill, true/false, order), Junior uchun yuraklar, 3 yulduzli reyting, konfetti.
7. **Yutuqlar / Sertifikat** — 8 ta badge, shareable sertifikat (Phase 1 tugagach ochiladi).
8. **Tahlil** — har bosqich bo'yicha o'rtacha ball, zaif/kuchli toshlar, 4 haftalik faollik heatmapi.
9. **Profil** — daraja halqasi, statistika, Junior↔Senior almashtirish, ovoz toggle, reset.

Top barda **Mobile / Desktop** toggle bor — qaysi rejimda olchanyatkanini hozirning o'zida ko'rishingiz mumkin.

## Asosiy konsepsiyalar

- **Ko'lmakdan Okeangacha** — 5 bosqichli sayohat (Ko'lmak 💧 → Buloq 🌿 → Daryo 🏞️ → Dengiz 🌊 → Okean 🌍).
- **Ranglar bilan grammatika** — EGA 🔵, KESIM 🔴, TO'LDIRUVCHI 🟢, ANIQLOVCHI 🟡, RAVISH 🟣, HOL 🩵. Bu ranglar butun ilova bo'ylab izchil ishlatiladi.
- **Junior va Senior** — bir xil kontent, ikki xil taqdimot. Junior: yuraklar, XP, konfetti, ovoz. Senior: minimalist, statistika asosida.
- **💡 Eslatma** — chet til mavzulariga (predlog, artikl) muhim joyda qisqa, interaktiv bo'lmagan ko'rsatmalar. Asosiy o'qish o'zbek tilida.

## Stack

- **Next.js 16.2** App Router (client-side SPA)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/postcss`, `@theme inline`)
- **Zustand** + `persist` middleware → `localStorage`
- **Framer Motion** — animatsiya va o'tishlar
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
npm run lint     # ESLint
```

## Fayl tuzilmasi

```
src/
├─ app/
│  ├─ layout.tsx              root — fontlar va html
│  ├─ globals.css             dizayn tokenlar, animatsiyalar, bosqich foni
│  ├─ page.tsx                smart redirect (onboarding | bosh)
│  ├─ onboarding/page.tsx     3 slide + rejim + ism
│  ├─ diagnostika/page.tsx    3 savol + natija
│  └─ (app)/                  app shell — TopBar + DeviceShell
│     ├─ layout.tsx
│     ├─ bosh/page.tsx
│     ├─ xarita/page.tsx
│     ├─ dars/[id]/page.tsx
│     ├─ mashq/[id]/page.tsx
│     ├─ yutuqlar/page.tsx
│     ├─ tahlil/page.tsx
│     └─ profil/page.tsx
├─ components/
│  ├─ shell/       TopBar, DeviceShell, Sidebar, BottomNav, PhaseBackdrop
│  ├─ grammar/     ColorChip (rangli grammatika bloki)
│  └─ fx/          Confetti, XPFloat
├─ data/
│  ├─ types.ts          domen turlari + grammatika ranglari
│  ├─ curriculum.ts     16 ta tosh × 6 ta kartochka + 5 ta savol
│  ├─ badges.ts         8 ta badge
│  ├─ maqollar.ts       kunlik maqollar
│  └─ diagnostika.ts    onboarding diagnostikasi
├─ store/
│  └─ usePoydevor.ts    Zustand + localStorage
└─ lib/
   ├─ sound.ts          Web Audio API ovozlari
   └─ cn.ts             className helper
```

## Mock natijasiz hech narsa yo'q

Hammasi `localStorage`da — server, API, bazani sozlash shart emas. Birinchi yuklashda ilova "yashagan" akkaunt holatini ko'rsatadi (4 ta tosh ochilgan, 3 tasi tugatilgan, 3 badge olingan, 7 kun streak), shuning uchun demo hech qachon bo'sh ekran ko'rsatmaydi.

`/profil` da Reset tugmasi mavjud — sayohatni boshidan boshlash uchun.

## Hakamlar uchun yulduz funksiyalar

- **Daryo xaritasi** — har bosqich uchun animatsiyali oqim, zigzag toshlar, qulf/glow/check holatlari.
- **Rangli grammatika kodi** — har bir gap bo'lagi o'z rangi bilan, bola yodga oladi.
- **Junior/Senior dual UI** — bir xil kontent, ikki xil his.
- **💡 Eslatma kartlari** — oltin nur bilan ajratilgan chet til ko'priklari.
- **Web Audio API ovozlari** — har bir to'g'ri/noto'g'ri javob uchun procedural ton.
- **Mobile/Desktop toggle** — yagona ekrandan ikki dunyoga qarash.
- **Sertifikat** — gradient ramka, shareable kod, fonetik chiqarish.
