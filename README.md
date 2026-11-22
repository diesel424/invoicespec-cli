# invoicespec-cli — European E-Invoicing Schematron Validator & ERP JSON-to-XML Compiler (EN 16931 / Peppol BIS 3.0 / ZUGFeRD 2.3 / XRechnung 3.0 / Factur-X / KSeF / FatturaPA / RO e-Factura)

[![npm version](https://img.shields.io/npm/v/invoicespec-cli.svg)](https://www.npmjs.com/package/invoicespec-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://invoicespec.dev)

Zero-dependency **EN 16931**, **Peppol BIS Billing 3.0 (OASIS UBL 2.1)**, **ZUGFeRD 2.3 / Factur-X 1.07 (UN/CEFACT CII D16B)**, **XRechnung 3.0**, **Polish KSeF FA(2)**, **Italian FatturaPA SdI**, and **Romanian ANAF RO e-Factura** XML Validator for Node.js & CI/CD pipelines.

🔗 **Live Browser IDE Workbench, Hybrid PDF/A-3 Generator & 1,150+ Schematron Error Code Reference:**  
👉 **[https://invoicespec.dev](https://invoicespec.dev)**

---

## 1. Quick Start (CLI Validation in CI/CD)

```bash
npx invoicespec-cli ./invoice.xml
```

Every detected Schematron violation prints the exact failing XPath and a direct link to the side-by-side XML diff and deterministic fix guide:

| Rule Code | Standard | Description & Direct Fix Guide |
| :--- | :--- | :--- |
| **`BR-01`** | EN 16931 / Peppol 3.0 | [An Invoice shall have a Specification identifier (`cbc:CustomizationID` / BT-24)](https://invoicespec.dev/errors/peppol-bis-3/br-01) |
| **`BR-CO-10`** | EN 16931 / Peppol 3.0 | [Sum of Invoice line net amount (BT-106) must equal sum of all line net amounts (BT-131)](https://invoicespec.dev/errors/peppol-bis-3/br-co-10) |
| **`BR-S-08`** | EN 16931 / Peppol 3.0 | [Standard rate VAT category taxable amount (BT-116) must match sum of Standard rate lines](https://invoicespec.dev/errors/peppol-bis-3/br-s-08) |
| **`PEPPOL-EN16931-R008`** | Peppol BIS 3.0 | [Document MUST NOT contain empty XML elements](https://invoicespec.dev/errors/peppol-bis-3/peppol-en16931-r008) |
| **`PEPPOL-EN16931-R020`** | Peppol BIS 3.0 | [Seller electronic address (`cbc:EndpointID` / BT-34) MUST include a valid EAS `@schemeID`](https://invoicespec.dev/errors/peppol-bis-3/peppol-en16931-r020) |
| **`PEPPOL-EN16931-R010`** | Peppol BIS 3.0 | [Buyer electronic address (`cbc:EndpointID` / BT-49) MUST include a valid EAS `@schemeID`](https://invoicespec.dev/errors/peppol-bis-3/peppol-en16931-r010) |
| **`BR-DE-15`** | XRechnung 3.0 (DE) | [Buyer reference / Leitweg-ID (`cbc:BuyerReference` / BT-10) is strictly mandatory](https://invoicespec.dev/errors/xrechnung-3-0/br-de-15) |
| **`DE-R-015`** | Peppol Germany | [German Seller VAT or Tax Registration requirement](https://invoicespec.dev/errors/peppol-bis-3/de-r-015) |
| **`BR-CO-15`** | ZUGFeRD 2.3 (CII) | [GrandTotalAmount (BT-112) must equal TaxBasisTotalAmount (BT-109) + TaxTotalAmount (BT-110)](https://invoicespec.dev/errors/zugferd-2-3/br-co-15) |
| **`BR-FR-01`** | Factur-X 1.07 (FR) | [French Seller 9-digit SIREN identifier (BT-30) with `@schemeID="0002"` is mandatory](https://invoicespec.dev/errors/factur-x/br-fr-01) |
| **`KSEF-PL-NIP-01`** | KSeF FA(2) (PL) | [Polish Seller NIP must be an exact 10-digit tax identifier without PL prefix](https://invoicespec.dev/errors/ksef-fa-2/ksef-pl-nip-01) |
| **`FATTURAPA-IT-00311`** | FatturaPA 1.2.2 (IT) | [SdI Error 00311: Invalid 7-character `CodiceDestinatario`](https://invoicespec.dev/errors/fatturapa-1-2/fatturapa-it-00311) |
| **`RO-EFACTURA-BR-RO-010`** | RO e-Factura (RO) | [Romanian ANAF CIUS-RO CustomizationID & ISO 3166-2:RO County Codes](https://invoicespec.dev/errors/ro-efactura-cius/ro-efactura-br-ro-010) |
| **`BE-PEPPOL-R001-KBO`** | Belgium Peppol 2026 | [Belgian 10-digit KBO/BCE Enterprise Number with `@schemeID="0208"`](https://invoicespec.dev/errors/peppol-belgium-b2b/be-peppol-r001-kbo) |

---

## 2. ERP-to-E-Invoicing Field Crosswalk Guides (25 Production Matrices)

Need to map Stripe, Shopify, WooCommerce, SAP, Xero, QuickBooks, or DATEV webhooks into compliant XML? Browse our deterministic field-by-field XPath crosswalks:

- **[Shopify to ZUGFeRD 2.3 (CII XML) Crosswalk](https://invoicespec.dev/integrate/shopify-to-zugferd-xml)**
- **[Stripe Billing to Peppol BIS 3.0 (UBL 2.1) Crosswalk](https://invoicespec.dev/integrate/stripe-invoice-to-peppol-bis-3)**
- **[WooCommerce to German XRechnung 3.0 Crosswalk](https://invoicespec.dev/integrate/woocommerce-to-xrechnung)**
- **[SAP S/4HANA IDoc (`INVOIC02`) to Peppol BIS 3.0 Crosswalk](https://invoicespec.dev/integrate/sap-idoc-invoic02-to-peppol-bis-3)**
- **[Xero Accounting to Peppol BIS 3.0 Crosswalk](https://invoicespec.dev/integrate/xero-to-peppol-bis-3)**
- **[Intuit QuickBooks Online to Peppol BIS 3.0 Crosswalk](https://invoicespec.dev/integrate/quickbooks-online-to-peppol-bis-3)**
- **[DATEV Unternehmen online to XRechnung 3.0 Crosswalk](https://invoicespec.dev/integrate/datev-to-xrechnung-3-0)**
- **[Lexoffice to ZUGFeRD 2.3 Crosswalk](https://invoicespec.dev/integrate/lexoffice-to-zugferd-2-3)**
- **[Comarch ERP Optima / XL to Polish KSeF FA(2) Crosswalk](https://invoicespec.dev/integrate/comarch-erp-to-ksef-fa-2-xml)**
- **[Fatture in Cloud / TeamSystem to Italian FatturaPA SdI Crosswalk](https://invoicespec.dev/integrate/fatture-in-cloud-to-fatturapa-sdi)**
- **[SmartBill to Romanian ANAF RO e-Factura Crosswalk](https://invoicespec.dev/integrate/smartbill-to-ro-efactura-anaf)**
- **[Exact Online to Belgian B2B Peppol 2026 Crosswalk](https://invoicespec.dev/integrate/exact-online-to-peppol-belgium-2026)**

---

## 3. Programmatic Usage (Node.js / TypeScript)

```ts
import { validateInvoiceXml } from 'invoicespec-cli';

const report = validateInvoiceXml(xmlString);
if (!report.isValid) {
  console.log(report.issues);
}
```

## 4. REST API Auto-Remediation & JSON-to-XML Compilation

```bash
curl -X POST https://invoicespec.dev/api/v1/normalize \
  -H "Content-Type: application/json" \
  -d '{
    "action": "convert_json",
    "target_format": "peppol-ubl",
    "erp_json": { "object": "invoice", "number": "INV-2026-01", "currency": "eur" }
  }'
```
