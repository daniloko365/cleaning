import { minimums, prices } from "@/lib/site-data";

export type PriceOverride = {
  price: number;
  scopeEn: string;
  scopeEs: string;
};

export type PublicSiteConfig = {
  business: {
    phone: string;
    email: string;
    hours: string;
  };
  notice: {
    enabled: boolean;
    textEn: string;
    textEs: string;
    href: string;
  };
  home: {
    eyebrowEn: string;
    eyebrowEs: string;
    titleEn: string;
    titleEs: string;
    descriptionEn: string;
    descriptionEs: string;
  };
  conversion: {
    bookingEnabled: boolean;
    pausedMessageEn: string;
    pausedMessageEs: string;
    extendedMinimum: number;
  };
  seo: {
    homeTitleEn: string;
    homeTitleEs: string;
    homeDescriptionEn: string;
    homeDescriptionEs: string;
    defaultDescription: string;
    googleSiteVerification: string;
  };
  prices: Record<string, PriceOverride>;
};

const defaultPriceOverrides = Object.fromEntries(
  prices.map((item) => [
    item.id,
    { price: item.price, scopeEn: "", scopeEs: "" },
  ]),
) as Record<string, PriceOverride>;

export const defaultSiteConfig: PublicSiteConfig = {
  business: { phone: "", email: "", hours: "" },
  notice: { enabled: false, textEn: "", textEs: "", href: "" },
  home: {
    eyebrowEn: "Orange County · mobile textile care",
    eyebrowEs: "Orange County · cuidado textil móvil",
    titleEn: "Orange County upholstery cleaning. Clear price.",
    titleEs: "Limpieza de tapicería en Orange County. Precio claro.",
    descriptionEn:
      "Sofas, sectionals, mattresses, rugs and carpets—with clear menu prices and photo review before confirmation.",
    descriptionEs:
      "Sofás, seccionales, colchones, alfombras y moquetas con precios de menú claros y revisión de fotos antes de confirmar.",
  },
  conversion: {
    bookingEnabled: true,
    pausedMessageEn:
      "Online requests are temporarily paused. Please use the contact page and we will follow up.",
    pausedMessageEs:
      "Las solicitudes en línea están pausadas temporalmente. Usa la página de contacto y te responderemos.",
    extendedMinimum: minimums.extended,
  },
  seo: {
    homeTitleEn: "Upholstery Cleaning Orange County, CA",
    homeTitleEs: "Limpieza de tapicería en Orange County, CA",
    homeDescriptionEn:
      "Orange County upholstery cleaning for sofas, sectionals, mattresses, rugs and carpets. See clear prices and request a photo-reviewed estimate online.",
    homeDescriptionEs:
      "Limpieza móvil de tapicería, sofás, colchones, alfombras y moquetas en Orange County. Consulta precios y solicita un cálculo con fotos.",
    defaultDescription:
      "Mobile upholstery, mattress, rug and carpet cleaning across Orange County, California, with clear menu prices and photo-reviewed estimates.",
    googleSiteVerification: "",
  },
  prices: defaultPriceOverrides,
};

const text = (value: unknown, fallback: string, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : fallback;

const bool = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const safeHref = (value: unknown) => {
  const candidate = text(value, "", 240);
  return /^(?:\/(?!\/)|https:\/\/)/i.test(candidate) ? candidate : "";
};

const amount = (value: unknown, fallback: number, max = 10_000) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed)
    ? Math.round(Math.min(max, Math.max(0, parsed)) * 100) / 100
    : fallback;
};

export function normalizeSiteConfig(input: unknown): PublicSiteConfig {
  const value = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const business = value.business && typeof value.business === "object" ? value.business as Record<string, unknown> : {};
  const notice = value.notice && typeof value.notice === "object" ? value.notice as Record<string, unknown> : {};
  const home = value.home && typeof value.home === "object" ? value.home as Record<string, unknown> : {};
  const conversion = value.conversion && typeof value.conversion === "object" ? value.conversion as Record<string, unknown> : {};
  const seo = value.seo && typeof value.seo === "object" ? value.seo as Record<string, unknown> : {};
  const priceInput = value.prices && typeof value.prices === "object" ? value.prices as Record<string, unknown> : {};

  const priceConfig = Object.fromEntries(prices.map((item) => {
    const row = priceInput[item.id] && typeof priceInput[item.id] === "object"
      ? priceInput[item.id] as Record<string, unknown>
      : {};
    return [item.id, {
      price: amount(row.price, item.price),
      scopeEn: text(row.scopeEn, "", 240),
      scopeEs: text(row.scopeEs, "", 240),
    }];
  })) as Record<string, PriceOverride>;

  return {
    business: {
      phone: text(business.phone, "", 40),
      email: text(business.email, "", 180),
      hours: text(business.hours, "", 160),
    },
    notice: {
      enabled: bool(notice.enabled, false),
      textEn: text(notice.textEn, "", 180),
      textEs: text(notice.textEs, "", 180),
      href: safeHref(notice.href),
    },
    home: {
      eyebrowEn: text(home.eyebrowEn, defaultSiteConfig.home.eyebrowEn, 100),
      eyebrowEs: text(home.eyebrowEs, defaultSiteConfig.home.eyebrowEs, 100),
      titleEn: text(home.titleEn, defaultSiteConfig.home.titleEn, 120),
      titleEs: text(home.titleEs, defaultSiteConfig.home.titleEs, 120),
      descriptionEn: text(home.descriptionEn, defaultSiteConfig.home.descriptionEn, 260),
      descriptionEs: text(home.descriptionEs, defaultSiteConfig.home.descriptionEs, 260),
    },
    conversion: {
      bookingEnabled: bool(conversion.bookingEnabled, true),
      pausedMessageEn: text(conversion.pausedMessageEn, defaultSiteConfig.conversion.pausedMessageEn, 260),
      pausedMessageEs: text(conversion.pausedMessageEs, defaultSiteConfig.conversion.pausedMessageEs, 260),
      extendedMinimum: amount(conversion.extendedMinimum, minimums.extended, 2_000),
    },
    seo: {
      homeTitleEn: text(seo.homeTitleEn, defaultSiteConfig.seo.homeTitleEn, 80),
      homeTitleEs: text(seo.homeTitleEs, defaultSiteConfig.seo.homeTitleEs, 80),
      homeDescriptionEn: text(seo.homeDescriptionEn, defaultSiteConfig.seo.homeDescriptionEn, 200),
      homeDescriptionEs: text(seo.homeDescriptionEs, defaultSiteConfig.seo.homeDescriptionEs, 200),
      defaultDescription: text(seo.defaultDescription, defaultSiteConfig.seo.defaultDescription, 200),
      googleSiteVerification: text(seo.googleSiteVerification, "", 180),
    },
    prices: priceConfig,
  };
}

export function priceValues(config: PublicSiteConfig) {
  return Object.fromEntries(
    Object.entries(config.prices).map(([id, item]) => [id, item.price]),
  );
}
