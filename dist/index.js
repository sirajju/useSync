(() => {
  "use strict";
  var e = {
      d: (r, t) => {
        for (var n in t)
          e.o(t, n) &&
            !e.o(r, n) &&
            Object.defineProperty(r, n, { enumerable: !0, get: t[n] });
      },
      o: (e, r) => Object.prototype.hasOwnProperty.call(e, r),
      r: (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      },
    },
    r = {};
  e.r(r),
    e.d(r, { clearCache: () => k, syncIndividual: () => D, useSync: () => R });
  const t = require("react"),
    n = require("react-redux");
  var o,
    c,
    i = function () {
      return (
        (i =
          Object.assign ||
          function (e) {
            for (var r, t = 1, n = arguments.length; t < n; t++)
              for (var o in (r = arguments[t]))
                Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o]);
            return e;
          }),
        i.apply(this, arguments)
      );
    },
    a = function (e, r, t, n) {
      return new (t || (t = Promise))(function (o, c) {
        function i(e) {
          try {
            u(n.next(e));
          } catch (e) {
            c(e);
          }
        }
        function a(e) {
          try {
            u(n.throw(e));
          } catch (e) {
            c(e);
          }
        }
        function u(e) {
          var r;
          e.done
            ? o(e.value)
            : ((r = e.value),
              r instanceof t
                ? r
                : new t(function (e) {
                    e(r);
                  })).then(i, a);
        }
        u((n = n.apply(e, r || [])).next());
      });
    },
    u = function (e, r) {
      var t,
        n,
        o,
        c = {
          label: 0,
          sent: function () {
            if (1 & o[0]) throw o[1];
            return o[1];
          },
          trys: [],
          ops: [],
        },
        i = Object.create(
          ("function" == typeof Iterator ? Iterator : Object).prototype
        );
      return (
        (i.next = a(0)),
        (i.throw = a(1)),
        (i.return = a(2)),
        "function" == typeof Symbol &&
          (i[Symbol.iterator] = function () {
            return this;
          }),
        i
      );
      function a(a) {
        return function (u) {
          return (function (a) {
            if (t) throw new TypeError("Generator is already executing.");
            for (; i && ((i = 0), a[0] && (c = 0)), c; )
              try {
                if (
                  ((t = 1),
                  n &&
                    (o =
                      2 & a[0]
                        ? n.return
                        : a[0]
                        ? n.throw || ((o = n.return) && o.call(n), 0)
                        : n.next) &&
                    !(o = o.call(n, a[1])).done)
                )
                  return o;
                switch (((n = 0), o && (a = [2 & a[0], o.value]), a[0])) {
                  case 0:
                  case 1:
                    o = a;
                    break;
                  case 4:
                    return c.label++, { value: a[1], done: !1 };
                  case 5:
                    c.label++, (n = a[1]), (a = [0]);
                    continue;
                  case 7:
                    (a = c.ops.pop()), c.trys.pop();
                    continue;
                  default:
                    if (
                      !((o = c.trys),
                      (o = o.length > 0 && o[o.length - 1]) ||
                        (6 !== a[0] && 2 !== a[0]))
                    ) {
                      c = 0;
                      continue;
                    }
                    if (3 === a[0] && (!o || (a[1] > o[0] && a[1] < o[3]))) {
                      c.label = a[1];
                      break;
                    }
                    if (6 === a[0] && c.label < o[1]) {
                      (c.label = o[1]), (o = a);
                      break;
                    }
                    if (o && c.label < o[2]) {
                      (c.label = o[2]), c.ops.push(a);
                      break;
                    }
                    o[2] && c.ops.pop(), c.trys.pop();
                    continue;
                }
                a = r.call(e, c);
              } catch (e) {
                (a = [6, e]), (n = 0);
              } finally {
                t = o = 0;
              }
            if (5 & a[0]) throw a[1];
            return { value: a[0] ? a[1] : void 0, done: !0 };
          })([a, u]);
        };
      }
    },
    f = function (e, r) {
      var t = {};
      for (var n in e)
        Object.prototype.hasOwnProperty.call(e, n) &&
          r.indexOf(n) < 0 &&
          (t[n] = e[n]);
      if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
        var o = 0;
        for (n = Object.getOwnPropertySymbols(e); o < n.length; o++)
          r.indexOf(n[o]) < 0 &&
            Object.prototype.propertyIsEnumerable.call(e, n[o]) &&
            (t[n[o]] = e[n[o]]);
      }
      return t;
    },
    s = function (e, r) {
      var t = "function" == typeof Symbol && e[Symbol.iterator];
      if (!t) return e;
      var n,
        o,
        c = t.call(e),
        i = [];
      try {
        for (; (void 0 === r || r-- > 0) && !(n = c.next()).done; )
          i.push(n.value);
      } catch (e) {
        o = { error: e };
      } finally {
        try {
          n && !n.done && (t = c.return) && t.call(c);
        } finally {
          if (o) throw o.error;
        }
      }
      return i;
    },
    l = function (e, r, t) {
      if (t || 2 === arguments.length)
        for (var n, o = 0, c = r.length; o < c; o++)
          (!n && o in r) ||
            (n || (n = Array.prototype.slice.call(r, 0, o)), (n[o] = r[o]));
      return e.concat(n || Array.prototype.slice.call(r));
    },
    d = function (e) {
      var r = "function" == typeof Symbol && Symbol.iterator,
        t = r && e[r],
        n = 0;
      if (t) return t.call(e);
      if (e && "number" == typeof e.length)
        return {
          next: function () {
            return (
              e && n >= e.length && (e = void 0),
              { value: e && e[n++], done: !e }
            );
          },
        };
      throw new TypeError(
        r ? "Object is not iterable." : "Symbol.iterator is not defined."
      );
    },
    y = [],
    v = new Map();
  !(function (e) {
    (e[(e.DEBUG = 0)] = "DEBUG"),
      (e[(e.INFO = 1)] = "INFO"),
      (e[(e.WARN = 2)] = "WARN"),
      (e[(e.ERROR = 3)] = "ERROR");
  })(o || (o = {}));
  var h,
    p = function (e) {
      if (c && c.throwError) throw new Error(e);
      console.error(e);
    },
    g = {
      DEBUG: "color: #5bc0de",
      INFO: "color: #28a745",
      WARN: "color: #ffc107",
      ERROR: "color: #dc3545",
      DEFAULT: "",
    },
    w = function (e, r, t) {
      if (
        (void 0 === r && (r = "INFO"),
        (null == c ? void 0 : c.log) &&
          (function (e) {
            if (!(null == c ? void 0 : c.logLevel)) return !0;
            var r = o[c.logLevel];
            return o[e] >= r;
          })(r))
      ) {
        var n = new Date().toISOString(),
          i = "[".concat(n, "] %c").concat(r.toUpperCase(), "%c: ").concat(e);
        if (c.logger) return c.logger(e);
        t
          ? console[r.toLowerCase()](i, g[r], g.DEFAULT, t)
          : console[r.toLowerCase()](i, g[r], g.DEFAULT);
      }
    },
    E = new Map(),
    b = new Map(),
    O = new Map(),
    m = 5e3,
    k = function (e) {
      e ? E.delete(e) : E.clear();
    },
    R = function (e) {
      var r = e.fetchOrder,
        o = e.fetchItems,
        g = e.throwError,
        R = void 0 === g || g,
        S = e.cacheDuration,
        I = e.logLevel,
        U = void 0 === I ? "DEBUG" : I,
        x = f(e, [
          "fetchOrder",
          "fetchItems",
          "throwError",
          "cacheDuration",
          "logLevel",
        ]),
        L = ((0, t.useRef)(!0), (0, t.useRef)(!1)),
        B = (0, t.useRef)(
          i({ fetchOrder: r, fetchItems: o, throwError: R, logLevel: U }, x)
        );
      (m = S || m),
        (c = B.current),
        (v = B.current.fetchItems),
        (y = B.current.fetchOrder);
      var G = s((0, t.useState)({ isPending: !0, haveError: !1 }), 2),
        P = G[0],
        j = G[1],
        A = s((0, t.useState)(new Set()), 2),
        F = A[0],
        C = A[1];
      (0, t.useEffect)(
        function () {
          j(function (e) {
            return i(i({}, e), { isPending: F.size > 0 });
          });
        },
        [F]
      );
      var N = (0, t.useRef)([]),
        T = (0, n.useDispatch)();
      h = T;
      var M = (0, t.useCallback)(
          function (e) {
            for (var r = [], t = 1; t < arguments.length; t++)
              r[t - 1] = arguments[t];
            return a(void 0, l([e], s(r), !1), void 0, function (e, r) {
              return (
                void 0 === r && (r = {}),
                u(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [4, D(e, r, T)];
                    case 1:
                      return t.sent(), [2];
                  }
                })
              );
            });
          },
          [T]
        ),
        q = (0, t.useCallback)(function (e, r) {
          return a(void 0, void 0, void 0, function () {
            var t, n, o, c, i;
            return u(this, function (f) {
              C(function (r) {
                return new Set(l(l([], s(Array.from(r)), !1), [e.key], !1));
              });
              try {
                return (
                  (t = "".concat(e.key, "-").concat(r)),
                  (n = Date.now()),
                  (o = E.get(t)) && n < o.expiresAt
                    ? (w("Using cached data for ".concat(e.key), "DEBUG"),
                      [2, o.data])
                    : (c = b.get(t)) && n - c.timestamp < 5e3
                    ? (w("Reusing pending request for ".concat(e.key), "DEBUG"),
                      [2, c.promise])
                    : ((i = a(void 0, void 0, void 0, function () {
                        var o, c;
                        return u(this, function (i) {
                          switch (i.label) {
                            case 0:
                              return (
                                i.trys.push([0, , 3, 4]),
                                w(
                                  "Making fresh request for ".concat(e.key),
                                  "DEBUG"
                                ),
                                [4, fetch(r, e.options || {})]
                              );
                            case 1:
                              if (!(o = i.sent()).ok)
                                throw (
                                  (w(
                                    "Request failed for ".concat(e.key),
                                    "ERROR",
                                    { status: o.status }
                                  ),
                                  new Error("Failed to fetch ".concat(e.key)))
                                );
                              return [4, o.json()];
                            case 2:
                              return (
                                (c = i.sent()),
                                E.set(t, {
                                  data: c,
                                  timestamp: n,
                                  expiresAt: n + m,
                                }),
                                w(
                                  "Cached new data for ".concat(e.key),
                                  "DEBUG",
                                  { expiresAt: new Date(n + m) }
                                ),
                                [2, c]
                              );
                            case 3:
                              return b.delete(t), [7];
                            case 4:
                              return [2];
                          }
                        });
                      })),
                      b.set(t, { timestamp: n, promise: i }),
                      [2, i])
                );
              } finally {
              }
              return [2];
            });
          });
        }, []),
        W = (0, t.useCallback)(
          function () {
            return a(void 0, void 0, void 0, function () {
              var e, r, t, n, o, c, f, y, v, h, g, E, b, m, k, R, S;
              return u(this, function (D) {
                switch (D.label) {
                  case 0:
                    if (!L.current) return [2];
                    D.label = 1;
                  case 1:
                    return (
                      D.trys.push([1, 3, 4, 5]),
                      j({ isPending: !0, haveError: !1 }),
                      w("Starting sync process", "INFO"),
                      (e = []),
                      (r = []),
                      (t = []),
                      (n = B.current.fetchOrder),
                      (o = B.current.fetchItems),
                      n.forEach(function (n) {
                        n.refetchOnline && e.push(n.key),
                          n.refetchOnFocus && r.push(n.key),
                          n.triggerEvents &&
                            t.push({
                              events:
                                "string" == typeof n.triggerEvents
                                  ? [n.triggerEvents]
                                  : n.triggerEvents,
                              key: n.key,
                            });
                      }),
                      (c = function () {
                        w("Online event triggered", "DEBUG"),
                          e.forEach(function (e) {
                            return M(e);
                          });
                      }),
                      (f = function () {
                        w("Focus event triggered", "DEBUG"),
                          r.forEach(function (e) {
                            return M(e);
                          });
                      }),
                      window.addEventListener("online", c),
                      window.addEventListener("focus", f),
                      (y = new Map()),
                      t.forEach(function (e) {
                        var r = e.key;
                        e.events.forEach(function (e) {
                          var t = function () {
                            w(
                              'Window event "'
                                .concat(e, '" triggered for ')
                                .concat(r),
                              "DEBUG"
                            ),
                              M(r);
                          };
                          y.set("".concat(r, "-").concat(e), t),
                            "undefined" != typeof window &&
                              window.addEventListener(e, t);
                        });
                      }),
                      (v = n
                        .map(function (e) {
                          return a(void 0, void 0, void 0, function () {
                            var r, t;
                            return u(this, function (n) {
                              switch (n.label) {
                                case 0:
                                  if (
                                    "boolean" == typeof e.initialSync &&
                                    !e.initialSync
                                  )
                                    return [2];
                                  if (
                                    "boolean" == typeof e.backgroundSync &&
                                    e.backgroundSync
                                  )
                                    return (
                                      C(function (r) {
                                        var t = new Set(r);
                                        return t.delete(e.key), t;
                                      }),
                                      [
                                        2,
                                        O.set(e.key, function () {
                                          return M(e.key);
                                        }),
                                      ]
                                    );
                                  if (N.current.includes(e.key))
                                    return (
                                      w(
                                        "Skipping ".concat(
                                          e.key,
                                          " - already pending"
                                        ),
                                        "WARN"
                                      ),
                                      [2]
                                    );
                                  if (!(r = o.get(e.key)))
                                    return (
                                      w(
                                        "URL not found for ".concat(e.key),
                                        "ERROR"
                                      ),
                                      [2, p("url not found for ".concat(e.key))]
                                    );
                                  (N.current = l(
                                    l([], s(N.current), !1),
                                    [e.key],
                                    !1
                                  )),
                                    (n.label = 1);
                                case 1:
                                  return n.trys.push([1, , 3, 4]), [4, q(e, r)];
                                case 2:
                                  return (
                                    (t = n.sent()),
                                    C(function (r) {
                                      var t = new Set(r);
                                      return t.delete(e.key), t;
                                    }),
                                    L.current && T(e.action(t)),
                                    [3, 4]
                                  );
                                case 3:
                                  return (
                                    L.current &&
                                      (N.current = N.current.filter(function (
                                        r
                                      ) {
                                        return r !== e.key;
                                      })),
                                    [7]
                                  );
                                case 4:
                                  return [2];
                              }
                            });
                          });
                        })
                        .filter(Boolean)),
                      [4, Promise.all(v)]
                    );
                  case 2:
                    if ((D.sent(), L.current)) {
                      j({ isPending: !1, haveError: !1 }),
                        (h = Array.from(O.entries()));
                      try {
                        for (g = d(h), E = g.next(); !E.done; E = g.next())
                          (b = s(E.value, 2)),
                            (m = b[0]),
                            (0, b[1])(),
                            O.delete(m);
                      } catch (e) {
                        R = { error: e };
                      } finally {
                        try {
                          E && !E.done && (S = g.return) && S.call(g);
                        } finally {
                          if (R) throw R.error;
                        }
                      }
                    }
                    return [
                      2,
                      function () {
                        w("Cleaning up event listeners", "DEBUG"),
                          window.removeEventListener("online", c),
                          window.removeEventListener("focus", f),
                          t.forEach(function (e) {
                            var r = e.key;
                            e.events.forEach(function (e) {
                              var t = y.get("".concat(r, "-").concat(e));
                              t &&
                                "undefined" != typeof window &&
                                window.removeEventListener(e, t);
                            });
                          }),
                          y.clear();
                      },
                    ];
                  case 3:
                    return (
                      (k = D.sent()),
                      j(function (e) {
                        return i(i({}, e), { haveError: !0 });
                      }),
                      w("Sync process failed", "ERROR", { error: k }),
                      B.current.onError && B.current.onError(k),
                      [3, 5]
                    );
                  case 4:
                    return [7];
                  case 5:
                    return [2];
                }
              });
            });
          },
          [T, q, M]
        );
      return (
        (0, t.useEffect)(
          function () {
            L.current = !0;
            var e = W();
            return function () {
              (L.current = !1),
                e.then(function (e) {
                  return e && e();
                });
            };
          },
          [W]
        ),
        {
          isPending: P.isPending || F.size > 0,
          haveError: P.haveError,
          clearCache: k,
          refresh: W,
          loadingItems: Array.from(F),
        }
      );
    },
    S = [],
    D = function (e) {
      for (var r = [], t = 1; t < arguments.length; t++)
        r[t - 1] = arguments[t];
      return a(void 0, l([e], s(r), !1), void 0, function (e, r, t) {
        var n, o, c, a, f, s, l;
        return (
          void 0 === r && (r = {}),
          void 0 === t && (t = h),
          u(this, function (u) {
            switch (u.label) {
              case 0:
                if (((n = "individual-".concat(e)), b.get(n)))
                  return (
                    w("Request already pending for ".concat(e), "DEBUG"), [2]
                  );
                if (S.includes(e))
                  return (
                    w("Skipping duplicate fetch for ".concat(e), "DEBUG"), [2]
                  );
                w("Starting individual sync for ".concat(e), "INFO"),
                  S.push(e),
                  (u.label = 1);
              case 1:
                return (
                  u.trys.push([1, 4, 5, 6]),
                  (o = y.find(function (r) {
                    return r.key === e;
                  })),
                  (c = v.get(e)) && o
                    ? ((a = i(i({}, o.options), r)), [4, fetch(c, a)])
                    : (w("Configuration not found for ".concat(e), "ERROR"),
                      [2, p("no url found for item ".concat(e))])
                );
              case 2:
                if (!(f = u.sent()).ok)
                  throw (
                    (w("Individual sync failed for ".concat(e), "ERROR", {
                      status: f.status,
                      statusText: f.statusText,
                    }),
                    new Error(
                      "Failed to fetch ".concat(e, " ").concat(f.statusText)
                    ))
                  );
                return [4, f.json()];
              case 3:
                return (
                  (s = u.sent()),
                  w("Individual sync successful for ".concat(e), "INFO", {
                    dataSize: JSON.stringify(s).length,
                  }),
                  t(o.action(s)),
                  [2, s]
                );
              case 4:
                return (
                  (l = u.sent()),
                  w("Individual sync error : ".concat(l), "ERROR"),
                  [3, 6]
                );
              case 5:
                return (
                  (S = S.filter(function (r) {
                    return r !== e;
                  })),
                  w("Completed individual sync for ".concat(e), "DEBUG"),
                  [7]
                );
              case 6:
                return [2];
            }
          })
        );
      });
    };
  module.exports = r;
})();
