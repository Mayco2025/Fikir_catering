import nechEnjeraImg    from '../assets/images/nech-enjera.jpg'
import keyEnjeraImg     from '../assets/images/key-enjera.jpg'
import yeFisikImg       from '../assets/images/ye-fisik-package.png'
import yeTsomImg        from '../assets/images/ye-tsom-package.png'
import doroWetImg       from '../assets/images/doro-wet.png'
import daboImg          from '../assets/images/dabo-ppg.jpg'
import birzImg          from '../assets/images/birz.jpg'
import kitfoImg         from '../assets/images/kitfo.png'

// ─── Injera ───────────────────────────────────────────────────────────────────
export const injeraItems = [
  {
    id: 'nech-enjera',
    name: 'ነጭ እንጀራ',
    description: 'የ ነጭ ጤፍ ባህላዊ እንጀራ',
    image: nechEnjeraImg,
    alt: 'ነጭ እንጀራ',
    comingSoon: false,
    prices: [
      { label: '1 እንጀራ',   price: '¥500'    },
      { label: '15 እንጀራ',  price: '¥7,500'  },
      { label: '30 እንጀራ',  price: '¥15,000' },
    ],
  },
  {
    id: 'key-enjera',
    name: 'ቀይ እንጀራ',
    description: 'የ ቀይ ጤፍ ባህላዊ እንጀራ',
    image: keyEnjeraImg,
    alt: 'ቀይ እንጀራ',
    comingSoon: false,
    prices: [
      { label: '1 ቀይ እንጀራ',   price: '¥500'    },
      { label: '15 ቀይ እንጀራ',  price: '¥7,500'  },
      { label: '30 ቀይ እንጀራ',  price: '¥15,000' },
    ],
  },
]

// ─── Services (ሙሉ + ግማሽ combined into one card) ──────────────────────────────
export const serviceItems = [
  {
    id: 'fisik',
    name: 'የፍስክ አገልግል',
    image: yeFisikImg,
    alt: 'የፍስክ አገልግል',
    comingSoon: false,
    options: [
      {
        label: 'ሙሉ',
        price: '¥20,000',
        includes: ['10 እንጀራ', 'ቀይ ዶሮ', 'አልጫ ስጋወጥ', 'ጎመን በስጋ', 'ክትፎ', 'አይብ', 'እንቁላል'],
      },
      {
        label: 'ግማሽ',
        price: '¥15,000',
        includes: ['6 እንጀራ', 'ቀይ ዶሮ', 'አልጫ ስጋወጥ', 'ጎመን በስጋ', 'ክትፎ', 'አይብ', 'እንቁላ'],
      },
    ],
  },
  {
    id: 'tsom',
    name: 'የጾም አገልግል',
    image: yeTsomImg,
    alt: 'የጾም አገልግል',
    comingSoon: false,
    options: [
      {
        label: 'ሙሉ',
        price: '¥15,000',
        includes: ['10 እንጀራ', 'ምስር', 'ጥቅል ጎመን', 'አልጫ ድንች', 'ሽንብራ አሳ', 'ፎሶልያ በካሮት', 'ስንግ'],
      },
      {
        label: 'ግማሽ',
        price: '¥10,000',
        includes: ['6 እንጀራ', 'ምስር', 'ጥቅል ጎመን', 'አልጫ ድንች', 'ሽንብራ አሳ', 'ፎሶሊያ በካሮት', 'ስንግ'],
      },
    ],
  },
  {
    id: 'kitfo',
    name: 'ክትፎ',
    image: kitfoImg,
    alt: 'ክትፎ',
    comingSoon: false,
    description: 'ጭማሪ እንጀራ ማዘዝ ይቻላል።',
    options: [
      {
        label: 'ሙሉ',
        price: '¥15,000',
        includes: ['አንድ ኪሎ ስጋ', '5 እንጀራ', 'አይብ', 'ጎመን', 'ክትፎ'],
      },
      {
        label: 'ግማሽ',
        price: '¥9,000',
        includes: ['ግማሽ ኪሎ ስጋ', '4 እንጀራ', 'አይብ', 'ጎመን', 'ክትፎ'],
      },
    ],
  },
  {
    id: 'doro',
    name: 'ዶሮ ወጥ',
    image: doroWetImg,
    alt: 'ዶሮ ወጥ',
    comingSoon: false,
    options: [
      {
        label: 'ሙሉ',
        price: '¥17,000',
        includes: ['10 እንጀራ', '12 እንቁላል', '12 የዶሮ እግር', 'አይብ'],
      },
      {
        label: 'ግማሽ',
        price: '¥10,000',
        includes: ['6 እንጀራ', '6 እንቁላል', '6 የዶሮ እግር', 'አይብ'],
      },
    ],
  },
]

// ─── Extras ───────────────────────────────────────────────────────────────────
export const extraItems = [
  {
    id: 'dabo',
    name: 'ድፎ ዳቦ',
    price: '¥2,500 / ኪሎ',
    image: daboImg,
    alt: 'ድፎ ዳቦ',
    comingSoon: false,
    description: 'ባህላዊ ዳቦ ፣ 1 ኪሎ',
  },
  {
    id: 'tej',
    name: 'የማር ብርዝ',
    price: '¥2,000 / ሊትር',
    image: birzImg,
    alt: 'የማር ብርዝ',
    comingSoon: false,
    description: 'ባህላዊ ማር ወይን ፣ 1 ሊትር',
  },
]
