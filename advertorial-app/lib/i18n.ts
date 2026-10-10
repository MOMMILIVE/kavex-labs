import type { Language } from "./languages";
export { languages, getLanguage, routeFor, type Language } from "./languages";

// Norwegian Bokmål and Arabic translations. English remains the supplied copy source.
const translations: Record<string, [string, string]> = {
  "🌐 MARKET UPDATE: Global gold and raw diamond commodities fluctuate daily. Secure your allocation today to lock in current direct-forge pricing.": [
    "🌐 MARKEDSOPPDATERING: De globale råvareprisene på gull og rådiamanter svinger daglig. Sikre deg tilgang i dag for å låse inn gjeldende priser direkte fra produksjonen.",
    "🌐 تحديث السوق: تتقلب أسعار الذهب والألماس الخام عالمياً كل يوم. احجز حصتك اليوم لتثبيت الأسعار الحالية المباشرة من مصدر الإنتاج.",
  ],
  "🔒 Due to current volatility in global commodity markets, your custom CAD quote will be strictly price-locked for 48 hours upon issuance.": [
    "🔒 På grunn av dagens svingninger i de globale råvaremarkedene låses prisen på ditt skreddersydde CAD-tilbud i 48 timer fra utstedelsen.",
    "🔒 نظراً للتقلبات الحالية في أسواق السلع العالمية، سيُثبَّت سعر عرض التصميم المخصص باستخدام CAD بشكل صارم لمدة 48 ساعة من لحظة إصداره.",
  ],
  "Why Scandinavia's Elite Are Quietly Ditching Traditional Retail Jewelers For Engineered Status.":
    [
      "Hvorfor Skandinavias elite i det stille vender ryggen til tradisjonelle smykkebutikker til fordel for presist utformet status.",
      "لماذا تتخلى نخبة إسكندنافيا بهدوء عن متاجر المجوهرات التقليدية لصالح مكانة تُصاغ بدقة.",
    ],
  "Engineered Status.": ["presist utformet status.", "مكانة تُصاغ بدقة."],
  "Rated 4.9/5 by 120+ Private Clients in Scandinavia.": [
    "Vurdert til 4,9/5 av over 120 private kunder i Skandinavia.",
    "تقييم 4.9/5 من أكثر من 120 عميلاً خاصاً في إسكندنافيا.",
  ],
  "If she sent you this link, she wants the dream ring. But she doesn't want you to be ripped off by the retail industry's 50,000 Kr lie. Welcome to the Bespoke Architect protocol.":
    [
      "Hvis hun sendte deg denne lenken, ønsker hun seg drømmeringen. Men hun vil ikke at du skal betale for smykkebransjens løgn til 50 000 kroner. Velkommen til Bespoke Architect-protokollen.",
      "إذا أرسلت لك هذا الرابط، فهي تريد خاتم أحلامها. لكنها لا تريد أن تدفع ثمن خدعة متاجر المجوهرات البالغة 50,000 كرونة نرويجية. مرحباً بك في منهج التصميم حسب الطلب.",
    ],
  "You’ve been conditioned to believe that a velvet box and a glass display case justify a 300% markup. It doesn't.":
    [
      "Du har blitt lært opp til å tro at en fløyelseske og en glassmonter rettferdiggjør et prispåslag på 300 %. Det gjør de ikke.",
      "لقد اعتدت الاعتقاد بأن علبة مخملية وواجهة عرض زجاجية تبرران زيادة سعرية بنسبة 300%. هذا غير صحيح.",
    ],
  "For decades, traditional luxury brands have relied on artificial scarcity and legacy marketing to sell mass-produced jewelry at extortionate prices. They are selling you an illusion, not a superior product.":
    [
      "I flere tiår har tradisjonelle luksusmerker brukt kunstig knapphet og etablert markedsføring til å selge masseproduserte smykker til urimelige priser. De selger deg en illusjon, ikke et bedre produkt.",
      "على مدى عقود، اعتمدت علامات الفخامة التقليدية على الندرة المصطنعة والتسويق الموروث لبيع مجوهرات منتجة بكميات كبيرة بأسعار مبالغ فيها. إنها تبيعك وهماً، لا منتجاً متفوقاً.",
    ],
  "At **Kavex Labs**, we reject the retail charade. We operate purely as Bespoke Architects. No retail storefronts. No generic inventory. No salespeople working on commission.":
    [
      "Hos **Kavex Labs** avviser vi butikkbransjens skuespill. Vi arbeider utelukkende som Bespoke Architects. Ingen butikker. Ingen standardvarer på lager. Ingen selgere som jobber på provisjon.",
      "في **Kavex Labs**، نرفض استعراض تجارة التجزئة. نعمل حصرياً كمصممين حسب الطلب. بلا واجهات بيع. بلا مخزون نمطي. بلا مندوبي مبيعات يعملون بالعمولة.",
    ],
  "We source lab-grown, chemically perfect diamonds directly from the forge. We engineer each setting using aerospace-grade CAD precision. And we deliver the final asset directly to you, cutting out the middlemen who inflate the price by tens of thousands of Krone.":
    [
      "Vi henter laboratoriedyrkede, kjemisk perfekte diamanter direkte fra produksjonen. Hver innfatning utformes med CAD-presisjon på nivå med luftfartsindustrien. Det ferdige smykket leveres direkte til deg, uten mellomledd som øker prisen med titusener av kroner.",
      "نحصل على ألماس مزروع في المختبر وكامل كيميائياً مباشرة من مصدر الإنتاج. نصمم كل تثبيت بدقة CAD بمستوى صناعة الطيران. ونسلمك القطعة النهائية مباشرة، متجاوزين الوسطاء الذين يرفعون السعر بعشرات الآلاف من الكرونات.",
    ],
  "This isn't for everyone. It isn't meant to be. We don't have a catalog for you to browse. We have a private vault, and we grant allocations only to those who understand the mathematics of true luxury.":
    [
      "Dette er ikke for alle. Det er heller ikke meningen. Vi har ingen katalog du kan bla i. Vi har et privat hvelv, og gir kun tilgang til dem som forstår regnestykket bak ekte luksus.",
      "هذا ليس للجميع، ولم يُصمم ليكون كذلك. ليس لدينا كتالوج لتصفحه. لدينا خزينة خاصة، ونمنح إمكانية الاختيار فقط لمن يفهمون حسابات الفخامة الحقيقية.",
    ],
  "Traditional jewelers are hiding a dirty industry secret. They buy their lab-grown diamonds from the exact same high-tech plasma reactors that we do. But before it reaches you, they inflate the price by 300% to pay for their expensive storefront rent, commission-based salespeople, and velvet display cases.": [
    "Tradisjonelle gullsmeder skjuler en skitten bransjehemmelighet. De kjøper sine laboratoriedyrkede diamanter fra nøyaktig de samme høyteknologiske plasmareaktorene som vi gjør. Men før diamanten når deg, øker de prisen med 300 % for å betale for dyr butikkleie, provisjonsbaserte selgere og utstillingsmontere i fløyel.",
    "يخفي تجار المجوهرات التقليديون سراً قذراً في هذه الصناعة. فهم يشترون ألماسهم المزروع في المختبر من مفاعلات البلازما عالية التقنية نفسها التي نشتري منها. لكن قبل أن يصل إليك، يرفعون السعر بنسبة 300% لتغطية إيجارات متاجرهم الباهظة، ومندوبي المبيعات الذين يعملون بالعمولة، وصناديق العرض المخملية.",
  ],
  "Smart money refuses to fund a retailer's overhead. Smart money goes directly to the source. A chemically perfect 3-carat lab diamond should not cost you 120,000 Kr in a retail store. It costs 45,000 Kr when you commission it directly from the forge.": [
    "Smarte penger nekter å finansiere en forhandlers driftskostnader. Smarte penger går direkte til kilden. En kjemisk perfekt laboratoriedyrket diamant på 3 karat bør ikke koste deg 120 000 Kr i en butikk. Den koster 45 000 Kr når du bestiller den direkte fra produksjonen.",
    "المال الذكي يرفض تمويل النفقات التشغيلية لتاجر التجزئة. المال الذكي يتجه مباشرة إلى المصدر. ينبغي ألا تكلفك ألماسة مخبرية كاملة كيميائياً بوزن 3 قيراط 120,000 كرونة في متجر تجزئة. إنها تكلف 45,000 كرونة عندما تطلب تصنيعها مباشرة من مصدر الإنتاج.",
  ],
  "**Worldwide Shipping & Zero Hidden Fees:** Your commission, delivered worldwide. 100% of the MVA (VAT) and Import Duties are handled and paid for by Kavex Labs. The price on your invoice is the final price.": [
    "**Levering over hele verden uten skjulte kostnader:** Ditt skreddersydde smykke, levert verden over. Kavex Labs håndterer og betaler all merverdiavgift (MVA) og alle importavgifter. Prisen på fakturaen er den endelige prisen.",
    "**شحن عالمي بلا رسوم خفية:** مجوهراتك المصممة حسب الطلب، تصلك أينما كنت. تتولى Kavex Labs كامل ضريبة القيمة المضافة ورسوم الاستيراد وتدفعها. السعر المذكور في فاتورتك هو السعر النهائي.",
  ],
  "**Independent IGI Certification:** Every Kavex centerpiece is independently graded and laser-inscribed by the International Gemological Institute (IGI). You receive the physical dossier verifying its exact cut, color, clarity, and carat weight.": [
    "**Uavhengig IGI-sertifisering:** Hver midtstein fra Kavex graderes uavhengig og lasermerkes av International Gemological Institute (IGI). Du mottar et fysisk sertifiseringsdokument som bekrefter steinens nøyaktige slip, farge, klarhet og karatvekt.",
    "**شهادة IGI المستقلة:** يُقيَّم كل حجر رئيسي من Kavex بصورة مستقلة، ويُنقش بالليزر لدى المعهد الدولي للأحجار الكريمة (IGI). تتلقى الملف الورقي الذي يوثّق بدقة قصّته ولونه ونقاءه ووزنه بالقيراط.",
  ],
  "**Perfect Size Insurance:** We eliminate the anxiety of guessing. If the ring does not fit flawlessly on the first try, our private concierge will handle the resizing logistics entirely at our expense for the first year. Zero friction. Zero cost.": [
    "**Garanti for perfekt passform:** Vi fjerner uroen ved å måtte gjette. Hvis ringen ikke sitter perfekt ved første forsøk, håndterer vår private concierge all logistikk rundt størrelsesjusteringen, helt for vår regning det første året. Uten friksjon. Uten kostnad.",
    "**ضمان المقاس المثالي:** نزيل قلق التخمين. إذا لم تكن ملاءمة الخاتم مثالية من التجربة الأولى، يتولى الكونسيرج الخاص بنا جميع إجراءات تعديل المقاس بالكامل على نفقتنا خلال السنة الأولى. بلا تعقيد. بلا تكلفة.",
  ],
  "**100% Conflict-Free:** Scandinavian engineered sustainability. Climate neutral and ethically sourced.":
    [
      "**100 % konfliktfritt:** Bærekraft utformet i Skandinavia. Klimanøytralt og etisk fremskaffet.",
      "**خالٍ من النزاعات بنسبة 100%:** استدامة مصممة في إسكندنافيا. محايد مناخياً ومن مصادر أخلاقية.",
    ],
  "My fiancée sent me their TikTok. I bypassed the retail markup and got a stone twice the size with higher clarity. The CAD process was flawless.":
    [
      "Forloveden min sendte meg TikTok-videoen deres. Jeg slapp butikkpåslaget og fikk en diamant som var dobbelt så stor, med høyere klarhet. CAD-prosessen var feilfri.",
      "أرسلت لي خطيبتي فيديو تيك توك الخاص بهم. تجنبت هامش متاجر التجزئة وحصلت على حجر بحجم مضاعف ونقاء أعلى. كانت عملية التصميم باستخدام CAD مثالية.",
    ],
  "If she sent you here, she already knows what she wants. Now it is your job to execute it intelligently. Do not step foot in a retail store until you see what is in the vault.":
    [
      "Hvis hun sendte deg hit, vet hun allerede hva hun vil ha. Nå er det din oppgave å gjennomføre det smart. Ikke gå inn i en smykkebutikk før du har sett hva som finnes i hvelvet.",
      "إذا أرسلتك إلى هنا، فهي تعرف بالفعل ما تريد. الآن دورك أن تحقق ذلك بذكاء. لا تدخل متجراً قبل أن ترى ما في الخزينة.",
    ],
  "THE SOURCING JOURNAL": ["JOURNALEN FRA KILDEN", "مجلة المصادر"],
  "Request Allocation": ["Be om tildeling", "اطلب حصة"],
  "Kavex Labs home": ["Kavex Labs hjem", "الرئيسية — Kavex Labs"],
  "ENGINEERED DIRECTLY AT THE SOURCE.": [
    "UTFORMET DIREKTE VED KILDEN.",
    "مصمّم مباشرة عند المصدر.",
  ],
  Privacy: ["Personvern", "الخصوصية"],
  "Back to top ↑": ["Til toppen ↑", "إلى الأعلى ↑"],
  "Skip to content": ["Hopp til innhold", "انتقل إلى المحتوى"],
  "KAVEX PERSPECTIVES": ["KAVEX PERSPEKTIVER", "رؤى KAVEX"],
  "VOL. 01 / THE MANIFESTO": ["UTG. 01 / MANIFESTET", "العدد 01 / البيان"],
  "By: M. Jacob": ["Av: M. Jacob", "بقلم: M. Jacob"],
  "Head of Sourcing": ["Ansvarlig for innkjøp", "رئيس قسم التوريد"],
  "READ TIME: 3 MIN": ["LESETID: 3 MIN", "وقت القراءة: 3 دقائق"],
  "READ THE STORY": ["LES HISTORIEN", "اقرأ القصة"],
  "THE BESPOKE ARCHITECT PROTOCOL": [
    "BESPOKE ARCHITECT-PROTOKOLLEN",
    "منهج التصميم حسب الطلب",
  ],
  "Precision.": ["Presisjon.", "دقة."],
  "Without the theatre.": ["Uten skuespillet.", "بلا استعراض."],
  "DESIGN → SOURCE → ENGINEER": [
    "DESIGN → INNKJØP → UTFORMING",
    "تصميم ← توريد ← هندسة",
  ],
  "FIG. 01 / THE ARCHITECTURE": ["FIG. 01 / ARKITEKTUREN", "الشكل 01 / البنية"],
  "From a private vision to a precisely engineered setting.": [
    "Fra en personlig visjon til en presist utformet innfatning.",
    "من رؤية خاصة إلى تثبيت مصمّم بدقة.",
  ],
  "KAVEX LABS / ATELIER STUDY": [
    "KAVEX LABS / ATELIERSTUDIE",
    "KAVEX LABS / دراسة المشغل",
  ],
  "Article contents": ["Artikkelinnhold", "محتويات المقال"],
  "IN THIS PERSPECTIVE": ["I DETTE PERSPEKTIVET", "في هذه الرؤية"],
  "The protocol": ["Protokollen", "المنهج"],
  "Modern wealth": ["Moderne formue", "الثروة الحديثة"],
  "The guarantee": ["Garantien", "الضمان"],
  "Private access": ["Privat tilgang", "الوصول الخاص"],
  "Direct access.": ["Direkte tilgang.", "وصول مباشر."],
  "Singular vision.": ["En unik visjon.", "رؤية فريدة."],
  "01 / THE PROTOCOL": ["01 / PROTOKOLLEN", "01 / المنهج"],
  "Rated 4.9 out of 5": ["Vurdert til 4,9 av 5", "تقييم 4.9 من 5"],
  "PRIVATE CLIENTS.": ["PRIVATE KUNDER.", "عملاء خاصون."],
  "EXCEPTIONAL STANDARDS.": ["EKSEPSJONELLE STANDARDER.", "معايير استثنائية."],
  "02 / THE MODERN WEALTH PROTOCOL": [
    "02 / PROTOKOLLEN FOR MODERNE FORMUE",
    "02 / منهج الثروة الحديثة",
  ],
  "The mathematics": ["Regnestykket", "حسابات"],
  "of true luxury.": ["bak ekte luksus.", "الفخامة الحقيقية."],
  "Illustrative wealth comparison from the manifesto": [
    "Illustrerende prissammenligning fra manifestet",
    "مقارنة توضيحية من البيان",
  ],
  "TRADITIONAL RETAIL": ["TRADISJONELL BUTIKK", "التجزئة التقليدية"],
  "KAVEX DIRECT-FORGE": ["KAVEX DIREKTE FRA PRODUKSJONEN", "KAVEX مباشرة من مصدر الإنتاج"],
  "THE RETAIL SCAM (DIFFERENCE)": ["BUTIKKSVINDELEN (FORSKJELLEN)", "خدعة التجزئة (الفارق)"],
  "FIG. 02 / FORMED AT THE SOURCE": [
    "FIG. 02 / FORMET VED KILDEN",
    "الشكل 02 / صُنع عند المصدر",
  ],
  "Every commission begins with intention.": [
    "Hvert oppdrag begynner med en hensikt.",
    "كل طلب يبدأ بفكرة.",
  ],
  "03 / THE KAVEX GUARANTEE": ["03 / KAVEX-GARANTIEN", "03 / ضمان KAVEX"],
  "Nothing hidden.": ["Ingenting skjult.", "لا شيء خفي."],
  "Nothing compromised.": ["Ingen kompromisser.", "بلا تنازلات."],
  " / PRIVATE CLIENT": [" / PRIVAT KUNDE", " / عميل خاص"],
  "04 / PRIVATE ACCESS": ["04 / PRIVAT TILGANG", "04 / الوصول الخاص"],
  "She knows what she wants.": ["Hun vet hva hun vil ha.", "هي تعرف ما تريد."],
  "Execute it intelligently.": ["Gjennomfør det smart.", "حقّق ذلك بذكاء."],
  "REQUEST VAULT ALLOCATION": [
    "BE OM TILGANG TIL HVELVET",
    "اطلب حصة من الخزينة",
  ],
  "FIVE STEPS. ONE PRIVATE CONVERSATION.": [
    "FEM TRINN. ÉN PRIVAT SAMTALE.",
    "خمس خطوات. محادثة خاصة واحدة.",
  ],
  "END OF PERSPECTIVE / VOL. 01": [
    "SLUTT PÅ PERSPEKTIVET / UTG. 01",
    "نهاية الرؤية / العدد 01",
  ],
  "A Kavex engagement ring rendered as a precision CAD blueprint on an atelier monitor":
    [
      "En Kavex-forlovelsesring vist som en presis CAD-tegning på en skjerm i atelieret",
      "خاتم خطوبة Kavex معروض كمخطط CAD دقيق على شاشة المشغل",
    ],
  "Molten gold being poured by a gloved jeweler in a dark workshop": [
    "Smeltet gull helles av en gullsmed med hansker i et mørkt verksted",
    "صائغ يرتدي قفازات يصب الذهب المنصهر في ورشة مظلمة",
  ],
  "PRIVATE COMMISSIONS": ["PRIVATE OPPDRAG", "طلبات خاصة"],
  "KAVEX LABS / DIRECT ACCESS": [
    "KAVEX LABS / DIREKTE TILGANG",
    "KAVEX LABS / وصول مباشر",
  ],
  "Your vision": ["Din visjon", "رؤيتك"],
  Centerpiece: ["Diamanten", "الحجر الرئيسي"],
  "The scale": ["Størrelsen", "الحجم"],
  Allocation: ["Budsjettet", "الميزانية"],
  Introduction: ["Introduksjon", "التعارف"],
  "What are we creating?": ["Hva skal vi skape?", "ماذا سنصنع؟"],
  "Define the aesthetic.": ["Definer uttrykket.", "حدّد الطابع الجمالي."],
  "Define the carat weight.": ["Definer karatvekten.", "حدّد وزن القيراط."],
  "Define your allocation.": ["Definer budsjettet ditt.", "حدّد ميزانيتك."],
  "A private introduction.": ["En privat introduksjon.", "تعارف خاص."],
  "Every commission starts with a vision. Tell us yours.": [
    "Hvert oppdrag starter med en visjon. Fortell oss din.",
    "كل طلب يبدأ برؤية. أخبرنا برؤيتك.",
  ],
  "Select her preferred diamond shape, or let our concierge guide you.": [
    "Velg diamantformen hun foretrekker, eller la vår concierge veilede deg.",
    "اختر شكل الألماس الذي تفضله، أو دع الكونسيرج يرشدك.",
  ],
  "Select the target scale for the centerpiece.": [
    "Velg ønsket størrelse på diamanten.",
    "اختر الحجم المستهدف للحجر الرئيسي.",
  ],
  "Choose a comfortable budget. Your concierge will shape the brief with you.":
    [
      "Velg et budsjett som passer deg. Din concierge utformer ønskene sammen med deg.",
      "اختر ميزانية تناسبك. سيصوغ الكونسيرج تفاصيل الطلب معك.",
    ],
  "Your brief is ready. Introduce yourself to our private concierge.": [
    "Ønskene dine er klare. Presenter deg for vår private concierge.",
    "تفاصيل طلبك جاهزة. عرّف بنفسك لدى الكونسيرج الخاص بنا.",
  ],
  "Engagement ring": ["Forlovelsesring", "خاتم خطوبة"],
  "Wedding bands": ["Gifteringer", "خواتم زواج"],
  "Bespoke jewelry": ["Skreddersydde smykker", "مجوهرات حسب الطلب"],
  "A singular beginning.": ["En unik begynnelse.", "بداية فريدة."],
  "Made for a lifetime.": ["Laget for livet.", "صُنعت لتدوم مدى الحياة."],
  "A vision of your own.": ["Din egen visjon.", "رؤية تخصك."],
  Oval: ["Oval", "بيضاوي"],
  Round: ["Rund", "دائري"],
  Emerald: ["Smaragd", "قصّة زمردية"],
  Radiant: ["Radiant", "راديانت"],
  Pear: ["Dråpe", "كمثري"],
  "I need a recommendation": ["Jeg ønsker en anbefaling", "أحتاج إلى توصية"],
  "1 - 2 Carats (Subtle)": ["1–2 karat (Diskré)", "1–2 قيراط (ناعم)"],
  "2 - 3 Carats (Statement)": ["2–3 karat (Markant)", "2–3 قيراط (بارز)"],
  "3 - 4 Carats (The Kavex Standard)": [
    "3–4 karat (Kavex-standarden)",
    "3–4 قيراط (معيار Kavex)",
  ],
  "4 - 5+ Carats (Bespoke)": [
    "4–5+ karat (Skreddersydd)",
    "4–5+ قيراط (حسب الطلب)",
  ],
  "Let's discuss my vision": [
    "La oss snakke om visjonen min",
    "لنتحدث عن رؤيتي",
  ],
  "Request progress": ["Fremdrift", "تقدم الطلب"],
  STEP: ["TRINN", "الخطوة"],
  "Commission type": ["Type oppdrag", "نوع الطلب"],
  "Preferred diamond shape": ["Foretrukket diamantform", "شكل الألماس المفضل"],
  "Target carat weight": ["Ønsket karatvekt", "وزن القيراط المستهدف"],
  "Comfortable budget in Kr": [
    "Ønsket budsjett i Kr",
    "الميزانية المناسبة بالكرونة النرويجية",
  ],
  "Choose a commission to continue.": [
    "Velg et oppdrag for å fortsette.",
    "اختر نوع الطلب للمتابعة.",
  ],
  "Choose a diamond shape or request a recommendation to continue.": [
    "Velg en diamantform eller be om en anbefaling for å fortsette.",
    "اختر شكل الألماس أو اطلب توصية للمتابعة.",
  ],
  "Choose a carat weight or request a recommendation to continue.": [
    "Velg en karatvekt eller be om en anbefaling for å fortsette.",
    "اختر وزن القيراط أو اطلب توصية للمتابعة.",
  ],
  "Choose a budget to continue.": [
    "Velg et budsjett for å fortsette.",
    "اختر ميزانية للمتابعة.",
  ],
  "Enter your name to prepare your introduction.": [
    "Skriv inn navnet ditt for å klargjøre introduksjonen.",
    "أدخل اسمك لإعداد التعارف.",
  ],
  "Enter your phone number with its country code, for example +47 489 00 083.":
    [
      "Skriv inn telefonnummeret ditt med landskode, for eksempel +47 489 00 083.",
      "أدخل رقم هاتفك مع رمز الدولة، مثل ‎+47 489 00 083.",
    ],
  "YOUR PRIVATE BRIEF": ["DINE PRIVATE ØNSKER", "تفاصيل طلبك الخاص"],
  Shape: ["Form", "الشكل"],
  Scale: ["Størrelse", "الحجم"],
  "Your name": ["Navnet ditt", "اسمك"],
  "Full name": ["Fullt navn", "الاسم الكامل"],
  "Phone Number (For iMessage / WhatsApp Concierge)": [
    "Telefonnummer (for iMessage / WhatsApp-concierge)",
    "رقم الهاتف (لكونسيرج iMessage / WhatsApp)",
  ],
  "+47 · Your number": ["+47 · Nummeret ditt", "+47 · رقمك"],
  "Include your country code. Your details will be included in your WhatsApp brief so the concierge can contact you by iMessage or WhatsApp.":
    [
      "Ta med landskoden. Opplysningene dine tas med i WhatsApp-meldingen, slik at din concierge kan kontakte deg via iMessage eller WhatsApp.",
      "أضف رمز الدولة. ستُدرج بياناتك في ملخص WhatsApp ليتمكن الكونسيرج من التواصل معك عبر iMessage أو WhatsApp.",
    ],
  "I agree to share this brief and my details with Kavex Labs via WhatsApp.": [
    "Jeg samtykker til å dele disse ønskene og opplysningene mine med Kavex Labs via WhatsApp.",
    "أوافق على مشاركة تفاصيل هذا الطلب وبياناتي مع Kavex Labs عبر WhatsApp.",
  ],
  "Privacy policy ↗": ["Personvernerklæring ↗", "سياسة الخصوصية ↗"],
  "Your introduction is ready.": [
    "Introduksjonen din er klar.",
    "تعارفك جاهز.",
  ],
  "Continue on WhatsApp": ["Fortsett på WhatsApp", "تابع عبر WhatsApp"],
  "WhatsApp opens with your brief. Tap send there to submit your request.": [
    "WhatsApp åpnes med ønskene dine. Trykk på send der for å sende forespørselen.",
    "سيفتح WhatsApp بتفاصيل طلبك. اضغط على إرسال هناك لتقديم الطلب.",
  ],
  "Prepare my introduction": ["Klargjør introduksjonen min", "جهّز تعارفي"],
  "← Back": ["← Tilbake", "→ رجوع"],
  "← The manifesto": ["← Manifestet", "→ البيان"],
  Continue: ["Fortsett", "متابعة"],
  "Please enable JavaScript to complete the five-step request, or": [
    "Aktiver JavaScript for å fullføre forespørselen i fem trinn, eller",
    "يرجى تفعيل JavaScript لإكمال الطلب بخمس خطوات، أو",
  ],
  "contact the Kavex concierge on WhatsApp": [
    "kontakt Kavex-conciergen på WhatsApp",
    "تواصل مع كونسيرج Kavex عبر WhatsApp",
  ],
  "Engineered Status · The Manifesto": [
    "Presist utformet status · Manifestet",
    "مكانة تُصاغ بدقة · البيان",
  ],
  "Request Vault Allocation": [
    "Be om tilgang til hvelvet",
    "اطلب حصة من الخزينة",
  ],
  "Create a private brief in five steps and connect with the Kavex Labs concierge on WhatsApp.":
    [
      "Utform ønskene dine i fem trinn og kontakt Kavex Labs-conciergen på WhatsApp.",
      "أعدّ تفاصيل طلبك الخاص بخمس خطوات وتواصل مع كونسيرج Kavex Labs عبر WhatsApp.",
    ],
};
export function translate(language: Language, text: string): string {
  return language === "en"
    ? text
    : (translations[text]?.[language === "no" ? 0 : 1] ?? text);
}
