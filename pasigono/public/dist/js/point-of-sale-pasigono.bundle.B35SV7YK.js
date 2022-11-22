(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // ../erpnext/node_modules/onscan.js/onscan.js
  var require_onscan = __commonJS({
    "../erpnext/node_modules/onscan.js/onscan.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory()) : global.onScan = factory();
      })(exports, function() {
        var onScan2 = {
          attachTo: function(oDomElement, oOptions) {
            if (oDomElement.scannerDetectionData !== void 0) {
              throw new Error("onScan.js is already initialized for DOM element " + oDomElement);
            }
            var oDefaults = {
              onScan: function(sScanned, iQty) {
              },
              onScanError: function(oDebug) {
              },
              onKeyProcess: function(sChar, oEvent) {
              },
              onKeyDetect: function(iKeyCode, oEvent) {
              },
              onPaste: function(sPasted, oEvent) {
              },
              keyCodeMapper: function(oEvent) {
                return onScan2.decodeKeyEvent(oEvent);
              },
              onScanButtonLongPress: function() {
              },
              scanButtonKeyCode: false,
              scanButtonLongPressTime: 500,
              timeBeforeScanTest: 100,
              avgTimeByChar: 30,
              minLength: 6,
              suffixKeyCodes: [9, 13],
              prefixKeyCodes: [],
              ignoreIfFocusOn: false,
              stopPropagation: false,
              preventDefault: false,
              captureEvents: false,
              reactToKeydown: true,
              reactToPaste: false,
              singleScanQty: 1
            };
            oOptions = this._mergeOptions(oDefaults, oOptions);
            oDomElement.scannerDetectionData = {
              options: oOptions,
              vars: {
                firstCharTime: 0,
                lastCharTime: 0,
                accumulatedString: "",
                testTimer: false,
                longPressTimeStart: 0,
                longPressed: false
              }
            };
            if (oOptions.reactToPaste === true) {
              oDomElement.addEventListener("paste", this._handlePaste, oOptions.captureEvents);
            }
            if (oOptions.scanButtonKeyCode !== false) {
              oDomElement.addEventListener("keyup", this._handleKeyUp, oOptions.captureEvents);
            }
            if (oOptions.reactToKeydown === true || oOptions.scanButtonKeyCode !== false) {
              oDomElement.addEventListener("keydown", this._handleKeyDown, oOptions.captureEvents);
            }
            return this;
          },
          detachFrom: function(oDomElement) {
            if (oDomElement.scannerDetectionData.options.reactToPaste) {
              oDomElement.removeEventListener("paste", this._handlePaste);
            }
            if (oDomElement.scannerDetectionData.options.scanButtonKeyCode !== false) {
              oDomElement.removeEventListener("keyup", this._handleKeyUp);
            }
            oDomElement.removeEventListener("keydown", this._handleKeyDown);
            oDomElement.scannerDetectionData = void 0;
            return;
          },
          getOptions: function(oDomElement) {
            return oDomElement.scannerDetectionData.options;
          },
          setOptions: function(oDomElement, oOptions) {
            switch (oDomElement.scannerDetectionData.options.reactToPaste) {
              case true:
                if (oOptions.reactToPaste === false) {
                  oDomElement.removeEventListener("paste", this._handlePaste);
                }
                break;
              case false:
                if (oOptions.reactToPaste === true) {
                  oDomElement.addEventListener("paste", this._handlePaste);
                }
                break;
            }
            switch (oDomElement.scannerDetectionData.options.scanButtonKeyCode) {
              case false:
                if (oOptions.scanButtonKeyCode !== false) {
                  oDomElement.addEventListener("keyup", this._handleKeyUp);
                }
                break;
              default:
                if (oOptions.scanButtonKeyCode === false) {
                  oDomElement.removeEventListener("keyup", this._handleKeyUp);
                }
                break;
            }
            oDomElement.scannerDetectionData.options = this._mergeOptions(oDomElement.scannerDetectionData.options, oOptions);
            this._reinitialize(oDomElement);
            return this;
          },
          decodeKeyEvent: function(oEvent) {
            var iCode = this._getNormalizedKeyNum(oEvent);
            switch (true) {
              case (iCode >= 48 && iCode <= 90):
              case (iCode >= 106 && iCode <= 111):
                if (oEvent.key !== void 0 && oEvent.key !== "") {
                  return oEvent.key;
                }
                var sDecoded = String.fromCharCode(iCode);
                switch (oEvent.shiftKey) {
                  case false:
                    sDecoded = sDecoded.toLowerCase();
                    break;
                  case true:
                    sDecoded = sDecoded.toUpperCase();
                    break;
                }
                return sDecoded;
              case (iCode >= 96 && iCode <= 105):
                return 0 + (iCode - 96);
            }
            return "";
          },
          simulate: function(oDomElement, mStringOrArray) {
            this._reinitialize(oDomElement);
            if (Array.isArray(mStringOrArray)) {
              mStringOrArray.forEach(function(mKey) {
                var oEventProps = {};
                if ((typeof mKey === "object" || typeof mKey === "function") && mKey !== null) {
                  oEventProps = mKey;
                } else {
                  oEventProps.keyCode = parseInt(mKey);
                }
                var oEvent = new KeyboardEvent("keydown", oEventProps);
                document.dispatchEvent(oEvent);
              });
            } else {
              this._validateScanCode(oDomElement, mStringOrArray);
            }
            return this;
          },
          _reinitialize: function(oDomElement) {
            var oVars = oDomElement.scannerDetectionData.vars;
            oVars.firstCharTime = 0;
            oVars.lastCharTime = 0;
            oVars.accumulatedString = "";
            return;
          },
          _isFocusOnIgnoredElement: function(oDomElement) {
            var ignoreSelectors = oDomElement.scannerDetectionData.options.ignoreIfFocusOn;
            if (!ignoreSelectors) {
              return false;
            }
            var oFocused = document.activeElement;
            if (Array.isArray(ignoreSelectors)) {
              for (var i = 0; i < ignoreSelectors.length; i++) {
                if (oFocused.matches(ignoreSelectors[i]) === true) {
                  return true;
                }
              }
            } else if (oFocused.matches(ignoreSelectors)) {
              return true;
            }
            return false;
          },
          _validateScanCode: function(oDomElement, sScanCode) {
            var oScannerData = oDomElement.scannerDetectionData;
            var oOptions = oScannerData.options;
            var iSingleScanQty = oScannerData.options.singleScanQty;
            var iFirstCharTime = oScannerData.vars.firstCharTime;
            var iLastCharTime = oScannerData.vars.lastCharTime;
            var oScanError = {};
            var oEvent;
            switch (true) {
              case sScanCode.length < oOptions.minLength:
                oScanError = {
                  message: "Receieved code is shorter then minimal length"
                };
                break;
              case iLastCharTime - iFirstCharTime > sScanCode.length * oOptions.avgTimeByChar:
                oScanError = {
                  message: "Receieved code was not entered in time"
                };
                break;
              default:
                oOptions.onScan.call(oDomElement, sScanCode, iSingleScanQty);
                oEvent = new CustomEvent("scan", {
                  detail: {
                    scanCode: sScanCode,
                    qty: iSingleScanQty
                  }
                });
                oDomElement.dispatchEvent(oEvent);
                onScan2._reinitialize(oDomElement);
                return true;
            }
            oScanError.scanCode = sScanCode;
            oScanError.scanDuration = iLastCharTime - iFirstCharTime;
            oScanError.avgTimeByChar = oOptions.avgTimeByChar;
            oScanError.minLength = oOptions.minLength;
            oOptions.onScanError.call(oDomElement, oScanError);
            oEvent = new CustomEvent("scanError", { detail: oScanError });
            oDomElement.dispatchEvent(oEvent);
            onScan2._reinitialize(oDomElement);
            return false;
          },
          _mergeOptions: function(oDefaults, oOptions) {
            var oExtended = {};
            var prop;
            for (prop in oDefaults) {
              if (Object.prototype.hasOwnProperty.call(oDefaults, prop)) {
                oExtended[prop] = oDefaults[prop];
              }
            }
            for (prop in oOptions) {
              if (Object.prototype.hasOwnProperty.call(oOptions, prop)) {
                oExtended[prop] = oOptions[prop];
              }
            }
            return oExtended;
          },
          _getNormalizedKeyNum: function(e) {
            return e.which || e.keyCode;
          },
          _handleKeyDown: function(e) {
            var iKeyCode = onScan2._getNormalizedKeyNum(e);
            var oOptions = this.scannerDetectionData.options;
            var oVars = this.scannerDetectionData.vars;
            var bScanFinished = false;
            if (oOptions.onKeyDetect.call(this, iKeyCode, e) === false) {
              return;
            }
            if (onScan2._isFocusOnIgnoredElement(this)) {
              return;
            }
            if (oOptions.scanButtonKeyCode !== false && iKeyCode == oOptions.scanButtonKeyCode) {
              if (!oVars.longPressed) {
                oVars.longPressTimer = setTimeout(oOptions.onScanButtonLongPress, oOptions.scanButtonLongPressTime, this);
                oVars.longPressed = true;
              }
              return;
            }
            switch (true) {
              case (oVars.firstCharTime && oOptions.suffixKeyCodes.indexOf(iKeyCode) !== -1):
                e.preventDefault();
                e.stopImmediatePropagation();
                bScanFinished = true;
                break;
              case (!oVars.firstCharTime && oOptions.prefixKeyCodes.indexOf(iKeyCode) !== -1):
                e.preventDefault();
                e.stopImmediatePropagation();
                bScanFinished = false;
                break;
              default:
                var character = oOptions.keyCodeMapper.call(this, e);
                if (character === null) {
                  return;
                }
                oVars.accumulatedString += character;
                if (oOptions.preventDefault) {
                  e.preventDefault();
                }
                if (oOptions.stopPropagation) {
                  e.stopImmediatePropagation();
                }
                bScanFinished = false;
                break;
            }
            if (!oVars.firstCharTime) {
              oVars.firstCharTime = Date.now();
            }
            oVars.lastCharTime = Date.now();
            if (oVars.testTimer) {
              clearTimeout(oVars.testTimer);
            }
            if (bScanFinished) {
              onScan2._validateScanCode(this, oVars.accumulatedString);
              oVars.testTimer = false;
            } else {
              oVars.testTimer = setTimeout(onScan2._validateScanCode, oOptions.timeBeforeScanTest, this, oVars.accumulatedString);
            }
            oOptions.onKeyProcess.call(this, character, e);
            return;
          },
          _handlePaste: function(e) {
            var oOptions = this.scannerDetectionData.options;
            var oVars = this.scannerDetectionData.vars;
            var sPasteString = (event.clipboardData || window.clipboardData).getData("text");
            if (onScan2._isFocusOnIgnoredElement(this)) {
              return;
            }
            e.preventDefault();
            if (oOptions.stopPropagation) {
              e.stopImmediatePropagation();
            }
            oOptions.onPaste.call(this, sPasteString, event);
            oVars.firstCharTime = 0;
            oVars.lastCharTime = 0;
            onScan2._validateScanCode(this, sPasteString);
            return;
          },
          _handleKeyUp: function(e) {
            if (onScan2._isFocusOnIgnoredElement(this)) {
              return;
            }
            var iKeyCode = onScan2._getNormalizedKeyNum(e);
            if (iKeyCode == this.scannerDetectionData.options.scanButtonKeyCode) {
              clearTimeout(this.scannerDetectionData.vars.longPressTimer);
              this.scannerDetectionData.vars.longPressed = false;
            }
            return;
          },
          isScanInProgressFor: function(oDomElement) {
            return oDomElement.scannerDetectionData.vars.firstCharTime > 0;
          },
          isAttachedTo: function(oDomElement) {
            return oDomElement.scannerDetectionData !== void 0;
          }
        };
        return onScan2;
      });
    }
  });

  // ../pasigono/node_modules/written-number/lib/util.js
  var require_util = __commonJS({
    "../pasigono/node_modules/written-number/lib/util.js"(exports) {
      "use strict";
      function defaults(target, defs) {
        if (target == null)
          target = {};
        var ret = {};
        var keys = Object.keys(defs);
        for (var i = 0, len = keys.length; i < len; i++) {
          var key = keys[i];
          ret[key] = target[key] || defs[key];
        }
        return ret;
      }
      exports.defaults = defaults;
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/en.json
  var require_en = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/en.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: "-",
        unitSeparator: "and ",
        base: {
          "0": "zero",
          "1": "one",
          "2": "two",
          "3": "three",
          "4": "four",
          "5": "five",
          "6": "six",
          "7": "seven",
          "8": "eight",
          "9": "nine",
          "10": "ten",
          "11": "eleven",
          "12": "twelve",
          "13": "thirteen",
          "14": "fourteen",
          "15": "fifteen",
          "16": "sixteen",
          "17": "seventeen",
          "18": "eighteen",
          "19": "nineteen",
          "20": "twenty",
          "30": "thirty",
          "40": "forty",
          "50": "fifty",
          "60": "sixty",
          "70": "seventy",
          "80": "eighty",
          "90": "ninety"
        },
        units: [
          "hundred",
          "thousand",
          "million",
          "billion",
          "trillion",
          "quadrillion",
          "quintillion",
          "sextillion",
          "septillion",
          "octillion",
          "nonillion",
          "decillion",
          "undecillion",
          "duodecillion",
          "tredecillion",
          "quattuordecillion",
          "quindecillion"
        ],
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/es.json
  var require_es = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/es.json"(exports, module) {
      module.exports = {
        useLongScale: true,
        baseSeparator: " y ",
        unitSeparator: "",
        base: {
          "0": "cero",
          "1": "uno",
          "2": "dos",
          "3": "tres",
          "4": "cuatro",
          "5": "cinco",
          "6": "seis",
          "7": "siete",
          "8": "ocho",
          "9": "nueve",
          "10": "diez",
          "11": "once",
          "12": "doce",
          "13": "trece",
          "14": "catorce",
          "15": "quince",
          "16": "diecis\xE9is",
          "17": "diecisiete",
          "18": "dieciocho",
          "19": "diecinueve",
          "20": "veinte",
          "21": "veintiuno",
          "22": "veintid\xF3s",
          "23": "veintitr\xE9s",
          "24": "veinticuatro",
          "25": "veinticinco",
          "26": "veintis\xE9is",
          "27": "veintisiete",
          "28": "veintiocho",
          "29": "veintinueve",
          "30": "treinta",
          "40": "cuarenta",
          "50": "cincuenta",
          "60": "sesenta",
          "70": "setenta",
          "80": "ochenta",
          "90": "noventa",
          "100": "cien",
          "200": "doscientos",
          "300": "trescientos",
          "400": "cuatrocientos",
          "500": "quinientos",
          "600": "seiscientos",
          "700": "setecientos",
          "800": "ochocientos",
          "900": "novecientos",
          "1000": "mil"
        },
        unitExceptions: {
          "1000000": "un mill\xF3n",
          "1000000000000": "un bill\xF3n",
          "1000000000000000000": "un trill\xF3n",
          "1000000000000000000000000": "un cuatrillones",
          "1000000000000000000000000000000": "un quintill\xF3n",
          "1000000000000000000000000000000000000": "un sextill\xF3n",
          "1000000000000000000000000000000000000000000": "un septill\xF3n",
          "1000000000000000000000000000000000000000000000000": "un octill\xF3n",
          "1000000000000000000000000000000000000000000000000000000": "un nonill\xF3n",
          "1000000000000000000000000000000000000000000000000000000000000": "un decill\xF3n",
          "1000000000000000000000000000000000000000000000000000000000000000000": "un undecill\xF3n",
          "1000000000000000000000000000000000000000000000000000000000000000000000000": "un duodecill\xF3n",
          "1000000000000000000000000000000000000000000000000000000000000000000000000000000": "un tredecill\xF3n",
          "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000": "un cuatordecill\xF3n",
          "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000": "un quindecill\xF3n"
        },
        units: [
          {
            singular: "ciento",
            useBaseInstead: true,
            useBaseException: [1],
            useBaseExceptionWhenNoTrailingNumbers: true
          },
          {
            singular: "mil",
            avoidPrefixException: [1]
          },
          {
            singular: "mill\xF3n",
            plural: "millones"
          },
          {
            singular: "bill\xF3n",
            plural: "billones"
          },
          {
            singular: "trill\xF3n",
            plural: "trillones"
          },
          {
            singular: "cuatrill\xF3n",
            plural: "cuatrillones"
          },
          {
            singular: "quintill\xF3n",
            plural: "quintillones"
          },
          {
            singular: "sextill\xF3n",
            plural: "sextillones"
          },
          {
            singular: "septill\xF3n",
            plural: "septillones"
          },
          {
            singular: "octill\xF3n",
            plural: "octillones"
          },
          {
            singular: "nonill\xF3n",
            plural: "nonillones"
          },
          {
            singular: "decill\xF3n",
            plural: "decillones"
          },
          {
            singular: "undecill\xF3n",
            plural: "undecillones"
          },
          {
            singular: "duodecill\xF3n",
            plural: "duodecillones"
          },
          {
            singular: "tredecill\xF3n",
            plural: "tredecillones"
          },
          {
            singular: "cuatrodecill\xF3n",
            plural: "cuatrodecillones"
          },
          {
            singular: "quindecill\xF3n",
            plural: "quindecillones"
          }
        ]
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/ar.json
  var require_ar = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/ar.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: "",
        unitSeparator: "",
        allSeparator: "\u0648",
        base: {
          "0": "\u0635\u0641\u0631",
          "1": "\u0648\u0627\u062D\u062F",
          "2": "\u0627\u062B\u0646\u0627\u0646",
          "3": "\u062B\u0644\u0627\u062B\u0629",
          "4": "\u0623\u0631\u0628\u0639\u0629",
          "5": "\u062E\u0645\u0633\u0629",
          "6": "\u0633\u062A\u0629",
          "7": "\u0633\u0628\u0639\u0629",
          "8": "\u062B\u0645\u0627\u0646\u064A\u0629",
          "9": "\u062A\u0633\u0639\u0629",
          "10": "\u0639\u0634\u0631\u0629",
          "11": "\u0623\u062D\u062F \u0639\u0634\u0631",
          "12": "\u0625\u062B\u0646\u0627 \u0639\u0634\u0631",
          "13": "\u062B\u0644\u0627\u062B\u0629 \u0639\u0634\u0631",
          "14": "\u0623\u0631\u0628\u0639\u0629 \u0639\u0634\u0631",
          "15": "\u062E\u0645\u0633\u0629 \u0639\u0634\u0631",
          "16": "\u0633\u062A\u0629 \u0639\u0634\u0631",
          "17": "\u0633\u0628\u0639\u0629 \u0639\u0634\u0631",
          "18": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0639\u0634\u0631",
          "19": "\u062A\u0633\u0639\u0629 \u0639\u0634\u0631",
          "20": "\u0639\u0634\u0631\u0648\u0646",
          "21": "\u0648\u0627\u062D\u062F \u0648\u0639\u0634\u0631\u0648\u0646",
          "22": "\u0627\u062B\u0646\u0627\u0646 \u0648\u0639\u0634\u0631\u0648\u0646",
          "23": "\u062B\u0644\u0627\u062B\u0629 \u0648\u0639\u0634\u0631\u0648\u0646",
          "24": "\u0623\u0631\u0628\u0639\u0629 \u0648\u0639\u0634\u0631\u0648\u0646",
          "25": "\u062E\u0645\u0633\u0629 \u0648\u0639\u0634\u0631\u0648\u0646",
          "26": "\u0633\u062A\u0629 \u0648\u0639\u0634\u0631\u0648\u0646",
          "27": "\u0633\u0628\u0639\u0629 \u0648\u0639\u0634\u0631\u0648\u0646",
          "28": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u0639\u0634\u0631\u0648\u0646",
          "29": "\u062A\u0633\u0639\u0629 \u0648\u0639\u0634\u0631\u0648\u0646",
          "30": "\u062B\u0644\u0627\u062B\u0648\u0646",
          "31": "\u0648\u0627\u062D\u062F \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "32": "\u0627\u062B\u0646\u0627\u0646 \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "33": "\u062B\u0644\u0627\u062B\u0629 \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "34": "\u0623\u0631\u0628\u0639\u0629 \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "35": "\u062E\u0645\u0633\u0629 \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "36": "\u0633\u062A\u0629 \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "37": "\u0633\u0628\u0639\u0629 \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "38": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "39": "\u062A\u0633\u0639\u0629 \u0648\u062B\u0644\u0627\u062B\u0648\u0646",
          "40": "\u0623\u0631\u0628\u0639\u0648\u0646",
          "41": "\u0648\u0627\u062D\u062F \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "42": "\u0627\u062B\u0646\u0627\u0646 \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "43": "\u062B\u0644\u0627\u062B\u0629 \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "44": "\u0623\u0631\u0628\u0639\u0629 \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "45": "\u062E\u0645\u0633\u0629 \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "46": "\u0633\u062A\u0629 \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "47": "\u0633\u0628\u0639\u0629 \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "48": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "49": "\u062A\u0633\u0639\u0629 \u0648\u0623\u0631\u0628\u0639\u0648\u0646",
          "50": "\u062E\u0645\u0633\u0648\u0646",
          "51": "\u0648\u0627\u062D\u062F \u0648\u062E\u0645\u0633\u0648\u0646",
          "52": "\u0627\u062B\u0646\u0627\u0646 \u0648\u062E\u0645\u0633\u0648\u0646",
          "53": "\u062B\u0644\u0627\u062B\u0629 \u0648\u062E\u0645\u0633\u0648\u0646",
          "54": "\u0623\u0631\u0628\u0639\u0629 \u0648\u062E\u0645\u0633\u0648\u0646",
          "55": "\u062E\u0645\u0633\u0629 \u0648\u062E\u0645\u0633\u0648\u0646",
          "56": "\u0633\u062A\u0629 \u0648\u062E\u0645\u0633\u0648\u0646",
          "57": "\u0633\u0628\u0639\u0629 \u0648\u062E\u0645\u0633\u0648\u0646",
          "58": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u062E\u0645\u0633\u0648\u0646",
          "59": "\u062A\u0633\u0639\u0629 \u0648\u062E\u0645\u0633\u0648\u0646",
          "60": "\u0633\u062A\u0648\u0646",
          "61": "\u0648\u0627\u062D\u062F \u0648\u0633\u062A\u0648\u0646",
          "62": "\u0627\u062B\u0646\u0627\u0646 \u0648\u0633\u062A\u0648\u0646",
          "63": "\u062B\u0644\u0627\u062B\u0629 \u0648\u0633\u062A\u0648\u0646",
          "64": "\u0623\u0631\u0628\u0639\u0629 \u0648\u0633\u062A\u0648\u0646",
          "65": "\u062E\u0645\u0633\u0629 \u0648\u0633\u062A\u0648\u0646",
          "66": "\u0633\u062A\u0629 \u0648\u0633\u062A\u0648\u0646",
          "67": "\u0633\u0628\u0639\u0629 \u0648\u0633\u062A\u0648\u0646",
          "68": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u0633\u062A\u0648\u0646",
          "69": "\u062A\u0633\u0639\u0629 \u0648\u0633\u062A\u0648\u0646",
          "70": "\u0633\u0628\u0639\u0648\u0646",
          "71": "\u0648\u0627\u062D\u062F \u0648\u0633\u0628\u0639\u0648\u0646",
          "72": "\u0627\u062B\u0646\u0627\u0646 \u0648\u0633\u0628\u0639\u0648\u0646",
          "73": "\u062B\u0644\u0627\u062B\u0629 \u0648\u0633\u0628\u0639\u0648\u0646",
          "74": "\u0623\u0631\u0628\u0639\u0629 \u0648\u0633\u0628\u0639\u0648\u0646",
          "75": "\u062E\u0645\u0633\u0629 \u0648\u0633\u0628\u0639\u0648\u0646",
          "76": "\u0633\u062A\u0629 \u0648\u0633\u0628\u0639\u0648\u0646",
          "77": "\u0633\u0628\u0639\u0629 \u0648\u0633\u0628\u0639\u0648\u0646",
          "78": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u0633\u0628\u0639\u0648\u0646",
          "79": "\u062A\u0633\u0639\u0629 \u0648\u0633\u0628\u0639\u0648\u0646",
          "80": "\u062B\u0645\u0627\u0646\u0648\u0646",
          "81": "\u0648\u0627\u062D\u062F \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "82": "\u0627\u062B\u0646\u0627\u0646 \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "83": "\u062B\u0644\u0627\u062B\u0629 \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "84": "\u0623\u0631\u0628\u0639\u0629 \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "85": "\u062E\u0645\u0633\u0629 \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "86": "\u0633\u062A\u0629 \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "87": "\u0633\u0628\u0639\u0629 \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "88": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "89": "\u062A\u0633\u0639\u0629 \u0648\u062B\u0645\u0627\u0646\u0648\u0646",
          "90": "\u062A\u0633\u0639\u0648\u0646",
          "91": "\u0648\u0627\u062D\u062F \u0648\u062A\u0633\u0639\u0648\u0646",
          "92": "\u0627\u062B\u0646\u0627\u0646 \u0648\u062A\u0633\u0639\u0648\u0646",
          "93": "\u062B\u0644\u0627\u062B\u0629 \u0648\u062A\u0633\u0639\u0648\u0646",
          "94": "\u0623\u0631\u0628\u0639\u0629 \u0648\u062A\u0633\u0639\u0648\u0646",
          "95": "\u062E\u0645\u0633\u0629 \u0648\u062A\u0633\u0639\u0648\u0646",
          "96": "\u0633\u062A\u0629 \u0648\u062A\u0633\u0639\u0648\u0646",
          "97": "\u0633\u0628\u0639\u0629 \u0648\u062A\u0633\u0639\u0648\u0646",
          "98": "\u062B\u0645\u0627\u0646\u064A\u0629 \u0648\u062A\u0633\u0639\u0648\u0646",
          "99": "\u062A\u0633\u0639\u0629 \u0648\u062A\u0633\u0639\u0648\u0646",
          "200": "\u0645\u0627\u0626\u062A\u0627\u0646",
          "300": "\u062B\u0644\u0627\u062B\u0645\u0627\u0626\u0629",
          "400": "\u0623\u0631\u0628\u0639\u0645\u0627\u0626\u0629",
          "500": "\u062E\u0645\u0633\u0645\u0627\u0626\u0629",
          "600": "\u0633\u062A\u0645\u0627\u0626\u0629",
          "700": "\u0633\u0628\u0639\u0645\u0627\u0626\u0629",
          "800": "\u062B\u0645\u0627\u0646\u0645\u0627\u0626\u0629",
          "900": "\u062A\u0633\u0639\u0645\u0627\u0626\u0629"
        },
        units: [
          { singular: "\u0645\u0627\u0626\u0629", useBaseInstead: true, useBaseException: [1] },
          { singular: "\u0623\u0644\u0641", dual: "\u0623\u0644\u0641\u0627\u0646", plural: "\u0622\u0644\u0627\u0641", restrictedPlural: true, avoidPrefixException: [1, 2] },
          { singular: "\u0645\u0644\u064A\u0648\u0646", dual: "\u0645\u0644\u064A\u0648\u0646\u0627\u0646", plural: "\u0645\u0644\u0627\u064A\u064A\u0646", restrictedPlural: true, avoidPrefixException: [1, 2] },
          { singular: "\u0645\u0644\u064A\u0627\u0631", dual: "\u0645\u0644\u064A\u0627\u0631\u0627\u0646", plural: "\u0645\u0644\u0627\u064A\u064A\u0631", restrictedPlural: true, avoidPrefixException: [1, 2] },
          { singular: "\u062A\u0631\u064A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0643\u0648\u0627\u062F\u0631\u064A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0643\u0648\u064A\u0646\u062A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0633\u0643\u0633\u062A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0633\u0628\u062A\u064A\u0644\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0623\u0648\u0643\u062A\u064A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0646\u0648\u0646\u064A\u0644\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u062F\u0634\u064A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0623\u0648\u0646\u062F\u0634\u064A\u0644\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u062F\u0648\u062F\u0634\u064A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u062A\u0631\u064A\u062F\u0634\u064A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0643\u0648\u0627\u062A\u0648\u0631\u062F\u0634\u064A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] },
          { singular: "\u0643\u0648\u064A\u0646\u062F\u0634\u064A\u0644\u064A\u0648\u0646", avoidPrefixException: [1] }
        ],
        unitExceptions: {}
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/az.json
  var require_az = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/az.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: " ",
        unitSeparator: "",
        base: {
          "0": "s\u0131f\u0131r",
          "1": "bir",
          "2": "iki",
          "3": "\xFC\xE7",
          "4": "d\xF6rd",
          "5": "be\u015F",
          "6": "alt\u0131",
          "7": "yeddi",
          "8": "s\u0259kkiz",
          "9": "doqquz",
          "10": "on",
          "20": "iyirmi",
          "30": "otuz",
          "40": "q\u0131rx",
          "50": "\u0259lli",
          "60": "altm\u0131\u015F",
          "70": "yetmi\u015F",
          "80": "s\u0259ks\u0259n",
          "90": "doxsan"
        },
        units: [
          {
            singular: "y\xFCz",
            avoidPrefixException: [1]
          },
          {
            singular: "min",
            avoidPrefixException: [1]
          },
          "milyon",
          "milyard",
          "trilyon",
          "kvadrilyon",
          "kentilyon",
          "sekstilyon",
          "septilyon",
          "oktilyon",
          "nonilyon",
          "desilyon",
          "andesilyon",
          "dodesilyon",
          "tredesilyon",
          "katordesilyon",
          "kendesilyon"
        ],
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/pt.json
  var require_pt = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/pt.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: " e ",
        unitSeparator: "e ",
        andWhenTrailing: true,
        base: {
          "0": "zero",
          "1": "um",
          "2": "dois",
          "3": "tr\xEAs",
          "4": "quatro",
          "5": "cinco",
          "6": "seis",
          "7": "sete",
          "8": "oito",
          "9": "nove",
          "10": "dez",
          "11": "onze",
          "12": "doze",
          "13": "treze",
          "14": "catorze",
          "15": "quinze",
          "16": "dezesseis",
          "17": "dezessete",
          "18": "dezoito",
          "19": "dezenove",
          "20": "vinte",
          "30": "trinta",
          "40": "quarenta",
          "50": "cinquenta",
          "60": "sessenta",
          "70": "setenta",
          "80": "oitenta",
          "90": "noventa",
          "100": "cem",
          "200": "duzentos",
          "300": "trezentos",
          "400": "quatrocentos",
          "500": "quinhentos",
          "600": "seiscentos",
          "700": "setecentos",
          "800": "oitocentos",
          "900": "novecentos",
          "1000": "mil"
        },
        unitExceptions: {
          "1": "um"
        },
        units: [
          {
            singular: "cento",
            useBaseInstead: true,
            useBaseException: [
              1
            ],
            useBaseExceptionWhenNoTrailingNumbers: true,
            andException: true
          },
          {
            singular: "mil",
            avoidPrefixException: [1],
            andException: true
          },
          {
            singular: "milh\xE3o",
            plural: "milh\xF5es"
          },
          {
            singular: "bilh\xE3o",
            plural: "bilh\xF5es"
          },
          {
            singular: "trilh\xE3o",
            plural: "trilh\xF5es"
          },
          {
            singular: "quadrilh\xE3o",
            plural: "quadrilh\xE3o"
          },
          {
            singular: "quintilh\xE3o",
            plural: "quintilh\xF5es"
          },
          {
            singular: "sextilh\xE3o",
            plural: "sextilh\xF5es"
          },
          {
            singular: "septilh\xE3o",
            plural: "septilh\xF5es"
          },
          {
            singular: "octilh\xE3o",
            plural: "octilh\xF5es"
          },
          {
            singular: "nonilh\xE3o",
            plural: "nonilh\xF5es"
          },
          {
            singular: "decilh\xE3o",
            plural: "decilh\xF5es"
          },
          {
            singular: "undecilh\xE3o",
            plural: "undecilh\xF5es"
          },
          {
            singular: "doudecilh\xE3o",
            plural: "doudecilh\xF5es"
          },
          {
            singular: "tredecilh\xE3o",
            plural: "tredecilh\xF5es"
          }
        ]
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/pt-PT.json
  var require_pt_PT = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/pt-PT.json"(exports, module) {
      module.exports = {
        useLongScale: true,
        baseSeparator: " e ",
        unitSeparator: "e ",
        andWhenTrailing: true,
        base: {
          "0": "zero",
          "1": "um",
          "2": "dois",
          "3": "tr\xEAs",
          "4": "quatro",
          "5": "cinco",
          "6": "seis",
          "7": "sete",
          "8": "oito",
          "9": "nove",
          "10": "dez",
          "11": "onze",
          "12": "doze",
          "13": "treze",
          "14": "catorze",
          "15": "quinze",
          "16": "dezasseis",
          "17": "dezassete",
          "18": "dezoito",
          "19": "dezanove",
          "20": "vinte",
          "30": "trinta",
          "40": "quarenta",
          "50": "cinquenta",
          "60": "sessenta",
          "70": "setenta",
          "80": "oitenta",
          "90": "noventa",
          "100": "cem",
          "200": "duzentos",
          "300": "trezentos",
          "400": "quatrocentos",
          "500": "quinhentos",
          "600": "seiscentos",
          "700": "setecentos",
          "800": "oitocentos",
          "900": "novecentos",
          "1000": "mil"
        },
        unitExceptions: {
          "1": "um"
        },
        units: [
          {
            singular: "cento",
            useBaseInstead: true,
            useBaseException: [
              1
            ],
            useBaseExceptionWhenNoTrailingNumbers: true,
            andException: true
          },
          {
            singular: "mil",
            avoidPrefixException: [1],
            andException: true
          },
          {
            singular: "milh\xE3o",
            plural: "milh\xF5es"
          },
          {
            singular: "bili\xE3o",
            plural: "bili\xF5es"
          },
          {
            singular: "trili\xE3o",
            plural: "trili\xF5es"
          },
          {
            singular: "quadrili\xE3o",
            plural: "quadrili\xF5es"
          },
          {
            singular: "quintili\xE3o",
            plural: "quintili\xF5es"
          },
          {
            singular: "sextili\xE3o",
            plural: "sextili\xF5es"
          },
          {
            singular: "septili\xE3o",
            plural: "septili\xF5es"
          },
          {
            singular: "octili\xE3o",
            plural: "octili\xF5es"
          },
          {
            singular: "nonili\xE3o",
            plural: "nonili\xF5es"
          },
          {
            singular: "decili\xE3o",
            plural: "decili\xF5es"
          }
        ]
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/fr.json
  var require_fr = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/fr.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: "-",
        unitSeparator: "",
        base: {
          "0": "z\xE9ro",
          "1": "un",
          "2": "deux",
          "3": "trois",
          "4": "quatre",
          "5": "cinq",
          "6": "six",
          "7": "sept",
          "8": "huit",
          "9": "neuf",
          "10": "dix",
          "11": "onze",
          "12": "douze",
          "13": "treize",
          "14": "quatorze",
          "15": "quinze",
          "16": "seize",
          "17": "dix-sept",
          "18": "dix-huit",
          "19": "dix-neuf",
          "20": "vingt",
          "30": "trente",
          "40": "quarante",
          "50": "cinquante",
          "60": "soixante",
          "70": "soixante-dix",
          "80": "quatre-vingt",
          "90": "quatre-vingt-dix"
        },
        units: [
          {
            singular: "cent",
            plural: "cents",
            avoidInNumberPlural: true,
            avoidPrefixException: [1]
          },
          {
            singular: "mille",
            avoidPrefixException: [1]
          },
          {
            singular: "million",
            plural: "millions"
          },
          {
            singular: "milliard",
            plural: "milliards"
          },
          {
            singular: "billion",
            plural: "billions"
          },
          {
            singular: "billiard",
            plural: "billiards"
          },
          {
            singular: "trillion",
            plural: "trillions"
          },
          {
            singular: "trilliard",
            plural: "trilliards"
          },
          {
            singular: "quadrillion",
            plural: "quadrillions"
          },
          {
            singular: "quadrilliard",
            plural: "quadrilliards"
          },
          {
            singular: "quintillion",
            plural: "quintillions"
          },
          {
            singular: "quintilliard",
            plural: "quintilliards"
          },
          {
            singular: "sextillion",
            plural: "sextillions"
          },
          {
            singular: "sextilliard",
            plural: "sextilliards"
          },
          {
            singular: "septillion",
            plural: "septillions"
          },
          {
            singular: "septilliard",
            plural: "septilliards"
          },
          {
            singular: "octillion",
            plural: "octillions"
          }
        ],
        unitExceptions: {
          "21": "vingt et un",
          "31": "trente et un",
          "41": "quarante et un",
          "51": "cinquante et un",
          "61": "soixante et un",
          "71": "soixante et onze",
          "72": "soixante-douze",
          "73": "soixante-treize",
          "74": "soixante-quatorze",
          "75": "soixante-quinze",
          "76": "soixante-seize",
          "77": "soixante-dix-sept",
          "78": "soixante-dix-huit",
          "79": "soixante-dix-neuf",
          "80": "quatre-vingts",
          "91": "quatre-vingt-onze",
          "92": "quatre-vingt-douze",
          "93": "quatre-vingt-treize",
          "94": "quatre-vingt-quatorze",
          "95": "quatre-vingt-quinze",
          "96": "quatre-vingt-seize",
          "97": "quatre-vingt-dix-sept",
          "98": "quatre-vingt-dix-huit",
          "99": "quatre-vingt-dix-neuf"
        }
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/eo.json
  var require_eo = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/eo.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: " ",
        unitSeparator: "",
        base: {
          "0": "nulo",
          "1": "unu",
          "2": "du",
          "3": "tri",
          "4": "kvar",
          "5": "kvin",
          "6": "ses",
          "7": "sep",
          "8": "ok",
          "9": "na\u016D",
          "10": "dek",
          "20": "dudek",
          "30": "tridek",
          "40": "kvardek",
          "50": "kvindek",
          "60": "sesdek",
          "70": "sepdek",
          "80": "okdek",
          "90": "na\u016Ddek",
          "100": "cent",
          "200": "ducent",
          "300": "tricent",
          "400": "kvarcent",
          "500": "kvincent",
          "600": "sescent",
          "700": "sepcent",
          "800": "okcent",
          "900": "na\u016Dcent"
        },
        units: [
          {
            useBaseInstead: true,
            useBaseException: []
          },
          {
            singular: "mil",
            avoidPrefixException: [1]
          },
          {
            singular: "miliono",
            plural: "milionoj",
            avoidPrefixException: [1]
          },
          {
            singular: "miliardo",
            plural: "miliardoj",
            avoidPrefixException: [1]
          },
          {
            singular: "biliono",
            plural: "bilionoj",
            avoidPrefixException: [1]
          }
        ],
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/it.json
  var require_it = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/it.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: "",
        unitSeparator: "",
        generalSeparator: "",
        wordSeparator: "",
        base: {
          "0": "zero",
          "1": "uno",
          "2": "due",
          "3": "tre",
          "4": "quattro",
          "5": "cinque",
          "6": "sei",
          "7": "sette",
          "8": "otto",
          "9": "nove",
          "10": "dieci",
          "11": "undici",
          "12": "dodici",
          "13": "tredici",
          "14": "quattordici",
          "15": "quindici",
          "16": "sedici",
          "17": "diciassette",
          "18": "diciotto",
          "19": "diciannove",
          "20": "venti",
          "21": "ventuno",
          "23": "ventitr\xE9",
          "28": "ventotto",
          "30": "trenta",
          "31": "trentuno",
          "33": "trentatr\xE9",
          "38": "trentotto",
          "40": "quaranta",
          "41": "quarantuno",
          "43": "quaranta\xADtr\xE9",
          "48": "quarantotto",
          "50": "cinquanta",
          "51": "cinquantuno",
          "53": "cinquantatr\xE9",
          "58": "cinquantotto",
          "60": "sessanta",
          "61": "sessantuno",
          "63": "sessanta\xADtr\xE9",
          "68": "sessantotto",
          "70": "settanta",
          "71": "settantuno",
          "73": "settantatr\xE9",
          "78": "settantotto",
          "80": "ottanta",
          "81": "ottantuno",
          "83": "ottantatr\xE9",
          "88": "ottantotto",
          "90": "novanta",
          "91": "novantuno",
          "93": "novantatr\xE9",
          "98": "novantotto",
          "100": "cento",
          "101": "centuno",
          "108": "centootto",
          "180": "centottanta",
          "201": "duecentuno",
          "301": "tre\xADcent\xADuno",
          "401": "quattro\xADcent\xADuno",
          "501": "cinque\xADcent\xADuno",
          "601": "sei\xADcent\xADuno",
          "701": "sette\xADcent\xADuno",
          "801": "otto\xADcent\xADuno",
          "901": "nove\xADcent\xADuno"
        },
        unitExceptions: {
          "1": "un"
        },
        units: [
          {
            singular: "cento",
            avoidPrefixException: [
              1
            ]
          },
          {
            singular: "mille",
            plural: "mila",
            avoidPrefixException: [
              1
            ]
          },
          {
            singular: "milione",
            plural: "milioni"
          },
          {
            singular: "miliardo",
            plural: "miliardi"
          },
          {
            singular: "bilione",
            plural: "bilioni"
          },
          {
            singular: "biliardo",
            plural: "biliardi"
          },
          {
            singular: "trilione",
            plural: "trilioni"
          },
          {
            singular: "triliardo",
            plural: "triliardi"
          },
          {
            singular: "quadrilione",
            plural: "quadrilioni"
          },
          {
            singular: "quadriliardo",
            plural: "quadriliardi"
          }
        ]
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/vi.json
  var require_vi = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/vi.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: " ",
        unitSeparator: "v\xE0 ",
        base: {
          "0": "kh\xF4ng",
          "1": "m\u1ED9t",
          "2": "hai",
          "3": "ba",
          "4": "b\u1ED1n",
          "5": "n\u0103m",
          "6": "s\xE1u",
          "7": "b\u1EA3y",
          "8": "t\xE1m",
          "9": "ch\xEDn",
          "10": "m\u01B0\u1EDDi",
          "15": "m\u01B0\u1EDDi l\u0103m",
          "20": "hai m\u01B0\u01A1i",
          "21": "hai m\u01B0\u01A1i m\u1ED1t",
          "25": "hai m\u01B0\u01A1i l\u0103m",
          "30": "ba m\u01B0\u01A1i",
          "31": "ba m\u01B0\u01A1i m\u1ED1t",
          "40": "b\u1ED1n m\u01B0\u01A1i",
          "41": "b\u1ED1n m\u01B0\u01A1i m\u1ED1t",
          "45": "b\u1ED1n m\u01B0\u01A1i l\u0103m",
          "50": "n\u0103m m\u01B0\u01A1i",
          "51": "n\u0103m m\u01B0\u01A1i m\u1ED1t",
          "55": "n\u0103m m\u01B0\u01A1i l\u0103m",
          "60": "s\xE1u m\u01B0\u01A1i",
          "61": "s\xE1u m\u01B0\u01A1i m\u1ED1t",
          "65": "s\xE1u m\u01B0\u01A1i l\u0103m",
          "70": "b\u1EA3y m\u01B0\u01A1i",
          "71": "b\u1EA3y m\u01B0\u01A1i m\u1ED1t",
          "75": "b\u1EA3y m\u01B0\u01A1i l\u0103m",
          "80": "t\xE1m m\u01B0\u01A1i",
          "81": "t\xE1m m\u01B0\u01A1i m\u1ED1t",
          "85": "t\xE1m m\u01B0\u01A1i l\u0103m",
          "90": "ch\xEDn m\u01B0\u01A1i",
          "91": "ch\xEDn m\u01B0\u01A1i m\u1ED1t",
          "95": "ch\xEDn m\u01B0\u01A1i l\u0103m"
        },
        units: [
          "tr\u0103m",
          "ng\xE0n",
          "tri\u1EC7u",
          "t\u1EF7",
          "ngh\xECn t\u1EF7"
        ],
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/tr.json
  var require_tr = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/tr.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: " ",
        unitSeparator: "",
        base: {
          "0": "s\u0131f\u0131r",
          "1": "bir",
          "2": "iki",
          "3": "\xFC\xE7",
          "4": "d\xF6rt",
          "5": "be\u015F",
          "6": "alt\u0131",
          "7": "yedi",
          "8": "sekiz",
          "9": "dokuz",
          "10": "on",
          "20": "yirmi",
          "30": "otuz",
          "40": "k\u0131rk",
          "50": "elli",
          "60": "altm\u0131\u015F",
          "70": "yetmi\u015F",
          "80": "seksen",
          "90": "doksan"
        },
        units: [
          {
            singular: "y\xFCz",
            avoidPrefixException: [1]
          },
          {
            singular: "bin",
            avoidPrefixException: [1]
          },
          "milyon",
          "milyar",
          "trilyon",
          "katrilyon",
          "kentilyon",
          "sekstilyon",
          "septilyon",
          "oktilyon",
          "nonilyon",
          "desilyon",
          "andesilyon",
          "dodesilyon",
          "tredesilyon",
          "katordesilyon",
          "kendesilyon"
        ],
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/hu.json
  var require_hu = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/hu.json"(exports, module) {
      module.exports = {
        useLongScale: true,
        baseSeparator: "",
        unitSeparator: "\xE9s ",
        base: {
          "0": "nulla",
          "1": "egy",
          "2": "kett\u0151",
          "3": "h\xE1rom",
          "4": "n\xE9gy",
          "5": "\xF6t",
          "6": "hat",
          "7": "h\xE9t",
          "8": "nyolc",
          "9": "kilenc",
          "10": "t\xEDz",
          "11": "tizenegy",
          "12": "tizenkett\u0151",
          "13": "tizenh\xE1rom",
          "14": "tizenn\xE9gy",
          "15": "tizen\xF6t",
          "16": "tizenhat",
          "17": "tizenh\xE9t",
          "18": "tizennyolc",
          "19": "tizenkilenc",
          "20": "h\xFAsz",
          "21": "huszonegy",
          "22": "huszonkett\u0151",
          "23": "huszonh\xE1rom",
          "24": "huszonn\xE9gy",
          "25": "huszon\xF6t",
          "26": "huszonhat",
          "27": "huszonh\xE9t",
          "28": "huszonnyolc",
          "29": "huszonkilenc",
          "30": "harminc",
          "40": "negyven",
          "50": "\xF6tven",
          "60": "hatvan",
          "70": "hetven",
          "80": "nyolcvan",
          "90": "kilencven",
          "100": "sz\xE1z",
          "200": "k\xE9tsz\xE1z",
          "300": "h\xE1romsz\xE1z",
          "400": "n\xE9gysz\xE1z",
          "500": "\xF6tsz\xE1z",
          "600": "hatsz\xE1z",
          "700": "h\xE9tsz\xE1z",
          "800": "nyolcsz\xE1z",
          "900": "kilencsz\xE1z",
          "1000": "ezer"
        },
        unitExceptions: {
          "1": "egy"
        },
        units: [
          {
            singular: "sz\xE1z",
            useBaseInstead: true,
            useBaseException: [1]
          },
          {
            singular: "ezer",
            avoidPrefixException: [1]
          },
          {
            singular: "milli\xF3",
            avoidPrefixException: [1]
          },
          {
            singular: "milli\xE1rd",
            avoidPrefixException: [1]
          },
          {
            singular: "-billi\xF3",
            avoidPrefixException: [1]
          },
          {
            singular: "billi\xE1rd",
            avoidPrefixException: [1]
          },
          {
            singular: "trilli\xF3",
            avoidPrefixException: [1]
          },
          {
            singular: "trilli\xE1rd",
            avoidPrefixException: [1]
          },
          {
            singular: "kvadrilli\xF3",
            avoidPrefixException: [1]
          },
          {
            singular: "kvadrilli\xE1rd",
            avoidPrefixException: [1]
          },
          {
            singular: "kvintilli\xF3",
            avoidPrefixException: [1]
          },
          {
            singular: "kvintilli\xE1rd",
            avoidPrefixException: [1]
          },
          {
            singular: "szextilli\xF3",
            avoidPrefixException: [1]
          },
          {
            singular: "szeptilli\xF3",
            avoidPrefixException: [1]
          },
          {
            singular: "oktilli\xF3",
            avoidPrefixException: [1]
          },
          {
            singular: "nonilli\xF3",
            avoidPrefixException: [1]
          }
        ]
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/en-indian.json
  var require_en_indian = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/en-indian.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: "-",
        unitSeparator: "and ",
        base: {
          "0": "zero",
          "1": "one",
          "2": "two",
          "3": "three",
          "4": "four",
          "5": "five",
          "6": "six",
          "7": "seven",
          "8": "eight",
          "9": "nine",
          "10": "ten",
          "11": "eleven",
          "12": "twelve",
          "13": "thirteen",
          "14": "fourteen",
          "15": "fifteen",
          "16": "sixteen",
          "17": "seventeen",
          "18": "eighteen",
          "19": "nineteen",
          "20": "twenty",
          "30": "thirty",
          "40": "forty",
          "50": "fifty",
          "60": "sixty",
          "70": "seventy",
          "80": "eighty",
          "90": "ninety"
        },
        units: {
          "2": "hundred",
          "3": "thousand",
          "5": "lakh",
          "7": "crore"
        },
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/uk.json
  var require_uk = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/uk.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: " ",
        unitSeparator: "",
        base: {
          "0": "\u043D\u0443\u043B\u044C",
          "1": "\u043E\u0434\u0438\u043D",
          "2": "\u0434\u0432\u0430",
          "3": "\u0442\u0440\u0438",
          "4": "\u0447\u043E\u0442\u0438\u0440\u0438",
          "5": "\u043F\u2019\u044F\u0442\u044C",
          "6": "\u0448\u0456\u0441\u0442\u044C",
          "7": "\u0441\u0456\u043C",
          "8": "\u0432\u0456\u0441\u0456\u043C",
          "9": "\u0434\u0435\u0432\u2019\u044F\u0442\u044C",
          "10": "\u0434\u0435\u0441\u044F\u0442\u044C",
          "11": "\u043E\u0434\u0438\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "12": "\u0434\u0432\u0430\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "13": "\u0442\u0440\u0438\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "14": "\u0447\u043E\u0442\u0438\u0440\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "15": "\u043F\u2019\u044F\u0442\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "16": "\u0448\u0456\u0441\u0442\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "17": "\u0441\u0456\u043C\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "18": "\u0432\u0456\u0441\u0456\u043C\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "19": "\u0434\u0435\u0432\u2019\u044F\u0442\u043D\u0430\u0434\u0446\u044F\u0442\u044C",
          "20": "\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C",
          "30": "\u0442\u0440\u0438\u0434\u0446\u044F\u0442\u044C",
          "40": "\u0441\u043E\u0440\u043E\u043A",
          "50": "\u043F\u2019\u044F\u0442\u0434\u0435\u0441\u044F\u0442",
          "60": "\u0448\u0456\u0441\u0442\u0434\u0435\u0441\u044F\u0442",
          "70": "\u0441\u0456\u043C\u0434\u0435\u0441\u044F\u0442",
          "80": "\u0432\u0456\u0441\u0456\u043C\u0434\u0435\u0441\u044F\u0442",
          "90": "\u0434\u0435\u0432\u2019\u044F\u043D\u043E\u0441\u0442\u043E",
          "100": "\u0441\u0442\u043E",
          "200": "\u0434\u0432\u0456\u0441\u0442\u0456",
          "300": "\u0442\u0440\u0438\u0441\u0442\u0430",
          "400": "\u0447\u043E\u0442\u0438\u0440\u0438\u0441\u0442\u0430",
          "500": "\u043F\u2019\u044F\u0442\u0441\u043E\u0442",
          "600": "\u0448\u0456\u0441\u0442\u0441\u043E\u0442",
          "700": "\u0441\u0456\u043C\u0441\u043E\u0442",
          "800": "\u0432\u0456\u0441\u0456\u043C\u0441\u043E\u0442",
          "900": "\u0434\u0435\u0432\u2019\u044F\u0442\u0441\u043E\u0442"
        },
        alternativeBase: {
          feminine: {
            "1": "\u043E\u0434\u043D\u0430",
            "2": "\u0434\u0432\u0456"
          }
        },
        units: [
          {
            useBaseInstead: true,
            useBaseException: []
          },
          {
            singular: "\u0442\u0438\u0441\u044F\u0447\u0430",
            few: "\u0442\u0438\u0441\u044F\u0447\u0456",
            plural: "\u0442\u0438\u0441\u044F\u0447",
            useAlternativeBase: "feminine",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043C\u0456\u043B\u044C\u0439\u043E\u043D",
            few: "\u043C\u0456\u043B\u044C\u0439\u043E\u043D\u0438",
            plural: "\u043C\u0456\u043B\u044C\u0439\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043C\u0456\u043B\u044C\u044F\u0440\u0434",
            few: "\u043C\u0456\u043B\u044C\u044F\u0440\u0434\u0438",
            plural: "\u043C\u0456\u043B\u044C\u044F\u0440\u0434\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0442\u0440\u0438\u043B\u044C\u0439\u043E\u043D",
            few: "\u0442\u0440\u0438\u043B\u044C\u0439\u043E\u043D\u0438",
            plural: "\u0442\u0440\u0438\u043B\u044C\u0439\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043A\u0432\u0430\u0434\u0440\u0438\u043B\u044C\u0439\u043E\u043D",
            few: "\u043A\u0432\u0430\u0434\u0440\u0438\u043B\u044C\u0439\u043E\u043D\u0438",
            plural: "\u043A\u0432\u0430\u0434\u0440\u0438\u043B\u044C\u0439\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043A\u0432\u0456\u043D\u0442\u0438\u043B\u044C\u0439\u043E\u043D",
            few: "\u043A\u0432\u0456\u043D\u0442\u0438\u043B\u044C\u0439\u043E\u043D\u0438",
            plural: "\u043A\u0432\u0456\u043D\u0442\u0438\u043B\u044C\u0439\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0441\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u0439\u043E\u043D",
            few: "\u0441\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u0439\u043E\u043D\u0438",
            plural: "\u0441\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u0439\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0441\u0435\u043F\u0442\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u0441\u0435\u043F\u0442\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u0441\u0435\u043F\u0442\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043E\u043A\u0442\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u043E\u043A\u0442\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u043E\u043A\u0442\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043D\u043E\u043D\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u043D\u043E\u043D\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u043D\u043E\u043D\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0443\u043D\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u0443\u043D\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u0443\u043D\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0434\u0443\u043E\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u0434\u0443\u043E\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u0434\u0443\u043E\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0442\u0440\u0435\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u0442\u0440\u0435\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u0442\u0440\u0435\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043A\u0432\u0430\u0442\u0443\u043E\u0440\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u043A\u0432\u0430\u0442\u0443\u043E\u0440\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u043A\u0432\u0430\u0442\u0443\u043E\u0440\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043A\u0432\u0456\u043D\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D",
            few: "\u043A\u0432\u0456\u043D\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0438",
            plural: "\u043A\u0432\u0456\u043D\u0434\u0435\u0446\u0456\u043B\u043B\u0456\u043E\u043D\u0456\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          }
        ],
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/ru.json
  var require_ru = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/ru.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: " ",
        unitSeparator: "",
        base: {
          "0": "\u043D\u043E\u043B\u044C",
          "1": "\u043E\u0434\u0438\u043D",
          "2": "\u0434\u0432\u0430",
          "3": "\u0442\u0440\u0438",
          "4": "\u0447\u0435\u0442\u044B\u0440\u0435",
          "5": "\u043F\u044F\u0442\u044C",
          "6": "\u0448\u0435\u0441\u0442\u044C",
          "7": "\u0441\u0435\u043C\u044C",
          "8": "\u0432\u043E\u0441\u0435\u043C\u044C",
          "9": "\u0434\u0435\u0432\u044F\u0442\u044C",
          "10": "\u0434\u0435\u0441\u044F\u0442\u044C",
          "11": "\u043E\u0434\u0438\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "12": "\u0434\u0432\u0435\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "13": "\u0442\u0440\u0438\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "14": "\u0447\u0435\u0442\u044B\u0440\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "15": "\u043F\u044F\u0442\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "16": "\u0448\u0435\u0441\u0442\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "17": "\u0441\u0435\u043C\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "18": "\u0432\u043E\u0441\u0435\u043C\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "19": "\u0434\u0435\u0432\u044F\u0442\u043D\u0430\u0434\u0446\u0430\u0442\u044C",
          "20": "\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C",
          "30": "\u0442\u0440\u0438\u0434\u0446\u0430\u0442\u044C",
          "40": "\u0441\u043E\u0440\u043E\u043A",
          "50": "\u043F\u044F\u0442\u044C\u0434\u0435\u0441\u044F\u0442",
          "60": "\u0448\u0435\u0441\u0442\u044C\u0434\u0435\u0441\u044F\u0442",
          "70": "\u0441\u0435\u043C\u044C\u0434\u0435\u0441\u044F\u0442",
          "80": "\u0432\u043E\u0441\u0435\u043C\u044C\u0434\u0435\u0441\u044F\u0442",
          "90": "\u0434\u0435\u0432\u044F\u043D\u043E\u0441\u0442\u043E",
          "100": "\u0441\u0442\u043E",
          "200": "\u0434\u0432\u0435\u0441\u0442\u0438",
          "300": "\u0442\u0440\u0438\u0441\u0442\u0430",
          "400": "\u0447\u0435\u0442\u044B\u0440\u0435\u0441\u0442\u0430",
          "500": "\u043F\u044F\u0442\u044C\u0441\u043E\u0442",
          "600": "\u0448\u0435\u0441\u0442\u044C\u0441\u043E\u0442",
          "700": "\u0441\u0435\u043C\u044C\u0441\u043E\u0442",
          "800": "\u0432\u043E\u0441\u0435\u043C\u044C\u0441\u043E\u0442",
          "900": "\u0434\u0435\u0432\u044F\u0442\u044C\u0441\u043E\u0442"
        },
        alternativeBase: {
          feminine: {
            "1": "\u043E\u0434\u043D\u0430",
            "2": "\u0434\u0432\u0435"
          }
        },
        units: [
          {
            useBaseInstead: true,
            useBaseException: []
          },
          {
            singular: "\u0442\u044B\u0441\u044F\u0447\u0430",
            few: "\u0442\u044B\u0441\u044F\u0447\u0438",
            plural: "\u0442\u044B\u0441\u044F\u0447",
            useAlternativeBase: "feminine",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043C\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u043C\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u043C\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043C\u0438\u043B\u043B\u0438\u0430\u0440\u0434",
            few: "\u043C\u0438\u043B\u043B\u0438\u0430\u0440\u0434\u0430",
            plural: "\u043C\u0438\u043B\u043B\u0438\u0430\u0440\u0434\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0442\u0440\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u0442\u0440\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u0442\u0440\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043A\u0432\u0430\u0434\u0440\u0438\u043B\u044C\u043E\u043D",
            few: "\u043A\u0432\u0430\u0434\u0440\u0438\u043B\u043B\u0438\u043E\u043D",
            plural: "\u043A\u0432\u0430\u0434\u0440\u0438\u043B\u043E\u043D",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043A\u0432\u0438\u043D\u0442\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u043A\u0432\u0438\u043D\u0442\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u043A\u0432\u0438\u043D\u0442\u0438\u043B\u044C\u043E\u043D\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0441\u0435\u043A\u0441\u0442\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432",
            few: "\u0441\u0435\u043A\u0441\u0442\u0438\u043B\u044C\u043E\u043D\u0430",
            plural: "\u0441\u0435\u043A\u0441\u0442\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0441\u0435\u043F\u0442\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u0441\u0435\u043F\u0442\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u0441\u0435\u043F\u0442\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043E\u043A\u0442\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u043E\u043A\u0442\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u043E\u043A\u0442\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043D\u043E\u043D\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u043D\u043E\u043D\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u043D\u043E\u043D\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u043E\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0443\u043D\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u0443\u043D\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u0443\u043D\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0438\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0434\u0443\u043E\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u0434\u0443\u043E\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u0434\u0443\u043E\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0438\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u0442\u0440\u0435\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u0442\u0440\u0435\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u0442\u0440\u0435\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0438\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043A\u0432\u0430\u0442\u0443\u043E\u0440\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u043A\u0432\u0430\u0442\u0443\u043E\u0440\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u043A\u0432\u0430\u0442\u0443\u043E\u0440\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0438\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          },
          {
            singular: "\u043A\u0432\u0438\u043D\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D",
            few: "\u043A\u0432\u0438\u043D\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0430",
            plural: "\u043A\u0432\u0438\u043D\u0434\u0435\u0446\u0438\u043B\u043B\u0438\u043E\u043D\u0438\u0432",
            useSingularEnding: true,
            useFewEnding: true,
            avoidEndingRules: [11, 12, 13, 14, 111, 112, 113, 114, 211, 212, 213, 214, 311, 312, 313, 314, 411, 412, 413, 414, 511, 512, 513, 514, 611, 612, 613, 614, 711, 712, 713, 714, 811, 812, 813, 814, 911, 912, 913, 914]
          }
        ],
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/i18n/id.json
  var require_id = __commonJS({
    "../pasigono/node_modules/written-number/lib/i18n/id.json"(exports, module) {
      module.exports = {
        useLongScale: false,
        baseSeparator: " ",
        unitSeparator: "",
        base: {
          "0": "nol",
          "1": "satu",
          "2": "dua",
          "3": "tiga",
          "4": "empat",
          "5": "lima",
          "6": "enam",
          "7": "tujuh",
          "8": "delapan",
          "9": "sembilan",
          "10": "sepuluh",
          "11": "sebelas",
          "12": "dua belas",
          "13": "tiga belas",
          "14": "empat belas",
          "15": "lima belas",
          "16": "enam belas",
          "17": "tujuh belas",
          "18": "delapan belas",
          "19": "sembilan belas",
          "20": "dua puluh",
          "30": "tiga puluh",
          "40": "empat puluh",
          "50": "lima puluh",
          "60": "enam puluh",
          "70": "tujuh puluh",
          "80": "delapan puluh",
          "90": "sembilan puluh"
        },
        units: [
          {
            singular: "seratus",
            plural: "ratus",
            avoidPrefixException: [1]
          },
          {
            singular: "seribu",
            plural: "ribu",
            avoidPrefixException: [1]
          },
          "juta",
          "miliar",
          "triliun",
          "kuadiliun"
        ],
        unitExceptions: []
      };
    }
  });

  // ../pasigono/node_modules/written-number/lib/index.js
  var require_lib = __commonJS({
    "../pasigono/node_modules/written-number/lib/index.js"(exports, module) {
      "use strict";
      exports = module.exports = writtenNumber2;
      var util = require_util();
      var languages = ["en", "es", "ar", "az", "pt", "fr", "eo", "it", "vi", "tr", "uk", "ru", "id"];
      var i18n = {
        en: require_en(),
        es: require_es(),
        ar: require_ar(),
        az: require_az(),
        pt: require_pt(),
        ptPT: require_pt_PT(),
        fr: require_fr(),
        eo: require_eo(),
        it: require_it(),
        vi: require_vi(),
        tr: require_tr(),
        hu: require_hu(),
        enIndian: require_en_indian(),
        uk: require_uk(),
        ru: require_ru(),
        id: require_id()
      };
      exports.i18n = i18n;
      var shortScale = [100];
      for (i = 1; i <= 16; i++) {
        shortScale.push(Math.pow(10, i * 3));
      }
      var i;
      var longScale = [100, 1e3];
      for (i = 1; i <= 15; i++) {
        longScale.push(Math.pow(10, i * 6));
      }
      writtenNumber2.defaults = {
        noAnd: false,
        alternativeBase: null,
        lang: "en"
      };
      function writtenNumber2(n, options) {
        options = options || {};
        options = util.defaults(options, writtenNumber2.defaults);
        if (n < 0) {
          return "";
        }
        n = Math.round(+n);
        var language = typeof options.lang === "string" ? i18n[options.lang] : options.lang;
        if (!language) {
          if (languages.indexOf(writtenNumber2.defaults.lang) < 0) {
            writtenNumber2.defaults.lang = "en";
          }
          language = i18n[writtenNumber2.defaults.lang];
        }
        var scale = language.useLongScale ? longScale : shortScale;
        var units = language.units;
        var unit;
        if (!(units instanceof Array)) {
          var rawUnits = units;
          units = [];
          scale = Object.keys(rawUnits);
          for (var i2 in scale) {
            units.push(rawUnits[scale[i2]]);
            scale[i2] = Math.pow(10, parseInt(scale[i2]));
          }
        }
        var baseCardinals = language.base;
        var alternativeBaseCardinals = options.alternativeBase ? language.alternativeBase[options.alternativeBase] : {};
        if (language.unitExceptions[n])
          return language.unitExceptions[n];
        if (alternativeBaseCardinals[n])
          return alternativeBaseCardinals[n];
        if (baseCardinals[n])
          return baseCardinals[n];
        if (n < 100)
          return handleSmallerThan100(n, language, unit, baseCardinals, alternativeBaseCardinals, options);
        var m = n % 100;
        var ret = [];
        if (m) {
          if (options.noAnd && !(language.andException && language.andException[10])) {
            ret.push(writtenNumber2(m, options));
          } else {
            ret.push(language.unitSeparator + writtenNumber2(m, options));
          }
        }
        var firstSignificant;
        for (var i2 = 0, len = units.length; i2 < len; i2++) {
          var r = Math.floor(n / scale[i2]);
          var divideBy;
          if (i2 === len - 1)
            divideBy = 1e6;
          else
            divideBy = scale[i2 + 1] / scale[i2];
          r %= divideBy;
          unit = units[i2];
          if (!r)
            continue;
          firstSignificant = scale[i2];
          if (unit.useBaseInstead) {
            var shouldUseBaseException = unit.useBaseException.indexOf(r) > -1 && (unit.useBaseExceptionWhenNoTrailingNumbers ? i2 === 0 && ret.length : true);
            if (!shouldUseBaseException) {
              ret.push(alternativeBaseCardinals[r * scale[i2]] || baseCardinals[r * scale[i2]]);
            } else {
              ret.push(r > 1 && unit.plural ? unit.plural : unit.singular);
            }
            continue;
          }
          var str;
          if (typeof unit === "string") {
            str = unit;
          } else if (r === 1 || unit.useSingularEnding && r % 10 === 1 && (!unit.avoidEndingRules || unit.avoidEndingRules.indexOf(r) < 0)) {
            str = unit.singular;
          } else if (unit.few && (r > 1 && r < 5 || unit.useFewEnding && r % 10 > 1 && r % 10 < 5 && (!unit.avoidEndingRules || unit.avoidEndingRules.indexOf(r) < 0))) {
            str = unit.few;
          } else {
            str = unit.plural && (!unit.avoidInNumberPlural || !m) ? unit.plural : unit.singular;
            str = r === 2 && unit.dual ? unit.dual : str;
            str = r > 10 && unit.restrictedPlural ? unit.singular : str;
          }
          if (unit.avoidPrefixException && unit.avoidPrefixException.indexOf(r) > -1) {
            ret.push(str);
            continue;
          }
          var exception = language.unitExceptions[r];
          var number = exception || writtenNumber2(r, util.defaults({
            noAnd: !(language.andException && language.andException[r] || unit.andException) && true,
            alternativeBase: unit.useAlternativeBase
          }, options));
          n -= r * scale[i2];
          ret.push(number + " " + str);
        }
        var firstSignificantN = firstSignificant * Math.floor(n / firstSignificant);
        var rest = n - firstSignificantN;
        if (language.andWhenTrailing && firstSignificant && 0 < rest && ret[0].indexOf(language.unitSeparator) !== 0) {
          ret = [ret[0], language.unitSeparator.replace(/\s+$/, "")].concat(ret.slice(1));
        }
        if (language.allSeparator) {
          for (var j = 0; j < ret.length - 1; j++) {
            ret[j] = language.allSeparator + ret[j];
          }
        }
        var result = ret.reverse().join(" ");
        return result;
      }
      function handleSmallerThan100(n, language, unit, baseCardinals, alternativeBaseCardinals, options) {
        var dec = Math.floor(n / 10) * 10;
        unit = n - dec;
        if (unit) {
          return alternativeBaseCardinals[dec] || baseCardinals[dec] + language.baseSeparator + writtenNumber2(unit, options);
        }
        return alternativeBaseCardinals[dec] || baseCardinals[dec];
      }
    }
  });

  // ../pasigono/pasigono/custom_scripts/stripe_terminal/stripe_terminal.js
  erpnext.PointOfSale.StripeTerminal = function() {
    var connectiontoken = "";
    var terminal;
    var loading_dialog, connecting_dialog, message_dilaog, confirm_dialog;
    var payment_object, is_online;
    var me = this;
    this.assign_stripe_connection_token = function(payment, is_online2) {
      payment_object = payment;
      is_online2 = is_online2;
      show_loading_modal("Connecting to Stripe Terminal", "Please Wait<br>Connecting to Stripe Terminal");
      frappe.dom.freeze();
      frappe.call({
        method: "pasigono.pasigono.api.get_stripe_terminal_token",
        freeze: true,
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        callback: function(r) {
          frappe.dom.unfreeze();
          if (r.message) {
            connectiontoken = r.message.secret;
            terminal = StripeTerminal.create({
              onFetchConnectionToken: fetchConnectionToken,
              onUnexpectedReaderDisconnect: unexpectedDisconnect
            });
            connect_to_stripe_terminal(payment, is_online2);
          } else {
            show_error_dialog("Please configure the stripe settings.");
          }
        }
      });
    };
    function fetchConnectionToken() {
      return connectiontoken;
    }
    function show_loading_modal(title, message) {
      loading_dialog = new frappe.ui.Dialog({
        title,
        fields: [
          {
            label: "",
            fieldname: "show_dialog",
            fieldtype: "HTML"
          }
        ]
      });
      var html = '<div style="min-height:200px;position: relative;text-align: center;padding-top: 75px;line-height: 25px;font-size: 15px;">';
      html += '<div style="">' + message + "</div>";
      html += "</div>";
      loading_dialog.fields_dict.show_dialog.$wrapper.html(html);
      loading_dialog.show();
    }
    function unexpectedDisconnect() {
      frappe.msgprint("Error: Stripe terminal unexpectedly disconnected. Please reload page");
    }
    function connect_to_stripe_terminal(payment, is_online2) {
      frappe.dom.freeze();
      frappe.call({
        method: "pasigono.pasigono.api.get_stripe_terminal_settings",
        freeze: true,
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        callback: function(r) {
          frappe.dom.unfreeze();
          var isSimulated = false;
          var testCardNumber = "";
          var testCardtype = "";
          if (r.message != void 0) {
            if (r.message.enable_test_mode == 1) {
              isSimulated = true;
              testCardNumber = r.message.card_number;
              testCardtype = r.message.card_type;
            }
          }
          var config = {
            simulated: isSimulated
          };
          terminal.discoverReaders(config).then(function(discoverResult) {
            if (discoverResult.error) {
              connecting_dialog.hide();
              show_error_dialog("No Stripe readers found.");
            } else if (discoverResult.discoveredReaders.length === 0) {
              connecting_dialog.hide();
              show_error_dialog("No Stripe readers found.");
            } else {
              var devices = "";
              for (let x in discoverResult.discoveredReaders) {
                devices = devices + "\n" + discoverResult.discoveredReaders[x].label;
              }
              var d = new frappe.ui.Dialog({
                "fields": [
                  { "fieldname": "stripe_readers", "fieldtype": "Select", "reqd": 1, "label": "Stripe Reader", "options": devices }
                ],
                primary_action: function() {
                  var selected = d.get_values().stripe_readers;
                  var selectedReader;
                  for (let x in discoverResult.discoveredReaders) {
                    if (discoverResult.discoveredReaders[x].label == selected) {
                      selectedReader = discoverResult.discoveredReaders[x];
                      d.hide();
                    }
                  }
                  terminal.connectReader(selectedReader).then(function(connectResult) {
                    if (connectResult.error) {
                      connecting_dialog.hide();
                      show_error_dialog("Failed to connect." + connectResult.error.message);
                    } else {
                      if (r.message.enable_test_mode == 1 && testCardNumber != "" && testCardtype != "") {
                        terminal.setSimulatorConfiguration({
                          "testCardNumber": testCardNumber,
                          "testPaymentMethod": testCardtype
                        });
                      }
                      loading_dialog.hide();
                    }
                  });
                },
                secondary_action: function() {
                  frappe.msgprint("Please disable Stripe Terminal in the POS Profile.");
                  d.hide();
                },
                secondary_action_label: "Cancel",
                title: "Select a Stripe Terminal device"
              });
              d.show();
            }
          });
        }
      });
    }
    this.display_details = async function(payment) {
      var frm = payment.frm.doc;
      var items = [];
      var taxes = Math.round(payment.frm.doc.total_taxes_and_charges * 100);
      var total = Math.round(payment.frm.doc.grand_total * 100);
      var currency = payment.frm.doc.currency;
      frm.items.forEach(function(row) {
        var amount = row.amount * 100;
        var item = {
          "description": row.item_name,
          "quantity": Math.round(row.qty),
          "amount": Math.round(amount)
        };
        items.push(item);
      });
      await terminal.clearReaderDisplay();
      terminal.setReaderDisplay({
        type: "cart",
        cart: {
          line_items: items,
          tax: taxes,
          total,
          currency
        }
      });
    };
    this.collecting_payments = function(payment, is_online2) {
      if (payment.frm.doc.is_return == 1) {
        confirm_dialog = new frappe.ui.Dialog({
          title: "Confirm, refund through Stripe",
          fields: [
            {
              label: "",
              fieldname: "show_dialog",
              fieldtype: "HTML"
            }
          ],
          primary_action_label: "Confirm",
          primary_action(values) {
            confirm_dialog.hide();
            refund_payment(payment, is_online2);
          },
          secondary_action_label: "Cancel",
          secondary_action(values) {
            confirm_dialog.hide();
          }
        });
        var html = '<div style="text-align: center;">Please confirm. Refund of ' + payment.frm.doc.currency.toUpperCase() + " ";
        html += payment.frm.doc.grand_total * -1 + " through stripe.</div>";
        confirm_dialog.fields_dict.show_dialog.$wrapper.html(html);
        confirm_dialog.show();
      } else {
        create_payment(payment, is_online2);
      }
    };
    function refund_payment(payment, is_online2) {
      show_loading_modal("Refunding Payments", "Please Wait<br>Refunding Payments");
      frappe.dom.freeze();
      var payments = payment.frm.doc.payments;
      payments.forEach(function(row) {
        if (row.mode_of_payment == window.stripe_mode_of_payment) {
          frappe.call({
            method: "pasigono.pasigono.api.refund_payment",
            freeze: true,
            args: {
              "payment_intent_id": row.card_payment_intent,
              "amount": row.base_amount.toFixed(2) * -100
            },
            headers: {
              "X-Requested-With": "XMLHttpRequest"
            },
            callback: function(result) {
              loading_dialog.hide();
              frappe.dom.unfreeze();
              if (is_online2) {
                payment.frm.savesubmit().then((sales_invoice) => {
                  if (sales_invoice && sales_invoice.doc) {
                    payment.frm.doc.docstatus = sales_invoice.doc.docstatus;
                    frappe.show_alert({
                      indicator: "green",
                      message: __(`POS invoice ${sales_invoice.doc.name} created succesfully`)
                    });
                    payment.toggle_components(false);
                    payment.order_summary.toggle_component(true);
                    payment.order_summary.load_summary_of(payment.frm.doc, true);
                  }
                });
              } else {
                payment.payment.events.submit_invoice();
              }
            }
          });
        }
      });
    }
    function create_payment(payment, is_online2) {
      show_loading_modal("Collecting Payments", "Please Wait<br>Collecting Payments");
      frappe.dom.freeze();
      frappe.call({
        method: "pasigono.pasigono.api.payment_intent_creation",
        freeze: true,
        args: {
          "sales_invoice": payment.frm.doc
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        callback: function(r) {
          terminal.collectPaymentMethod(r.message.client_secret).then(function(result) {
            if (result.error) {
              loading_dialog.hide();
              show_payment_error_dialog(result.error.message);
            } else {
              terminal.processPayment(result.paymentIntent).then(function(result2) {
                if (result2.error) {
                  loading_dialog.hide();
                  show_payment_error_dialog(result2.error.message);
                } else if (result2.paymentIntent) {
                  loading_dialog.hide();
                  confirm_dialog = new frappe.ui.Dialog({
                    title: "Confirm Stripe Payment",
                    fields: [
                      {
                        label: "",
                        fieldname: "show_dialog",
                        fieldtype: "HTML"
                      }
                    ],
                    primary_action_label: "Confirm",
                    primary_action(values) {
                      capture_payment(payment, is_online2, result2.paymentIntent);
                    },
                    secondary_action_label: "Cancel",
                    secondary_action(values) {
                      cancel_payment(payment, is_online2, result2.paymentIntent);
                    }
                  });
                  var html = '<div style="text-align: center;">Please confirm. Payment of ' + result2.paymentIntent.currency.toUpperCase() + " ";
                  html += result2.paymentIntent.amount / 100 + " through stripe.</div>";
                  confirm_dialog.fields_dict.show_dialog.$wrapper.html(html);
                  confirm_dialog.show();
                }
              });
            }
          });
        }
      });
    }
    function cancel_payment(payment, is_online2, payment_intent) {
      confirm_dialog.hide();
      var canceling_dialog = new frappe.ui.Dialog({
        title: "Canceling Stripe Terminal",
        fields: [
          {
            label: "",
            fieldname: "show_dialog",
            fieldtype: "HTML"
          }
        ]
      });
      var html = '<div style="min-height:200px;position: relative;text-align: center;padding-top: 75px;line-height: 25px;font-size: 15px;">';
      html += '<div style="">Please Wait<br>Canceling Stripe Terminal</div>';
      html += "</div>";
      canceling_dialog.fields_dict.show_dialog.$wrapper.html(html);
      canceling_dialog.show();
      frappe.call({
        method: "pasigono.pasigono.api.cancel_payment_intent",
        freeze: true,
        args: {
          "payment_intent_id": payment_intent.id,
          "sales_invoice_id": payment.frm.doc.name
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        callback: function(intent_result) {
          frappe.dom.unfreeze();
          canceling_dialog.hide();
          frappe.msgprint("Stripe payment cancelled.");
        }
      });
    }
    function capture_payment(payment, is_online2, payment_intent) {
      confirm_dialog.hide();
      show_loading_modal("COllecting Payments", "Please Wait<br>Collecting Payments");
      frappe.call({
        method: "pasigono.pasigono.api.capture_payment_intent",
        freeze: true,
        args: {
          "payment_intent_id": payment_intent.id,
          "sales_invoice_id": payment.frm.doc.name
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        callback: function(intent_result) {
          frappe.dom.unfreeze();
          loading_dialog.hide();
          var payments = payment.frm.doc.payments;
          payments.forEach(function(row) {
            if (row.mode_of_payment == window.stripe_mode_of_payment) {
              var card_info = intent_result.message.charges.data[0].payment_method_details.card_present;
              row.card_brand = card_info.brand;
              row.card_last4 = card_info.last4;
              row.card_account_type = card_info.receipt.account_type;
              row.card_application_preferred_name = card_info.receipt.application_preferred_name;
              row.card_dedicated_file_name = card_info.receipt.dedicated_file_name;
              row.card_authorization_response_code = card_info.receipt.authorization_response_code;
              row.card_application_cryptogram = card_info.receipt.application_cryptogram;
              row.card_terminal_verification_results = card_info.receipt.terminal_verification_results;
              row.card_transaction_status_information = card_info.receipt.transaction_status_information;
              row.card_authorization_code = card_info.receipt.authorization_code;
              row.card_charge_id = intent_result.message.charges.data[0].id;
              row.card_payment_intent = intent_result.message.charges.data[0].payment_intent;
            }
          });
          if (is_online2) {
            payment.frm.savesubmit().then((sales_invoice) => {
              if (window.open_cash_drawer_automatically == 1) {
                payment.payment.events.open_cash_drawer();
              }
              if (window.automatically_print == 1) {
                payment.payment.events.raw_print(this.frm);
              }
              if (sales_invoice && sales_invoice.doc) {
                payment.frm.doc.docstatus = sales_invoice.doc.docstatus;
                frappe.show_alert({
                  indicator: "green",
                  message: __(`POS invoice ${sales_invoice.doc.name} created succesfully`)
                });
                frappe.call({
                  method: "pasigono.pasigono.api.update_payment_intent",
                  freeze: true,
                  args: {
                    "payment_intent_id": payment_intent.id,
                    "sales_invoice_id": sales_invoice.doc.name
                  },
                  headers: {
                    "X-Requested-With": "XMLHttpRequest"
                  },
                  callback: function(intent_result2) {
                    payment.toggle_components(false);
                    payment.order_summary.toggle_component(true);
                    payment.order_summary.load_summary_of(payment.frm.doc, true);
                  }
                });
              }
            });
          } else {
            payment.payment.events.submit_invoice();
          }
        }
      });
    }
    function retry_stripe_terminal(me2, payment_object2, is_online2) {
      message_dilaog.hide();
      me2.collecting_payments(payment_object2, is_online2);
    }
    function change_payment_method() {
      message_dilaog.hide();
      $(".num-col.brand-primary").click();
    }
    function show_error_dialog(message) {
      message_dilaog = new frappe.ui.Dialog({
        title: "Message",
        fields: [
          {
            label: "",
            fieldname: "show_dialog",
            fieldtype: "HTML"
          }
        ],
        primary_action_label: "Retry",
        primary_action(values) {
          retry_stripe_terminal(me);
          message_dilaog.hide();
        }
      });
      var html = "<p>" + message + "</p>";
      message_dilaog.fields_dict.show_dialog.$wrapper.html(html);
      message_dilaog.show();
    }
    function show_payment_error_dialog(message) {
      message_dilaog = new frappe.ui.Dialog({
        title: "Message",
        fields: [
          {
            label: "",
            fieldname: "show_dialog",
            fieldtype: "HTML"
          }
        ],
        primary_action_label: "Retry",
        secondary_action_label: "Change Payment Mode",
        primary_action(values) {
          retry_stripe_terminal(me, payment_object, is_online);
        },
        secondary_action(values) {
          change_payment_method();
        }
      });
      var html = "<p>" + message + "</p>";
      message_dilaog.fields_dict.show_dialog.$wrapper.html(html);
      message_dilaog.show();
    }
  };

  // ../pasigono/pasigono/pos_assets/pos_item_selector.js
  var import_onscan = __toESM(require_onscan());
  erpnext.PointOfSale.ItemSelector = class {
    constructor({ frm, wrapper, events, pos_profile, settings }) {
      this.wrapper = wrapper;
      this.events = events;
      this.pos_profile = pos_profile;
      this.hide_images = settings.hide_images;
      this.auto_add_item = settings.auto_add_item_to_cart;
      this.inti_component();
    }
    inti_component() {
      this.prepare_dom();
      this.make_search_bar();
      this.load_items_data();
      this.bind_events();
      this.attach_shortcuts();
    }
    prepare_dom() {
      this.wrapper.append(`<section class="items-selector">
				<div class="filter-section">
					<div class="label">${__("All Items")}</div>
					<div class="search-field"></div>
					<div class="item-group-field"></div>
				</div>
				<div class="items-container"></div>
			</section>`);
      this.$component = this.wrapper.find(".items-selector");
      this.$items_container = this.$component.find(".items-container");
    }
    async load_items_data() {
      if (!this.item_group) {
        const res = await frappe.db.get_value("Item Group", { lft: 1, is_group: 1 }, "name");
        this.parent_item_group = res.message.name;
      }
      if (!this.price_list) {
        const res = await frappe.db.get_value("POS Profile", this.pos_profile, "selling_price_list");
        this.price_list = res.message.selling_price_list;
      }
      this.get_items({}).then(({ message }) => {
        this.render_item_list(message.items);
      });
    }
    get_items({ start = 0, page_length = 40, search_term = "" }) {
      const doc = this.events.get_frm().doc;
      const price_list = doc && doc.selling_price_list || this.price_list;
      let { item_group, pos_profile } = this;
      console.log({ "this": this });
      console.log({ "item_group": item_group, "pos_profile": pos_profile });
      !item_group && (item_group = this.parent_item_group);
      return frappe.call({
        method: "erpnext.selling.page.point_of_sale.point_of_sale.get_items",
        freeze: true,
        args: { start, page_length, price_list, item_group, search_term, pos_profile }
      });
    }
    render_item_list(items) {
      this.$items_container.html("");
      items.forEach((item) => {
        const item_html = this.get_item_html(item);
        this.$items_container.append(item_html);
      });
    }
    get_item_html(item) {
      const me = this;
      const { item_image, serial_no, batch_no, barcode, actual_qty, stock_uom, price_list_rate } = item;
      const precision2 = flt(price_list_rate, 2) % 1 != 0 ? 2 : 0;
      let indicator_color;
      let qty_to_display = actual_qty;
      if (item.is_stock_item) {
        indicator_color = actual_qty > 10 ? "green" : actual_qty <= 0 ? "red" : "orange";
        if (Math.round(qty_to_display) > 999) {
          qty_to_display = Math.round(qty_to_display) / 1e3;
          qty_to_display = qty_to_display.toFixed(1) + "K";
        }
      } else {
        indicator_color = "";
        qty_to_display = "";
      }
      function get_item_image_html() {
        if (!me.hide_images && item_image) {
          return `<div class="item-qty-pill">
							<span class="indicator-pill whitespace-nowrap ${indicator_color}">${qty_to_display}</span>
						</div>
						<div class="flex items-center justify-center h-32 border-b-grey text-6xl text-grey-100">
							<img
								onerror="cur_pos.item_selector.handle_broken_image(this)"
								class="h-full" src="${item_image}"
								alt="${frappe.get_abbr(item.item_name)}"
								style="object-fit: cover;">
						</div>`;
        } else {
          return `<div class="item-qty-pill">
							<span class="indicator-pill whitespace-nowrap ${indicator_color}">${qty_to_display}</span>
						</div>
						<div class="item-display abbr">${frappe.get_abbr(item.item_name)}</div>`;
        }
      }
      return `<div class="item-wrapper"
				data-item-code="${escape(item.item_code)}" data-serial-no="${escape(serial_no)}"
				data-batch-no="${escape(batch_no)}" data-uom="${escape(stock_uom)}"
				data-rate="${escape(price_list_rate || 0)}"
				title="${item.item_name}">

				${get_item_image_html()}

				<div class="item-detail">
					<div class="item-name">
						${frappe.ellipsis(item.item_name, 18)}
					</div>
					<div class="item-rate">${format_currency(price_list_rate, item.currency, precision2) || 0}</div>
				</div>
			</div>`;
    }
    handle_broken_image($img) {
      const item_abbr = $($img).attr("alt");
      $($img).parent().replaceWith(`<div class="item-display abbr">${item_abbr}</div>`);
    }
    make_search_bar() {
      const me = this;
      const doc = me.events.get_frm().doc;
      this.$component.find(".search-field").html("");
      this.$component.find(".item-group-field").html("");
      this.search_field = frappe.ui.form.make_control({
        df: {
          label: __("Search"),
          fieldtype: "Data",
          placeholder: __("Search by item code, serial number or barcode")
        },
        parent: this.$component.find(".search-field"),
        render_input: true
      });
      this.item_group_field = frappe.ui.form.make_control({
        df: {
          label: __("Item Group"),
          fieldtype: "Link",
          options: "Item Group",
          placeholder: __("Select item group"),
          onchange: function() {
            me.item_group = this.value;
            !me.item_group && (me.item_group = me.parent_item_group);
            me.filter_items();
          },
          get_query: function() {
            return {
              query: "erpnext.selling.page.point_of_sale.point_of_sale.item_group_query",
              filters: {
                pos_profile: doc ? doc.pos_profile : ""
              }
            };
          }
        },
        parent: this.$component.find(".item-group-field"),
        render_input: true
      });
      this.search_field.toggle_label(false);
      this.item_group_field.toggle_label(false);
      this.attach_clear_btn();
    }
    attach_clear_btn() {
      this.search_field.$wrapper.find(".control-input").append(`<span class="link-btn" style="top: 2px;">
				<a class="btn-open no-decoration" title="${__("Clear")}">
					${frappe.utils.icon("close", "sm")}
				</a>
			</span>`);
      this.$clear_search_btn = this.search_field.$wrapper.find(".link-btn");
      this.$clear_search_btn.on("click", "a", () => {
        this.set_search_value("");
        this.search_field.set_focus();
      });
    }
    set_search_value(value) {
      $(this.search_field.$input[0]).val(value).trigger("input");
    }
    bind_events() {
      const me = this;
      window.onScan = import_onscan.default;
      import_onscan.default.decodeKeyEvent = function(oEvent) {
        var iCode = this._getNormalizedKeyNum(oEvent);
        switch (true) {
          case (iCode >= 48 && iCode <= 90):
          case (iCode >= 106 && iCode <= 111):
          case (iCode >= 160 && iCode <= 164 || iCode == 170):
          case (iCode >= 186 && iCode <= 194):
          case (iCode >= 219 && iCode <= 222):
          case iCode == 32:
            if (oEvent.key !== void 0 && oEvent.key !== "") {
              return oEvent.key;
            }
            var sDecoded = String.fromCharCode(iCode);
            switch (oEvent.shiftKey) {
              case false:
                sDecoded = sDecoded.toLowerCase();
                break;
              case true:
                sDecoded = sDecoded.toUpperCase();
                break;
            }
            return sDecoded;
          case (iCode >= 96 && iCode <= 105):
            return 0 + (iCode - 96);
        }
        return "";
      };
      import_onscan.default.attachTo(document, {
        onScan: (sScancode) => {
          if (this.search_field && this.$component.is(":visible")) {
            this.search_field.set_focus();
            this.set_search_value(sScancode);
            this.barcode_scanned = true;
          }
        }
      });
      this.$component.on("click", ".item-wrapper", function() {
        const $item = $(this);
        const item_code = unescape($item.attr("data-item-code"));
        let batch_no = unescape($item.attr("data-batch-no"));
        let serial_no = unescape($item.attr("data-serial-no"));
        let uom = unescape($item.attr("data-uom"));
        let rate = unescape($item.attr("data-rate"));
        batch_no = batch_no === "undefined" ? void 0 : batch_no;
        serial_no = serial_no === "undefined" ? void 0 : serial_no;
        uom = uom === "undefined" ? void 0 : uom;
        rate = rate === "undefined" ? void 0 : rate;
        me.events.item_selected({
          field: "qty",
          value: "+1",
          item: { item_code, batch_no, serial_no, uom, rate }
        });
        me.search_field.set_focus();
      });
      this.search_field.$input.on("input", (e) => {
        clearTimeout(this.last_search);
        this.last_search = setTimeout(() => {
          const search_term = e.target.value;
          this.filter_items({ search_term });
        }, 300);
        this.$clear_search_btn.toggle(Boolean(this.search_field.$input.val()));
      });
      this.search_field.$input.on("focus", () => {
        this.$clear_search_btn.toggle(Boolean(this.search_field.$input.val()));
      });
    }
    attach_shortcuts() {
      const ctrl_label = frappe.utils.is_mac() ? "\u2318" : "Ctrl";
      this.search_field.parent.attr("title", `${ctrl_label}+I`);
      frappe.ui.keys.add_shortcut({
        shortcut: "ctrl+i",
        action: () => this.search_field.set_focus(),
        condition: () => this.$component.is(":visible"),
        description: __("Focus on search input"),
        ignore_inputs: true,
        page: cur_page.page.page
      });
      this.item_group_field.parent.attr("title", `${ctrl_label}+G`);
      frappe.ui.keys.add_shortcut({
        shortcut: "ctrl+g",
        action: () => this.item_group_field.set_focus(),
        condition: () => this.$component.is(":visible"),
        description: __("Focus on Item Group filter"),
        ignore_inputs: true,
        page: cur_page.page.page
      });
      frappe.ui.keys.on("enter", () => {
        const selector_is_visible = this.$component.is(":visible");
        if (!selector_is_visible || this.search_field.get_value() === "")
          return;
        if (this.items.length == 1) {
          this.$items_container.find(".item-wrapper").click();
          frappe.utils.play_sound("submit");
          this.set_search_value("");
        } else if (this.items.length == 0 && this.barcode_scanned) {
          frappe.show_alert({
            message: __("No items found. Scan barcode again."),
            indicator: "orange"
          });
          frappe.utils.play_sound("error");
          this.barcode_scanned = false;
          this.set_search_value("");
        }
      });
    }
    filter_items({ search_term = "" } = {}) {
      if (search_term) {
        search_term = search_term.toLowerCase();
        this.search_index = this.search_index || {};
        if (this.search_index[search_term]) {
          const items = this.search_index[search_term];
          this.items = items;
          this.render_item_list(items);
          this.auto_add_item && this.items.length == 1 && this.add_filtered_item_to_cart();
          return;
        }
      }
      this.get_items({ search_term }).then(({ message }) => {
        const { items, serial_no, batch_no, barcode } = message;
        if (search_term && !barcode) {
          this.search_index[search_term] = items;
        }
        this.items = items;
        this.render_item_list(items);
        this.auto_add_item && this.items.length == 1 && this.add_filtered_item_to_cart();
      });
    }
    add_filtered_item_to_cart() {
      this.$items_container.find(".item-wrapper").click();
      this.set_search_value("");
    }
    resize_selector(minimize) {
      minimize ? this.$component.find(".filter-section").css("grid-template-columns", "repeat(1, minmax(0, 1fr))") : this.$component.find(".filter-section").css("grid-template-columns", "repeat(12, minmax(0, 1fr))");
      minimize ? this.$component.find(".search-field").css("margin", "var(--margin-sm) 0px") : this.$component.find(".search-field").css("margin", "0px var(--margin-sm)");
      minimize ? this.$component.css("grid-column", "span 2 / span 2") : this.$component.css("grid-column", "span 6 / span 6");
      minimize ? this.$items_container.css("grid-template-columns", "repeat(1, minmax(0, 1fr))") : this.$items_container.css("grid-template-columns", "repeat(4, minmax(0, 1fr))");
    }
    toggle_component(show) {
      this.set_search_value("");
      this.$component.css("display", show ? "flex" : "none");
    }
  };

  // ../pasigono/pasigono/pos_assets/pos_item_cart.js
  erpnext.PointOfSale.ItemCart = class {
    constructor({ wrapper, events, settings }) {
      this.wrapper = wrapper;
      this.events = events;
      this.customer_info = void 0;
      this.hide_images = settings.hide_images;
      this.allowed_customer_groups = settings.customer_groups;
      this.allow_rate_change = settings.allow_rate_change;
      this.allow_discount_change = settings.allow_discount_change;
      this.init_component();
    }
    init_component() {
      this.prepare_dom();
      this.init_child_components();
      this.bind_events();
      this.attach_shortcuts();
    }
    prepare_dom() {
      this.wrapper.append(`<section class="customer-cart-container"></section>`);
      this.$component = this.wrapper.find(".customer-cart-container");
    }
    init_child_components() {
      this.init_customer_selector();
      this.init_cart_components();
    }
    init_customer_selector() {
      this.$component.append(`<div class="customer-section"></div>`);
      this.$customer_section = this.$component.find(".customer-section");
      this.make_customer_selector();
    }
    reset_customer_selector() {
      const frm = this.events.get_frm();
      frm.set_value("customer", "");
      this.make_customer_selector();
      this.customer_field.set_focus();
    }
    init_cart_components() {
      this.$component.append(`<div class="cart-container">
				<div class="abs-cart-container">
					<div class="cart-label">${__("Item Cart")}</div>
					<div class="cart-header">
						<div class="name-header">${__("Item")}</div>
						<div class="qty-header">${__("Quantity")}</div>
						<div class="rate-amount-header">${__("Amount")}</div>
					</div>
					<div class="cart-items-section"></div>
					<div class="cart-totals-section"></div>
					<div class="numpad-section"></div>
				</div>
			</div>`);
      this.$cart_container = this.$component.find(".cart-container");
      this.make_cart_totals_section();
      this.make_cart_items_section();
      this.make_cart_numpad();
    }
    make_cart_items_section() {
      this.$cart_header = this.$component.find(".cart-header");
      this.$cart_items_wrapper = this.$component.find(".cart-items-section");
      this.make_no_items_placeholder();
    }
    make_no_items_placeholder() {
      this.$cart_header.css("display", "none");
      this.$cart_items_wrapper.html(`<div class="no-item-wrapper">${__("No items in cart")}</div>`);
    }
    get_discount_icon() {
      return `<svg class="discount-icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19 15.6213C19 15.2235 19.158 14.842 19.4393 14.5607L20.9393 13.0607C21.5251 12.4749 21.5251 11.5251 20.9393 10.9393L19.4393 9.43934C19.158 9.15804 19 8.7765 19 8.37868V6.5C19 5.67157 18.3284 5 17.5 5H15.6213C15.2235 5 14.842 4.84196 14.5607 4.56066L13.0607 3.06066C12.4749 2.47487 11.5251 2.47487 10.9393 3.06066L9.43934 4.56066C9.15804 4.84196 8.7765 5 8.37868 5H6.5C5.67157 5 5 5.67157 5 6.5V8.37868C5 8.7765 4.84196 9.15804 4.56066 9.43934L3.06066 10.9393C2.47487 11.5251 2.47487 12.4749 3.06066 13.0607L4.56066 14.5607C4.84196 14.842 5 15.2235 5 15.6213V17.5C5 18.3284 5.67157 19 6.5 19H8.37868C8.7765 19 9.15804 19.158 9.43934 19.4393L10.9393 20.9393C11.5251 21.5251 12.4749 21.5251 13.0607 20.9393L14.5607 19.4393C14.842 19.158 15.2235 19 15.6213 19H17.5C18.3284 19 19 18.3284 19 17.5V15.6213Z" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M15 9L9 15" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M10.5 9.5C10.5 10.0523 10.0523 10.5 9.5 10.5C8.94772 10.5 8.5 10.0523 8.5 9.5C8.5 8.94772 8.94772 8.5 9.5 8.5C10.0523 8.5 10.5 8.94772 10.5 9.5Z" fill="white" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M15.5 14.5C15.5 15.0523 15.0523 15.5 14.5 15.5C13.9477 15.5 13.5 15.0523 13.5 14.5C13.5 13.9477 13.9477 13.5 14.5 13.5C15.0523 13.5 15.5 13.9477 15.5 14.5Z" fill="white" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>`;
    }
    make_cart_totals_section() {
      this.$totals_section = this.$component.find(".cart-totals-section");
      this.$totals_section.append(`<div class="add-discount-wrapper">
				${this.get_discount_icon()} ${__("Add Discount")}
			</div>
			<div class="item-qty-total-container">
				<div class="item-qty-total-label">${__("Total Items")}</div>
				<div class="item-qty-total-value">0.00</div>
			</div>
			<div class="net-total-container">
				<div class="net-total-label">${__("Net Total")}</div>
				<div class="net-total-value">0.00</div>
			</div>
			<div class="taxes-container"></div>
			<div class="grand-total-container">
				<div>${__("Grand Total")}</div>
				<div>0.00</div>
			</div>
			<div class="checkout-btn">${__("Checkout")}</div>
			<div class="edit-cart-btn">${__("Edit Cart")}</div>`);
      this.$add_discount_elem = this.$component.find(".add-discount-wrapper");
    }
    make_cart_numpad() {
      this.$numpad_section = this.$component.find(".numpad-section");
      this.number_pad = new erpnext.PointOfSale.NumberPad({
        wrapper: this.$numpad_section,
        events: {
          numpad_event: this.on_numpad_event.bind(this)
        },
        cols: 5,
        keys: [
          [1, 2, 3, "Quantity"],
          [4, 5, 6, "Discount"],
          [7, 8, 9, "Rate"],
          [".", 0, "Delete", "Remove"]
        ],
        css_classes: [
          ["", "", "", "col-span-2"],
          ["", "", "", "col-span-2"],
          ["", "", "", "col-span-2"],
          ["", "", "", "col-span-2 remove-btn"]
        ],
        fieldnames_map: { Quantity: "qty", Discount: "discount_percentage" }
      });
      this.$numpad_section.prepend(`<div class="numpad-totals">
			<span class="numpad-item-qty-total"></span>
				<span class="numpad-net-total"></span>
				<span class="numpad-grand-total"></span>
			</div>`);
      this.$numpad_section.append(`<div class="numpad-btn checkout-btn" data-button-value="checkout">${__("Checkout")}</div>`);
    }
    bind_events() {
      const me = this;
      this.$customer_section.on("click", ".reset-customer-btn", function() {
        me.reset_customer_selector();
      });
      this.$customer_section.on("click", ".close-details-btn", function() {
        me.toggle_customer_info(false);
      });
      this.$customer_section.on("click", ".customer-display", function(e) {
        if ($(e.target).closest(".reset-customer-btn").length)
          return;
        const show = me.$cart_container.is(":visible");
        me.toggle_customer_info(show);
      });
      this.$cart_items_wrapper.on("click", ".cart-item-wrapper", function() {
        const $cart_item = $(this);
        me.toggle_item_highlight(this);
        const payment_section_hidden = !me.$totals_section.find(".edit-cart-btn").is(":visible");
        if (!payment_section_hidden) {
          me.$totals_section.find(".edit-cart-btn").click();
        }
        const item_row_name = unescape($cart_item.attr("data-row-name"));
        me.events.cart_item_clicked({ name: item_row_name });
        this.numpad_value = "";
      });
      this.$component.on("click", ".checkout-btn", async function() {
        if ($(this).attr("style").indexOf("--blue-500") == -1)
          return;
        await me.events.checkout();
        me.toggle_checkout_btn(false);
        me.allow_discount_change && me.$add_discount_elem.removeClass("d-none");
      });
      this.$totals_section.on("click", ".edit-cart-btn", () => {
        this.events.edit_cart();
        this.toggle_checkout_btn(true);
      });
      this.$component.on("click", ".add-discount-wrapper", () => {
        const can_edit_discount = this.$add_discount_elem.find(".edit-discount-btn").length;
        if (!this.discount_field || can_edit_discount)
          this.show_discount_control();
      });
      frappe.ui.form.on("POS Invoice", "paid_amount", (frm) => {
        this.update_totals_section(frm);
      });
    }
    attach_shortcuts() {
      for (let row of this.number_pad.keys) {
        for (let btn of row) {
          if (typeof btn !== "string")
            continue;
          let shortcut_key = `ctrl+${frappe.scrub(String(btn))[0]}`;
          if (btn === "Delete")
            shortcut_key = "ctrl+backspace";
          if (btn === "Remove")
            shortcut_key = "shift+ctrl+backspace";
          if (btn === ".")
            shortcut_key = "ctrl+>";
          const fieldname = this.number_pad.fieldnames[btn] ? this.number_pad.fieldnames[btn] : typeof btn === "string" ? frappe.scrub(btn) : btn;
          let shortcut_label = shortcut_key.split("+").map(frappe.utils.to_title_case).join("+");
          shortcut_label = frappe.utils.is_mac() ? shortcut_label.replace("Ctrl", "\u2318") : shortcut_label;
          this.$numpad_section.find(`.numpad-btn[data-button-value="${fieldname}"]`).attr("title", shortcut_label);
          frappe.ui.keys.on(`${shortcut_key}`, () => {
            const cart_is_visible = this.$component.is(":visible");
            if (cart_is_visible && this.item_is_selected && this.$numpad_section.is(":visible")) {
              this.$numpad_section.find(`.numpad-btn[data-button-value="${fieldname}"]`).click();
            }
          });
        }
      }
      const ctrl_label = frappe.utils.is_mac() ? "\u2318" : "Ctrl";
      this.$component.find(".checkout-btn").attr("title", `${ctrl_label}+Enter`);
      frappe.ui.keys.add_shortcut({
        shortcut: "ctrl+enter",
        action: () => this.$component.find(".checkout-btn").click(),
        condition: () => this.$component.is(":visible") && !this.$totals_section.find(".edit-cart-btn").is(":visible"),
        description: __("Checkout Order / Submit Order / New Order"),
        ignore_inputs: true,
        page: cur_page.page.page
      });
      this.$component.find(".edit-cart-btn").attr("title", `${ctrl_label}+E`);
      frappe.ui.keys.on("ctrl+e", () => {
        const item_cart_visible = this.$component.is(":visible");
        const checkout_btn_invisible = !this.$totals_section.find(".checkout-btn").is("visible");
        if (item_cart_visible && checkout_btn_invisible) {
          this.$component.find(".edit-cart-btn").click();
        }
      });
      this.$component.find(".add-discount-wrapper").attr("title", `${ctrl_label}+D`);
      frappe.ui.keys.add_shortcut({
        shortcut: "ctrl+d",
        action: () => this.$component.find(".add-discount-wrapper").click(),
        condition: () => this.$add_discount_elem.is(":visible"),
        description: __("Add Order Discount"),
        ignore_inputs: true,
        page: cur_page.page.page
      });
      frappe.ui.keys.on("escape", () => {
        const item_cart_visible = this.$component.is(":visible");
        if (item_cart_visible && this.discount_field && this.discount_field.parent.is(":visible")) {
          this.discount_field.set_value(0);
        }
      });
    }
    toggle_item_highlight(item) {
      const $cart_item = $(item);
      const item_is_highlighted = $cart_item.attr("style") == "background-color:var(--gray-50);";
      if (!item || item_is_highlighted) {
        this.item_is_selected = false;
        this.$cart_container.find(".cart-item-wrapper").css("background-color", "");
      } else {
        $cart_item.css("background-color", "var(--gray-50)");
        this.item_is_selected = true;
        this.$cart_container.find(".cart-item-wrapper").not(item).css("background-color", "");
      }
    }
    make_customer_selector() {
      this.$customer_section.html(`
			<div class="customer-field"></div>
		`);
      const me = this;
      const query = { query: "erpnext.controllers.queries.customer_query" };
      const allowed_customer_group = this.allowed_customer_groups || [];
      if (allowed_customer_group.length) {
        query.filters = {
          customer_group: ["in", allowed_customer_group]
        };
      }
      this.customer_field = frappe.ui.form.make_control({
        df: {
          label: __("Customer"),
          fieldtype: "Link",
          options: "Customer",
          placeholder: __("Search by customer name, phone, email."),
          get_query: () => query,
          onchange: function() {
            if (this.value) {
              const frm = me.events.get_frm();
              frappe.dom.freeze();
              frappe.model.set_value(frm.doc.doctype, frm.doc.name, "customer", this.value);
              frm.script_manager.trigger("customer", frm.doc.doctype, frm.doc.name).then(() => {
                frappe.run_serially([
                  () => me.fetch_customer_details(this.value),
                  () => me.events.customer_details_updated(me.customer_info),
                  () => me.update_customer_section(),
                  () => me.update_totals_section(),
                  () => frappe.dom.unfreeze()
                ]);
              });
            }
          }
        },
        parent: this.$customer_section.find(".customer-field"),
        render_input: true
      });
      this.customer_field.toggle_label(false);
    }
    fetch_customer_details(customer) {
      if (customer) {
        return new Promise((resolve) => {
          frappe.db.get_value("Customer", customer, [
            "email_id",
            "mobile_no",
            "image",
            "loyalty_program"
          ]).then(({ message }) => {
            const { loyalty_program } = message;
            if (loyalty_program) {
              frappe.call({
                method: "erpnext.accounts.doctype.loyalty_program.loyalty_program.get_loyalty_program_details_with_points",
                args: { customer, loyalty_program, silent: true },
                callback: (r) => {
                  const { loyalty_points, conversion_factor } = r.message;
                  if (!r.exc) {
                    this.customer_info = __spreadProps(__spreadValues({}, message), {
                      customer,
                      loyalty_points,
                      conversion_factor
                    });
                    resolve();
                  }
                }
              });
            } else {
              this.customer_info = __spreadProps(__spreadValues({}, message), { customer });
              resolve();
            }
          });
        });
      } else {
        return new Promise((resolve) => {
          this.customer_info = {};
          resolve();
        });
      }
    }
    show_discount_control() {
      this.$add_discount_elem.css({ padding: "0px", border: "none" });
      this.$add_discount_elem.html(`<div class="add-discount-field"></div>`);
      const me = this;
      const frm = me.events.get_frm();
      let discount = frm.doc.additional_discount_percentage;
      this.discount_field = frappe.ui.form.make_control({
        df: {
          label: __("Discount"),
          fieldtype: "Data",
          placeholder: discount ? discount + "%" : __("Enter discount percentage."),
          input_class: "input-xs",
          onchange: function() {
            if (flt(this.value) != 0) {
              frappe.model.set_value(frm.doc.doctype, frm.doc.name, "additional_discount_percentage", flt(this.value));
              me.hide_discount_control(this.value);
            } else {
              frappe.model.set_value(frm.doc.doctype, frm.doc.name, "additional_discount_percentage", 0);
              me.$add_discount_elem.css({
                border: "1px dashed var(--gray-500)",
                padding: "var(--padding-sm) var(--padding-md)"
              });
              me.$add_discount_elem.html(`${me.get_discount_icon()} ${__("Add Discount")}`);
              me.discount_field = void 0;
            }
          }
        },
        parent: this.$add_discount_elem.find(".add-discount-field"),
        render_input: true
      });
      this.discount_field.toggle_label(false);
      this.discount_field.set_focus();
    }
    hide_discount_control(discount) {
      if (!discount) {
        this.$add_discount_elem.css({ padding: "0px", border: "none" });
        this.$add_discount_elem.html(`<div class="add-discount-field"></div>`);
      } else {
        this.$add_discount_elem.css({
          border: "1px dashed var(--dark-green-500)",
          padding: "var(--padding-sm) var(--padding-md)"
        });
        this.$add_discount_elem.html(`<div class="edit-discount-btn">
					${this.get_discount_icon()} ${__("Additional")}&nbsp;${String(discount).bold()}% ${__("discount applied")}
				</div>`);
      }
    }
    update_customer_section() {
      const me = this;
      const {
        customer,
        email_id = "",
        mobile_no = "",
        image
      } = this.customer_info || {};
      if (customer) {
        this.$customer_section.html(`<div class="customer-details">
					<div class="customer-display">
						${this.get_customer_image()}
						<div class="customer-name-desc">
							<div class="customer-name">${customer}</div>
							${get_customer_description()}
						</div>
						<div class="reset-customer-btn" data-customer="${escape(customer)}">
							<svg width="32" height="32" viewBox="0 0 14 14" fill="none">
								<path d="M4.93764 4.93759L7.00003 6.99998M9.06243 9.06238L7.00003 6.99998M7.00003 6.99998L4.93764 9.06238L9.06243 4.93759" stroke="#8D99A6"/>
							</svg>
						</div>
					</div>
				</div>`);
      } else {
        this.reset_customer_selector();
      }
      function get_customer_description() {
        if (!email_id && !mobile_no) {
          return `<div class="customer-desc">${__("Click to add email / phone")}</div>`;
        } else if (email_id && !mobile_no) {
          return `<div class="customer-desc">${email_id}</div>`;
        } else if (mobile_no && !email_id) {
          return `<div class="customer-desc">${mobile_no}</div>`;
        } else {
          return `<div class="customer-desc">${email_id} - ${mobile_no}</div>`;
        }
      }
    }
    get_customer_image() {
      const { customer, image } = this.customer_info || {};
      if (image) {
        return `<div class="customer-image"><img src="${image}" alt="${image}""></div>`;
      } else {
        return `<div class="customer-image customer-abbr">${frappe.get_abbr(customer)}</div>`;
      }
    }
    update_totals_section(frm) {
      if (!frm)
        frm = this.events.get_frm();
      this.render_net_total(frm.doc.net_total);
      this.render_total_item_qty(frm.doc.items);
      const grand_total = cint(frappe.sys_defaults.disable_rounded_total) ? frm.doc.grand_total : frm.doc.rounded_total;
      this.render_grand_total(grand_total);
      this.render_taxes(frm.doc.taxes);
    }
    render_net_total(value) {
      const currency = this.events.get_frm().doc.currency;
      this.$totals_section.find(".net-total-container").html(`<div>${__("Net Total")}</div><div>${format_currency(value, currency)}</div>`);
      this.$numpad_section.find(".numpad-net-total").html(`<div>${__("Net Total")}: <span>${format_currency(value, currency)}</span></div>`);
    }
    render_total_item_qty(items) {
      var total_item_qty = 0;
      items.map((item) => {
        total_item_qty = total_item_qty + item.qty;
      });
      this.$totals_section.find(".item-qty-total-container").html(`<div>${__("Total Quantity")}</div><div>${total_item_qty}</div>`);
      this.$numpad_section.find(".numpad-item-qty-total").html(`<div>${__("Total Quantity")}: <span>${total_item_qty}</span></div>`);
    }
    render_grand_total(value) {
      const currency = this.events.get_frm().doc.currency;
      this.$totals_section.find(".grand-total-container").html(`<div>${__("Grand Total")}</div><div>${format_currency(value, currency)}</div>`);
      this.$numpad_section.find(".numpad-grand-total").html(`<div>${__("Grand Total")}: <span>${format_currency(value, currency)}</span></div>`);
    }
    render_taxes(taxes) {
      if (taxes.length) {
        const currency = this.events.get_frm().doc.currency;
        const taxes_html = taxes.map((t) => {
          if (t.tax_amount_after_discount_amount == 0)
            return;
          const description = /[0-9]+/.test(t.description) ? t.description : `${t.description} @ ${t.rate}%`;
          return `<div class="tax-row">
					<div class="tax-label">ISV 15%</div>
					<div class="tax-value">${format_currency(t.tax_amount_after_discount_amount, currency)}</div>
				</div>`;
        }).join("");
        this.$totals_section.find(".taxes-container").css("display", "flex").html(taxes_html);
      } else {
        this.$totals_section.find(".taxes-container").css("display", "none").html("");
      }
    }
    get_cart_item({ name }) {
      const item_selector = `.cart-item-wrapper[data-row-name="${escape(name)}"]`;
      return this.$cart_items_wrapper.find(item_selector);
    }
    get_item_from_frm(item) {
      const doc = this.events.get_frm().doc;
      return doc.items.find((i) => i.name == item.name);
    }
    update_item_html(item, remove_item) {
      const $item = this.get_cart_item(item);
      if (remove_item) {
        $item && $item.next().remove() && $item.remove();
      } else {
        const item_row = this.get_item_from_frm(item);
        this.render_cart_item(item_row, $item);
      }
      const no_of_cart_items = this.$cart_items_wrapper.find(".cart-item-wrapper").length;
      this.highlight_checkout_btn(no_of_cart_items > 0);
      this.update_empty_cart_section(no_of_cart_items);
    }
    render_cart_item(item_data, $item_to_update) {
      const currency = this.events.get_frm().doc.currency;
      const me = this;
      if (!$item_to_update.length) {
        this.$cart_items_wrapper.append(`<div class="cart-item-wrapper" data-row-name="${escape(item_data.name)}"></div>
				<div class="seperator"></div>`);
        $item_to_update = this.get_cart_item(item_data);
      }
      $item_to_update.html(`${get_item_image_html()}
			<div class="item-name-desc">
				<div class="item-name">
					${item_data.item_name}
				</div>
				${get_description_html()}
			</div>
			${get_rate_discount_html()}`);
      set_dynamic_rate_header_width();
      function set_dynamic_rate_header_width() {
        const rate_cols = Array.from(me.$cart_items_wrapper.find(".item-rate-amount"));
        me.$cart_header.find(".rate-amount-header").css("width", "");
        me.$cart_items_wrapper.find(".item-rate-amount").css("width", "");
        let max_width = rate_cols.reduce((max_width2, elm) => {
          if ($(elm).width() > max_width2)
            max_width2 = $(elm).width();
          return max_width2;
        }, 0);
        max_width += 1;
        if (max_width == 1)
          max_width = "";
        me.$cart_header.find(".rate-amount-header").css("width", max_width);
        me.$cart_items_wrapper.find(".item-rate-amount").css("width", max_width);
      }
      function get_rate_discount_html() {
        if (item_data.rate && item_data.amount && item_data.rate !== item_data.amount) {
          return `
					<div class="item-qty-rate">
						<div class="item-qty"><span>${item_data.qty || 0}</span></div>
						<div class="item-rate-amount">
							<div class="item-rate">${format_currency(item_data.amount, currency)}</div>
							<div class="item-amount">${format_currency(item_data.rate, currency)}</div>
						</div>
					</div>`;
        } else {
          return `
					<div class="item-qty-rate">
						<div class="item-qty"><span>${item_data.qty || 0}</span></div>
						<div class="item-rate-amount">
							<div class="item-rate">${format_currency(item_data.rate, currency)}</div>
						</div>
					</div>`;
        }
      }
      function get_description_html() {
        if (item_data.description) {
          if (item_data.description.indexOf("<div>") != -1) {
            try {
              item_data.description = $(item_data.description).text();
            } catch (error) {
              item_data.description = item_data.description.replace(/<div>/g, " ").replace(/<\/div>/g, " ").replace(/ +/g, " ");
            }
          }
          item_data.description = frappe.ellipsis(item_data.description, 45);
          return `<div class="item-desc">${item_data.description}</div>`;
        }
        return ``;
      }
      function get_item_image_html() {
        const { image, item_name } = item_data;
        if (!me.hide_images && image) {
          return `
					<div class="item-image">
						<img
							onerror="cur_pos.cart.handle_broken_image(this)"
							src="${image}" alt="${frappe.get_abbr(item_name)}"">
					</div>`;
        } else {
          return `<div class="item-image item-abbr">${frappe.get_abbr(item_name)}</div>`;
        }
      }
    }
    handle_broken_image($img) {
      const item_abbr = $($img).attr("alt");
      $($img).parent().replaceWith(`<div class="item-image item-abbr">${item_abbr}</div>`);
    }
    update_selector_value_in_cart_item(selector, value, item) {
      const $item_to_update = this.get_cart_item(item);
      $item_to_update.attr(`data-${selector}`, escape(value));
    }
    toggle_checkout_btn(show_checkout) {
      if (show_checkout) {
        this.$totals_section.find(".checkout-btn").css("display", "flex");
        this.$totals_section.find(".edit-cart-btn").css("display", "none");
      } else {
        this.$totals_section.find(".checkout-btn").css("display", "none");
        this.$totals_section.find(".edit-cart-btn").css("display", "flex");
      }
    }
    highlight_checkout_btn(toggle) {
      if (toggle) {
        this.$add_discount_elem.css("display", "flex");
        this.$cart_container.find(".checkout-btn").css({
          "background-color": "var(--blue-500)"
        });
      } else {
        this.$add_discount_elem.css("display", "none");
        this.$cart_container.find(".checkout-btn").css({
          "background-color": "var(--blue-200)"
        });
      }
    }
    update_empty_cart_section(no_of_cart_items) {
      const $no_item_element = this.$cart_items_wrapper.find(".no-item-wrapper");
      no_of_cart_items > 0 && $no_item_element && $no_item_element.remove() && this.$cart_header.css("display", "flex");
      no_of_cart_items === 0 && !$no_item_element.length && this.make_no_items_placeholder();
    }
    on_numpad_event($btn) {
      const current_action = $btn.attr("data-button-value");
      const action_is_field_edit = [
        "qty",
        "discount_percentage",
        "rate"
      ].includes(current_action);
      const action_is_allowed = action_is_field_edit ? current_action == "rate" && this.allow_rate_change || current_action == "discount_percentage" && this.allow_discount_change || current_action == "qty" : true;
      const action_is_pressed_twice = this.prev_action === current_action;
      const first_click_event = !this.prev_action;
      const field_to_edit_changed = this.prev_action && this.prev_action != current_action;
      if (action_is_field_edit) {
        if (!action_is_allowed) {
          const label = current_action == "rate" ? "Rate".bold() : "Discount".bold();
          const message = __("Editing {0} is not allowed as per POS Profile settings", [label]);
          frappe.show_alert({
            indicator: "red",
            message
          });
          frappe.utils.play_sound("error");
          return;
        }
        if (first_click_event || field_to_edit_changed) {
          this.prev_action = current_action;
        } else if (action_is_pressed_twice) {
          this.prev_action = void 0;
        }
        this.numpad_value = "";
      } else if (current_action === "checkout") {
        this.prev_action = void 0;
        this.toggle_item_highlight();
        this.events.numpad_event(void 0, current_action);
        return;
      } else if (current_action === "remove") {
        this.prev_action = void 0;
        this.toggle_item_highlight();
        this.events.numpad_event(void 0, current_action);
        return;
      } else {
        this.numpad_value = current_action === "delete" ? this.numpad_value.slice(0, -1) : this.numpad_value + current_action;
        this.numpad_value = this.numpad_value || 0;
      }
      const first_click_event_is_not_field_edit = !action_is_field_edit && first_click_event;
      if (first_click_event_is_not_field_edit) {
        frappe.show_alert({
          indicator: "red",
          message: __("Please select a field to edit from numpad")
        });
        frappe.utils.play_sound("error");
        return;
      }
      if (flt(this.numpad_value) > 100 && this.prev_action === "discount_percentage") {
        frappe.show_alert({
          message: __("Discount cannot be greater than 100%"),
          indicator: "orange"
        });
        frappe.utils.play_sound("error");
        this.numpad_value = current_action;
      }
      this.highlight_numpad_btn($btn, current_action);
      this.events.numpad_event(this.numpad_value, this.prev_action);
    }
    highlight_numpad_btn($btn, curr_action) {
      const curr_action_is_highlighted = $btn.hasClass("highlighted-numpad-btn");
      const curr_action_is_action = [
        "qty",
        "discount_percentage",
        "rate",
        "done"
      ].includes(curr_action);
      if (!curr_action_is_highlighted) {
        $btn.addClass("highlighted-numpad-btn");
      }
      if (this.prev_action === curr_action && curr_action_is_highlighted) {
        $btn.removeClass("highlighted-numpad-btn");
      }
      if (this.prev_action && this.prev_action !== curr_action && curr_action_is_action) {
        const prev_btn = $(`[data-button-value='${this.prev_action}']`);
        prev_btn.removeClass("highlighted-numpad-btn");
      }
      if (!curr_action_is_action || curr_action === "done") {
        setTimeout(() => {
          $btn.removeClass("highlighted-numpad-btn");
        }, 200);
      }
    }
    toggle_numpad(show) {
      if (show) {
        this.$totals_section.css("display", "none");
        this.$numpad_section.css("display", "flex");
      } else {
        this.$totals_section.css("display", "flex");
        this.$numpad_section.css("display", "none");
      }
      this.reset_numpad();
    }
    reset_numpad() {
      this.numpad_value = "";
      this.prev_action = void 0;
      this.$numpad_section.find(".highlighted-numpad-btn").removeClass("highlighted-numpad-btn");
    }
    toggle_numpad_field_edit(fieldname) {
      if (["qty", "discount_percentage", "rate"].includes(fieldname)) {
        this.$numpad_section.find(`[data-button-value="${fieldname}"]`).click();
      }
    }
    toggle_customer_info(show) {
      if (show) {
        const { customer } = this.customer_info || {};
        this.$cart_container.css("display", "none");
        this.$customer_section.css({
          height: "100%",
          "padding-top": "0px"
        });
        this.$customer_section.find(".customer-details").html(`<div class="header">
					<div class="label">Contact Details</div>
					<div class="close-details-btn">
						<svg width="32" height="32" viewBox="0 0 14 14" fill="none">
							<path d="M4.93764 4.93759L7.00003 6.99998M9.06243 9.06238L7.00003 6.99998M7.00003 6.99998L4.93764 9.06238L9.06243 4.93759" stroke="#8D99A6"/>
						</svg>
					</div>
				</div>
				<div class="customer-display">
					${this.get_customer_image()}
					<div class="customer-name-desc">
						<div class="customer-name">${customer}</div>
						<div class="customer-desc"></div>
					</div>
				</div>
				<div class="customer-fields-container">
					<div class="email_id-field"></div>
					<div class="mobile_no-field"></div>
					<div class="loyalty_program-field"></div>
					<div class="loyalty_points-field"></div>
				</div>
				<div class="transactions-label">Recent Transactions</div>`);
        this.$customer_section.append(`<div class="customer-transactions"></div>`);
        this.render_customer_fields();
        this.fetch_customer_transactions();
      } else {
        this.$cart_container.css("display", "flex");
        this.$customer_section.css({
          height: "",
          "padding-top": ""
        });
        this.update_customer_section();
      }
    }
    render_customer_fields() {
      const $customer_form = this.$customer_section.find(".customer-fields-container");
      const dfs = [
        {
          fieldname: "email_id",
          label: __("Email"),
          fieldtype: "Data",
          options: "email",
          placeholder: __("Enter customer's email")
        },
        {
          fieldname: "mobile_no",
          label: __("Phone Number"),
          fieldtype: "Data",
          placeholder: __("Enter customer's phone number")
        },
        {
          fieldname: "loyalty_program",
          label: __("Loyalty Program"),
          fieldtype: "Link",
          options: "Loyalty Program",
          placeholder: __("Select Loyalty Program")
        },
        {
          fieldname: "loyalty_points",
          label: __("Loyalty Points"),
          fieldtype: "Data",
          read_only: 1
        }
      ];
      const me = this;
      dfs.forEach((df) => {
        this[`customer_${df.fieldname}_field`] = frappe.ui.form.make_control({
          df: __spreadProps(__spreadValues({}, df), { onchange: handle_customer_field_change }),
          parent: $customer_form.find(`.${df.fieldname}-field`),
          render_input: true
        });
        this[`customer_${df.fieldname}_field`].set_value(this.customer_info[df.fieldname]);
      });
      function handle_customer_field_change() {
        const current_value = me.customer_info[this.df.fieldname];
        const current_customer = me.customer_info.customer;
        if (this.value && current_value != this.value && this.df.fieldname != "loyalty_points") {
          frappe.call({
            method: "erpnext.selling.page.point_of_sale.point_of_sale.set_customer_info",
            args: {
              fieldname: this.df.fieldname,
              customer: current_customer,
              value: this.value
            },
            callback: (r) => {
              if (!r.exc) {
                me.customer_info[this.df.fieldname] = this.value;
                frappe.show_alert({
                  message: __("Customer contact updated successfully."),
                  indicator: "green"
                });
                frappe.utils.play_sound("submit");
              }
            }
          });
        }
      }
    }
    fetch_customer_transactions() {
      frappe.db.get_list("POS Invoice", {
        filters: { customer: this.customer_info.customer, docstatus: 1 },
        fields: [
          "name",
          "grand_total",
          "status",
          "posting_date",
          "posting_time",
          "currency"
        ],
        limit: 20
      }).then((res) => {
        const transaction_container = this.$customer_section.find(".customer-transactions");
        if (!res.length) {
          transaction_container.html(`<div class="no-transactions-placeholder">No recent transactions found</div>`);
          return;
        }
        const elapsed_time = moment(res[0].posting_date + " " + res[0].posting_time).fromNow();
        this.$customer_section.find(".customer-desc").html(`Last transacted ${elapsed_time}`);
        res.forEach((invoice) => {
          const posting_datetime = moment(invoice.posting_date + " " + invoice.posting_time).format("Do MMMM, h:mma");
          let indicator_color = {
            Paid: "green",
            Draft: "red",
            Return: "gray",
            Consolidated: "blue"
          };
          transaction_container.append(`<div class="invoice-wrapper" data-invoice-name="${escape(invoice.name)}">
						<div class="invoice-name-date">
							<div class="invoice-name">${invoice.name}</div>
							<div class="invoice-date">${posting_datetime}</div>
						</div>
						<div class="invoice-total-status">
							<div class="invoice-total">
								${format_currency(invoice.grand_total, invoice.currency, 0) || 0}
							</div>
							<div class="invoice-status">
								<span class="indicator-pill whitespace-nowrap ${indicator_color[invoice.status]}">
									<span>${invoice.status}</span>
								</span>
							</div>
						</div>
					</div>
					<div class="seperator"></div>`);
        });
      });
    }
    attach_refresh_field_event(frm) {
      $(frm.wrapper).off("refresh-fields");
      $(frm.wrapper).on("refresh-fields", () => {
        if (frm.doc.items.length) {
          this.$cart_items_wrapper.html("");
          frm.doc.items.forEach((item) => {
            this.update_item_html(item);
          });
        }
        this.update_totals_section(frm);
      });
    }
    load_invoice() {
      const frm = this.events.get_frm();
      this.attach_refresh_field_event(frm);
      this.fetch_customer_details(frm.doc.customer).then(() => {
        this.events.customer_details_updated(this.customer_info);
        this.update_customer_section();
      });
      this.$cart_items_wrapper.html("");
      if (frm.doc.items.length) {
        frm.doc.items.forEach((item) => {
          this.update_item_html(item);
        });
      } else {
        this.make_no_items_placeholder();
        this.highlight_checkout_btn(false);
      }
      this.update_totals_section(frm);
      if (frm.doc.docstatus === 1) {
        this.$totals_section.find(".checkout-btn").css("display", "none");
        this.$totals_section.find(".edit-cart-btn").css("display", "none");
      } else {
        this.$totals_section.find(".checkout-btn").css("display", "flex");
        this.$totals_section.find(".edit-cart-btn").css("display", "none");
      }
      this.toggle_component(true);
    }
    toggle_component(show) {
      show ? this.$component.css("display", "flex") : this.$component.css("display", "none");
    }
  };

  // ../pasigono/pasigono/pos_assets/pos_item_details.js
  erpnext.PointOfSale.ItemDetails = class {
    constructor({ wrapper, events, settings }) {
      this.wrapper = wrapper;
      this.events = events;
      this.hide_images = settings.hide_images;
      this.allow_rate_change = settings.allow_rate_change;
      this.allow_discount_change = settings.allow_discount_change;
      this.current_item = {};
      this.init_component();
    }
    init_component() {
      this.prepare_dom();
      this.init_child_components();
      this.bind_events();
      this.attach_shortcuts();
    }
    prepare_dom() {
      this.wrapper.append(`<section class="item-details-container"></section>`);
      this.$component = this.wrapper.find(".item-details-container");
    }
    init_child_components() {
      this.$component.html(`<div class="item-details-header">
				<div class="label">${__("Item Details")}</div>
				<div class="close-btn">
					<svg width="32" height="32" viewBox="0 0 14 14" fill="none">
						<path d="M4.93764 4.93759L7.00003 6.99998M9.06243 9.06238L7.00003 6.99998M7.00003 6.99998L4.93764 9.06238L9.06243 4.93759" stroke="#8D99A6"/>
					</svg>
				</div>
			</div>
			<div class="item-display">
				<div class="item-name-desc-price">
					<div class="item-name"></div>
					<div class="item-desc"></div>
					<div class="item-price"></div>
				</div>
				<div class="item-image"></div>
			</div>
			<div class="discount-section"></div>
			<div class="form-container"></div>`);
      this.$item_name = this.$component.find(".item-name");
      this.$item_description = this.$component.find(".item-desc");
      this.$item_price = this.$component.find(".item-price");
      this.$item_image = this.$component.find(".item-image");
      this.$form_container = this.$component.find(".form-container");
      this.$dicount_section = this.$component.find(".discount-section");
    }
    compare_with_current_item(item) {
      return item && item.name == this.current_item.name;
    }
    async toggle_item_details_section(item) {
      const current_item_changed = !this.compare_with_current_item(item);
      const hide_item_details = !Boolean(item) || !current_item_changed;
      if (!hide_item_details && current_item_changed || hide_item_details) {
        await this.validate_serial_batch_item();
      }
      this.events.toggle_item_selector(!hide_item_details);
      this.toggle_component(!hide_item_details);
      if (item && current_item_changed) {
        this.doctype = item.doctype;
        this.item_meta = frappe.get_meta(this.doctype);
        this.name = item.name;
        this.item_row = item;
        this.currency = this.events.get_frm().doc.currency;
        this.current_item = item;
        this.render_dom(item);
        this.render_discount_dom(item);
        this.render_form(item);
        this.events.highlight_cart_item(item);
      } else {
        this.current_item = {};
      }
    }
    validate_serial_batch_item() {
      const doc = this.events.get_frm().doc;
      const item_row = doc.items.find((item) => item.name === this.name);
      if (!item_row)
        return;
      const serialized = item_row.has_serial_no;
      const batched = item_row.has_batch_no;
      const no_serial_selected = !item_row.serial_no;
      const no_batch_selected = !item_row.batch_no;
      if (serialized && no_serial_selected || batched && no_batch_selected || serialized && batched && (no_batch_selected || no_serial_selected)) {
        frappe.show_alert({
          message: __("Item is removed since no serial / batch no selected."),
          indicator: "orange"
        });
        frappe.utils.play_sound("cancel");
        return this.events.remove_item_from_cart();
      }
    }
    render_dom(item) {
      let { item_name, description, image, price_list_rate } = item;
      function get_description_html() {
        if (description) {
          description = description.indexOf("...") === -1 && description.length > 140 ? description.substr(0, 139) + "..." : description;
          return description;
        }
        return ``;
      }
      this.$item_name.html(item_name);
      this.$item_description.html(get_description_html());
      this.$item_price.html(format_currency(price_list_rate, this.currency));
      if (!this.hide_images && image) {
        this.$item_image.html(`<img
					onerror="cur_pos.item_details.handle_broken_image(this)"
					class="h-full" src="${image}"
					alt="${frappe.get_abbr(item_name)}"
					style="object-fit: cover;">`);
      } else {
        this.$item_image.html(`<div class="item-abbr">${frappe.get_abbr(item_name)}</div>`);
      }
    }
    handle_broken_image($img) {
      const item_abbr = $($img).attr("alt");
      $($img).replaceWith(`<div class="item-abbr">${item_abbr}</div>`);
    }
    render_discount_dom(item) {
      if (item.discount_percentage) {
        this.$dicount_section.html(`<div class="item-rate">${format_currency(item.price_list_rate, this.currency)}</div>
				<div class="item-discount">${item.discount_percentage}% off</div>`);
        this.$item_price.html(format_currency(item.rate, this.currency));
      } else {
        this.$dicount_section.html(``);
      }
    }
    render_form(item) {
      const fields_to_display = this.get_form_fields(item);
      this.$form_container.html("");
      fields_to_display.forEach((fieldname, idx) => {
        this.$form_container.append(`<div class="${fieldname}-control" data-fieldname="${fieldname}"></div>`);
        const field_meta = this.item_meta.fields.find((df) => df.fieldname === fieldname);
        fieldname === "discount_percentage" ? field_meta.label = __("Discount (%)") : "";
        const me = this;
        this[`${fieldname}_control`] = frappe.ui.form.make_control({
          df: __spreadProps(__spreadValues({}, field_meta), {
            onchange: function() {
              me.events.form_updated(me.current_item, fieldname, this.value);
            }
          }),
          parent: this.$form_container.find(`.${fieldname}-control`),
          render_input: true
        });
        this[`${fieldname}_control`].set_value(item[fieldname]);
      });
      this.make_auto_serial_selection_btn(item);
      this.bind_custom_control_change_event();
    }
    get_form_fields(item) {
      const fields = ["qty", "uom", "rate", "conversion_factor", "discount_percentage", "warehouse", "actual_qty", "price_list_rate"];
      if (item.has_serial_no)
        fields.push("serial_no");
      if (item.has_batch_no)
        fields.push("batch_no");
      return fields;
    }
    make_auto_serial_selection_btn(item) {
      if (item.has_serial_no) {
        if (!item.has_batch_no) {
          this.$form_container.append(`<div class="grid-filler no-select"></div>`);
        }
        const label = __("Auto Fetch Serial Numbers");
        this.$form_container.append(`<div class="btn btn-sm btn-secondary auto-fetch-btn">${label}</div>`);
        this.$form_container.find(".serial_no-control").find("textarea").css("height", "6rem");
      }
    }
    bind_custom_control_change_event() {
      const me = this;
      if (this.rate_control) {
        this.rate_control.df.onchange = function() {
          if (this.value || flt(this.value) === 0) {
            me.events.form_updated(me.current_item, "rate", this.value).then(() => {
              const item_row = frappe.get_doc(me.doctype, me.name);
              const doc = me.events.get_frm().doc;
              me.$item_price.html(format_currency(item_row.rate, doc.currency));
              me.render_discount_dom(item_row);
            });
          }
        };
        this.rate_control.df.read_only = !this.allow_rate_change;
        this.rate_control.refresh();
      }
      if (this.discount_percentage_control && !this.allow_discount_change) {
        this.discount_percentage_control.df.read_only = 1;
        this.discount_percentage_control.refresh();
      }
      if (this.warehouse_control) {
        this.warehouse_control.df.reqd = 1;
        this.warehouse_control.df.onchange = function() {
          if (this.value) {
            me.events.form_updated(me.current_item, "warehouse", this.value).then(() => {
              me.item_stock_map = me.events.get_item_stock_map();
              const available_qty = me.item_stock_map[me.item_row.item_code] && me.item_stock_map[me.item_row.item_code][this.value];
              if (available_qty === void 0) {
                me.events.get_available_stock(me.item_row.item_code, this.value).then(() => {
                  me.warehouse_control.set_value(this.value);
                });
              } else if (available_qty === 0) {
                me.warehouse_control.set_value("");
                const bold_item_code = me.item_row.item_code.bold();
                const bold_warehouse = this.value.bold();
                frappe.throw(__("Item Code: {0} is not available under warehouse {1}.", [bold_item_code, bold_warehouse]));
              }
              me.actual_qty_control.set_value(available_qty);
            });
          }
        };
        this.warehouse_control.df.get_query = () => {
          return {
            filters: { company: this.events.get_frm().doc.company }
          };
        };
        this.warehouse_control.refresh();
      }
      if (this.serial_no_control) {
        this.serial_no_control.df.reqd = 1;
        this.serial_no_control.df.onchange = async function() {
          !me.current_item.batch_no && await me.auto_update_batch_no();
          me.events.form_updated(me.current_item, "serial_no", this.value);
        };
        this.serial_no_control.refresh();
      }
      if (this.batch_no_control) {
        this.batch_no_control.df.reqd = 1;
        this.batch_no_control.df.get_query = () => {
          return {
            query: "erpnext.controllers.queries.get_batch_no",
            filters: {
              item_code: me.item_row.item_code,
              warehouse: me.item_row.warehouse,
              posting_date: me.events.get_frm().doc.posting_date
            }
          };
        };
        this.batch_no_control.refresh();
      }
      if (this.uom_control) {
        this.uom_control.df.onchange = function() {
          me.events.form_updated(me.current_item, "uom", this.value);
          const item_row = frappe.get_doc(me.doctype, me.name);
          me.conversion_factor_control.df.read_only = item_row.stock_uom == this.value;
          me.conversion_factor_control.refresh();
        };
      }
      frappe.model.on("POS Invoice Item", "*", (fieldname, value, item_row) => {
        const field_control = this[`${fieldname}_control`];
        const item_row_is_being_edited = this.compare_with_current_item(item_row);
        if (item_row_is_being_edited && field_control && field_control.get_value() !== value) {
          field_control.set_value(value);
          cur_pos.update_cart_html(item_row);
        }
      });
    }
    async auto_update_batch_no() {
      if (this.serial_no_control && this.batch_no_control) {
        const selected_serial_nos = this.serial_no_control.get_value().split(`
`).filter((s) => s);
        if (!selected_serial_nos.length)
          return;
        const serials_with_batch_no = await frappe.db.get_list("Serial No", {
          filters: { "name": ["in", selected_serial_nos] },
          fields: ["batch_no", "name"]
        });
        const batch_serial_map = serials_with_batch_no.reduce((acc, r) => {
          if (!acc[r.batch_no]) {
            acc[r.batch_no] = [];
          }
          acc[r.batch_no] = [...acc[r.batch_no], r.name];
          return acc;
        }, {});
        const batch_no = Object.keys(batch_serial_map)[0];
        const batch_serial_nos = batch_serial_map[batch_no].join(`
`);
        const serial_nos_belongs_to_other_batch = selected_serial_nos.length !== batch_serial_map[batch_no].length;
        const current_batch_no = this.batch_no_control.get_value();
        current_batch_no != batch_no && await this.batch_no_control.set_value(batch_no);
        if (serial_nos_belongs_to_other_batch) {
          this.serial_no_control.set_value(batch_serial_nos);
          this.qty_control.set_value(batch_serial_map[batch_no].length);
          delete batch_serial_map[batch_no];
          this.events.clone_new_batch_item_in_frm(batch_serial_map, this.current_item);
        }
      }
    }
    bind_events() {
      this.bind_auto_serial_fetch_event();
      this.bind_fields_to_numpad_fields();
      this.$component.on("click", ".close-btn", () => {
        this.events.close_item_details();
      });
    }
    attach_shortcuts() {
      this.wrapper.find(".close-btn").attr("title", "Esc");
      frappe.ui.keys.on("escape", () => {
        const item_details_visible = this.$component.is(":visible");
        if (item_details_visible) {
          this.events.close_item_details();
        }
      });
    }
    bind_fields_to_numpad_fields() {
      const me = this;
      this.$form_container.on("click", ".input-with-feedback", function() {
        const fieldname = $(this).attr("data-fieldname");
        if (this.last_field_focused != fieldname) {
          me.events.item_field_focused(fieldname);
          this.last_field_focused = fieldname;
        }
      });
    }
    bind_auto_serial_fetch_event() {
      this.$form_container.on("click", ".auto-fetch-btn", () => {
        this.batch_no_control && this.batch_no_control.set_value("");
        let qty = this.qty_control.get_value();
        let conversion_factor = this.conversion_factor_control.get_value();
        let expiry_date = this.item_row.has_batch_no ? this.events.get_frm().doc.posting_date : "";
        let numbers = frappe.call({
          method: "erpnext.stock.doctype.serial_no.serial_no.auto_fetch_serial_number",
          args: {
            qty: qty * conversion_factor,
            item_code: this.current_item.item_code,
            warehouse: this.warehouse_control.get_value() || "",
            batch_nos: this.current_item.batch_no || "",
            posting_date: expiry_date,
            for_doctype: "POS Invoice"
          }
        });
        numbers.then((data) => {
          let auto_fetched_serial_numbers = data.message;
          let records_length = auto_fetched_serial_numbers.length;
          if (!records_length) {
            const warehouse = this.warehouse_control.get_value().bold();
            const item_code = this.current_item.item_code.bold();
            frappe.msgprint(__("Serial numbers unavailable for Item {0} under warehouse {1}. Please try changing warehouse.", [item_code, warehouse]));
          } else if (records_length < qty) {
            frappe.msgprint(__("Fetched only {0} available serial numbers.", [records_length]));
            this.qty_control.set_value(records_length);
          }
          numbers = auto_fetched_serial_numbers.join(`
`);
          this.serial_no_control.set_value(numbers);
        });
      });
    }
    toggle_component(show) {
      show ? this.$component.css("display", "flex") : this.$component.css("display", "none");
    }
  };

  // ../pasigono/pasigono/custom_scripts/pos_scripts/pos_item_details.js
  erpnext.PointOfSale.ItemDetails = class extends erpnext.PointOfSale.ItemDetails {
    async init_child_components() {
      this.$component.html(`<div class="item-details-header">
				<div class="label">Item Details</div>
				<div class="close-btn">
					<svg width="32" height="32" viewBox="0 0 14 14" fill="none">
						<path d="M4.93764 4.93759L7.00003 6.99998M9.06243 9.06238L7.00003 6.99998M7.00003 6.99998L4.93764 9.06238L9.06243 4.93759" stroke="#8D99A6"/>
					</svg>
				</div>
			</div>
			<div class="item-display">
				<div class="item-name-desc-price">
					<div class="item-name"></div>
					<div class="item-desc"></div>
					<div class="item-price"></div>
				</div>
				<div class="item-image"></div>
			</div>
			<div class="discount-section"></div>
			<div class="form-container"></div>
			<div>
				<div class="btn" id="sendData" style="display: none;">Get Weight</div>
			</div>`);
      this.$item_name = this.$component.find(".item-name");
      this.$item_description = this.$component.find(".item-desc");
      this.$item_price = this.$component.find(".item-price");
      this.$item_image = this.$component.find(".item-image");
      this.$form_container = this.$component.find(".form-container");
      this.$dicount_section = this.$component.find(".discount-section");
      if (window.enable_weigh_scale == 1) {
        window.checkPort(false);
        if (typeof window.mettlerWorker == "undefined") {
          var me = this;
          window.mettlerWorker = new Worker("/assets/js/pos-mettler-toledo.min.js");
          window.mettlerWorker.onmessage = function(e) {
            if (e.data.message == "No Port") {
              window.checkPort(true);
            } else if (e.data.message == "weight" && window.is_item_details_open) {
              window.weight = e.data.weight;
              setTimeout(function() {
                me.qty_control.set_value(window.weight);
              }, 300);
            }
          };
          window.mettlerWorker.postMessage({ "command": "connect" });
        }
        this.$component.on("click", "#sendData", () => {
        });
      }
    }
    async toggle_item_details_section(item) {
      window.is_item_details_open = true;
      const current_item_changed = !this.compare_with_current_item(item);
      const hide_item_details = !Boolean(item) || !current_item_changed;
      this.events.toggle_item_selector(!hide_item_details);
      this.toggle_component(!hide_item_details);
      if (!hide_item_details && current_item_changed || hide_item_details) {
        await this.validate_serial_batch_item();
      }
      if (item && current_item_changed) {
        this.doctype = item.doctype;
        this.item_meta = frappe.get_meta(this.doctype);
        this.name = item.name;
        this.item_row = item;
        this.currency = this.events.get_frm().doc.currency;
        this.current_item = item;
        this.render_dom(item);
        this.render_discount_dom(item);
        this.render_form(item);
        this.events.highlight_cart_item(item);
        window.old_weight = 0;
      } else {
        this.current_item = {};
      }
      if (window.enable_weigh_scale == 1) {
        window.mettlerWorker.postMessage({ "command": "start" });
      }
    }
  };

  // ../pasigono/pasigono/pos_assets/pos_number_pad.js
  erpnext.PointOfSale.NumberPad = class {
    constructor({ wrapper, events, cols, keys, css_classes, fieldnames_map }) {
      this.wrapper = wrapper;
      this.events = events;
      this.cols = cols;
      this.keys = keys;
      this.css_classes = css_classes || [];
      this.fieldnames = fieldnames_map || {};
      this.init_component();
    }
    init_component() {
      this.prepare_dom();
      this.bind_events();
    }
    prepare_dom() {
      const { cols, keys, css_classes, fieldnames } = this;
      function get_keys() {
        return keys.reduce((a, row, i) => {
          return a + row.reduce((a2, number, j) => {
            const class_to_append = css_classes && css_classes[i] ? css_classes[i][j] : "";
            const fieldname = fieldnames && fieldnames[number] ? fieldnames[number] : typeof number === "string" ? frappe.scrub(number) : number;
            return a2 + `<div class="numpad-btn ${class_to_append}" data-button-value="${fieldname}">${__(number)}</div>`;
          }, "");
        }, "");
      }
      this.wrapper.html(`<div class="numpad-container">
				${get_keys()}
			</div>`);
    }
    bind_events() {
      const me = this;
      this.wrapper.on("click", ".numpad-btn", function() {
        const $btn = $(this);
        me.events.numpad_event($btn);
      });
    }
  };

  // ../pasigono/pasigono/pos_assets/pos_payment.js
  erpnext.PointOfSale.Payment = class {
    constructor({ events, wrapper }) {
      this.wrapper = wrapper;
      this.events = events;
      this.init_component();
    }
    init_component() {
      this.prepare_dom();
      this.initialize_numpad();
      this.bind_events();
      this.attach_shortcuts();
    }
    prepare_dom() {
      this.wrapper.append(`<section class="payment-container">
				<div class="section-label payment-section">${__("Payment Method")}</div>
				<div class="payment-modes"></div>
				<div class="fields-numpad-container">
					<div class="fields-section">
						<div class="section-label">${__("Additional Information")}</div>
						<div class="invoice-fields"></div>
					</div>
					<div class="number-pad"></div>
				</div>
				<div class="totals-section">
					<div class="totals"></div>
				</div>
				<div class="submit-order-btn">${__("Complete Order")}</div>
			</section>`);
      this.$component = this.wrapper.find(".payment-container");
      this.$payment_modes = this.$component.find(".payment-modes");
      this.$totals_section = this.$component.find(".totals-section");
      this.$totals = this.$component.find(".totals");
      this.$numpad = this.$component.find(".number-pad");
      this.$invoice_fields_section = this.$component.find(".fields-section");
    }
    make_invoice_fields_control() {
      frappe.db.get_doc("POS Settings", void 0).then((doc) => {
        const fields = doc.invoice_fields;
        if (!fields.length)
          return;
        this.$invoice_fields = this.$invoice_fields_section.find(".invoice-fields");
        this.$invoice_fields.html("");
        const frm = this.events.get_frm();
        fields.forEach((df) => {
          this.$invoice_fields.append(`<div class="invoice_detail_field ${df.fieldname}-field" data-fieldname="${df.fieldname}"></div>`);
          let df_events = {
            onchange: function() {
              frm.set_value(this.df.fieldname, this.get_value());
            }
          };
          if (df.fieldtype == "Button") {
            df_events = {
              click: function() {
                if (frm.script_manager.has_handlers(df.fieldname, frm.doc.doctype)) {
                  frm.script_manager.trigger(df.fieldname, frm.doc.doctype, frm.doc.docname);
                }
              }
            };
          }
          this[`${df.fieldname}_field`] = frappe.ui.form.make_control({
            df: __spreadValues(__spreadValues({}, df), df_events),
            parent: this.$invoice_fields.find(`.${df.fieldname}-field`),
            render_input: true
          });
          this[`${df.fieldname}_field`].set_value(frm.doc[df.fieldname]);
        });
      });
    }
    initialize_numpad() {
      const me = this;
      this.number_pad = new erpnext.PointOfSale.NumberPad({
        wrapper: this.$numpad,
        events: {
          numpad_event: function($btn) {
            me.on_numpad_clicked($btn);
          }
        },
        cols: 3,
        keys: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [".", 0, "Delete"]
        ]
      });
      this.numpad_value = "";
    }
    on_numpad_clicked($btn) {
      const button_value = $btn.attr("data-button-value");
      highlight_numpad_btn($btn);
      this.numpad_value = button_value === "delete" ? this.numpad_value.slice(0, -1) : this.numpad_value + button_value;
      this.selected_mode.$input.get(0).focus();
      this.selected_mode.set_value(this.numpad_value);
      function highlight_numpad_btn($btn2) {
        $btn2.addClass("shadow-base-inner bg-selected");
        setTimeout(() => {
          $btn2.removeClass("shadow-base-inner bg-selected");
        }, 100);
      }
    }
    bind_events() {
      const me = this;
      this.$payment_modes.on("click", ".mode-of-payment", function(e) {
        const mode_clicked = $(this);
        if (!$(e.target).is(mode_clicked))
          return;
        const scrollLeft = mode_clicked.offset().left - me.$payment_modes.offset().left + me.$payment_modes.scrollLeft();
        me.$payment_modes.animate({ scrollLeft });
        const mode = mode_clicked.attr("data-mode");
        $(`.mode-of-payment-control`).css("display", "none");
        $(`.cash-shortcuts`).css("display", "none");
        me.$payment_modes.find(`.pay-amount`).css("display", "inline");
        me.$payment_modes.find(`.loyalty-amount-name`).css("display", "none");
        $(".mode-of-payment").removeClass("border-primary");
        if (mode_clicked.hasClass("border-primary")) {
          mode_clicked.removeClass("border-primary");
          me.selected_mode = "";
        } else {
          mode_clicked.addClass("border-primary");
          mode_clicked.find(".mode-of-payment-control").css("display", "flex");
          mode_clicked.find(".cash-shortcuts").css("display", "grid");
          me.$payment_modes.find(`.${mode}-amount`).css("display", "none");
          me.$payment_modes.find(`.${mode}-name`).css("display", "inline");
          me.selected_mode = me[`${mode}_control`];
          me.selected_mode && me.selected_mode.$input.get(0).focus();
          me.auto_set_remaining_amount();
        }
      });
      frappe.ui.form.on("POS Invoice", "contact_mobile", (frm) => {
        var _a;
        const contact = frm.doc.contact_mobile;
        const request_button = $((_a = this.request_for_payment_field) == null ? void 0 : _a.$input[0]);
        if (contact) {
          request_button.removeClass("btn-default").addClass("btn-primary");
        } else {
          request_button.removeClass("btn-primary").addClass("btn-default");
        }
      });
      frappe.ui.form.on("POS Invoice", "coupon_code", (frm) => {
        if (frm.doc.coupon_code && !frm.applying_pos_coupon_code) {
          if (!frm.doc.ignore_pricing_rule) {
            frm.applying_pos_coupon_code = true;
            frappe.run_serially([
              () => frm.doc.ignore_pricing_rule = 1,
              () => frm.trigger("ignore_pricing_rule"),
              () => frm.doc.ignore_pricing_rule = 0,
              () => frm.trigger("apply_pricing_rule"),
              () => frm.save(),
              () => this.update_totals_section(frm.doc),
              () => frm.applying_pos_coupon_code = false
            ]);
          } else if (frm.doc.ignore_pricing_rule) {
            frappe.show_alert({
              message: __("Ignore Pricing Rule is enabled. Cannot apply coupon code."),
              indicator: "orange"
            });
          }
        }
      });
      this.setup_listener_for_payments();
      this.$payment_modes.on("click", ".shortcut", function() {
        const value = $(this).attr("data-value");
        me.selected_mode.set_value(value);
      });
      this.$component.on("click", ".submit-order-btn", () => {
        const doc = this.events.get_frm().doc;
        const paid_amount = doc.paid_amount;
        const items = doc.items;
        if (paid_amount == 0 || !items.length) {
          const message = items.length ? __("You cannot submit the order without payment.") : __("You cannot submit empty order.");
          frappe.show_alert({ message, indicator: "orange" });
          frappe.utils.play_sound("error");
          return;
        }
        this.events.submit_invoice();
      });
      frappe.ui.form.on("POS Invoice", "paid_amount", (frm) => {
        this.update_totals_section(frm.doc);
        const is_cash_shortcuts_invisible = !this.$payment_modes.find(".cash-shortcuts").is(":visible");
        this.attach_cash_shortcuts(frm.doc);
        !is_cash_shortcuts_invisible && this.$payment_modes.find(".cash-shortcuts").css("display", "grid");
        this.render_payment_mode_dom();
      });
      frappe.ui.form.on("POS Invoice", "loyalty_amount", (frm) => {
        const formatted_currency = format_currency(frm.doc.loyalty_amount, frm.doc.currency);
        this.$payment_modes.find(`.loyalty-amount-amount`).html(formatted_currency);
      });
      frappe.ui.form.on("Sales Invoice Payment", "amount", (frm, cdt, cdn) => {
        const default_mop = locals[cdt][cdn];
        const mode = default_mop.mode_of_payment.replace(/ +/g, "_").toLowerCase();
        if (this[`${mode}_control`] && this[`${mode}_control`].get_value() != default_mop.amount) {
          this[`${mode}_control`].set_value(default_mop.amount);
        }
      });
    }
    setup_listener_for_payments() {
      frappe.realtime.on("process_phone_payment", (data) => {
        const doc = this.events.get_frm().doc;
        const { response, amount, success, failure_message } = data;
        let message, title;
        if (success) {
          title = __("Payment Received");
          const grand_total = cint(frappe.sys_defaults.disable_rounded_total) ? doc.grand_total : doc.rounded_total;
          if (amount >= grand_total) {
            frappe.dom.unfreeze();
            message = __("Payment of {0} received successfully.", [format_currency(amount, doc.currency, 0)]);
            this.events.submit_invoice();
            cur_frm.reload_doc();
          } else {
            message = __("Payment of {0} received successfully. Waiting for other requests to complete...", [format_currency(amount, doc.currency, 0)]);
          }
        } else if (failure_message) {
          message = failure_message;
          title = __("Payment Failed");
        }
        frappe.msgprint({ "message": message, "title": title });
      });
    }
    auto_set_remaining_amount() {
      const doc = this.events.get_frm().doc;
      const grand_total = cint(frappe.sys_defaults.disable_rounded_total) ? doc.grand_total : doc.rounded_total;
      const remaining_amount = grand_total - doc.paid_amount;
      const current_value = this.selected_mode ? this.selected_mode.get_value() : void 0;
      if (!current_value && remaining_amount > 0 && this.selected_mode) {
        this.selected_mode.set_value(remaining_amount);
      }
    }
    attach_shortcuts() {
      const ctrl_label = frappe.utils.is_mac() ? "\u2318" : "Ctrl";
      this.$component.find(".submit-order-btn").attr("title", `${ctrl_label}+Enter`);
      frappe.ui.keys.on("ctrl+enter", () => {
        const payment_is_visible = this.$component.is(":visible");
        const active_mode = this.$payment_modes.find(".border-primary");
        if (payment_is_visible && active_mode.length) {
          this.$component.find(".submit-order-btn").click();
        }
      });
      frappe.ui.keys.add_shortcut({
        shortcut: "tab",
        action: () => {
          const payment_is_visible = this.$component.is(":visible");
          let active_mode = this.$payment_modes.find(".border-primary");
          active_mode = active_mode.length ? active_mode.attr("data-mode") : void 0;
          if (!active_mode)
            return;
          const mode_of_payments = Array.from(this.$payment_modes.find(".mode-of-payment")).map((m) => $(m).attr("data-mode"));
          const mode_index = mode_of_payments.indexOf(active_mode);
          const next_mode_index = (mode_index + 1) % mode_of_payments.length;
          const next_mode_to_be_clicked = this.$payment_modes.find(`.mode-of-payment[data-mode="${mode_of_payments[next_mode_index]}"]`);
          if (payment_is_visible && mode_index != next_mode_index) {
            next_mode_to_be_clicked.click();
          }
        },
        condition: () => this.$component.is(":visible") && this.$payment_modes.find(".border-primary").length,
        description: __("Switch Between Payment Modes"),
        ignore_inputs: true,
        page: cur_page.page.page
      });
    }
    toggle_numpad() {
    }
    render_payment_section() {
      this.render_payment_mode_dom();
      this.make_invoice_fields_control();
      this.update_totals_section();
      this.focus_on_default_mop();
    }
    edit_cart() {
      this.events.toggle_other_sections(false);
      this.toggle_component(false);
    }
    checkout() {
      this.events.toggle_other_sections(true);
      this.toggle_component(true);
      this.render_payment_section();
    }
    toggle_remarks_control() {
      if (this.$remarks.find(".frappe-control").length) {
        this.$remarks.html("+ Add Remark");
      } else {
        this.$remarks.html("");
        this[`remark_control`] = frappe.ui.form.make_control({
          df: {
            label: __("Remark"),
            fieldtype: "Data",
            onchange: function() {
            }
          },
          parent: this.$totals_section.find(`.remarks`),
          render_input: true
        });
        this[`remark_control`].set_value("");
      }
    }
    render_payment_mode_dom() {
      const doc = this.events.get_frm().doc;
      const payments = doc.payments;
      const currency = doc.currency;
      this.$payment_modes.html(`${payments.map((p, i) => {
        const mode = p.mode_of_payment.replace(/ +/g, "_").toLowerCase();
        const payment_type = p.type;
        const margin = i % 2 === 0 ? "pr-2" : "pl-2";
        const amount = p.amount > 0 ? format_currency(p.amount, currency) : "";
        return `
					<div class="payment-mode-wrapper">
						<div class="mode-of-payment" data-mode="${mode}" data-payment-type="${payment_type}">
							${p.mode_of_payment}
							<div class="${mode}-amount pay-amount">${amount}</div>
							<div class="${mode} mode-of-payment-control"></div>
						</div>
					</div>
				`;
      }).join("")}`);
      payments.forEach((p) => {
        const mode = p.mode_of_payment.replace(/ +/g, "_").toLowerCase();
        const me = this;
        this[`${mode}_control`] = frappe.ui.form.make_control({
          df: {
            label: p.mode_of_payment,
            fieldtype: "Currency",
            placeholder: __("Enter {0} amount.", [p.mode_of_payment]),
            onchange: function() {
              const current_value = frappe.model.get_value(p.doctype, p.name, "amount");
              if (current_value != this.value) {
                frappe.model.set_value(p.doctype, p.name, "amount", flt(this.value)).then(() => me.update_totals_section());
                const formatted_currency = format_currency(this.value, currency);
                me.$payment_modes.find(`.${mode}-amount`).html(formatted_currency);
              }
            }
          },
          parent: this.$payment_modes.find(`.${mode}.mode-of-payment-control`),
          render_input: true
        });
        this[`${mode}_control`].toggle_label(false);
        this[`${mode}_control`].set_value(p.amount);
      });
      this.render_loyalty_points_payment_mode();
      this.attach_cash_shortcuts(doc);
    }
    focus_on_default_mop() {
      const doc = this.events.get_frm().doc;
      const payments = doc.payments;
      payments.forEach((p) => {
        const mode = p.mode_of_payment.replace(/ +/g, "_").toLowerCase();
        if (p.default) {
          setTimeout(() => {
            this.$payment_modes.find(`.${mode}.mode-of-payment-control`).parent().click();
          }, 500);
        }
      });
    }
    attach_cash_shortcuts(doc) {
      const grand_total = cint(frappe.sys_defaults.disable_rounded_total) ? doc.grand_total : doc.rounded_total;
      const currency = doc.currency;
      const shortcuts = this.get_cash_shortcuts(flt(grand_total));
      this.$payment_modes.find(".cash-shortcuts").remove();
      let shortcuts_html = shortcuts.map((s) => {
        return `<div class="shortcut" data-value="${s}">${format_currency(s, currency, 0)}</div>`;
      }).join("");
      this.$payment_modes.find('[data-payment-type="Cash"]').find(".mode-of-payment-control").after(`<div class="cash-shortcuts">${shortcuts_html}</div>`);
    }
    get_cash_shortcuts(grand_total) {
      let steps = [1, 5, 10];
      const digits = String(Math.round(grand_total)).length;
      steps = steps.map((x) => x * 10 ** (digits - 2));
      const get_nearest = (amount, x) => {
        let nearest_x = Math.ceil(amount / x) * x;
        return nearest_x === amount ? nearest_x + x : nearest_x;
      };
      return steps.reduce((finalArr, x) => {
        let nearest_x = get_nearest(grand_total, x);
        nearest_x = finalArr.indexOf(nearest_x) != -1 ? nearest_x + x : nearest_x;
        return [...finalArr, nearest_x];
      }, []);
    }
    render_loyalty_points_payment_mode() {
      const me = this;
      const doc = this.events.get_frm().doc;
      const { loyalty_program, loyalty_points, conversion_factor } = this.events.get_customer_details();
      this.$payment_modes.find(`.mode-of-payment[data-mode="loyalty-amount"]`).parent().remove();
      if (!loyalty_program)
        return;
      let description, read_only, max_redeemable_amount;
      if (!loyalty_points) {
        description = __("You don't have enough points to redeem.");
        read_only = true;
      } else {
        max_redeemable_amount = flt(flt(loyalty_points) * flt(conversion_factor), precision("loyalty_amount", doc));
        description = __("You can redeem upto {0}.", [format_currency(max_redeemable_amount)]);
        read_only = false;
      }
      const margin = this.$payment_modes.children().length % 2 === 0 ? "pr-2" : "pl-2";
      const amount = doc.loyalty_amount > 0 ? format_currency(doc.loyalty_amount, doc.currency) : "";
      this.$payment_modes.append(`<div class="payment-mode-wrapper">
				<div class="mode-of-payment loyalty-card" data-mode="loyalty-amount" data-payment-type="loyalty-amount">
					Redeem Loyalty Points
					<div class="loyalty-amount-amount pay-amount">${amount}</div>
					<div class="loyalty-amount-name">${loyalty_program}</div>
					<div class="loyalty-amount mode-of-payment-control"></div>
				</div>
			</div>`);
      this["loyalty-amount_control"] = frappe.ui.form.make_control({
        df: {
          label: __("Redeem Loyalty Points"),
          fieldtype: "Currency",
          placeholder: __("Enter amount to be redeemed."),
          options: "company:currency",
          read_only,
          onchange: async function() {
            if (!loyalty_points)
              return;
            if (this.value > max_redeemable_amount) {
              frappe.show_alert({
                message: __("You cannot redeem more than {0}.", [format_currency(max_redeemable_amount)]),
                indicator: "red"
              });
              frappe.utils.play_sound("submit");
              me["loyalty-amount_control"].set_value(0);
              return;
            }
            const redeem_loyalty_points = this.value > 0 ? 1 : 0;
            await frappe.model.set_value(doc.doctype, doc.name, "redeem_loyalty_points", redeem_loyalty_points);
            frappe.model.set_value(doc.doctype, doc.name, "loyalty_points", parseInt(this.value / conversion_factor));
          },
          description
        },
        parent: this.$payment_modes.find(`.loyalty-amount.mode-of-payment-control`),
        render_input: true
      });
      this["loyalty-amount_control"].toggle_label(false);
    }
    render_add_payment_method_dom() {
      const docstatus = this.events.get_frm().doc.docstatus;
      if (docstatus === 0)
        this.$payment_modes.append(`<div class="w-full pr-2">
					<div class="add-mode-of-payment w-half text-grey mb-4 no-select pointer">+ Add Payment Method</div>
				</div>`);
    }
    update_totals_section(doc) {
      if (!doc)
        doc = this.events.get_frm().doc;
      const paid_amount = doc.paid_amount;
      const grand_total = cint(frappe.sys_defaults.disable_rounded_total) ? doc.grand_total : doc.rounded_total;
      const remaining = grand_total - doc.paid_amount;
      const change = doc.change_amount || remaining <= 0 ? -1 * remaining : void 0;
      const currency = doc.currency;
      const label = change ? __("Change") : __("To Be Paid");
      this.$totals.html(`<div class="col">
				<div class="total-label">${__("Grand Total")}</div>
				<div class="value">${format_currency(grand_total, currency)}</div>
			</div>
			<div class="seperator-y"></div>
			<div class="col">
				<div class="total-label">${__("Paid Amount")}</div>
				<div class="value">${format_currency(paid_amount, currency)}</div>
			</div>
			<div class="seperator-y"></div>
			<div class="col">
				<div class="total-label">${label}</div>
				<div class="value">${format_currency(change || remaining, currency)}</div>
			</div>`);
    }
    toggle_component(show) {
      show ? this.$component.css("display", "flex") : this.$component.css("display", "none");
    }
  };

  // ../pasigono/pasigono/custom_scripts/pos_scripts/pos_payment.js
  erpnext.PointOfSale.Payment = class extends erpnext.PointOfSale.Payment {
    prepare_dom() {
      this.wrapper.append(`<section class="payment-container">
				<div class="section-label payment-section">Payment Method</div>
				<div class="payment-modes"></div>
				<div class="fields-numpad-container">
					<div class="fields-section">
						<div class="section-label">Additional Information</div>
						<div class="invoice-fields"></div>
					</div>
					<div class="number-pad"></div>
				</div>
				<div class="totals-section">
					<div class="totals"></div>
				</div>
				<div class="submit-order-btn">Complete Order</div>
			</section>`);
      this.$component = this.wrapper.find(".payment-container");
      this.$payment_modes = this.$component.find(".payment-modes");
      this.$totals_section = this.$component.find(".totals-section");
      this.$totals = this.$component.find(".totals");
      this.$numpad = this.$component.find(".number-pad");
      this.$invoice_fields_section = this.$component.find(".fields-section");
    }
    make_invoice_fields_control() {
      frappe.db.get_doc("POS Settings", void 0).then((doc) => {
        const fields = doc.invoice_fields;
        if (!fields.length)
          return;
        this.$invoice_fields = this.$invoice_fields_section.find(".invoice-fields");
        this.$invoice_fields.html("");
        const frm = this.events.get_frm();
        fields.forEach((df) => {
          this.$invoice_fields.append(`<div class="invoice_detail_field ${df.fieldname}-field" data-fieldname="${df.fieldname}"></div>`);
          let df_events = {
            onchange: function() {
              frm.set_value(this.df.fieldname, this.get_value());
            }
          };
          if (df.fieldtype == "Button") {
            df_events = {
              click: function() {
                if (frm.script_manager.has_handlers(df.fieldname, frm.doc.doctype)) {
                  frm.script_manager.trigger(df.fieldname, frm.doc.doctype, frm.doc.docname);
                }
              }
            };
          }
          this[`${df.fieldname}_field`] = frappe.ui.form.make_control({
            df: __spreadValues(__spreadValues({}, df), df_events),
            parent: this.$invoice_fields.find(`.${df.fieldname}-field`),
            render_input: true
          });
          this[`${df.fieldname}_field`].set_value(frm.doc[df.fieldname]);
        });
      });
      if (window.enable_raw_print == 1) {
        this.$invoice_fields_section.find(".invoice-fields").append(`<div style="position: absolute; bottom: 0; width: 100%; margin-bottom: 10px;" class="summary-btn btn btn-default cash-drawer-btn">
					Open Cash Drawer
				</div>`);
      }
    }
    bind_events() {
      const me = this;
      this.$payment_modes.on("click", ".mode-of-payment", function(e) {
        const mode_clicked = $(this);
        if (!$(e.target).is(mode_clicked))
          return;
        const scrollLeft = mode_clicked.offset().left - me.$payment_modes.offset().left + me.$payment_modes.scrollLeft();
        me.$payment_modes.animate({ scrollLeft });
        const mode = mode_clicked.attr("data-mode");
        $(`.mode-of-payment-control`).css("display", "none");
        $(`.cash-shortcuts`).css("display", "none");
        me.$payment_modes.find(`.pay-amount`).css("display", "inline");
        me.$payment_modes.find(`.loyalty-amount-name`).css("display", "none");
        $(".mode-of-payment").removeClass("border-primary");
        if (mode_clicked.hasClass("border-primary")) {
          mode_clicked.removeClass("border-primary");
          me.selected_mode = "";
        } else {
          mode_clicked.addClass("border-primary");
          mode_clicked.find(".mode-of-payment-control").css("display", "flex");
          mode_clicked.find(".cash-shortcuts").css("display", "grid");
          me.$payment_modes.find(`.${mode}-amount`).css("display", "none");
          me.$payment_modes.find(`.${mode}-name`).css("display", "inline");
          me.selected_mode = me[`${mode}_control`];
          me.selected_mode && me.selected_mode.$input.get(0).focus();
          me.auto_set_remaining_amount();
        }
      });
      frappe.ui.form.on("POS Invoice", "contact_mobile", (frm) => {
        const contact = frm.doc.contact_mobile;
        const request_button = $(this.request_for_payment_field.$input[0]);
        if (contact) {
          request_button.removeClass("btn-default").addClass("btn-primary");
        } else {
          request_button.removeClass("btn-primary").addClass("btn-default");
        }
      });
      frappe.ui.form.on("POS Invoice", "coupon_code", (frm) => {
        if (frm.doc.coupon_code && !frm.applying_pos_coupon_code) {
          if (!frm.doc.ignore_pricing_rule) {
            frm.applying_pos_coupon_code = true;
            frappe.run_serially([
              () => frm.doc.ignore_pricing_rule = 1,
              () => frm.trigger("ignore_pricing_rule"),
              () => frm.doc.ignore_pricing_rule = 0,
              () => frm.trigger("apply_pricing_rule"),
              () => frm.save(),
              () => this.update_totals_section(frm.doc),
              () => frm.applying_pos_coupon_code = false
            ]);
          } else if (frm.doc.ignore_pricing_rule) {
            frappe.show_alert({
              message: __("Ignore Pricing Rule is enabled. Cannot apply coupon code."),
              indicator: "orange"
            });
          }
        }
      });
      this.setup_listener_for_payments();
      this.$payment_modes.on("click", ".shortcut", function() {
        const value = $(this).attr("data-value");
        me.selected_mode.set_value(value);
      });
      this.$component.on("click", ".submit-order-btn", () => {
        const doc = this.events.get_frm().doc;
        const paid_amount = doc.paid_amount;
        const items = doc.items;
        if (paid_amount == 0 || !items.length) {
          const message = items.length ? __("You cannot submit the order without payment.") : __("You cannot submit empty order.");
          frappe.show_alert({ message, indicator: "orange" });
          frappe.utils.play_sound("error");
          return;
        }
        this.events.submit_invoice();
      });
      frappe.ui.form.on("POS Invoice", "paid_amount", (frm) => {
        this.update_totals_section(frm.doc);
        const is_cash_shortcuts_invisible = !this.$payment_modes.find(".cash-shortcuts").is(":visible");
        this.attach_cash_shortcuts(frm.doc);
        !is_cash_shortcuts_invisible && this.$payment_modes.find(".cash-shortcuts").css("display", "grid");
        this.render_payment_mode_dom();
      });
      frappe.ui.form.on("POS Invoice", "loyalty_amount", (frm) => {
        const formatted_currency = format_currency(frm.doc.loyalty_amount, frm.doc.currency);
        this.$payment_modes.find(`.loyalty-amount-amount`).html(formatted_currency);
      });
      frappe.ui.form.on("Sales Invoice Payment", "amount", (frm, cdt, cdn) => {
        const default_mop = locals[cdt][cdn];
        const mode = default_mop.mode_of_payment.replace(/ +/g, "_").toLowerCase();
        if (this[`${mode}_control`] && this[`${mode}_control`].get_value() != default_mop.amount) {
          this[`${mode}_control`].set_value(default_mop.amount);
        }
      });
      this.$component.on("click", ".cash-drawer-btn", () => {
        this.events.open_cash_drawer();
      });
    }
    checkout() {
      this.events.toggle_other_sections(true);
      this.toggle_component(true);
      this.render_payment_section();
      if (window.enable_weigh_scale == 1) {
        if (typeof window.mettlerWorker != "undefined") {
          window.mettlerWorker.postMessage({ "command": "stop" });
        }
      }
    }
  };

  // ../pasigono/pasigono/pos_assets/pos_past_order_list.js
  erpnext.PointOfSale.PastOrderList = class {
    constructor({ wrapper, events }) {
      this.wrapper = wrapper;
      this.events = events;
      this.init_component();
    }
    init_component() {
      this.prepare_dom();
      this.make_filter_section();
      this.bind_events();
    }
    prepare_dom() {
      this.wrapper.append(`<section class="past-order-list">
				<div class="filter-section">
					<div class="label">${__("Recent Orders")}</div>
					<div class="search-field"></div>
					<div class="status-field"></div>
				</div>
				<div class="invoices-container"></div>
			</section>`);
      this.$component = this.wrapper.find(".past-order-list");
      this.$invoices_container = this.$component.find(".invoices-container");
    }
    bind_events() {
      this.search_field.$input.on("input", (e) => {
        clearTimeout(this.last_search);
        this.last_search = setTimeout(() => {
          const search_term = e.target.value;
          this.refresh_list(search_term, this.status_field.get_value());
        }, 300);
      });
      const me = this;
      this.$invoices_container.on("click", ".invoice-wrapper", function() {
        const invoice_name = unescape($(this).attr("data-invoice-name"));
        me.events.open_invoice_data(invoice_name);
      });
    }
    make_filter_section() {
      const me = this;
      this.search_field = frappe.ui.form.make_control({
        df: {
          label: __("Search"),
          fieldtype: "Data",
          placeholder: __("Search by invoice id or customer name")
        },
        parent: this.$component.find(".search-field"),
        render_input: true
      });
      this.status_field = frappe.ui.form.make_control({
        df: {
          label: __("Invoice Status"),
          fieldtype: "Select",
          options: `Draft
Paid
Consolidated
Return`,
          placeholder: __("Filter by invoice status"),
          onchange: function() {
            if (me.$component.is(":visible"))
              me.refresh_list();
          }
        },
        parent: this.$component.find(".status-field"),
        render_input: true
      });
      this.search_field.toggle_label(false);
      this.status_field.toggle_label(false);
      this.status_field.set_value("Draft");
    }
    refresh_list() {
      frappe.dom.freeze();
      this.events.reset_summary();
      const search_term = this.search_field.get_value();
      const status = this.status_field.get_value();
      this.$invoices_container.html("");
      return frappe.call({
        method: "erpnext.selling.page.point_of_sale.point_of_sale.get_past_order_list",
        freeze: true,
        args: { search_term, status },
        callback: (response) => {
          frappe.dom.unfreeze();
          response.message.forEach((invoice) => {
            const invoice_html = this.get_invoice_html(invoice);
            this.$invoices_container.append(invoice_html);
          });
        }
      });
    }
    get_invoice_html(invoice) {
      const posting_datetime = moment(invoice.posting_date + " " + invoice.posting_time).format("Do MMMM, h:mma");
      return `<div class="invoice-wrapper" data-invoice-name="${escape(invoice.name)}">
				<div class="invoice-name-date">
					<div class="invoice-name">${invoice.name}</div>
					<div class="invoice-date">
						<svg class="mr-2" width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
						</svg>
						${frappe.ellipsis(invoice.customer, 20)}
					</div>
				</div>
				<div class="invoice-total-status">
					<div class="invoice-total">${format_currency(invoice.grand_total, invoice.currency, 0) || 0}</div>
					<div class="invoice-date">${posting_datetime}</div>
				</div>
			</div>
			<div class="seperator"></div>`;
    }
    toggle_component(show) {
      show ? this.$component.css("display", "flex") && this.refresh_list() : this.$component.css("display", "none");
    }
  };

  // ../pasigono/pasigono/pos_assets/pos_past_order_summary.js
  erpnext.PointOfSale.PastOrderSummary = class {
    constructor({ wrapper, events }) {
      this.wrapper = wrapper;
      this.events = events;
      this.init_component();
    }
    init_component() {
      this.prepare_dom();
      this.init_email_print_dialog();
      this.bind_events();
      this.attach_shortcuts();
    }
    prepare_dom() {
      this.wrapper.append(`<section class="past-order-summary">
				<div class="no-summary-placeholder">
					${__("Select an invoice to load summary data")}
				</div>
				<div class="invoice-summary-wrapper">
					<div class="abs-container">
						<div class="upper-section"></div>
						<div class="label">${__("Items")}</div>
						<div class="items-container summary-container"></div>
						<div class="label">${__("Totals")}</div>
						<div class="totals-container summary-container"></div>
						<div class="label">${__("Payments")}</div>
						<div class="payments-container summary-container"></div>
						<div class="summary-btns"></div>
					</div>
				</div>
			</section>`);
      this.$component = this.wrapper.find(".past-order-summary");
      this.$summary_wrapper = this.$component.find(".invoice-summary-wrapper");
      this.$summary_container = this.$component.find(".abs-container");
      this.$upper_section = this.$summary_container.find(".upper-section");
      this.$items_container = this.$summary_container.find(".items-container");
      this.$totals_container = this.$summary_container.find(".totals-container");
      this.$payment_container = this.$summary_container.find(".payments-container");
      this.$summary_btns = this.$summary_container.find(".summary-btns");
    }
    init_email_print_dialog() {
      const email_dialog = new frappe.ui.Dialog({
        title: "Email Receipt",
        fields: [
          { fieldname: "email_id", fieldtype: "Data", options: "Email", label: "Email ID" }
        ],
        primary_action: () => {
          this.send_email();
        },
        primary_action_label: __("Send")
      });
      this.email_dialog = email_dialog;
      const print_dialog = new frappe.ui.Dialog({
        title: "Print Receipt",
        fields: [
          { fieldname: "print", fieldtype: "Data", label: "Print Preview" }
        ],
        primary_action: () => {
          this.print_receipt();
        },
        primary_action_label: __("Print")
      });
      this.print_dialog = print_dialog;
    }
    get_upper_section_html(doc) {
      const { status } = doc;
      let indicator_color = "";
      in_list(["Paid", "Consolidated"], status) && (indicator_color = "green");
      status === "Draft" && (indicator_color = "red");
      status === "Return" && (indicator_color = "grey");
      return `<div class="left-section">
					<div class="customer-name">${doc.customer}</div>
					<div class="customer-email">${this.customer_email}</div>
					<div class="cashier">${__("Sold by")}: ${doc.owner}</div>
				</div>
				<div class="right-section">
					<div class="paid-amount">${format_currency(doc.paid_amount, doc.currency)}</div>
					<div class="invoice-name">${doc.name}</div>
					<span class="indicator-pill whitespace-nowrap ${indicator_color}"><span>${doc.status}</span></span>
				</div>`;
    }
    get_item_html(doc, item_data) {
      return `<div class="item-row-wrapper">
					<div class="item-name">${item_data.item_name}</div>
					<div class="item-qty">${item_data.qty || 0}</div>
					<div class="item-rate-disc">${get_rate_discount_html()}</div>
				</div>`;
      function get_rate_discount_html() {
        if (item_data.rate && item_data.price_list_rate && item_data.rate !== item_data.price_list_rate) {
          return `<span class="item-disc">(${item_data.discount_percentage}% off)</span>
						<div class="item-rate">${format_currency(item_data.rate, doc.currency)}</div>`;
        } else {
          return `<div class="item-rate">${format_currency(item_data.price_list_rate || item_data.rate, doc.currency)}</div>`;
        }
      }
    }
    get_discount_html(doc) {
      if (doc.discount_amount) {
        return `<div class="summary-row-wrapper">
						<div>Discount (${doc.additional_discount_percentage} %)</div>
						<div>${format_currency(doc.discount_amount, doc.currency)}</div>
					</div>`;
      } else {
        return ``;
      }
    }
    get_net_total_html(doc) {
      return `<div class="summary-row-wrapper">
					<div>${__("Net Total")}</div>
					<div>${format_currency(doc.net_total, doc.currency)}</div>
				</div>`;
    }
    get_taxes_html(doc) {
      if (!doc.taxes.length)
        return "";
      let taxes_html = doc.taxes.map((t) => {
        const description = /[0-9]+/.test(t.description) ? t.description : `${t.description} @ ${t.rate}%`;
        return `
				<div class="tax-row">
					<div class="tax-label">${description}</div>
					<div class="tax-value">${format_currency(t.tax_amount_after_discount_amount, doc.currency)}</div>
				</div>
			`;
      }).join("");
      return `<div class="taxes-wrapper">${taxes_html}</div>`;
    }
    get_grand_total_html(doc) {
      return `<div class="summary-row-wrapper grand-total">
					<div>${__("Grand Total")}</div>
					<div>${format_currency(doc.grand_total, doc.currency)}</div>
				</div>`;
    }
    get_payment_html(doc, payment) {
      return `<div class="summary-row-wrapper payments">
					<div>${__(payment.mode_of_payment)}</div>
					<div>${format_currency(payment.amount, doc.currency)}</div>
				</div>`;
    }
    bind_events() {
      this.$summary_container.on("click", ".return-btn", () => {
        this.events.process_return(this.doc.name);
        this.toggle_component(false);
        this.$component.find(".no-summary-placeholder").css("display", "flex");
        this.$summary_wrapper.css("display", "none");
      });
      this.$summary_container.on("click", ".edit-btn", () => {
        this.events.edit_order(this.doc.name);
        this.toggle_component(false);
        this.$component.find(".no-summary-placeholder").css("display", "flex");
        this.$summary_wrapper.css("display", "none");
      });
      this.$summary_container.on("click", ".delete-btn", () => {
        this.events.delete_order(this.doc.name);
        this.show_summary_placeholder();
      });
      this.$summary_container.on("click", ".delete-btn", () => {
        this.events.delete_order(this.doc.name);
        this.show_summary_placeholder();
      });
      this.$summary_container.on("click", ".new-btn", () => {
        this.events.new_order();
        this.toggle_component(false);
        this.$component.find(".no-summary-placeholder").css("display", "flex");
        this.$summary_wrapper.css("display", "none");
      });
      this.$summary_container.on("click", ".email-btn", () => {
        this.email_dialog.fields_dict.email_id.set_value(this.customer_email);
        this.email_dialog.show();
      });
      this.$summary_container.on("click", ".print-btn", () => {
        this.print_receipt();
      });
    }
    print_receipt() {
      const frm = this.events.get_frm();
      frappe.utils.print(this.doc.doctype, this.doc.name, frm.pos_print_format, this.doc.letter_head, this.doc.language || frappe.boot.lang);
    }
    attach_shortcuts() {
      const ctrl_label = frappe.utils.is_mac() ? "\u2318" : "Ctrl";
      this.$summary_container.find(".print-btn").attr("title", `${ctrl_label}+P`);
      frappe.ui.keys.add_shortcut({
        shortcut: "ctrl+p",
        action: () => this.$summary_container.find(".print-btn").click(),
        condition: () => this.$component.is(":visible") && this.$summary_container.find(".print-btn").is(":visible"),
        description: __("Print Receipt"),
        page: cur_page.page.page
      });
      this.$summary_container.find(".new-btn").attr("title", `${ctrl_label}+Enter`);
      frappe.ui.keys.on("ctrl+enter", () => {
        const summary_is_visible = this.$component.is(":visible");
        if (summary_is_visible && this.$summary_container.find(".new-btn").is(":visible")) {
          this.$summary_container.find(".new-btn").click();
        }
      });
      this.$summary_container.find(".edit-btn").attr("title", `${ctrl_label}+E`);
      frappe.ui.keys.add_shortcut({
        shortcut: "ctrl+e",
        action: () => this.$summary_container.find(".edit-btn").click(),
        condition: () => this.$component.is(":visible") && this.$summary_container.find(".edit-btn").is(":visible"),
        description: __("Edit Receipt"),
        page: cur_page.page.page
      });
    }
    send_email() {
      const frm = this.events.get_frm();
      const recipients = this.email_dialog.get_values().email_id;
      const doc = this.doc || frm.doc;
      const print_format = frm.pos_print_format;
      frappe.call({
        method: "frappe.core.doctype.communication.email.make",
        args: {
          recipients,
          subject: __(frm.meta.name) + ": " + doc.name,
          doctype: doc.doctype,
          name: doc.name,
          send_email: 1,
          print_format,
          sender_full_name: frappe.user.full_name(),
          _lang: doc.language
        },
        callback: (r) => {
          if (!r.exc) {
            frappe.utils.play_sound("email");
            if (r.message["emails_not_sent_to"]) {
              frappe.msgprint(__("Email not sent to {0} (unsubscribed / disabled)", [frappe.utils.escape_html(r.message["emails_not_sent_to"])]));
            } else {
              frappe.show_alert({
                message: __("Email sent successfully."),
                indicator: "green"
              });
            }
            this.email_dialog.hide();
          } else {
            frappe.msgprint(__("There were errors while sending email. Please try again."));
          }
        }
      });
    }
    add_summary_btns(map) {
      this.$summary_btns.html("");
      map.forEach((m) => {
        if (m.condition) {
          m.visible_btns.forEach((b) => {
            const class_name = b.split(" ")[0].toLowerCase();
            const btn = __(b);
            this.$summary_btns.append(`<div class="summary-btn btn btn-default ${class_name}-btn">${btn}</div>`);
          });
        }
      });
      this.$summary_btns.children().last().removeClass("mr-4");
    }
    toggle_summary_placeholder(show) {
      if (show) {
        this.$summary_wrapper.css("display", "none");
        this.$component.find(".no-summary-placeholder").css("display", "flex");
      } else {
        this.$summary_wrapper.css("display", "flex");
        this.$component.find(".no-summary-placeholder").css("display", "none");
      }
    }
    get_condition_btn_map(after_submission) {
      if (after_submission)
        return [{ condition: true, visible_btns: ["Print Receipt", "Email Receipt", "New Order"] }];
      return [
        { condition: this.doc.docstatus === 0, visible_btns: ["Edit Order", "Delete Order"] },
        { condition: !this.doc.is_return && this.doc.docstatus === 1, visible_btns: ["Print Receipt", "Email Receipt", "Return"] },
        { condition: this.doc.is_return && this.doc.docstatus === 1, visible_btns: ["Print Receipt", "Email Receipt"] }
      ];
    }
    load_summary_of(doc, after_submission = false) {
      after_submission ? this.$component.css("grid-column", "span 10 / span 10") : this.$component.css("grid-column", "span 6 / span 6");
      this.toggle_summary_placeholder(false);
      this.doc = doc;
      this.attach_document_info(doc);
      this.attach_items_info(doc);
      this.attach_totals_info(doc);
      this.attach_payments_info(doc);
      const condition_btns_map = this.get_condition_btn_map(after_submission);
      this.add_summary_btns(condition_btns_map);
    }
    attach_document_info(doc) {
      frappe.db.get_value("Customer", this.doc.customer, "email_id").then(({ message }) => {
        this.customer_email = message.email_id || "";
        const upper_section_dom = this.get_upper_section_html(doc);
        this.$upper_section.html(upper_section_dom);
      });
    }
    attach_items_info(doc) {
      this.$items_container.html("");
      doc.items.forEach((item) => {
        const item_dom = this.get_item_html(doc, item);
        this.$items_container.append(item_dom);
        this.set_dynamic_rate_header_width();
      });
    }
    set_dynamic_rate_header_width() {
      const rate_cols = Array.from(this.$items_container.find(".item-rate-disc"));
      this.$items_container.find(".item-rate-disc").css("width", "");
      let max_width = rate_cols.reduce((max_width2, elm) => {
        if ($(elm).width() > max_width2)
          max_width2 = $(elm).width();
        return max_width2;
      }, 0);
      max_width += 1;
      if (max_width == 1)
        max_width = "";
      this.$items_container.find(".item-rate-disc").css("width", max_width);
    }
    attach_payments_info(doc) {
      this.$payment_container.html("");
      doc.payments.forEach((p) => {
        if (p.amount) {
          const payment_dom = this.get_payment_html(doc, p);
          this.$payment_container.append(payment_dom);
        }
      });
      if (doc.redeem_loyalty_points && doc.loyalty_amount) {
        const payment_dom = this.get_payment_html(doc, {
          mode_of_payment: "Loyalty Points",
          amount: doc.loyalty_amount
        });
        this.$payment_container.append(payment_dom);
      }
    }
    attach_totals_info(doc) {
      this.$totals_container.html("");
      const net_total_dom = this.get_net_total_html(doc);
      const taxes_dom = this.get_taxes_html(doc);
      const discount_dom = this.get_discount_html(doc);
      const grand_total_dom = this.get_grand_total_html(doc);
      this.$totals_container.append(net_total_dom);
      this.$totals_container.append(taxes_dom);
      this.$totals_container.append(discount_dom);
      this.$totals_container.append(grand_total_dom);
    }
    toggle_component(show) {
      show ? this.$component.css("display", "flex") : this.$component.css("display", "none");
    }
  };

  // ../pasigono/pasigono/custom_scripts/pos_scripts/pos_past_order_summary.js
  erpnext.PointOfSale.PastOrderSummary = class extends erpnext.PointOfSale.PastOrderSummary {
    bind_events() {
      this.$summary_container.on("click", ".return-btn", () => {
        this.events.process_return(this.doc.name);
        this.toggle_component(false);
        this.$component.find(".no-summary-placeholder").css("display", "flex");
        this.$summary_wrapper.css("display", "none");
      });
      this.$summary_container.on("click", ".edit-btn", () => {
        this.events.edit_order(this.doc.name);
        this.toggle_component(false);
        this.$component.find(".no-summary-placeholder").css("display", "flex");
        this.$summary_wrapper.css("display", "none");
      });
      this.$summary_container.on("click", ".delete-btn", () => {
        this.events.delete_order(this.doc.name);
        this.show_summary_placeholder();
      });
      this.$summary_container.on("click", ".delete-btn", () => {
        this.events.delete_order(this.doc.name);
        this.show_summary_placeholder();
      });
      this.$summary_container.on("click", ".new-btn", () => {
        this.events.new_order();
        this.toggle_component(false);
        this.$component.find(".no-summary-placeholder").css("display", "flex");
        this.$summary_wrapper.css("display", "none");
      });
      this.$summary_container.on("click", ".email-btn", () => {
        this.email_dialog.fields_dict.email_id.set_value(this.customer_email);
        this.email_dialog.show();
      });
      this.$summary_container.on("click", ".print-btn", () => {
        this.print_receipt();
      });
      this.$summary_container.on("click", ".direct-print-btn", () => {
        this.events.raw_print();
      });
      this.$summary_container.on("click", ".cash-drawer-btn", () => {
        this.events.open_cash_drawer();
      });
    }
    prepare_dom() {
      this.wrapper.append(`<section class="past-order-summary">
				<div class="no-summary-placeholder">
					${__("Select an invoice to load summary data")}
				</div>
				<div class="invoice-summary-wrapper">
					<div class="abs-container">
						<div class="upper-section"></div>
						<div class="label">${__("Items")}</div>
						<div class="items-container summary-container"></div>
						<div class="label">${__("Totals")}</div>
						<div class="totals-container summary-container"></div>
						<div class="label">${__("Payments")}</div>
						<div class="payments-container summary-container"></div>
						<div class="summary-btns"></div>
						<div class="raw-btns summary-container"></div>
					</div>
				</div>
			</section>`);
      this.$component = this.wrapper.find(".past-order-summary");
      this.$summary_wrapper = this.$component.find(".invoice-summary-wrapper");
      this.$summary_container = this.$component.find(".abs-container");
      this.$upper_section = this.$summary_container.find(".upper-section");
      this.$items_container = this.$summary_container.find(".items-container");
      this.$totals_container = this.$summary_container.find(".totals-container");
      this.$payment_container = this.$summary_container.find(".payments-container");
      this.$summary_btns = this.$summary_container.find(".summary-btns");
      this.$raw_btns = this.$summary_container.find(".raw-btns");
    }
    load_summary_of(doc, after_submission = false) {
      after_submission ? this.$component.css("grid-column", "span 10 / span 10") : this.$component.css("grid-column", "span 6 / span 6");
      this.toggle_summary_placeholder(false);
      this.doc = doc;
      this.attach_document_info(doc);
      this.attach_items_info(doc);
      this.attach_totals_info(doc);
      this.attach_payments_info(doc);
      const condition_btns_map = this.get_condition_btn_map(after_submission);
      this.add_summary_btns(condition_btns_map);
      this.add_raw_btns();
    }
    add_raw_btns() {
      this.$raw_btns.html("");
      if (window.enable_raw_print == 1 && window.raw_printer) {
        this.$raw_btns.append(`<div class="summary-btn btn btn-default direct-print-btn">Direct Print</div>
				<div style="margin-top: 10px;" class="summary-btn btn btn-default cash-drawer-btn">Open Cash Drawer</div>`);
      }
      this.$raw_btns.children().last().removeClass("mr-4");
    }
  };

  // ../pasigono/pasigono/pos_assets/pos_controller.js
  erpnext.PointOfSale.Controller = class {
    constructor(wrapper) {
      this.wrapper = $(wrapper).find(".layout-main-section");
      this.page = wrapper.page;
      this.check_opening_entry();
    }
    fetch_opening_entry() {
      return frappe.call("erpnext.selling.page.point_of_sale.point_of_sale.check_opening_entry", { "user": frappe.session.user });
    }
    check_opening_entry() {
      this.fetch_opening_entry().then((r) => {
        if (r.message.length) {
          this.prepare_app_defaults(r.message[0]);
        } else {
          this.create_opening_voucher();
        }
      });
    }
    create_opening_voucher() {
      const me = this;
      const table_fields = [
        {
          fieldname: "mode_of_payment",
          fieldtype: "Link",
          in_list_view: 1,
          label: "Mode of Payment",
          options: "Mode of Payment",
          reqd: 1
        },
        {
          fieldname: "opening_amount",
          fieldtype: "Currency",
          in_list_view: 1,
          label: "Opening Amount",
          options: "company:company_currency",
          change: function() {
            dialog.fields_dict.balance_details.df.data.some((d) => {
              if (d.idx == this.doc.idx) {
                d.opening_amount = this.value;
                dialog.fields_dict.balance_details.grid.refresh();
                return true;
              }
            });
          }
        }
      ];
      const fetch_pos_payment_methods = () => {
        const pos_profile = dialog.fields_dict.pos_profile.get_value();
        if (!pos_profile)
          return;
        frappe.db.get_doc("POS Profile", pos_profile).then(({ payments }) => {
          dialog.fields_dict.balance_details.df.data = [];
          payments.forEach((pay) => {
            const { mode_of_payment } = pay;
            dialog.fields_dict.balance_details.df.data.push({ mode_of_payment, opening_amount: "0" });
          });
          dialog.fields_dict.balance_details.grid.refresh();
        });
      };
      const dialog = new frappe.ui.Dialog({
        title: __("Create POS Opening Entry"),
        static: true,
        fields: [
          {
            fieldtype: "Link",
            label: __("Company"),
            default: frappe.defaults.get_default("company"),
            options: "Company",
            fieldname: "company",
            reqd: 1
          },
          {
            fieldtype: "Link",
            label: __("POS Profile"),
            options: "POS Profile",
            fieldname: "pos_profile",
            reqd: 1,
            get_query: () => pos_profile_query,
            onchange: () => fetch_pos_payment_methods()
          },
          {
            fieldname: "balance_details",
            fieldtype: "Table",
            label: "Opening Balance Details",
            cannot_add_rows: false,
            in_place_edit: true,
            reqd: 1,
            data: [],
            fields: table_fields
          }
        ],
        primary_action: async function({ company: company2, pos_profile, balance_details }) {
          if (!balance_details.length) {
            frappe.show_alert({
              message: __("Please add Mode of payments and opening balance details."),
              indicator: "red"
            });
            return frappe.utils.play_sound("error");
          }
          balance_details = balance_details.filter((d) => d.mode_of_payment);
          const method = "erpnext.selling.page.point_of_sale.point_of_sale.create_opening_voucher";
          const res = await frappe.call({ method, args: { pos_profile, company: company2, balance_details }, freeze: true });
          !res.exc && me.prepare_app_defaults(res.message);
          dialog.hide();
        },
        primary_action_label: __("Submit")
      });
      dialog.show();
      const pos_profile_query = {
        query: "erpnext.accounts.doctype.pos_profile.pos_profile.pos_profile_query",
        filters: { company: dialog.fields_dict.company.get_value() }
      };
    }
    async prepare_app_defaults(data) {
      this.pos_opening = data.name;
      this.company = data.company;
      this.pos_profile = data.pos_profile;
      this.pos_opening_time = data.period_start_date;
      this.item_stock_map = {};
      this.settings = {};
      frappe.db.get_value("Stock Settings", void 0, "allow_negative_stock").then(({ message }) => {
        this.allow_negative_stock = flt(message.allow_negative_stock) || false;
      });
      frappe.call({
        method: "erpnext.selling.page.point_of_sale.point_of_sale.get_pos_profile_data",
        args: { "pos_profile": this.pos_profile },
        callback: (res) => {
          const profile = res.message;
          Object.assign(this.settings, profile);
          this.settings.customer_groups = profile.customer_groups.map((group) => group.name);
          this.make_app();
        }
      });
    }
    set_opening_entry_status() {
      this.page.set_title_sub(`<span class="indicator orange">
				<a class="text-muted" href="#Form/POS%20Opening%20Entry/${this.pos_opening}">
					Opened at ${moment(this.pos_opening_time).format("Do MMMM, h:mma")}
				</a>
			</span>`);
    }
    make_app() {
      this.prepare_dom();
      this.prepare_components();
      this.prepare_menu();
      this.make_new_invoice();
    }
    prepare_dom() {
      this.wrapper.append(`<div class="point-of-sale-app"></div>`);
      this.$components_wrapper = this.wrapper.find(".point-of-sale-app");
    }
    prepare_components() {
      this.init_item_selector();
      this.init_item_details();
      this.init_item_cart();
      this.init_payments();
      this.init_recent_order_list();
      this.init_order_summary();
    }
    prepare_menu() {
      this.page.clear_menu();
      this.page.add_menu_item(__("Open Form View"), this.open_form_view.bind(this), false, "Ctrl+F");
      this.page.add_menu_item(__("Toggle Recent Orders"), this.toggle_recent_order.bind(this), false, "Ctrl+O");
      this.page.add_menu_item(__("Save as Draft"), this.save_draft_invoice.bind(this), false, "Ctrl+S");
      this.page.add_menu_item(__("Close the POS"), this.close_pos.bind(this), false, "Shift+Ctrl+C");
    }
    open_form_view() {
      frappe.model.sync(this.frm.doc);
      frappe.set_route("Form", this.frm.doc.doctype, this.frm.doc.name);
    }
    toggle_recent_order() {
      const show = this.recent_order_list.$component.is(":hidden");
      this.toggle_recent_order_list(show);
    }
    save_draft_invoice() {
      if (!this.$components_wrapper.is(":visible"))
        return;
      if (this.frm.doc.items.length == 0) {
        frappe.show_alert({
          message: __("You must add atleast one item to save it as draft."),
          indicator: "red"
        });
        frappe.utils.play_sound("error");
        return;
      }
      this.frm.save(void 0, void 0, void 0, () => {
        frappe.show_alert({
          message: __("There was an error saving the document."),
          indicator: "red"
        });
        frappe.utils.play_sound("error");
      }).then(() => {
        frappe.run_serially([
          () => frappe.dom.freeze(),
          () => this.make_new_invoice(),
          () => frappe.dom.unfreeze()
        ]);
      });
    }
    close_pos() {
      if (!this.$components_wrapper.is(":visible"))
        return;
      let voucher = frappe.model.get_new_doc("POS Closing Entry");
      voucher.pos_profile = this.frm.doc.pos_profile;
      voucher.user = frappe.session.user;
      voucher.company = this.frm.doc.company;
      voucher.pos_opening_entry = this.pos_opening;
      voucher.period_end_date = frappe.datetime.now_datetime();
      voucher.posting_date = frappe.datetime.now_date();
      frappe.set_route("Form", "POS Closing Entry", voucher.name);
    }
    init_item_selector() {
      this.item_selector = new erpnext.PointOfSale.ItemSelector({
        wrapper: this.$components_wrapper,
        pos_profile: this.pos_profile,
        settings: this.settings,
        events: {
          item_selected: (args) => this.on_cart_update(args),
          get_frm: () => this.frm || {}
        }
      });
    }
    init_item_cart() {
      this.cart = new erpnext.PointOfSale.ItemCart({
        wrapper: this.$components_wrapper,
        settings: this.settings,
        events: {
          get_frm: () => this.frm,
          cart_item_clicked: (item) => {
            const item_row = this.get_item_from_frm(item);
            this.item_details.toggle_item_details_section(item_row);
          },
          numpad_event: (value, action) => this.update_item_field(value, action),
          checkout: () => this.save_and_checkout(),
          edit_cart: () => this.payment.edit_cart(),
          customer_details_updated: (details) => {
            this.customer_details = details;
            this.payment.render_loyalty_points_payment_mode();
          }
        }
      });
    }
    init_item_details() {
      this.item_details = new erpnext.PointOfSale.ItemDetails({
        wrapper: this.$components_wrapper,
        settings: this.settings,
        events: {
          get_frm: () => this.frm,
          toggle_item_selector: (minimize) => {
            this.item_selector.resize_selector(minimize);
            this.cart.toggle_numpad(minimize);
          },
          form_updated: (item, field, value) => {
            const item_row = frappe.model.get_doc(item.doctype, item.name);
            if (item_row && item_row[field] != value) {
              const args = {
                field,
                value,
                item: this.item_details.current_item
              };
              return this.on_cart_update(args);
            }
            return Promise.resolve();
          },
          highlight_cart_item: (item) => {
            const cart_item = this.cart.get_cart_item(item);
            this.cart.toggle_item_highlight(cart_item);
          },
          item_field_focused: (fieldname) => {
            this.cart.toggle_numpad_field_edit(fieldname);
          },
          set_value_in_current_cart_item: (selector, value) => {
            this.cart.update_selector_value_in_cart_item(selector, value, this.item_details.current_item);
          },
          clone_new_batch_item_in_frm: (batch_serial_map, item) => {
            Object.keys(batch_serial_map).forEach((batch) => {
              const item_to_clone = this.frm.doc.items.find((i) => i.name == item.name);
              const new_row = this.frm.add_child("items", __spreadValues({}, item_to_clone));
              new_row.batch_no = batch;
              new_row.serial_no = batch_serial_map[batch].join(`
`);
              new_row.qty = batch_serial_map[batch].length;
              this.frm.doc.items.forEach((row) => {
                if (item.item_code === row.item_code) {
                  this.update_cart_html(row);
                }
              });
            });
          },
          remove_item_from_cart: () => this.remove_item_from_cart(),
          get_item_stock_map: () => this.item_stock_map,
          close_item_details: () => {
            this.item_details.toggle_item_details_section(null);
            this.cart.prev_action = null;
            this.cart.toggle_item_highlight();
          },
          get_available_stock: (item_code, warehouse) => this.get_available_stock(item_code, warehouse)
        }
      });
    }
    init_payments() {
      this.payment = new erpnext.PointOfSale.Payment({
        wrapper: this.$components_wrapper,
        events: {
          get_frm: () => this.frm || {},
          get_customer_details: () => this.customer_details || {},
          toggle_other_sections: (show) => {
            if (show) {
              this.item_details.$component.is(":visible") ? this.item_details.$component.css("display", "none") : "";
              this.item_selector.toggle_component(false);
            } else {
              this.item_selector.toggle_component(true);
            }
          },
          submit_invoice: () => {
            this.frm.savesubmit().then((r) => {
              this.toggle_components(false);
              this.order_summary.toggle_component(true);
              this.order_summary.load_summary_of(this.frm.doc, true);
              frappe.show_alert({
                indicator: "green",
                message: __("POS invoice {0} created succesfully", [r.doc.name])
              });
            });
          }
        }
      });
    }
    init_recent_order_list() {
      this.recent_order_list = new erpnext.PointOfSale.PastOrderList({
        wrapper: this.$components_wrapper,
        events: {
          open_invoice_data: (name) => {
            frappe.db.get_doc("POS Invoice", name).then((doc) => {
              this.order_summary.load_summary_of(doc);
            });
          },
          reset_summary: () => this.order_summary.toggle_summary_placeholder(true)
        }
      });
    }
    init_order_summary() {
      this.order_summary = new erpnext.PointOfSale.PastOrderSummary({
        wrapper: this.$components_wrapper,
        events: {
          get_frm: () => this.frm,
          process_return: (name) => {
            this.recent_order_list.toggle_component(false);
            frappe.db.get_doc("POS Invoice", name).then((doc) => {
              frappe.run_serially([
                () => this.make_return_invoice(doc),
                () => this.cart.load_invoice(),
                () => this.item_selector.toggle_component(true)
              ]);
            });
          },
          edit_order: (name) => {
            this.recent_order_list.toggle_component(false);
            frappe.run_serially([
              () => this.frm.refresh(name),
              () => this.frm.call("reset_mode_of_payments"),
              () => this.cart.load_invoice(),
              () => this.item_selector.toggle_component(true)
            ]);
          },
          delete_order: (name) => {
            frappe.model.delete_doc(this.frm.doc.doctype, name, () => {
              this.recent_order_list.refresh_list();
            });
          },
          new_order: () => {
            frappe.run_serially([
              () => frappe.dom.freeze(),
              () => this.make_new_invoice(),
              () => this.item_selector.toggle_component(true),
              () => frappe.dom.unfreeze()
            ]);
          }
        }
      });
    }
    toggle_recent_order_list(show) {
      this.toggle_components(!show);
      this.recent_order_list.toggle_component(show);
      this.order_summary.toggle_component(show);
    }
    toggle_components(show) {
      this.cart.toggle_component(show);
      this.item_selector.toggle_component(show);
      !show ? this.item_details.toggle_component(false) || this.payment.toggle_component(false) : "";
    }
    make_new_invoice() {
      return frappe.run_serially([
        () => frappe.dom.freeze(),
        () => this.make_sales_invoice_frm(),
        () => this.set_pos_profile_data(),
        () => this.set_pos_profile_status(),
        () => this.cart.load_invoice(),
        () => frappe.dom.unfreeze()
      ]);
    }
    make_sales_invoice_frm() {
      const doctype = "POS Invoice";
      return new Promise((resolve) => {
        if (this.frm) {
          this.frm = this.get_new_frm(this.frm);
          this.frm.doc.items = [];
          this.frm.doc.is_pos = 1;
          resolve();
        } else {
          frappe.model.with_doctype(doctype, () => {
            this.frm = this.get_new_frm();
            this.frm.doc.items = [];
            this.frm.doc.is_pos = 1;
            resolve();
          });
        }
      });
    }
    get_new_frm(_frm) {
      const doctype = "POS Invoice";
      const page = $("<div>");
      const frm = _frm || new frappe.ui.form.Form(doctype, page, false);
      const name = frappe.model.make_new_doc_and_get_name(doctype, true);
      frm.refresh(name);
      return frm;
    }
    async make_return_invoice(doc) {
      frappe.dom.freeze();
      this.frm = this.get_new_frm(this.frm);
      this.frm.doc.items = [];
      return frappe.call({
        method: "erpnext.accounts.doctype.pos_invoice.pos_invoice.make_sales_return",
        args: {
          "source_name": doc.name,
          "target_doc": this.frm.doc
        },
        callback: (r) => {
          frappe.model.sync(r.message);
          frappe.get_doc(r.message.doctype, r.message.name).__run_link_triggers = false;
          this.set_pos_profile_data().then(() => {
            frappe.dom.unfreeze();
          });
        }
      });
    }
    set_pos_profile_data() {
      if (this.company && !this.frm.doc.company)
        this.frm.doc.company = this.company;
      if ((this.pos_profile && !this.frm.doc.pos_profile) | (this.frm.doc.is_return && this.pos_profile != this.frm.doc.pos_profile)) {
        this.frm.doc.pos_profile = this.pos_profile;
      }
      if (!this.frm.doc.company)
        return;
      return this.frm.trigger("set_pos_data");
    }
    set_pos_profile_status() {
      this.page.set_indicator(this.pos_profile, "blue");
    }
    async on_cart_update(args) {
      frappe.dom.freeze();
      let item_row = void 0;
      try {
        let { field, value, item } = args;
        item_row = this.get_item_from_frm(item);
        const item_row_exists = !$.isEmptyObject(item_row);
        const from_selector = field === "qty" && value === "+1";
        if (from_selector)
          value = flt(item_row.qty) + flt(value);
        if (item_row_exists) {
          if (field === "qty")
            value = flt(value);
          if (["qty", "conversion_factor"].includes(field) && value > 0 && !this.allow_negative_stock) {
            const qty_needed = field === "qty" ? value * item_row.conversion_factor : item_row.qty * value;
            await this.check_stock_availability(item_row, qty_needed, this.frm.doc.set_warehouse);
          }
          if (this.is_current_item_being_edited(item_row) || from_selector) {
            await frappe.model.set_value(item_row.doctype, item_row.name, field, value);
            this.update_cart_html(item_row);
          }
        } else {
          if (!this.frm.doc.customer)
            return this.raise_customer_selection_alert();
          const { item_code, batch_no, serial_no, rate } = item;
          if (!item_code)
            return;
          const new_item = { item_code, batch_no, rate, [field]: value };
          if (serial_no) {
            await this.check_serial_no_availablilty(item_code, this.frm.doc.set_warehouse, serial_no);
            new_item["serial_no"] = serial_no;
          }
          if (field === "serial_no")
            new_item["qty"] = value.split(`
`).length || 0;
          item_row = this.frm.add_child("items", new_item);
          if (field === "qty" && value !== 0 && !this.allow_negative_stock)
            await this.check_stock_availability(item_row, value, this.frm.doc.set_warehouse);
          await this.trigger_new_item_events(item_row);
          this.update_cart_html(item_row);
          if (this.item_details.$component.is(":visible"))
            this.edit_item_details_of(item_row);
          if (this.check_serial_batch_selection_needed(item_row) && !this.item_details.$component.is(":visible"))
            this.edit_item_details_of(item_row);
        }
      } catch (error) {
        console.log(error);
      } finally {
        frappe.dom.unfreeze();
        return item_row;
      }
    }
    raise_customer_selection_alert() {
      frappe.dom.unfreeze();
      frappe.show_alert({
        message: __("You must select a customer before adding an item."),
        indicator: "orange"
      });
      frappe.utils.play_sound("error");
    }
    get_item_from_frm({ name, item_code, batch_no, uom, rate }) {
      let item_row = null;
      if (name) {
        item_row = this.frm.doc.items.find((i) => i.name == name);
      } else {
        const has_batch_no = batch_no;
        item_row = this.frm.doc.items.find((i) => i.item_code === item_code && (!has_batch_no || has_batch_no && i.batch_no === batch_no) && i.uom === uom && i.rate == rate);
      }
      return item_row || {};
    }
    edit_item_details_of(item_row) {
      this.item_details.toggle_item_details_section(item_row);
    }
    is_current_item_being_edited(item_row) {
      return item_row.name == this.item_details.current_item.name;
    }
    update_cart_html(item_row, remove_item) {
      this.cart.update_item_html(item_row, remove_item);
      this.cart.update_totals_section(this.frm);
    }
    check_serial_batch_selection_needed(item_row) {
      const serialized = item_row.has_serial_no;
      const batched = item_row.has_batch_no;
      const no_serial_selected = !item_row.serial_no;
      const no_batch_selected = !item_row.batch_no;
      if (serialized && no_serial_selected || batched && no_batch_selected || serialized && batched && (no_batch_selected || no_serial_selected)) {
        return true;
      }
      return false;
    }
    async trigger_new_item_events(item_row) {
      await this.frm.script_manager.trigger("item_code", item_row.doctype, item_row.name);
      await this.frm.script_manager.trigger("qty", item_row.doctype, item_row.name);
    }
    async check_stock_availability(item_row, qty_needed, warehouse) {
      const resp = (await this.get_available_stock(item_row.item_code, warehouse)).message;
      const available_qty = resp[0];
      const is_stock_item = resp[1];
      frappe.dom.unfreeze();
      const bold_item_code = item_row.item_code.bold();
      const bold_warehouse = warehouse.bold();
      const bold_available_qty = available_qty.toString().bold();
      if (!(available_qty > 0)) {
        if (is_stock_item) {
          frappe.model.clear_doc(item_row.doctype, item_row.name);
          frappe.throw({
            title: __("Not Available"),
            message: __("Item Code: {0} is not available under warehouse {1}.", [bold_item_code, bold_warehouse])
          });
        } else {
          return;
        }
      } else if (available_qty < qty_needed) {
        frappe.throw({
          message: __("Stock quantity not enough for Item Code: {0} under warehouse {1}. Available quantity {2}.", [bold_item_code, bold_warehouse, bold_available_qty]),
          indicator: "orange"
        });
        frappe.utils.play_sound("error");
      }
      frappe.dom.freeze();
    }
    async check_serial_no_availablilty(item_code, warehouse, serial_no) {
      const method = "erpnext.stock.doctype.serial_no.serial_no.get_pos_reserved_serial_nos";
      const args = { filters: { item_code, warehouse } };
      const res = await frappe.call({ method, args });
      if (res.message.includes(serial_no)) {
        frappe.throw({
          title: __("Not Available"),
          message: __("Serial No: {0} has already been transacted into another POS Invoice.", [serial_no.bold()])
        });
      }
    }
    get_available_stock(item_code, warehouse) {
      const me = this;
      return frappe.call({
        method: "erpnext.accounts.doctype.pos_invoice.pos_invoice.get_stock_availability",
        args: {
          "item_code": item_code,
          "warehouse": warehouse
        },
        callback(res) {
          if (!me.item_stock_map[item_code])
            me.item_stock_map[item_code] = {};
          me.item_stock_map[item_code][warehouse] = res.message[0];
        }
      });
    }
    update_item_field(value, field_or_action) {
      if (field_or_action === "checkout") {
        this.item_details.toggle_item_details_section(null);
      } else if (field_or_action === "remove") {
        this.remove_item_from_cart();
      } else {
        const field_control = this.item_details[`${field_or_action}_control`];
        if (!field_control)
          return;
        field_control.set_focus();
        value != "" && field_control.set_value(value);
      }
    }
    remove_item_from_cart() {
      frappe.dom.freeze();
      const { doctype, name, current_item } = this.item_details;
      return frappe.model.set_value(doctype, name, "qty", 0).then(() => {
        frappe.model.clear_doc(doctype, name);
        this.update_cart_html(current_item, true);
        this.item_details.toggle_item_details_section(null);
        frappe.dom.unfreeze();
      }).catch((e) => console.log(e));
    }
    async save_and_checkout() {
      if (this.frm.is_dirty()) {
        let save_error = false;
        await this.frm.save(null, null, null, () => save_error = true);
        !save_error && this.payment.checkout();
        save_error && setTimeout(() => {
          this.cart.toggle_checkout_btn(true);
        }, 300);
      } else {
        this.payment.checkout();
      }
    }
  };

  // ../pasigono/pasigono/custom_scripts/pos_scripts/pos_controller.js
  var writtenNumber = require_lib();
  erpnext.PointOfSale.Controller = class extends erpnext.PointOfSale.Controller {
    make_app() {
      this.prepare_dom();
      this.prepare_components();
      this.prepare_menu();
      this.make_new_invoice();
      this.init_stripe_terminal();
    }
    init_stripe_terminal() {
      if (window.enable_stripe_terminal == 1) {
        this.stripe = new erpnext.PointOfSale.StripeTerminal();
        frappe.dom.freeze();
        this.stripe.assign_stripe_connection_token(this, true);
        frappe.dom.unfreeze();
      }
    }
    init_order_summary() {
      this.order_summary = new erpnext.PointOfSale.PastOrderSummary({
        wrapper: this.$components_wrapper,
        events: {
          get_frm: () => this.frm,
          process_return: (name) => {
            this.recent_order_list.toggle_component(false);
            frappe.db.get_doc("POS Invoice", name).then((doc) => {
              frappe.run_serially([
                () => this.make_return_invoice(doc),
                () => this.cart.load_invoice(),
                () => this.item_selector.toggle_component(true)
              ]);
            });
          },
          edit_order: (name) => {
            this.recent_order_list.toggle_component(false);
            frappe.run_serially([
              () => this.frm.refresh(name),
              () => this.frm.call("reset_mode_of_payments"),
              () => this.cart.load_invoice(),
              () => this.item_selector.toggle_component(true)
            ]);
          },
          delete_order: (name) => {
            frappe.model.delete_doc(this.frm.doc.doctype, name, () => {
              this.recent_order_list.refresh_list();
            });
          },
          new_order: () => {
            frappe.run_serially([
              () => frappe.dom.freeze(),
              () => this.make_new_invoice(),
              () => this.item_selector.toggle_component(true),
              () => frappe.dom.unfreeze()
            ]);
          },
          raw_print: () => {
            this.raw_print(this.frm);
          },
          open_cash_drawer: () => {
            this.open_cash_drawer();
          }
        }
      });
    }
    async prepare_app_defaults(data) {
      this.pos_opening = data.name;
      this.company = data.company;
      this.pos_profile = data.pos_profile;
      this.pos_opening_time = data.period_start_date;
      this.item_stock_map = {};
      this.settings = {};
      window.tax_templates = [];
      window.company = {};
      frappe.db.get_value("Stock Settings", void 0, "allow_negative_stock").then(({ message }) => {
        this.allow_negative_stock = flt(message.allow_negative_stock) || false;
      });
      frappe.db.get_list("Item Tax Template", {
        filters: { company: this.company },
        fields: ["name", "title"]
      }).then((res) => {
        window.tax_templates = res;
      });
      frappe.db.get_doc("Company", this.company).then((res) => {
        window.company = res;
      });
      frappe.call({
        method: "erpnext.selling.page.point_of_sale.point_of_sale.get_pos_profile_data",
        args: { pos_profile: this.pos_profile },
        callback: (res) => {
          const profile = res.message;
          window.enable_raw_print = profile.enable_raw_printing;
          window.enable_stripe_terminal = profile.enable_stripe_terminal;
          window.stripe_mode_of_payment = profile.stripe_mode_of_payment;
          if (window.enable_raw_print == 1) {
            frappe.db.get_doc("QZ Tray Settings", void 0).then((qz_doc) => {
              if (qz_doc.trusted_certificate != null && qz_doc.trusted_certificate != "" && qz_doc.private_certificate != "" && qz_doc.private_certificate != null) {
                frappe.ui.form.qz_init().then(function() {
                  qz.security.setCertificatePromise(function(resolve, reject) {
                    resolve(qz_doc.trusted_certificate);
                  });
                  qz.security.setSignaturePromise(function(toSign) {
                    return function(resolve, reject) {
                      try {
                        var pk = KEYUTIL.getKey(qz_doc.private_certificate);
                        var sig = new KJUR.crypto.Signature({
                          alg: "SHA1withRSA"
                        });
                        sig.init(pk);
                        sig.updateString(toSign);
                        var hex = sig.sign();
                        resolve(stob64(hextorstr(hex)));
                      } catch (err) {
                        console.error(err);
                        reject(err);
                      }
                    };
                  });
                });
              }
              var d = new frappe.ui.Dialog({
                fields: [
                  {
                    fieldname: "printer",
                    fieldtype: "Select",
                    reqd: 1,
                    label: "Printer"
                  }
                ],
                primary_action: function() {
                  window.raw_printer = d.get_values().printer;
                  d.hide();
                },
                secondary_action: function() {
                  d.hide();
                },
                secondary_action_label: "Cancel",
                title: "Select printer for Raw Printing"
              });
              frappe.ui.form.qz_get_printer_list().then((data2) => {
                d.set_df_property("printer", "options", data2);
                d.show();
              });
            });
          }
          window.automatically_print = profile.automatically_print;
          window.open_cash_drawer_automatically = profile.open_cash_drawer_automatically;
          window.enable_weigh_scale = profile.enable_weigh_scale;
          Object.assign(this.settings, profile);
          this.settings.customer_groups = profile.customer_groups.map((group) => group.name);
          this.make_app();
        }
      });
    }
    init_item_details() {
      this.item_details = new erpnext.PointOfSale.ItemDetails({
        wrapper: this.$components_wrapper,
        settings: this.settings,
        events: {
          get_frm: () => this.frm,
          toggle_item_selector: (minimize) => {
            this.item_selector.resize_selector(minimize);
            this.cart.toggle_numpad(minimize);
          },
          form_updated: (item, field, value) => {
            const item_row = frappe.model.get_doc(item.doctype, item.name);
            if (item_row && item_row[field] != value) {
              const args = {
                field,
                value,
                item: this.item_details.current_item
              };
              return this.on_cart_update(args);
            }
            return Promise.resolve();
          },
          highlight_cart_item: (item) => {
            const cart_item = this.cart.get_cart_item(item);
            this.cart.toggle_item_highlight(cart_item);
          },
          item_field_focused: (fieldname) => {
            this.cart.toggle_numpad_field_edit(fieldname);
          },
          set_value_in_current_cart_item: (selector, value) => {
            this.cart.update_selector_value_in_cart_item(selector, value, this.item_details.current_item);
          },
          clone_new_batch_item_in_frm: (batch_serial_map, item) => {
            Object.keys(batch_serial_map).forEach((batch) => {
              const item_to_clone = this.frm.doc.items.find((i) => i.name == item.name);
              const new_row = this.frm.add_child("items", __spreadValues({}, item_to_clone));
              new_row.batch_no = batch;
              new_row.serial_no = batch_serial_map[batch].join(`
`);
              new_row.qty = batch_serial_map[batch].length;
              this.frm.doc.items.forEach((row) => {
                if (item.item_code === row.item_code) {
                  this.update_cart_html(row);
                }
              });
            });
          },
          remove_item_from_cart: () => this.remove_item_from_cart(),
          get_item_stock_map: () => this.item_stock_map,
          close_item_details: () => {
            this.item_details.toggle_item_details_section(null);
            this.cart.prev_action = null;
            this.cart.toggle_item_highlight();
            if (window.enable_weigh_scale == 1) {
              window.is_item_details_open = false;
              window.mettlerWorker.postMessage({ command: "stop" });
            }
          },
          get_available_stock: (item_code, warehouse) => this.get_available_stock(item_code, warehouse)
        }
      });
    }
    remove_item_from_cart() {
      frappe.dom.freeze();
      const { doctype, name, current_item } = this.item_details;
      return frappe.model.set_value(doctype, name, "qty", 0).then(() => {
        frappe.model.clear_doc(doctype, name);
        this.update_cart_html(current_item, true);
        this.item_details.toggle_item_details_section(null);
        frappe.dom.unfreeze();
      }).catch((e) => console.log(e));
      if (window.enable_weigh_scale == 1) {
        window.is_item_details_open = false;
      }
    }
    init_payments() {
      this.payment = new erpnext.PointOfSale.Payment({
        wrapper: this.$components_wrapper,
        events: {
          get_frm: () => this.frm || {},
          get_customer_details: () => this.customer_details || {},
          toggle_other_sections: (show) => {
            if (show) {
              this.item_details.$component.is(":visible") ? this.item_details.$component.css("display", "none") : "";
              this.item_selector.toggle_component(false);
            } else {
              this.item_selector.toggle_component(true);
            }
          },
          submit_invoice: () => {
            var allowSubmit = 1;
            if (window.enable_stripe_terminal == 1) {
              if (this.frm.doc.payments.length > 0) {
                for (var i = 0; i <= this.frm.doc.payments.length; i++) {
                  if (this.frm.doc.payments[i] != void 0) {
                    if (this.frm.doc.payments[i].mode_of_payment == window.stripe_mode_of_payment && this.frm.doc.payments[i].base_amount != 0) {
                      if (this.frm.doc.payments[i].amount > 0) {
                        allowSubmit = 0;
                      } else if (this.frm.doc.is_return == 1 && this.frm.doc.payments[i].card_payment_intent) {
                        allowSubmit = 0;
                      } else if (this.frm.doc.is_return == 1 && !this.frm.doc.payments[i].card_payment_intent) {
                        frappe.throw("This transaction was not paid using a Stripe Payment. Please change the return payment method.");
                      }
                    }
                  }
                }
              }
            }
            if (allowSubmit == 1) {
              this.frm.savesubmit().then((r) => {
                if (window.open_cash_drawer_automatically == 1) {
                  this.open_cash_drawer();
                }
                if (window.automatically_print == 1) {
                  this.raw_print(this.frm);
                }
                this.toggle_components(false);
                this.order_summary.toggle_component(true);
                this.order_summary.load_summary_of(this.frm.doc, true);
                frappe.show_alert({
                  indicator: "green",
                  message: __("POS invoice {0} created succesfully", [
                    r.doc.name
                  ])
                });
              });
            } else {
              this.stripe.collecting_payments(this, true);
            }
          },
          raw_print: () => {
            this.raw_print(this.frm);
          },
          open_cash_drawer: () => {
            this.open_cash_drawer();
          }
        }
      });
    }
    async on_cart_update(args) {
      frappe.dom.freeze();
      let item_row = void 0;
      try {
        let { field, value, item } = args;
        item_row = this.get_item_from_frm(item);
        const item_row_exists = !$.isEmptyObject(item_row);
        const from_selector = field === "qty" && value === "+1";
        if (from_selector)
          value = flt(item_row.qty) + flt(value);
        if (item_row_exists) {
          if (field === "qty")
            value = flt(value);
          if (["qty", "conversion_factor"].includes(field) && value > 0 && !this.allow_negative_stock) {
            const qty_needed = field === "qty" ? value * item_row.conversion_factor : item_row.qty * value;
            await this.check_stock_availability(item_row, qty_needed, this.frm.doc.set_warehouse);
          }
          if (this.is_current_item_being_edited(item_row) || from_selector) {
            await frappe.model.set_value(item_row.doctype, item_row.name, field, value);
            this.update_cart_html(item_row);
          }
        } else {
          if (!this.frm.doc.customer)
            return this.raise_customer_selection_alert();
          const { item_code, batch_no, serial_no, rate } = item;
          if (!item_code)
            return;
          const new_item = { item_code, batch_no, rate, [field]: value };
          if (serial_no) {
            await this.check_serial_no_availablilty(item_code, this.frm.doc.set_warehouse, serial_no);
            new_item["serial_no"] = serial_no;
          }
          if (field === "serial_no")
            new_item["qty"] = value.split(`
`).length || 0;
          item_row = this.frm.add_child("items", new_item);
          if (field === "qty" && value !== 0 && !this.allow_negative_stock)
            await this.check_stock_availability(item_row, value, this.frm.doc.set_warehouse);
          await this.trigger_new_item_events(item_row);
          this.update_cart_html(item_row);
          if (this.item_details.$component.is(":visible"))
            this.edit_item_details_of(item_row);
          if (this.check_serial_batch_selection_needed(item_row) && !this.item_details.$component.is(":visible"))
            this.edit_item_details_of(item_row);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (window.enable_stripe_terminal == 1) {
          this.stripe.display_details(this);
        }
        frappe.dom.unfreeze();
        return item_row;
      }
    }
    open_cash_drawer() {
      if (window.enable_raw_print == 1 && window.raw_printer) {
        var me = this;
        frappe.ui.form.qz_get_printer_list().then(function(printers) {
          var config;
          printers.forEach(function(printer) {
            if (printer == window.raw_printer) {
              config = qz.configs.create(printer);
            }
          });
          var data = [
            "\0"
          ];
          qz.print(config, data);
        });
      }
    }
    raw_print(frm) {
      if (window.enable_raw_print == 1 && window.raw_printer) {
        var me = this;
        frappe.ui.form.qz_get_printer_list().then(function(printers) {
          var config;
          printers.forEach(function(printer) {
            if (printer == window.raw_printer) {
              config = qz.configs.create(printer);
            }
          });
          var data = [
            "\x1B@",
            "\x1Ba1",
            frm.doc.company + "\n",
            company.tax_id + "\n",
            frm.doc.company_address_display.replace(/\n/g, "").replace(/(<([^>]+)>)/gi, "\n") + "\n",
            "\x1BE\n",
            "FACTURA\n",
            "\x1BE\n\n",
            "Factura No.\n",
            frm.doc.invoice_number + "\n",
            "CAI\n",
            frm.doc.cai + "\n\n",
            "Fecha Limite Emision " + moment(frm.doc.fecha_limite_emision).format("DD-MM-YYYY") + "\n",
            "Rango Autorizado\n" + frm.doc.rango_autorizado.replace(" al ", "\n") + "\n",
            "\x1Ba0\n\n",
            "Cliente : " + frm.doc.customer_name + "\n",
            "RTN     : " + (frm.doc.customer_tax_id ? frm.doc.customer_tax_id : "") + "\n",
            "Fecha   : " + moment(frm.doc.posting_date).format("DD-MM-YYYY") + "\n",
            "\x1BE\r\n",
            "Descripcion                        Monto\n",
            "----------------------------------------\n",
            "\x1BE\n"
          ];
          frm.doc.items.forEach(function(row) {
            var rdata = me.get_item_print(row.item_code, row.qty, row.rate, row.amount, frm.doc.currency);
            data.push.apply(data, rdata);
          });
          data.push.apply(data, [
            "----------------------------------------\n"
          ]);
          var tprint = me.get_total_print(frm.doc);
          data.push.apply(data, tprint);
          var extraprint = me.get_extra_print(frm.doc);
          data.push.apply(data, extraprint);
          var cut = [
            "\n\n\n\n\n\n\n\n\n\n",
            "\x1Bi"
          ];
          data.push.apply(data, cut);
          qz.print(config, data);
        });
      }
    }
    get_total_print(doc) {
      var ret = [];
      var length = doc.net_total.toString().length;
      var subtotal = "Subtotal";
      for (var i = length; i <= 11; i++) {
        subtotal = subtotal + " ";
      }
      subtotal = subtotal + format_currency(doc.net_total);
      var tlength = subtotal.length;
      for (var i = 0; i < 40 - tlength; i++) {
        subtotal = " " + subtotal;
      }
      ret.push(subtotal + "\n");
      var length = doc.discount_amount.toString().length;
      var discounts = "Descuentos y Rebajas";
      for (var i = length; i <= 11; i++) {
        discounts = discounts + " ";
      }
      discounts = discounts + format_currency(doc.discount_amount);
      var tlength = discounts.length;
      for (var i = 0; i < 40 - tlength; i++) {
        discounts = " " + discounts;
      }
      ret.push(discounts + "\n");
      var tax_rates_per_item = Object.entries(JSON.parse(doc.taxes[0].item_wise_tax_detail));
      var invoice_taxes = {
        exento_total: 0,
        exento_tax_total: 0,
        exonerado_total: 0,
        isv_15_total: 0,
        isv_18_total: 0,
        isv_15_tax_total: 0,
        isv_18_tax_total: 0
      };
      window.tax_templates.map((tax_template) => {
        doc.items.forEach((item) => {
          if (item.item_tax_template == tax_template.name) {
            if (tax_template.title == "ISV 15%") {
              invoice_taxes.isv_15_total += item.net_amount;
              tax_rates_per_item.map((tax_item) => {
                if (tax_item[0] === item.item_code) {
                  invoice_taxes.isv_15_tax_total += tax_item[1][1];
                }
              });
            }
            if (tax_template.title == "ISV 18%") {
              invoice_taxes.isv_18_total += item.net_amount;
              tax_rates_per_item.map((tax_item) => {
                if (tax_item[0] === item.item_code) {
                  invoice_taxes.isv_18_tax_total += tax_item[1][1];
                }
              });
            }
            if (tax_template.title == "Exento") {
              invoice_taxes.exento_total += item.net_amount;
              tax_rates_per_item.map((tax_item) => {
                if (tax_item[0] === item.item_code) {
                  invoice_taxes.exento_tax_total += tax_item[1][1];
                }
              });
            }
          }
        });
      });
      var length = invoice_taxes.exento_total.toString().length;
      var exempt = "Importe Exento";
      for (var i = length; i <= 11; i++) {
        exempt = exempt + " ";
      }
      exempt = exempt + format_currency(invoice_taxes.exento_total);
      var tlength = exempt.length;
      for (var i = 0; i < 40 - tlength; i++) {
        exempt = " " + exempt;
      }
      ret.push(exempt + "\n");
      var length = invoice_taxes.exonerado_total.toString().length;
      var exempt = "Importe Exonerado";
      for (var i = length; i <= 11; i++) {
        exempt = exempt + " ";
      }
      exempt = exempt + format_currency(invoice_taxes.exonerado_total);
      var tlength = exempt.length;
      for (var i = 0; i < 40 - tlength; i++) {
        exempt = " " + exempt;
      }
      ret.push(exempt + "\n");
      var length = invoice_taxes.isv_15_tax_total.toString().length;
      var exempt = "Importe Gravado ISV 15%";
      for (var i = length; i <= 11; i++) {
        exempt = exempt + " ";
      }
      exempt = exempt + format_currency(invoice_taxes.isv_15_tax_total);
      var tlength = exempt.length;
      for (var i = 0; i < 40 - tlength; i++) {
        exempt = " " + exempt;
      }
      ret.push(exempt + "\n");
      var length = invoice_taxes.isv_18_tax_total.toString().length;
      var exempt = "Importe Gravado ISV 18%";
      for (var i = length; i <= 11; i++) {
        exempt = exempt + " ";
      }
      exempt = exempt + format_currency(invoice_taxes.isv_18_tax_total);
      var tlength = exempt.length;
      for (var i = 0; i < 40 - tlength; i++) {
        exempt = " " + exempt;
      }
      ret.push(exempt + "\n");
      var length = invoice_taxes.isv_15_total.toString().length;
      var exempt = "ISV 15%";
      for (var i = length; i <= 11; i++) {
        exempt = exempt + " ";
      }
      exempt = exempt + format_currency(invoice_taxes.isv_15_total);
      var tlength = exempt.length;
      for (var i = 0; i < 40 - tlength; i++) {
        exempt = " " + exempt;
      }
      ret.push(exempt + "\n");
      var length = invoice_taxes.isv_18_total.toString().length;
      var exempt = "ISV 15%";
      for (var i = length; i <= 11; i++) {
        exempt = exempt + " ";
      }
      exempt = exempt + format_currency(invoice_taxes.isv_18_total);
      var tlength = exempt.length;
      for (var i = 0; i < 40 - tlength; i++) {
        exempt = " " + exempt;
      }
      ret.push(exempt + "\n");
      ret.push("\x1BE\r");
      var total = "Total";
      length = doc.grand_total.toString().length;
      for (var i = length; i <= 11; i++) {
        total = total + " ";
      }
      total = total + format_currency(doc.grand_total);
      var tlength = total.length;
      for (var i = 0; i < 40 - tlength; i++) {
        total = " " + total;
      }
      ret.push(total + "\n");
      ret.push("\x1BE\n\n");
      var stripe_info = [];
      var cash_drawer = [];
      if (doc.payments && doc.payments.length > 0) {
        doc.payments.forEach(function(row) {
          if (row.base_amount > 0) {
            length = row.base_amount.toString().length;
            total = row.mode_of_payment + " ";
            for (var i2 = length; i2 <= 11; i2++) {
              total = total + " ";
            }
            total = total + format_currency(row.base_amount);
            var tlength2 = total.length;
            for (var i2 = 0; i2 < 40 - tlength2; i2++) {
              total = " " + total;
            }
            ret.push(total + "\n");
            if (row.mode_of_payment == window.stripe_mode_of_payment && row.base_amount > 0) {
              stripe_info = [
                "\x1Ba1",
                "\n",
                row.card_brand.toUpperCase() + " XXXXXXXXXXXX" + row.card_last4 + "\n",
                "Auth CD: " + row.card_authorization_code + "\n",
                "AID: " + row.card_dedicated_file_name + "\n",
                row.card_application_preferred_name + "\n",
                "TVR: " + row.card_terminal_verification_results + "\n",
                "TSI: " + row.card_transaction_status_information + "\n",
                "IAD: " + row.card_dedicated_file_name
              ];
            }
          }
        });
      }
      ret.push("\x1BE\r");
      total = "Recibido ";
      length = doc.grand_total.toString().length;
      for (var i = length; i <= 11; i++) {
        total = total + " ";
      }
      total = total + format_currency(doc.paid_amount);
      var tlength = total.length;
      for (var i = 0; i < 40 - tlength; i++) {
        total = " " + total;
      }
      ret.push(total + "\n");
      ret.push("\x1BE\n\n");
      ret.push(writtenNumber(doc.grand_total, { lang: "es" }) + "\n\n");
      if (stripe_info.length > 0) {
        ret.push.apply(ret, stripe_info);
      }
      return ret;
    }
    get_extra_print(doc) {
      var ret = [
        "Registro SAG " + (doc.identificativo_registro_sag ? doc.identificativo_registro_sag.toString() : "") + "\n",
        "Const. Regis. Exonerado # " + (doc.correlativo_constancia_registro_exonerado ? doc.correlativo_constancia_registro_exonerado.toString() : "") + "\n",
        "OC Exenta " + (doc.correlativo_orden_compra_exenta ? doc.correlativo_orden_compra_exenta.toString() : "") + "\n"
      ];
      return ret;
    }
    get_item_print(item, qty, rate, amount, currency) {
      var ilength = item.length;
      var ret = [];
      for (var i = 0; i < ilength; i = i + 29) {
        ret.push(item.substring(i, i + 29) + "\n");
      }
      var qty_rate = qty.toString() + " @ " + format_currency(rate);
      var qlength = qty_rate.length;
      for (var i = 0; i < 29 - qlength; i++) {
        qty_rate = qty_rate + " ";
      }
      var alength = format_currency(amount).length;
      for (var i = 0; i < 10 - alength; i++) {
        qty_rate = qty_rate + " ";
      }
      qty_rate = qty_rate + format_currency(amount);
      ret.push(qty_rate + "\n");
      return ret;
    }
  };
})();
//# sourceMappingURL=point-of-sale-pasigono.bundle.B35SV7YK.js.map
