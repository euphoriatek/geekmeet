"use strict";
var core_1 = require('@angular/core');
var captcha_service_1 = require("./captcha.service");
var ReCaptchaComponent = (function () {
    function ReCaptchaComponent(_zone, _captchaService) {
        this._zone = _zone;
        this._captchaService = _captchaService;
        this.site_key = null;
        this.theme = 'light';
        this.type = 'image';
        this.size = 'normal';
        this.tabindex = 0;
        /* Available languages: https://developers.google.com/recaptcha/docs/language */
        this.language = null;
        this.captchaResponse = new core_1.EventEmitter();
        this.captchaExpired = new core_1.EventEmitter();
        this.widgetId = null;
    }
    ReCaptchaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._captchaService.getReady(this.language)
            .subscribe(function (ready) {
            if (!ready)
                return;
            //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedFunction
            _this.widgetId = window.grecaptcha.render(_this.targetRef.nativeElement, {
                'sitekey': _this.site_key,
                'theme': _this.theme,
                'type': _this.type,
                'size': _this.size,
                'tabindex': _this.tabindex,
                'callback': (function (response) { return _this._zone.run(_this.recaptchaCallback.bind(_this, response)); }),
                'expired-callback': (function () { return _this._zone.run(_this.recaptchaExpiredCallback.bind(_this)); })
            });
        });
    };
    ReCaptchaComponent.prototype.reset = function () {
        if (this.widgetId === null)
            return;
        //noinspection TypeScriptUnresolvedVariable
        window.grecaptcha.reset(this.widgetId);
    };
    ReCaptchaComponent.prototype.getResponse = function () {
        if (!this.widgetId)
            return null;
        //noinspection TypeScriptUnresolvedVariable
        return window.grecaptcha.getResponse(this.targetRef.nativeElement);
    };
    ReCaptchaComponent.prototype.recaptchaCallback = function (response) {
        this.captchaResponse.emit(response);
    };
    ReCaptchaComponent.prototype.recaptchaExpiredCallback = function () {
        this.captchaExpired.emit();
    };
    ReCaptchaComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 're-captcha',
                    template: '<div #target></div>'
                },] },
    ];
    /** @nocollapse */
    ReCaptchaComponent.ctorParameters = [
        { type: core_1.NgZone, },
        { type: captcha_service_1.ReCaptchaService, },
    ];
    ReCaptchaComponent.propDecorators = {
        'site_key': [{ type: core_1.Input },],
        'theme': [{ type: core_1.Input },],
        'type': [{ type: core_1.Input },],
        'size': [{ type: core_1.Input },],
        'tabindex': [{ type: core_1.Input },],
        'language': [{ type: core_1.Input },],
        'captchaResponse': [{ type: core_1.Output },],
        'captchaExpired': [{ type: core_1.Output },],
        'targetRef': [{ type: core_1.ViewChild, args: ['target',] },],
    };
    return ReCaptchaComponent;
}());
exports.ReCaptchaComponent = ReCaptchaComponent;
