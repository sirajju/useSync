"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncIndividual = exports.useSync = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var orders = [];
var items = new Map();
var options;
var throwErrorNow = function (message) {
    if (options && options.throwError)
        throw new Error(message);
    else
        console.error(message);
};
var myDispatch;
var useSync = function (_a) {
    var fetchOrder = _a.fetchOrder, fetchItems = _a.fetchItems, _b = _a.throwError, throwError = _b === void 0 ? true : _b, rest = tslib_1.__rest(_a, ["fetchOrder", "fetchItems", "throwError"]);
    options = tslib_1.__assign(tslib_1.__assign({}, rest), { fetchItems: fetchItems, fetchOrder: fetchOrder });
    items = fetchItems;
    orders = fetchOrder;
    var _c = tslib_1.__read((0, react_1.useState)({
        isPending: false,
        haveError: false,
    }), 2), syncState = _c[0], setSyncState = _c[1];
    var dispatch = (0, react_redux_1.useDispatch)();
    myDispatch = dispatch;
    (0, react_1.useEffect)(function () {
        var syncData = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var refetchOnline, refetchOnFocus, promises, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refetchOnline = [];
                        refetchOnFocus = [];
                        setSyncState({ isPending: true, haveError: false });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        promises = fetchOrder.map(function (config) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            var url, response, data;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = fetchItems.get(config.key);
                                        if (!url)
                                            return [2, throwErrorNow("url not found for ".concat(config.key))];
                                        if (config.refetchOnline)
                                            refetchOnline.push(config.key);
                                        if (config.refetchOnFocus)
                                            refetchOnFocus.push(config.key);
                                        return [4, fetch(url, config.options || {})];
                                    case 1:
                                        response = _a.sent();
                                        if (!response.ok)
                                            return [2, throwErrorNow("failedd to fetch ".concat(config.key))];
                                        return [4, response.json()];
                                    case 2:
                                        data = _a.sent();
                                        dispatch(config.action(data));
                                        return [2];
                                }
                            });
                        }); });
                        return [4, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        addOnlineListener(refetchOnline, dispatch);
                        addFocusListener(refetchOnFocus, dispatch);
                        setSyncState({ isPending: false, haveError: false });
                        return [3, 4];
                    case 3:
                        error_1 = _a.sent();
                        if (options.onError)
                            options.onError(error_1);
                        setSyncState({ isPending: false, haveError: true });
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); };
        syncData();
    }, [dispatch]);
    return syncState;
};
exports.useSync = useSync;
var syncIndividual = function (name_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return tslib_1.__awaiter(void 0, tslib_1.__spreadArray([name_1], tslib_1.__read(args_1), false), void 0, function (name, dispatch) {
        var config, url, response, data;
        if (dispatch === void 0) { dispatch = myDispatch; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof dispatch !== "function")
                        return [2, throwErrorNow("Expected dispatch(useDispatch()) function got ".concat(typeof dispatch))];
                    config = orders.find(function (item) { return item.key === name; });
                    url = items.get(name);
                    if (!url || !config)
                        return [2, throwErrorNow("no url found for item ".concat(name))];
                    return [4, fetch(url, config.options || {})];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        return [2, throwErrorNow("Failed to fetch ".concat(name, " ").concat(response.statusText))];
                    }
                    return [4, response.json()];
                case 2:
                    data = _a.sent();
                    dispatch(config.action(data));
                    return [2, data];
            }
        });
    });
};
exports.syncIndividual = syncIndividual;
var addOnlineListener = function (list, dispatch) {
    window.addEventListener("online", function () {
        var e_1, _a;
        try {
            for (var list_1 = tslib_1.__values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                var name_1 = list_1_1.value;
                syncIndividual(name_1, dispatch);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (list_1_1 && !list_1_1.done && (_a = list_1.return)) _a.call(list_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
};
var addFocusListener = function (list, dispatch) {
    window.addEventListener("focus", function () {
        var e_2, _a;
        try {
            for (var list_2 = tslib_1.__values(list), list_2_1 = list_2.next(); !list_2_1.done; list_2_1 = list_2.next()) {
                var name_2 = list_2_1.value;
                syncIndividual(name_2, dispatch);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (list_2_1 && !list_2_1.done && (_a = list_2.return)) _a.call(list_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
};
