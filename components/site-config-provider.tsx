"use client";

import { createContext, useContext } from "react";
import {
  defaultSiteConfig,
  type PublicSiteConfig,
} from "@/lib/site-config";
import type { Locale } from "@/lib/i18n";
import type { PriceItem } from "@/lib/site-data";

const SiteConfigContext = createContext<PublicSiteConfig>(defaultSiteConfig);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: PublicSiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

export function configuredPrice(
  item: PriceItem,
  locale: Locale,
  config: PublicSiteConfig,
) {
  const override = config.prices[item.id];
  return {
    ...item,
    price: override?.price ?? item.price,
    scope:
      (locale === "es" ? override?.scopeEs : override?.scopeEn) || item.scope,
  };
}

