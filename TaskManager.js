var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FirebaseFunctions_instances, _FirebaseFunctions___loginWithGoogle, _FirebaseFunctions___logoutFromGoogle, _FirebaseFunctions___isLogined, _FirebaseFunctions___applyByAuthStateChange, _FirebaseFunctions___applyBySignInWithRedirect, _FirebaseFunctions___translateSignErrors, _FirebaseFunctions___fetchGoogleAccountData, _FirebaseFunctions___uploadAndResetInfo, _FirebaseFunctions___alertMessage, _FirebaseFunctions___initTipFlg, _FirebaseFunctions___tellTips, _FirebaseFunctions___showCaution, _UrlFunction_instances, _UrlFunction___composeURLbyPageTitle, _UrlFunction___returnHomePageURL, _HtmlFunction_instances, _HtmlFunction___resetPlaceHolder, _HtmlFunction___getRawText, _HtmlFunction___setValueToContentElement, _HtmlFunction___validateLengthWithin, _HtmlFunction___setCursorToEnd, _HtmlFunction___onlyNumbers, _HtmlFunction___onlySelectedNumberRange, _HtmlFunction___withinMonthlyDate, _HtmlFunction___validateMonthlyDate, _HtmlFunction___zeroPadding, _HtmlFunction___renderWeekday, _HtmlFunction___isLaunchEvent, _AlertSettingWindow_instances, _AlertSettingWindow___setCommandBtnsEvent, _AlertSettingWindow___selectUnit, _AlertSettingWindow___deleteUnit, _AlertSettingWindow___renameAlertUnit, _AlertSettingWindow___reassignThisIndex, _AlertSettingWindow___setBasicAlerts, _AlertSettingWindow___setValueToSpecifyAlertUnit, _AlertSettingWindow___setMySettingAlerts, _AlertSettingWindow___declareAndCreateElements, _AlertSettingWindow___setColorSampleEvent, _AlertSettingWindow___setColorSample, _AlertSettingWindow___setFlashEvent, _AlertSettingWindow___hiddenFlashElements, _AlertSettingWindow___showFlashElements, _AlertSettingWindow___flashEvent, _AlertSettingWindow___setValidation, _AlertSettingWindow___resetOutline, _AlertSettingWindow___writeOutline, _AlertSettingWindow___setValue, _AlertSettingWindow___createDictOfColor, _AlertSettingWindow___isFilledContents;
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, get, set, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAuth, signInWithPopup, getRedirectResult, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut, } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
const REDIRECT_OPTIONS = [true, false];
const RENDER_AUTH_METHOD_OPTIONS = ["signInWithPopup", "onAuthStateChanged", "signInWithRedirect"];
class FirebaseFunctions {
    constructor(FIREBASE_CONFIG) {
        _FirebaseFunctions_instances.add(this);
        this.isShowTip = {};
        const APP = initializeApp(FIREBASE_CONFIG);
        this.FIRESTORE_DB = getFirestore(APP);
        this.DB = getDatabase(APP);
        this.PROVIDER = new GoogleAuthProvider();
        this.AUTH = getAuth();
        this.UID = "";
        this.ACCOUNT_DATA = {};
        this.ACCESS_TOKEN = "";
        this.IV = crypto.getRandomValues(new Uint8Array(12));
        this.SALT = crypto.getRandomValues(new Uint8Array(16));
        this.UtilsFunc = new UtilsFunctions();
        this.preloader = new PreLoader();
        __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___initTipFlg).call(this);
    }
    downloadKeyFromFireStore(COLLECTION_NAME, DOCUMENT_ID, FIELD_NAME) {
        return __awaiter(this, void 0, void 0, function* () {
            const docRef = doc(this.FIRESTORE_DB, COLLECTION_NAME, DOCUMENT_ID);
            const docSnap = yield getDoc(docRef);
            try {
                if (docSnap.exists()) {
                    return docSnap.data()[FIELD_NAME];
                }
                else {
                    console.error("APIキーがFirestoreに存在しません");
                    return null;
                }
            }
            catch (error) {
                console.error("APIキーの取得に失敗しました:", error);
                return null;
            }
        });
    }
    deleteData(rawPath) {
        const USER_PATH = `${this.UID}/${rawPath}`;
        const DB_REF_DATA = ref(this.DB, USER_PATH);
        remove(DB_REF_DATA);
    }
    uploadExpiringCookie(data, EXPIRE_AFTER_X_TIME = 3000) {
        var expire = new Date();
        expire.setTime(expire.getTime() + EXPIRE_AFTER_X_TIME);
        const DB_REF_DATA = ref(this.DB, `${this.UID}/cookie`);
        if (typeof (data) == "object" && Array.isArray(data) == false) {
        }
        else {
            __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___showCaution).call(this, "uploadExpiringCookie", data);
        }
        const LIST_DATA = [expire, data];
        const JSON_DATA = JSON.stringify(LIST_DATA);
        set(DB_REF_DATA, JSON_DATA);
    }
    uploadData(rawPath, data) {
        const USER_PATH = `${this.UID}/${rawPath}`;
        const DB_REF_DATA = ref(this.DB, USER_PATH);
        if (typeof (data) == "string") {
            data = ["json", data];
        }
        const JSON_DATA = JSON.stringify(data);
        set(DB_REF_DATA, JSON_DATA);
    }
    prepareUniqueID() {
        const TEMP_REF = ref(this.DB);
        const ID = push(TEMP_REF).key;
        return ID;
    }
    decryptData(ENCRYPTED_HEX, SALT_HEX, IV_HEX, PASSWORD) {
        return __awaiter(this, void 0, void 0, function* () {
            if (PASSWORD) {
            }
            else {
                PASSWORD = "";
            }
            if (this.ACCOUNT_DATA && this.ACCOUNT_DATA.uid) {
                const ENCODER = new TextEncoder();
                const DECODER = new TextDecoder();
                const ENCRYPTED_BYTES = new Uint8Array(ENCRYPTED_HEX.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                const SALT_BYTES = new Uint8Array(SALT_HEX.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                const IV_BYTES = new Uint8Array(IV_HEX.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                const UID = this.ACCOUNT_DATA.uid;
                const FIREBASE_CREATE_AT = this.ACCOUNT_DATA.metadata.createdAt;
                const COMBINED_RAW_KEY = `${UID}${FIREBASE_CREATE_AT}${PASSWORD}`;
                const COMBINED_BUFFER = new Uint8Array([...ENCODER.encode(COMBINED_RAW_KEY), ...SALT_BYTES]);
                const HASH_BUFFER = yield crypto.subtle.digest("SHA-256", ENCODER.encode(COMBINED_BUFFER));
                const KEY = yield crypto.subtle.importKey("raw", HASH_BUFFER, { name: "AES-GCM" }, false, ["decrypt"]);
                try {
                    const DECRYPTED_BUFFER = yield crypto.subtle.decrypt({ name: "AES-GCM", iv: IV_BYTES }, KEY, ENCRYPTED_BYTES);
                    const DECRYPTED_STRING = DECODER.decode(DECRYPTED_BUFFER);
                    return JSON.parse(DECRYPTED_STRING);
                }
                catch (error) {
                    console.error("復号エラー:", error);
                    return null;
                }
            }
            else {
                console.log(`ログアウト時にFirebaseFunctionsのprepareGoogleUserIDが実行されました。そのため、実行を拒否しました。再試行します。`);
                this.preloader.charWaterflow();
                yield this.UtilsFunc.sleep(1000, { preloder: "charWaterflow" });
                this.preloader.closePreLoader();
                this.decryptData(ENCRYPTED_HEX, SALT_HEX, IV_HEX);
            }
        });
    }
    encryptData(DATA, PASSWORD) {
        return __awaiter(this, void 0, void 0, function* () {
            if (PASSWORD) {
            }
            else {
                PASSWORD = "";
            }
            if (this.ACCOUNT_DATA && this.ACCOUNT_DATA.uid) {
                const UID = this.ACCOUNT_DATA.uid;
                const FIREBASE_CREATE_AT = this.ACCOUNT_DATA.metadata.createdAt;
                const ENCODER = new TextEncoder();
                const COMBINED_RAW_KEY = `${UID}${FIREBASE_CREATE_AT}${PASSWORD}`;
                const COMBINED_BUFFER = new Uint8Array([...ENCODER.encode(COMBINED_RAW_KEY), ...this.SALT]);
                const HASH_BUFFER = yield crypto.subtle.digest("SHA-256", ENCODER.encode(COMBINED_BUFFER));
                const KEY = yield crypto.subtle.importKey("raw", HASH_BUFFER, { name: "AES-GCM" }, false, ["encrypt"]);
                const DATA_STRING = JSON.stringify(DATA);
                const ENCRYPTED_BUFFER = yield crypto.subtle.encrypt({ name: "AES-GCM", iv: this.IV }, KEY, ENCODER.encode(DATA_STRING));
                const ENCRYPTED_HEX = Array.from(new Uint8Array(ENCRYPTED_BUFFER)).map(b => b.toString(16).padStart(2, "0")).join("");
                const SALT_HEX = Array.from(this.SALT).map(b => b.toString(16).padStart(2, "0")).join("");
                const IV_HEX = Array.from(this.IV).map(b => b.toString(16).padStart(2, "0")).join("");
                return { data: ENCRYPTED_HEX, salt: SALT_HEX, iv: IV_HEX };
            }
            else {
                console.log(`ログアウト時にFirebaseFunctionsのprepareGoogleUserIDが実行されました。そのため、実行を拒否しました。再試行します。`);
                yield this.UtilsFunc.sleep(1000, { preloder: "charWaterflow" });
                this.encryptData(DATA);
            }
        });
    }
    isEncryptedString(DATA) {
        const MIN_ENCRYPTED_LENGTH = 36;
        const IS_OVER_LENGTH36 = DATA.length >= MIN_ENCRYPTED_LENGTH ? true : false;
        const IS_INCLUDE_NON_ALPHANUMERIC = /[^a-zA-Z0-9]/.test(DATA);
        const IS_ONLY_ALPHABET = /^[a-zA-Z]+$/.test(DATA);
        const IS_ONLY_NUMBER = /^[0-9]+$/.test(DATA);
        const result = IS_OVER_LENGTH36 &&
            IS_INCLUDE_NON_ALPHANUMERIC === false &&
            IS_ONLY_ALPHABET === false &&
            IS_ONLY_NUMBER === false ? true : false;
        return result;
    }
    isLogined() {
        return this.UID ? true : false;
    }
    downloadExpiringCookie() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___tellTips).call(this, "downloadData");
            const DB_REF_DATA = ref(this.DB, `${this.UID}/cookie`);
            try {
                const snapshot = yield get(DB_REF_DATA);
                if (snapshot.exists()) {
                    const JSON_DATA = snapshot.val();
                    if (typeof (JSON_DATA) == "string") {
                        var parsedData = JSON.parse(JSON_DATA);
                    }
                    else {
                        var parsedData = JSON_DATA;
                    }
                    let EXPIRE_DATE = new Date(parsedData[0]);
                    let CURRENT_DATE = new Date();
                    let ELAPSED_MS_TIME = EXPIRE_DATE.getTime() - CURRENT_DATE.getTime();
                    if (ELAPSED_MS_TIME > 0) {
                        __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___uploadAndResetInfo).call(this);
                        const DICT_DATA = parsedData[1];
                        return DICT_DATA;
                    }
                    else {
                        this.uploadData("data/info", `Cookieの有効期限が切れています。
有効期限：EXPIRE_DATE
現在時刻：18
時差：${ELAPSED_MS_TIME / 1000}秒`);
                        yield new Promise(resolve => setTimeout(resolve, 2000));
                        return false;
                    }
                }
                else {
                    console.log('No data available');
                    return null;
                }
            }
            catch (error) {
                error += "   \nin download Expiring cookie";
                __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___alertMessage).call(this, error);
                console.error('Error getting data:', error);
                throw error;
            }
        });
    }
    downloadData(rawPath) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___tellTips).call(this, "downloadData");
            const RETRY_COUNT_UPTO = 3;
            for (let retry = 0; retry <= RETRY_COUNT_UPTO; retry++) {
                try {
                    const USER_PATH = `${this.UID}/${rawPath}`;
                    const DB_REF_DATA = ref(this.DB, USER_PATH);
                    const snapshot = yield get(DB_REF_DATA);
                    if (snapshot.exists()) {
                        const JSON_DATA = snapshot.val();
                        if (typeof (JSON_DATA) == "string") {
                            var parsedData = JSON.parse(JSON_DATA);
                        }
                        else {
                            var parsedData = JSON_DATA;
                        }
                        if (Array.isArray(parsedData)) {
                            if (parsedData.length > 0 && parsedData[0] === "json") {
                                parsedData = parsedData[1];
                            }
                        }
                        return parsedData;
                    }
                    else {
                        console.log('No data available');
                        return null;
                    }
                }
                catch (error) {
                    if (retry == RETRY_COUNT_UPTO) {
                        if (this.ACCOUNT_DATA.uid) {
                            error += `   \nin download data and uid is ${this.ACCOUNT_DATA.uid}`;
                            __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___alertMessage).call(this, error);
                            console.error('Error getting data:', error);
                            throw error;
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        console.log(`In download method, error happend, Retry 2sec later...(${retry})`);
                        yield this.UtilsFunc.sleep(2000, { preloder: "charWaterflow" });
                    }
                }
            }
        });
    }
    loginSystem(LoginSystemArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const IS_LOGINED = yield __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___isLogined).call(this);
            var signResult = "";
            if (IS_LOGINED.isLogined) {
                signResult = __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___logoutFromGoogle).call(this, LoginSystemArgs);
            }
            else {
                signResult = __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___loginWithGoogle).call(this, LoginSystemArgs);
            }
            return signResult;
        });
    }
    renderAuthStatus(ARGS) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ARGS.METHOD === "signInWithPopup") {
                const LOGIN_SYSTEM_ARGS = {
                    HTML_BTN_ELEMENT: ARGS.HTML_BTN_ELEMENT,
                    SPAN_NAME: ARGS.SPAN_NAME,
                    isRedirect: false,
                    CALL_FROM: "in FirebaseFunction, renderAuthStatus, signInWithPopup"
                };
                const RESULT = yield __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___loginWithGoogle).call(this, LOGIN_SYSTEM_ARGS);
                return RESULT;
            }
            else if (ARGS.METHOD === "onAuthStateChanged") {
                const AUTH_DATA = yield __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___isLogined).call(this);
                const RESULT = __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___applyByAuthStateChange).call(this, ARGS, AUTH_DATA);
                return RESULT;
            }
            else if (ARGS.METHOD === "signInWithRedirect") {
                const RESULT = __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___applyBySignInWithRedirect).call(this);
            }
        });
    }
    doIfThereRedirectResult(ARGS) {
        return __awaiter(this, void 0, void 0, function* () {
            const REDIRECT_RESULT = yield getRedirectResult(this.AUTH);
            if (REDIRECT_RESULT) {
                ARGS.HTML_BTN_ELEMENT.textContent = "ログアウト";
                ARGS.SPAN_NAME.textContent = `${REDIRECT_RESULT.user.displayName}さん　ようこそ`;
                ARGS.SPAN_NAME.style.display = "block";
                this.UID = REDIRECT_RESULT.user.uid;
                this.ACCOUNT_DATA = REDIRECT_RESULT.user;
                this.ACCESS_TOKEN = REDIRECT_RESULT._tokenResponse.oauthAccessToken;
                return true;
            }
            else {
                return false;
            }
        });
    }
}
_FirebaseFunctions_instances = new WeakSet(), _FirebaseFunctions___loginWithGoogle = function _FirebaseFunctions___loginWithGoogle(LoginSystemArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield signInWithPopup(this.AUTH, this.PROVIDER);
            LoginSystemArgs.HTML_BTN_ELEMENT.textContent = "ログアウト";
            LoginSystemArgs.SPAN_NAME.textContent = `${result.user.displayName}さん　ようこそ`;
            LoginSystemArgs.SPAN_NAME.style.display = "block";
            this.UID = result.user.uid;
            this.ACCOUNT_DATA = result.user;
            this.ACCESS_TOKEN = result._tokenResponse.oauthAccessToken;
            this.uploadData("/refreshToken", result._tokenResponse.refreshToken);
            if (LoginSystemArgs.isRedirect && LoginSystemArgs.REDIRECT_METHOD && LoginSystemArgs.CALL_FROM) {
                new UrlFunction().redirect({
                    METHOD: LoginSystemArgs.REDIRECT_METHOD,
                    CALL_FROM: LoginSystemArgs.CALL_FROM,
                    QUERY: LoginSystemArgs.QUERY
                });
            }
            return true;
        }
        catch (error) {
            alert(error);
            __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___translateSignErrors).call(this, error.message);
            return false;
        }
    });
}, _FirebaseFunctions___logoutFromGoogle = function _FirebaseFunctions___logoutFromGoogle(LoginSystemArgs) {
    signOut(this.AUTH).then(() => {
        LoginSystemArgs.HTML_BTN_ELEMENT.textContent = "ログイン";
        LoginSystemArgs.SPAN_NAME.textContent = "";
        LoginSystemArgs.SPAN_NAME.style.display = "none";
        this.UID = "";
        this.ACCOUNT_DATA = {};
        this.uploadData("/token", "");
        if (LoginSystemArgs.isRedirect && LoginSystemArgs.REDIRECT_METHOD && LoginSystemArgs.CALL_FROM) {
            new UrlFunction().redirect({
                METHOD: LoginSystemArgs.REDIRECT_METHOD,
                CALL_FROM: LoginSystemArgs.CALL_FROM,
                QUERY: LoginSystemArgs.QUERY
            });
        }
        return true;
    }).catch((error) => {
        alert(error);
        __classPrivateFieldGet(this, _FirebaseFunctions_instances, "m", _FirebaseFunctions___translateSignErrors).call(this, error.message);
        return false;
    });
}, _FirebaseFunctions___isLogined = function _FirebaseFunctions___isLogined() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            onAuthStateChanged(this.AUTH, (result) => __awaiter(this, void 0, void 0, function* () {
                if (result) {
                    resolve({ isLogined: true, accountData: result });
                }
                else {
                    resolve({ isLogined: false, accountData: null });
                }
            }));
        });
    });
}, _FirebaseFunctions___applyByAuthStateChange = function _FirebaseFunctions___applyByAuthStateChange(ARGS, AUTH_DATA) {
    if (AUTH_DATA.isLogined) {
        ARGS.HTML_BTN_ELEMENT.textContent = "ログアウト";
        ARGS.SPAN_NAME.textContent = `${AUTH_DATA.accountData.displayName}さん　ようこそ`;
        ARGS.SPAN_NAME.style.display = "block";
        this.UID = AUTH_DATA.accountData.uid;
        this.ACCOUNT_DATA = AUTH_DATA.accountData;
        return true;
    }
    else {
        ARGS.HTML_BTN_ELEMENT.textContent = "ログイン";
        ARGS.SPAN_NAME.textContent = "";
        return false;
    }
}, _FirebaseFunctions___applyBySignInWithRedirect = function _FirebaseFunctions___applyBySignInWithRedirect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield signInWithRedirect(this.AUTH, this.PROVIDER);
        }
        catch (error) {
            alert(`in FirebaseFunctions, renderAuthStatus, __applyBySignInWithRedirect. ログインエラーです。`);
        }
    });
}, _FirebaseFunctions___translateSignErrors = function _FirebaseFunctions___translateSignErrors(RAW_ERROR_MESSAGE) {
    const match = RAW_ERROR_MESSAGE.match(/\(([^)]+)\)/);
    const EXTRACTED_MESSAGE = match ? match[1] : RAW_ERROR_MESSAGE;
    const RECORD_ERROR_MESSAGE = {
        "auth/popup-closed-by-user": "ポップアップを閉じられました。認証が未完了です。もう一度認証してください。",
        "auth/cancelled-popup-request": "すでにほかのポップアップが出ています。以前のポップアップを閉じてください。",
        "auth/popup-blocked": "ブラウザがポップアップをブロックしました。ブラウザの設定でポップアップを許可してください。",
        "auth/operation-not-allowed": "Google認証が有効になっていません。開発者にFirebase Authenticationを確認するよう問い合わせてください。",
        "auth/invalid-credential": "有効期限が切れています。もう一度認証してください。",
        "auth/user-disabled": "Firebaseでユーザーアカウントが無効化されています。開発者にユーザーアカウント名を教えてください。",
        "auth/wrong-password": "パスワードが間違っています。",
        "auth/network-request-failed": "ネットワークエラーです。ネット接続を確認して、再試行してください。",
        "auth/too-many-requests": "短期間に何度もログインされたため、一時的にブロックされています。時間をおいてからお試しください。",
        "auth/timeout": "ネットワークエラーです。ネット接続を確認して、再試行してください。"
    };
    if (EXTRACTED_MESSAGE in RECORD_ERROR_MESSAGE) {
        alert(RECORD_ERROR_MESSAGE[EXTRACTED_MESSAGE]);
    }
    else {
        alert("サインイン・アウト時に予期せぬエラーが生じました。");
    }
}, _FirebaseFunctions___fetchGoogleAccountData = function _FirebaseFunctions___fetchGoogleAccountData() {
    onAuthStateChanged(this.AUTH, (user) => {
        if (user) {
            return user;
        }
        else {
            alert("Error:未ログイン状態でFirebaseFunctions, #__fetchGoogleAccountDataが実行されました。");
        }
    });
}, _FirebaseFunctions___uploadAndResetInfo = function _FirebaseFunctions___uploadAndResetInfo() {
    this.uploadData("data/info", "");
}, _FirebaseFunctions___alertMessage = function _FirebaseFunctions___alertMessage(INFO) {
    alert(`Error: yamatoaita@gmail.comにこの文章をお知らせください。
Error info : ${INFO}`);
}, _FirebaseFunctions___initTipFlg = function _FirebaseFunctions___initTipFlg() {
    this.isShowTip = {
        "downloadData": true
    };
}, _FirebaseFunctions___tellTips = function _FirebaseFunctions___tellTips(METHOD) {
    const GREEN = "color:green";
    const RED = "color:red";
    const BLUE = "color:blue";
    const NORMAL = "color:black;font-weight:normal";
    const BOLD = "font-weight:bold`";
    if (METHOD == "downloadData" && this.isShowTip["downloadData"]) {
        this.isShowTip["downloadData"] = false;
        console.log(`
============================================================================
|                       %cTip of [downloadData]%c:                             |
|--------------------------------------------------------------------------|
|downloadDataメソッドを実行する際は以下のように使います。                  |
|--------------------------------------------------------------------------|
|    class ClassName{                                                      |
|        constructor(){                                                    |
|            ・・・処理・・・                                              |
|            this.init(); // データ取得後に実行させたいコードは            |
|                        // init関数にくくる。                             |
|        }                                                                 |
|        %casync%c init(){                                                     |
|            const DATA = %cawait%c this.FIREBASE_APP.downloadData("cookie");  |
|            console.log(データが取得後に表示されます‘＄{DATA}‘)         |
|            console.log("このログはその後に表示されます")                 |
|        }                                                                 |
|    }                                                                     |
|--------------------------------------------------------------------------|
|                %cReturnで値を取得したい場合の記載例%c:                       |
|--------------------------------------------------------------------------|
|    %casync%c exampleFunction(){                                              |
|          const VALUE = %cawait%c this.returnFunction();                      |
|    }                                                                     |
|    %casync%c returnFunction(){                                               |
|        const RETURN_VALUE = %cawait%c this.FIREBASE_APP.downloadData("path");|
|        return RETURN_VALUE;                                              |
|    }                                                                     |
|--------------------------------------------------------------------------|
|                %caddEventListenerで行う場合の記載例%c:                       |
|--------------------------------------------------------------------------|
|    setBtnEvent(){                                                        |
|        const BTN = document.getElementById("btn");                       |
|        BTN.addEventListener("click", %casync%c ()=>{                         |
|            const VALUE = %cawait%c this.returnFunction();                    |
|        })                                                                |
|    }                                                                     |
============================================================================
    `, `GREEN;BOLD`, `NORMAL`, `BLUE;BOLD`, `NORMAL`, `BLUE;BOLD`, `NORMAL`, `GREEN;BOLD`, `NORMAL`, `BLUE;BOLD`, `NORMAL`, `BLUE;BOLD`, `NORMAL`, `BLUE;BOLD`, `NORMAL`, `BLUE;BOLD`, `NORMAL`, `GREEN;BOLD`, `NORMAL`, `BLUE;BOLD`, `NORMAL`, `BLUE;BOLD`, `NORMAL`);
    }
}, _FirebaseFunctions___showCaution = function _FirebaseFunctions___showCaution(FUNCTION_NAME, ITEM) {
    var stack;
    const ERROR = new Error();
    if (ERROR.stack) {
        stack = ERROR.stack.replace("Error", "");
        stack = stack.replace(/^\s*at FirebaseFunctions.*$/gm, "");
        if (FUNCTION_NAME == "uploadExpiringCookie") {
            alert(`注意 : アップロードしようとしているものはDictionary型ではありません。

    uploadExpiringCookie関数は仕様上、Dictionary型を渡すことを推奨します。

    渡された値：ITEM   データ型：${typeof (ITEM)}

    現在の行番号：stack`);
        }
    }
};
const PRELOADER_OPTIONS = ["charWaterflow"];
const SUBTRACT_DATE_OPTIONS = ["month", "week", "day", "hour"];
class UtilsFunctions {
    constructor() {
        this.Preloader = new PreLoader();
    }
    sleep(MS, PRELOADER_OPTION) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`注意事項\nsleepを使う際は使用する関数にasyncをつけ、await sleepとして使います。`);
            if (PRELOADER_OPTION) {
                if (PRELOADER_OPTION.preloder === "charWaterflow") {
                    this.Preloader.charWaterflow();
                }
                yield new Promise(resolve => setTimeout(resolve, MS));
                this.Preloader.closePreLoader();
            }
            else {
                yield new Promise(resolve => setTimeout(resolve, MS));
            }
        });
    }
    calcWeekday(MONTH_NUMBER, DATE_NUMBER) {
        if (MONTH_NUMBER >= 0 && DATE_NUMBER >= 0) {
            const CURRENT_YEAR = new Date().getFullYear();
            const CURRENT_MONTH = new Date().getMonth();
            const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
            var weekdaysIndex = 0;
            if (MONTH_NUMBER >= CURRENT_MONTH) {
                weekdaysIndex = new Date(CURRENT_YEAR, MONTH_NUMBER - 1, DATE_NUMBER).getDay();
            }
            else if (MONTH_NUMBER < CURRENT_MONTH) {
                weekdaysIndex = new Date(CURRENT_YEAR + 1, MONTH_NUMBER - 1, DATE_NUMBER).getDay();
            }
            const WEEKDAY = WEEKDAYS[weekdaysIndex];
            return WEEKDAY;
        }
        else {
            const STACK = new Error();
            alert(`${MONTH_NUMBER}月${DATE_NUMBER}日は無効な値です。引数を確かめてください。\n${STACK.message}`);
        }
    }
    subtractDates(OPTION) {
        const DATE = new Date(OPTION.targetDate);
        if (OPTION.timeUnit === "month") {
            DATE.setMonth(DATE.getMonth() - OPTION.minusAmount);
        }
        else if (OPTION.timeUnit === "week") {
            DATE.setDate(DATE.getDate() - OPTION.minusAmount * 7);
        }
        else if (OPTION.timeUnit === "day") {
            DATE.setDate(DATE.getDate() - OPTION.minusAmount);
        }
        else if (OPTION.timeUnit === "hour") {
            DATE.setHours(DATE.getHours() - OPTION.minusAmount);
        }
        return DATE;
    }
    toHarfWidthDegitText(FULL_WIDTH_DIGIT) {
        const HARF_WIDTH_DEGIT_STRING = FULL_WIDTH_DIGIT.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
        return HARF_WIDTH_DEGIT_STRING;
    }
    getLuminance(COLOR) {
        var r;
        var g;
        var b;
        if (COLOR.match(/#[a-z0-9]+/g)) {
            r = parseInt(COLOR.slice(1, 3), 16) / 255;
            g = parseInt(COLOR.slice(3, 5), 16) / 255;
            b = parseInt(COLOR.slice(5, 7), 16) / 255;
        }
        else {
            const RAW_STRING = COLOR.replace(/[()rgb]/g, "");
            const COLOR_INDEXS = RAW_STRING.split(",");
            r = parseInt(COLOR_INDEXS[0]) / 255;
            g = parseInt(COLOR_INDEXS[1]) / 255;
            b = parseInt(COLOR_INDEXS[2]) / 255;
        }
        const LUM = (channel) => {
            return (channel <= 0.03928) ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
        };
        const LUMINANCE = 0.2126 * LUM(r) + 0.7152 * LUM(g) + 0.0722 * LUM(b);
        return LUMINANCE;
    }
    chooseSuitableFontColor(BACKGROUND_COLOR) {
        const LUMINANCE = this.getLuminance(BACKGROUND_COLOR);
        var fontColor = "";
        if (LUMINANCE <= 0.3) {
            fontColor = "#FFFFFF";
        }
        else {
            fontColor = "#000000";
        }
        return fontColor;
    }
    changeRGBtoColorCode(RGB) {
        if (RGB.match(/^rgb/)) {
            const REPLACED_RGB = RGB.replace(/[rgba()]+/g, "");
            const RGB_ELEMENTS = REPLACED_RGB.split(",");
            const R = parseInt(RGB_ELEMENTS[0]);
            const G = parseInt(RGB_ELEMENTS[1]);
            const B = parseInt(RGB_ELEMENTS[2]);
            const toColorCode = (value) => value.toString(16).padStart(2, "0");
            const COLOR_CODE = `#${toColorCode(R)}${toColorCode(G)}${toColorCode(B)}`.toUpperCase();
            return COLOR_CODE;
        }
        else {
            alert(`引数の${RGB}はRGBコードではありません。rgb(000,000,000)またはrgba(000,000,000)の形式のコードを渡してください`);
        }
    }
    changeColorCodeToRGB(COLOR_CODE) {
        if (COLOR_CODE.match(/^#/)) {
            const R = parseInt(COLOR_CODE.slice(1, 3), 16);
            const G = parseInt(COLOR_CODE.slice(3, 5), 16);
            const B = parseInt(COLOR_CODE.slice(5, 7), 16);
            const RGB = `rgb(${R}, ${G}, ${B})`;
            return RGB;
        }
        else {
            alert(`引数の${COLOR_CODE}は１６進数のカラーコードではありません。#000000の形式のコードを渡してください。`);
        }
    }
    deleteListElem(LIST, ELEM) {
        const INDEX = LIST.indexOf(ELEM);
        if (INDEX === -1) {
            alert(`引数の要素:「${ELEM}」はlistにありませんでした。`);
            console.table(LIST);
        }
        else {
            const NEW_LIST = LIST.filter((item) => {
                if (item === ELEM) {
                    return false;
                }
                else {
                    return true;
                }
            });
            return NEW_LIST;
        }
    }
}
class UrlFunction {
    constructor() {
        _UrlFunction_instances.add(this);
    }
    extractHtmlTitle(rawHtml, CALL_FROM) {
        const url = new URL(rawHtml);
        let htmlLink = url.pathname;
        htmlLink = htmlLink.replace(/\/$/, "");
        var configured_item = htmlLink.split("/").pop();
        if (configured_item) {
            const MATCHED_ITEMS = configured_item.match(/^(.+)(?:\.github\.io|\.html)?\/?$/);
            if (MATCHED_ITEMS) {
                var htmlTitle = MATCHED_ITEMS[1];
                htmlTitle = htmlTitle.replace(".html", "");
                htmlTitle = htmlTitle.replace(/\?.*$/, "");
                return htmlTitle;
            }
            else {
                alert(`Error: Utils.js, UrlFunction, extractHtmlTitle, 正規表現に一致しませんでした。htmlLink is ${htmlLink}, Reg is ^(.+)(?:\.github\.io|\.html)?\/?$\ncall from ${CALL_FROM}`);
            }
        }
        else {
            alert(`Error: Utils.js, UrlFunction, extractHtmlTitle, configured_item is undefined. htmlLink is ${htmlLink}\ncall from ${CALL_FROM}`);
        }
    }
    __deleteQueryPart(URL) {
        const URL_COMPONENTS = URL.split("?");
        if (URL_COMPONENTS.length > 1) {
            return URL_COMPONENTS[0];
        }
        else {
            return URL;
        }
    }
    redirect(REDIRECT_DATA) {
        if (REDIRECT_DATA.METHOD === "toSelectedPage") {
            if (REDIRECT_DATA.PAGE_TITLE) {
                var url = __classPrivateFieldGet(this, _UrlFunction_instances, "m", _UrlFunction___composeURLbyPageTitle).call(this, REDIRECT_DATA.PAGE_TITLE, REDIRECT_DATA.CALL_FROM);
                if (REDIRECT_DATA.QUERY) {
                    let query = this.__convertDataToQueryString(REDIRECT_DATA.QUERY);
                    url += `?data=${query}`;
                }
                if (url) {
                    window.location.href = url;
                }
                else {
                    this.alertError("composeURLbyPageTitle", `${REDIRECT_DATA.CALL_FROM}, 無効なURLでした。URL:${window.location.href}`);
                }
            }
            else {
                alert(`in UrlFunction, redirect. composeURLbyPageTitleが引数に渡されました。しかし、必要なPAGE_TITLEが引数にありません。指定してください。\ncall from${CALL_FROM}`);
            }
        }
        else if (REDIRECT_DATA.METHOD === "toHP") {
            var url = __classPrivateFieldGet(this, _UrlFunction_instances, "m", _UrlFunction___returnHomePageURL).call(this, REDIRECT_DATA.CALL_FROM);
            if (REDIRECT_DATA.QUERY) {
                let query = this.__convertDataToQueryString(REDIRECT_DATA.QUERY);
                url += `?data=${query}`;
            }
            if (url) {
                window.location.href = url;
            }
            else {
                this.alertError("returnHomePageURL", `${REDIRECT_DATA.CALL_FROM}, 無効なURLでした。URL:${window.location.href}`);
            }
        }
    }
    __convertDataToQueryString(DATA) {
        var query_string = "";
        if (typeof (DATA) === "object") {
            query_string = encodeURIComponent(JSON.stringify(DATA));
        }
        else {
            query_string = DATA;
        }
        return `${query_string}`;
    }
    extractQuery() {
        const URL_PARAMS = new URLSearchParams(window.location.search);
        const JSON_QUERY = URL_PARAMS.get(`data`);
        if (JSON_QUERY) {
            const PARSED_DATA = JSON.parse(JSON_QUERY);
            return PARSED_DATA;
        }
        return {};
    }
    alertError(METHOD_NAME, INFO) {
        alert(`Error: in UrlFunction, ${METHOD_NAME}, ${INFO}`);
        console.log(`Error: in UrlFunction, ${METHOD_NAME}, ${INFO}`);
    }
}
_UrlFunction_instances = new WeakSet(), _UrlFunction___composeURLbyPageTitle = function _UrlFunction___composeURLbyPageTitle(PAGE_TITLE, CALL_FROM, URL = window.location.href) {
    const PAGE_TITLE_REG_WITH_SYNBOLE = /\/([a-zA-Z_\-.・\(\)\[\]\{},@]*)\.html$/;
    URL = this.__deleteQueryPart(URL);
    if (URL.match(/github/)) {
        const MATCHED_ITEMS = URL.match(/https:\/{2}syuubunndou.github.io\/[/w/.]*/);
        if (MATCHED_ITEMS) {
            const FUNDATIONAL_URL = MATCHED_ITEMS[0];
            if (URL.match(/\.html$/)) {
                const IS_MATCH = URL.match(PAGE_TITLE_REG_WITH_SYNBOLE) ? true : false;
                if (IS_MATCH) {
                    var composedURL = URL.replace(PAGE_TITLE_REG_WITH_SYNBOLE, `/${PAGE_TITLE}.html`);
                    return composedURL;
                }
                else {
                    alert(`ファイル名エラーです。htmlファイル名にひらがなや漢字が含まれていませんか？ url : ${URL} \ncall from${CALL_FROM}`);
                }
            }
            else {
                var composedURL = `${URL}${PAGE_TITLE}.html`;
                return composedURL;
            }
        }
        else {
            alert(`Error: Utils.js, UrlFunctions, composedURLbyPageTitle, 正規表現にマッチしたものはありません。URL is ${URL} \ncall from${CALL_FROM}`);
            return;
        }
    }
    else {
        const IS_MATCH = URL.match(PAGE_TITLE_REG_WITH_SYNBOLE) ? true : false;
        if (IS_MATCH) {
            var composedURL = URL.replace(PAGE_TITLE_REG_WITH_SYNBOLE, `/${PAGE_TITLE}\.html`);
            return composedURL;
        }
        else {
            alert(`ファイル名エラーです。htmlファイル名にひらがなや漢字が含まれていませんか？ url : ${URL} \ncall from${CALL_FROM}`);
        }
    }
}, _UrlFunction___returnHomePageURL = function _UrlFunction___returnHomePageURL(CALL_FROM, homePageTitle = "index") {
    const URL = this.__deleteQueryPart(window.location.href);
    if (URL.match(/github/)) {
        const MATCHED_ITEMS = URL.match(/https:\/{2}syuubunndou.github.io\/[\w\.]*\//);
        if (MATCHED_ITEMS) {
            var gitHomePageURL = MATCHED_ITEMS[0];
            return gitHomePageURL;
        }
        else {
            alert(`Error: Utils.js, UrlFunction, returnHomePageURL, 正規表現にマッチしたものはありません。 URL is : ${URL}\ncall from${CALL_FROM}`);
            return;
        }
    }
    else {
        var localHomePageURL = __classPrivateFieldGet(this, _UrlFunction_instances, "m", _UrlFunction___composeURLbyPageTitle).call(this, homePageTitle, URL, CALL_FROM);
        return localHomePageURL;
    }
};
const VALIDATION_OPTIONS = ["lengthWithin",
    "onlyNumbers",
    "onlySelectedNumberRange",
    "zeroPadding",
    "withinMonthlyDate",
    "renderWeekday"];
class HtmlFunction {
    constructor() {
        _HtmlFunction_instances.add(this);
        this.UtilsFunc = new UtilsFunctions();
        this.debounceTime = 50;
        this.lastLaunchTimes = {};
        this.PLACEHOLDER_ELEM = "";
        this._boundResetPlaceHolder = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___resetPlaceHolder).bind(this);
    }
    setPlaceHolder(CONTENT_ELEMENT, PLACE_HOLDER_TEXT) {
        if (this.PLACEHOLDER_ELEM) {
            console.log("ヒント：setPlaceHolderを使用するときには\nnew HtmlFunction()で毎回インスタンスを生成してください。");
        }
        if (CONTENT_ELEMENT instanceof HTMLDivElement || CONTENT_ELEMENT instanceof HTMLSpanElement) {
            CONTENT_ELEMENT.innerHTML = PLACE_HOLDER_TEXT;
        }
        else if (CONTENT_ELEMENT instanceof HTMLInputElement) {
            CONTENT_ELEMENT.value = PLACE_HOLDER_TEXT;
        }
        CONTENT_ELEMENT.style.color = "rgb(153, 153, 153)";
        CONTENT_ELEMENT.addEventListener("focus", this._boundResetPlaceHolder, { once: true });
        this.PLACEHOLDER_ELEM = CONTENT_ELEMENT;
    }
    deletePlaceholderEvent() {
        this.PLACEHOLDER_ELEM.removeEventListener("focus", this._boundResetPlaceHolder);
        this.PLACEHOLDER_ELEM.style.color = "rgb(0, 0, 0)";
        this.PLACEHOLDER_ELEM.focus();
    }
    setUnfilledSignifier(CONTENT_ELEMENT) {
        CONTENT_ELEMENT.style.backgroundColor = "rgb(255, 208, 0)";
        CONTENT_ELEMENT.addEventListener("focus", () => {
            CONTENT_ELEMENT.style.backgroundColor = "rgb(255,255,255)";
        }, { once: true });
    }
    setValidation(VALIDATION_DATA) {
        const OPTIONS = VALIDATION_DATA.VALIDATE_OPTION;
        for (let option of OPTIONS) {
            for (let element of VALIDATION_DATA.CONTENT_ELEMENTS) {
                if (option === "lengthWithin") {
                    if (VALIDATION_DATA.LENGTH) {
                        __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___validateLengthWithin).call(this, element, VALIDATION_DATA.LENGTH);
                    }
                    else {
                        const STACK = new Error().stack;
                        alert(`Error: ${STACK},\n必要な引数LENGTHがありません。`);
                        break;
                    }
                }
                else if (option === "onlyNumbers") {
                    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___onlyNumbers).call(this, element);
                }
                else if (option === "onlySelectedNumberRange") {
                    if (typeof VALIDATION_DATA.MAX_NUMBER === "number" && typeof VALIDATION_DATA.MIN_NUMBER === "number") {
                        __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___onlySelectedNumberRange).call(this, element, VALIDATION_DATA.MIN_NUMBER, VALIDATION_DATA.MAX_NUMBER);
                    }
                    else {
                        const STACK = new Error().stack;
                        alert(`Error: ${STACK},\n必要な引数MIN_NUMBERとMAX_NUMBERがそろっていません。`);
                        break;
                    }
                }
                else if (option === "zeroPadding") {
                    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___zeroPadding).call(this, element);
                }
                else if (option === "withinMonthlyDate") {
                    if (VALIDATION_DATA.MONTH_ELEMENT) {
                        __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___withinMonthlyDate).call(this, element, VALIDATION_DATA.MONTH_ELEMENT);
                    }
                    else {
                        const STACK = new Error().stack;
                        alert(`Error: ${STACK},\n必要な引数MONTH_ELEMENTがありません。`);
                        break;
                    }
                }
                else if (option === "renderWeekday") {
                    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___renderWeekday).call(this, element, VALIDATION_DATA.MONTH_ELEMENT, VALIDATION_DATA.DATE_ELEMENT);
                }
            }
        }
    }
    alignSpanToAdjacentInputCenter(TARGET_SPAN, INPUT_SPAN) {
        const TARGET_SPAN_STYLE = window.getComputedStyle(TARGET_SPAN);
        const FIRST_TARGET_SPAN_TOP = TARGET_SPAN_STYLE.top;
        INPUT_SPAN.addEventListener("input", () => {
            const INPUT_SPAN_STYLE = window.getComputedStyle(INPUT_SPAN);
            const INPUT_FONT_SIZE = parseInt(INPUT_SPAN_STYLE.fontSize);
            const BASED_LINE_HEIGHT = Math.round(1.485 * INPUT_FONT_SIZE + 0.587);
            const LINE_HEIGHT = INPUT_FONT_SIZE * 0.7;
            const INPUT_SPAN_HEIGHT = INPUT_SPAN_STYLE.height.replace("px", "");
            const LINES = Math.round(INPUT_SPAN_HEIGHT / BASED_LINE_HEIGHT);
            TARGET_SPAN.style.top = FIRST_TARGET_SPAN_TOP;
            TARGET_SPAN.style.top = `${parseInt(TARGET_SPAN_STYLE.top.replace("px", "")) - LINE_HEIGHT * LINES + parseInt(FIRST_TARGET_SPAN_TOP.replace("px", "")) * 2 - 13}px`;
        });
    }
    provideUniqueID() {
        const DATE_RND_ID = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8).padEnd(6, "0")}`;
        const CRYPTO_ID = crypto.getRandomValues(new Uint32Array(1))[0].toString(16).padStart(8, "0");
        const MIXED_ID = `${DATE_RND_ID}-${CRYPTO_ID}`;
        return MIXED_ID;
    }
}
_HtmlFunction_instances = new WeakSet(), _HtmlFunction___resetPlaceHolder = function _HtmlFunction___resetPlaceHolder() {
    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, this.PLACEHOLDER_ELEM, "");
    this.PLACEHOLDER_ELEM.style.color = "rgb(0, 0, 0)";
    this.PLACEHOLDER_ELEM.focus();
}, _HtmlFunction___getRawText = function _HtmlFunction___getRawText(CONTENT_ELEMENT) {
    var rawText = "";
    if (CONTENT_ELEMENT instanceof HTMLDivElement || CONTENT_ELEMENT instanceof HTMLSpanElement) {
        rawText = CONTENT_ELEMENT.textContent;
    }
    else if (CONTENT_ELEMENT instanceof HTMLInputElement) {
        rawText = CONTENT_ELEMENT.value;
    }
    return rawText;
}, _HtmlFunction___setValueToContentElement = function _HtmlFunction___setValueToContentElement(CONTENT_ELEMENT, VALUE) {
    if (CONTENT_ELEMENT instanceof HTMLDivElement || CONTENT_ELEMENT instanceof HTMLSpanElement) {
        CONTENT_ELEMENT.textContent = VALUE;
    }
    else if (CONTENT_ELEMENT instanceof HTMLInputElement) {
        CONTENT_ELEMENT.value = VALUE;
    }
}, _HtmlFunction___validateLengthWithin = function _HtmlFunction___validateLengthWithin(CONTENT_ELEMENT, LENGTH) {
    CONTENT_ELEMENT.addEventListener("input", () => {
        var text = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, CONTENT_ELEMENT);
        var textLength;
        if (text) {
            textLength = text.length;
            if (textLength > LENGTH) {
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, text.slice(0, -1));
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setCursorToEnd).call(this, CONTENT_ELEMENT);
            }
            else {
                return;
            }
        }
        else {
            return;
        }
    });
}, _HtmlFunction___setCursorToEnd = function _HtmlFunction___setCursorToEnd(CONTENT_ELEMENT) {
    if (CONTENT_ELEMENT instanceof HTMLDivElement || CONTENT_ELEMENT instanceof HTMLSpanElement) {
        const RANGE = document.createRange();
        const SELECTION = window.getSelection();
        RANGE.selectNodeContents(CONTENT_ELEMENT);
        RANGE.collapse(false);
        SELECTION.removeAllRanges();
        SELECTION.addRange(RANGE);
    }
    else if (CONTENT_ELEMENT instanceof HTMLInputElement) {
        const length = CONTENT_ELEMENT.value.length;
        CONTENT_ELEMENT.setSelectionRange(length, length);
        CONTENT_ELEMENT.focus();
    }
}, _HtmlFunction___onlyNumbers = function _HtmlFunction___onlyNumbers(CONTENT_ELEMENT) {
    this.lastLaunchTimes.onlyNumbers = new Date();
    CONTENT_ELEMENT.addEventListener("input", () => {
        if (__classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___isLaunchEvent).call(this, "onlyNumbers")) {
            const RAW_TEXT = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, CONTENT_ELEMENT);
            if (RAW_TEXT) {
                const IS_NUM = RAW_TEXT.match(/^[0-9０-９]+$/) ? true : false;
                if (IS_NUM) {
                    var fullWidthDigit = this.UtilsFunc.toHarfWidthDegitText(RAW_TEXT);
                    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, fullWidthDigit);
                }
                else {
                    alert(`数値以外が入力されたため、文字を消去しました。`);
                    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, RAW_TEXT.replace(/[^0-9]+/g, ""));
                }
            }
            this.lastLaunchTimes.onlyNumbers = new Date();
        }
        else {
            const RAW_TEXT = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, CONTENT_ELEMENT);
            if (RAW_TEXT) {
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, RAW_TEXT.replace(/[^0-9]/g, ""));
                return;
            }
        }
    });
}, _HtmlFunction___onlySelectedNumberRange = function _HtmlFunction___onlySelectedNumberRange(CONTENT_ELEMENT, MIN_NUMBER, MAX_NUMBER) {
    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___onlyNumbers).call(this, CONTENT_ELEMENT);
    var text_number;
    var number;
    CONTENT_ELEMENT.addEventListener("input", () => {
        text_number = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, CONTENT_ELEMENT);
        if (text_number) {
            number = parseInt(text_number);
            if (MIN_NUMBER <= number && number <= MAX_NUMBER) {
            }
            else {
                if (number === 0) {
                    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, "");
                }
                else {
                    if (isNaN(number)) {
                    }
                    else {
                        alert(`入力しようとされた数値:${number}は範囲外の数値です。\n値は${MIN_NUMBER}～${MAX_NUMBER}を入力してください。`);
                        __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, "");
                    }
                }
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setCursorToEnd).call(this, CONTENT_ELEMENT);
            }
        }
        else {
        }
    });
}, _HtmlFunction___withinMonthlyDate = function _HtmlFunction___withinMonthlyDate(CONTENT_ELEMENT, MONTH_ELEMENT) {
    __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___onlyNumbers).call(this, CONTENT_ELEMENT);
    CONTENT_ELEMENT.addEventListener("input", () => {
        var monthString = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, MONTH_ELEMENT);
        if (monthString) {
            __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___validateMonthlyDate).call(this, CONTENT_ELEMENT, monthString);
        }
        else {
            alert(`月を指定してください`);
            __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, "");
        }
        ;
    });
    MONTH_ELEMENT.addEventListener("input", () => {
        var monthString = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, MONTH_ELEMENT);
        if (monthString) {
            __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___validateMonthlyDate).call(this, CONTENT_ELEMENT, monthString);
        }
        else {
        }
    });
}, _HtmlFunction___validateMonthlyDate = function _HtmlFunction___validateMonthlyDate(CONTENT_ELEMENT, monthString) {
    const CURRENT_YEAR = new Date().getFullYear();
    const CURRENT_MONTH = new Date().getMonth();
    var monthNumber = parseInt(monthString);
    var maxDate = 0;
    var taskYear = 2025;
    if (monthNumber >= CURRENT_MONTH) {
        maxDate = new Date(CURRENT_YEAR, monthNumber, 0).getDate();
        taskYear = CURRENT_YEAR;
    }
    else if (monthNumber < CURRENT_MONTH) {
        maxDate = new Date(CURRENT_YEAR + 1, monthNumber, 0).getDate();
        taskYear = CURRENT_YEAR + 1;
    }
    var dayString = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, CONTENT_ELEMENT);
    var dayNumber;
    if (dayString) {
        dayNumber = parseInt(dayString);
        if (dayNumber) {
            if (0 < dayNumber && dayNumber <= maxDate) {
            }
            else {
                alert(`入力されたのは${dayNumber}日でしたが、${taskYear}年の${monthNumber}月は${maxDate}日までです。`);
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, "");
            }
        }
        else {
            if (dayString == "-") {
            }
            else {
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, "01");
            }
        }
    }
    else {
    }
}, _HtmlFunction___zeroPadding = function _HtmlFunction___zeroPadding(CONTENT_ELEMENT) {
    CONTENT_ELEMENT.addEventListener("input", () => {
        var text_number = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, CONTENT_ELEMENT);
        if (text_number) {
            const IS_NUMBER = text_number.match(/^[0-9]+$/) ? true : false;
            if (text_number.length === 1 && IS_NUMBER) {
                text_number = `0${text_number}`;
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, text_number);
            }
            const HEAD_NUMBER = text_number.charAt(0);
            if (HEAD_NUMBER === "0" && text_number.length > 2) {
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, text_number.replace(/^0/, ""));
            }
            __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setCursorToEnd).call(this, CONTENT_ELEMENT);
        }
    });
}, _HtmlFunction___renderWeekday = function _HtmlFunction___renderWeekday(CONTENT_ELEMENT, MONTH_ELEMENT, DATE_ELEMENT) {
    MONTH_ELEMENT.addEventListener("input", () => {
        const MONTH_STRING = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, MONTH_ELEMENT);
        const DATE_STRING = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, DATE_ELEMENT);
        if (MONTH_STRING && DATE_STRING) {
            const MONTH_NUMBER = parseInt(MONTH_STRING);
            const DATE_NUMBER = parseInt(DATE_STRING);
            if (MONTH_NUMBER >= 0 && DATE_NUMBER >= 0) {
                const WEEKDAY = this.UtilsFunc.calcWeekday(MONTH_NUMBER, DATE_NUMBER);
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, `(${WEEKDAY})`);
            }
            else {
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, `()`);
            }
        }
        else {
            __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, `()`);
        }
    });
    DATE_ELEMENT.addEventListener("input", () => {
        const MONTH_STRING = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, MONTH_ELEMENT);
        const DATE_STRING = __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___getRawText).call(this, DATE_ELEMENT);
        if (MONTH_STRING && DATE_STRING) {
            const MONTH_NUMBER = parseInt(MONTH_STRING);
            const DATE_NUMBER = parseInt(DATE_STRING);
            if (MONTH_NUMBER >= 0 && DATE_NUMBER >= 0) {
                const WEEKDAY = this.UtilsFunc.calcWeekday(MONTH_NUMBER, DATE_NUMBER);
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, `(${WEEKDAY})`);
            }
            else {
                __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, `()`);
            }
        }
        else {
            __classPrivateFieldGet(this, _HtmlFunction_instances, "m", _HtmlFunction___setValueToContentElement).call(this, CONTENT_ELEMENT, `()`);
        }
    });
}, _HtmlFunction___isLaunchEvent = function _HtmlFunction___isLaunchEvent(VALIDATETION_NAME) {
    const CURRENT_TIME = new Date();
    if (VALIDATETION_NAME === "onlyNumbers") {
        const LAST_LAUNCHED_TIME = this.lastLaunchTimes.onlyNumbers;
        const TIME_LAPSE = CURRENT_TIME.getTime() - LAST_LAUNCHED_TIME.getTime();
        return TIME_LAPSE >= this.debounceTime ? true : false;
    }
    else {
        alert(`現在、追加されてないvalidation nameです: ${VALIDATETION_NAME}`);
    }
};
class AnimateFunctions {
    constructor() {
        console.log("ヒント：アニメをつけるElementはdisplay:noneに設定していてください。");
    }
    fadeIn(ELEMENT, SPEED = 0.05) {
        var opacity = 0;
        ELEMENT.style.opacity = opacity.toString();
        ELEMENT.style.display = "block";
        const FADE_EFFECT = setInterval(() => {
            if (opacity < 1) {
                opacity += SPEED;
                ELEMENT.style.opacity = opacity.toString();
            }
            else {
                clearInterval(FADE_EFFECT);
            }
        }, 50);
    }
    fadeOut(ELEMENT, SPEED = 0.05) {
        var opacity = 1;
        const FADE_EFFECT = setInterval(() => {
            if (opacity > 0) {
                opacity -= SPEED;
                ELEMENT.style.opacity = opacity.toString();
            }
            else {
                clearInterval(FADE_EFFECT);
                ELEMENT.style.display = "none";
            }
        }, 50);
    }
}
class PreLoader {
    constructor() {
        this.PRELOADER_MODAL = document.createElement("div");
        this.PRELOADER_MODAL.className = "preloader";
        this.STYLE = document.createElement("style");
    }
    charWaterflow({ BACKGROUND_COLOR = `rgba(0, 0, 0, 0.8)`, ANIMATE_COLOR_PATTERN = [`#0088cc`, `#e23069`, `#F0E300`], BASIC_FONT_COLOR = `rgb(255, 255, 255)` } = {}) {
        document.body.prepend(this.PRELOADER_MODAL);
        this.PRELOADER_MODAL.innerHTML = `
            <img src="labo-logo.png" class="labo-logo" id="labo-logo">
            <div class="loading">
                <span>L</span>
                <span class="animate">O</span>
                <span class="animate">A</span>
                <span class="animate">D</span>
                <span>I</span>
                <span>N</span>
                <span>G</span>
            </div>
        `;
        var basicStyleContext = `
        .preloader {
            position: fixed;
            top: 0px;
            background-color: ${BACKGROUND_COLOR};
            width: 100%;
            height: 100%;
            z-index: 99;
        }
        .labo-logo {
            position: relative;
            top: 30%;
            margin: auto;
            display: block;
            width: auto;
        }
        @keyframes spin {
            0% { top: 0; }
            50% { top: 100%; opacity: 0; }
            51% { top: -100%; }
            100% { top: 0; opacity: 1; }
        }

        .loading {
            position: relative;
            top: 32%;
            width: 100%;
            text-align: center;
          }

          .loading span {
            color: ${BASIC_FONT_COLOR};
            font-size: 30px;
          }

          .loading .animate {
            position: absolute;
            top: 0;
          }
        `;
        var animateStyleContext = `
            .loading span:nth-child(2) {
                color: ${ANIMATE_COLOR_PATTERN[0]};
                animation: spin 1.5s linear infinite;
                -webkit-animation: spin 1.5s linear infinite;
            }

            .loading span:nth-child(3) {
                margin-left: 25px;
                color: ${ANIMATE_COLOR_PATTERN[1]};
                animation: spin 1s linear infinite;
                -webkit-animation: spin 1s linear infinite;
            }

            .loading span:nth-child(4) {
                margin-left: 50px;
                color:${ANIMATE_COLOR_PATTERN[2]};
                animation: spin 1.25s linear infinite;
                -webkit-animation: spin 1.25s linear infinite;
            }

            .loading span:nth-child(5) {
                padding-left: 77px;
            }
        `;
        this.STYLE.textContent = basicStyleContext + animateStyleContext;
        document.head.appendChild(this.STYLE);
    }
    boundBalls({ BACKGROUND_COLOR = `rgba(0, 0, 0, 0.8)`, FONT_COLOR = `rgb(255, 255, 255)`, LEFT_PX = "0px", DISPLAY_CONTENT = "" } = {}) {
        document.body.prepend(this.PRELOADER_MODAL);
        this.PRELOADER_MODAL.innerHTML = `
            
            <img src="labo-logo.png" class="labo-logo" id="labo-logo">
            <div class="loading">
                <div class="wrapper">
                <div class="circle"></div>
                <div class="circle"></div>
                <div class="circle"></div>
                <div class="shadow"></div>
                <div class="shadow"></div>
                <div class="shadow"></div>
            </div>
            <div class="exp">${DISPLAY_CONTENT}</div>
        `;
        var basicStyleContext = `
                                    .labo-logo {
                                        position: relative;
                                        top: 30%;
                                        margin: auto;
                                        display: block;
                                        width: auto;
                                    }
                                    .loading {
                                        position: relative;
                                        top: 32%;
                                        width: 100%;
                                        text-align: center;
                                    }

                                    .loading span {
                                        color: rgb(0,0,0);
                                        font-size: 30px;
                                    }

                                    .loading .animate {
                                        position: absolute;
                                        top: 0;
                                    }
                                    .preloader {
                                        position: fixed;
                                        top: 0px;
                                        background-color: ${BACKGROUND_COLOR};
                                        width: 100%;
                                        height: 100%;
                                        z-index: 99;
                                    }
                                    body{
                                        padding:0;
                                        margin:0;
                                        width:100%;
                                        height:100vh;
                                   
                                    }
                                    .wrapper{
                                        width:200px;
                                        height:60px;
                                        position: absolute;
                                        left:50%;
                                        top:50%;
                                        transform: translate(-50%, -50%);
                                    }
                                    .circle{
                                        width:20px;
                                        height:20px;
                                        position: absolute;
                                        border-radius: 50%;
                                        background-color: #fff;
                                        left:15%;
                                        transform-origin: 50%;
                                        animation: circle .5s alternate infinite ease;
                                    }

                                    @keyframes circle{
                                        0%{
                                            top:100px;
                                            height:5px;
                                            border-radius: 50px 50px 25px 25px;
                                            transform: scaleX(1.7);
                                        }
                                        40%{
                                            height:20px;
                                            border-radius: 50%;
                                            transform: scaleX(1);
                                        }
                                        100%{
                                            top:0%;
                                        }
                                    }
                                    .circle:nth-child(2){
                                        left:45%;
                                        animation-delay: .2s;
                                    }
                                    .circle:nth-child(3){
                                        left:auto;
                                        right:15%;
                                        animation-delay: .3s;
                                    }
                                    .shadow{
                                        width:20px;
                                        height:4px;
                                        border-radius: 50%;
                                        background-color: rgba(0,0,0,.5);
                                        position: absolute;
                                        top:102px;
                                        transform-origin: 50%;
                                        z-index: -1;
                                        left:15%;
                                        filter: blur(1px);
                                        animation: shadow .5s alternate infinite ease;
                                    }

                                    @keyframes shadow{
                                        0%{
                                            transform: scaleX(1.5);
                                        }
                                        40%{
                                            transform: scaleX(1);
                                            opacity: .7;
                                        }
                                        100%{
                                            transform: scaleX(.2);
                                            opacity: .4;
                                        }
                                    }
                                    .shadow:nth-child(4){
                                        left: 45%;
                                        animation-delay: .2s
                                    }
                                    .shadow:nth-child(5){
                                        left:auto;
                                        right:15%;
                                        animation-delay: .3s;
                                    }

                                    .exp{
                                        position    : relative;
                                        top         : 150px;
                                        left        : ${LEFT_PX};
                                        color       : ${FONT_COLOR};
                                        font-size   : 45px;
                                    }
                                   
                              
        `;
        this.STYLE.textContent = basicStyleContext;
        document.head.appendChild(this.STYLE);
    }
    closePreLoader() {
        return __awaiter(this, void 0, void 0, function* () {
            const AnimateFunc = new AnimateFunctions();
            const UtilsFunc = new UtilsFunctions();
            AnimateFunc.fadeOut(this.PRELOADER_MODAL);
            yield UtilsFunc.sleep(1000);
            this.PRELOADER_MODAL.remove();
            this.STYLE.remove();
        });
    }
}
const EVENT_COLORS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
class GoogleCalendarApp {
    constructor(FIREBASE_APP) {
        this.CLIENT_ID = '357784436174-3b0e85mq2b8s6ijj3lh9drc4hg1c8m5v.apps.googleusercontent.com';
        this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
        this.SCOPES = 'https://www.googleapis.com/auth/calendar';
        this.TOKEN_CLIENT = undefined;
        this.GAPI_INITED = false;
        this.G_IS_INITED = false;
        this.FIREBASE_APP = FIREBASE_APP;
        this.PreloaderFunc = new PreLoader();
        const BTN = document.createElement("button");
        const SPAN = document.createElement("span");
        this.FIREBASE_APP.renderAuthStatus({ HTML_BTN_ELEMENT: BTN, SPAN_NAME: SPAN, METHOD: "onAuthStateChanged" });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.PreloaderFunc.boundBalls({
                DISPLAY_CONTENT: "Google Calenderと接続中・・・",
                BACKGROUND_COLOR: "rgba(5, 90, 70, 0.6)"
            });
            yield new UtilsFunctions().sleep(2000);
            let key = yield this.FIREBASE_APP.downloadKeyFromFireStore("secret", "apiKeys", "googleCalendarApiKey");
            if (key) {
            }
            else {
                alert("in GoogleCalenderApp. api key is none. check init() key. 開発者に連絡してください。");
                return;
            }
            yield this.loadGoogleAPIs(key);
            const ACCESS_TOKEN_DATA = yield this.FIREBASE_APP.downloadData("/accessToken");
            if (ACCESS_TOKEN_DATA) {
                const { token, expiresAt } = ACCESS_TOKEN_DATA;
                const currentTime = Date.now();
                if (currentTime < expiresAt) {
                    gapi.auth.setToken({ access_token: token });
                    this.PreloaderFunc.closePreLoader();
                    this.GAPI_INITED = true;
                    return;
                }
                else {
                    console.log("Access token expired. Proceeding with re-authentication.");
                }
            }
            else {
                console.log("No access token found in Firebase. Proceeding with authentication.");
            }
            this.handleAuthClick();
            (_a = document.getElementById("signout_button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.handleSignoutClick());
        });
    }
    loadGoogleAPIs(KEY) {
        return __awaiter(this, void 0, void 0, function* () {
            gapi.load('client', () => __awaiter(this, void 0, void 0, function* () {
                yield gapi.client.init({
                    apiKey: KEY,
                    discoveryDocs: [this.DISCOVERY_DOC],
                });
                this.GAPI_INITED = true;
            }));
            this.TOKEN_CLIENT = google.accounts.oauth2.initTokenClient({
                client_id: this.CLIENT_ID,
                scope: this.SCOPES,
                prompt: 'consent',
                access_type: 'offline',
                callback: (resp) => __awaiter(this, void 0, void 0, function* () { return yield this.authCallback(resp); }),
            });
            this.G_IS_INITED = true;
        });
    }
    handleAuthClick() {
        var _a, _b;
        if (gapi.client.getToken() === null) {
            (_a = this.TOKEN_CLIENT) === null || _a === void 0 ? void 0 : _a.requestAccessToken({ prompt: 'consent' });
        }
        else {
            (_b = this.TOKEN_CLIENT) === null || _b === void 0 ? void 0 : _b.requestAccessToken({ prompt: '' });
        }
    }
    handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken(null);
        }
    }
    authCallback(resp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resp.error !== undefined) {
                throw resp;
            }
            const TARGET_TOKEN = resp.access_token;
            const EXPIRES_IN = resp.expires_in;
            const expirationTime = Date.now() + EXPIRES_IN * 1000;
            this.FIREBASE_APP.uploadData("/accessToken", { token: TARGET_TOKEN, expiresAt: expirationTime });
            this.PreloaderFunc.closePreLoader();
        });
    }
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            let clientSecret = yield this.FIREBASE_APP.downloadKeyFromFireStore("secretID", "zrr92vt7G00bCXybBmIg", "clientID");
            params.append('client_id', this.CLIENT_ID);
            params.append('client_secret', clientSecret);
            params.append('refresh_token', refreshToken);
            params.append('grant_type', 'refresh_token');
            try {
                const response = yield fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    body: params,
                });
                const data = yield response.json();
                if (data.error) {
                    throw new Error(`Error refreshing access token: ${data.error}`);
                }
                const newAccessToken = data.access_token;
                const expiresIn = data.expires_in;
                gapi.auth.setToken({
                    access_token: newAccessToken,
                    expires_in: expiresIn,
                });
            }
            catch (error) {
                console.error('Error refreshing access token:', error);
            }
        });
    }
    addTask(ARGS) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = {
                'summary': ARGS.SUMMARY,
                'description': ARGS.CONTENT,
                'start': {
                    'dateTime': ARGS.DEADLINE,
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': ARGS.DEADLINE,
                    'timeZone': 'America/Los_Angeles'
                },
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        { 'method': 'popup', 'minutes': 10 }
                    ]
                },
                'colorId': ARGS.COLOR
            };
            gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
            }).then((response) => {
                const eventId = response.result.id;
                this.FIREBASE_APP.uploadData(`tasks/${ARGS.TASK_ID}/googleCalenderEventID`, eventId);
            });
        });
    }
    editTask(ARGS) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = {
                'summary': ARGS.SUMMARY,
                'description': ARGS.CONTENT,
                'start': {
                    'dateTime': ARGS.DEADLINE,
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': ARGS.DEADLINE,
                    'timeZone': 'America/Los_Angeles'
                },
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        { 'method': 'popup', 'minutes': 10 }
                    ]
                },
                'colorId': ARGS.COLOR
            };
            yield gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': ARGS.TASK_ID,
                'resource': event
            }).then((response) => {
            });
        });
    }
    deleteEvent(EVENT_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                calendarId: 'primary',
                eventId: EVENT_ID
            };
            const response = yield gapi.client.calendar.events.delete(request);
        });
    }
}
class TaskWindow {
    constructor(TASK, FirebaseApp, GoogleCalenderApp) {
        this.ID = new HtmlFunction().provideUniqueID();
        this.FirebaseApp = FirebaseApp;
        this.GoogleCalenderApp = GoogleCalenderApp;
        this.UtilsFunc = new UtilsFunctions();
        this.UrlFunc = new UrlFunction();
        this.HtmlFunc = new HtmlFunction();
        this.TASK_DATA = TASK;
        this.INTERVAL_IDS = [];
        this.makeWindow();
    }
    makeWindow() {
        const TASK_WINDOW = document.createElement("div");
        TASK_WINDOW.className = "task-window";
        TASK_WINDOW.id = `taskWindow${this.ID}`;
        const TITLE = this.__determineTitle();
        const CONTENT = this.__determineContent();
        const PASSWORD_INNER_HTML = this.__determinePasswordElems(TITLE, CONTENT);
        TASK_WINDOW.innerHTML = `
            <div class="main-value-window"  id="mainWindow${this.ID}">
                <img  class="main-value-window__key1"                               id="key1${this.ID}"     src="key.png">
                <span class="main-value-window__fixed-title-span"                   id="expTitle${this.ID}"                                                      >件名　　　：</span> 
                <span class="main-value-window__title"                              id="title${this.ID}"                 >${TITLE}  </span>
                <br>
                <span class="main-value-window__fixed-deadlline-span"               id="expDeadline${this.ID}"                                      >締め切り　：</span>
                <span class="main-value-window__deadline"                           id="deadline${this.ID}"               >${this.__formatToWareki(this.TASK_DATA.TIME)}</span>
                <br>
                <img  class="main-value-window__key2 main-value-window__key2--up"   id="key2${this.ID}"     src="key.png" >
                <span class="main-value-window__fixed-content-span"                 id="expContent${this.ID}"                                      >内容　　　：</span>
                <div  class="main-value-window__editable-content"                   id="content${this.ID}"                >
                    ${CONTENT}
                </div>
                ${PASSWORD_INNER_HTML}

            </div>

            <div     class="btn-window"                                             id="btnWindow${this.ID}"              >
                <img class="btn-window__pic"                                        id="btnToggleDisplay${this.ID}"  src="edit.png">
            </div>
        `;
        document.body.append(TASK_WINDOW);
        const EDIT_WINDOW = document.createElement("div");
        EDIT_WINDOW.className = "task-edit-window";
        EDIT_WINDOW.id = `edit-window${this.ID}`;
        EDIT_WINDOW.innerHTML = `
                                <span class="task-edit-window__repeat"      id="repeat${this.ID}"                       >繰り返し値：繰り返さない</span>
                                <img  class="task-edit-window__btn-finish"  id="btnFinish${this.ID}" src="finish1.png"  >
                                <img  class="task-edit-window__btn-edit"    id="btnEdit${this.ID}"   src="edit_task.png">
                                `;
        TASK_WINDOW.appendChild(EDIT_WINDOW);
        this.__processEncrypto();
        this.__setFlashAnimation();
        this.setEditBtnEvent();
        this.showRepeatExp();
    }
    __determineTitle() {
        var title = "";
        if (this.TASK_DATA.TITLE.salt) {
            title = "暗号化されています";
        }
        else {
            title = this.TASK_DATA.TITLE.data;
        }
        return title;
    }
    __determineContent() {
        var content = "";
        if (this.TASK_DATA.CONTENT.salt) {
            content = "暗号化されています";
        }
        else {
            content = this.TASK_DATA.CONTENT.data;
            if (content) {
            }
            else {
                content = "";
            }
        }
        return content;
    }
    __determinePasswordElems(TITLE, CONTENT) {
        var passwordInnerHtml = "";
        if (TITLE === "暗号化されています" || CONTENT === "暗号化されています") {
            passwordInnerHtml = `<span   class="main-value-window__fixed-password-span main-value-window__fixed-password-span--up"    id="expPassword${this.ID}"            >パスワード：</span>
            <span   class="main-value-window__editable-password   main-value-window__editable-password--up"   id="entryKey${this.ID}"   contenteditable="true" >           </span>
            <div    class="main-value-window__for-margin">margin</div>`;
        }
        return passwordInnerHtml;
    }
    __formatToWareki(ISO8601_DATE_TIME) {
        var timeElems = ISO8601_DATE_TIME.split("T");
        const ISO8601_DATE = timeElems[0];
        const ISO8601_TIME = timeElems[1].replace("+9:00", "");
        const DATE_COMPONENTS = ISO8601_DATE.split("-");
        const TIME_COMPONENTS = ISO8601_TIME.split(":");
        const WAREKI_DATE = `
        ${DATE_COMPONENTS[0]}年${DATE_COMPONENTS[1]}月${DATE_COMPONENTS[2]}日（${this.__returnWeekday(ISO8601_DATE_TIME)}）${TIME_COMPONENTS[0]}時${TIME_COMPONENTS[1]}分
        `;
        return WAREKI_DATE;
    }
    __returnWeekday(ISO8601_DATE_TIME) {
        const DATE = new Date(ISO8601_DATE_TIME);
        if (isNaN(DATE.getTime())) {
            alert(`ISO8601表記法とは異なる日付情報が確認されました。 [${ISO8601_DATE_TIME}] 【? 一桁の要素は01のように0がで埋めていますか】`);
            console.log(`${ISO8601_DATE_TIME}`);
            return `ERROR`;
        }
        const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
        return WEEKDAYS[DATE.getDay()];
    }
    __processEncrypto() {
        if (this.TASK_DATA.TITLE.salt) {
            this.__showKeySignifier();
            this.__setUnlockEvent();
        }
    }
    __showKeySignifier() {
        const TITLE_KEY = document.getElementById(`key1${this.ID}`);
        TITLE_KEY.style.visibility = "visible";
        const CONTENT_KEY = document.getElementById(`key2${this.ID}`);
        CONTENT_KEY.style.visibility = "visible";
    }
    __setUnlockEvent() {
        const PASSWORD_ENTRY = document.getElementById(`entryKey${this.ID}`);
        PASSWORD_ENTRY.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
            var rawInputPassword = PASSWORD_ENTRY.textContent;
            if (rawInputPassword) {
                const CONFIGURED_PASSWORD = rawInputPassword.replace(/\s/g, "");
                const DECRYPTED_TITLE = yield this.FirebaseApp.decryptData(this.TASK_DATA.TITLE.data, this.TASK_DATA.TITLE.salt, this.TASK_DATA.TITLE.iv, CONFIGURED_PASSWORD);
                const DECRYPTED_CONTENT = yield this.FirebaseApp.decryptData(this.TASK_DATA.CONTENT.data, this.TASK_DATA.CONTENT.salt, this.TASK_DATA.CONTENT.iv, CONFIGURED_PASSWORD);
                if (DECRYPTED_TITLE === null) {
                    this.__lock();
                }
                else {
                    this.__unlock(DECRYPTED_TITLE, DECRYPTED_CONTENT);
                }
            }
        }));
    }
    __unlock(TITLE, CONTENT) {
        const SPAN_TITLE = document.getElementById(`title${this.ID}`);
        const SPAN_CONTENT = document.getElementById(`content${this.ID}`);
        if (typeof TITLE === "string") {
            SPAN_TITLE.innerHTML = TITLE;
        }
        if (typeof CONTENT === "string") {
            SPAN_CONTENT.innerHTML = CONTENT;
        }
        this.__hiddenKeySignifier();
    }
    __lock() {
        const SPAN_TITLE = document.getElementById(`title${this.ID}`);
        const SPAN_CONTENT = document.getElementById(`content${this.ID}`);
        if (SPAN_TITLE.textContent === "暗号化されています") {
        }
        else {
            SPAN_TITLE.textContent = "暗号化されています";
            SPAN_CONTENT.textContent = "暗号化されています";
            this.__showKeySignifier();
        }
    }
    __hiddenKeySignifier() {
        const TITLE_KEY = document.getElementById(`key1${this.ID}`);
        const CONTENT_KEY = document.getElementById(`key2${this.ID}`);
        TITLE_KEY.style.visibility = "hidden";
        CONTENT_KEY.style.visibility = "hidden";
    }
    __setFlashAnimation() {
        const WINDOW = document.getElementById(`mainWindow${this.ID}`);
        const FIT_CONDITION = this.__extractFitCondition();
        const CURRENT_COLOR = WINDOW.style.backgroundColor;
        const COLOR1 = this.UtilsFunc.changeColorCodeToRGB(FIT_CONDITION.color1.value);
        const COLOR2 = this.UtilsFunc.changeColorCodeToRGB(FIT_CONDITION.color2.value);
        if (FIT_CONDITION.isFlash) {
            const FLASH_INTERVAL_MS = 700;
            this.INTERVAL_IDS.push(setInterval(() => this.__flashEvent(WINDOW, COLOR1, COLOR2), FLASH_INTERVAL_MS));
        }
        else {
            this.__paintWindowColor(WINDOW, COLOR1);
        }
    }
    __paintWindowColor(WINDOW, COLOR1) {
        WINDOW.style.backgroundColor = COLOR1;
        this.__changeFontColors(this.UtilsFunc.chooseSuitableFontColor(COLOR1));
    }
    __extractFitCondition() {
        const CURRENT_TIME = new Date();
        const DEADLINE = new Date(this.TASK_DATA.TIME);
        const TIME_LAPSE_MS = CURRENT_TIME.getTime() - DEADLINE.getTime();
        const CONDITIONS = [];
        for (let condition in this.TASK_DATA.ALERT_CONDITIONS) {
            const CONDITION_DATA = this.TASK_DATA.ALERT_CONDITIONS[condition];
            const CONDITIONAL_DATE = this.UtilsFunc.subtractDates({
                targetDate: DEADLINE,
                minusAmount: CONDITION_DATA.time,
                timeUnit: CONDITION_DATA.time_unit
            });
            CONDITIONS.push({
                date: CONDITIONAL_DATE,
                isFlash: CONDITION_DATA.isFlash,
                color1: CONDITION_DATA.color1,
                color2: CONDITION_DATA.color2
            });
        }
        const RAW_CONDITION = this.__chooseFitCondition(CONDITIONS);
        if (RAW_CONDITION.isExistCondition) {
            const FIT_CONDITION = RAW_CONDITION.CONDITION;
            return FIT_CONDITION;
        }
        else {
            return RAW_CONDITION;
        }
    }
    __chooseFitCondition(CONDITIONS) {
        const RECORD_DATE_LAPSE = this.__composeTimeLapseRecord(CONDITIONS);
        const DEADLINE_DATE_LAPSE = new Date().getTime() - new Date(this.TASK_DATA.TIME).getTime();
        const RECORD_NEAR_ZERO_NEGATIVE = RECORD_DATE_LAPSE.reduce((near_zero_negative, target) => this.__extractNearNegativeFunc(near_zero_negative, target), RECORD_DATE_LAPSE[0]);
        if (DEADLINE_DATE_LAPSE >= 0) {
            return {
                date: this.TASK_DATA.TIME,
                isFlash: false,
                color1: { value: "#303030", name: "パレットの色" },
                color2: { value: "#303030", name: "パレットの色" },
                isExistCondition: false
            };
        }
        else {
            return RECORD_NEAR_ZERO_NEGATIVE;
        }
    }
    __composeTimeLapseRecord(CONDITIONS) {
        const RECORD_DATE_LAPSE = [];
        const CURRENT_TIME_MS = new Date().getTime();
        for (let condition of CONDITIONS) {
            RECORD_DATE_LAPSE.push({
                CONDITION: condition,
                DEADLINE: condition.date,
                DEADLINE_MS: new Date(condition.date).getTime(),
                TIME_LAPSE: CURRENT_TIME_MS - new Date(condition.date).getTime(),
                isExistCondition: true
            });
        }
        return RECORD_DATE_LAPSE;
    }
    __extractNearNegativeFunc(near_zero_negative, target) {
        if (near_zero_negative.TIME_LAPSE > target.TIME_LAPSE && target.TIME_LAPSE >= 0) {
            return target;
        }
        else {
            return near_zero_negative;
        }
    }
    __flashEvent(WINDOW, COLOR1, COLOR2) {
        const CURRENT_COLOR = WINDOW.style.backgroundColor;
        if (CURRENT_COLOR === COLOR1) {
            WINDOW.style.backgroundColor = COLOR2;
            const SUITABLE_FONT_COLOR = this.UtilsFunc.chooseSuitableFontColor(COLOR2);
            this.__changeFontColors(SUITABLE_FONT_COLOR);
        }
        else {
            WINDOW.style.backgroundColor = COLOR1;
            const SUITABLE_FONT_COLOR = this.UtilsFunc.chooseSuitableFontColor(COLOR1);
            this.__changeFontColors(SUITABLE_FONT_COLOR);
        }
    }
    __changeFontColors(FONT_COLOR) {
        const TITLE = document.getElementById(`title${this.ID}`);
        const EXP_TITLE = document.getElementById(`expTitle${this.ID}`);
        const DEADLINE = document.getElementById(`deadline${this.ID}`);
        const EXP_DEADLINE = document.getElementById(`expDeadline${this.ID}`);
        const EXP_CONTENT = document.getElementById(`expContent${this.ID}`);
        const EXP_PASSWORD = document.getElementById(`expPassword${this.ID}`);
        TITLE.style.color = FONT_COLOR;
        EXP_TITLE.style.color = FONT_COLOR;
        DEADLINE.style.color = FONT_COLOR;
        EXP_DEADLINE.style.color = FONT_COLOR;
        EXP_CONTENT.style.color = FONT_COLOR;
        if (EXP_PASSWORD) {
            EXP_PASSWORD.style.color = FONT_COLOR;
        }
    }
    showRepeatExp() {
        const SPAN_REPEAT = document.getElementById(`repeat${this.ID}`);
        const RECORD_REPEAT_COMBOBOX = { "no-repeat": "繰り返さない",
            "minute": "分毎",
            "hour": "時毎",
            "day": "日毎",
            "week": "週毎",
            "month": "月毎",
            "year": "年毎"
        };
        const REPEAT_EXP = RECORD_REPEAT_COMBOBOX[`${this.TASK_DATA.REPEAT.option}`];
        if (this.TASK_DATA.REPEAT.option === "no-repeat") {
            SPAN_REPEAT.textContent = `繰り返し値：${REPEAT_EXP}`;
        }
        else {
            SPAN_REPEAT.textContent = `繰り返し値：${this.TASK_DATA.REPEAT.value}${REPEAT_EXP}`;
        }
    }
    setEditBtnEvent() {
        const OPEN_EDIT_WINDOW_BTN = document.getElementById(`btnToggleDisplay${this.ID}`);
        OPEN_EDIT_WINDOW_BTN.addEventListener("click", () => {
            this.__toggleDisplayEditWindow();
        });
        const BTN_FINISH = document.getElementById(`btnFinish${this.ID}`);
        BTN_FINISH.addEventListener("click", () => {
            if (this.TASK_DATA.REPEAT.option === "no-repeat") {
                this.__finishTask();
            }
            else {
                this.__sendRepeatTask();
            }
        });
        const BTN_EDIT = document.getElementById(`btnEdit${this.ID}`);
        BTN_EDIT.addEventListener("click", () => {
            this.__editTask();
        });
    }
    __toggleDisplayEditWindow() {
        const EDIT_WINDOW = document.getElementById(`edit-window${this.ID}`);
        const CURRENT_STATUS = EDIT_WINDOW.style.display;
        if (CURRENT_STATUS === "none" || CURRENT_STATUS === "") {
            EDIT_WINDOW.style.display = "block";
        }
        else {
            EDIT_WINDOW.style.display = "none";
        }
    }
    __finishTask() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.__deleteFromGoogleCalender();
            this.FirebaseApp.deleteData(`tasks/${this.TASK_DATA.TASK_ID}`);
            this.UrlFunc.redirect({
                METHOD: "toHP",
                CALL_FROM: "TaskWindow, finishTask"
            });
        });
    }
    __deleteFromGoogleCalender() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.GoogleCalenderApp.deleteEvent(this.TASK_DATA.EVENT_ID);
        });
    }
    __sendRepeatTask() {
        return __awaiter(this, void 0, void 0, function* () {
            const DATA = yield this.__produceTaskData();
            const IS_LOGIEND = this.FirebaseApp.isLogined();
            if (IS_LOGIEND) {
                const TASK_ID = this.TASK_DATA.TASK_ID;
                DATA["id"] = TASK_ID;
                const ENCRYPT_DATAS = yield this.FirebaseApp.encryptData(DATA.sendData);
                if (ENCRYPT_DATAS) {
                    if (TASK_ID) {
                    }
                    else {
                        alert(`ERROR: in TaskManager, sendEditData. TaskIDがundefinedです。データの編集ができませんでした。zin-syuubunndou@gmail.comまでご連絡ください。`);
                        return;
                    }
                    this.FirebaseApp.uploadData(`tasks/${TASK_ID}/taskData`, ENCRYPT_DATAS);
                    yield this.__sendRepeatDataToGoogleCalender(DATA.rawData);
                    this.UrlFunc.redirect({
                        METHOD: "toHP",
                        CALL_FROM: "TaskManager, sendEditData"
                    });
                }
                else {
                    alert(`データの送信に失敗しました。`);
                    return;
                }
            }
            else {
                alert(`ログインしてない場合は、データを保存できません。`);
            }
        });
    }
    __sendRepeatDataToGoogleCalender(DATA) {
        return __awaiter(this, void 0, void 0, function* () {
            const YEAR = parseInt(DATA.deadline.year);
            const MONTH = parseInt(DATA.deadline.month);
            const DAY = parseInt(DATA.deadline.day);
            const HOUR = parseInt(DATA.deadline.hour);
            const MINUTE = parseInt(DATA.deadline.minute);
            const DEADLINE_ISOSTRING = new Date(YEAR, MONTH - 1, DAY, HOUR, MINUTE).toISOString();
            const EVENT_ARGS = {
                SUMMARY: DATA.taskName.data,
                DEADLINE: DEADLINE_ISOSTRING,
                CONTENT: DATA.content.data,
                COLOR: "2",
                TASK_ID: this.TASK_DATA.EVENT_ID
            };
            yield this.GoogleCalenderApp.editTask(EVENT_ARGS);
        });
    }
    __produceTaskData() {
        return __awaiter(this, void 0, void 0, function* () {
            const DATAS = yield this.__produceMainWindowData();
            const DATA = {};
            DATA["AlertWindow"] = this.TASK_DATA.ALERT_CONDITIONS;
            if (Object.keys(DATAS.encryptedData).length === 0) {
                DATA["MainWindow"] = DATAS.rawData;
            }
            else {
                DATA["MainWindow"] = DATAS.encryptedData;
            }
            return { sendData: DATA, rawData: DATAS.rawData };
        });
    }
    __produceMainWindowData() {
        return __awaiter(this, void 0, void 0, function* () {
            const EBCRYPTED_DATA = {};
            const RAW_DATA = {};
            const PASSWORD_ENTRY1 = document.getElementById("addKey1");
            var password = "";
            if (PASSWORD_ENTRY1) {
                if (PASSWORD_ENTRY1.textContent === "（任意）パスワードを入力") {
                    password = "";
                }
                else {
                    password = PASSWORD_ENTRY1.textContent ? PASSWORD_ENTRY1.textContent : "";
                }
            }
            else {
                password = "";
            }
            if (password) {
                EBCRYPTED_DATA["taskName"] = yield this.FirebaseApp.encryptData(this.TASK_DATA.TITLE.data, password);
                EBCRYPTED_DATA["deadline"] = this.__composeDeadlineDataByRepeat();
                EBCRYPTED_DATA["repeat"] = this.TASK_DATA.REPEAT;
                EBCRYPTED_DATA["content"] = yield this.FirebaseApp.encryptData(this.TASK_DATA.CONTENT.data, password);
            }
            RAW_DATA["taskName"] = this.TASK_DATA.TITLE;
            RAW_DATA["deadline"] = this.__composeDeadlineDataByRepeat();
            RAW_DATA["repeat"] = this.TASK_DATA.REPEAT;
            RAW_DATA["content"] = this.TASK_DATA.CONTENT;
            return { rawData: RAW_DATA, encryptedData: EBCRYPTED_DATA };
        });
    }
    __composeDeadlineDataByRepeat() {
        if (this.TASK_DATA.REPEAT.option === "no-repeat") {
            return {
                year: new Date(this.TASK_DATA.TIME).getFullYear(),
                month: new Date(this.TASK_DATA.TIME).getUTCMonth(),
                day: new Date(this.TASK_DATA.TIME).getUTCDate(),
                weekday: `(${this.UtilsFunc.calcWeekday(new Date(this.TASK_DATA.TIME).getUTCMonth(), new Date(this.TASK_DATA.TIME).getUTCDate())})`,
                hour: new Date(this.TASK_DATA.TIME).getUTCHours(),
                minute: new Date(this.TASK_DATA.TIME).getUTCMinutes()
            };
        }
        else {
            var viceDeadline = new Date(this.TASK_DATA.TIME);
            var nextDeadline = new Date(viceDeadline);
            if (this.TASK_DATA.REPEAT.option === "year") {
                nextDeadline.setFullYear(viceDeadline.getUTCFullYear() + parseInt(this.TASK_DATA.REPEAT.value));
            }
            else if (this.TASK_DATA.REPEAT.option === "month") {
                nextDeadline.setMonth(viceDeadline.getMonth() + parseInt(this.TASK_DATA.REPEAT.value));
            }
            else if (this.TASK_DATA.REPEAT.option === "week") {
                nextDeadline.setDate(viceDeadline.getDate() + parseInt(this.TASK_DATA.REPEAT.value) * 7);
            }
            else if (this.TASK_DATA.REPEAT.option === "day") {
                nextDeadline.setDate(viceDeadline.getDate() + parseInt(this.TASK_DATA.REPEAT.value));
            }
            else if (this.TASK_DATA.REPEAT.option === "hour") {
                nextDeadline.setUTCHours(viceDeadline.getUTCHours() + parseInt(this.TASK_DATA.REPEAT.value));
            }
            else if (this.TASK_DATA.REPEAT.option === "minute") {
                nextDeadline.setUTCMinutes(viceDeadline.getUTCMinutes() + parseInt(this.TASK_DATA.REPEAT.value));
            }
            else {
                alert(`in compose deadline data by repeat, リピートにて、存在しないオプションが渡されました。${this.TASK_DATA.REPEAT.option}`);
            }
            return {
                year: nextDeadline.getFullYear(),
                month: nextDeadline.getUTCMonth() + 1,
                day: nextDeadline.getUTCDate(),
                weekday: `(${this.UtilsFunc.calcWeekday(nextDeadline.getUTCMonth() + 1, nextDeadline.getUTCDate())})`,
                hour: nextDeadline.getUTCHours(),
                minute: nextDeadline.getUTCMinutes()
            };
        }
    }
    __editTask() {
        const TITLE = document.getElementById(`title${this.ID}`);
        const CONTENT = document.getElementById(`content${this.ID}`);
        if (TITLE.textContent.trim() === "暗号化されています") {
            alert(`暗号化された状態ではデータを編集できません。\n設定したパスワードを入力してから編集ボタンを押してください。`);
            const PASSWORD_ENTRY = document.getElementById(`entryKey${this.ID}`);
            this.HtmlFunc.setUnfilledSignifier(PASSWORD_ENTRY);
            return;
        }
        else {
            const EDIT_TASK_DATA = {
                TITLE: { data: TITLE.textContent.trim(), salt: this.TASK_DATA.TITLE.salt, iv: this.TASK_DATA.TITLE.iv },
                TIME: this.TASK_DATA.TIME,
                REPEAT: this.TASK_DATA.REPEAT,
                CONTENT: { data: CONTENT.innerHTML, salt: this.TASK_DATA.CONTENT.salt, iv: this.TASK_DATA.CONTENT.iv },
                ALERT_CONDITIONS: this.TASK_DATA.ALERT_CONDITIONS,
                SALT: this.TASK_DATA.SALT,
                IV: this.TASK_DATA.IV,
                TASK_ID: this.TASK_DATA.TASK_ID,
                EVENT_ID: this.TASK_DATA.EVENT_ID
            };
            this.UrlFunc.redirect({
                METHOD: "toSelectedPage",
                PAGE_TITLE: "edit-task",
                CALL_FROM: "Taskwindow, edittask",
                QUERY: EDIT_TASK_DATA
            });
        }
    }
}
const COLOR_OPTIONS = [
    "萌葱色",
    "花緑青",
    "青緑",
    "翡翠色",
    "舛花色",
    "藍鼠",
    "麹塵",
    "枯茶",
    "豆がら茶",
    "生壁色",
    "肥後煤竹",
    "葡萄鼠",
    "媚茶",
    "海松茶",
    "熨斗目花色",
    "飴色",
    "櫨染",
    "黄朽葉色",
    "山吹茶",
    "黄唐茶",
    "黄橡",
    "芥子色",
    "桑茶",
    "桑染",
    "土色",
    "駱駝色",
    "伽羅色",
    "焦香",
    "茄子紺",
    "蒲葡",
    "梅紫",
    "若紫",
    "二藍",
    "古代紫",
    "京紫",
    "菖蒲色",
    "紅藤色",
    "浅紫",
    "半色",
    "薄鼠",
    "湊鼠",
    "藤鼠",
    "牡丹鼠",
    "暁鼠",
    "淡紅藤",
    "紫水晶",
    "鳩羽色",
    "鳩羽鼠",
    "黒緑",
    "千歳茶",
    "錆浅葱",
    "錆御納戸",
    "高麗納戸",
    "桜色",
    "薄桜",
    "桜鼠",
    "鴇鼠",
    "虹色",
    "珊瑚色",
    "宍色",
    "一斤染",
    "紅紫",
    "紅梅色",
    "甚三紅",
    "桃色",
    "桃花色",
    "薄紅梅",
    "石竹色",
    "鴇色",
    "灰桜",
    "灰梅",
    "ときがら茶",
    "退紅",
    "長春色",
    "土器色",
    "樺色",
    "紅鬱金",
    "白橡",
    "霞色",
    "利休茶",
    "白花色",
    "紫鳶",
    "梅染",
    "琥珀色",
    "鶯茶",
    "藍白",
    "濃鼠",
    "蘇芳香",
    "赤茶",
    "木蘭色",
    "白藍",
    "藤煤竹",
    "浅蘇芳",
    "代赭",
    "砂色",
    "水色",
    "滅紫",
    "真朱",
    "煉瓦色",
    "油色",
    "瓶覗",
    "紅消鼠",
    "赤紫",
    "雀茶",
    "利休色",
    "秘色色",
    "似せ紫",
    "躑躅色",
    "団十郎茶",
    "梅幸茶",
    "空色",
    "灰黄緑",
    "牡丹色",
    "柿渋色",
    "璃寛茶",
    "勿忘草色",
    "蕎麦切色",
    "今様色",
    "紅鳶",
    "黄海松茶",
    "青藤色",
    "薄雲鼠",
    "中紅",
    "灰茶",
    "菜種油",
    "白群",
    "枯野色",
    "薔薇色",
    "茶色",
    "青朽葉",
    "浅縹",
    "潤色",
    "韓紅",
    "檜皮色",
    "根岸色",
    "薄花色",
    "利休白茶",
    "銀朱",
    "鳶色",
    "鶸茶",
    "納戸色",
    "茶鼠",
    "赤紅",
    "柿茶",
    "柳茶",
    "浅葱色",
    "胡桃染",
    "紅緋",
    "弁柄色",
    "海松色",
    "花浅葱",
    "江戸鼠",
    "赤",
    "赤錆色",
    "鶯色",
    "新橋色",
    "煤色",
    "猩々緋",
    "褐色",
    "緑黄色",
    "天色",
    "丁子茶",
    "紅",
    "栗梅",
    "鶸色",
    "露草色",
    "柴染",
    "深緋",
    "紅檜皮",
    "抹茶色",
    "青",
    "宗伝唐茶",
    "緋色",
    "海老茶",
    "若草色",
    "薄藍",
    "砺茶",
    "赤丹",
    "唐茶",
    "黄緑",
    "縹色",
    "煎茶色",
    "紅赤",
    "栗色",
    "若芽色",
    "紺碧",
    "銀煤竹",
    "臙脂",
    "赤銅色",
    "若菜色",
    "薄群青",
    "黄枯茶",
    "朱・緋",
    "錆色",
    "若苗色",
    "薄花桜",
    "煤竹色",
    "茜色",
    "赤褐色",
    "青丹",
    "群青色",
    "焦茶",
    "紅海老茶",
    "茶褐色",
    "草色",
    "杜若色",
    "黒橡",
    "蘇芳",
    "栗皮茶",
    "苔色",
    "瑠璃色",
    "憲法色",
    "真紅",
    "黒茶",
    "萌黄",
    "薄縹",
    "涅色",
    "濃紅",
    "葡萄茶",
    "苗色",
    "瑠璃紺",
    "檳榔子染",
    "象牙色",
    "葡萄色",
    "若葉色",
    "紺瑠璃",
    "黒鳶",
    "練色",
    "萱草色",
    "松葉色",
    "藍色",
    "赤墨",
    "灰白色",
    "柑子色",
    "夏虫色",
    "青藍",
    "黒紅",
    "蒸栗色",
    "金茶",
    "鶸萌黄",
    "深縹",
    "白",
    "女郎花",
    "蜜柑色",
    "柳色",
    "紺色",
    "胡粉色",
    "枯草色",
    "鉛丹色",
    "青白橡",
    "紺青",
    "卯の花色",
    "淡黄",
    "黄丹",
    "柳鼠",
    "留紺",
    "白磁",
    "白茶",
    "柿色",
    "裏葉柳",
    "濃藍",
    "生成り色",
    "赤白橡",
    "黄赤",
    "山葵色",
    "鉄紺",
    "乳白色",
    "洗柿",
    "人参色",
    "老竹色",
    "漆黒",
    "白練",
    "鳥の子色",
    "橙色",
    "白緑",
    "淡藤色",
    "素色",
    "蜂蜜色",
    "照柿",
    "淡萌黄",
    "藤色",
    "白梅鼠",
    "肌色",
    "赤橙",
    "柳染",
    "紅掛空色",
    "白鼠",
    "薄卵色",
    "金赤",
    "薄萌葱",
    "紅碧",
    "絹鼠",
    "雄黄",
    "朱色",
    "深川鼠",
    "紺桔梗",
    "灰青",
    "洒落柿",
    "小麦色",
    "若緑",
    "花色",
    "銀鼠",
    "赤香",
    "丹色",
    "浅緑",
    "紺藍",
    "薄鈍",
    "砥粉色",
    "黄茶",
    "薄緑",
    "紅桔梗",
    "薄墨色",
    "肉色",
    "肉桂色",
    "青鈍",
    "桔梗色",
    "錫色",
    "人色",
    "赤朽葉色",
    "青磁鼠",
    "藤納戸",
    "素鼠",
    "丁子色",
    "黄櫨染",
    "薄青",
    "紅掛花色",
    "鼠色",
    "香色",
    "蒲公英色",
    "錆青磁",
    "紫苑色",
    "源氏鼠",
    "薄香",
    "黄色",
    "緑青色",
    "白藤色",
    "灰色",
    "浅黄",
    "中黄",
    "千歳緑",
    "藤紫",
    "鉛色",
    "枯色",
    "菜の花色",
    "若竹色",
    "菫色",
    "鈍色",
    "淡香",
    "黄檗色",
    "緑",
    "青紫",
    "墨",
    "杏色",
    "卵色",
    "常磐色",
    "丼鼠",
    "東雲色",
    "花葉色",
    "千草鼠",
    "竜胆色",
    "消炭色",
    "曙色",
    "刈安色",
    "千草色",
    "江戸紫",
    "藍墨茶",
    "珊瑚朱色",
    "玉蜀黍色",
    "青磁色",
    "本紫",
    "羊羹色",
    "深支子",
    "金糸雀色",
    "青竹色",
    "蝋色",
    "纁",
    "黄支子色",
    "常磐緑",
    "深紫",
    "黒",
    "浅緋",
    "支子色",
    "木賊色",
    "紫黒",
    "烏羽色",
    "真赭",
    "向日葵色",
    "天鵞絨",
    "紫",
    "鉄黒",
    "洗朱",
    "山吹色",
    "虫襖",
    "薄葡萄",
    "濡羽色",
    "遠州茶",
    "鬱金色",
    "革色",
    "紫紺",
    "黒檀",
    "紅樺色",
    "藤黄",
    "深緑",
    "暗紅色",
    "憲法黒茶",
    "赭",
    "金色",
    "鉄色",
    "桑の実色",
    "暗黒色",
    "pallet"
];
class AlertSettingWindow {
    constructor() {
        _AlertSettingWindow_instances.add(this);
        this.UtilsFunc = new UtilsFunctions();
        this.HtmlFunc = new HtmlFunction();
        this.INDEX = 1;
        this.UNIT_IDS = [];
        this.INTERVAL_IDS = {};
        this.SELECTED_UNIT_ID = "";
        this.PLACEHOLDERS = {};
        this.ALERT_WINDOW = document.getElementById("alertMainWindow");
    }
    init() {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setCommandBtnsEvent).call(this);
    }
    deleteAllUnit() {
        while (this.UNIT_IDS.length !== 1) {
            __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___deleteUnit).call(this);
        }
    }
    makeAlertUnit(OPTIONS) {
        const ALERT_UNIT = document.createElement("div");
        const COLORS = `
                <option value="#006e54">萌葱色  </option>
                <option value="#00a381">花緑青  </option>
                <option value="#00a497">青緑    </option>
                <option value="#38b48b">翡翠色  </option>
                <option value="#5b7e91">舛花色  </option>
                <option value="#6c848d">藍鼠    </option>
                <option value="#6e7955">麹塵    </option>
                <option value="#8d6449">枯茶    </option>
                <option value="#8b968d">豆がら茶</option>
                <option value="#94846a">生壁色  </option>
                <option value="#897858">肥後煤竹</option>
                <option value="#705b67">葡萄鼠  </option>
                <option value="#716246">媚茶    </option>
                <option value="#5a544b">海松茶  </option>
                <option value="#426579">熨斗目花色</option>
                <option value="#deb068">飴色    </option>
                <option value="#d9a62e">櫨染    </option>
                <option value="#d3a243">黄朽葉色</option>
                <option value="#c89932">山吹茶  </option>
                <option value="#b98c46">黄唐茶  </option>
                <option value="#b68d4c">黄橡    </option>
                <option value="#d0af4c">芥子色  </option>
                <option value="#956f29">桑茶    </option>
                <option value="#b79b5b">桑染    </option>
                <option value="#bc763c">土色    </option>
                <option value="#bf794e">駱駝色  </option>
                <option value="#d8a373">伽羅色  </option>
                <option value="#ae7c58">焦香    </option>
                <option value="#824880">茄子紺  </option>
                <option value="#7a4171">蒲葡    </option>
                <option value="#aa4c8f">梅紫    </option>
                <option value="#bc64a4">若紫    </option>
                <option value="#915c8b">二藍    </option>
                <option value="#895b8a">古代紫  </option>
                <option value="#9d5b8b">京紫    </option>
                <option value="#cc7eb1">菖蒲色  </option>
                <option value="#cca6bf">紅藤色  </option>
                <option value="#c4a3bf">浅紫    </option>
                <option value="#a69abd">半色    </option>
                <option value="#9790a4">薄鼠    </option>
                <option value="#80989b">湊鼠    </option>
                <option value="#a6a5c4">藤鼠    </option>
                <option value="#d3ccd6">牡丹鼠  </option>
                <option value="#d3cfd9">暁鼠    </option>
                <option value="#e6cde3">淡紅藤  </option>
                <option value="#e7e7eb">紫水晶  </option>
                <option value="#95859c">鳩羽色  </option>
                <option value="#9e8b8e">鳩羽鼠  </option>
                <option value="#333631">黒緑    </option>
                <option value="#494a41">千歳茶  </option>
                <option value="#5c9291">錆浅葱  </option>
                <option value="#53727d">錆御納戸</option>
                <option value="#2c4f54">高麗納戸</option>
                <option value="#fef4f4">桜色    </option>
                <option value="#fdeff2">薄桜    </option>
                <option value="#e9dfe5">桜鼠    </option>
                <option value="#e4d2d8">鴇鼠    </option>
                <option value="#f6bfbc">虹色    </option>
                <option value="#f5b1aa">珊瑚色  </option>
                <option value="#efab93">宍色    </option>
                <option value="#f5b199">一斤染  </option>
                <option value="#b44c97">紅紫    </option>
                <option value="#f2a0a1">紅梅色  </option>
                <option value="#ee827c">甚三紅  </option>
                <option value="#f09199">桃色    </option>
                <option value="#e198b4">桃花色  </option>
                <option value="#e597b2">薄紅梅  </option>
                <option value="#e5abbe">石竹色  </option>
                <option value="#f4b3c2">鴇色    </option>
                <option value="#e8d3d1">灰桜    </option>
                <option value="#e8d3c7">灰梅    </option>
                <option value="#e09e87">ときがら茶</option>
                <option value="#d69090">退紅    </option>
                <option value="#c97586">長春色  </option>
                <option value="#c37854">土器色  </option>
                <option value="#cd5e3c">樺色    </option>
                <option value="#cb8347">紅鬱金  </option>
                <option value="#cbb994">白橡    </option>
                <option value="#c8c2c6">霞色    </option>
                <option value="#a59564">利休茶  </option>
                <option value="#e8ecef">白花色  </option>
                <option value="#5f414b">紫鳶    </option>
                <option value="#b48a76">梅染    </option>
                <option value="#bf783a">琥珀色  </option>
                <option value="#715c1f">鶯茶    </option>
                <option value="#ebf6f7">藍白    </option>
                <option value="#4f455c">濃鼠    </option>
                <option value="#a86965">蘇芳香  </option>
                <option value="#bb5535">赤茶    </option>
                <option value="#c7b370">木蘭色  </option>
                <option value="#c1e4e9">白藍    </option>
                <option value="#5a5359">藤煤竹  </option>
                <option value="#a25768">浅蘇芳  </option>
                <option value="#bb5520">代赭    </option>
                <option value="#dcd3b2">砂色    </option>
                <option value="#bce2e8">水色    </option>
                <option value="#594255">滅紫    </option>
                <option value="#ec6d71">真朱    </option>
                <option value="#b55233">煉瓦色  </option>
                <option value="#a19361">油色    </option>
                <option value="#a2d7dd">瓶覗    </option>
                <option value="#524748">紅消鼠  </option>
                <option value="#eb6ea5">赤紫    </option>
                <option value="#aa4f37">雀茶    </option>
                <option value="#8f8667">利休色  </option>
                <option value="#abced8">秘色色  </option>
                <option value="#513743">似せ紫  </option>
                <option value="#e95295">躑躅色  </option>
                <option value="#9f563a">団十郎茶</option>
                <option value="#887938">梅幸茶  </option>
                <option value="#a0d8ef">空色    </option>
                <option value="#e6eae3">灰黄緑  </option>
                <option value="#e7609e">牡丹色  </option>
                <option value="#9f563a">柿渋色  </option>
                <option value="#6a5d21">璃寛茶  </option>
                <option value="#89c3eb">勿忘草色</option>
                <option value="#d4dcd6">蕎麦切色</option>
                <option value="#d0576b">今様色  </option>
                <option value="#9a493f">紅鳶    </option>
                <option value="#918754">黄海松茶</option>
                <option value="#84a2d4">青藤色  </option>
                <option value="#d4dcda">薄雲鼠  </option>
                <option value="#c85179">中紅    </option>
                <option value="#98623c">灰茶    </option>
                <option value="#a69425">菜種油  </option>
                <option value="#83ccd2">白群    </option>
                <option value="#d3cbc6">枯野色  </option>
                <option value="#e9546b">薔薇色  </option>
                <option value="#965042">茶色    </option>
                <option value="#ada250">青朽葉  </option>
                <option value="#84b9cb">浅縹    </option>
                <option value="#c8c2be">潤色    </option>
                <option value="#e95464">韓紅    </option>
                <option value="#965036">檜皮色  </option>
                <option value="#938b4b">根岸色  </option>
                <option value="#698aab">薄花色  </option>
                <option value="#b3ada0">利休白茶</option>
                <option value="#c85554">銀朱    </option>
                <option value="#95483f">鳶色    </option>
                <option value="#8c8861">鶸茶    </option>
                <option value="#008899">納戸色  </option>
                <option value="#a99e93">茶鼠    </option>
                <option value="#c53d43">赤紅    </option>
                <option value="#954e2a">柿茶    </option>
                <option value="#a1a46d">柳茶    </option>
                <option value="#00a3af">浅葱色  </option>
                <option value="#a58f86">胡桃染  </option>
                <option value="#e83929">紅緋    </option>
                <option value="#8f2e14">弁柄色  </option>
                <option value="#726d40">海松色  </option>
                <option value="#2a83a2">花浅葱  </option>
                <option value="#928178">江戸鼠  </option>
                <option value="#e60033">赤      </option>
                <option value="#8a3319">赤錆色  </option>
                <option value="#928c36">鶯色    </option>
                <option value="#59b9c6">新橋色  </option>
                <option value="#887f7a">煤色    </option>
                <option value="#e2041b">猩々緋  </option>
                <option value="#8a3b00">褐色    </option>
                <option value="#dccb18">緑黄色  </option>
                <option value="#2ca9e1">天色    </option>
                <option value="#b4866b">丁子茶  </option>
                <option value="#d7003a">紅      </option>
                <option value="#852e19">栗梅    </option>
                <option value="#d7cf3a">鶸色    </option>
                <option value="#38a1db">露草色  </option>
                <option value="#b28c6e">柴染    </option>
                <option value="#c9171e">深緋    </option>
                <option value="#7b4741">紅檜皮  </option>
                <option value="#c5c56a">抹茶色  </option>
                <option value="#0095d9">青      </option>
                <option value="#a16d5d">宗伝唐茶</option>
                <option value="#d3381c">緋色    </option>
                <option value="#773c30">海老茶  </option>
                <option value="#c3d825">若草色  </option>
                <option value="#0094c8">薄藍    </option>
                <option value="#9f6f55">砺茶    </option>
                <option value="#ce5242">赤丹    </option>
                <option value="#783c1d">唐茶    </option>
                <option value="#b8d200">黄緑    </option>
                <option value="#2792c3">縹色    </option>
                <option value="#8c6450">煎茶色  </option>
                <option value="#d9333f">紅赤    </option>
                <option value="#762f07">栗色    </option>
                <option value="#e0ebaf">若芽色  </option>
                <option value="#007bbb">紺碧    </option>
                <option value="#856859">銀煤竹  </option>
                <option value="#b94047">臙脂    </option>
                <option value="#752100">赤銅色  </option>
                <option value="#d8e698">若菜色  </option>
                <option value="#5383c3">薄群青  </option>
                <option value="#765c47">黄枯茶  </option>
                <option value="#ba2636">朱・緋  </option>
                <option value="#6c3524">錆色    </option>
                <option value="#c7dc68">若苗色  </option>
                <option value="#5a79ba">薄花桜  </option>
                <option value="#6f514c">煤竹色  </option>
                <option value="#b7282e">茜色    </option>
                <option value="#683f36">赤褐色  </option>
                <option value="#99ab4e">青丹    </option>
                <option value="#4c6cb3">群青色  </option>
                <option value="#6f4b3e">焦茶    </option>
                <option value="#a73836">紅海老茶</option>
                <option value="#664032">茶褐色  </option>
                <option value="#7b8d42">草色    </option>
                <option value="#3e62ad">杜若色  </option>
                <option value="#544a47">黒橡    </option>
                <option value="#9e3d3f">蘇芳    </option>
                <option value="#6d3c32">栗皮茶  </option>
                <option value="#69821b">苔色    </option>
                <option value="#1e50a2">瑠璃色  </option>
                <option value="#543f32">憲法色  </option>
                <option value="#a22041">真紅    </option>
                <option value="#583822">黒茶    </option>
                <option value="#aacf53">萌黄    </option>
                <option value="#507ea4">薄縹    </option>
                <option value="#554738">涅色    </option>
                <option value="#a22041">濃紅    </option>
                <option value="#6c2c2f">葡萄茶  </option>
                <option value="#b0ca71">苗色    </option>
                <option value="#19448e">瑠璃紺  </option>
                <option value="#433d3c">檳榔子染</option>
                <option value="#f8f4e6">象牙色  </option>
                <option value="#640125">葡萄色  </option>
                <option value="#b9d08b">若葉色  </option>
                <option value="#164a84">紺瑠璃  </option>
                <option value="#432f2f">黒鳶    </option>
                <option value="#ede4cd">練色    </option>
                <option value="#f8b862">萱草色  </option>
                <option value="#839b5c">松葉色  </option>
                <option value="#165e83">藍色    </option>
                <option value="#3f312b">赤墨    </option>
                <option value="#e9e4d4">灰白色  </option>
                <option value="#f6ad49">柑子色  </option>
                <option value="#cee4ae">夏虫色  </option>
                <option value="#274a78">青藍    </option>
                <option value="#302833">黒紅    </option>
                <option value="#ebe1a9">蒸栗色  </option>
                <option value="#f39800">金茶    </option>
                <option value="#82ae46">鶸萌黄  </option>
                <option value="#2a4073">深縹    </option>
                <option value="#ffffff">白      </option>
                <option value="#f2f2b0">女郎花  </option>
                <option value="#f08300">蜜柑色  </option>
                <option value="#a8c97f">柳色    </option>
                <option value="#223a70">紺色    </option>
                <option value="#fffffc">胡粉色  </option>
                <option value="#e4dc8a">枯草色  </option>
                <option value="#ec6d51">鉛丹色  </option>
                <option value="#9ba88d">青白橡  </option>
                <option value="#192f60">紺青    </option>
                <option value="#f7fcfe">卯の花色</option>
                <option value="#f8e58c">淡黄    </option>
                <option value="#ee7948">黄丹    </option>
                <option value="#c8d5bb">柳鼠    </option>
                <option value="#1c305c">留紺    </option>
                <option value="#f8fbf8">白磁    </option>
                <option value="#ddbb99">白茶    </option>
                <option value="#ed6d3d">柿色    </option>
                <option value="#c1d8ac">裏葉柳  </option>
                <option value="#0f2350">濃藍    </option>
                <option value="#fbfaf5">生成り色</option>
                <option value="#d7a98c">赤白橡  </option>
                <option value="#ec6800">黄赤    </option>
                <option value="#a8bf93">山葵色  </option>
                <option value="#17184b">鉄紺    </option>
                <option value="#f3f3f3">乳白色  </option>
                <option value="#f2c9ac">洗柿    </option>
                <option value="#ec6800">人参色  </option>
                <option value="#769164">老竹色  </option>
                <option value="#0d0015">漆黒    </option>
                <option value="#f3f3f2">白練    </option>
                <option value="#fff1cf">鳥の子色</option>
                <option value="#ee7800">橙色    </option>
                <option value="#d6e9ca">白緑    </option>
                <option value="#bbc8e6">淡藤色  </option>
                <option value="#eae5e3">素色    </option>
                <option value="#fddea5">蜂蜜色  </option>
                <option value="#eb6238">照柿    </option>
                <option value="#93ca76">淡萌黄  </option>
                <option value="#bbbcde">藤色    </option>
                <option value="#e5e4e6">白梅鼠  </option>
                <option value="#fce2c4">肌色    </option>
                <option value="#ea5506">赤橙    </option>
                <option value="#93b881">柳染    </option>
                <option value="#8491c3">紅掛空色</option>
                <option value="#dcdddd">白鼠    </option>
                <option value="#fde8d0">薄卵色  </option>
                <option value="#ea5506">金赤    </option>
                <option value="#badcad">薄萌葱  </option>
                <option value="#8491c3">紅碧    </option>
                <option value="#dddcd6">絹鼠    </option>
                <option value="#f9c89b">雄黄    </option>
                <option value="#eb6101">朱色    </option>
                <option value="#97a791">深川鼠  </option>
                <option value="#4d5aaf">紺桔梗  </option>
                <option value="#c0c6c9">灰青    </option>
                <option value="#f7bd8f">洒落柿  </option>
                <option value="#e49e61">小麦色  </option>
                <option value="#98d98e">若緑    </option>
                <option value="#4d5aaf">花色    </option>
                <option value="#afafb0">銀鼠    </option>
                <option value="#f6b894">赤香    </option>
                <option value="#e45e32">丹色    </option>
                <option value="#88cb7f">浅緑    </option>
                <option value="#4a488e">紺藍    </option>
                <option value="#adadad">薄鈍    </option>
                <option value="#f4dda5">砥粉色  </option>
                <option value="#e17b34">黄茶    </option>
                <option value="#69b076">薄緑    </option>
                <option value="#4d4398">紅桔梗  </option>
                <option value="#a3a3a2">薄墨色  </option>
                <option value="#f1bf99">肉色    </option>
                <option value="#dd7a56">肉桂色  </option>
                <option value="#6b7b6e">青鈍    </option>
                <option value="#5654a2">桔梗色  </option>
                <option value="#9ea1a3">錫色    </option>
                <option value="#f1bf99">人色    </option>
                <option value="#db8449">赤朽葉色</option>
                <option value="#bed2c3">青磁鼠  </option>
                <option value="#706caa">藤納戸  </option>
                <option value="#9fa0a0">素鼠    </option>
                <option value="#efcd9a">丁子色  </option>
                <option value="#d66a35">黄櫨染  </option>
                <option value="#93b69c">薄青    </option>
                <option value="#68699b">紅掛花色</option>
                <option value="#949495">鼠色    </option>
                <option value="#efcd9a">香色    </option>
                <option value="#ffd900">蒲公英色</option>
                <option value="#a6c8b2">錆青磁  </option>
                <option value="#867ba9">紫苑色  </option>
                <option value="#888084">源氏鼠  </option>
                <option value="#f0cfa0">薄香    </option>
                <option value="#ffd900">黄色    </option>
                <option value="#47885e">緑青色  </option>
                <option value="#dbd0e6">白藤色  </option>
                <option value="#7d7d7d">灰色    </option>
                <option value="#edd3a1">浅黄    </option>
                <option value="#ffea00">中黄    </option>
                <option value="#316745">千歳緑  </option>
                <option value="#a59aca">藤紫    </option>
                <option value="#7b7c7d">鉛色    </option>
                <option value="#e0c38c">枯色    </option>
                <option value="#ffec47">菜の花色</option>
                <option value="#68be8d">若竹色  </option>
                <option value="#7058a3">菫色    </option>
                <option value="#727171">鈍色    </option>
                <option value="#f3bf88">淡香    </option>
                <option value="#fef263">黄檗色  </option>
                <option value="#3eb370">緑      </option>
                <option value="#674598">青紫    </option>
                <option value="#595857">墨      </option>
                <option value="#f7b977">杏色    </option>
                <option value="#fcd575">卵色    </option>
                <option value="#007b43">常磐色  </option>
                <option value="#595455">丼鼠    </option>
                <option value="#f19072">東雲色  </option>
                <option value="#fbd26b">花葉色  </option>
                <option value="#bed3ca">千草鼠  </option>
                <option value="#9079ad">竜胆色  </option>
                <option value="#524e4d">消炭色  </option>
                <option value="#f19072">曙色    </option>
                <option value="#f5e56b">刈安色  </option>
                <option value="#92b5a9">千草色  </option>
                <option value="#745399">江戸紫  </option>
                <option value="#474a4d">藍墨茶  </option>
                <option value="#ee836f">珊瑚朱色</option>
                <option value="#eec362">玉蜀黍色</option>
                <option value="#7ebea5">青磁色  </option>
                <option value="#65318e">本紫    </option>
                <option value="#383c3c">羊羹色  </option>
                <option value="#eb9b6f">深支子  </option>
                <option value="#ebd842">金糸雀色</option>
                <option value="#7ebeab">青竹色  </option>
                <option value="#2b2b2b">蝋色    </option>
                <option value="#e0815e">纁      </option>
                <option value="#ffdb4f">黄支子色</option>
                <option value="#028760">常磐緑  </option>
                <option value="#493759">深紫    </option>
                <option value="#2b2b2b">黒      </option>
                <option value="#df7163">浅緋    </option>
                <option value="#fbca4d">支子色  </option>
                <option value="#3b7960">木賊色  </option>
                <option value="#2e2930">紫黒    </option>
                <option value="#180614">烏羽色  </option>
                <option value="#d57c6b">真赭    </option>
                <option value="#fcc800">向日葵色</option>
                <option value="#2f5d50">天鵞絨  </option>
                <option value="#884898">紫      </option>
                <option value="#281a14">鉄黒    </option>
                <option value="#d0826c">洗朱    </option>
                <option value="#f8b500">山吹色  </option>
                <option value="#3a5b52">虫襖    </option>
                <option value="#c0a2c7">薄葡萄  </option>
                <option value="#000b00">濡羽色  </option>
                <option value="#ca8269">遠州茶  </option>
                <option value="#fabf14">鬱金色  </option>
                <option value="#475950">革色    </option>
                <option value="#460e44">紫紺    </option>
                <option value="#250d00">黒檀    </option>
                <option value="#bb5548">紅樺色  </option>
                <option value="#f7c114">藤黄    </option>
                <option value="#00552e">深緑    </option>
                <option value="#74325c">暗紅色  </option>
                <option value="#241a08">憲法黒茶</option>
                <option value="#ab6953">赭      </option>
                <option value="#e6b422">金色    </option>
                <option value="#005243">鉄色    </option>
                <option value="#55295b">桑の実色</option>
                <option value="#16160e">暗黒色  </option>
                <option value="pallet" >パレットの色</option>
        `;
        const ADDED_TIME = new Date().toISOString();
        ALERT_UNIT.className = "alert-unit";
        ALERT_UNIT.id = `alertUnit${ADDED_TIME}`;
        ALERT_UNIT.innerHTML = `
             
                    <span    class="alert-unit__title"         id="alertTitle${ADDED_TIME}"                           >Alert${this.INDEX}</span>
                    <input   class="alert-unit__input-term"    id="alertTerm${ADDED_TIME}"                            >
                    <select  class="alert-unit__time-combobox" id="alertTimeCombobox${ADDED_TIME}">
                        <option value="month">ヵ月</option>
                        <option value="week" >週間</option>
                        <option value="day"  >日  </option>
                        <option value="hour" >時間</option>
                    </select>
                    <span    class="alert-unit__span-before"                                                                            >前</span>
                    <select  class="alert-unit__color-combobox" id="alertColorCombobox${ADDED_TIME}"                  >
                        ${COLORS}
                    </select>           
                    
                    <img     class="alert-unit__jp-img"         id="btnJpColor${ADDED_TIME}"  src="btn-jp-color.png"  >
                    <img     class="alert-unit__pallet"         id="btnPallet${ADDED_TIME}"   src="btn-pallet.png"    >
                    <input   class="alert-unit__color-pallet"   id="colorPallet${ADDED_TIME}" type = "color"          > 
                    <button  class="alert-unit__btn-flash"      id="btnFlash${ADDED_TIME}"                            >点滅</button>
                    <div     class="alert-unit__color-sample"   id="alertColorSample${ADDED_TIME}"                    >色見本</div>
                    <button  class="alert-unit__color-combobox-upbtn"   id="btnColorComboUp${ADDED_TIME}">↑</button>
                    <button  class="alert-unit__color-combobox-downbtn" id="btnColorComboDown${ADDED_TIME}">↓</button>
                    

                    <span    class="alert-unit__color-and"              id="spanAnd${ADDED_TIME}"                     >と</span>



                    <select  class="alert-unit__color-combobox alert-unit__color-combobox--flash" id="alertColorCombobox${ADDED_TIME}Flash"                  >
                        ${COLORS}
                    </select>
                    
                    <img     class="alert-unit__jp-img alert-unit__jp-img--flash"               id="btnJpColor${ADDED_TIME}Flash"  src="btn-jp-color.png"  >
                    <img     class="alert-unit__pallet alert-unit__pallet--flash"               id="btnPallet${ADDED_TIME}Flash"   src="btn-pallet.png"    >
                    <input   class="alert-unit__color-pallet alert-unit__color-pallet--flash"   id="colorPallet${ADDED_TIME}Flash" type = "color"          > 
                    
                    <button  class="alert-unit__color-combobox-upbtn alert-unit__color-combobox-upbtn--flash"     id="btnColorComboUp${ADDED_TIME}Flash">↑</button>
                    <button  class="alert-unit__color-combobox-downbtn alert-unit__color-combobox-downbtn--flash" id="btnColorComboDown${ADDED_TIME}Flash">↓</button>
        `;
        this.ALERT_WINDOW.appendChild(ALERT_UNIT);
        const ELEMENT = __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___declareAndCreateElements).call(this, ADDED_TIME);
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSampleEvent).call(this, ELEMENT);
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setFlashEvent).call(this, ELEMENT);
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setValidation).call(this, ELEMENT, `${ADDED_TIME}`);
        ELEMENT.colorPalletSelector.value = ELEMENT.colorComboboxSelector.value;
        ELEMENT.flashColorPalletSelector.value = ELEMENT.flashColorComboboxSelector.value;
        this.UNIT_IDS.push(`${ADDED_TIME}`);
        if (this.SELECTED_UNIT_ID) {
            __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___resetOutline).call(this);
        }
        this.SELECTED_UNIT_ID = `${ADDED_TIME}`;
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___writeOutline).call(this);
        if (OPTIONS) {
            __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setValue).call(this, ELEMENT, `${ADDED_TIME}`, OPTIONS);
        }
        this.INDEX += 1;
    }
    extractData() {
        if (__classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___isFilledContents).call(this)) {
            const ALERT_OBJECTS = {};
            var cnt = 1;
            var is_flash = false;
            for (let id of this.UNIT_IDS) {
                const ELEMENT = __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___declareAndCreateElements).call(this, id);
                if (ELEMENT.spanAnd.style.visibility === "none" || ELEMENT.spanAnd.style.visibility === "") {
                    is_flash = false;
                }
                else {
                    is_flash = true;
                }
                const COLOR1_OPTION = ELEMENT.colorComboboxSelector.options[ELEMENT.colorComboboxSelector.selectedIndex];
                const COLOR2_OPTION = ELEMENT.flashColorComboboxSelector.options[ELEMENT.flashColorComboboxSelector.selectedIndex];
                ALERT_OBJECTS[`Alert${cnt}`] =
                    {
                        title: ELEMENT.title.textContent,
                        time: ELEMENT.inputTime.value,
                        time_unit: ELEMENT.timeUnit.value,
                        color1: { value: ELEMENT.colorComboboxSelector.value, name: COLOR1_OPTION.text },
                        color2: { value: ELEMENT.flashColorComboboxSelector.value, name: COLOR2_OPTION.text },
                        isFlash: is_flash
                    };
                cnt += 1;
            }
            return ALERT_OBJECTS;
        }
        else {
            return;
        }
    }
}
_AlertSettingWindow_instances = new WeakSet(), _AlertSettingWindow___setCommandBtnsEvent = function _AlertSettingWindow___setCommandBtnsEvent() {
    const ADD_BTN = document.getElementById(`btnAdd`);
    ADD_BTN.addEventListener("click", () => {
        this.makeAlertUnit();
    });
    const SELECT_UNIT_UP_BTN = document.getElementById(`btnUp`);
    SELECT_UNIT_UP_BTN.addEventListener("click", () => {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___selectUnit).call(this, "up");
    });
    const SELECT_UNIT_DOWN_BTN = document.getElementById(`btnDown`);
    SELECT_UNIT_DOWN_BTN.addEventListener("click", () => {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___selectUnit).call(this, "down");
    });
    const DELETE_BTN = document.getElementById(`btnDelete`);
    DELETE_BTN.addEventListener("click", () => {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___deleteUnit).call(this);
    });
    const BASIC_COLOR_BTN = document.getElementById(`btnBasic`);
    BASIC_COLOR_BTN.addEventListener("click", () => {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setBasicAlerts).call(this);
    });
    const USER_COLOR_BTN = document.getElementById(`btnUserColor`);
    USER_COLOR_BTN.addEventListener("click", () => {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setMySettingAlerts).call(this);
    });
}, _AlertSettingWindow___selectUnit = function _AlertSettingWindow___selectUnit(OPTION) {
    var selectedUnitId__Index = this.UNIT_IDS.indexOf(this.SELECTED_UNIT_ID);
    __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___resetOutline).call(this);
    if (OPTION === "up") {
        selectedUnitId__Index -= 1;
        if (selectedUnitId__Index < 0) {
            selectedUnitId__Index = 0;
        }
    }
    else if (OPTION === "down") {
        selectedUnitId__Index += 1;
        if (selectedUnitId__Index > this.UNIT_IDS.length - 1) {
            selectedUnitId__Index = this.UNIT_IDS.length - 1;
        }
    }
    else {
        const STACK = new Error();
        alert(`error:[optionにないものが渡されました。option=${OPTION}] ${STACK}`);
        return;
    }
    this.SELECTED_UNIT_ID = this.UNIT_IDS[selectedUnitId__Index];
    __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___writeOutline).call(this);
}, _AlertSettingWindow___deleteUnit = function _AlertSettingWindow___deleteUnit() {
    const LENGTH = this.UNIT_IDS.length;
    if (LENGTH === 1) {
        alert(`削除するものがないため、削除を拒否しました。`);
    }
    else {
        const ALERT_UNIT = document.getElementById(`alertUnit${this.SELECTED_UNIT_ID}`);
        const SELECTED_INDEX = this.UNIT_IDS.indexOf(this.SELECTED_UNIT_ID);
        ALERT_UNIT.remove();
        const NEW_LIST = this.UtilsFunc.deleteListElem(this.UNIT_IDS, this.SELECTED_UNIT_ID);
        if (typeof (NEW_LIST) === "object") {
            this.UNIT_IDS = NEW_LIST;
            __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___renameAlertUnit).call(this);
            __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___reassignThisIndex).call(this, SELECTED_INDEX);
            __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___writeOutline).call(this);
        }
    }
}, _AlertSettingWindow___renameAlertUnit = function _AlertSettingWindow___renameAlertUnit() {
    var index = 0;
    for (let item of this.UNIT_IDS) {
        index += 1;
        let title = document.getElementById(`alertTitle${item}`);
        title.textContent = `Alert${index}`;
    }
}, _AlertSettingWindow___reassignThisIndex = function _AlertSettingWindow___reassignThisIndex(SELECTED_INDEX) {
    const LENGTH = this.UNIT_IDS.length;
    this.INDEX -= 3;
    if (this.INDEX < 2) {
        this.INDEX = 2;
    }
    var newSelectIndex;
    if (SELECTED_INDEX === LENGTH) {
        newSelectIndex = SELECTED_INDEX -= 1;
    }
    else {
        newSelectIndex = SELECTED_INDEX;
    }
    this.SELECTED_UNIT_ID = this.UNIT_IDS[newSelectIndex];
}, _AlertSettingWindow___setBasicAlerts = function _AlertSettingWindow___setBasicAlerts() {
    this.deleteAllUnit();
    const OPTION1 = {
        TIME: 2,
        TIME_UNIT: "week",
        COLOR1: "紫水晶",
        PALLET_COLOR1: "",
        IS_FLASH: false
    };
    __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setValueToSpecifyAlertUnit).call(this, this.UNIT_IDS[0], OPTION1);
    const OPTIONS = [];
    OPTIONS.push({
        TIME: 1,
        TIME_UNIT: "week",
        COLOR1: "勿忘草色",
        PALLET_COLOR1: "",
        IS_FLASH: false
    });
    OPTIONS.push({
        TIME: 5,
        TIME_UNIT: "day",
        COLOR1: "若竹色",
        PALLET_COLOR1: "",
        IS_FLASH: false
    });
    OPTIONS.push({
        TIME: 3,
        TIME_UNIT: "day",
        COLOR1: "千歳緑",
        PALLET_COLOR1: "",
        IS_FLASH: false
    });
    OPTIONS.push({
        TIME: 2,
        TIME_UNIT: "day",
        COLOR1: "向日葵色",
        PALLET_COLOR1: "",
        IS_FLASH: false
    });
    OPTIONS.push({
        TIME: 1,
        TIME_UNIT: "day",
        COLOR1: "柑子色",
        PALLET_COLOR1: "",
        COLOR2: "菜の花色",
        PALLET_COLOR2: "",
        IS_FLASH: true
    });
    OPTIONS.push({
        TIME: 10,
        TIME_UNIT: "hour",
        COLOR1: "紫水晶",
        PALLET_COLOR1: "",
        COLOR2: "菜の花色",
        PALLET_COLOR2: "金赤",
        IS_FLASH: true
    });
    for (let i = 0; i < OPTIONS.length; i++) {
        this.makeAlertUnit(OPTIONS[i]);
    }
}, _AlertSettingWindow___setValueToSpecifyAlertUnit = function _AlertSettingWindow___setValueToSpecifyAlertUnit(ID, OPTION) {
    const ELEMENT = __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___declareAndCreateElements).call(this, ID);
    __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setValue).call(this, ELEMENT, ID, OPTION);
}, _AlertSettingWindow___setMySettingAlerts = function _AlertSettingWindow___setMySettingAlerts() {
}, _AlertSettingWindow___declareAndCreateElements = function _AlertSettingWindow___declareAndCreateElements(ID) {
    const INPUT_TIME = document.getElementById(`alertTerm${ID}`);
    const TIME_UNIT = document.getElementById(`alertTimeCombobox${ID}`);
    const COLOR_SAMPLE_ELEMENT = document.getElementById(`alertColorSample${ID}`);
    const COLOR_COMBOBOX_SELECTOR = document.getElementById(`alertColorCombobox${ID}`);
    const COLOR_PALLET_SELECTOR = document.getElementById(`colorPallet${ID}`);
    const COMBOBOX_UPBTN = document.getElementById(`btnColorComboUp${ID}`);
    const COMBOBOX_DOWNBTN = document.getElementById(`btnColorComboDown${ID}`);
    const FLASH_COLOR_COMBOBOX_SELECTOR = document.getElementById(`alertColorCombobox${ID}Flash`);
    const FLASH_COLOR_PALLET_SELECTOR = document.getElementById(`colorPallet${ID}Flash`);
    const FLASH_COMBOBOX_UPBTN = document.getElementById(`btnColorComboUp${ID}Flash`);
    const FLASH_COMBOBOX_DOWNBTN = document.getElementById(`btnColorComboDown${ID}Flash`);
    const FLASH_BTN = document.getElementById(`btnFlash${ID}`);
    const SPAN_AND = document.getElementById(`spanAnd${ID}`);
    const TITLE = document.getElementById(`alertTitle${ID}`);
    const ELEMENT = {
        inputTime: INPUT_TIME,
        timeUnit: TIME_UNIT,
        colorSampleElement: COLOR_SAMPLE_ELEMENT,
        colorComboboxSelector: COLOR_COMBOBOX_SELECTOR,
        colorPalletSelector: COLOR_PALLET_SELECTOR,
        comboboxUpbtn: COMBOBOX_UPBTN,
        comboboxDownbtn: COMBOBOX_DOWNBTN,
        flashColorComboboxSelector: FLASH_COLOR_COMBOBOX_SELECTOR,
        flashColorPalletSelector: FLASH_COLOR_PALLET_SELECTOR,
        flashComboboxUpbtn: FLASH_COMBOBOX_UPBTN,
        flashComboboxDownbtn: FLASH_COMBOBOX_DOWNBTN,
        flashBtn: FLASH_BTN,
        spanAnd: SPAN_AND,
        id: ID,
        title: TITLE
    };
    return ELEMENT;
}, _AlertSettingWindow___setColorSampleEvent = function _AlertSettingWindow___setColorSampleEvent(ELEMENT) {
    ELEMENT.colorComboboxSelector.addEventListener("change", () => {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.colorComboboxSelector.value);
        ELEMENT.colorPalletSelector.value = ELEMENT.colorComboboxSelector.value;
    });
    ELEMENT.flashColorComboboxSelector.addEventListener("change", () => {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.flashColorComboboxSelector.value);
        ELEMENT.flashColorPalletSelector.value = ELEMENT.flashColorComboboxSelector.value;
    });
    ELEMENT.comboboxUpbtn.addEventListener("click", () => {
        var selectIndex = ELEMENT.colorComboboxSelector.selectedIndex;
        selectIndex -= 1;
        if (selectIndex < 0) {
            selectIndex = 0;
        }
        ELEMENT.colorComboboxSelector.selectedIndex = selectIndex;
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.colorComboboxSelector.value);
        ELEMENT.colorPalletSelector.value = ELEMENT.colorComboboxSelector.value;
    });
    ELEMENT.flashComboboxUpbtn.addEventListener("click", () => {
        var selectIndex = ELEMENT.flashColorComboboxSelector.selectedIndex;
        selectIndex -= 1;
        if (selectIndex < 0) {
            selectIndex = 0;
        }
        ELEMENT.flashColorComboboxSelector.selectedIndex = selectIndex;
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.flashColorComboboxSelector.value);
        ELEMENT.flashColorPalletSelector.value = ELEMENT.flashColorComboboxSelector.value;
    });
    ELEMENT.comboboxDownbtn.addEventListener("click", () => {
        var selectIndex = ELEMENT.colorComboboxSelector.selectedIndex;
        const LENGTH = ELEMENT.colorComboboxSelector.options.length;
        selectIndex += 1;
        if (selectIndex >= LENGTH - 1) {
            selectIndex = LENGTH - 2;
        }
        ELEMENT.colorComboboxSelector.selectedIndex = selectIndex;
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.colorComboboxSelector.value);
        ELEMENT.colorPalletSelector.value = ELEMENT.colorComboboxSelector.value;
    });
    ELEMENT.flashComboboxDownbtn.addEventListener("click", () => {
        var selectIndex = ELEMENT.flashColorComboboxSelector.selectedIndex;
        const LENGTH = ELEMENT.flashColorComboboxSelector.options.length;
        selectIndex += 1;
        if (selectIndex >= LENGTH - 1) {
            selectIndex = LENGTH - 2;
        }
        ELEMENT.flashColorComboboxSelector.selectedIndex = selectIndex;
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.flashColorComboboxSelector.value);
        ELEMENT.flashColorPalletSelector.value = ELEMENT.flashColorComboboxSelector.value;
    });
    ELEMENT.colorPalletSelector.addEventListener("input", () => {
        ELEMENT.colorSampleElement.style.backgroundColor = ELEMENT.colorPalletSelector.value;
        ELEMENT.colorSampleElement.style.color = this.UtilsFunc.chooseSuitableFontColor(ELEMENT.colorPalletSelector.value);
        ELEMENT.colorComboboxSelector.value = "pallet";
    });
    ELEMENT.flashColorPalletSelector.addEventListener("input", () => {
        ELEMENT.colorSampleElement.style.backgroundColor = ELEMENT.flashColorPalletSelector.value;
        ELEMENT.colorSampleElement.style.color = this.UtilsFunc.chooseSuitableFontColor(ELEMENT.flashColorPalletSelector.value);
        ELEMENT.flashColorComboboxSelector.value = "pallet";
    });
}, _AlertSettingWindow___setColorSample = function _AlertSettingWindow___setColorSample(ELEMENT, BACKGROUND_COLOR) {
    ELEMENT.colorSampleElement.style.backgroundColor = BACKGROUND_COLOR;
    ELEMENT.colorSampleElement.style.color = this.UtilsFunc.chooseSuitableFontColor(BACKGROUND_COLOR);
}, _AlertSettingWindow___setFlashEvent = function _AlertSettingWindow___setFlashEvent(ELEMENT) {
    ELEMENT.flashBtn.addEventListener("click", () => {
        const IS_VISIBLE = ELEMENT.spanAnd.style.visibility === "visible" ? true : false;
        if (IS_VISIBLE) {
            __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___hiddenFlashElements).call(this, ELEMENT);
        }
        else {
            __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___showFlashElements).call(this, ELEMENT);
        }
    });
}, _AlertSettingWindow___hiddenFlashElements = function _AlertSettingWindow___hiddenFlashElements(ELEMENT) {
    clearInterval(this.INTERVAL_IDS[`${ELEMENT.id}`]);
    __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.colorPalletSelector.value);
    ELEMENT.spanAnd.style.visibility = "hidden";
    ELEMENT.flashColorComboboxSelector.style.visibility = "hidden";
    ELEMENT.flashColorPalletSelector.style.visibility = "hidden";
    ELEMENT.flashComboboxDownbtn.style.visibility = "hidden";
    ELEMENT.flashComboboxUpbtn.style.visibility = "hidden";
    ELEMENT.flashBtn.style.backgroundColor = "rgb(255, 255, 255)";
    ELEMENT.flashBtn.style.color = "rgb(0, 0, 0)";
    ELEMENT.flashBtn.style.borderTop = "5px inset #ffffff";
    ELEMENT.flashBtn.style.borderLeft = "5px inset #ffffff";
    ELEMENT.flashBtn.style.borderRight = "5px inset #ececec";
    ELEMENT.flashBtn.style.borderBottom = "5px inset #dfdddd";
}, _AlertSettingWindow___showFlashElements = function _AlertSettingWindow___showFlashElements(ELEMENT) {
    const FLASH_INTERVAL_MS = 700;
    const INTERVAL_ID = setInterval(() => __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___flashEvent).call(this, ELEMENT), FLASH_INTERVAL_MS);
    this.INTERVAL_IDS[`${ELEMENT.id}`] = INTERVAL_ID;
    ELEMENT.spanAnd.style.visibility = "visible";
    ELEMENT.flashColorComboboxSelector.style.visibility = "visible";
    ELEMENT.flashColorPalletSelector.style.visibility = "visible";
    ELEMENT.flashComboboxDownbtn.style.visibility = "visible";
    ELEMENT.flashComboboxUpbtn.style.visibility = "visible";
    ELEMENT.flashBtn.style.backgroundColor = "rgb(87, 71, 71)";
    ELEMENT.flashBtn.style.color = "black";
    ELEMENT.flashBtn.style.borderTop = "5px groove #ffffff";
    ELEMENT.flashBtn.style.borderLeft = "5px groove #ffffff";
    ELEMENT.flashBtn.style.borderRight = "5px groove #ffffff";
    ELEMENT.flashBtn.style.borderBottom = "5px groove #ffffff";
}, _AlertSettingWindow___flashEvent = function _AlertSettingWindow___flashEvent(ELEMENT) {
    const CURRENT_COLOR = ELEMENT.colorSampleElement.style.backgroundColor;
    const BASIC_COLOR_CODE = this.UtilsFunc.changeColorCodeToRGB(ELEMENT.colorPalletSelector.value);
    if (CURRENT_COLOR === BASIC_COLOR_CODE) {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.flashColorPalletSelector.value);
    }
    else {
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, ELEMENT.colorPalletSelector.value);
    }
}, _AlertSettingWindow___setValidation = function _AlertSettingWindow___setValidation(ELEMENT, ID) {
    this.HtmlFunc.setValidation({
        CONTENT_ELEMENTS: [ELEMENT.inputTime],
        VALIDATE_OPTION: ["onlySelectedNumberRange", "zeroPadding"],
        MIN_NUMBER: 1,
        MAX_NUMBER: 99
    });
    const NEW_PLACEHOLDER = new HtmlFunction();
    NEW_PLACEHOLDER.setPlaceHolder(ELEMENT.inputTime, "-");
    this.PLACEHOLDERS = { [ID]: NEW_PLACEHOLDER };
}, _AlertSettingWindow___resetOutline = function _AlertSettingWindow___resetOutline() {
    var selectedUnitId__Index = this.UNIT_IDS.indexOf(this.SELECTED_UNIT_ID);
    if (selectedUnitId__Index === -1) {
        const STACK = new Error();
        alert(`id : ${this.SELECTED_UNIT_ID}はリストに存在しません。\nError:${STACK}`);
        return;
    }
    else {
        const oldTargetAlertUnit = document.getElementById(`alertUnit${this.UNIT_IDS[selectedUnitId__Index]}`);
        oldTargetAlertUnit.style.outline = "1px inset #000000";
        oldTargetAlertUnit.style.outline = "-0.5px";
    }
}, _AlertSettingWindow___writeOutline = function _AlertSettingWindow___writeOutline() {
    var selectedUnitId__Index = this.UNIT_IDS.indexOf(this.SELECTED_UNIT_ID);
    if (selectedUnitId__Index === -1) {
        const STACK = new Error();
        alert(`id : ${this.SELECTED_UNIT_ID}はリストに存在しません。\nError:${STACK}`);
        return;
    }
    else {
        const newTargetAlertUnit = document.getElementById(`alertUnit${this.UNIT_IDS[selectedUnitId__Index]}`);
        newTargetAlertUnit.style.outline = "5px ridge #b3ff00";
        newTargetAlertUnit.style.outlineOffset = "-6px";
    }
}, _AlertSettingWindow___setValue = function _AlertSettingWindow___setValue(ELEMENT, ID, OPTION) {
    ELEMENT.inputTime.value = OPTION.TIME.toString();
    ELEMENT.timeUnit.value = OPTION.TIME_UNIT;
    ELEMENT.colorComboboxSelector.value = OPTION.COLOR1;
    if (OPTION.COLOR1 === "pallet") {
        ELEMENT.colorComboboxSelector.value = OPTION.COLOR1;
        ELEMENT.colorPalletSelector.value = this.UtilsFunc.changeRGBtoColorCode(OPTION.PALLET_COLOR1);
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, this.UtilsFunc.changeRGBtoColorCode(OPTION.PALLET_COLOR1));
    }
    else {
        const DICTIONARY = __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___createDictOfColor).call(this);
        ELEMENT.colorComboboxSelector.value = DICTIONARY[`${OPTION.COLOR1}`];
        ELEMENT.colorPalletSelector.value = DICTIONARY[`${OPTION.COLOR1}`];
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___setColorSample).call(this, ELEMENT, DICTIONARY[`${OPTION.COLOR1}`]);
    }
    if (OPTION.IS_FLASH) {
        if (OPTION.COLOR2 === "pallet") {
            ELEMENT.flashColorComboboxSelector.value = OPTION.COLOR2;
            ELEMENT.flashColorPalletSelector.value = this.UtilsFunc.changeRGBtoColorCode(OPTION.PALLET_COLOR2);
        }
        else {
            const DICTIONARY = __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___createDictOfColor).call(this);
            ELEMENT.flashColorComboboxSelector.value = DICTIONARY[`${OPTION.COLOR2}`];
            ELEMENT.flashColorPalletSelector.value = DICTIONARY[`${OPTION.COLOR2}`];
        }
        __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___showFlashElements).call(this, ELEMENT);
    }
    const PLACEHOLDER = this.PLACEHOLDERS[ID];
    try {
        PLACEHOLDER.deletePlaceholderEvent();
    }
    catch (error) {
        console.log("削除するイベントがありませんでした。");
    }
}, _AlertSettingWindow___createDictOfColor = function _AlertSettingWindow___createDictOfColor() {
    const DICTIONARY = {
        "萌葱色": "#006e54",
        "花緑青": "#00a381",
        "青緑": "#00a497",
        "翡翠色": "#38b48b",
        "舛花色": "#5b7e91",
        "藍鼠": "#6c848d",
        "麹塵": "#6e7955",
        "枯茶": "#8d6449",
        "豆がら茶": "#8b968d",
        "生壁色": "#94846a",
        "肥後煤竹": "#897858",
        "葡萄鼠": "#705b67",
        "媚茶": "#716246",
        "海松茶": "#5a544b",
        "熨斗目花色": "#426579",
        "飴色": "#deb068",
        "櫨染": "#d9a62e",
        "黄朽葉色": "#d3a243",
        "山吹茶": "#c89932",
        "黄唐茶": "#b98c46",
        "黄橡": "#b68d4c",
        "芥子色": "#d0af4c",
        "桑茶": "#956f29",
        "桑染": "#b79b5b",
        "土色": "#bc763c",
        "駱駝色": "#bf794e",
        "伽羅色": "#d8a373",
        "焦香": "#ae7c58",
        "茄子紺": "#824880",
        "蒲葡": "#7a4171",
        "梅紫": "#aa4c8f",
        "若紫": "#bc64a4",
        "二藍": "#915c8b",
        "古代紫": "#895b8a",
        "京紫": "#9d5b8b",
        "菖蒲色": "#cc7eb1",
        "紅藤色": "#cca6bf",
        "浅紫": "#c4a3bf",
        "半色": "#a69abd",
        "薄鼠": "#9790a4",
        "湊鼠": "#80989b",
        "藤鼠": "#a6a5c4",
        "牡丹鼠": "#d3ccd6",
        "暁鼠": "#d3cfd9",
        "淡紅藤": "#e6cde3",
        "紫水晶": "#e7e7eb",
        "鳩羽色": "#95859c",
        "鳩羽鼠": "#9e8b8e",
        "黒緑": "#333631",
        "千歳茶": "#494a41",
        "錆浅葱": "#5c9291",
        "錆御納戸": "#53727d",
        "高麗納戸": "#2c4f54",
        "桜色": "#fef4f4",
        "薄桜": "#fdeff2",
        "桜鼠": "#e9dfe5",
        "鴇鼠": "#e4d2d8",
        "虹色": "#f6bfbc",
        "珊瑚色": "#f5b1aa",
        "宍色": "#efab93",
        "一斤染": "#f5b199",
        "紅紫": "#b44c97",
        "紅梅色": "#f2a0a1",
        "甚三紅": "#ee827c",
        "桃色": "#f09199",
        "桃花色": "#e198b4",
        "薄紅梅": "#e597b2",
        "石竹色": "#e5abbe",
        "鴇色": "#f4b3c2",
        "灰桜": "#e8d3d1",
        "灰梅": "#e8d3c7",
        "ときがら茶": "#e09e87",
        "退紅": "#d69090",
        "長春色": "#c97586",
        "土器色": "#c37854",
        "樺色": "#cd5e3c",
        "紅鬱金": "#cb8347",
        "白橡": "#cbb994",
        "霞色": "#c8c2c6",
        "利休茶": "#a59564",
        "白花色": "#e8ecef",
        "紫鳶": "#5f414b",
        "梅染": "#b48a76",
        "琥珀色": "#bf783a",
        "鶯茶": "#715c1f",
        "藍白": "#ebf6f7",
        "濃鼠": "#4f455c",
        "蘇芳香": "#a86965",
        "赤茶": "#bb5535",
        "木蘭色": "#c7b370",
        "白藍": "#c1e4e9",
        "藤煤竹": "#5a5359",
        "浅蘇芳": "#a25768",
        "代赭": "#bb5520",
        "砂色": "#dcd3b2",
        "水色": "#bce2e8",
        "滅紫": "#594255",
        "真朱": "#ec6d71",
        "煉瓦色": "#b55233",
        "油色": "#a19361",
        "瓶覗": "#a2d7dd",
        "紅消鼠": "#524748",
        "赤紫": "#eb6ea5",
        "雀茶": "#aa4f37",
        "利休色": "#8f8667",
        "秘色色": "#abced8",
        "似せ紫": "#513743",
        "躑躅色": "#e95295",
        "団十郎茶": "#9f563a",
        "梅幸茶": "#887938",
        "空色": "#a0d8ef",
        "灰黄緑": "#e6eae3",
        "牡丹色": "#e7609e",
        "柿渋色": "#9f563a",
        "璃寛茶": "#6a5d21",
        "勿忘草色": "#89c3eb",
        "蕎麦切色": "#d4dcd6",
        "今様色": "#d0576b",
        "紅鳶": "#9a493f",
        "黄海松茶": "#918754",
        "青藤色": "#84a2d4",
        "薄雲鼠": "#d4dcda",
        "中紅": "#c85179",
        "灰茶": "#98623c",
        "菜種油": "#a69425",
        "白群": "#83ccd2",
        "枯野色": "#d3cbc6",
        "薔薇色": "#e9546b",
        "茶色": "#965042",
        "青朽葉": "#ada250",
        "浅縹": "#84b9cb",
        "潤色": "#c8c2be",
        "韓紅": "#e95464",
        "檜皮色": "#965036",
        "根岸色": "#938b4b",
        "薄花色": "#698aab",
        "利休白茶": "#b3ada0",
        "銀朱": "#c85554",
        "鳶色": "#95483f",
        "鶸茶": "#8c8861",
        "納戸色": "#008899",
        "茶鼠": "#a99e93",
        "赤紅": "#c53d43",
        "柿茶": "#954e2a",
        "柳茶": "#a1a46d",
        "浅葱色": "#00a3af",
        "胡桃染": "#a58f86",
        "紅緋": "#e83929",
        "弁柄色": "#8f2e14",
        "海松色": "#726d40",
        "花浅葱": "#2a83a2",
        "江戸鼠": "#928178",
        "赤": "#e60033",
        "赤錆色": "#8a3319",
        "鶯色": "#928c36",
        "新橋色": "#59b9c6",
        "煤色": "#887f7a",
        "猩々緋": "#e2041b",
        "褐色": "#8a3b00",
        "緑黄色": "#dccb18",
        "天色": "#2ca9e1",
        "丁子茶": "#b4866b",
        "紅": "#d7003a",
        "栗梅": "#852e19",
        "鶸色": "#d7cf3a",
        "露草色": "#38a1db",
        "柴染": "#b28c6e",
        "深緋": "#c9171e",
        "紅檜皮": "#7b4741",
        "抹茶色": "#c5c56a",
        "青": "#0095d9",
        "宗伝唐茶": "#a16d5d",
        "緋色": "#d3381c",
        "海老茶": "#773c30",
        "若草色": "#c3d825",
        "薄藍": "#0094c8",
        "砺茶": "#9f6f55",
        "赤丹": "#ce5242",
        "唐茶": "#783c1d",
        "黄緑": "#b8d200",
        "縹色": "#2792c3",
        "煎茶色": "#8c6450",
        "紅赤": "#d9333f",
        "栗色": "#762f07",
        "若芽色": "#e0ebaf",
        "紺碧": "#007bbb",
        "銀煤竹": "#856859",
        "臙脂": "#b94047",
        "赤銅色": "#752100",
        "若菜色": "#d8e698",
        "薄群青": "#5383c3",
        "黄枯茶": "#765c47",
        "朱・緋": "#ba2636",
        "錆色": "#6c3524",
        "若苗色": "#c7dc68",
        "薄花桜": "#5a79ba",
        "煤竹色": "#6f514c",
        "茜色": "#b7282e",
        "赤褐色": "#683f36",
        "青丹": "#99ab4e",
        "群青色": "#4c6cb3",
        "焦茶": "#6f4b3e",
        "紅海老茶": "#a73836",
        "茶褐色": "#664032",
        "草色": "#7b8d42",
        "杜若色": "#3e62ad",
        "黒橡": "#544a47",
        "蘇芳": "#9e3d3f",
        "栗皮茶": "#6d3c32",
        "苔色": "#69821b",
        "瑠璃色": "#1e50a2",
        "憲法色": "#543f32",
        "真紅": "#a22041",
        "黒茶": "#583822",
        "萌黄": "#aacf53",
        "薄縹": "#507ea4",
        "涅色": "#554738",
        "濃紅": "#a22041",
        "葡萄茶": "#6c2c2f",
        "苗色": "#b0ca71",
        "瑠璃紺": "#19448e",
        "檳榔子染": "#433d3c",
        "象牙色": "#f8f4e6",
        "葡萄色": "#640125",
        "若葉色": "#b9d08b",
        "紺瑠璃": "#164a84",
        "黒鳶": "#432f2f",
        "練色": "#ede4cd",
        "萱草色": "#f8b862",
        "松葉色": "#839b5c",
        "藍色": "#165e83",
        "赤墨": "#3f312b",
        "灰白色": "#e9e4d4",
        "柑子色": "#f6ad49",
        "夏虫色": "#cee4ae",
        "青藍": "#274a78",
        "黒紅": "#302833",
        "蒸栗色": "#ebe1a9",
        "金茶": "#f39800",
        "鶸萌黄": "#82ae46",
        "深縹": "#2a4073",
        "白": "#ffffff",
        "女郎花": "#f2f2b0",
        "蜜柑色": "#f08300",
        "柳色": "#a8c97f",
        "紺色": "#223a70",
        "胡粉色": "#fffffc",
        "枯草色": "#e4dc8a",
        "鉛丹色": "#ec6d51",
        "青白橡": "#9ba88d",
        "紺青": "#192f60",
        "卯の花色": "#f7fcfe",
        "淡黄": "#f8e58c",
        "黄丹": "#ee7948",
        "柳鼠": "#c8d5bb",
        "留紺": "#1c305c",
        "白磁": "#f8fbf8",
        "白茶": "#ddbb99",
        "柿色": "#ed6d3d",
        "裏葉柳": "#c1d8ac",
        "濃藍": "#0f2350",
        "生成り色": "#fbfaf5",
        "赤白橡": "#d7a98c",
        "黄赤": "#ec6800",
        "山葵色": "#a8bf93",
        "鉄紺": "#17184b",
        "乳白色": "#f3f3f3",
        "洗柿": "#f2c9ac",
        "人参色": "#ec6800",
        "老竹色": "#769164",
        "漆黒": "#0d0015",
        "白練": "#f3f3f2",
        "鳥の子色": "#fff1cf",
        "橙色": "#ee7800",
        "白緑": "#d6e9ca",
        "淡藤色": "#bbc8e6",
        "素色": "#eae5e3",
        "蜂蜜色": "#fddea5",
        "照柿": "#eb6238",
        "淡萌黄": "#93ca76",
        "藤色": "#bbbcde",
        "白梅鼠": "#e5e4e6",
        "肌色": "#fce2c4",
        "赤橙": "#ea5506",
        "柳染": "#93b881",
        "紅掛空色": "#8491c3",
        "白鼠": "#dcdddd",
        "薄卵色": "#fde8d0",
        "金赤": "#ea5506",
        "薄萌葱": "#badcad",
        "紅碧": "#8491c3",
        "絹鼠": "#dddcd6",
        "雄黄": "#f9c89b",
        "朱色": "#eb6101",
        "深川鼠": "#97a791",
        "紺桔梗": "#4d5aaf",
        "灰青": "#c0c6c9",
        "洒落柿": "#f7bd8f",
        "小麦色": "#e49e61",
        "若緑": "#98d98e",
        "花色": "#4d5aaf",
        "銀鼠": "#afafb0",
        "赤香": "#f6b894",
        "丹色": "#e45e32",
        "浅緑": "#88cb7f",
        "紺藍": "#4a488e",
        "薄鈍": "#adadad",
        "砥粉色": "#f4dda5",
        "黄茶": "#e17b34",
        "薄緑": "#69b076",
        "紅桔梗": "#4d4398",
        "薄墨色": "#a3a3a2",
        "肉色": "#f1bf99",
        "肉桂色": "#dd7a56",
        "青鈍": "#6b7b6e",
        "桔梗色": "#5654a2",
        "錫色": "#9ea1a3",
        "人色": "#f1bf99",
        "赤朽葉色": "#db8449",
        "青磁鼠": "#bed2c3",
        "藤納戸": "#706caa",
        "素鼠": "#9fa0a0",
        "丁子色": "#efcd9a",
        "黄櫨染": "#d66a35",
        "薄青": "#93b69c",
        "紅掛花色": "#68699b",
        "鼠色": "#949495",
        "香色": "#efcd9a",
        "蒲公英色": "#ffd900",
        "錆青磁": "#a6c8b2",
        "紫苑色": "#867ba9",
        "源氏鼠": "#888084",
        "薄香": "#f0cfa0",
        "黄色": "#ffd900",
        "緑青色": "#47885e",
        "白藤色": "#dbd0e6",
        "灰色": "#7d7d7d",
        "浅黄": "#edd3a1",
        "中黄": "#ffea00",
        "千歳緑": "#316745",
        "藤紫": "#a59aca",
        "鉛色": "#7b7c7d",
        "枯色": "#e0c38c",
        "菜の花色": "#ffec47",
        "若竹色": "#68be8d",
        "菫色": "#7058a3",
        "鈍色": "#727171",
        "淡香": "#f3bf88",
        "黄檗色": "#fef263",
        "緑": "#3eb370",
        "青紫": "#674598",
        "墨": "#595857",
        "杏色": "#f7b977",
        "卵色": "#fcd575",
        "常磐色": "#007b43",
        "丼鼠": "#595455",
        "東雲色": "#f19072",
        "花葉色": "#fbd26b",
        "千草鼠": "#bed3ca",
        "竜胆色": "#9079ad",
        "消炭色": "#524e4d",
        "曙色": "#f19072",
        "刈安色": "#f5e56b",
        "千草色": "#92b5a9",
        "江戸紫": "#745399",
        "藍墨茶": "#474a4d",
        "珊瑚朱色": "#ee836f",
        "玉蜀黍色": "#eec362",
        "青磁色": "#7ebea5",
        "本紫": "#65318e",
        "羊羹色": "#383c3c",
        "深支子": "#eb9b6f",
        "金糸雀色": "#ebd842",
        "青竹色": "#7ebeab",
        "蝋色": "#2b2b2b",
        "纁": "#e0815e",
        "黄支子色": "#ffdb4f",
        "常磐緑": "#028760",
        "深紫": "#493759",
        "黒": "#2b2b2b",
        "浅緋": "#df7163",
        "支子色": "#fbca4d",
        "木賊色": "#3b7960",
        "紫黒": "#2e2930",
        "烏羽色": "#180614",
        "真赭": "#d57c6b",
        "向日葵色": "#fcc800",
        "天鵞絨": "#2f5d50",
        "紫": "#884898",
        "鉄黒": "#281a14",
        "洗朱": "#d0826c",
        "山吹色": "#f8b500",
        "虫襖": "#3a5b52",
        "薄葡萄": "#c0a2c7",
        "濡羽色": "#000b00",
        "遠州茶": "#ca8269",
        "鬱金色": "#fabf14",
        "革色": "#475950",
        "紫紺": "#460e44",
        "黒檀": "#250d00",
        "紅樺色": "#bb5548",
        "藤黄": "#f7c114",
        "深緑": "#00552e",
        "暗紅色": "#74325c",
        "憲法黒茶": "#241a08",
        "赭": "#ab6953",
        "金色": "#e6b422",
        "鉄色": "#005243",
        "桑の実色": "#55295b",
        "暗黒色": "#16160e",
    };
    return DICTIONARY;
}, _AlertSettingWindow___isFilledContents = function _AlertSettingWindow___isFilledContents() {
    var isFilled = true;
    for (let id of this.UNIT_IDS) {
        let elements = __classPrivateFieldGet(this, _AlertSettingWindow_instances, "m", _AlertSettingWindow___declareAndCreateElements).call(this, id);
        if (elements.inputTime.value === "-" || elements.inputTime.value === "") {
            isFilled = false;
            this.HtmlFunc.setUnfilledSignifier(elements.inputTime);
        }
        else {
        }
    }
    return isFilled;
};
class TaskManager {
    constructor() {
        const OBJ = { encrypto: {} };
        console.log(Object.keys(OBJ.encrypto).length);
        if (Object.keys(OBJ.encrypto).length === 0) {
            console.log("obj is empty");
        }
        else {
            console.log("obj have items");
        }
        this.UrlFunc = new UrlFunction();
        const FIREBASE_CONFIG = {
            apiKey: "AIzaSyCE7N5hBYZzbMn9Xn_fEAwM1I-_FU4uVT0",
            authDomain: "taskmanager-72c55.firebaseapp.com",
            databaseURL: "https://taskmanager-72c55-default-rtdb.firebaseio.com/",
            projectId: "taskmanager-72c55",
            storageBucket: "taskmanager-72c55.firebasestorage.app",
            messagingSenderId: "991252473963",
            appId: "1:991252473963:web:b790462ed1f6614f00292e",
            measurementId: "G-9QEGCJ7Z7W"
        };
        this.FirebaseApp = new FirebaseFunctions(FIREBASE_CONFIG);
        this.HtmlFunc = new HtmlFunction();
        this.UtilsFunc = new UtilsFunctions();
        this.AnimateFunc = new AnimateFunctions();
        this.PreloaderFunc = new PreLoader();
        this.GoogleCalenderApp = null;
        this.WINDOWS = [];
        this.AlertSettingWindow = new AlertSettingWindow();
        this.executeByURL();
    }
    ;
    executeByURL() {
        return __awaiter(this, void 0, void 0, function* () {
            const LABO_LOGO = document.getElementById("headerLaboLogo");
            const URL = window.location.href;
            const PAGE_TITLE = this.UrlFunc.extractHtmlTitle(URL);
            const RENDER_RESULT = yield this.__renderLoginStatus();
            if (RENDER_RESULT) {
                this.GoogleCalenderApp = new GoogleCalendarApp(this.FirebaseApp);
                yield this.GoogleCalenderApp.init();
            }
            else {
                this.__showSignifierPromptLogin();
            }
            if (PAGE_TITLE) {
                this.setHeaderEvents(PAGE_TITLE);
                if (PAGE_TITLE === "index" || PAGE_TITLE === "TaskManager" || PAGE_TITLE === "test_TaskManager") {
                    yield this.renderTaskWindows();
                }
                else if (PAGE_TITLE === "add-task" || PAGE_TITLE === "edit-task") {
                    this.AlertSettingWindow.init();
                    this.setEncryptSignifyEvent();
                    this.setAdjusterHeight();
                    this.setComboboxEvent();
                    this.__showCheckPasswordEntry();
                    if (PAGE_TITLE === "add-task") {
                        this.setValidationsAndPlaceholders();
                        this.AlertSettingWindow.makeAlertUnit();
                        yield this.setAddTaskEvent();
                    }
                    else if (PAGE_TITLE === "edit-task") {
                        this.setEditValidationsAndPlaceholders();
                        this.setCurrentValue();
                        this.setEditTaskEvent();
                    }
                    this.AnimateFunc.fadeIn(LABO_LOGO);
                }
                else {
                    alert(`無効なページタイトルです。: Pagetitle = ${PAGE_TITLE}`);
                }
            }
            else {
                this.UrlFunc.alertError("extractHtmlTitle", `TaskManager内、executeByURLで無効なURLでした。URL:${URL}`);
            }
        });
    }
    __renderLoginStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const SPAN_NAME = document.getElementById("headerUserName");
            const LOGIN_BTN = document.getElementById("menuBtnLogin");
            const RENDER_AUTH_ARGS = {
                HTML_BTN_ELEMENT: LOGIN_BTN,
                SPAN_NAME: SPAN_NAME,
                METHOD: "onAuthStateChanged"
            };
            const RESULT = yield this.FirebaseApp.renderAuthStatus(RENDER_AUTH_ARGS);
            return RESULT;
        });
    }
    __showSignifierPromptLogin() {
        const SPAN_NAME = document.getElementById("headerUserName");
        if (SPAN_NAME.textContent) {
        }
        else {
            const PROMPT_LOGIN = document.getElementById("promptLogin");
            PROMPT_LOGIN.style.display = "block";
            const HAGURUMA = document.getElementById("haguruma");
            HAGURUMA.addEventListener("click", () => {
                const MENU = document.getElementById("menu");
                HAGURUMA.addEventListener("click", () => {
                    MENU.style.display = "inline";
                });
                HAGURUMA.addEventListener("mouseenter", () => {
                    MENU.style.display = "inline";
                });
                HAGURUMA.addEventListener("mouseleave", () => {
                    MENU.style.display = "none";
                });
            });
            const ADD_BTN = document.getElementById("headerAddBtn");
            ADD_BTN.style.visibility = "hidden";
        }
    }
    setHeaderEvents(PAGE_TITLE) {
        if (PAGE_TITLE === "index" || PAGE_TITLE === "TaskManager" || PAGE_TITLE === "test_TaskManager") {
            const ADD_BTN = document.getElementById("headerAddBtn");
            ADD_BTN.addEventListener("click", () => {
                this.UrlFunc.redirect({
                    METHOD: "toSelectedPage",
                    PAGE_TITLE: "add-task",
                    CALL_FROM: "TaskManager内、setHeaderEvents"
                });
            });
        }
        else if (PAGE_TITLE === "add-task" || PAGE_TITLE === "login" || PAGE_TITLE === "edit-task") {
            const HOME_BTN = document.getElementById("headerHomeBtn");
            HOME_BTN.addEventListener("click", () => {
                this.UrlFunc.redirect({
                    METHOD: "toHP",
                    CALL_FROM: "TaskManager内、setHeaderEvents"
                });
            });
        }
        if (PAGE_TITLE === "index" || PAGE_TITLE === "TaskManager" || PAGE_TITLE === "test_TaskManager" || PAGE_TITLE === "add-task") {
            this.__setMenuEvents();
            const LABO_LOGO = document.getElementById("headerLaboLogo");
            LABO_LOGO.addEventListener("click", () => {
                window.location.href = "https://sites.google.com/view/syuubunndou/%E3%83%9B%E3%83%BC%E3%83%A0";
            });
        }
    }
    __setMenuEvents() {
        const SETTING_BTN = document.getElementById("headerSettingBtn");
        const MENU = document.getElementById("menu");
        SETTING_BTN.addEventListener("click", () => {
            MENU.style.display = "inline";
        });
        SETTING_BTN.addEventListener("mouseenter", () => {
            MENU.style.display = "inline";
        });
        SETTING_BTN.addEventListener("mouseleave", () => {
            MENU.style.display = "none";
        });
        MENU.addEventListener("mouseenter", () => {
            MENU.style.display = "inline";
        });
        MENU.addEventListener("mouseleave", () => {
            MENU.style.display = "none";
        });
        const LOGIN_BTN = document.getElementById("menuBtnLogin");
        LOGIN_BTN.addEventListener("click", () => {
            const SPAN_NAME = document.getElementById("headerUserName");
            const LOGIN_SYSTEM_ARGS = {
                HTML_BTN_ELEMENT: LOGIN_BTN,
                SPAN_NAME: SPAN_NAME,
                isRedirect: true,
                REDIRECT_METHOD: "toHP",
                CALL_FROM: "in taskmanager, setmenu events, login btn"
            };
            this.FirebaseApp.loginSystem(LOGIN_SYSTEM_ARGS);
        });
    }
    renderTaskWindows() {
        return __awaiter(this, void 0, void 0, function* () {
            const DATAS = yield this.__downloadAndSortDatas();
            for (let data of DATAS) {
                let taskWindowData = { TITLE: data.data.MainWindow.taskName,
                    TIME: data.deadline.toISOString(),
                    REPEAT: data.data.MainWindow.repeat,
                    CONTENT: data.data.MainWindow.content,
                    ALERT_CONDITIONS: data.data.AlertWindow,
                    SALT: data.salt,
                    IV: data.iv,
                    TASK_ID: data.key,
                    EVENT_ID: data.eventID
                };
                this.WINDOWS.push(new TaskWindow(taskWindowData, this.FirebaseApp, this.GoogleCalenderApp));
            }
        });
    }
    __downloadAndSortDatas() {
        return __awaiter(this, void 0, void 0, function* () {
            const RAW_DOWNLOAD_DATAS = yield this.FirebaseApp.downloadData("tasks/");
            const DATAS = [];
            for (const KEY in RAW_DOWNLOAD_DATAS) {
                const PARSED_TASK_RECORD = RAW_DOWNLOAD_DATAS[KEY];
                const PARSED_ITEM = JSON.parse(PARSED_TASK_RECORD.taskData);
                const EVENT_ID = JSON.parse(PARSED_TASK_RECORD.googleCalenderEventID)[1];
                const DECRYPTED_DATA = yield this.FirebaseApp.decryptData(PARSED_ITEM.data, PARSED_ITEM.salt, PARSED_ITEM.iv);
                console.log(DECRYPTED_DATA);
                const DATE = new Date(Date.UTC(DECRYPTED_DATA.MainWindow.deadline.year, DECRYPTED_DATA.MainWindow.deadline.month - 1, DECRYPTED_DATA.MainWindow.deadline.day, DECRYPTED_DATA.MainWindow.deadline.hour, DECRYPTED_DATA.MainWindow.deadline.minute));
                DATAS.push({ deadline: DATE,
                    data: DECRYPTED_DATA,
                    salt: PARSED_ITEM.salt,
                    iv: PARSED_ITEM.iv,
                    key: KEY,
                    eventID: EVENT_ID
                });
            }
            DATAS.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
            return DATAS;
        });
    }
    setComboboxEvent() {
        const COMBOBOX = document.getElementById("addCombobox");
        COMBOBOX.addEventListener("change", () => {
            if (COMBOBOX.value === "no-repeat") {
                this.__toggleNoRepeatStyle();
            }
            else {
                this.__toggleRepeatStyle();
            }
        });
    }
    __toggleNoRepeatStyle() {
        const COMBOBOX = document.getElementById("addCombobox");
        const COMBOBOX_VALUE = document.getElementById("repeatValue");
        COMBOBOX.style.width = "240px";
        COMBOBOX.style.marginLeft = "0px";
        COMBOBOX.style.left = "25px";
        COMBOBOX_VALUE.style.display = "none";
    }
    __toggleRepeatStyle() {
        const COMBOBOX = document.getElementById("addCombobox");
        const COMBOBOX_VALUE = document.getElementById("repeatValue");
        COMBOBOX.style.width = "100px";
        COMBOBOX.style.marginLeft = "70px";
        COMBOBOX.style.left = "-40px";
        COMBOBOX_VALUE.style.display = "inline-block";
    }
    __extractInputWindowData() {
        return __awaiter(this, void 0, void 0, function* () {
            var alertData = this.AlertSettingWindow.extractData();
            var data = {};
            const IS_FILLED_ADD_MAIN_WINDOW = this.__isFilledAddMainWindow();
            if (typeof alertData === "undefined") {
                alert(`アラートの期間が正しく入力されていません。数値を入力してください。`);
                if (IS_FILLED_ADD_MAIN_WINDOW === false) {
                    alert(`未入力の個所があります。色がついているところを埋めてください`);
                    return;
                }
                else {
                    return;
                }
            }
            if (IS_FILLED_ADD_MAIN_WINDOW === false) {
                alert(`未入力の個所があります。色がついているところを埋めてください`);
                return;
            }
            if (this.__is2PasswordsSame()) {
            }
            else {
                alert("入力されたパスワードが一致しません。再確認してください。");
                this.__setSignifierUnmatchPassword();
                return;
            }
            const DATAS = yield this.__extractInputMainWindowData();
            data["AlertWindow"] = alertData;
            console.log(DATAS);
            if (Object.keys(DATAS.encryptedData).length === 0) {
                console.log("in raw data");
                data["MainWindow"] = DATAS.rawData;
            }
            else {
                data["MainWindow"] = DATAS.encryptedData;
            }
            return { sendData: data, rawData: DATAS.rawData };
        });
    }
    __extractInputMainWindowData() {
        return __awaiter(this, void 0, void 0, function* () {
            const RAW_DATA = {};
            const ENCRYPTED_DATA = {};
            const SPAN_TITLE = document.getElementById("addTitle");
            const SPAN_YEAR = document.getElementById("deadlineYear");
            const SPAN_MONTH = document.getElementById("deadlineMonth");
            const SPAN_DAY = document.getElementById("deadlineDay");
            const SPAN_WEEKDAY = document.getElementById("deadlineWeekday");
            const SPAN_HOUR = document.getElementById("deadlineHour");
            const SPAN_MINUTE = document.getElementById("deadlineMinute");
            const REPEAT_OPTION_COMBOBOX = document.getElementById("addCombobox");
            const SPAN_REPEAT_VALUE = document.getElementById("repeatValue");
            const DIV_CONTENT = document.getElementById("addContent");
            var password = "";
            if (this.__is2PasswordsSame()) {
                password = this.__extractPassword();
            }
            if (password) {
                const TASK_NAME = typeof SPAN_TITLE.innerHTML === "string" ? yield this.FirebaseApp.encryptData(SPAN_TITLE.innerHTML, password) : "";
                ENCRYPTED_DATA["taskName"] = typeof TASK_NAME === "object" ? TASK_NAME : alert(`Error: 暗号化ができませんでした。開発者に連絡してください。`);
                ENCRYPTED_DATA["deadline"] = {
                    year: SPAN_YEAR.textContent,
                    month: SPAN_MONTH.textContent,
                    day: SPAN_DAY.textContent,
                    weekday: SPAN_WEEKDAY.textContent,
                    hour: SPAN_HOUR.textContent,
                    minute: SPAN_MINUTE.textContent
                };
                var repeatValue = SPAN_REPEAT_VALUE.textContent ? SPAN_REPEAT_VALUE.textContent : "";
                ENCRYPTED_DATA["repeat"] = { value: repeatValue, option: REPEAT_OPTION_COMBOBOX.value };
                const CONTENT = yield this.FirebaseApp.encryptData(DIV_CONTENT.innerHTML, password);
                ENCRYPTED_DATA["content"] = typeof CONTENT === "object" ? CONTENT : alert(`Error: 暗号化ができませんでした。開発者に連絡してください。`);
            }
            RAW_DATA["taskName"] = typeof SPAN_TITLE.innerHTML === "string" ? { data: SPAN_TITLE.innerHTML, salt: "", iv: "" } : "";
            RAW_DATA["deadline"] = {
                year: SPAN_YEAR.textContent,
                month: SPAN_MONTH.textContent,
                day: SPAN_DAY.textContent,
                weekday: SPAN_WEEKDAY.textContent,
                hour: SPAN_HOUR.textContent,
                minute: SPAN_MINUTE.textContent
            };
            var repeatValue = SPAN_REPEAT_VALUE.textContent ? SPAN_REPEAT_VALUE.textContent : "";
            RAW_DATA["repeat"] = { value: repeatValue, option: REPEAT_OPTION_COMBOBOX.value };
            RAW_DATA["content"] = { data: DIV_CONTENT.innerHTML, salt: "", iv: "" };
            return { rawData: RAW_DATA, encryptedData: ENCRYPTED_DATA };
        });
    }
    __extractPassword() {
        const SPAN_PASSWORD = document.getElementById("addKey1");
        const RAW_PASSWORD = SPAN_PASSWORD.textContent;
        if (RAW_PASSWORD) {
            if (RAW_PASSWORD === "（任意）パスワードを入力") {
                return "";
            }
            return RAW_PASSWORD;
        }
        else {
            return "";
        }
        return "";
    }
    __is2PasswordsSame() {
        const PASSWORD_ENTRY1 = document.getElementById("addKey1");
        const PASSWORD_ENTRY2 = document.getElementById("addKey2");
        const INPUT_PASSWORD1 = PASSWORD_ENTRY1.textContent;
        const INPUT_PASSWORD2 = PASSWORD_ENTRY2.textContent;
        if (INPUT_PASSWORD1 && INPUT_PASSWORD2) {
            if (INPUT_PASSWORD1 === "（任意）パスワードを入力" && INPUT_PASSWORD2 === "（確認）パスワードを入力") {
                return true;
            }
            else if (INPUT_PASSWORD1 === "（任意）パスワードを入力") {
                return true;
            }
            else {
                return INPUT_PASSWORD1 === INPUT_PASSWORD2 ? true : false;
            }
        }
        else {
            if (INPUT_PASSWORD1 === "") {
                return true;
            }
            else {
                return false;
            }
        }
    }
    __showCheckPasswordEntry() {
        const PASSWORD_ENTRY1 = document.getElementById("addKey1");
        const PASSWORD_ENTRY2 = document.getElementById("addKey2");
        PASSWORD_ENTRY1.addEventListener("input", () => {
            if (PASSWORD_ENTRY1.textContent === "") {
                PASSWORD_ENTRY2.style.display = "none";
            }
            else {
                PASSWORD_ENTRY2.style.display = "inline-block";
            }
        });
    }
    __setSignifierUnmatchPassword() {
        const PASSWORD_ENTRY1 = document.getElementById("addKey1");
        const PASSWORD_ENTRY2 = document.getElementById("addKey2");
        this.HtmlFunc.setUnfilledSignifier(PASSWORD_ENTRY1);
        this.HtmlFunc.setUnfilledSignifier(PASSWORD_ENTRY2);
    }
    __isFilledAddMainWindow() {
        const SPAN_EDITABLE_TITLE = document.getElementById("addTitle");
        const SPAN_YEAR = document.getElementById("deadlineYear");
        const SPAN_HOUR = document.getElementById("deadlineHour");
        const SPAN_MINUTE = document.getElementById("deadlineMinute");
        const SPAN_WEEKDAY = document.getElementById("deadlineWeekday");
        const SELECT_COMBOBOX = document.getElementById("addCombobox");
        const SPAN_COMBOBOX = document.getElementById("repeatValue");
        const TITLE = typeof SPAN_EDITABLE_TITLE.textContent === "string" ? SPAN_EDITABLE_TITLE.textContent : "";
        var isFilledTitle;
        var isFilledYear;
        var isFilledHour;
        var isFilledMinute;
        var isFilledWeekday;
        var isFilledCombobox;
        var result;
        isFilledTitle = TITLE === "" ? false : true;
        isFilledYear = SPAN_YEAR.textContent === "-" || SPAN_YEAR.textContent === "" ? false : true;
        isFilledHour = SPAN_HOUR.textContent === "-" || SPAN_HOUR.textContent === "" ? false : true;
        isFilledMinute = SPAN_MINUTE.textContent === "-" || SPAN_MINUTE.textContent === "" ? false : true;
        isFilledWeekday = SPAN_WEEKDAY.textContent === "" ? false : true;
        if (SELECT_COMBOBOX.value === "no-repeat") {
            isFilledCombobox = true;
        }
        else {
            isFilledCombobox = SPAN_COMBOBOX.textContent === "-" || SPAN_COMBOBOX.textContent === "" ? false : true;
        }
        result = isFilledYear && isFilledHour && isFilledMinute && isFilledWeekday && isFilledTitle && isFilledCombobox ? true : false;
        this.__setUnfilledSignifier(isFilledTitle, isFilledYear, isFilledHour, isFilledMinute, isFilledCombobox);
        return result;
    }
    __setUnfilledSignifier(FLG_TITLE, FLG_YEAR, FLG_HOUR, FLG_MINUTE, FLG_COMBOBOX) {
        const SPAN_EDITABLE_TITLE = document.getElementById("addTitle");
        const SPAN_YEAR = document.getElementById("deadlineYear");
        const SPAN_HOUR = document.getElementById("deadlineHour");
        const SPAN_MINUTE = document.getElementById("deadlineMinute");
        const SPAN_MONTH = document.getElementById("deadlineMonth");
        const SPAN_DAY = document.getElementById("deadlineDay");
        const SPAN_COMBOBOX = document.getElementById("repeatValue");
        const FLG_MONTH = SPAN_MONTH.textContent === "" || SPAN_MONTH.textContent === "-" ? false : true;
        const FLG_DAY = SPAN_DAY.textContent === "" || SPAN_DAY.textContent === "-" ? false : true;
        if (FLG_TITLE === false) {
            this.HtmlFunc.setUnfilledSignifier(SPAN_EDITABLE_TITLE);
        }
        if (FLG_YEAR === false) {
            this.HtmlFunc.setUnfilledSignifier(SPAN_YEAR);
        }
        if (FLG_MONTH === false) {
            this.HtmlFunc.setUnfilledSignifier(SPAN_MONTH);
        }
        if (FLG_DAY === false) {
            this.HtmlFunc.setUnfilledSignifier(SPAN_DAY);
        }
        if (FLG_HOUR === false) {
            this.HtmlFunc.setUnfilledSignifier(SPAN_HOUR);
        }
        if (FLG_MINUTE === false) {
            this.HtmlFunc.setUnfilledSignifier(SPAN_MINUTE);
        }
        if (FLG_COMBOBOX === false) {
            this.HtmlFunc.setUnfilledSignifier(SPAN_COMBOBOX);
        }
    }
    setEncryptSignifyEvent() {
        const SPAN_PASSWORD = document.getElementById("addKey1");
        const ENCRYPT_SIGNIFYER1 = document.getElementById("key1");
        const ENCRYPT_SIGNIFYER2 = document.getElementById("key2");
        const SPAN_TITLE = document.getElementById("addTitle");
        const DIV_CONTENT = document.getElementById("addContent");
        SPAN_PASSWORD.addEventListener("input", () => {
            if (SPAN_PASSWORD.textContent == "") {
                ENCRYPT_SIGNIFYER1.style.visibility = "hidden";
                ENCRYPT_SIGNIFYER2.style.visibility = "hidden";
                SPAN_TITLE.style.backgroundColor = "rgb(255, 255, 255)";
                SPAN_TITLE.style.color = "rgb(0,0,0)";
                DIV_CONTENT.style.backgroundColor = "rgb(255, 255, 255)";
                DIV_CONTENT.style.color = "rgb(0,0,0)";
            }
            else {
                ENCRYPT_SIGNIFYER1.style.visibility = "visible";
                ENCRYPT_SIGNIFYER2.style.visibility = "visible";
                SPAN_TITLE.style.backgroundColor = "rgb(0, 0, 0)";
                SPAN_TITLE.style.color = "rgb(255, 255, 255)";
                DIV_CONTENT.style.backgroundColor = "rgb(0, 0, 0)";
                DIV_CONTENT.style.color = "rgb(255, 255, 255)";
            }
        });
    }
    setValidationsAndPlaceholders() {
        const SPAN_TITLE = document.getElementById("addTitle");
        const SPAN_YEAR = document.getElementById("deadlineYear");
        const SPAN_MONTH = document.getElementById("deadlineMonth");
        const SPAN_DAY = document.getElementById("deadlineDay");
        const SPAN_HOUR = document.getElementById("deadlineHour");
        const SPAN_MINUTE = document.getElementById("deadlineMinute");
        const SPAN_WEEKDAY = document.getElementById("deadlineWeekday");
        const SPAN_COMBOBOX = document.getElementById("repeatValue");
        const DIV_CONTENT = document.getElementById("addContent");
        const PASSWORD_ENTRY1 = document.getElementById("addKey1");
        const PASSWORD_ENTRY2 = document.getElementById("addKey2");
        this.HtmlFunc.setPlaceHolder(SPAN_TITLE, "ここに課題を入力");
        new HtmlFunction().setPlaceHolder(SPAN_YEAR, `${new Date().getFullYear()}`);
        new HtmlFunction().setPlaceHolder(SPAN_MONTH, "-");
        new HtmlFunction().setPlaceHolder(SPAN_DAY, "-");
        new HtmlFunction().setPlaceHolder(SPAN_HOUR, "-");
        new HtmlFunction().setPlaceHolder(SPAN_MINUTE, "-");
        new HtmlFunction().setPlaceHolder(SPAN_COMBOBOX, "-");
        new HtmlFunction().setPlaceHolder(DIV_CONTENT, "<br>ここに入力してください");
        new HtmlFunction().setPlaceHolder(PASSWORD_ENTRY1, "（任意）パスワードを入力");
        new HtmlFunction().setPlaceHolder(PASSWORD_ENTRY2, "（確認）パスワードを入力");
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_YEAR],
            VALIDATE_OPTION: ["onlyNumbers"],
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_MONTH],
            VALIDATE_OPTION: ["onlySelectedNumberRange", "zeroPadding"],
            MIN_NUMBER: 1,
            MAX_NUMBER: 12
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_DAY],
            VALIDATE_OPTION: ["withinMonthlyDate", "zeroPadding"],
            MONTH_ELEMENT: SPAN_MONTH
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_HOUR],
            VALIDATE_OPTION: ["onlySelectedNumberRange", "zeroPadding"],
            MIN_NUMBER: 0,
            MAX_NUMBER: 23
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_MINUTE],
            VALIDATE_OPTION: ["onlySelectedNumberRange", "zeroPadding"],
            MIN_NUMBER: 0,
            MAX_NUMBER: 59
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_WEEKDAY],
            VALIDATE_OPTION: ["renderWeekday"],
            MONTH_ELEMENT: SPAN_MONTH,
            DATE_ELEMENT: SPAN_DAY
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_COMBOBOX],
            VALIDATE_OPTION: ["onlyNumbers"]
        });
    }
    setAdjusterHeight() {
        const SPAN_EDITABLE_TITLE = document.getElementById("addTitle");
        const SPAN_TITLE = document.getElementById("expTitle");
        this.HtmlFunc.alignSpanToAdjacentInputCenter(SPAN_TITLE, SPAN_EDITABLE_TITLE);
    }
    __showDoneInformation() {
        const DONE_INFO = document.getElementById(`setting-info`);
        DONE_INFO.style.display = "block";
    }
    setAddTaskEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            const ADD_TASK_BTN = document.getElementById("btnMake");
            ADD_TASK_BTN.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const DATA = yield this.__extractInputWindowData();
                if (typeof DATA === "object") {
                    const TASK_ID = this.FirebaseApp.prepareUniqueID();
                    this.__sendAddData(DATA.sendData, TASK_ID);
                    yield this.__addEventToGoogleCalender(DATA.rawData, TASK_ID);
                    this.__showDoneInfo();
                }
                else {
                    return;
                }
            }));
        });
    }
    __addEventToGoogleCalender(DATA, TASK_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const YEAR = parseInt(DATA.deadline.year);
            const MONTH = parseInt(DATA.deadline.month);
            const DAY = parseInt(DATA.deadline.day);
            const HOUR = parseInt(DATA.deadline.hour);
            const MINUTE = parseInt(DATA.deadline.minute);
            const DEADLINE_ISOSTRING = new Date(YEAR, MONTH - 1, DAY, HOUR, MINUTE).toISOString();
            const EVENT_ARGS = {
                SUMMARY: DATA.taskName.data,
                DEADLINE: DEADLINE_ISOSTRING,
                CONTENT: DATA.content.data,
                COLOR: "2",
                TASK_ID: TASK_ID
            };
            yield this.GoogleCalenderApp.addTask(EVENT_ARGS);
        });
    }
    __sendAddData(data, TASK_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const IS_LOGIEND = this.FirebaseApp.isLogined();
            if (IS_LOGIEND) {
                data["id"] = TASK_ID;
                const ENCRYPT_DATAS = yield this.FirebaseApp.encryptData(data);
                if (ENCRYPT_DATAS) {
                    this.FirebaseApp.uploadData(`tasks/${TASK_ID}/taskData`, ENCRYPT_DATAS);
                }
                else {
                    alert(`データの送信に失敗しました。`);
                    return;
                }
            }
            else {
                if (IS_LOGIEND === false) {
                    alert(`ログインしてない場合は、データを保存できません。`);
                }
            }
        });
    }
    __showDoneInfo() {
        const DONE_INFO = document.getElementById(`setting-info`);
        DONE_INFO.style.display = "block";
    }
    setEditTaskEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            const EDIT_TASK_BTN = document.getElementById("btnMake");
            EDIT_TASK_BTN.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const DATA = yield this.__extractInputWindowData();
                if (typeof DATA === "object") {
                    yield this.__editGoogleCalenderEvent(DATA.rawData);
                    this.__sendEditData(DATA.sendData);
                }
                else {
                    return;
                }
            }));
        });
    }
    __sendEditData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const IS_LOGIEND = this.FirebaseApp.isLogined();
            if (IS_LOGIEND) {
                const TASK_ID = this.UrlFunc.extractQuery().TASK_ID;
                const EVENT_ID = this.UrlFunc.extractQuery().EVENT_ID;
                const ENCRYPT_DATAS = yield this.FirebaseApp.encryptData(data);
                if (ENCRYPT_DATAS) {
                    if (TASK_ID) {
                    }
                    else {
                        alert(`ERROR: in TaskManager, sendEditData. TaskIDがundefinedです。データの編集ができませんでした。zin-syuubunndou@gmail.comまでご連絡ください。`);
                        return;
                    }
                    this.FirebaseApp.uploadData(`tasks/${TASK_ID}/taskData`, ENCRYPT_DATAS);
                    this.FirebaseApp.uploadData(`tasks/${TASK_ID}/googleCalenderEventID`, EVENT_ID);
                    this.__showDoneInformation();
                    yield this.UtilsFunc.sleep(1500);
                    this.UrlFunc.redirect({
                        METHOD: "toHP",
                        CALL_FROM: "TaskManager, sendEditData"
                    });
                    console.log("done");
                }
                else {
                    alert(`データの送信に失敗しました。`);
                    return;
                }
            }
            else {
                alert(`ログインしてない場合は、データを保存できません。`);
            }
        });
    }
    __editGoogleCalenderEvent(DATA) {
        return __awaiter(this, void 0, void 0, function* () {
            const YEAR = parseInt(DATA.deadline.year);
            const MONTH = parseInt(DATA.deadline.month);
            const DAY = parseInt(DATA.deadline.day);
            const HOUR = parseInt(DATA.deadline.hour);
            const MINUTE = parseInt(DATA.deadline.minute);
            const DEADLINE_ISOSTRING = new Date(YEAR, MONTH - 1, DAY, HOUR, MINUTE).toISOString();
            const QUERY_DATA = this.UrlFunc.extractQuery();
            const EVENT_ARGS = {
                SUMMARY: DATA.taskName.data,
                DEADLINE: DEADLINE_ISOSTRING,
                CONTENT: DATA.content.data,
                COLOR: "2",
                TASK_ID: QUERY_DATA.EVENT_ID
            };
            yield this.GoogleCalenderApp.editTask(EVENT_ARGS);
        });
    }
    setCurrentValue() {
        const DATA = this.UrlFunc.extractQuery();
        const SPAN_TITLE = document.getElementById("addTitle");
        const SPAN_YEAR = document.getElementById("deadlineYear");
        const SPAN_MONTH = document.getElementById("deadlineMonth");
        const SPAN_DAY = document.getElementById("deadlineDay");
        const SPAN_WEEKDAY = document.getElementById("deadlineWeekday");
        const SPAN_HOUR = document.getElementById("deadlineHour");
        const SPAN_MINUTE = document.getElementById("deadlineMinute");
        const REPEAT_COMBOBOX = document.getElementById("addCombobox");
        const DIV_CONTENT = document.getElementById("addContent");
        SPAN_TITLE.textContent = DATA.TITLE.data;
        SPAN_YEAR.textContent = new Date(DATA.TIME).getFullYear().toString();
        SPAN_MONTH.textContent = (new Date(DATA.TIME).getMonth() + 1).toString();
        SPAN_DAY.textContent = new Date(DATA.TIME).getDate().toString();
        SPAN_HOUR.textContent = new Date(DATA.TIME).getUTCHours().toString();
        SPAN_MINUTE.textContent = new Date(DATA.TIME).getUTCMinutes().toString();
        SPAN_WEEKDAY.textContent = `(${this.UtilsFunc.calcWeekday(parseInt(SPAN_MONTH.textContent), parseInt(SPAN_DAY.textContent))})`;
        REPEAT_COMBOBOX.value = DATA.REPEAT.option;
        if (DATA.REPEAT.option === "no-repeat") {
            this.__toggleNoRepeatStyle();
        }
        else {
            this.__toggleRepeatStyle();
            const REPEAT_VALUE = document.getElementById("repeatValue");
            REPEAT_VALUE.textContent = DATA.REPEAT.value;
        }
        DIV_CONTENT.innerHTML = DATA.CONTENT.data;
        for (let alertCondition in DATA.ALERT_CONDITIONS) {
            this.__setAlertUnit(DATA.ALERT_CONDITIONS[alertCondition]);
        }
    }
    __setAlertUnit(ALERT_CONDITION) {
        const OPTION = {
            TIME: ALERT_CONDITION.time,
            TIME_UNIT: ALERT_CONDITION.time_unit,
            COLOR1: ALERT_CONDITION.color1.name,
            PALLET_COLOR1: ALERT_CONDITION.color1.value,
            COLOR2: ALERT_CONDITION.color2.name,
            PALLET_COLOR2: ALERT_CONDITION.color2.value,
            IS_FLASH: ALERT_CONDITION.isFlash
        };
        this.AlertSettingWindow.makeAlertUnit(OPTION);
    }
    setEditValidationsAndPlaceholders() {
        const SPAN_YEAR = document.getElementById("deadlineYear");
        const SPAN_MONTH = document.getElementById("deadlineMonth");
        const SPAN_DAY = document.getElementById("deadlineDay");
        const SPAN_HOUR = document.getElementById("deadlineHour");
        const SPAN_MINUTE = document.getElementById("deadlineMinute");
        const SPAN_WEEKDAY = document.getElementById("deadlineWeekday");
        const SPAN_COMBOBOX = document.getElementById("repeatValue");
        const PASSWORD_ENTRY1 = document.getElementById("addKey1");
        const PASSWORD_ENTRY2 = document.getElementById("addKey2");
        new HtmlFunction().setPlaceHolder(PASSWORD_ENTRY1, "（任意）パスワードを入力");
        new HtmlFunction().setPlaceHolder(PASSWORD_ENTRY2, "　　　パスワードを再入力");
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_YEAR],
            VALIDATE_OPTION: ["onlyNumbers"],
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_MONTH],
            VALIDATE_OPTION: ["onlySelectedNumberRange", "zeroPadding"],
            MIN_NUMBER: 1,
            MAX_NUMBER: 12
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_DAY],
            VALIDATE_OPTION: ["withinMonthlyDate", "zeroPadding"],
            MONTH_ELEMENT: SPAN_MONTH
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_HOUR],
            VALIDATE_OPTION: ["onlySelectedNumberRange", "zeroPadding"],
            MIN_NUMBER: 0,
            MAX_NUMBER: 23
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_MINUTE],
            VALIDATE_OPTION: ["onlySelectedNumberRange", "zeroPadding"],
            MIN_NUMBER: 0,
            MAX_NUMBER: 59
        });
        this.HtmlFunc.setValidation({
            CONTENT_ELEMENTS: [SPAN_WEEKDAY],
            VALIDATE_OPTION: ["renderWeekday"],
            MONTH_ELEMENT: SPAN_MONTH,
            DATE_ELEMENT: SPAN_DAY
        });
    }
}
const APP = new TaskManager();
//# sourceMappingURL=TaskManager.js.map