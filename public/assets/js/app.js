function show_owner_tooltip(a) {
    var b = a.parentNode;
    if (null === b.querySelector(".tooltip")) {
        var c = a.getAttribute("data-owner-id"), d = JSON.parse(get_owner(c)), e = document.createElement("div");
        e.classList.add("tooltip");
        var f = document.getElementById("tooltip-template").innerHTML;
        e.innerHTML = Mustache.render(f, d), b.appendChild(e);
    }
}

function hide_owner_tooltip(a) {
    var b = a.parentNode, c = a.nextElementSibling;
    b.removeChild(c);
}

function get_owner(a) {
    return get_owner_from_storage(a) ? get_owner_from_storage(a) : get_owner_from_api(a);
}

function get_owner_from_storage(a) {
    return !!sessionStorage.getItem("hackagist_owner_" + a) && sessionStorage.getItem("hackagist_owner_" + a);
}

function get_owner_from_api(a) {
    var b = new XMLHttpRequest();
    b.open("GET", "https://api.hackaday.io/v1/users/" + a + "?api_key=" + hdapi, !0), 
    b.onload = function() {
        if (b.status >= 200 && b.status < 400) {
            var c = b.responseText;
            return sessionStorage.setItem("hackagist_owner_" + a, c), c;
        }
    }, b.onerror = function() {}, b.send();
}

function check_owners() {
    var a = document.querySelectorAll(".project .owner");
    Array.prototype.forEach.call(a, function(a, b) {
        get_owner(a.getAttribute("data-owner-id"));
    });
}

function start_listening() {
    var a = document.querySelectorAll(".project .owner");
    Array.prototype.forEach.call(a, function(a, b) {
        a.addEventListener("mouseenter", function(b) {
            show_owner_tooltip(a);
        }, !1), a.parentNode.addEventListener("mouseleave", function(b) {
            hide_owner_tooltip(a);
        }, !1);
    });
}

function ready(a) {
    "loading" != document.readyState ? a() : document.addEventListener("DOMContentLoaded", a);
}

!function(a, b) {
    "object" == typeof exports && exports && "string" != typeof exports.nodeName ? b(exports) : "function" == typeof define && define.amd ? define([ "exports" ], b) : (a.Mustache = {}, 
    b(a.Mustache));
}(this, function(a) {
    function b(a) {
        return "function" == typeof a;
    }
    function c(a) {
        return p(a) ? "array" : typeof a;
    }
    function d(a) {
        return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
    function e(a, b) {
        return null != a && "object" == typeof a && b in a;
    }
    function f(a, b) {
        return q.call(a, b);
    }
    function g(a) {
        return !f(r, a);
    }
    function h(a) {
        return String(a).replace(/[&<>"'`=\/]/g, function(a) {
            return s[a];
        });
    }
    function i(b, c) {
        function e(a) {
            if ("string" == typeof a && (a = a.split(u, 2)), !p(a) || 2 !== a.length) throw new Error("Invalid tags: " + a);
            f = new RegExp(d(a[0]) + "\\s*"), h = new RegExp("\\s*" + d(a[1])), i = new RegExp("\\s*" + d("}" + a[1]));
        }
        if (!b) return [];
        var f, h, i, m = [], n = [], o = [], q = !1, r = !1;
        e(c || a.tags);
        for (var s, y, z, A, B, C, D = new l(b); !D.eos(); ) {
            if (s = D.pos, z = D.scanUntil(f)) for (var E = 0, F = z.length; E < F; ++E) A = z.charAt(E), 
            g(A) ? o.push(n.length) : r = !0, n.push([ "text", A, s, s + 1 ]), s += 1, "\n" === A && function() {
                if (q && !r) for (;o.length; ) delete n[o.pop()]; else o = [];
                q = !1, r = !1;
            }();
            if (!D.scan(f)) break;
            if (q = !0, y = D.scan(x) || "name", D.scan(t), "=" === y ? (z = D.scanUntil(v), 
            D.scan(v), D.scanUntil(h)) : "{" === y ? (z = D.scanUntil(i), D.scan(w), D.scanUntil(h), 
            y = "&") : z = D.scanUntil(h), !D.scan(h)) throw new Error("Unclosed tag at " + D.pos);
            if (B = [ y, z, s, D.pos ], n.push(B), "#" === y || "^" === y) m.push(B); else if ("/" === y) {
                if (!(C = m.pop())) throw new Error('Unopened section "' + z + '" at ' + s);
                if (C[1] !== z) throw new Error('Unclosed section "' + C[1] + '" at ' + s);
            } else "name" === y || "{" === y || "&" === y ? r = !0 : "=" === y && e(z);
        }
        if (C = m.pop()) throw new Error('Unclosed section "' + C[1] + '" at ' + D.pos);
        return k(j(n));
    }
    function j(a) {
        for (var b, c, d = [], e = 0, f = a.length; e < f; ++e) (b = a[e]) && ("text" === b[0] && c && "text" === c[0] ? (c[1] += b[1], 
        c[3] = b[3]) : (d.push(b), c = b));
        return d;
    }
    function k(a) {
        for (var b, c, d = [], e = d, f = [], g = 0, h = a.length; g < h; ++g) switch (b = a[g], 
        b[0]) {
          case "#":
          case "^":
            e.push(b), f.push(b), e = b[4] = [];
            break;

          case "/":
            c = f.pop(), c[5] = b[2], e = f.length > 0 ? f[f.length - 1][4] : d;
            break;

          default:
            e.push(b);
        }
        return d;
    }
    function l(a) {
        this.string = a, this.tail = a, this.pos = 0;
    }
    function m(a, b) {
        this.view = a, this.cache = {
            ".": this.view
        }, this.parent = b;
    }
    function n() {
        this.cache = {};
    }
    var o = Object.prototype.toString, p = Array.isArray || function(a) {
        return "[object Array]" === o.call(a);
    }, q = RegExp.prototype.test, r = /\S/, s = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;"
    }, t = /\s*/, u = /\s+/, v = /\s*=/, w = /\s*\}/, x = /#|\^|\/|>|\{|&|=|!/;
    l.prototype.eos = function() {
        return "" === this.tail;
    }, l.prototype.scan = function(a) {
        var b = this.tail.match(a);
        if (!b || 0 !== b.index) return "";
        var c = b[0];
        return this.tail = this.tail.substring(c.length), this.pos += c.length, c;
    }, l.prototype.scanUntil = function(a) {
        var b, c = this.tail.search(a);
        switch (c) {
          case -1:
            b = this.tail, this.tail = "";
            break;

          case 0:
            b = "";
            break;

          default:
            b = this.tail.substring(0, c), this.tail = this.tail.substring(c);
        }
        return this.pos += b.length, b;
    }, m.prototype.push = function(a) {
        return new m(a, this);
    }, m.prototype.lookup = function(a) {
        var c, d = this.cache;
        if (d.hasOwnProperty(a)) c = d[a]; else {
            for (var f, g, h = this, i = !1; h; ) {
                if (a.indexOf(".") > 0) for (c = h.view, f = a.split("."), g = 0; null != c && g < f.length; ) g === f.length - 1 && (i = e(c, f[g])), 
                c = c[f[g++]]; else c = h.view[a], i = e(h.view, a);
                if (i) break;
                h = h.parent;
            }
            d[a] = c;
        }
        return b(c) && (c = c.call(this.view)), c;
    }, n.prototype.clearCache = function() {
        this.cache = {};
    }, n.prototype.parse = function(a, b) {
        var c = this.cache, d = c[a];
        return null == d && (d = c[a] = i(a, b)), d;
    }, n.prototype.render = function(a, b, c) {
        var d = this.parse(a), e = b instanceof m ? b : new m(b);
        return this.renderTokens(d, e, c, a);
    }, n.prototype.renderTokens = function(a, b, c, d) {
        for (var e, f, g, h = "", i = 0, j = a.length; i < j; ++i) g = void 0, e = a[i], 
        f = e[0], "#" === f ? g = this.renderSection(e, b, c, d) : "^" === f ? g = this.renderInverted(e, b, c, d) : ">" === f ? g = this.renderPartial(e, b, c, d) : "&" === f ? g = this.unescapedValue(e, b) : "name" === f ? g = this.escapedValue(e, b) : "text" === f && (g = this.rawValue(e)), 
        void 0 !== g && (h += g);
        return h;
    }, n.prototype.renderSection = function(a, c, d, e) {
        function f(a) {
            return g.render(a, c, d);
        }
        var g = this, h = "", i = c.lookup(a[1]);
        if (i) {
            if (p(i)) for (var j = 0, k = i.length; j < k; ++j) h += this.renderTokens(a[4], c.push(i[j]), d, e); else if ("object" == typeof i || "string" == typeof i || "number" == typeof i) h += this.renderTokens(a[4], c.push(i), d, e); else if (b(i)) {
                if ("string" != typeof e) throw new Error("Cannot use higher-order sections without the original template");
                i = i.call(c.view, e.slice(a[3], a[5]), f), null != i && (h += i);
            } else h += this.renderTokens(a[4], c, d, e);
            return h;
        }
    }, n.prototype.renderInverted = function(a, b, c, d) {
        var e = b.lookup(a[1]);
        if (!e || p(e) && 0 === e.length) return this.renderTokens(a[4], b, c, d);
    }, n.prototype.renderPartial = function(a, c, d) {
        if (d) {
            var e = b(d) ? d(a[1]) : d[a[1]];
            return null != e ? this.renderTokens(this.parse(e), c, d, e) : void 0;
        }
    }, n.prototype.unescapedValue = function(a, b) {
        var c = b.lookup(a[1]);
        if (null != c) return c;
    }, n.prototype.escapedValue = function(b, c) {
        var d = c.lookup(b[1]);
        if (null != d) return a.escape(d);
    }, n.prototype.rawValue = function(a) {
        return a[1];
    }, a.name = "mustache.js", a.version = "2.3.0", a.tags = [ "{{", "}}" ];
    var y = new n();
    return a.clearCache = function() {
        return y.clearCache();
    }, a.parse = function(a, b) {
        return y.parse(a, b);
    }, a.render = function(a, b, d) {
        if ("string" != typeof a) throw new TypeError('Invalid template! Template should be a "string" but "' + c(a) + '" was given as the first argument for mustache#render(template, view, partials)');
        return y.render(a, b, d);
    }, a.to_html = function(c, d, e, f) {
        var g = a.render(c, d, e);
        if (!b(f)) return g;
        f(g);
    }, a.escape = h, a.Scanner = l, a.Context = m, a.Writer = n, a;
}), check_owners(), ready(start_listening);
//# sourceMappingURL=app.js.map