"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncIndividual = exports.useSync = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var orders = [];
var items = new Map();
var useSync = function (_a) {
    var fetchOrder = _a.fetchOrder, fetchItems = _a.fetchItems;
    items = fetchItems;
    orders = fetchOrder;
    var _b = (0, react_1.useState)({
        isPending: false,
        haveError: false,
    }), syncState = _b[0], setSyncState = _b[1];
    var dispatch = (0, react_redux_1.useDispatch)();
    (0, react_1.useEffect)(function () {
        var syncData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var refetchOnline, refetchOnFocus, promises, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refetchOnline = [];
                        refetchOnFocus = [];
                        setSyncState({ isPending: true, haveError: false });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        promises = fetchOrder.map(function (config) { return __awaiter(void 0, void 0, void 0, function () {
                            var url, response, data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = fetchItems.get(config.name);
                                        if (!url)
                                            throw new Error("url not found for ".concat(config.name));
                                        if (config.refetchOnline)
                                            refetchOnline.push(config.name);
                                        if (config.refetchOnFocus)
                                            refetchOnFocus.push(config.name);
                                        return [4 /*yield*/, fetch(url, config.options || {})];
                                    case 1:
                                        response = _a.sent();
                                        if (!response.ok)
                                            throw new Error("failedd to fetch ".concat(config.name));
                                        return [4 /*yield*/, response.json()];
                                    case 2:
                                        data = _a.sent();
                                        dispatch(config.action(data));
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        addOnlineListener(refetchOnline, dispatch);
                        addFocusListener(refetchOnFocus, dispatch);
                        setSyncState({ isPending: false, haveError: false });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        setSyncState({ isPending: false, haveError: true });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        syncData();
    }, [dispatch]);
    return syncState;
};
exports.useSync = useSync;
var syncIndividual = function (name, dispatch) { return __awaiter(void 0, void 0, void 0, function () {
    var config, url, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (typeof dispatch !== "function")
                    throw new Error("Expected dispatch(useDispatch()) function got ".concat(typeof dispatch));
                config = orders.find(function (item) { return item.name === name; });
                url = items.get(name);
                if (!url || !config)
                    throw new Error("no url found for item ".concat(name));
                return [4 /*yield*/, fetch(url, config.options || {})];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Failed to fetch ".concat(name, " ").concat(response.statusText));
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                dispatch(config.action(data));
                return [2 /*return*/];
        }
    });
}); };
exports.syncIndividual = syncIndividual;
var addOnlineListener = function (list, dispatch) {
    window.addEventListener("online", function () {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var name_1 = list_1[_i];
            syncIndividual(name_1, dispatch);
        }
    });
};
var addFocusListener = function (list, dispatch) {
    window.addEventListener("focus", function () {
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var name_2 = list_2[_i];
            syncIndividual(name_2, dispatch);
        }
    });
};
