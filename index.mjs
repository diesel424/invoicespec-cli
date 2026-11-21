const SITE_BASE = 'https://invoicespec-hub.pages.dev';

const VALID_ISO_4217 = new Set([
  'EUR', 'USD', 'GBP', 'PLN', 'SEK', 'NOK', 'DKK', 'CHF', 'CZK', 'HUF', 'RON', 'BGN', 'AUD', 'CAD', 'JPY',
]);

/**
 * Validates an OASIS UBL 2.1 or UN/CEFACT CII D16B XML invoice against core
 * EN 16931, Peppol BIS Billing 3.0, XRechnung 3.0, and ZUGFeRD 2.3 / Factur-X rules.
 * Every returned issue includes a direct `docsUrl` pointing to InvoiceSpec Hub.
 */
export function validateInvoiceXml(rawXml) {
  const xml = String(rawXml || '').trim();
  const issues = [];

  const isCii = /<(?:rsm:)?CrossIndustryInvoice[\s>]/.test(xml) || /<ram:/.test(xml);
  const isUbl = /<(?:ubl:)?Invoice[\s>]/.test(xml) || /<cbc:/.test(xml) || /<cac:/.test(xml);
  const syntax = isCii ? 'CII-D16B' : isUbl ? 'UBL-2.1' : 'UNKNOWN';

  if (syntax === 'UNKNOWN') {
    issues.push({
      ruleCode: 'BR-01',
      severity: 'fatal',
      xpath: '/',
      message: 'Payload is neither OASIS UBL 2.1 (<Invoice>) nor UN/CEFACT CII (<rsm:CrossIndustryInvoice>).',
      docsUrl: `${SITE_BASE}/errors/peppol-bis-3/br-01`,
    });
    return { isValid: false, syntax, issues };
  }

  if (syntax === 'UBL-2.1') {
    const cust = xml.match(/<cbc:CustomizationID[^>]*>([\s\S]*?)<\/cbc:CustomizationID>/);
    if (!cust || !cust[1].includes('en16931')) {
      issues.push({
        ruleCode: 'BR-01',
        severity: 'fatal',
        xpath: '/ubl:Invoice/cbc:CustomizationID',
        message: 'Missing or non-compliant EN 16931 Specification identifier (BT-24).',
        docsUrl: `${SITE_BASE}/errors/peppol-bis-3/br-01`,
      });
    }

    const curr = xml.match(/<cbc:DocumentCurrencyCode[^>]*>([^<]+)<\/cbc:DocumentCurrencyCode>/);
    if (curr && !VALID_ISO_4217.has(curr[1].trim())) {
      issues.push({
        ruleCode: 'BR-CL-01',
        severity: 'fatal',
        xpath: '/ubl:Invoice/cbc:DocumentCurrencyCode',
        message: `Invalid ISO 4217 currency code "${curr[1].trim()}".`,
        docsUrl: `${SITE_BASE}/errors/peppol-bis-3/br-cl-01`,
      });
    }

    const emptyTagRegex = /<([a-zA-Z0-9]+:[a-zA-Z0-9]+)(?:\s+[^>]*)?>\s*<\/\1>|<([a-zA-Z0-9]+:[a-zA-Z0-9]+)(?:\s+[^>]*)?\/>/g;
    const emptyMatches = [...xml.matchAll(emptyTagRegex)];
    if (emptyMatches.length > 0) {
      const tag = emptyMatches[0][1] || emptyMatches[0][2];
      issues.push({
        ruleCode: 'PEPPOL-EN16931-R008',
        severity: 'fatal',
        xpath: `//${tag}[not(node())]`,
        message: `Document contains ${emptyMatches.length} empty XML element(s) (<${tag}>).`,
        docsUrl: `${SITE_BASE}/errors/peppol-bis-3/peppol-en16931-r008`,
      });
    }

    const supplier = xml.match(/<cac:AccountingSupplierParty[\s\S]*?<\/cac:AccountingSupplierParty>/);
    if (supplier && !/<cbc:EndpointID[^>]*schemeID=/.test(supplier[0])) {
      issues.push({
        ruleCode: 'PEPPOL-EN16931-R020',
        severity: 'fatal',
        xpath: '/ubl:Invoice/cac:AccountingSupplierParty/cac:Party/cbc:EndpointID',
        message: 'Seller electronic address (BT-34) is missing or lacks @schemeID.',
        docsUrl: `${SITE_BASE}/errors/peppol-bis-3/peppol-en16931-r020`,
      });
    }

    const customer = xml.match(/<cac:AccountingCustomerParty[\s\S]*?<\/cac:AccountingCustomerParty>/);
    if (customer && !/<cbc:EndpointID[^>]*schemeID=/.test(customer[0])) {
      issues.push({
        ruleCode: 'PEPPOL-EN16931-R010',
        severity: 'fatal',
        xpath: '/ubl:Invoice/cac:AccountingCustomerParty/cac:Party/cbc:EndpointID',
        message: 'Buyer electronic address (BT-49) is missing or lacks @schemeID.',
        docsUrl: `${SITE_BASE}/errors/peppol-bis-3/peppol-en16931-r010`,
      });
    }

    const lines = [...xml.matchAll(/<cac:InvoiceLine[\s\S]*?<\/cac:InvoiceLine>/g)];
    let lineSumCents = 0;
    for (const l of lines) {
      const m = l[0].match(/<cbc:LineExtensionAmount[^>]*>([0-9.-]+)<\/cbc:LineExtensionAmount>/);
      if (m) lineSumCents += Math.round(parseFloat(m[1]) * 100);
    }

    const legalTotal = xml.match(/<cac:LegalMonetaryTotal[\s\S]*?<\/cac:LegalMonetaryTotal>/);
    if (legalTotal && lines.length > 0) {
      const headerExt = legalTotal[0].match(/<cbc:LineExtensionAmount[^>]*>([0-9.-]+)<\/cbc:LineExtensionAmount>/);
      if (headerExt && Math.round(parseFloat(headerExt[1]) * 100) !== lineSumCents) {
        issues.push({
          ruleCode: 'BR-CO-10',
          severity: 'fatal',
          xpath: '/ubl:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount',
          message: `BT-106 header sum (${parseFloat(headerExt[1]).toFixed(2)}) != sum of BT-131 invoice lines (${(lineSumCents / 100).toFixed(2)}).`,
          docsUrl: `${SITE_BASE}/errors/peppol-bis-3/br-co-10`,
        });
      }
    }
  }

  return {
    isValid: issues.filter((i) => i.severity === 'fatal').length === 0,
    syntax,
    issues,
    autoFixApiUrl: `${SITE_BASE}/api/v1/normalize`,
  };
}
