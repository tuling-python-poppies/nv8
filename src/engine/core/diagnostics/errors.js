/**
 * Base diagnostic error class
 */
export class DiagnosticError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'DiagnosticError';
    this.code = code;
    this.phase = details.phase;
    this.context = details.context;
    this.suggestions = details.suggestions || [];
    this.limit = details.limit;
    this.actual = details.actual;
    this.required = details.required;
    this.timestamp = Date.now();
    this.details = Object.freeze({
      phase: this.phase,
      context: this.context,
      suggestions: this.suggestions,
      limit: this.limit,
      actual: this.actual,
      required: this.required,
    });
  }
}
