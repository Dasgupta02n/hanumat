#!/usr/bin/env node
/** Seed UI message catalogs for regional locales from English + native nav labels */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MSG = path.join(ROOT, "apps/web/messages");
const en = JSON.parse(fs.readFileSync(path.join(MSG, "en.json"), "utf8"));

const navNative = {
  mr: {
    home: "मुख्य",
    path: "पाठ",
    myPath: "माझा मार्ग",
    learn: "जाणा",
    chalisa: "चालीसा",
    listen: "श्रवण",
    sankat: "संकट",
    japa: "जप",
    calendar: "दिनदर्शिका",
    katha: "कथा",
    parayan: "पारायण",
    temples: "क्षेत्र",
    kids: "बाल मार्ग",
  },
  gu: {
    home: "હોમ",
    path: "પાઠ",
    myPath: "મારો માર્ગ",
    learn: "જાણો",
    chalisa: "ચાલીસા",
    listen: "શ્રવણ",
    sankat: "સંકટ",
    japa: "જપ",
    calendar: "કેલેન્ડર",
    katha: "કથા",
    parayan: "પારાયણ",
    temples: "ક્ષેત્ર",
    kids: "બાળ માર્ગ",
  },
  bn: {
    home: "হোম",
    path: "পাঠ",
    myPath: "আমার পথ",
    learn: "জানুন",
    chalisa: "চালিসা",
    listen: "শ্রবণ",
    sankat: "সঙ্কট",
    japa: "জপ",
    calendar: "ক্যালেন্ডার",
    katha: "কথা",
    parayan: "পারায়ণ",
    temples: "ক্ষেত্র",
    kids: "শিশু পথ",
  },
  ta: {
    home: "முகப்பு",
    path: "பாடல்",
    myPath: "என் பாதை",
    learn: "அறிய",
    chalisa: "சாலிசா",
    listen: "கேளுங்கள்",
    sankat: "அடைக்கலம்",
    japa: "ஜெபம்",
    calendar: "நாட்காட்டி",
    katha: "கதை",
    parayan: "பாராயணம்",
    temples: "தலம்",
    kids: "குழந்தை பாதை",
  },
  te: {
    home: "హోమ్",
    path: "పాఠం",
    myPath: "నా మార్గం",
    learn: "తెలుసుకోండి",
    chalisa: "చాలీసా",
    listen: "వినండి",
    sankat: "శరణు",
    japa: "జపం",
    calendar: "క్యాలెండర్",
    katha: "కథ",
    parayan: "పారాయణ",
    temples: "క్షేత్రాలు",
    kids: "పిల్లల మార్గం",
  },
  kn: {
    home: "ಮುಖಪುಟ",
    path: "ಪಾಠ",
    myPath: "ನನ್ನ ಮಾರ್ಗ",
    learn: "ತಿಳಿಯಿರಿ",
    chalisa: "ಚಾಲೀಸಾ",
    listen: "ಕೇಳಿ",
    sankat: "ಆಶ್ರಯ",
    japa: "ಜಪ",
    calendar: "ಕ್ಯಾಲೆಂಡರ್",
    katha: "ಕಥೆ",
    parayan: "ಪಾರಾಯಣ",
    temples: "ಕ್ಷೇತ್ರ",
    kids: "ಮಕ್ಕಳ ಮಾರ್ಗ",
  },
  pa: {
    home: "ਘਰ",
    path: "ਪਾਠ",
    myPath: "ਮੇਰਾ ਰਸਤਾ",
    learn: "ਜਾਣੋ",
    chalisa: "ਚਾਲੀਸਾ",
    listen: "ਸੁਣੋ",
    sankat: "ਸ਼ਰਨ",
    japa: "ਜਾਪ",
    calendar: "ਕੈਲੰਡਰ",
    katha: "ਕਥਾ",
    parayan: "ਪਾਰਾਇਣ",
    temples: "ਖੇਤਰ",
    kids: "ਬੱਚਿਆਂ ਦਾ ਰਸਤਾ",
  },
  or: {
    home: "ହୋମ୍",
    path: "ପାଠ",
    myPath: "ମୋ ପଥ",
    learn: "ଜାଣନ୍ତୁ",
    chalisa: "ଚାଳିସା",
    listen: "ଶ୍ରବଣ",
    sankat: "ଶରଣ",
    japa: "ଜପ",
    calendar: "କ୍ୟାଲେଣ୍ଡର",
    katha: "କଥା",
    parayan: "ପାରାୟଣ",
    temples: "କ୍ଷେତ୍ର",
    kids: "ଶିଶୁ ପଥ",
  },
  ml: {
    home: "ഹോം",
    path: "പാഠം",
    myPath: "എന്റെ പാത",
    learn: "അറിയുക",
    chalisa: "ചാലീസ",
    listen: "ശ്രവണം",
    sankat: "ശരണം",
    japa: "ജപം",
    calendar: "കലണ്ടർ",
    katha: "കഥ",
    parayan: "പാരായണം",
    temples: "ക്ഷേത്രങ്ങൾ",
    kids: "കുട്ടികളുടെ പാത",
  },
};

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

for (const [loc, nav] of Object.entries(navNative)) {
  const msg = deepClone(en);
  msg.nav = { ...msg.nav, ...nav };
  msg.tagline = msg.tagline + ` · ${loc}`;
  msg.footer = {
    ...msg.footer,
    ttsNote:
      "Audio: neural TTS path-assist — not classical pāṭh. Meanings: machine-assisted draft for this locale.",
  };
  msg.studio = {
    ...msg.studio,
    provisionalTitle: "Provisional / MT meanings:",
    provisionalBody:
      "Machine-assisted draft for this locale + owner responsibility. Not scholarly ṭīkā. TTS ≠ classical pāṭh. OCR mūla ≠ Gita Press digital license.",
  };
  fs.writeFileSync(path.join(MSG, `${loc}.json`), JSON.stringify(msg, null, 2) + "\n");
  console.log("wrote", loc);
}
