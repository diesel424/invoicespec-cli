export interface ValidationIssue {
  ruleCode: string;
  severity: 'fatal' | 'warning';
  xpath: string;
  message: string;
  docsUrl: string;
}

export interface ValidationResult {
  isValid: boolean;
  syntax: 'UBL-2.1' | 'CII-D16B' | 'UNKNOWN';
  issues: ValidationIssue[];
  autoFixApiUrl?: string;
}

export declare function validateInvoiceXml(rawXml: string): ValidationResult;
