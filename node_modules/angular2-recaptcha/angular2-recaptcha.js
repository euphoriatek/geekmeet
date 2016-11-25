"use strict";
var core_1 = require('@angular/core');
var captcha_component_1 = require("./lib/captcha.component");
var captcha_service_1 = require("./lib/captcha.service");
var ReCaptchaModule = (function () {
    function ReCaptchaModule() {
    }
    ReCaptchaModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [captcha_component_1.ReCaptchaComponent],
                    exports: [captcha_component_1.ReCaptchaComponent],
                    providers: [captcha_service_1.ReCaptchaService]
                },] },
    ];
    /** @nocollapse */
    ReCaptchaModule.ctorParameters = [];
    return ReCaptchaModule;
}());
exports.ReCaptchaModule = ReCaptchaModule;
