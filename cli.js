#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { validateInvoiceXml } from './index.mjs';

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
=======================================================================
 peppol-en16931-validator — EN 16931 / Peppol BIS 3.0 / ZUGFeRD CLI
 Powered by InvoiceSpec Hub (https://invoicespec.dev)
=======================================================================

Usage:
  npx peppol-en16931-validator <path-to-invoice.xml>

Online Auto-Remediation & Stripe/Shopify JSON-to-XML Converter:
  https://invoicespec.dev
`);
  process.exit(0);
}

const targetPath = path.resolve(process.cwd(), args[0]);
if (!fs.existsSync(targetPath)) {
  console.error(`[ERROR] File not found: ${targetPath}`);
  process.exit(1);
}

const xml = fs.readFileSync(targetPath, 'utf-8');
const result = validateInvoiceXml(xml);

console.log(`\nValidating: ${path.basename(targetPath)} (Syntax: ${result.syntax})`);
console.log('-----------------------------------------------------------------------');

if (result.isValid) {
  console.log('PASSED: 0 fatal EN 16931 / Peppol Schematron violations detected.');
  process.exit(0);
} else {
  console.error(`FAILED: ${result.issues.length} Schematron violation(s) detected:\n`);
  for (const issue of result.issues) {
    console.error(`  [${issue.ruleCode}] (${issue.severity.toUpperCase()})`);
    console.error(`  XPath   : ${issue.xpath}`);
    console.error(`  Reason  : ${issue.message}`);
    console.error(`  Fix URL : ${issue.docsUrl}\n`);
  }
  console.error('Auto-Fix this XML or convert ERP JSON online at:');
  console.error('-> https://invoicespec.dev/?utm_source=cli_validator\n');
  process.exit(1);
}
