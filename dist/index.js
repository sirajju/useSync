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
  e.r(r), e.d(r, { syncIndividual: () => d, useSync: () => f });
  const t = require("tslib"),
    n = require("react"),
    o = require("react-redux");
  var a,
    i,
    c = [],
    s = new Map(),
    u = function (e) {
      if (a && a.throwError) throw new Error(e);
    },
    f = function (e) {
      var r = e.fetchOrder,
        f = e.fetchItems,
        d =
          (e.throwError,
          (0, t.__rest)(e, ["fetchOrder", "fetchItems", "throwError"]));
      (a = (0, t.__assign)((0, t.__assign)({}, d), {
        fetchItems: f,
        fetchOrder: r,
      })),
        (s = f),
        (c = r);
      var v = (0, t.__read)(
          (0, n.useState)({ isPending: !1, haveError: !1 }),
          2
        ),
        _ = v[0],
        y = v[1],
        p = (0, o.useDispatch)();
      return (
        (i = p),
        (0, n.useEffect)(
          function () {
            (0, t.__awaiter)(void 0, void 0, void 0, function () {
              var e, n, o, i;
              return (0, t.__generator)(this, function (c) {
                switch (c.label) {
                  case 0:
                    (e = []),
                      (n = []),
                      y({ isPending: !0, haveError: !1 }),
                      (c.label = 1);
                  case 1:
                    return (
                      c.trys.push([1, 3, , 4]),
                      (o = r.map(function (r) {
                        return (0,
                        t.__awaiter)(void 0, void 0, void 0, function () {
                          var o, a, i;
                          return (0, t.__generator)(this, function (t) {
                            switch (t.label) {
                              case 0:
                                return (o = f.get(r.key))
                                  ? (r.refetchOnline && e.push(r.key),
                                    r.refetchOnFocus && n.push(r.key),
                                    [4, fetch(o, r.options || {})])
                                  : [2, u("url not found for ".concat(r.key))];
                              case 1:
                                return (a = t.sent()).ok
                                  ? [4, a.json()]
                                  : [2, u("failedd to fetch ".concat(r.key))];
                              case 2:
                                return (i = t.sent()), p(r.action(i)), [2];
                            }
                          });
                        });
                      })),
                      [4, Promise.all(o)]
                    );
                  case 2:
                    return (
                      c.sent(),
                      l(e, p),
                      h(n, p),
                      y({ isPending: !1, haveError: !1 }),
                      [3, 4]
                    );
                  case 3:
                    return (
                      (i = c.sent()),
                      a.onError && a.onError(i),
                      y({ isPending: !1, haveError: !0 }),
                      [3, 4]
                    );
                  case 4:
                    return [2];
                }
              });
            });
          },
          [p]
        ),
        _
      );
    },
    d = function (e) {
      for (var r = [], n = 1; n < arguments.length; n++)
        r[n - 1] = arguments[n];
      return (0, t.__awaiter)(
        void 0,
        (0, t.__spreadArray)([e], (0, t.__read)(r), !1),
        void 0,
        function (e, r) {
          var n, o, a, f;
          return (
            void 0 === r && (r = i),
            (0, t.__generator)(this, function (t) {
              switch (t.label) {
                case 0:
                  return "function" != typeof r
                    ? [
                        2,
                        u(
                          "Expected dispatch(useDispatch()) function got ".concat(
                            typeof r
                          )
                        ),
                      ]
                    : ((n = c.find(function (r) {
                        return r.key === e;
                      })),
                      (o = s.get(e)) && n
                        ? [4, fetch(o, n.options || {})]
                        : [2, u("no url found for item ".concat(e))]);
                case 1:
                  return (a = t.sent()).ok
                    ? [4, a.json()]
                    : [
                        2,
                        u(
                          "Failed to fetch ".concat(e, " ").concat(a.statusText)
                        ),
                      ];
                case 2:
                  return (f = t.sent()), r(n.action(f)), [2, f];
              }
            })
          );
        }
      );
    },
    l = function (e, r) {
      window.addEventListener("online", function () {
        var n, o;
        try {
          for (
            var a = (0, t.__values)(e), i = a.next();
            !i.done;
            i = a.next()
          ) {
            var c = i.value;
            d(c, r);
          }
        } catch (e) {
          n = { error: e };
        } finally {
          try {
            i && !i.done && (o = a.return) && o.call(a);
          } finally {
            if (n) throw n.error;
          }
        }
      });
    },
    h = function (e, r) {
      window.addEventListener("focus", function () {
        var n, o;
        try {
          for (
            var a = (0, t.__values)(e), i = a.next();
            !i.done;
            i = a.next()
          ) {
            var c = i.value;
            d(c, r);
          }
        } catch (e) {
          n = { error: e };
        } finally {
          try {
            i && !i.done && (o = a.return) && o.call(a);
          } finally {
            if (n) throw n.error;
          }
        }
      });
    };
  module.exports = r;
})();
