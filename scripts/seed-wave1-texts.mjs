import fs from "node:fs";
import path from "node:path";

function writePack(slug, meta, verses) {
  const dir = path.join("content", "texts", slug);
  fs.mkdirSync(path.join(dir, "translations"), { recursive: true });
  fs.mkdirSync(path.join(dir, "transliteration"), { recursive: true });
  const verseIds = verses.map((v) => v.id);
  const versesMap = {};
  const hi = {};
  const en = {};
  const iast = {};
  for (const v of verses) {
    versesMap[v.id] = {
      id: v.id,
      kind: v.kind || "shloka",
      text: v.text,
      sectionId: "full",
    };
    hi[v.id] = v.hi;
    en[v.id] = v.en;
    iast[v.id] = v.iast;
  }
  meta.stats = { sectionCount: 1, verseCount: verses.length };
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
  fs.writeFileSync(
    path.join(dir, "structure.json"),
    JSON.stringify(
      {
        sections: [
          {
            id: "full",
            kind: "editorial-episode",
            title: { hi: "पूर्ण पाठ", en: "Full path" },
            verseIds,
            order: 1,
          },
        ],
      },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(path.join(dir, "verses.json"), JSON.stringify(versesMap, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "translations", "hi.json"), JSON.stringify(hi, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "translations", "en.json"), JSON.stringify(en, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "transliteration", "iast.json"), JSON.stringify(iast, null, 2) + "\n");
}

const flags = {
  hasAudio: false,
  hasOfflinePack: false,
  placeholderAudio: false,
  ttsGenerated: false,
  needsDualReview: true,
};

writePack(
  "shiva-tandava-stotram",
  {
    id: "shiva-tandava-stotram",
    slug: "shiva-tandava-stotram",
    deity: "shiva",
    title: { hi: "शिवताण्डवस्तोत्रम्", en: "Shiva Tandava Stotram" },
    subtitle: { hi: "रावण-कृत · १५ श्लोक", en: "Attributed to Ravana · 15 verses" },
    originalLang: "sa",
    script: "Deva",
    edition: {
      pin: "SHIVA-TANDAVA-SD-GM",
      publisher: "Traditional (public domain)",
      notes:
        "Ravana recension collated from Sanskrit Documents shivTAND_meaning and Green Message. Meanings provisional.",
    },
    flags,
    wave: 1,
    category: "stotra",
    description: {
      hi: "शिव के ताण्डव की स्तुति — जटा, डमरु, चन्द्रशेखर।",
      en: "Hymn of Shiva’s tandava — jata, damaru, moon-crest.",
    },
  },
  [
    {
      id: "st-01",
      text: "जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥",
      iast: "jaṭāṭavīgalajjalapravāhapāvitasthale gale'valambya lambitāṃ bhujaṅgatuṅgamālikām | damaḍḍamaḍḍamaḍḍamanninādavaḍḍamarvayaṃ cakāra caṇḍatāṇḍavaṃ tanotu naḥ śivaḥ śivam ||",
      hi: "जटा-वन से बहते गङ्गा-जल से पवित्र कण्ठ पर नाग-माला धारण कर, डमरु की डमडम ध्वनि में शिव ने चण्ड ताण्डव किया — वे हमारा कल्याण करें।",
      en: "With the throat consecrated by Ganga from the forest of jata, a tall snake-garland hanging, Shiva danced the fierce tandava to the damaru’s damat — may He grant auspiciousness.",
    },
    {
      id: "st-02",
      text: "जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी विलोलवीचिवल्लरीविराजमानमूर्धनि ।\nधगद्धगद्धगज्ज्वलल्ललाटपट्टपावके किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥",
      iast: "jaṭākaṭāhasambhramabhramannilimpanirjharī vilolavīcivallarīvirājamānamūrdhani | dhagaddhagaddhagajjvalallalāṭapaṭṭapāvake kiśoracandraśekhare ratiḥ pratikṣaṇaṃ mama ||",
      hi: "जटा-कटाह में घूमती गङ्गा की लहरें मस्तक पर शोभित; ललाट-अग्नि धगधग जलती; बाल-चन्द्र शेखर — उन पर मेरा प्रेम प्रतिक्षण हो।",
      en: "Ganga whirls in the cauldron of jata; the brow-fire blazes; the young moon rests on His crest — may my love rest there every moment.",
    },
    {
      id: "st-03",
      text: "धराधरेन्द्रनन्दिनीविलासबन्धुबन्धुरस्फुरद्दिगन्तसन्ततिप्रमोदमानमानसे ।\nकृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि क्वचिद्दिगम्बरे मनो विनोदमेतु वस्तुनि ॥",
      iast: "dharādharendranandinīvilāsabandhubandhurasphuraddigantasantatipramodamānamānase | kṛpākaṭākṣadhoraṇīniruddhadurdharāpadi kvaciddigambare mano vinodametu vastuni ||",
      hi: "पार्वती के विलास-बन्धु, जिनके मन में दिगन्त आनन्द है, जिनकी कृपा-दृष्टि आपत्ति रोकती है — दिगम्बर शिव में मेरा मन रमे।",
      en: "Friend of Parvati’s play, whose mind delights to the horizon, whose glance of grace checks calamity — may the mind sport in that sky-clad One.",
    },
    {
      id: "st-04",
      text: "लताभुजङ्गपिङ्गलस्फुरत्फणामणिप्रभाकदम्बकुङ्कुमद्रवप्रलिप्तदिग्वधूमुखे ।\nमदान्धसिन्धुरस्फुरत्त्वगुत्तरीयमेदुरे मनो विनोदमद्भुतं बिभर्तु भूतभर्तरि ॥",
      iast: "latābhujaṅgapiṅgalasphuratphaṇāmaṇiprabhākadambakuṅkumadravapraliptadigvadhūmukhe | madāndhasindhurasphurattvaguttarīyamedure mano vinodamadbhutaṃ bibhartu bhūtabhartari ||",
      hi: "सर्प-फण मणि की कांति दिशाओं पर कुङ्कुम सी; गज-चर्म उत्तरीय — भूतपति में मन अद्भुत आनन्द धारे।",
      en: "Jewel-light from tawny snake-hoods paints the quarters; elephant-hide as upper cloth — may the mind bear wonder in the Lord of beings.",
    },
    {
      id: "st-05",
      text: "सहस्रलोचनप्रभृत्यशेषलेखशेखरप्रसूनधूलिधोरणी विधूसराङ्घ्रिपीठभूः ।\nभुजङ्गराजमालया निबद्धजाटजूटकः श्रियै चिराय जायतां चकोरबन्धुशेखरः ॥",
      iast: "sahasralocanaprabhṛtyaśeṣalekhaśekharaprasūnadhūlidhoraṇī vidhūsarāṅghripīṭhabhūḥ | bhujaṅgarājamālayā nibaddhajāṭajūṭakaḥ śriyai cirāya jāyatāṃ cakorabandhuśekharaḥ ||",
      hi: "इन्द्र आदि देवों के पुष्प-धूलि से धूसर चरण; नागराज-माला से बँधी जटा; चन्द्रशेखर चिर लक्ष्मी दें।",
      en: "His footstool grey with flower-dust of Indra and the gods; jata bound with the serpent-king’s garland — may the moon-crested One grant lasting fortune.",
    },
    {
      id: "st-06",
      text: "ललाटचत्वरज्वलद्धनञ्जयस्फुलिङ्गभानिपीतपञ्चसायकं नमन्निलिम्पनायकम् ।\nसुधामयूखलेखया विराजमानशेखरं महाकपालिसम्पदेशिरोजटालमस्तु नः ॥",
      iast: "lalāṭacatvarajvaladdhanañjayasphuliṅgabhānipītapañcasāyakaṃ namannilimpanāyakam | sudhāmayūkhalekhayā virājamānaśekharaṃ mahākapālisampadeśirojaṭālamastu naḥ ||",
      hi: "ललाट-अग्नि की चिनगारी से कामदेव भस्म; देवपति नमन करते; सुधा-किरण शेखर — जटा-माला हमारा कल्याण हो।",
      en: "Sparks from the brow-fire drank Kama’s five arrows; the lord of gods bows; nectar-rayed crest — may that matted crown be our fortune.",
    },
    {
      id: "st-07",
      text: "करालभालपट्टिकाधगद्धगद्धगज्ज्वलद्धनञ्जयाहुतीकृतप्रचण्डपञ्चसायके ।\nधराधरेन्द्रनन्दिनीकुचाग्रचित्रपत्रकप्रकल्पनैकशिल्पिनि त्रिलोचने रतिर्मम ॥",
      iast: "karālabhālapaṭṭikādhagaddhagaddhagajjvaladdhanañjayāhutīkṛtapracaṇḍapañcasāyake | dharādharendranandinīkucāgracitrapatrakaprakalpanaikaśilpini trilocane ratirmama ||",
      hi: "भयंकर भाल-पट्टी पर अग्नि, काम को आहुति; पार्वती के चित्र-पत्र के एक शिल्पी त्रिलोचन पर मेरी रति हो।",
      en: "On the terrible brow-plate fire made Kama an offering; the sole artist of Parvati’s painted marks — may my love rest on the Three-eyed.",
    },
    {
      id: "st-08",
      text: "नवीनमेघमण्डली निरुद्धदुर्धरस्फुरत्कुहूनिशीथिनीतमः प्रबन्धबद्धकन्धरः ।\nनिलिम्पनिर्झरीधरस्तनोतु कृत्तिसिन्धुरः कलानिधानबन्धुरः श्रियं जगद्धुरन्धरः ॥",
      iast: "navīnameghamaṇḍalī niruddhadurdharasphuratkuhūniśithinītamaḥ prabandhabaddhakandharaḥ | nilimpanirjharīdharastanotu kṛttisindhuraḥ kalānidhānabandhuraḥ śriyaṃ jagaddhurandharaḥ ||",
      hi: "नये मेघों सी गर्दन, अमावस्या-तम बाँधे; गङ्गा-धर, गजचर्म, कला-निधि — जगत् के धुरन्धर श्री दें।",
      en: "Neck bound in new-cloud dark of the new-moon night; bearer of Ganga and elephant-hide, friend of the moon — may the world’s bearer grant fortune.",
    },
    {
      id: "st-09",
      text: "प्रफुल्लनीलपङ्कजप्रपञ्चकालिमप्रभावलम्बिकण्ठकन्दलीरुचिप्रबद्धकन्धरम् ।\nस्मरच्छिदं पुरच्छिदं भवच्छिदं मखच्छिदं गजच्छिदांधकच्छिदं तमन्तकच्छिदं भजे ॥",
      iast: "praphullanīlapaṅkajaprapañcakālimaprabhāvalambikaṇṭhakandalīruciprabaddhakandharam | smaracchidaṃ puracchidaṃ bhavacchidaṃ makhacchidaṃ gajacchidāndhakacchidaṃ tamantakacchidaṃ bhaje ||",
      hi: "खिले नीलकमल सी कण्ठ-कालिमा; काम, त्रिपुर, भव, यज्ञ, गज, अन्धक, अन्तक के छेदनहार को भजता हूँ।",
      en: "I worship Him whose throat is the dark of a full blue lotus — cutter of Kama, of the Triple City, of becoming, of the sacrifice, of the elephant, of Andhaka, of Death.",
    },
    {
      id: "st-10",
      text: "अखर्वसर्वमङ्गलाकलाकदम्बमञ्जरीरसप्रवाहमाधुरीविजृम्भणामधुव्रतम् ।\nस्मरान्तकं पुरान्तकं भवान्तकं मखान्तकं गजान्तकान्धकान्तकं तमन्तकान्तकं भजे ॥",
      iast: "akharvasarvamaṅgalākalākadambamañjarīrasapravāhamādhurīvijṛmbhaṇāmadhuvratam | smarāntakaṃ purāntakaṃ bhavāntakaṃ makhāntakaṃ gajāntakāndhakāntakaṃ tamantakāntakaṃ bhaje ||",
      hi: "उमा की कला-मञ्जरी के रस पर मधुव्रत; स्मरान्तक, पुरान्तक, भवान्तक को भजता हूँ।",
      en: "Bee at the overflowing sweetness of Uma’s cluster of auspicious arts — I worship the Ender of Kama, of the cities, of becoming, of the rite, of the elephant, of Andhaka, of Death.",
    },
    {
      id: "st-11",
      text: "जयत्वदभ्रविभ्रमभ्रमद्भुजङ्गमश्वसद्विनिर्गमत्क्रमस्फुरत्करालभालहव्यवाट् ।\nधिमिद्धिमिद्धिमिध्वनन्मृदङ्गतुङ्गमङ्गलध्वनिक्रमप्रवर्तितप्रचण्डताण्डवः शिवः ॥",
      iast: "jayatvadabhravibhramabhramadbhujaṅgamaśvasadvinirgamatkramasphuratkarālabhālahavyavāṭ | dhimiddhimiddhimidhvananmṛdaṅgatuṅgamaṅgaladhvanikramapravartitapracaṇḍatāṇḍavaḥ śivaḥ ||",
      hi: "मेघ-से सर्प की श्वास से ललाट-अग्नि फूले; मृदङ्ग धिमि-धिमि पर प्रचण्ड ताण्डव — शिव जय हों।",
      en: "Victory to Shiva — snake-breath from sky-play fans the brow-fire; the fierce tandava steps to the high auspicious mridanga’s dhimid-dhimid.",
    },
    {
      id: "st-12",
      text: "दृषद्विचित्रतल्पयोर्भुजङ्गमौक्तिकस्रजोर्गरिष्ठरत्नलोष्ठयोः सुहृद्विपक्षपक्षयोः ।\nतृणारविन्दचक्षुषोः प्रजामहीमहेन्द्रयोः समप्रवृत्तिकः कदा सदाशिवं भजाम्यहम् ॥",
      iast: "dṛṣadvicitratalpayorbhujaṅgamauktikasrajor gariṣṭharatnaloṣṭhayoḥ suhṛdvipakṣapakṣayoḥ | tṛṇāravindacakṣuṣoḥ prajāmahīmahendrayoḥ samapravṛttikaḥ kadā sadāśivaṃ bhajāmyaham ||",
      hi: "कंकड़-शय्या या चित्र-शय्या, सर्प या मुक्ता, रत्न या ढेला, मित्र-शत्रु, तृण-कमल, प्रजा-इन्द्र — समदृष्टि होकर सदाशिव को कब भजूँ?",
      en: "When shall I worship Sadashiva with even regard — pebble or painted couch, snake or pearl, gem or clod, friend or foe, grass or lotus, subject or Indra?",
    },
    {
      id: "st-13",
      text: "कदा निलिम्पनिर्झरीनिकुञ्जकोटरे वसन् विमुक्तदुर्मतिः सदा शिरःस्थमञ्जलिं वहन् ।\nविलोललोललोचनो ललामभाललग्नकः शिवेति मन्त्रमुच्चरन् कदा सुखी भवाम्यहम् ॥",
      iast: "kadā nilimpanirjharīnikuñjakoṭare vasan vimuktadurmatiḥ sadā śiraḥsthamañjaliṃ vahan | vilolalolalocano lalāmabhālalagnakaḥ śiveti mantramuccaran kadā sukhī bhavāmyaham ||",
      hi: "गङ्गा-निकुञ्ज में रहकर, दुर्मति छोड़, सिर पर अञ्जलि, ललाट पर भस्म, ‘शिव’ मन्त्र उच्चार — कब सुखी होऊँ?",
      en: "When, dwelling in a Ganga-grove, rid of ill thought, hands on the head, ash on the brow, uttering the mantra Shiva — shall I be at ease?",
    },
    {
      id: "st-14",
      text: "इदम् हि नित्यमेवमुक्तमुत्तमोत्तमं स्तवं पठन् स्मरन् ब्रुवन् नरो विशुद्धिमेति संततम् ।\nहरे गुरौ सुभक्तिमाशु याति नान्यथा गतिं विमोहनं हि देहिनां सुशङ्करस्य चिन्तनम् ॥",
      iast: "idam hi nityamevamuktamuttamottamaṃ stavaṃ paṭhan smaran bruvan naro viśuddhimeti saṃtatam | hare gurau subhaktimāśu yāti nānyathā gatiṃ vimohanaṃ hi dehināṃ suśaṅkarasya cintanam ||",
      hi: "यह उत्तम स्तव नित्य पढ़ने, स्मरण, उच्चारण से मनुष्य शुद्ध होता है; हरि-गुरु में भक्ति शीघ्र आती है — शङ्कर-चिन्तन देहधारियों का मोह हरता है।",
      en: "Reading, remembering, speaking this highest hymn daily, a person is continually purified; devotion to Hari and Guru comes swiftly — thought of Shankara undoes the body’s delusion.",
    },
    {
      id: "st-15",
      kind: "phalashruti",
      text: "पूजावसानसमये दशवक्त्रगीतं यः शम्भुपूजनमिदं पठति प्रदोषे ।\nतस्य स्थिरां रथगजेन्द्रतुरङ्गयुक्तां लक्ष्मीं सदैव सुमुखीं प्रददाति शम्भुः ॥",
      iast: "pūjāvasānasamaye daśavaktragītaṃ yaḥ śambhupūjanamidaṃ paṭhati pradoṣe | tasya sthirāṃ rathagajendraturaṅgayuktāṃ lakṣmīṃ sadaiva sumukhīṃ pradadāti śambhuḥ ||",
      hi: "पूजा के अन्त में प्रदोष में यह दशवक्त्र-गीत जो पढ़े, शम्भु उसे स्थिर, सुमुखी लक्ष्मी देते हैं।",
      en: "Who recites this ten-faced song at the close of puja in pradosha — Shambhu grants him stable, well-faced Lakshmi with chariot, elephant and horse.",
    },
  ],
);

writePack(
  "bilvashtakam",
  {
    id: "bilvashtakam",
    slug: "bilvashtakam",
    deity: "shiva",
    title: { hi: "बिल्वाष्टकम्", en: "Bilvashtakam" },
    subtitle: { hi: "एक बिल्वं शिवार्पणम्", en: "One bel leaf offered to Shiva" },
    originalLang: "sa",
    script: "Deva",
    edition: {
      pin: "BILVASHTAKAM-SD-GM",
      publisher: "Traditional (public domain)",
      notes:
        "Eight verses + phalaśruti. Collated from Sanskrit Documents bilvaashhtaka and common temple recension (Green Message / saivism.net class). Line-order of middle verses varies by region.",
    },
    flags,
    wave: 1,
    category: "stotra",
    description: {
      hi: "बिल्व पत्र शिव को अर्पण — तीन दल, तीन गुण।",
      en: "Offering the three-leaved bel to Shiva.",
    },
  },
  [
    {
      id: "bil-01",
      text: "त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम् ।\nत्रिजन्मपापसंहारं एकबिल्वं शिवार्पणम् ॥",
      iast: "tridalaṃ triguṇākāraṃ trinetraṃ ca triyāyudham | trijanmapāpasaṃhāraṃ ekabilvaṃ śivārpaṇam ||",
      hi: "तीन दल, त्रिगुण, त्रिनेत्र, त्रियायुध, तीन जन्म के पाप हरने वाला — एक बिल्व शिव को अर्पण।",
      en: "Three-leaved, form of the three gunas, three-eyed, three weapons, destroying sins of three births — one bel leaf I offer to Shiva.",
    },
    {
      id: "bil-02",
      text: "त्रिशाखैः बिल्वपत्रैश्च ह्यच्छिद्रैः कोमलैः शुभैः ।\nशिवपूजां करिष्यामि एकबिल्वं शिवार्पणम् ॥",
      iast: "triśākhaiḥ bilvapatraiśca hyacchidraiḥ komalaiḥ śubhaiḥ | śivapūjāṃ kariṣyāmi ekabilvaṃ śivārpaṇam ||",
      hi: "तीन शाखाओं वाले, बिना छेद, कोमल शुभ बिल्व पत्रों से शिव पूजा करूँगा।",
      en: "With three-shooted, unpierced, tender auspicious bel leaves I shall worship Shiva.",
    },
    {
      id: "bil-03",
      text: "अखण्डबिल्वपत्रेण पूजिते नन्दिकेश्वरे ।\nशुद्ध्यन्ति सर्वपापेभ्यो एकबिल्वं शिवार्पणम् ॥",
      iast: "akhaṇḍabilvapatreṇa pūjite nandikeśvare | śuddhyanti sarvapāpebhyo ekabilvaṃ śivārpaṇam ||",
      hi: "अखण्ड बिल्व से नन्दिकेश्वर की पूजा से सब पाप धुलते हैं।",
      en: "When Nandikeshvara is worshipped with an unbroken bel leaf, one is cleansed of all sins.",
    },
    {
      id: "bil-04",
      text: "शालग्रामशिलामेकां विप्राणां जातु चार्पयेत् ।\nसोमयज्ञमहापुण्यं एकबिल्वं शिवार्पणम् ॥",
      iast: "śālagrāmaśilāmekāṃ viprāṇāṃ jātu cārpayet | somayajñamahāpuṇyaṃ ekabilvaṃ śivārpaṇam ||",
      hi: "एक शालग्राम अर्पण के समान पुण्य — एक बिल्व शिवार्पण।",
      en: "Equal to offering a saligrama to the wise, equal to a soma-yajna — one bel to Shiva.",
    },
    {
      id: "bil-05",
      text: "दन्तिकोटिसहस्राणि अश्वमेधशतानि च ।\nकोटिकन्यामहादानं एकबिल्वं शिवार्पणम् ॥",
      iast: "dantikotisahasrāṇi aśvamedhaśatāni ca | koṭikanyāmahādānaṃ ekabilvaṃ śivārpaṇam ||",
      hi: "करोड़ हाथी, सौ अश्वमेध, करोड़ कन्या-दान के समान एक बिल्व।",
      en: "Equal to thousands of crores of elephants, a hundred horse-sacrifices, a crore of kanya-dana — one bel to Shiva.",
    },
    {
      id: "bil-06",
      text: "लक्ष्म्याः स्तनुत उत्पन्नं महादेवस्य च प्रियम् ।\nबिल्ववृक्षं प्रयच्छामि एकबिल्वं शिवार्पणम् ॥",
      iast: "lakṣmyāḥ stanuta utpannaṃ mahādevasya ca priyam | bilvavṛkṣaṃ prayacchāmi ekabilvaṃ śivārpaṇam ||",
      hi: "लक्ष्मी से उत्पन्न, महादेव-प्रिय बिल्व वृक्ष अर्पण करता हूँ।",
      en: "Born of Lakshmi’s body, dear to Mahadeva — I offer the bel tree; one leaf to Shiva.",
    },
    {
      id: "bil-07",
      text: "दर्शनं बिल्ववृक्षस्य स्पर्शनं पापनाशनम् ।\nअघोरपापसंहारं एकबिल्वं शिवार्पणम् ॥",
      iast: "darśanaṃ bilvavṛkṣasya sparśanaṃ pāpanāśanam | aghorapāpasaṃhāraṃ ekabilvaṃ śivārpaṇam ||",
      hi: "बिल्व वृक्ष का दर्शन-स्पर्श पाप नाश करता है।",
      en: "Seeing and touching the bel tree destroys sin — one leaf to Shiva.",
    },
    {
      id: "bil-08",
      text: "मूलतो ब्रह्मरूपाय मध्यतो विष्णुरूपिणे ।\nअग्रतः शिवरूपाय एकबिल्वं शिवार्पणम् ॥",
      iast: "mūlato brahmarūpāya madhyato viṣṇurūpiṇe | agrataḥ śivarūpāya ekabilvaṃ śivārpaṇam ||",
      hi: "मूल में ब्रह्मा, मध्य में विष्णु, अग्र में शिव — एक बिल्व अर्पण।",
      en: "Brahma at the root, Vishnu in the middle, Shiva at the tip — one bel leaf offered.",
    },
    {
      id: "bil-09",
      kind: "phalashruti",
      text: "बिल्वाष्टकमिदं पुण्यं यः पठेच्छिवसन्निधौ ।\nशिवलोकमवाप्नोति शिवेन सह मोदते ॥",
      iast: "bilvāṣṭakamidaṃ puṇyaṃ yaḥ paṭhecchivasannidhau | śivalokamavāpnoti śivena saha modate ||",
      hi: "शिव के समीप यह पुण्य अष्टक पढ़ने वाला शिवलोक पाता है।",
      en: "Who recites this sacred ashtakam near Shiva attains Shiva-loka and rejoices with Shiva.",
    },
  ],
);

writePack(
  "daridraya-dahana-stotram",
  {
    id: "daridraya-dahana-stotram",
    slug: "daridraya-dahana-stotram",
    deity: "shiva",
    title: { hi: "दारिद्र्यदहनस्तोत्रम्", en: "Daridraya Dahana Stotram" },
    subtitle: { hi: "वसिष्ठ-कृत", en: "Attributed to Vasishtha" },
    originalLang: "sa",
    script: "Deva",
    edition: {
      pin: "DARIDRAYA-DAHANA-SD",
      publisher: "Traditional (public domain)",
      notes: "Public recension (Sanskrit Documents / Green Message class). Household stotra, not a tantric paddhati.",
    },
    flags,
    wave: 1,
    category: "stotra",
    description: {
      hi: "दारिद्र्य दहन — शिव से अभय और स्थिति की प्रार्थना।",
      en: "Burning of want — a prayer to Shiva for refuge and steadiness.",
    },
  },
  [
    {
      id: "dd-01",
      text: "विश्वेशं गौरीनाथं गजाननजनकं त्रिपुरारिं त्रिनेत्रम् ।\nभस्माङ्गं शूलपाणिं वरदमभयदं शङ्करं लोकनाथम् ॥",
      iast: "viśveśaṃ gaurīnāthaṃ gajānanajanakaṃ tripurāriṃ trinetram | bhasmāṅgaṃ śūlapāṇiṃ varadamabhayadaṃ śaṅkaraṃ lokanātham ||",
      hi: "विश्वेश, गौरीनाथ, गणेश-जनक, त्रिपुरारि, त्रिनेत्र, भस्म-अङ्ग, शूलपाणि, वरद, अभयद शङ्कर को नमन।",
      en: "Lord of the world, lord of Gauri, father of Gajanana, foe of Tripura, three-eyed, ash-limbed, spear in hand, giver of boons and fearlessness — Shankara, lord of people.",
    },
    {
      id: "dd-02",
      text: "गौरीनाथ उमापते पशुपते भर्गा त्रिशूलिन् हर व्याघ्रचर्मधरान्तक दिगम्बर श्रीकण्ठ चन्द्रशेखर ।\nभूतेश प्रमथेश भूतनिचयव्याघूर्णिताशेषभू सर्वेश त्वमनेकमूर्तिरमलो मां पाहि दारिद्र्यतः ॥",
      iast: "gaurīnātha umāpate paśupate bharga triśūlin hara vyāghracarmadharāntaka digambara śrīkaṇṭha candraśekhara | bhūteśa pramatheśa bhūtnicayavyāghūrṇitāśeṣabhū sarveśa tvamanekamūrtiramalo māṃ pāhi dāridryataḥ ||",
      hi: "गौरीनाथ, उमापति, पशुपति, भर्ग, त्रिशूलिन्, हर — हे सर्वेश, अनेक मूर्ति, मुझे दारिद्र्य से बचाओ।",
      en: "Lord of Gauri, Uma’s husband, Pashupati, Bharga, trident-bearer, Hara, tiger-skin, sky-clad, Srikantha, moon-crest — protect me from want.",
    },
    {
      id: "dd-03",
      text: "वन्देऽहं शङ्करं शम्भुमीशानं वृषभध्वजम् ।\nगङ्गाधरं महादेवं दारिद्र्यदहनं शिवम् ॥",
      iast: "vande'haṃ śaṅkaraṃ śambhumīśānaṃ vṛṣabhadhvajam | gaṅgādharaṃ mahādevaṃ dāridryadahanaṃ śivam ||",
      hi: "शङ्कर, शम्भु, ईशान, वृषभध्वज, गङ्गाधर, दारिद्र्यदहन शिव को वन्दना।",
      en: "I bow to Shankara, Shambhu, Ishana, bull-bannered, Ganga-bearer, Mahadeva, Shiva who burns want.",
    },
    {
      id: "dd-04",
      text: "करचरणकृतं वाक्कायजं कर्मजं वा श्रवणनयनजं वा मानसं वापराधम् ।\nविहितमविहितं वा सर्वमेतत् क्षमस्व जय जय करुणाब्धे श्रीमहादेव शम्भो ॥",
      iast: "karacaraṇakṛtaṃ vākkāyajaṃ karmajaṃ vā śravaṇanayanajaṃ vā mānasaṃ vāparādham | vihitamavihitaṃ vā sarvametat kṣamasva jaya jaya karuṇābdhe śrīmahādeva śambho ||",
      hi: "हाथ-पाँव, वाणी, कर्म, श्रवण-नयन, मन के अपराध — विहित-अविहित सब क्षमा करो, करुणाब्धि महादेव।",
      en: "Faults of hand and foot, speech, body, act, ear, eye, or mind — commanded or not — forgive them all, ocean of compassion, Mahadeva Shambhu.",
    },
    {
      id: "dd-05",
      kind: "phalashruti",
      text: "दारिद्र्यदहनस्तोत्रं यः पठेच्छिवसन्निधौ ।\nमुच्यते सर्वदारिद्र्यात् शिवलोकं स गच्छति ॥",
      iast: "dāridryadahanastotraṃ yaḥ paṭhecchivasannidhau | mucyate sarvadāridryāt śivalokaṃ sa gacchati ||",
      hi: "शिव के समीप यह स्तोत्र पढ़ने वाला दारिद्र्य से छूटकर शिवलोक जाता है।",
      en: "Who recites this hymn near Shiva is freed from all want and goes to Shiva-loka.",
    },
  ],
);

writePack(
  "jyotirlinga-stotra",
  {
    id: "jyotirlinga-stotra",
    slug: "jyotirlinga-stotra",
    deity: "shiva",
    title: { hi: "द्वादश ज्योतिर्लिङ्ग स्तोत्र", en: "Twelve Jyotirlinga Stotra" },
    subtitle: { hi: "सौराष्ट्रे सोमनाथं च", en: "Saurashtra Somnatham cha" },
    originalLang: "sa",
    script: "Deva",
    edition: {
      pin: "JYOTIRLINGA-DWADASHA-TRAD",
      publisher: "Traditional (public domain)",
      notes: "Stable four-verse public recension of the twelve names. Cross-checked common Devanagari printings.",
    },
    flags,
    wave: 1,
    category: "stotra",
    description: {
      hi: "बारह ज्योतिर्लिङ्ग के नाम — प्रातः-सायं स्मरण।",
      en: "The twelve jyotirlinga names — morning and evening remembrance.",
    },
  },
  [
    {
      id: "jy-01",
      text: "सौराष्ट्रे सोमनाथं च श्रीशैले मल्लिकार्जुनम् ।\nउज्जयिन्यां महाकालमोङ्कारममलेश्वरम् ॥",
      iast: "saurāṣṭre somanāthaṃ ca śrīśaile mallikārjunam | ujjayinyāṃ mahākālamokāramamaleśvaram ||",
      hi: "सौराष्ट्र में सोमनाथ, श्रीशैल पर मल्लिकार्जुन, उज्जयिनी में महाकाल, ओंकार अमरेश्वर।",
      en: "Somnath in Saurashtra, Mallikarjuna on Srisailam, Mahakala in Ujjain, Omkareshwar / Amaleshvara.",
    },
    {
      id: "jy-02",
      text: "परल्यां वैद्यनाथं च डाकिन्यां भीमशङ्करम् ।\nसेतुबन्धे तु रामेशं नागेशं दारुकावने ॥",
      iast: "paralyāṃ vaidyanāthaṃ ca ḍākinyāṃ bhīmaśaṅkaram | setubandhe tu rāmeśaṃ nāgeśaṃ dārukāvane ||",
      hi: "परली वैद्यनाथ, डाकिनी भीमशङ्कर, सेतुबन्ध रामेश्वर, दारुकावन नागेश।",
      en: "Vaidyanatha at Parli, Bhimashankara in Dakini, Rameshvara on the setu, Nagesha in Daruka forest.",
    },
    {
      id: "jy-03",
      text: "वाराणस्यां तु विश्वेशं त्र्यम्बकं गौतमीतटे ।\nहिमालये तु केदारं घुश्मेशं च शिवालये ॥",
      iast: "vārāṇasyāṃ tu viśveśaṃ tryambakaṃ gautamītaṭe | himālaye tu kedāraṃ ghuśmeśaṃ ca śivālaye ||",
      hi: "वाराणसी विश्वेश्वर, गौतमी तट त्र्यम्बक, हिमालय केदार, शिवालय घुश्मेश।",
      en: "Vishvesha in Varanasi, Tryambaka on the Gautami, Kedara in the Himalaya, Ghushmesha in the Shivalaya.",
    },
    {
      id: "jy-04",
      kind: "phalashruti",
      text: "एतानि ज्योतिर्लिङ्गानि सायं प्रातः पठेन्नरः ।\nसप्तजन्मकृतं पापं स्मरणेन विनश्यति ॥",
      iast: "etāni jyotirliṅgāni sāyaṃ prātaḥ paṭhennaraḥ | saptajanmakṛtaṃ pāpaṃ smaraṇena vinaśyati ||",
      hi: "इन ज्योतिर्लिङ्गों का प्रातः-सायं पाठ — सात जन्म के पाप स्मरण मात्र से नष्ट।",
      en: "Who recites these jyotirlingas at dusk and dawn — sin of seven births perishes by remembrance.",
    },
  ],
);

writePack(
  "somvar-vrat-katha",
  {
    id: "somvar-vrat-katha",
    slug: "somvar-vrat-katha",
    deity: "shiva",
    title: { hi: "सोमवार व्रत कथा", en: "Somvar vrata katha" },
    subtitle: { hi: "घर-आँगन पाठ · स्रोत सहित", en: "Household recension · sourced" },
    originalLang: "hi",
    script: "Deva",
    edition: {
      pin: "SOMVAR-KATHA-HOUSEHOLD",
      publisher: "North Indian household recension (plain)",
      notes:
        "Not a shastra quote. Short plain katha told in many North Indian homes on Monday vrata. Local tellings vary; this is a compressed seva text, not a critical edition.",
    },
    flags,
    wave: 1,
    category: "katha",
    description: {
      hi: "सोमवार व्रत की सरल कथा — बिल्व, जल, नाम जप।",
      en: "A plain Monday-vrata story — bel, water, Name.",
    },
  },
  [
    {
      id: "sv-01",
      kind: "katha",
      text: "एक नगर में एक दरिद्र स्त्री सोमवार को शिव की पूजा करती थी। बिल्व पत्र, गङ्गा-जल और ‘ॐ नमः शिवाय’ — इतना ही उसका व्रत था।",
      iast: "eka nagara meṃ eka daridra strī somavāra ko śiva kī pūjā kartī thī.",
      hi: "घर-आँगन सोमवार व्रत — बिल्व, जल, पञ्चाक्षर।",
      en: "A poor woman kept Monday vrata with bel, water, and Om Namah Shivaya.",
    },
    {
      id: "sv-02",
      kind: "katha",
      text: "पड़ोसी हँसे — ‘इससे क्या होगा?’ वह बोली — ‘फल शिव जानें; मेरा काम नाम जपना है।’",
      iast: "paṛosī haṃse — isase kyā hogā?",
      hi: "फल की चिन्ता नहीं — नाम का काम।",
      en: "Neighbours mocked; she said fruit is Shiva’s, her work is the Name.",
    },
    {
      id: "sv-03",
      kind: "katha",
      text: "एक सोमवार उसके घर दीया नहीं जला। वह आँगन में बैठी, जलाञ्जलि देकर जप करती रही। रात को स्वप्न में नन्दी द्वार पर खड़े दिखे — ‘माँ बुलाती हैं।’",
      iast: "eka somavāra usake ghara dīyā nahīṃ jalā.",
      hi: "दीया न जला — जप नहीं रुका।",
      en: "One Monday the lamp failed; the japa did not. Nandi appeared at the gate.",
    },
    {
      id: "sv-04",
      kind: "katha",
      text: "कहा जाता है — शिव ने उसके व्रत को स्वीकार किया। धन नहीं माँगा था; शान्ति मिली। सोमवार व्रत का सार यही — जल, बिल्व, सत्य वचन, पञ्चाक्षर।",
      iast: "somavāra vrata kā sāra — jala, bilva, satya, pañcākṣara.",
      hi: "सार: जल, बिल्व, सत्य, पञ्चाक्षर। स्थानीय रीति मान्य।",
      en: "The heart of the vrata: water, bel, truthful speech, the five-syllable Name. Local custom wins.",
    },
  ],
);

writePack(
  "kali-gayatri",
  {
    id: "kali-gayatri",
    slug: "kali-gayatri",
    deity: "kali",
    title: { hi: "काली गायत्री", en: "Kali Gayatri" },
    subtitle: { hi: "ॐ कालीकाल्यै विद्महे", en: "Om Kalikalyai vidmahe" },
    originalLang: "sa",
    script: "Deva",
    edition: {
      pin: "KALI-GAYATRI-PUBLIC",
      publisher: "Public smarta recension",
      notes:
        "Household gayatri in common public recension. A second form (Mahakali / smashana-vasini) exists; this pin keeps the Kalikalyai vidmahe line used in many temple booklets. Not a tantric uddhara.",
    },
    flags,
    wave: 1,
    category: "mantra",
    description: {
      hi: "माँ काली की गायत्री — घर जप।",
      en: "Kali Gayatri for household japa.",
    },
  },
  [
    {
      id: "kg-01",
      kind: "mantra",
      text: "ॐ कालीकाल्यै विद्महे श्मशानवासिन्यै धीमहि ।\nतन्नो काली प्रचोदयात् ॥",
      iast: "oṃ kālīkālyai vidmahe śmaśānavāsinyai dhīmahi | tanno kālī pracodayāt ||",
      hi: "कालीकाली को जानें, श्मशानवासिनी का ध्यान करें; वह काली हमें प्रेरित करें।",
      en: "We know Kalikali; we meditate on her who dwells in the smashana; may that Kali impel us.",
    },
  ],
);

writePack(
  "mahakali-stotra",
  {
    id: "mahakali-stotra",
    slug: "mahakali-stotra",
    deity: "kali",
    title: { hi: "महाकाली स्तोत्र", en: "Mahakali Stotra" },
    subtitle: { hi: "जयन्ती मङ्गला काली", en: "Jayanti Mangala Kali" },
    originalLang: "sa",
    script: "Deva",
    edition: {
      pin: "MAHAKALI-ARGALA-DHYANA",
      publisher: "Public recension (Argala / dhyana)",
      notes:
        "Short public verses: dhyana of Dakshina Kali + Argala Stotra opening (Devi Mahatmya tradition). Not Karpuradi, not a dumped sahasranama.",
    },
    flags,
    wave: 1,
    category: "stotra",
    description: {
      hi: "संक्षिप्त महाकाली स्तुति — ध्यान व अर्गला का सार्वजनिक पद।",
      en: "A short Mahakali hymn from public dhyana and Argala verses.",
    },
  },
  [
    {
      id: "mk-01",
      kind: "dhyana",
      text: "ॐ करालवदनां घोरां मुक्तकेशीं चतुर्भुजाम् ।\nकालिकां दक्षिणां दिव्यां मुण्डमालाविभूषिताम् ॥",
      iast: "oṃ karālavadanāṃ ghorāṃ muktakeśīṃ caturbhujām | kālikāṃ dakṣiṇāṃ divyāṃ muṇḍamālāvibhūṣitām ||",
      hi: "कराल वदन, मुक्तकेशी, चतुर्भुज दक्षिणा काली, मुण्डमाला — दिव्य ध्यान।",
      en: "Dhyana of Dakshina Kali — fierce face, unbound hair, four arms, garland of heads; reverent, not sensational.",
    },
    {
      id: "mk-02",
      text: "ॐ जयन्ती मङ्गला काली भद्रकाली कपालिनी ।\nदुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥",
      iast: "oṃ jayantī maṅgalā kālī bhadrakālī kapālinī | durgā kṣamā śivā dhātrī svāhā svadhā namo'stu te ||",
      hi: "जयन्ती, मङ्गला, काली, भद्रकाली, कपालिनी, दुर्गा, क्षमा, शिवा, धात्री — नमः।",
      en: "Jayanti, Mangala, Kali, Bhadrakali, Kapalini, Durga, Kshama, Shiva, Dhatri, Svaha, Svadha — homage to You.",
    },
    {
      id: "mk-03",
      text: "कालि कालि महाकालि कालिके परमेश्वरि ।\nसर्वदेवि नमस्तुभ्यं नरकार्णवतारिणि ॥",
      iast: "kāli kāli mahākāli kālike parameśvari | sarvadevi namastubhyaṃ narakārṇavatāriṇi ||",
      hi: "काली महाकाली परमेश्वरि, नरक-सागर से तारने वाली — नमः।",
      en: "Kali, Mahakali, Kalika, supreme Lady of all goddesses — homage, ferry across the ocean of naraka.",
    },
  ],
);

const kaliNames = [
  ["ks-01", "काली", "Kālī", "kālī", "कालस्वरूपा आदि शक्ति।", "Time-form, the first Shakti."],
  ["ks-02", "महाकाली", "Mahākālī", "mahākālī", "महाकाल की शक्ति।", "Shakti of Mahakala."],
  ["ks-03", "भद्रकाली", "Bhadrakālī", "bhadrakālī", "मङ्गलदा काली।", "Auspicious Kali."],
  ["ks-04", "दक्षिणा", "Dakṣiṇā", "dakṣiṇā", "दाहिने पैर आगे — करुणा रूप।", "Right foot forward — compassionate form."],
  ["ks-05", "आद्या", "Ādyā", "ādyā", "आदि शक्ति।", "The primordial."],
  ["ks-06", "चामुण्डा", "Cāmuṇḍā", "cāmuṇḍā", "चण्ड-मुण्ड संहारिणी।", "Slayer of Chanda and Munda."],
  ["ks-07", "कपालिनी", "Kapālinī", "kapālinī", "कपाल धारिणी।", "Bearer of the kapala."],
  ["ks-08", "श्मशानवासिनी", "Śmaśānavāsinī", "śmaśānavāsinī", "श्मशान निवासिनी — भय हारिणी।", "Dweller of the smashana — who takes fear."],
  ["ks-09", "मुण्डमालिनी", "Muṇḍamālinī", "muṇḍamālinī", "मुण्डमाला धारिणी।", "Wearing the garland of heads."],
  ["ks-10", "चतुर्भुजा", "Caturbhujā", "caturbhujā", "चार भुजा।", "Four-armed."],
  ["ks-11", "मुक्तकेशी", "Muktakeśī", "muktakeśī", "खुले केश।", "Unbound hair."],
  ["ks-12", "करालवदना", "Karālavadanā", "karālavadanā", "विकट वदन — असुर-नाश।", "Terrible face — asura-ending."],
  ["ks-13", "शिववामाङ्कसंस्थिता", "Śivavāmāṅkasaṃsthitā", "śivavāmāṅkasaṃsthitā", "शिव की वामाङ्क पर।", "Seated at Shiva’s left."],
  ["ks-14", "तारिणी", "Tāriṇī", "tāriṇī", "संसार से तारने वाली।", "Who ferries across."],
  ["ks-15", "भैरवी", "Bhairavī", "bhairavī", "भैरव की शक्ति।", "Shakti of Bhairava."],
  ["ks-16", "गुह्यका", "Guhyakā", "guhyakā", "गुह्य रूप।", "The secret form."],
  ["ks-17", "जगन्माता", "Jaganmātā", "jaganmātā", "जगत् की माता।", "Mother of the world."],
  ["ks-18", "दयामयी", "Dayāmayī", "dayāmayī", "दया से पूर्ण।", "Made of compassion."],
  ["ks-19", "रक्तदन्तिका", "Raktadantikā", "raktadantikā", "रक्तदन्तिका रूप।", "The blood-toothed form (Mahavidya class)."],
  ["ks-20", "सिद्धेश्वरी", "Siddheśvarī", "siddheśvarī", "सिद्धों की ईश्वरी।", "Lady of siddhas."],
  ["ks-21", "कालरात्रि", "Kālarātri", "kālarātri", "काल की रात्रि।", "Night of time."],
  ["ks-22", "भ्रमराम्बिका", "Bhramarāmbikā", "bhramarāmbikā", "भ्रमर रूप Ambika।", "Bee-formed Ambika."],
  ["ks-23", "कमला", "Kamalā", "kamalā", "कमला महाविद्या — सूची मात्र।", "Kamala among Mahavidyas — index only."],
  ["ks-24", "तारा", "Tārā", "tārā", "तारा महाविद्या — सूची मात्र।", "Tara among Mahavidyas — index only."],
  ["ks-25", "षोडशी", "Ṣoḍaśī", "ṣoḍaśī", "षोडशी — सूची मात्र।", "Shodashi — index only."],
  ["ks-26", "क्रींबीजधारिणी", "Krīṃbījadhāriṇī", "krīṃbījadhāriṇī", "क्रीं बीज की अधिष्ठात्री (नाम मात्र)।", "Lady of the Krim bija (name only)."],
  ["ks-27", "नमोऽस्तु ते", "Namo'stu te", "namo'stu te", "इन नामों को नमन — पूर्ण सहस्रनाम यहाँ नहीं।", "Homage to these names — the full thousand is not dumped here."],
];

writePack(
  "kali-sahasranama-selected",
  {
    id: "kali-sahasranama-selected",
    slug: "kali-sahasranama-selected",
    deity: "kali",
    title: { hi: "काली सहस्रनाम · चयन", en: "Kali Sahasranama · selected names" },
    subtitle: { hi: "सूची + २७ नाम · पूर्ण सूची नहीं", en: "Index + 27 names · not a dump" },
    originalLang: "sa",
    script: "Deva",
    edition: {
      pin: "KALI-SAHASRANAMA-INDEX-27",
      publisher: "Public name-lists (selected)",
      notes:
        "Not the full Kali Sahasranama. Twenty-seven public names as an index for household remembrance. Tantric paddhati and full thousand-name dump omitted on purpose.",
    },
    flags,
    wave: 1,
    category: "nama",
    description: {
      hi: "सहस्रनाम का द्वार — चयनित नाम, पूरी सूची नहीं।",
      en: "A doorway to the sahasranama — selected names, not the full list.",
    },
  },
  kaliNames.map(([id, hiName, enName, iast, hi, en]) => ({
    id,
    kind: "nama",
    text: hiName,
    iast,
    hi: `${hiName} — ${hi}`,
    en: `${enName} — ${en}`,
  })),
);

writePack(
  "kali-aarti-bengal",
  {
    id: "kali-aarti-bengal",
    slug: "kali-aarti-bengal",
    deity: "kali",
    title: { hi: "काली आरती · बंगाल पीठ", en: "Kali aarti · Bengal pith" },
    subtitle: { hi: "क्षेत्रीय पाठ · कालीघाट / दक्षिणेश्वर भाव", en: "Regional recension · Kalighat / Dakshineswar mood" },
    originalLang: "hi",
    script: "Deva",
    edition: {
      pin: "KALI-AARTI-BENGAL-TEMPLE",
      publisher: "Bengal temple booklet class",
      notes:
        "Labeled regional variant. North Indian ‘Jai Kali Mata’ remains kali-aarti. Line-order and refrain vary by pith; this is a short Bengal-mood household aarti, not a critical folk edition.",
    },
    flags,
    wave: 1,
    category: "aarti",
    description: {
      hi: "बंगाल पीठ की आरती शैली — जय काली महाकाली।",
      en: "Bengal pith aarti style — Jai Kali Mahakali.",
    },
  },
  [
    {
      id: "kab-01",
      kind: "line",
      text: "जय काली जय काली महाकाली जय ।\nजय काली जय काली महाकाली जय ॥",
      iast: "jaya kālī jaya kālī mahākālī jaya",
      hi: "जय काली महाकाली।",
      en: "Victory to Kali, Mahakali.",
    },
    {
      id: "kab-02",
      kind: "line",
      text: "दक्षिणेश्वर कालीघाट कामाख्या मैया ।\nआद्यापीठ विराजे माँ जवा फूल गले ॥",
      iast: "dakṣiṇeśvara kālīghāṭa kāmākhyā maiyā",
      hi: "दक्षिणेश्वर, कालीघाट, कामाख्या, आद्यापीठ।",
      en: "Dakshineswar, Kalighat, Kamakhya, Adyapeeth — Mother with hibiscus.",
    },
    {
      id: "kab-03",
      kind: "line",
      text: "दीप जले आरती हो, माँ की गोद विशाल ।\nडर मिटे नाम जपे, जय काली महाकाली जय ॥",
      iast: "dīpa jale āratī ho, māṃ kī goda viśāla",
      hi: "दीप-आरती, गोद विशाल, नाम से डर मिटे।",
      en: "Lamp and aarti; the Mother’s lap is wide; the Name takes fear.",
    },
  ],
);

console.log("wave-1 texts written");
