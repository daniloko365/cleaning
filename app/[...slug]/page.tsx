import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  AboutPage,
  CarePage,
  CityPage,
  CommercialPage,
  ContactPage,
  FAQPage,
  GenericPage,
  GuidePage,
  GuidesHub,
  HowItWorksPage,
  LaunchChecklistPage,
  LegalDocumentPage,
  PortalPage,
  PricingPage,
  ResultsPage,
  ReviewPreviewPage,
  ReviewsPage,
  ServiceAreaPage,
  ServicePage,
  ServicesHub,
} from "@/components/page-templates";
import { HomePageContent } from "@/components/home-page";
import { QuoteWizard } from "@/components/quote-wizard";
import { legalDocuments } from "@/lib/legal-content";
import { cities, cityName, guides, servicePages } from "@/lib/site-data";
import { genericPageMessages, localizedPath, routeLocale } from "@/lib/i18n";
import { loadSiteConfig } from "@/lib/site-settings.server";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ zip?: string; service?: string }>;
};

const copy: Record<
  string,
  {
    eyebrow: string;
    title: string;
    dek: string;
    intro?: string;
    sections: { title: string; body: string; bullets?: string[] }[];
    image?: string;
  }
> = {
  "how-it-works": {
    eyebrow: "The Novaclean process",
    title: "Photos first. Scope second. Service third.",
    dek: "A five-stage path designed to settle price, material risk, arrival details and expectations before the first cleaning pass.",
    sections: [
      {
        title: "1. Show the item",
        body: "Choose the primary textile, describe the condition and share a full-item photo, problem detail and care tag when available.",
      },
      {
        title: "2. Build and review the scope",
        body: "The estimator combines the price matrix, item count, approved add-ons and service-zone minimum. Delicate materials route to manual review.",
      },
      {
        title: "3. Request an arrival window",
        body: "Pick a route window, add access and parking notes, and receive a trackable service reference. A requested window becomes confirmed only against real capacity.",
      },
      {
        title: "4. Pre-inspection and permission",
        body: "The technician confirms fiber, construction, condition and the agreed scope. If reality differs, work pauses until you approve a clear option.",
      },
      {
        title: "5. Clean, walk through and care",
        body: "The service record captures the completed scope, result notes and item-specific drying guidance. The 7-day care window starts at completion.",
      },
    ],
  },
  about: {
    eyebrow: "About Novaclean",
    title: "A textile-care business built to remove uncertainty.",
    dek: "The category does not need another vague ‘call for quote’ site. It needs visible scope, honest limitations and a service record.",
    sections: [
      {
        title: "Why Novaclean exists",
        body: "Orange County customers often have to call multiple cleaners just to learn a minimum, then repeat the item story by text. Novaclean moves that decision logic into a calm, useful website.",
      },
      {
        title: "Four operating principles",
        body: "Price before pressure, fabric before chemistry, evidence before claims, and aftercare as part of the service—not an afterthought.",
        bullets: [
          "Menu estimate with photo review",
          "Material and hidden-area testing",
          "No unapproved add-ons",
          "Documented limitations and care window",
        ],
      },
      {
        title: "What evidence belongs on the site",
        body: "Team biographies, reviews, credentials and local job claims appear only after the underlying people, records and permissions are verified.",
      },
    ],
    image: "/media/final/about-textile.webp",
  },
  team: {
    eyebrow: "The team",
    title: "Named people, once the names are real.",
    dek: "No stock headshots or invented years of experience. The team module remains outside the public proof layer until names and portraits are verified.",
    sections: [
      {
        title: "What every profile will contain",
        body: "A real portrait, full name, operating role, relevant textile-care experience, approved credentials and the languages the person actually serves in.",
      },
      {
        title: "What customers will know before arrival",
        body: "The confirmation is designed to identify the assigned technician and service window. Background-check wording appears only if a real program and scope can substantiate it.",
      },
      {
        title: "Why this matters",
        body: "Mobile service enters a customer’s home. Clear identity, role and escalation details build more trust than a generic ‘our experts’ paragraph.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Start with the item. Reach a person when needed.",
    dek: "Until the verified business phone and SMS line are connected, every contact path safely enters the working photo-quote flow.",
    sections: [
      {
        title: "Price and booking",
        body: "Use Build Estimate for ZIP, item, photos, estimate and a requested window. A reference appears only after the server confirms that the request was stored.",
      },
      {
        title: "Existing request",
        body: "Keep your NC reference and use Track, Reschedule or Care Request. Those routes preserve the reason for contact instead of starting a generic inbox thread.",
      },
      {
        title: "Commercial",
        body: "Property teams should use the commercial walkthrough request so item count, access, vendor documents and approval ownership stay attached to the lead.",
      },
    ],
  },
  results: {
    eyebrow: "Results",
    title: "Proof with the metadata left on.",
    dek: "The gallery architecture is ready for same-angle job pairs. No stock image is presented as a completed Novaclean job.",
    sections: [
      {
        title: "The result record",
        body: "Each case requires service type, city, material, issue, method, outcome, limitation and dates. Before and after images must use comparable framing and lighting.",
      },
      {
        title: "What will be filterable",
        body: "Sofa, sectional, pet, mattress, rug, carpet, fabric family, issue type and service city—only after real records exist.",
      },
      {
        title: "What is forbidden",
        body: "Unlabeled demos, borrowed work, AI-generated ‘results’, exaggerated color shifts, missing limitations and customer-identifying details without permission.",
      },
    ],
  },
  reviews: {
    eyebrow: "Reviews",
    title: "Independent proof, never invented snippets.",
    dek: "Review modules publish only after real platform profiles and permissioned attribution are connected.",
    sections: [
      {
        title: "Source rules",
        body: "The launch layer links directly to the independent platform, shows the checked date, avoids selective rewriting and never synthesizes a review from an internal note.",
      },
      {
        title: "Useful filters",
        body: "When volume allows, customers can filter by Sofa, Pet, Mattress and City. Every snippet retains platform attribution.",
      },
      {
        title: "How feedback is requested",
        body: "The after-service flow asks for honest feedback without conditioning care or discounts on a positive rating. Service concerns route to the care process first.",
      },
    ],
  },
  "fabric-care-codes": {
    eyebrow: "Fabric education",
    title: "W, S, WS and X are a clue—not a method.",
    dek: "Read the tag, then test the actual textile, backing, dye and previous treatments.",
    sections: [
      {
        title: "W",
        body: "A water-based cleaning agent may be compatible, but amount, heat, agitation and drying still matter.",
      },
      {
        title: "S",
        body: "A solvent-based method may be required. This is not permission to use any household solvent or saturate the item.",
      },
      {
        title: "WS",
        body: "Water- or solvent-based methods may be possible after testing. Fiber blends and backing can still narrow the choice.",
      },
      {
        title: "X",
        body: "Routine wet cleaning is not indicated. Dry soil removal or a specialist method may be the responsible limit.",
      },
    ],
  },
  "what-we-do-not-clean": {
    eyebrow: "Service limitations",
    title: "A useful no is part of textile care.",
    dek: "We decline or refer items when the material, damage, contamination or access makes the standard service unsafe or misleading.",
    sections: [
      {
        title: "Automatic review",
        body: "Code X textiles, unstable dyes, high-value wool or silk, unverified velvet, some leather, damaged backing and prior DIY chemistry route to review.",
      },
      {
        title: "Contamination limits",
        body: "Biohazards, widespread mold, pest activity and contamination below reachable upholstery layers may require remediation, replacement or a different specialist.",
      },
      {
        title: "Result limits",
        body: "Permanent color loss, fiber wear, sun damage, dye transfer and set stains can remain after the cleanable soil is removed.",
      },
    ],
  },
  prepare: {
    eyebrow: "Before service",
    title: "Ten calm minutes before the window.",
    dek: "A short preparation list protects access, pets, fragile objects and the technician’s working area.",
    sections: [
      {
        title: "Clear the textile",
        body: "Remove loose throws, toys, remotes and fragile objects. Leave the cushions unless the scope says otherwise.",
      },
      {
        title: "Create safe access",
        body: "Share gate, parking, elevator and loading notes before the window. Secure pets away from the work zone.",
      },
      {
        title: "Keep the evidence",
        body: "Do not add a new spotter immediately before service. If you used one, tell the technician what and when.",
      },
    ],
  },
  aftercare: {
    eyebrow: "After service",
    title: "Dry evenly. Use gently. Keep the record.",
    dek: "The technician’s item-specific directions take precedence; this page provides the baseline.",
    sections: [
      {
        title: "Airflow",
        body: "Use ordinary ventilation and fans when advised. Avoid sealing damp cushions against one another.",
      },
      {
        title: "Use",
        body: "Keep people and pets off damp textiles until the stated dry point. Avoid covers that trap moisture.",
      },
      {
        title: "Care window",
        body: "If something within the agreed scope looks wrong after full drying, document it with photos and submit the service reference within 7 days.",
      },
    ],
  },
  track: {
    eyebrow: "Customer care",
    title: "Track a service reference.",
    dek: "The route is ready for NC references; live status messaging connects with the verified email/SMS integration.",
    sections: [
      {
        title: "What to keep ready",
        body: "Your NC reference, booking email and service ZIP identify the request without exposing customer details publicly.",
      },
      {
        title: "Status language",
        body: "Requested, confirmed, en route, in service, completed and care review are distinct states. A requested window is never displayed as confirmed capacity.",
      },
    ],
  },
  reschedule: {
    eyebrow: "Customer care",
    title: "Move the window without losing the brief.",
    dek: "A reschedule keeps the item scope, photos and access notes attached to the request.",
    sections: [
      {
        title: "How it works",
        body: "Use the NC reference and contact email to request a different route window. Confirmation follows the real calendar.",
      },
      {
        title: "Late changes",
        body: "The cancellation policy explains any notice window or fee; no unverified fee is applied in this launch build.",
      },
    ],
  },
  claim: {
    eyebrow: "7-day care request",
    title: "Show us what needs another look.",
    dek: "A care request starts with the service reference, completed scope and post-dry photos—not a blame-first form.",
    sections: [
      {
        title: "Eligibility",
        body: "Submit within 7 days after service and full drying. The concern must relate to the agreed scope and remain safe to address.",
      },
      {
        title: "Possible outcomes",
        body: "Guidance, clarification, a no-charge first re-clean under policy, or an explanation that the remaining condition is outside the cleanable scope.",
      },
    ],
  },
  "gift-cards": {
    eyebrow: "Gift cards",
    title: "Give a useful reset, not a hidden restriction.",
    dek: "Gift-card checkout remains disabled until payment, expiration and California disclosure rules are verified.",
    sections: [
      {
        title: "Planned format",
        body: "Digital value card with recipient message, transparent redemption rules and no claim that a fixed amount covers an unspecified item.",
      },
      {
        title: "Safe launch state",
        body: "Customers can share a quote link or care-plan idea; no money is collected through an unverified gift-card flow.",
      },
    ],
  },
  referral: {
    eyebrow: "Referral",
    title: "A thank-you that stays transparent.",
    dek: "The referral structure avoids review gating, surprise expiry and rewards that depend on a positive public rating.",
    sections: [
      {
        title: "Planned rule",
        body: "A credit can be issued after a referred customer completes an eligible service, with both value and minimum visible before sharing.",
      },
      {
        title: "No review condition",
        body: "Feedback and referrals remain separate. A customer never has to leave a positive review to receive service care or a promised credit.",
      },
    ],
  },
  "care-plan": {
    eyebrow: "Repeat care",
    title: "A cadence based on use—not fear.",
    dek: "Optional reminders for pet homes, high-use seating, rentals and workplace textiles.",
    sections: [
      {
        title: "Residential",
        body: "Customer-controlled reminders based on use, pets, spills and household preference. No auto-renewal is enabled in this launch build.",
      },
      {
        title: "Commercial",
        body: "Recurring visits can be grouped by location, item class and turnover schedule with a service record after each route.",
      },
    ],
  },
  guarantee: {
    eyebrow: "Service guarantee",
    title: "A clear path when the agreed result needs review.",
    dek: "Contact Novaclean within 7 days after full drying. If the concern is within scope and safe to improve, the first re-clean visit is included.",
    sections: [
      {
        title: "Covered",
        body: "A documented concern tied to the completed scope, submitted in the care window with reasonable access for review.",
      },
      {
        title: "Not a removal promise",
        body: "Permanent stains, wear, color loss, pre-existing damage, inaccessible deep contamination and conditions disclosed as limitations are not transformed into guaranteed outcomes.",
      },
      {
        title: "Resolution",
        body: "We review the record and photos, provide guidance or arrange the appropriate safe re-clean. Any other remedy follows the verified service terms.",
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Collect less. Explain why. Delete on schedule.",
    dek: "A California-aware privacy structure for quote data, photos, contact details and service records.",
    sections: [
      {
        title: "Data collected",
        body: "ZIP, item details, photos, requested window, contact and access information, consent records and service history when a customer submits them.",
      },
      {
        title: "Why it is used",
        body: "To estimate, assess eligibility, route, confirm, perform, support and improve the requested service.",
      },
      {
        title: "Customer choices",
        body: "Request access, correction or deletion through the care channel. Marketing consent is separate from operational confirmation.",
      },
      {
        title: "Retention and security",
        body: "Uploads use controlled types and limits; service data should be retained only as long as operational, legal and customer-care needs require.",
      },
    ],
  },
  terms: {
    eyebrow: "Service terms",
    title: "Scope, permission and limitations in plain language.",
    dek: "These launch terms define the service flow; final legal review belongs in the consolidated launch verification.",
    sections: [
      {
        title: "Estimate and scope",
        body: "The estimate relies on accurate item, condition, photo and access details. Material differences are explained and require approval before added work.",
      },
      {
        title: "Customer authorization",
        body: "The customer confirms they can authorize service for the item and disclose known damage, prior products and relevant contamination.",
      },
      {
        title: "Results and drying",
        body: "Cleaning improves removable soil within safe method limits. Complete stain or odor removal and one universal dry time are not promised.",
      },
      {
        title: "Care and disputes",
        body: "Concerns should be submitted through the 7-day care route with the service reference and photos after full drying.",
      },
    ],
  },
  "sms-terms": {
    eyebrow: "SMS terms",
    title: "Operational texts only with clear consent.",
    dek: "SMS remains unconnected until the verified business number, provider and consent record are configured.",
    sections: [
      {
        title: "Program purpose",
        body: "Appointment confirmation, arrival updates, service questions and care follow-up. Marketing messages require separate opt-in.",
      },
      {
        title: "Customer control",
        body: "Reply STOP to end optional texts and HELP for support after a verified provider is active. Message and data rates may apply.",
      },
    ],
  },
  cancellation: {
    eyebrow: "Cancellation",
    title: "Route changes without hidden punishment.",
    dek: "The final notice window and any fee require operational and legal verification before activation.",
    sections: [
      {
        title: "Reschedule early",
        body: "Use the service reference as soon as the window no longer works so the route can be offered elsewhere.",
      },
      {
        title: "Access failure",
        body: "Inability to access the property, item or required parking may be treated differently from an advance change; any fee must have been disclosed before confirmation.",
      },
    ],
  },
  accessibility: {
    eyebrow: "Accessibility",
    title: "A site and service designed for real access.",
    dek: "Keyboard navigation, visible focus, reduced motion, readable contrast and form labels are part of the build—not a footer afterthought.",
    sections: [
      {
        title: "Digital access",
        body: "The site supports zoom, keyboard use, reduced-motion preferences, semantic headings, alt text and non-color-only form states.",
      },
      {
        title: "Service access",
        body: "Customers can include mobility, communication, parking, gate and building access needs in the service brief.",
      },
      {
        title: "Report a barrier",
        body: "Use the contact/care route with the page, task and barrier. Accessibility issues should be prioritized and tracked to resolution.",
      },
    ],
  },
  "notice-at-collection": {
    eyebrow: "Privacy notice",
    title: "What we collect at the moment you submit.",
    dek: "A just-in-time explanation for quote, booking, upload and customer-care forms.",
    sections: [
      {
        title: "Quote and booking",
        body: "ZIP, item details, condition, photos, requested window, contact information, address, access notes and consent time are used to estimate, assess, route and support the requested service.",
      },
      {
        title: "Commercial",
        body: "Company, role, property scope, counts, access, procurement details, uploaded plans/photos and contact information are used to review and respond to the walkthrough request.",
      },
      {
        title: "Customer care",
        body: "Service reference, booking email and message are used to locate the service record and handle status, reschedule or care review.",
      },
      {
        title: "Choices",
        body: "Do not upload people, IDs or unrelated private details. Marketing consent is not bundled with operational service contact. Access/correction/deletion requests use the privacy contact path.",
      },
    ],
  },
  "photo-media-consent": {
    eyebrow: "Photo and media",
    title: "Item photos are for scope—not automatic marketing permission.",
    dek: "Quote uploads and public result rights are separate decisions.",
    sections: [
      {
        title: "Quote photos",
        body: "Uploads are used to identify the item, care tag, condition, access and appropriate service scope. Avoid faces, documents and unrelated personal information.",
      },
      {
        title: "Service documentation",
        body: "The technician may document the item and completed scope for the service record, customer care and incident review.",
      },
      {
        title: "Marketing use",
        body: "Public before/after, social, advertising or case-study use requires a separate, specific permission. Submitting a quote does not grant that permission.",
      },
      {
        title: "Retention",
        body: "Photos should be retained only as long as operational, legal and customer-care needs require, then deleted according to the verified retention policy.",
      },
    ],
  },
  "commercial-terms": {
    eyebrow: "Commercial terms",
    title: "A service brief that procurement can follow.",
    dek: "Commercial scope, unit rates, site conditions, approval, records and invoicing stay attached to one reference.",
    sections: [
      {
        title: "Walkthrough and estimate",
        body: "Counts, materials, access, schedule constraints and requested documents are verified before a final commercial scope is accepted.",
      },
      {
        title: "Capacity",
        body: "After-hours, weekend and multi-location work is requested until route capacity is explicitly confirmed; the website does not promise an unverified SLA.",
      },
      {
        title: "Changes",
        body: "Additional items, heavy conditions, inaccessible areas and specialist materials require a documented change and approval owner.",
      },
      {
        title: "Deliverables",
        body: "The approved agreement may include service reports, photo records, issue logs, invoice detail and recurring recommendations. Final payment and vendor terms require business verification.",
      },
    ],
  },
  "licenses-insurance": {
    eyebrow: "Trust and compliance",
    title: "Credentials appear with evidence or not at all.",
    dek: "Insurance, licenses and certifications remain off the claim layer until documents, scope and expiry are verified.",
    sections: [
      {
        title: "Insurance",
        body: "The launch checklist requires carrier/document details and an operational method for commercial COI requests.",
      },
      {
        title: "Training and certifications",
        body: "Only credentials held by the named person or business, within active scope and current status, should appear publicly.",
      },
    ],
  },
};

const fabricCopy: Record<string, string> = {
  microfiber: "Microfiber and performance weaves",
  polyester: "Polyester upholstery",
  "cotton-linen": "Cotton and linen blends",
  velvet: "Velvet upholstery",
  wool: "Wool textiles",
  leather: "Leather seating",
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale, route, path } = routeLocale(slug);
  const siteConfig = await loadSiteConfig();
  const canonical = localizedPath(locale, path ? `/${path}` : "/");
  const languagePath = path ? `/${path}` : "/";
  const alternates = {
    canonical,
    languages: {
      "en-US": localizedPath("en", languagePath),
      "es-US": localizedPath("es", languagePath),
      "x-default": localizedPath("en", languagePath),
    },
  };
  const privateRoute =
    [
      "portal",
      "track",
      "reschedule",
      "claim",
      "launch-checklist",
      "out-of-area",
      "upload-failed",
      "payment-failed",
      "offline",
      "500",
    ].includes(path) || path.startsWith("thank-you/");
  const proofPending =
    [
      "team",
      "results",
      "reviews",
      "reviews-preview",
      "gift-cards",
      "referral",
      "care-plan",
      "licenses-insurance",
    ].includes(path) ||
    path === "guides" ||
    path.startsWith("guides/") ||
    path.startsWith("fabrics/") ||
    (path.startsWith("commercial/") && path !== "commercial/request-bid");
  if (route[0] === "service-area" && route[1])
    return {
      title: `${cityName(route[1])} Upholstery Cleaning`,
      description: `Mobile textile cleaning estimates in ${cityName(route[1])}, Orange County.`,
      alternates,
      robots: { index: false, follow: true },
    };
  if (route[0] === "services" && route[1]) {
    const page = servicePages.find((item) => item.slug === route[1]);
    if (page)
      return {
        title:
          locale === "es"
            ? `${page.name} en Orange County, CA`
            : `${page.name} Orange County, CA`,
        description:
          locale === "es"
            ? `${page.name} móvil en Orange County con precios claros, revisión del tejido y cálculo con fotos antes del servicio.`
            : `Professional ${page.name.toLowerCase()} across Orange County. See clear pricing, fabric-first scope and request a photo-reviewed estimate online.`,
        alternates,
        openGraph: {
          title: `${page.name} — Orange County | Novaclean`,
          description: page.problem,
          url: canonical,
          images: [{ url: page.image, alt: `${page.name} in Orange County` }],
        },
      };
  }
  if (route[0] === "guides" && route[1]) {
    const guide = guides.find((item) => item.slug === route[1]);
    if (guide)
      return {
        title: guide.title,
        description: guide.dek,
        alternates,
        robots: { index: false, follow: true },
      };
  }
  if (route[0] === "fabrics" && route[1] && fabricCopy[route[1]])
    return {
      title: fabricCopy[route[1]],
      description: `Eligibility-first guidance for ${fabricCopy[route[1]].toLowerCase()}, care codes, testing, and cleaning limits.`,
      alternates,
      robots: { index: false, follow: true },
    };
  if (route[0] === "commercial") {
    const segmentTitles: Record<string, string> = {
      "property-managers": "Textile Care for Property Managers",
      offices: "Office Seating Care",
      "multifamily-turnovers": "Multifamily Turnover Textile Care",
      "hospitality-seating": "Hospitality Seating Care",
      "request-bid": "Request a Commercial Walkthrough",
    };
    return {
      title: segmentTitles[route[1] || ""] || "Commercial Textile Care",
      description:
        "Documented Orange County textile-care scopes for properties, offices, multifamily turns, and hospitality seating.",
      alternates,
      robots: route[1] ? { index: false, follow: true } : undefined,
    };
  }
  if (legalDocuments[path] && locale !== "en") redirect(`/${path}`);
  if (legalDocuments[path])
    return {
      title: legalDocuments[path].title,
      description: legalDocuments[path].summary,
      alternates,
    };
  const seoRoutes: Record<string, { en: [string, string]; es: [string, string] }> = {
    pricing: {
      en: [
        "Upholstery Cleaning Prices Orange County, CA",
        "See Novaclean prices for sofas, sectionals, mattresses, rugs, carpet cleaning and add-ons before requesting service in Orange County.",
      ],
      es: [
        "Precios de limpieza de tapicería en Orange County",
        "Consulta precios para sofás, seccionales, colchones, alfombras, moquetas y extras antes de solicitar servicio en Orange County.",
      ],
    },
    services: {
      en: [
        "Upholstery & Textile Cleaning Services Orange County",
        "Explore sofa, sectional, chair, mattress, rug, carpet, pet odor and stain cleaning services across Orange County, California.",
      ],
      es: [
        "Servicios de limpieza de tapicería en Orange County",
        "Servicios móviles para sofás, seccionales, sillas, colchones, alfombras, moquetas, olores de mascotas y manchas en Orange County.",
      ],
    },
    "service-area": {
      en: [
        "Orange County Upholstery Cleaning Service Area",
        "Check Novaclean mobile upholstery and textile cleaning coverage by ZIP across Irvine, Costa Mesa, Newport Beach and Orange County.",
      ],
      es: [
        "Área de servicio de tapicería en Orange County",
        "Comprueba por ZIP la cobertura móvil de limpieza de tapicería y textiles en Irvine, Costa Mesa, Newport Beach y Orange County.",
      ],
    },
    faq: {
      en: [
        "Upholstery Cleaning FAQ — Prices, Drying & Fabric Care",
        "Answers about upholstery cleaning prices, drying time, stains, pet odor, fabric codes, service minimums and aftercare in Orange County.",
      ],
      es: [
        "Preguntas de limpieza de tapicería: precios y secado",
        "Respuestas sobre precios, tiempo de secado, manchas, olor de mascotas, códigos de tejido, mínimos y cuidados en Orange County.",
      ],
    },
  };
  const seoRoute = seoRoutes[path]?.[locale];
  if (seoRoute)
    return {
      title: seoRoute[0],
      description: seoRoute[1],
      alternates,
      openGraph: {
        title: `${seoRoute[0]} | Novaclean`,
        description: seoRoute[1],
        url: canonical,
        locale: locale === "es" ? "es_US" : "en_US",
      },
    };
  if (copy[path])
    return {
      title: copy[path].title,
      description: copy[path].dek,
      alternates,
      robots:
        privateRoute || proofPending
          ? { index: false, follow: true }
          : undefined,
    };
  const routeTitles: Record<string, string> = {
    pricing: "Pricing",
    services: "Services",
    "service-area": "Service Area",
    "orange-county": "Orange County Service Area",
    guides: "Guides",
    faq: "Frequently Asked Questions",
    "launch-checklist": "Launch Verification",
    portal: "Customer Portal",
    fabrics: "Fabric Care Library",
  };
  const title =
    path === ""
      ? locale === "es"
        ? siteConfig.seo.homeTitleEs
        : siteConfig.seo.homeTitleEn
      : routeTitles[path] || "Novaclean";
  return {
    title,
    description:
      path === ""
        ? locale === "es"
          ? siteConfig.seo.homeDescriptionEs
          : siteConfig.seo.homeDescriptionEn
        : siteConfig.seo.defaultDescription,
    alternates,
    openGraph:
      path === ""
        ? {
            title: `${title} | Novaclean`,
            description:
              locale === "es"
                ? siteConfig.seo.homeDescriptionEs
                : siteConfig.seo.homeDescriptionEn,
            url: canonical,
            locale: locale === "es" ? "es_US" : "en_US",
          }
        : undefined,
    robots:
      privateRoute || proofPending ? { index: false, follow: true } : undefined,
  };
}

export default async function CatchAllPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { locale, route, path } = routeLocale(slug);
  const query = searchParams ? await searchParams : {};
  const siteConfig = await loadSiteConfig();
  if (!path) return <HomePageContent locale={locale} />;
  if (path === "get-quote" || path === "book")
    return (
      <QuoteWizard
        locale={locale}
        initialZip={(query.zip ?? "").slice(0, 5)}
        initialService={query.service ?? ""}
        bookingMode={path === "book"}
      />
    );
  if (path === "pricing")
    return <PricingPage locale={locale} siteConfig={siteConfig} />;
  if (path === "services") return <ServicesHub locale={locale} />;
  if (
    route[0] === "services" &&
    route[1] &&
    servicePages.some((item) => item.slug === route[1])
  )
    return (
      <ServicePage
        slug={route[1]}
        locale={locale}
        siteConfig={siteConfig}
      />
    );
  if (path === "service-area" || path === "orange-county")
    return <ServiceAreaPage locale={locale} />;
  if (
    route[0] === "service-area" &&
    route[1] &&
    cities.includes(route[1] as (typeof cities)[number])
  )
    return (
      <CityPage slug={route[1]} locale={locale} siteConfig={siteConfig} />
    );
  if (path === "guides") return <GuidesHub />;
  if (
    route[0] === "guides" &&
    route[1] &&
    guides.some((item) => item.slug === route[1])
  )
    return <GuidePage slug={route[1]} />;
  if (path === "faq") return <FAQPage locale={locale} />;
  if (path === "price-comparison-methodology")
    redirect(localizedPath(locale, "/pricing"));
  if (path === "how-it-works") return <HowItWorksPage locale={locale} />;
  if (path === "about") return <AboutPage locale={locale} />;
  if (path === "results") return <ResultsPage locale={locale} />;
  if (path === "reviews") return <ReviewsPage locale={locale} />;
  if (path === "reviews-preview") return <ReviewPreviewPage />;
  if (legalDocuments[path])
    return <LegalDocumentPage document={legalDocuments[path]} />;
  if (path === "launch-checklist") return <LaunchChecklistPage />;
  if (path === "contact") return <ContactPage locale={locale} />;
  if (path === "portal") return <PortalPage />;
  if (path === "track" || path === "reschedule" || path === "claim")
    return <CarePage type={path} />;
  if (locale === "es" && route[0] === "commercial")
    return (
      <GenericPage
        locale="es"
        eyebrow="Comercial"
        title="Cuidado textil documentado para propiedades y equipos."
        dek="Inventario fotográfico, alcance repetible, preferencias de ruta y un registro preparado para la entrega operativa."
        image="/media/final/commercial.webp"
        sections={[
          {
            title: "Un resumen operativo",
            body: "Ubicaciones, cantidad de artículos, materiales, acceso, horarios y requisitos de proveedor quedan en una sola solicitud.",
          },
          {
            title: "Alcance para aprobación",
            body: "Las prioridades, exclusiones y límites de tratamiento aparecen junto al cálculo antes de aceptar el trabajo.",
          },
          {
            title: "Registro del servicio",
            body: "El plan contempla artículos terminados, notas de estado, incidencias, fotos y cuidados posteriores.",
          },
        ]}
      />
    );
  if (
    route[0] === "commercial" &&
    (!route[1] ||
      [
        "property-managers",
        "offices",
        "multifamily-turnovers",
        "hospitality-seating",
        "request-bid",
      ].includes(route[1]))
  )
    return <CommercialPage segment={route[1]} />;
  if (path === "fabrics")
    return (
      <GenericPage
        eyebrow="Fabric library"
        title="Material changes the method."
        dek="Education routes that stay honest about codes, fiber blends, backing, dye behavior and referral limits."
        sections={[
          {
            title: "Start with the tag",
            body: "A care tag can identify a manufacturer code and fiber content, but testing the actual item remains essential.",
          },
          {
            title: "Common material routes",
            body: "Microfiber, polyester, cotton/linen, velvet, wool and leather each require different eligibility and limitation questions.",
          },
          {
            title: "No generic permission",
            body: "Separate fabric pages publish with real methods and limits—not keyword copy that suggests every item is routine.",
          },
        ]}
      />
    );
  if (slug[0] === "fabrics" && slug[1] && fabricCopy[slug[1]])
    return (
      <GenericPage
        eyebrow="Fabric library"
        title={fabricCopy[slug[1]]}
        dek="An eligibility-first guide; the care code and hidden-area test decide the actual service."
        sections={[
          {
            title: "What to photograph",
            body: "Full item, care tag, close-up texture, problem area and any damaged seam or backing.",
          },
          {
            title: "Method decisions",
            body: "Fiber, dye, nap, backing, fill and previous products determine water level, chemistry, agitation and drying plan.",
          },
          {
            title: "Reasons to pause",
            body: "Unstable color, damaged coating, shrinkage risk, undocumented treatment or code X can lead to a limited method or specialist referral.",
          },
        ]}
      />
    );
  if (["thank-you/quote", "thank-you/booking"].includes(path))
    return (
      <GenericPage
        eyebrow="Saved"
        title="Your request is in the right place."
        dek="Use the NC reference on your confirmation to prepare, track or update the request."
        sections={[
          {
            title: "Next",
            body: "Keep the item accessible, avoid adding new spotters and use the preparation checklist before the confirmed window.",
          },
        ]}
        cta={false}
      />
    );
  if (
    [
      "out-of-area",
      "upload-failed",
      "payment-failed",
      "offline",
      "500",
    ].includes(path)
  )
    return (
      <GenericPage
        eyebrow="Service notice"
        title={
          path === "out-of-area"
            ? "This ZIP is outside the launch route."
            : path === "offline"
              ? "You appear to be offline."
              : path === "500"
                ? "The service hit a temporary interruption."
                : "That step did not complete."
        }
        dek="Your quote answers remain saved in this browser so you can continue without starting over."
        sections={[
          {
            title: "Safe next step",
            body:
              path === "out-of-area"
                ? "Keep the quote reference and join the route list; no availability claim is made until the area is operational."
                : "Return to the quote flow and retry. If an upload is unavailable, the estimate can continue and photos can be requested later.",
          },
        ]}
        cta={false}
      />
    );
  const localizedGeneric = genericPageMessages[locale]?.[path];
  if (localizedGeneric)
    return <GenericPage {...localizedGeneric} locale={locale} />;
  if (copy[path]) return <GenericPage {...copy[path]} locale={locale} />;
  notFound();
}
