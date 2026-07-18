export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale || normalized.startsWith("/api/"))
    return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function routeLocale(slug: string[]) {
  const locale = isLocale(slug[0]) ? slug[0] : defaultLocale;
  const route = locale === defaultLocale ? slug : slug.slice(1);
  return { locale, route, path: route.join("/") };
}

type ShellMessages = {
  signal: string;
  priceMethod: string;
  nav: [string, string][];
  estimate: string;
  menu: string;
  close: string;
  commercial: string;
  mobileTagline: string;
  startPhotos: string;
  betterStep: string;
  footerTitle: string;
  footerIntro: string;
  explore: string;
  care: string;
  business: string;
  message: string;
  addPhotos: string;
  quickEstimate: string;
};

type CommonMessages = {
  home: string;
  ready: string;
  buildEstimate: string;
  howItWorks: string;
  askQuestion: string;
  source: string;
  checked: string;
  scope: string;
  publicBenchmark: string;
  currentPrice: string;
  matchedRate: string;
  details: string;
  from: string;
};

export const messages: Record<
  Locale,
  { shell: ShellMessages; common: CommonMessages }
> = {
  en: {
    shell: {
      signal: "Straightforward public pricing · scope and sources shown",
      priceMethod: "How prices are set",
      nav: [
        ["Services", "/services"],
        ["Pricing", "/pricing"],
        ["How it works", "/how-it-works"],
        ["Service area", "/service-area"],
        ["FAQ", "/faq"],
        ["Contact", "/contact"],
      ],
      estimate: "Build estimate",
      menu: "Menu",
      close: "Close",
      commercial: "Commercial",
      mobileTagline: "Orange County mobile textile care",
      startPhotos: "Start an estimate",
      betterStep: "A clearer first step",
      footerTitle: "Show us the textile.\nSee the price.",
      footerIntro:
        "Mobile upholstery, mattress, rug and carpet care built around clear scope—not doorstep surprises.",
      explore: "Explore",
      care: "Care",
      business: "Business",
      message: "Message",
      addPhotos: "How it works",
      quickEstimate: "Estimate",
    },
    common: {
      home: "Home",
      ready: "Ready when you are",
      buildEstimate: "Build my estimate ↗",
      howItWorks: "See how it works →",
      askQuestion: "Ask a question →",
      source: "Source",
      checked: "checked",
      scope: "Scope",
      publicBenchmark: "Published benchmark",
      currentPrice: "Current price",
      matchedRate: "Public-rate match",
      details: "Details ↗",
      from: "From",
    },
  },
  es: {
    shell: {
      signal: "Precios públicos claros · alcance y fuentes visibles",
      priceMethod: "Cómo fijamos los precios",
      nav: [
        ["Servicios", "/services"],
        ["Precios", "/pricing"],
        ["Cómo funciona", "/how-it-works"],
        ["Área de servicio", "/service-area"],
        ["Preguntas", "/faq"],
        ["Contacto", "/contact"],
      ],
      estimate: "Calcular precio",
      menu: "Menú",
      close: "Cerrar",
      commercial: "Comercial",
      mobileTagline: "Cuidado textil móvil en Orange County",
      startPhotos: "Iniciar cálculo",
      betterStep: "Un primer paso más claro",
      footerTitle: "Muéstranos el textil.\nMira el precio.",
      footerIntro:
        "Cuidado móvil de tapicería, colchones, alfombras y moquetas con un alcance claro, sin sorpresas al llegar.",
      explore: "Explorar",
      care: "Cuidados",
      business: "Empresa",
      message: "Mensaje",
      addPhotos: "Cómo funciona",
      quickEstimate: "Precio",
    },
    common: {
      home: "Inicio",
      ready: "Cuando estés listo",
      buildEstimate: "Calcular mi precio ↗",
      howItWorks: "Ver cómo funciona →",
      askQuestion: "Hacer una pregunta →",
      source: "Fuente",
      checked: "consultado",
      scope: "Alcance",
      publicBenchmark: "Referencia publicada",
      currentPrice: "Precio actual",
      matchedRate: "Precio público igualado",
      details: "Detalles ↗",
      from: "Desde",
    },
  },
};

export const homeMessages = {
  en: {
    heroEyebrow: "Orange County · mobile textile care",
    heroTitle: "Clean fabric. Clear price.",
    heroDek:
      "Sofas, sectionals, mattresses and carpets—with an instant menu-based estimate and photo review before confirmation.",
    heroPrice: "Current sofa price",
    priceNoteLabel: "Scope check",
    priceNote:
      "Your menu estimate is confirmed against the actual item and photos before work. Nothing extra starts without approval.",
    scroll: "Scroll to explore",
    priceEyebrow: "Fast price anchors",
    priceTitle: "Start with the item. Know the number.",
    priceCopy:
      "Novaclean matches the cited public rates for comparable scope. The source, checked date and service definition stay beside every price.",
    priceFoot:
      "No core-zone visit minimum for sofa, sectional or mattress service. Source records and checked dates are public.",
    fullPricing: "Open full pricing →",
    problemEyebrow: "Choose the problem",
    problemTitle: "Don’t learn our menu. Tell us what happened.",
    problemCopy:
      "The right branch asks different questions: pet odor is not a routine refresh, and a sectional should not become surprise piece-count math at the door.",
    problems: [
      [
        "My sofa looks tired",
        "/services/sofa-couch-cleaning",
        "Everyday soil + spots",
      ],
      [
        "I have pet odor",
        "/services/pet-stain-odor-removal",
        "Source-level assessment",
      ],
      [
        "I need a sleep reset",
        "/services/mattress-cleaning",
        "Mattress + headboard",
      ],
      ["I am moving", "/services/move-in-move-out", "Multi-surface plan"],
      [
        "I manage properties",
        "/commercial/property-managers",
        "Repeatable B2B care",
      ],
    ] as [string, string, string][],
    proofEyebrow: "Proof without theater",
    proofTitle: "No filtered demos. Real job records only.",
    proofCopy:
      "Completed-job imagery will appear only with permission, comparable framing and service notes. Until then, this space explains the evidence standard instead of simulating a result.",
    proofCards: [
      ["Same-angle pairs", "Comparable framing and lighting"],
      ["Service metadata", "Material, issue, method and limitation"],
      ["Customer permission", "Separate from quote-photo consent"],
    ] as [string, string][],
    proofLink: "Read the proof policy →",
    processEyebrow: "From estimate to aftercare",
    processTitle: "A five-step service. Nothing hidden.",
    startEstimate: "Start an estimate ↗",
    petEyebrow: "Pet homes need diagnosis",
    petTitle: "Odor is a source, not a scent.",
    petCopy:
      "We separate surface deodorizing, enzyme treatment and suspected deep contamination. If cleaning cannot reach the source, we say so before selling another add-on.",
    petBullets: [
      "Photo-led severity questions",
      "Surface vs cushion/core assessment",
      "Clear treatment limits",
      "Dry-time and pet-access guidance",
    ],
    petLink: "Assess pet odor ↗",
    servicesEyebrow: "What we clean",
    servicesTitle: "One care system. Built around fabric.",
    servicesCopy:
      "Every page names eligibility, method, limits and the price inputs it needs. That is more useful than a generic service list.",
    servicesLink: "Explore every service →",
    fabricEyebrow: "Fabric before chemistry",
    fabricTitle: "The tag helps. Testing decides.",
    fabricCopy:
      "W, S, WS and X are manufacturer care codes—not blanket permission. We pair the code with fiber, backing, dye and a hidden-area test.",
    fabricLink: "Read the care-code guide →",
    areaEyebrow: "Orange County coverage",
    areaTitle: "ZIP first. No contact wall.",
    areaCopy:
      "See your service zone and minimum before entering a name, email or phone.",
    areaLink: "Explore the service area →",
    faqEyebrow: "Questions, answered plainly",
    faqTitle: "Good service starts before the visit.",
    faqCopy:
      "No absolute stain promise, vague drying guarantee or hidden minimum.",
    faqLink: "Read all FAQs →",
  },
  es: {
    heroEyebrow: "Orange County · cuidado textil móvil",
    heroTitle: "Textiles limpios. Precio claro.",
    heroDek:
      "Sofás, seccionales, colchones y moquetas: cálculo inmediato por menú y revisión de fotos antes de confirmar.",
    heroPrice: "Precio actual del sofá",
    priceNoteLabel: "Revisión del alcance",
    priceNote:
      "Confirmamos el cálculo con el artículo y las fotos antes de trabajar. Nada adicional empieza sin tu aprobación.",
    scroll: "Descubre más",
    priceEyebrow: "Precios de referencia",
    priceTitle: "Empieza por el artículo. Conoce el precio.",
    priceCopy:
      "Novaclean iguala las tarifas públicas citadas para un alcance comparable. La fuente, fecha y definición aparecen junto a cada precio.",
    priceFoot:
      "Sin mínimo de visita en la zona principal para sofás, seccionales o colchones. Las fuentes y fechas son públicas.",
    fullPricing: "Ver todos los precios →",
    problemEyebrow: "Elige el problema",
    problemTitle: "No memorices el menú. Cuéntanos qué pasó.",
    problemCopy:
      "Cada situación necesita preguntas distintas: el olor de mascota no es una limpieza rutinaria y un seccional no debería cambiar de precio al llegar.",
    problems: [
      [
        "Mi sofá se ve apagado",
        "/services/sofa-couch-cleaning",
        "Suciedad diaria + manchas",
      ],
      [
        "Tengo olor de mascota",
        "/services/pet-stain-odor-removal",
        "Evaluación del origen",
      ],
      [
        "Quiero renovar el colchón",
        "/services/mattress-cleaning",
        "Colchón + cabecero",
      ],
      [
        "Me estoy mudando",
        "/services/move-in-move-out",
        "Plan para varias superficies",
      ],
      [
        "Gestiono propiedades",
        "/commercial/property-managers",
        "Cuidado B2B repetible",
      ],
    ] as [string, string, string][],
    proofEyebrow: "Pruebas sin teatro",
    proofTitle: "Sin demos filtradas. Solo trabajos reales.",
    proofCopy:
      "Las imágenes de trabajos terminados aparecerán únicamente con permiso, encuadre comparable y notas del servicio. Mientras tanto explicamos el estándar sin simular resultados.",
    proofCards: [
      ["Mismo encuadre", "Ángulo e iluminación comparables"],
      ["Datos del servicio", "Material, problema, método y límite"],
      ["Permiso del cliente", "Separado del permiso para cotizar"],
    ] as [string, string][],
    proofLink: "Leer la política de pruebas →",
    processEyebrow: "Del cálculo al cuidado posterior",
    processTitle: "Cinco pasos. Nada oculto.",
    startEstimate: "Iniciar cálculo ↗",
    petEyebrow: "Los hogares con mascotas necesitan diagnóstico",
    petTitle: "El olor tiene origen, no solo aroma.",
    petCopy:
      "Separamos desodorización superficial, tratamiento enzimático y posible contaminación profunda. Si la limpieza no puede alcanzar el origen, lo decimos antes de vender otro extra.",
    petBullets: [
      "Preguntas guiadas por fotos",
      "Evaluación de superficie y relleno",
      "Límites claros del tratamiento",
      "Guía de secado y acceso de mascotas",
    ],
    petLink: "Evaluar olor de mascota ↗",
    servicesEyebrow: "Qué limpiamos",
    servicesTitle: "Un sistema de cuidado. Diseñado para cada tejido.",
    servicesCopy:
      "Cada página explica elegibilidad, método, límites y variables de precio. Es más útil que una lista genérica.",
    servicesLink: "Explorar todos los servicios →",
    fabricEyebrow: "El tejido antes que la química",
    fabricTitle: "La etiqueta orienta. La prueba decide.",
    fabricCopy:
      "W, S, WS y X son códigos del fabricante, no permisos absolutos. Los combinamos con fibra, respaldo, tinte y una prueba oculta.",
    fabricLink: "Leer la guía de códigos →",
    areaEyebrow: "Cobertura en Orange County",
    areaTitle: "Primero el ZIP. Sin muro de contacto.",
    areaCopy:
      "Consulta la zona y el mínimo antes de escribir nombre, correo o teléfono.",
    areaLink: "Explorar el área de servicio →",
    faqEyebrow: "Preguntas con respuestas claras",
    faqTitle: "El buen servicio empieza antes de la visita.",
    faqCopy:
      "Sin promesas absolutas sobre manchas, secado vago ni mínimos ocultos.",
    faqLink: "Leer todas las preguntas →",
  },
} as const;

export const serviceMessages: Record<
  Locale,
  Record<
    string,
    {
      name: string;
      kicker: string;
      problem: string;
      outcome: string;
      method: string;
    }
  >
> = {
  en: {},
  es: {
    "sofa-couch-cleaning": {
      name: "Limpieza de sofás",
      kicker: "La renovación cotidiana",
      problem: "grasa corporal, suciedad diaria, comida y tejido apagado",
      outcome: "un sofá renovado con cuidados específicos",
      method:
        "Revisión de fibra → extracción de suciedad seca → pretratamiento → extracción controlada → peinado y guía de secado.",
    },
    "sectional-cleaning": {
      name: "Limpieza de sofás seccionales",
      kicker: "Sin cálculos ambiguos por asiento",
      problem: "zonas de uso intenso, bordes de cojines y desgaste desigual",
      outcome: "una limpieza uniforme en todo el seccional",
      method:
        "Contamos las secciones con fotos, confirmamos la construcción y fijamos el alcance antes de llegar.",
    },
    "mattress-cleaning": {
      name: "Limpieza de colchones",
      kicker: "Una superficie de descanso más limpia",
      problem:
        "suciedad superficial, marcas de sudor y mantenimiento rutinario",
      outcome: "una superficie renovada y guía clara de secado",
      method:
        "Revisión de etiqueta → extracción seca → cuidado compatible de manchas → limpieza controlada de baja humedad.",
    },
    "chair-recliner-ottoman-cleaning": {
      name: "Limpieza de sillones, reclinables y otomanas",
      kicker: "Piezas pequeñas, el mismo cuidado",
      problem:
        "acumulación en brazos, grasa en reposacabezas y asientos manchados",
      outcome: "un acabado uniforme y renovado",
      method:
        "Revisión de construcción y código → aspirado detallado → limpieza controlada por paneles.",
    },
    "pet-stain-odor-removal": {
      name: "Tratamiento de manchas y olores de mascotas",
      kicker: "Diagnosticar antes de desodorizar",
      problem:
        "accidentes superficiales, olor recurrente o contaminación profunda",
      outcome: "el nivel correcto de tratamiento con límites honestos",
      method:
        "Revisión visual y del nivel de contaminación → tratamiento enzimático compatible → extracción → reevaluación.",
    },
    "area-rug-cleaning": {
      name: "Limpieza de alfombras",
      kicker: "Primero el material",
      problem: "suciedad de paso, manchas y uso por mascotas",
      outcome: "cuidado seguro en casa o derivación a un especialista",
      method:
        "La fibra, el respaldo y la estabilidad del tinte determinan si la limpieza en casa es adecuada.",
    },
    "carpet-cleaning": {
      name: "Limpieza de moquetas",
      kicker: "Precios claros por habitación",
      problem: "zonas de paso, suciedad rutinaria y renovación por mudanza",
      outcome: "zonas de tránsito más limpias con definiciones simples",
      method:
        "Medición → eliminación de suciedad seca → pretratamiento → agitación si hace falta → extracción.",
    },
    "stain-removal": {
      name: "Tratamiento localizado de manchas",
      kicker: "Evidencia, no promesas",
      problem: "manchas aisladas de comida, bebidas, grasa o causa desconocida",
      outcome: "la mejor mejora segura sin dañar el tejido",
      method:
        "Identificar la familia de la mancha → química segura → tiempo controlado → extracción → documentar el cambio restante.",
    },
    "fabric-protection": {
      name: "Protección de tejidos",
      kicker: "Más tiempo para reaccionar",
      problem: "derrames frecuentes y asientos de uso intenso",
      outcome: "repelencia adicional después de la limpieza",
      method:
        "Aplicar un protector compatible de forma uniforme y explicar el tiempo de curado.",
    },
    "move-in-move-out": {
      name: "Renovación textil para mudanzas",
      kicker: "Una visita, menos pendientes",
      problem: "moquetas y muebles que necesitan una entrega más limpia",
      outcome: "un plan documentado para varias superficies",
      method:
        "Inventario fotográfico → acceso y estacionamiento → alcance priorizado → registro del servicio.",
    },
  },
};

export const faqMessages: Record<
  Locale,
  readonly (readonly [string, string])[]
> = {
  en: [],
  es: [
    [
      "¿Cambiará el precio al llegar?",
      "No si las fotos y respuestas coinciden con el artículo. Si una condición oculta cambia el alcance seguro, paramos, explicamos la opción y pedimos aprobación antes de cualquier trabajo extra.",
    ],
    [
      "¿Cuánto tardará en secar?",
      "La mayoría de tapicerías comunes se seca al tacto en varias horas, pero la fibra, el relleno, la humedad y el flujo de aire pueden alargarlo.",
    ],
    [
      "¿Se pueden eliminar todas las manchas y olores?",
      "No. Identificamos el origen probable, elegimos el tratamiento más seguro y documentamos la mejora y cualquier límite.",
    ],
    [
      "¿Es seguro cerca de niños y mascotas?",
      "Elegimos productos y procesos según el tejido y la suciedad. Mantén a niños y mascotas alejados hasta el tiempo de secado indicado.",
    ],
    [
      "¿Tengo que mover los muebles?",
      "Retira objetos pequeños y obstáculos. Confirmamos cualquier movimiento de piezas grandes en el alcance.",
    ],
    [
      "¿Cuál es el pedido mínimo?",
      "En la zona principal no hay mínimo de visita para sofás, seccionales o colchones. Las sillas de comedor empiezan en cuatro; los tratamientos pequeños son extras.",
    ],
    [
      "¿Qué pasa si no estoy satisfecho?",
      "Contáctanos dentro de siete días con fotos. Si el problema está dentro del alcance y se puede mejorar con seguridad, se incluye la primera revisión.",
    ],
    [
      "¿Limpian cuero, terciopelo o tejido con código X?",
      "Esos materiales requieren revisión individual. Podemos aprobar un método limitado o recomendar un especialista.",
    ],
  ],
};

export const quoteMessages = {
  en: {
    steps: ["ZIP", "Item", "Details", "Estimate", "Window", "Contact"],
    railTitle: "Your item, priced plainly.",
    railCopy:
      "Start with a public menu price. Photos and details confirm eligibility and scope before service.",
    backSite: "Back to site",
    complete: "Complete",
    step: "Step",
    back: "Back",
    continue: "Continue →",
    save: "Send request ↗",
    saving: "Saving…",
    coverageEye: "Coverage first",
    coverageTitle: "Where should we come?",
    coverageCopy:
      "Your ZIP decides the service zone and minimum before we ask for contact details.",
    zip: "Service ZIP",
    invalidZip: "Enter a valid 5-digit ZIP.",
    outside: "This ZIP is outside the current Orange County route.",
    outsideLink: "Open out-of-area route →",
    itemEye: "Choose the item",
    itemTitle: "What needs care?",
    itemCopy:
      "Choose the primary item. Every option below is connected to the same public price matrix.",
    itemLabel: "Primary item",
    quantity: "Quantity",
    itemRequired: "Choose an item to continue.",
    startingAt: "Starting at",
    detailEye: "Scope details",
    detailTitle: "What should we review?",
    detailCopy:
      "Material, condition and optional photos do not trigger an automatic upsell. They help confirm whether the menu scope is safe and accurate.",
    fabric: "Fabric / material",
    condition: "Condition",
    notes: "Useful notes (optional)",
    notesPlaceholder: "Location, age of spot, previous products…",
    stain: "Targeted stain area",
    pet: "Pet incident / odor",
    photos: "Optional photos",
    photoCopy:
      "Best set: whole item, close-up and care tag. JPG, PNG or WebP; up to 8 MB each. Quote photos are not marketing consent.",
    choosePhotos: "Choose photos",
    photoLibrary: "Camera or photo library",
    estimateEye: "Your estimate",
    estimateTitle: "Clear now. Confirmed before work.",
    estimateCopy:
      "This is an instant menu-based estimate. We review the item, photos and details before accepting the scope; nothing extra starts without approval.",
    estimateLabel: "Novaclean estimate",
    scope: "Menu scope",
    benchmark: "Published benchmark source",
    zone: "Service zone",
    material: "Material / condition",
    core: "Core · no primary-item visit minimum",
    extended: "Extended",
    minimum: "service minimum",
    windowEye: "Preferred arrival window",
    windowTitle: "Choose a useful preference.",
    windowCopy:
      "These are preferences, not live availability. A window is confirmed only after it is checked against the route calendar.",
    windowRequired: "Choose an arrival preference.",
    preference: "preferred arrival",
    contactEye: "Send the request",
    contactTitle: "Who should receive the reference?",
    contactCopy:
      "We collect only what is needed to route and review this request. No payment is required at this stage.",
    name: "Name",
    email: "Email",
    phone: "Mobile phone",
    address: "Service address",
    access: "Parking / gate / access notes (optional)",
    consent:
      "I agree to the service terms and acknowledge the privacy policy. The estimate is confirmed against the actual item before work begins.",
    contactRequired:
      "Add your name, valid email, phone and service address, then accept the service terms.",
    receivedEye: "Request received",
    receivedTitle: "We have your service brief.",
    receivedCopy:
      "Keep this reference with your estimate. The route preference is requested, not confirmed availability.",
    requested: "Requested service",
    addons: "Add-on",
    estimate: "Estimate",
    source: "Benchmark source",
    zipZone: "Zone / ZIP",
    preferred: "Preferred window",
    addressAccess: "Address / access",
    attached: "attached",
    none: "None attached",
    confirmation: "Confirmation",
    prepare: "How to prepare",
    return: "Return home",
  },
  es: {
    steps: ["ZIP", "Artículo", "Detalles", "Precio", "Franja", "Contacto"],
    railTitle: "Tu artículo, con precio claro.",
    railCopy:
      "Empieza con un precio público de menú. Las fotos y detalles confirman elegibilidad y alcance antes del servicio.",
    backSite: "Volver al sitio",
    complete: "Completo",
    step: "Paso",
    back: "Atrás",
    continue: "Continuar →",
    save: "Enviar solicitud ↗",
    saving: "Guardando…",
    coverageEye: "Primero la cobertura",
    coverageTitle: "¿A dónde vamos?",
    coverageCopy:
      "Tu ZIP decide la zona y el mínimo antes de pedir datos de contacto.",
    zip: "ZIP del servicio",
    invalidZip: "Introduce un ZIP válido de 5 dígitos.",
    outside: "Este ZIP está fuera de la ruta actual de Orange County.",
    outsideLink: "Abrir ruta fuera de zona →",
    itemEye: "Elige el artículo",
    itemTitle: "¿Qué necesita cuidado?",
    itemCopy:
      "Elige el artículo principal. Todas las opciones usan la misma matriz pública de precios.",
    itemLabel: "Artículo principal",
    quantity: "Cantidad",
    itemRequired: "Elige un artículo para continuar.",
    startingAt: "Desde",
    detailEye: "Detalles del alcance",
    detailTitle: "¿Qué debemos revisar?",
    detailCopy:
      "Material, estado y fotos opcionales no generan un aumento automático. Sirven para confirmar que el alcance es seguro y correcto.",
    fabric: "Tejido / material",
    condition: "Estado",
    notes: "Notas útiles (opcional)",
    notesPlaceholder: "Ubicación, antigüedad, productos usados…",
    stain: "Zona con mancha",
    pet: "Incidente / olor de mascota",
    photos: "Fotos opcionales",
    photoCopy:
      "Mejor conjunto: artículo completo, detalle y etiqueta. JPG, PNG o WebP; hasta 8 MB cada una. Las fotos de cotización no autorizan marketing.",
    choosePhotos: "Elegir fotos",
    photoLibrary: "Cámara o biblioteca",
    estimateEye: "Tu cálculo",
    estimateTitle: "Claro ahora. Confirmado antes de trabajar.",
    estimateCopy:
      "Es un cálculo inmediato por menú. Revisamos artículo, fotos y detalles antes de aceptar el alcance; nada extra empieza sin aprobación.",
    estimateLabel: "Cálculo Novaclean",
    scope: "Alcance del menú",
    benchmark: "Fuente de referencia publicada",
    zone: "Zona de servicio",
    material: "Material / estado",
    core: "Principal · sin mínimo para artículo principal",
    extended: "Extendida",
    minimum: "mínimo de servicio",
    windowEye: "Preferencia de llegada",
    windowTitle: "Elige una preferencia útil.",
    windowCopy:
      "Son preferencias, no disponibilidad en vivo. La franja se confirma solo después de revisar la ruta.",
    windowRequired: "Elige una preferencia de llegada.",
    preference: "llegada preferida",
    contactEye: "Enviar la solicitud",
    contactTitle: "¿Quién debe recibir la referencia?",
    contactCopy:
      "Pedimos solo lo necesario para revisar y coordinar. No se requiere pago en esta etapa.",
    name: "Nombre",
    email: "Correo electrónico",
    phone: "Teléfono móvil",
    address: "Dirección del servicio",
    access: "Estacionamiento / acceso (opcional)",
    consent:
      "Acepto los términos del servicio y reconozco la política de privacidad. El cálculo se confirma con el artículo real antes de trabajar.",
    contactRequired:
      "Añade nombre, correo válido, teléfono y dirección, y acepta los términos.",
    receivedEye: "Solicitud recibida",
    receivedTitle: "Tenemos el resumen del servicio.",
    receivedCopy:
      "Guarda esta referencia con tu cálculo. La franja es una preferencia solicitada, no disponibilidad confirmada.",
    requested: "Servicio solicitado",
    addons: "Extra",
    estimate: "Cálculo",
    source: "Fuente de referencia",
    zipZone: "Zona / ZIP",
    preferred: "Franja preferida",
    addressAccess: "Dirección / acceso",
    attached: "adjuntas",
    none: "Sin fotos",
    confirmation: "Confirmación",
    prepare: "Cómo prepararse",
    return: "Volver al inicio",
  },
} as const;

export const genericPageMessages: Partial<
  Record<
    Locale,
    Record<
      string,
      {
        eyebrow: string;
        title: string;
        dek: string;
        sections: { title: string; body: string; bullets?: string[] }[];
      }
    >
  >
> = {
  es: {
    prepare: {
      eyebrow: "Antes del servicio",
      title: "Diez minutos tranquilos antes de la franja.",
      dek: "Una preparación breve protege el acceso, las mascotas, los objetos frágiles y el área de trabajo.",
      sections: [
        {
          title: "Despeja el textil",
          body: "Retira mantas, juguetes, controles y objetos frágiles. Deja los cojines salvo que el alcance indique otra cosa.",
        },
        {
          title: "Crea un acceso seguro",
          body: "Comparte notas de puerta, estacionamiento, ascensor o carga antes de la franja. Mantén a las mascotas fuera del área.",
        },
        {
          title: "Conserva la evidencia",
          body: "No añadas un quitamanchas nuevo justo antes del servicio. Si usaste uno, indica cuál y cuándo.",
        },
      ],
    },
    aftercare: {
      eyebrow: "Después del servicio",
      title: "Secado uniforme. Uso suave. Registro útil.",
      dek: "Las instrucciones específicas del técnico tienen prioridad; esta página contiene la base.",
      sections: [
        {
          title: "Flujo de aire",
          body: "Usa ventilación normal y ventiladores cuando se indique. No selles cojines húmedos entre sí.",
        },
        {
          title: "Uso",
          body: "Mantén a personas y mascotas fuera del textil húmedo hasta el punto de secado indicado.",
        },
        {
          title: "Ventana de cuidado",
          body: "Si algo dentro del alcance se ve incorrecto después del secado completo, documéntalo con fotos y envía la referencia dentro de siete días.",
        },
      ],
    },
    "fabric-care-codes": {
      eyebrow: "Educación sobre tejidos",
      title: "W, S, WS y X son una pista, no un método.",
      dek: "Lee la etiqueta y después prueba el tejido, respaldo, tinte y tratamientos anteriores.",
      sections: [
        {
          title: "W",
          body: "Un agente con base de agua puede ser compatible, pero la cantidad, calor, agitación y secado siguen importando.",
        },
        {
          title: "S",
          body: "Puede requerirse un método con solvente. No es permiso para usar cualquier solvente doméstico.",
        },
        {
          title: "WS",
          body: "Métodos con agua o solvente pueden ser posibles después de probar.",
        },
        {
          title: "X",
          body: "La limpieza húmeda rutinaria no está indicada. La extracción seca o un especialista puede ser el límite responsable.",
        },
      ],
    },
    "what-we-do-not-clean": {
      eyebrow: "Límites del servicio",
      title: "Un «no» útil también es cuidado textil.",
      dek: "Rechazamos o derivamos artículos cuando el material, daño, contaminación o acceso vuelve inseguro el servicio normal.",
      sections: [
        {
          title: "Revisión automática",
          body: "Código X, tintes inestables, lana o seda de alto valor, terciopelo, cuero, respaldos dañados y química doméstica anterior requieren revisión.",
        },
        {
          title: "Límites de contaminación",
          body: "Riesgos biológicos, moho extendido, plagas y contaminación bajo capas accesibles pueden necesitar remediación o reemplazo.",
        },
        {
          title: "Límites del resultado",
          body: "Pérdida permanente de color, desgaste, daño solar, transferencia de tinte y manchas fijadas pueden permanecer.",
        },
      ],
    },
  },
};

const spanishPriceLabels: Record<
  string,
  { label: string; shortLabel: string; scope: string }
> = {
  loveseat: {
    label: "Sofá de 2 plazas",
    shortLabel: "Sofá 2 plazas",
    scope: "tejido estándar, hasta 2 plazas",
  },
  sofa: {
    label: "Sofá de 3 plazas",
    shortLabel: "Sofá 3 plazas",
    scope: "tejido estándar, tres cojines de asiento",
  },
  "l-sectional": {
    label: "Sofá seccional en L",
    shortLabel: "Seccional L",
    scope: "hasta 5 secciones de asiento",
  },
  "u-sectional": {
    label: "Sofá seccional en U",
    shortLabel: "Seccional U",
    scope: "hasta 7 secciones de asiento",
  },
  "side-chair": {
    label: "Sillón / reclinable",
    shortLabel: "Sillón",
    scope: "un sillón estándar",
  },
  "dining-chair": {
    label: "Silla de comedor",
    shortLabel: "Silla de comedor",
    scope: "solo asiento; mínimo cuatro sillas o como extra",
  },
  mattress: {
    label: "Limpieza de colchón",
    shortLabel: "Colchón",
    scope: "precio inicial de Twin a King; el estado puede cambiar el alcance",
  },
  rug: {
    label: "Limpieza de alfombra",
    shortLabel: "Alfombra",
    scope: "precio inicial; el tamaño y material definen el alcance final",
  },
  "carpet-room": {
    label: "Moqueta — una habitación",
    shortLabel: "1 habitación",
    scope: "hasta 200 pies cuadrados",
  },
  "carpet-3": {
    label: "Moqueta — tres habitaciones",
    shortLabel: "3 habitaciones",
    scope: "hasta 600 pies cuadrados en total",
  },
  "living-room-reset": {
    label: "Pareja de sala",
    shortLabel: "Pareja de sala",
    scope: "sofá de 3 plazas + sofá de 2 plazas",
  },
  "sectional-pet": {
    label: "Seccional Plus",
    shortLabel: "Seccional Plus",
    scope: "seccional L + sillón estándar",
  },
  "sleep-reset": {
    label: "Renovación de dos colchones",
    shortLabel: "Dos colchones",
    scope: "dos colchones estándar",
  },
  "move-reset": {
    label: "Rescate de sofá con mascota",
    shortLabel: "Sofá + mascota",
    scope: "sofá de 3 plazas + tratamiento superficial",
  },
  "whole-home": {
    label: "Inicio textil para mudanza",
    shortLabel: "Inicio de mudanza",
    scope: "3 habitaciones con moqueta + sofá de 3 plazas",
  },
  protector: {
    label: "Protector de moqueta",
    shortLabel: "Protector",
    scope: "por habitación elegible",
  },
};

export function translatedPrice<
  T extends { id: string; label: string; shortLabel: string; scope: string },
>(
  item: T,
  locale: Locale,
): Omit<T, "label" | "shortLabel" | "scope"> & {
  label: string;
  shortLabel: string;
  scope: string;
} {
  const translation = locale === "es" ? spanishPriceLabels[item.id] : undefined;
  return translation ? { ...item, ...translation } : item;
}

export function translatedService<
  T extends {
    slug: string;
    name: string;
    kicker: string;
    problem: string;
    outcome: string;
    method: string;
  },
>(
  service: T,
  locale: Locale,
): Omit<T, "name" | "kicker" | "problem" | "outcome" | "method"> & {
  name: string;
  kicker: string;
  problem: string;
  outcome: string;
  method: string;
} {
  const translation = serviceMessages[locale][service.slug];
  return translation ? { ...service, ...translation } : service;
}
