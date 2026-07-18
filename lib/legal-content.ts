export const LEGAL_VERSION = "2026-07-17";

export type LegalSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  eyebrow: string;
  summary: string;
  sections: LegalSection[];
  sources?: { label: string; url: string }[];
};

const commonContact =
  "Submit a message at /contact and select Privacy or Accessibility, as applicable. Include only the information needed to locate the relevant record. The website contact form is the current public request channel; additional verified business contact details will be published when connected.";

export const legalDocuments: Record<string, LegalDocument> = {
  privacy: {
    eyebrow: "Privacy policy",
    title: "Privacy, explained around the actual service.",
    summary:
      "This policy describes how Novaclean handles website, quote, upload, service, commercial, and customer-care information. It is designed for California users and applies to this website and the service records created through it.",
    sections: [
      {
        title: "1. Who controls the information",
        body: [
          "Novaclean operates this website and determines why submitted information is used. Requests currently enter through the documented website forms and receive a server-issued reference.",
          commonContact,
        ],
      },
      {
        title: "2. Information we collect",
        body: [
          "We collect information you provide, information created while handling a request, and limited first-party technical information.",
        ],
        bullets: [
          "Identifiers and contact data: name, email, phone, service ZIP, address, and service reference.",
          "Commercial information: requested services, item counts, estimates, approved scope, appointment status, service history, and customer-care records.",
          "Content: item and care-tag photos, condition notes, messages, access instructions, and optional property or floor-plan images.",
          "Internet activity: requested page, first-party session identifier, basic conversion events, browser-provided signals, and error information. We do not intentionally use this launch build for cross-site advertising.",
          "Sensitive information that may be submitted for service: precise service address and access or gate instructions. Do not submit identification documents, financial account details, medical data, or unrelated images of people.",
          "Commercial-contact data: company, role, locations, property scope, procurement requirements, and requested vendor documents.",
        ],
      },
      {
        title: "3. Sources",
        body: [
          "Information comes directly from customers or authorized business representatives, from website interactions, from technicians and support personnel handling the request, and from service providers that host the website, database, uploads, email, or messaging when those providers are enabled.",
        ],
      },
      {
        title: "4. Why we use it",
        body: [
          "We use information to build and validate estimates; assess textile and service eligibility; route, schedule, confirm, and perform services; communicate operational updates; prevent fraud and abuse; maintain service and consent records; handle reschedules, quality concerns, damage reports, and legal obligations; improve accessibility, reliability, and conversion performance; and establish or defend legal claims.",
          "Precise address and access notes are used only for service routing, access, safety, support, and related legal or operational needs. We do not use them to infer health, identity, or other unrelated traits.",
        ],
      },
      {
        title: "5. Disclosure and service providers",
        body: [
          "We may disclose information to infrastructure, database, file-storage, communications, analytics, professional-adviser, insurer, payment, and field-service providers only to perform a defined business purpose. We may also disclose information when required by law, to protect safety or rights, or as part of a business transaction subject to appropriate safeguards.",
          "At launch, Novaclean does not sell personal information and does not share it for cross-context behavioral advertising. If that practice changes, the policy and required opt-out controls must change before the practice begins.",
        ],
      },
      {
        title: "6. Retention",
        body: [
          "Browser quote drafts keep only non-contact choices and expire after seven days. Contact details are not placed in that browser draft. Quote and upload records are intended to be retained for up to 24 months after the last interaction when no service occurs. Completed service and transaction records may be retained for up to seven years for tax, insurance, warranty, fraud, and dispute needs. General contact and commercial lead records are intended to be retained for up to 24 months after the last interaction. First-party analytics events are intended to be retained for up to 13 months. Consent, suppression, dispute, and legal-hold records may be kept as long as reasonably needed to document the request or comply with law.",
          "A daily automated cleanup removes expired analytics, eligible service-request records, and unsubmitted upload media. Records marked with an operational legal hold are excluded. Cleanup results and failures are logged in the protected operations dashboard. A record may still be retained for a shorter period when no longer needed, or longer when required by law, an active dispute, safety, fraud prevention, insurance, or a documented legal hold.",
        ],
      },
      {
        title: "7. California privacy choices",
        body: [
          "Depending on the law and Novaclean’s status, California residents may request access to categories or specific pieces of personal information, correction, deletion, information about disclosures, opt-out of sale or sharing, limitation of certain sensitive-information uses, and non-discriminatory treatment. Novaclean intends to honor verifiable access, correction, and deletion requests even where a statutory threshold may not apply.",
          "Because the launch build does not sell or share personal information for cross-context behavioral advertising, there is presently no sale/share opt-out link. The site honors Global Privacy Control and Do Not Track signals by suppressing optional first-party analytics in the browser. If practices change, an appropriate preference mechanism must be deployed first.",
        ],
      },
      {
        title: "8. Requests, verification, and authorized agents",
        body: [
          commonContact,
          "We may ask for the service reference, matching email, or other limited information needed to verify identity and prevent disclosure to the wrong person. An authorized agent may submit a request with proof of authority; we may also verify the request directly with the consumer. We will explain any denial and available appeal path when required. We do not charge for ordinary requests unless the law permits a fee for manifestly unfounded or excessive requests.",
        ],
      },
      {
        title: "9. Security and uploads",
        body: [
          "We use transport security, access controls, non-public upload keys, file limits, signature checks, removal of common photo metadata, per-route request limits, expiring pseudonymous abuse counters, and least-purpose collection. No system is perfectly secure. Avoid uploading faces, documents, location screenshots, or unrelated private information. If you believe information was exposed, use the contact route promptly.",
        ],
      },
      {
        title: "10. Children",
        body: [
          "The website and cleaning services are intended for adults arranging property services, not children under 13. We do not knowingly collect personal information from children. A parent or guardian may request deletion through the privacy contact path.",
        ],
      },
      {
        title: "11. Changes",
        body: [
          "The effective version appears on this page. Material changes will be posted before they take effect and, where required, separately communicated or presented for renewed consent. A new version does not retroactively expand marketing or media permission.",
        ],
      },
    ],
    sources: [
      {
        label: "California Attorney General — CCPA",
        url: "https://oag.ca.gov/privacy/ccpa",
      },
      {
        label: "California Privacy Protection Agency — regulations",
        url: "https://cppa.ca.gov/regulations/",
      },
      {
        label: "California Online Privacy Protection Act",
        url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=22575",
      },
    ],
  },
  "notice-at-collection": {
    eyebrow: "Notice at collection",
    title: "What is collected before you submit.",
    summary:
      "This notice applies at the quote, booking, contact, care, and commercial forms. It should be read before submitting personal information.",
    sections: [
      {
        title: "Categories, purposes, and intended retention",
        body: [
          "Identifiers and contact details—including name, email, phone, ZIP, service address, and reference—are used to respond, estimate, route, confirm, support, and secure the request. Uncompleted quote contact details are not stored in the browser draft. Server records are intended to be kept up to 24 months after the last interaction when no service occurs and up to seven years when tied to a completed service or transaction.",
          "Commercial information—including selected items, quantity, condition, estimate, preferred window, company, property scope, and service record—is used to assess and perform the requested service, manage quality, and maintain business records. Intended retention is up to 24 months for an unconverted request and up to seven years for completed service records.",
          "Content—including notes, item photos, care tags, access instructions, support messages, and optional floor plans—is used for eligibility, scope, routing, service documentation, support, claims, and safety. Intended retention generally follows the associated quote or service record.",
          "Internet activity—including page path, first-party session identifier, and basic conversion events—is used to monitor reliability and improve the experience. Intended retention is up to 13 months.",
          "Sensitive personal information may include a precise service address and gate or access instructions. It is used only for the requested service, safety, support, and related legal needs. Do not submit unrelated sensitive information.",
        ],
      },
      {
        title: "Sale and sharing",
        body: [
          "Novaclean does not sell these categories and does not share them for cross-context behavioral advertising in this launch build. Quote photos are not marketing consent.",
        ],
      },
      {
        title: "Your control",
        body: [
          "Submission authorizes operational use needed to respond to the request; it does not opt you into marketing. Read the Privacy Policy for disclosure, retention, security, and California request rights. You may stop before submitting and remove optional notes or photos.",
        ],
      },
      { title: "Contact", body: [commonContact] },
    ],
    sources: [
      {
        label: "California Privacy Protection Agency — general notices",
        url: "https://cppa.ca.gov/pdf/general_notices.pdf",
      },
    ],
  },
  terms: {
    eyebrow: "Website and service terms",
    title: "The scope, permission, and limits of the service.",
    summary:
      "These terms govern use of the website and requests submitted through it. A requested window is not a confirmed appointment, and an online estimate is not a promise that every textile is safely cleanable.",
    sections: [
      {
        title: "1. Acceptance and authority",
        body: [
          "By submitting a request, you confirm that you are at least 18, can enter an agreement, and own the item or are authorized to approve service for it. Website browsing does not itself create a service contract. A service agreement forms only after Novaclean confirms the scope and appointment.",
        ],
      },
      {
        title: "2. Estimates and public benchmarks",
        body: [
          "An online estimate depends on the selected item, quantity, service ZIP, and approved add-ons. Photos, material, condition, and access facts are reviewed to confirm eligibility and scope before work. Published benchmark values identify local public prices for comparable scope; they are not a claim about every competitor. The methodology page identifies the source and checked date. Taxes, parking, specialty handling, or other charges must be disclosed before approval if they apply.",
        ],
      },
      {
        title: "3. Appointment status",
        body: [
          "Website windows are preferences generated for planning; they are not a live inventory promise. A request remains requested until accepted against actual capacity. Novaclean may decline or propose a different window because of route capacity, weather, safety, access, textile eligibility, or incomplete information.",
        ],
      },
      {
        title: "4. Customer responsibilities",
        body: [
          "Provide accurate item, material, condition, contamination, prior-product, address, parking, gate, elevator, utility, and access information. Secure pets and children away from the work zone, remove fragile or valuable items, disclose known damage or hazardous conditions, and ensure safe access. Do not request treatment of an item you cannot authorize.",
        ],
      },
      {
        title: "5. Inspection, method, and change approval",
        body: [
          "The technician may inspect care codes, fiber, dye stability, backing, construction, prior damage, contamination, and access before starting. If the safe method or price differs materially from the online estimate, Novaclean must explain the change and obtain approval before added work. Declining a proposed change allows either party to omit that work or cancel the affected service without an undisclosed penalty.",
        ],
      },
      {
        title: "6. Results, stains, odors, and drying",
        body: [
          "Cleaning addresses removable soil within a safe method. It does not restore normal wear, sun fade, dye loss, abrasion, damaged backing, permanent stains, or inaccessible contamination. Complete stain or odor removal is not guaranteed. Drying depends on fiber, fill, construction, method, humidity, airflow, and use. Follow the item-specific aftercare directions and keep people and pets off damp textiles until the stated point.",
        ],
      },
      {
        title: "7. Payment",
        body: [
          "No payment or deposit is collected in the current launch flow. Before payment is enabled, the site must state accepted methods, due date, taxes, refunds, charge authorization, and any deposit rule. A payment provider’s separate terms may also apply.",
        ],
      },
      {
        title: "8. Cancellations and care",
        body: [
          "The current launch policy imposes no unverified cancellation fee. Use the reference to request a change as early as possible. Quality concerns should be reported after full drying and within the published seven-day care window. Damage or safety concerns should be reported promptly under the Claims and Damage Process. Statutory rights are not shortened by an operational reporting window.",
        ],
      },
      {
        title: "9. Photos and communications",
        body: [
          "Submitted item photos may be used for scope, eligibility, service documentation, support, safety, and claim handling. They are not permission for advertising or public before-and-after use. Operational email or text may be used to respond to the request; marketing requires a separate lawful basis or opt-in.",
        ],
      },
      {
        title: "10. Website use",
        body: [
          "Do not interfere with the site, test credentials without authorization, submit malware or unlawful content, scrape personal information, impersonate another person, or abuse forms. Website content, brand elements, and original design are protected by applicable law. External links are provided for evidence or convenience and remain controlled by their operators.",
        ],
      },
      {
        title: "11. Responsibility and applicable law",
        body: [
          "Each party remains responsible for losses caused by its own acts or omissions. Nothing in these terms excludes responsibility that California law does not allow to be excluded, including applicable consumer remedies or liability for fraud, gross negligence, or willful misconduct. Any claim should first be sent through the documented care or damage path so the record can be investigated. California law applies, without overriding mandatory consumer protections. Venue language and the final contracting entity require California counsel review before public launch.",
        ],
      },
      {
        title: "12. Changes and severability",
        body: [
          "If a term is unenforceable, the remaining terms continue to the extent allowed. Material changes apply prospectively and will be identified by a new version date. These terms, the confirmed scope, and any written change approval form the applicable service record; a specific signed commercial agreement controls over conflicting website terms.",
        ],
      },
    ],
    sources: [
      {
        label: "FTC — Advertising FAQs for small business",
        url: "https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business",
      },
    ],
  },
  "sms-terms": {
    eyebrow: "SMS terms",
    title: "Texting stays optional and controllable.",
    summary:
      "SMS is not active in the launch build. These terms define the controls that must exist before a verified Novaclean number and provider are enabled.",
    sections: [
      {
        title: "Program and consent",
        body: [
          "Operational messages may include request confirmation, questions about scope or access, preferred-window updates, arrival coordination, and customer-care follow-up. Consent to operational texting is tied to the submitted service request. Marketing texts require a separate, conspicuous opt-in and are not a condition of purchase.",
        ],
      },
      {
        title: "Frequency and charges",
        body: [
          "Message frequency varies with the request. Message and data rates may apply under the customer’s wireless plan. Carriers are not liable for delayed or undelivered messages.",
        ],
      },
      {
        title: "Stop and help",
        body: [
          "After activation, reply STOP, QUIT, END, REVOKE, OPT OUT, CANCEL, or UNSUBSCRIBE to revoke consent through a reasonable method. Reply HELP for support. One final confirmation message may be sent after opt-out. A customer may also revoke through the contact route. Revocation does not prevent communications that are legally required or separately requested through another channel.",
        ],
      },
      {
        title: "Number ownership and privacy",
        body: [
          "Provide a number you control and promptly update Novaclean if it changes. Do not include sensitive details in text. The Privacy Policy governs message records, service providers, retention, and rights.",
        ],
      },
      {
        title: "Launch requirement",
        body: [
          "No SMS claim should be presented publicly until the sending number, provider, opt-in language, help path, opt-out automation, suppression handling, and consent-log version are tested end to end.",
        ],
      },
    ],
    sources: [
      {
        label: "FCC — consumer consent and revocation rules",
        url: "https://www.fcc.gov/document/fcc-strengthens-consumers-ability-revoke-robocall-consent",
      },
    ],
  },
  cancellation: {
    eyebrow: "Cancellation and rescheduling",
    title: "A requested window can change without a hidden fee.",
    summary:
      "The launch flow does not collect a deposit and does not impose an unverified cancellation fee. A window remains a preference until Novaclean confirms it.",
    sections: [
      {
        title: "Requested versus confirmed",
        body: [
          "Submitting a preferred window does not reserve live capacity. Before confirmation, either party may change or withdraw the request. After confirmation, use the NC reference to request a new window as soon as reasonably possible.",
        ],
      },
      {
        title: "Customer changes",
        body: [
          "There is no launch cancellation or rescheduling fee. If a fee is introduced later, its amount, timing, exceptions, and method of acceptance must be clearly disclosed before confirmation and must comply with applicable law.",
        ],
      },
      {
        title: "Access failure",
        body: [
          "If the technician cannot safely park, enter, reach the item, obtain required utilities, or work because of an undisclosed hazard, the visit may be stopped or rescheduled. No fee is charged unless it was conspicuously disclosed and accepted before confirmation.",
        ],
      },
      {
        title: "Novaclean changes",
        body: [
          "Novaclean may cancel or reschedule for route capacity, illness, equipment failure, weather, unsafe conditions, access issues, or textile ineligibility. The customer will be offered a reasonable next step. Any collected deposit or prepaid amount would be handled under the disclosed payment policy; none is collected in this launch flow.",
        ],
      },
      {
        title: "Legal rights",
        body: [
          "Nothing here limits cancellation, refund, or other rights that cannot be waived under applicable law or a signed commercial agreement.",
        ],
      },
    ],
  },
  guarantee: {
    eyebrow: "Service care guarantee",
    title: "A documented second look—not an impossible promise.",
    summary:
      "Contact Novaclean within seven days after full drying if an agreed-scope quality concern remains. When the concern is covered and can be safely improved, the first re-clean visit is included.",
    sections: [
      {
        title: "What is covered",
        body: [
          "A quality concern tied to the confirmed scope, reported with the service reference and enough information to review it, with reasonable access to inspect and perform a safe correction.",
        ],
      },
      {
        title: "What is not a guaranteed outcome",
        body: [
          "Permanent stains, wear, abrasion, color loss, sun fade, pre-existing damage, dye instability, inaccessible contamination, material limitations disclosed before service, new damage or soil, customer-applied products after service, and complete odor or stain removal are not promised outcomes.",
        ],
      },
      {
        title: "How review works",
        body: [
          "Allow the item to reach the stated dry point, document the concern without applying a new product, and submit the reference and useful photos. Novaclean reviews the confirmed scope, condition record, method, aftercare, and safe options. A result may be guidance, inspection, an included first re-clean, a limited alternative, or an explanation that the remaining condition is outside the cleanable scope.",
        ],
      },
      {
        title: "Damage is separate",
        body: [
          "A suspected damage or safety issue is handled under the Claims and Damage Process and should be reported promptly. The seven-day quality-care window does not waive a legal right that cannot be waived.",
        ],
      },
    ],
  },
  "photo-media-consent": {
    eyebrow: "Photo and media policy",
    title: "Service evidence is not marketing permission.",
    summary:
      "Photos uploaded with a quote or created for a service record are used for the requested work, not automatically for advertising, social media, or a public results gallery.",
    sections: [
      {
        title: "Operational use",
        body: [
          "Item, care-tag, condition, access, and completed-scope images may be used to estimate, assess eligibility, plan service, document condition and work, answer support questions, investigate claims, train authorized personnel on the specific record, and satisfy legal or insurance needs.",
        ],
      },
      {
        title: "What not to upload",
        body: [
          "Avoid faces, children, identification, financial or medical documents, computer screens, family photos, location screenshots, and unrelated rooms. The upload handler accepts limited image types and removes common embedded location or text metadata, but visual content can still reveal private information.",
        ],
      },
      {
        title: "Public or marketing use",
        body: [
          "A separate written release is required for website results, social media, advertising, press, or portfolio use. The release should identify the media, channels, compensation if any, whether identity or location will appear, duration, and how to revoke future use. Revocation is prospective and may not require recall of material already lawfully distributed. A parent or legal guardian must authorize identifiable media involving a minor.",
        ],
      },
      {
        title: "Storage and access",
        body: [
          "Upload objects use non-public random keys and are accessible only through authorized operational systems. Retention follows the related quote, service, claim, or legal-hold record. A customer may request access or deletion subject to legal and operational exceptions under the Privacy Policy.",
        ],
      },
    ],
    sources: [
      {
        label: "California Civil Code § 3344",
        url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=3344",
      },
    ],
  },
  "commercial-terms": {
    eyebrow: "Commercial service terms",
    title: "A procurement-ready scope still requires approval.",
    summary:
      "Submitting a walkthrough brief creates a lead record, not an accepted bid, guaranteed capacity, or final commercial contract.",
    sections: [
      {
        title: "Authorized representative",
        body: [
          "The submitter confirms authority to provide the property information and request an evaluation. Final approval must come from an identified representative authorized to bind the customer.",
        ],
      },
      {
        title: "Walkthrough and scope",
        body: [
          "Counts, materials, service locations, condition, utilities, access, parking, elevators, security, service hours, safety requirements, exclusions, reporting, and target dates are verified before a final scope is accepted. Public unit rates may serve as anchors but do not override a written commercial scope.",
        ],
      },
      {
        title: "Capacity and changes",
        body: [
          "After-hours, weekend, recurring, and multi-location work remains requested until explicitly confirmed. Additional items, changed condition, specialist textiles, inaccessible areas, or added reporting require a documented change, price, schedule effect, and approval owner before work proceeds.",
        ],
      },
      {
        title: "Vendor records",
        body: [
          "W-9, certificate of insurance, license, training, or background-check information is provided only after the underlying document, named insured or holder, scope, and current status are verified. A checkbox requesting a COI does not itself represent that coverage exists.",
        ],
      },
      {
        title: "Payment and precedence",
        body: [
          "Invoice timing, taxes, deposits, cancellation, late payment, purchase-order, and procurement terms must appear in the accepted proposal or signed agreement. No such payment term is inferred from the website. A signed agreement or accepted proposal controls over conflicting website language.",
        ],
      },
      {
        title: "Records, confidentiality, and claims",
        body: [
          "The approved deliverables may include item logs, condition notes, issue records, and authorized photos. Each party should limit access to confidential site and customer information. Quality concerns follow the agreed care process; suspected damage follows the Claims and Damage Process and any applicable insurance procedure.",
        ],
      },
    ],
  },
  accessibility: {
    eyebrow: "Accessibility statement",
    title: "Digital and service access are operating requirements.",
    summary:
      "Novaclean aims to make the website and service process usable for people with disabilities and treats reported barriers as tracked product issues.",
    sections: [
      {
        title: "Target",
        body: [
          "The design and development target is WCAG 2.2 Level AA where reasonably applicable. The build includes semantic headings, keyboard-operable controls, visible focus, labeled fields, error text, responsive zoom, reduced-motion support, alt text, and non-color-only states. This is a target and ongoing process, not a claim that every page or third-party service is perfectly conformant.",
        ],
      },
      {
        title: "Testing",
        body: [
          "Automated checks are combined with keyboard, zoom, reduced-motion, form-error, contrast, and representative screen-reader review. New pages and integrations should be checked before release. Third-party services may have separate limitations; Novaclean should provide an accessible alternative when a material barrier is identified.",
        ],
      },
      {
        title: "Service accommodations",
        body: [
          "Customers may describe mobility, communication, parking, gate, building-access, or other accommodation needs in the request. Novaclean will engage in a practical process to identify a reasonable way to provide the service, subject to safety and applicable law.",
        ],
      },
      {
        title: "Report a barrier",
        body: [
          commonContact,
          "Include the page or task, device or browser if known, the barrier, and a preferred way to receive a response. Do not include medical details that are not needed. Accessibility reports should receive a reference, priority review, and status follow-up.",
        ],
      },
    ],
    sources: [
      {
        label: "U.S. Department of Justice — web accessibility guidance",
        url: "https://www.ada.gov/resources/web-guidance/",
      },
    ],
  },
  "cookie-policy": {
    eyebrow: "Cookie and storage policy",
    title: "No advertising cookie layer in the launch build.",
    summary:
      "This website uses limited first-party browser storage for a non-contact quote draft and a session identifier. It does not currently use third-party advertising cookies.",
    sections: [
      {
        title: "What is stored",
        body: [
          "Local storage may keep the service ZIP, selected item, quantity, fabric, condition, selected add-ons, preferred window, current step, and saved time for up to seven days. It does not persist name, email, phone, address, free-text notes, access instructions, consent, or uploaded files. Session storage may hold a random first-party analytics session identifier until the browser session ends.",
        ],
      },
      {
        title: "Why",
        body: [
          "The draft helps a user return without repeating non-contact choices. The session identifier helps count navigation and conversion events without creating a cross-site profile.",
        ],
      },
      {
        title: "Controls and signals",
        body: [
          "Clearing site data removes the draft and session identifier. Disabling browser storage may prevent resume behavior but should not block the core form. When Global Privacy Control or Do Not Track is enabled, the browser analytics component suppresses optional event collection.",
        ],
      },
      {
        title: "No banner by default",
        body: [
          "Because the launch build does not use nonessential third-party advertising or profiling cookies, a consent banner is not presented merely to create the appearance of compliance. Before adding advertising, remarketing, heatmaps, or other nonessential technology, Novaclean must update this policy and deploy any consent or opt-out mechanism required by applicable law.",
        ],
      },
    ],
  },
  "claims-damage": {
    eyebrow: "Claims and damage process",
    title: "Preserve the item, the facts, and the response path.",
    summary:
      "A quality-care request and a suspected damage claim are different. Report a safety or damage concern promptly so the item and service record can be reviewed fairly.",
    sections: [
      {
        title: "Immediate safety",
        body: [
          "Stop using the item if continued use may worsen damage or create a safety issue. For an emergency involving immediate danger, contact emergency services or the appropriate utility or property authority first.",
        ],
      },
      {
        title: "How to report",
        body: [
          "Use the claim route with the NC service reference and booking email, describe what happened and when it was first observed, and include clear photos when safe. If the website is unavailable, use the verified business contact channel once published. Do not include unrelated sensitive information.",
        ],
      },
      {
        title: "Preserve evidence and mitigate",
        body: [
          "Do not apply new cleaners, alter, discard, repair, or sell the item before reasonable review unless necessary for safety or to prevent additional loss. Take reasonable steps to limit further damage. Keep receipts, manufacturer information, prior condition photos, and any repair opinion. These steps help fact-finding and do not decide responsibility.",
        ],
      },
      {
        title: "Review",
        body: [
          "Novaclean may compare pre-service condition, photos, care code, approved scope, technician notes, method, products, aftercare, timing, and other plausible causes. Reasonable access may be requested for inspection. Acknowledging a report is not an admission of liability.",
        ],
      },
      {
        title: "Possible resolution",
        body: [
          "Depending on the evidence and applicable law, a response may include information, safe corrective work, specialist inspection, repair, replacement-value analysis, insurer coordination, denial with an explanation, or another agreed resolution. Customers should not incur a non-emergency repair cost on Novaclean’s behalf without written authorization and should mitigate avoidable additional loss.",
        ],
      },
      {
        title: "Rights and deadlines",
        body: [
          "Report promptly because delay can make cause and mitigation harder to evaluate. The seven-day service guarantee is a quality-care window, not a contractual shortening of a non-waivable statutory limitation period. Nothing in this process removes rights or remedies that applicable law does not allow to be waived.",
        ],
      },
    ],
  },
};

export const legalPaths = Object.keys(legalDocuments);
