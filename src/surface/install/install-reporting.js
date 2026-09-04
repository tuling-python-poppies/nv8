import * as runtime from "../api/reporting/reporting-runtime.js";
import {
  REPORTING_SURFACES,
} from "../api/reporting/reporting-surface.js";
import {
  defineGlobalFunction,
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.reportingConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

export function installReporting() {
  do {
    delete (((runtime.reportingConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.reportingConstructors)[0])).name, (((runtime.reportingConstructors)[0])));
  } while (false);
do {
    delete (((runtime.reportingConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.reportingConstructors)[1])).name, (((runtime.reportingConstructors)[1])));
  } while (false);
do {
    delete (((runtime.reportingConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.reportingConstructors)[2])).name, (((runtime.reportingConstructors)[2])));
  } while (false);
do {
    delete (((runtime.reportingConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.reportingConstructors)[3])).name, (((runtime.reportingConstructors)[3])));
  } while (false);
  Object.setPrototypeOf(
    runtime.CSPViolationReportBody.prototype,
    runtime.ReportBody.prototype,
  );
  Object.setPrototypeOf(runtime.CSPViolationReportBody, runtime.ReportBody);
  Object.setPrototypeOf(
    runtime.IntegrityViolationReportBody.prototype,
    runtime.ReportBody.prototype,
  );
  Object.setPrototypeOf(
    runtime.IntegrityViolationReportBody,
    runtime.ReportBody,
  );
  do {
    {
  do {
    {
      const callback = {
        [("disconnect")](...args) {
          return runtime.reportingOperation(this, ("disconnect"), args);
        },
      }[("disconnect")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("disconnect"));
      definePrototypeMethod((constructors[("ReportingObserver")]).prototype, ("disconnect"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("observe")](...args) {
          return runtime.reportingOperation(this, ("observe"), args);
        },
      }[("observe")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("observe"));
      definePrototypeMethod((constructors[("ReportingObserver")]).prototype, ("observe"), callback);
    }
  } while (false);
do {
    {
      const callback = {
        [("takeRecords")](...args) {
          return runtime.reportingOperation(this, ("takeRecords"), args);
        },
      }[("takeRecords")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("takeRecords"));
      definePrototypeMethod((constructors[("ReportingObserver")]).prototype, ("takeRecords"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ReportingObserver")]).prototype, (constructors[("ReportingObserver")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ReportingObserver")]).prototype, (constructors[("ReportingObserver")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const callback = {
        [("toJSON")](...args) {
          return runtime.reportingOperation(this, ("toJSON"), args);
        },
      }[("toJSON")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("toJSON"));
      definePrototypeMethod((constructors[("ReportBody")]).prototype, ("toJSON"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("ReportBody")]).prototype, (constructors[("ReportBody")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("ReportBody")]).prototype, (constructors[("ReportBody")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("documentURL")]() { return runtime.reportingProperty(this, ("documentURL")); },
      }, ("documentURL")).get;
      registerNativeGetter(getter, ("documentURL"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("documentURL"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("referrer")]() { return runtime.reportingProperty(this, ("referrer")); },
      }, ("referrer")).get;
      registerNativeGetter(getter, ("referrer"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("referrer"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("blockedURL")]() { return runtime.reportingProperty(this, ("blockedURL")); },
      }, ("blockedURL")).get;
      registerNativeGetter(getter, ("blockedURL"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("blockedURL"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("effectiveDirective")]() { return runtime.reportingProperty(this, ("effectiveDirective")); },
      }, ("effectiveDirective")).get;
      registerNativeGetter(getter, ("effectiveDirective"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("effectiveDirective"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("originalPolicy")]() { return runtime.reportingProperty(this, ("originalPolicy")); },
      }, ("originalPolicy")).get;
      registerNativeGetter(getter, ("originalPolicy"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("originalPolicy"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("sourceFile")]() { return runtime.reportingProperty(this, ("sourceFile")); },
      }, ("sourceFile")).get;
      registerNativeGetter(getter, ("sourceFile"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("sourceFile"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("sample")]() { return runtime.reportingProperty(this, ("sample")); },
      }, ("sample")).get;
      registerNativeGetter(getter, ("sample"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("sample"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("disposition")]() { return runtime.reportingProperty(this, ("disposition")); },
      }, ("disposition")).get;
      registerNativeGetter(getter, ("disposition"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("disposition"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("statusCode")]() { return runtime.reportingProperty(this, ("statusCode")); },
      }, ("statusCode")).get;
      registerNativeGetter(getter, ("statusCode"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("statusCode"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("lineNumber")]() { return runtime.reportingProperty(this, ("lineNumber")); },
      }, ("lineNumber")).get;
      registerNativeGetter(getter, ("lineNumber"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("lineNumber"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("columnNumber")]() { return runtime.reportingProperty(this, ("columnNumber")); },
      }, ("columnNumber")).get;
      registerNativeGetter(getter, ("columnNumber"));
      definePrototypeGetter((constructors[("CSPViolationReportBody")]).prototype, ("columnNumber"), getter);
    }
  } while (false);
do {
    {
      const callback = {
        [("toJSON")](...args) {
          return runtime.reportingOperation(this, ("toJSON"), args);
        },
      }[("toJSON")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("toJSON"));
      definePrototypeMethod((constructors[("CSPViolationReportBody")]).prototype, ("toJSON"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("CSPViolationReportBody")]).prototype, (constructors[("CSPViolationReportBody")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("CSPViolationReportBody")]).prototype, (constructors[("CSPViolationReportBody")]).name);
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("documentURL")]() { return runtime.reportingProperty(this, ("documentURL")); },
      }, ("documentURL")).get;
      registerNativeGetter(getter, ("documentURL"));
      definePrototypeGetter((constructors[("IntegrityViolationReportBody")]).prototype, ("documentURL"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("blockedURL")]() { return runtime.reportingProperty(this, ("blockedURL")); },
      }, ("blockedURL")).get;
      registerNativeGetter(getter, ("blockedURL"));
      definePrototypeGetter((constructors[("IntegrityViolationReportBody")]).prototype, ("blockedURL"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("destination")]() { return runtime.reportingProperty(this, ("destination")); },
      }, ("destination")).get;
      registerNativeGetter(getter, ("destination"));
      definePrototypeGetter((constructors[("IntegrityViolationReportBody")]).prototype, ("destination"), getter);
    }
  } while (false);
do {
    {
      const getter = Object.getOwnPropertyDescriptor({
        get [("reportOnly")]() { return runtime.reportingProperty(this, ("reportOnly")); },
      }, ("reportOnly")).get;
      registerNativeGetter(getter, ("reportOnly"));
      definePrototypeGetter((constructors[("IntegrityViolationReportBody")]).prototype, ("reportOnly"), getter);
    }
  } while (false);
do {
    {
      const callback = {
        [("toJSON")](...args) {
          return runtime.reportingOperation(this, ("toJSON"), args);
        },
      }[("toJSON")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("toJSON"));
      definePrototypeMethod((constructors[("IntegrityViolationReportBody")]).prototype, ("toJSON"), callback);
    }
  } while (false);
do {
    {
      defineConstructorBacklink((constructors[("IntegrityViolationReportBody")]).prototype, (constructors[("IntegrityViolationReportBody")]));
    }
  } while (false);
do {
    {
      defineToStringTag((constructors[("IntegrityViolationReportBody")]).prototype, (constructors[("IntegrityViolationReportBody")]).name);
    }
  } while (false);
}
  } while (false);
  defineGlobalFunction("reportError", runtime.reportError);
}

