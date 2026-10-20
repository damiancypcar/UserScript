// ==UserScript==
// @name        Databricks - Shift+Enter => Enter
// @namespace   Violentmonkey Scripts
// @icon        https://databricks-ui-assets-v2-gsd4bmhzapcyenec.b02.azurefd.net/static/image/favicon.db4fac3c0b7bc625.ico
// @author      Damian
// @version     1.0.0
//
// @match       https://*.azuredatabricks.net/*
// @grant       none
// @description Replace Shift+Enter with Enter in Databricks notebook editor
//

// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener(
        'keydown',
        function (event) {
            if (event.key !== 'Enter' || !event.shiftKey) {
                return;
            }

            Object.defineProperty(event, 'shiftKey', {
                configurable: true,
                get: () => false
            });
        },
        true
    );
})();
