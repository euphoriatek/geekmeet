"use strict";
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
/*
 * Common service shared by all reCaptcha component instances
 * through dependency injection.
 * This service has the task of loading the reCaptcha API once for all
 *
 * As the language is passed to the <script>, the first component
 * determines the language of all subsequent components. This is a limitation
 * of the present Google API.
 */
var ReCaptchaService = (function () {
    function ReCaptchaService(zone) {
        var _this = this;
        this.scriptLoaded = false;
        this.readySubject = new Rx_1.BehaviorSubject(false);
        /* the callback needs to exist before the API is loaded */
        window["reCaptchaOnloadCallback"] = (function () { return zone.run(_this.onloadCallback.bind(_this)); });
    }
    ReCaptchaService.prototype.getReady = function (language) {
        if (!this.scriptLoaded) {
            this.scriptLoaded = true;
            var doc = document.body;
            var script = document.createElement('script');
            script.innerHTML = '';
            script.src = 'https://www.google.com/recaptcha/api.js?onload=reCaptchaOnloadCallback&render=explicit' +
                (language ? '&hl=' + language : '');
            script.async = true;
            script.defer = true;
            doc.appendChild(script);
        }
        return this.readySubject.asObservable();
    };
    ReCaptchaService.prototype.onloadCallback = function () {
        this.readySubject.next(true);
    };
    ReCaptchaService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    ReCaptchaService.ctorParameters = [
        { type: core_1.NgZone, },
    ];
    return ReCaptchaService;
}());
exports.ReCaptchaService = ReCaptchaService;
