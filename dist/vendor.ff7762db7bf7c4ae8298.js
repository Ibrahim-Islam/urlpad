/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var characters = ['<', '>', '"', '`', ' ', '\r', '\n', '\t', '{', '}', '|', '\\', '^', '`', '\''];
var map = [];
var i;
var ch;
var esc;
var len;
for (i = 0, len = characters.length; i < len; ++i) {
  ch = characters[i];
  esc = encodeURIComponent(ch);
  if (esc === ch) {
    esc = global.escape(ch);
  }
  map[ch.charCodeAt(0)] = esc;
}

module.exports = map;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var querystring = __webpack_require__(3);
var autoescape = __webpack_require__(0);
var getComponentEscaped = __webpack_require__(2);

function parse (input) {
  var start = 0;
  var end = input.length - 1;
  var _protocol;
  var _hostname;
  var _host;
  var _port;
  var _prependSlash;
  var _pathname;
  var _path;
  var _query;
  var _search;
  var _hash;
  var ch;

  while (input.charCodeAt(start) <= 0x20 /*' '*/) { start++; }
  while (input.charCodeAt(end) <= 0x20 /*' '*/) { end--; }

  start = parseProtocol(input, start, end);
  start = parseHost(input, start, end);

  if (start <= end) {
    ch = input.charCodeAt(start);
    if (ch === 0x2F /*'/'*/) {
      parsePath(input, start, end);
    } else if (ch === 0x3F /*'?'*/) {
      parseQuery(input, start, end);
    } else if (ch === 0x23 /*'#'*/) {
      parseHash(input, start, end);
    } else {
      parsePath(input, start, end);
    }
  }

  if (!_pathname) { _pathname = '/'; }
  if (!_query) { _query = ''; }
  if (!_search) { _search = ''; }

  _path = parseFullPath();

  parseQueryString();

  return {
    protocol: _protocol,
    hostname: _hostname,
    host: _host,
    port: _port,
    pathname: _pathname,
    path: _path,
    search: _search,
    hash: _hash,
    query: _query
  };

  function parseProtocol (input, start, end) {
    for (var i = start; i <= end; ++i) {
      if (input.charCodeAt(i) === 0x3A /*':'*/) {
        _protocol = input.slice(start, i).toLowerCase();
        return i + 1;
      }
    }
    return start;
  }

  function parseHost (input, start, end) {
    if (input.charCodeAt(start) !== 0x2F /*'/'*/ ||
        input.charCodeAt(start + 1) !== 0x2F /*'/'*/) {
      return start;
    }

    start += 2; // assume slashes

    var lower = false;
    var hostNameStart = start;
    var hostNameEnd = end;
    var portLength = 0;
    var charsAfterDot = 0;
    var hostname;

    for (var i = start; i <= end; ++i) {
      if (charsAfterDot > 62) {
        _hostname = _host = input.slice(start, i);
        return i;
      }
      var ch = input.charCodeAt(i);
      if (ch === 0x3A /*':'*/) {
        portLength = parsePort(input, i + 1, end) + 1;
        hostNameEnd = i - 1;
        break;
      } else if (ch < 0x61 /*'a'*/) {
        if (ch === 0x2E /*'.'*/) {
          charsAfterDot = -1;
        } else if (0x41 /*'A'*/ <= ch && ch <= 0x5A /*'Z'*/) {
          lower = true;
        } else if (!(ch === 0x2D /*'-'*/ || ch === 0x5F /*'_'*/ || (0x30 /*'0'*/ <= ch && ch <= 0x39 /*'9'*/))) {
          if (ch !== 0x2F /*'/'*/ && ch !== 0x3F /*'?'*/ && ch !== 0x23 /*'#'*/) {
            _prependSlash = true;
          }
          hostNameEnd = i - 1;
          break;
        }
      }
      charsAfterDot++;
    }
    if (hostNameEnd + 1 !== start && hostNameEnd - hostNameStart <= 256) {
      hostname = input.slice(hostNameStart, hostNameEnd + 1);
      if (lower) {
        hostname = hostname.toLowerCase();
      }
      _hostname = hostname;
      _host = _port > 0 ? hostname + ':' + _port : hostname;
    }
    return hostNameEnd + 1 + portLength;
  }

  function parsePort (text, start, end) {
    var port = 0;
    var any = false;

    for (var i = start; i <= end; ++i) {
      var ch = text.charCodeAt(i);
      if (ch >= 0x30 /*'0'*/ && ch <= 0x39 /*'9'*/) {
        port = (10 * port) + (ch - 0x30 /*'0'*/);
        any = true;
      } else {
        break;
      }
    }
    if (port === 0 && !any) {
      return 0;
    }
    _port = port;
    return i - start;
  }

  function parsePath (text, start, end) {
    var pathStart = start;
    var pathEnd = end;
    var escape = false;
    var path;
    var i;
    var ch;
    for (i = start; i <= end; ++i) {
      ch = text.charCodeAt(i);
      if (ch === 0x23 /*'#'*/) {
        parseHash(text, i, end);
        pathEnd = i - 1;
        break;
      } else if (ch === 0x3F /*'?'*/) {
        parseQuery(text, i, end);
        pathEnd = i - 1;
        break;
      } else if (!escape && autoescape[ch]) {
        escape = true;
      }
    }
    if (pathStart > pathEnd) {
      _pathname = '/'; return;
    }
    if (escape) {
      path = getComponentEscaped(text, pathStart, pathEnd);
    } else {
      path = text.slice(pathStart, pathEnd + 1);
    }
    _pathname = _prependSlash ? '/' + path : path;
  }

  function parseQuery (text, start, end) {
    var queryStart = start;
    var queryEnd = end;
    var escape = false;
    var i;
    var ch;
    var query;

    for (i = start; i <= end; ++i) {
      ch = text.charCodeAt(i);
      if (ch === 0x23 /*'#'*/) {
        parseHash(text, i, end);
        queryEnd = i - 1;
        break;
      } else if (!escape && autoescape[ch]) {
        escape = true;
      }
    }
    if (queryStart > queryEnd) {
      _search = ''; return;
    }
    if (escape) {
      query = getComponentEscaped(text, queryStart, queryEnd);
    } else {
      query = text.slice(queryStart, queryEnd + 1);
    }
    _search = query;
  }

  function parseQueryString () {
    var search = _search;
    if (search.charCodeAt(0) === 0x3F /*'?'*/) {
      search = search.slice(1);
    }
    _query = querystring.parse(search);
  }

  function parseHash (text, start, end) {
    if (start > end) {
      _hash = ''; return;
    }
    _hash = getComponentEscaped(text, start, end);
  }

  function parseFullPath () {
    if (_pathname || _search) {
      return _pathname + _search;
    }
    if (!_pathname && _search) {
      return '/' + _search;
    }
    return '';
  }
}

module.exports = {
  parse: parse
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var autoescape = __webpack_require__(0);

function getComponentEscaped (text, start, end) {
  var i = start;
  var current = start;
  var result = '';
  var ch;
  var escaped;
  for (; i <= end; ++i) {
    ch = text.charCodeAt(i);
    escaped = autoescape[ch];
    if (escaped) {
      if (current < i) {
        result += text.slice(current, i);
      }
      result += escaped;
      current = i + 1;
    }
  }
  if (current < i + 1) {
    result += text.slice(current, i);
  }
  return result;
}

module.exports = getComponentEscaped;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var separator = '&';
var equals = '=';
var plus = '%20';
var maxKeys = 1000;
var isArray = Array.isArray || function isArray (input) {
  return Object.prototype.toString.call(input) === '[object Array]';
};

function hasOwnProperty (input, prop) {
  return Object.prototype.hasOwnProperty.call(input, prop);
}

function parse (qs) {
  var map = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return map;
  }

  var rplus = /\+/g;
  var x;
  var idx;
  var kstr;
  var vstr;
  var k;
  var v;
  var i;
  var parts = qs.split(separator);
  var len = parts.length;
  if (len > maxKeys) {
    len = maxKeys;
  }

  for (i = 0; i < len; i++) {
    x = parts[i].replace(rplus, plus);
    idx = x.indexOf(equals);

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(map, k)) {
      map[k] = v;
    } else if (isArray(map[k])) {
      map[k].push(v);
    } else {
      map[k] = [map[k], v];
    }
  }

  return map;
}

module.exports = {
  parse: parse
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(1);
// import 'bootstrap/dist/css/bootstrap.css'; 


/***/ })
/******/ ]);