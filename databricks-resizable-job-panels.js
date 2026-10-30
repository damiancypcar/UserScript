// ==UserScript==
// @name        Databricks - Resizable Job Run Panels
// @namespace   databricks
// @icon        https://databricks-ui-assets-v2-gsd4bmhzapcyenec.b02.azurefd.net/static/image/favicon.db4fac3c0b7bc625.ico
// @author      Damian
// @version     1.0.0
//
// @match       https://*.azuredatabricks.net/*
// @grant       none
// @description Makes Job Run notebook and details panels resizable
// ==/UserScript==

(() => {
    'use strict';

    const minWidth = 25;
    const maxWidth = 85;

    function init() {
        const container = document.querySelector(
            '[data-testid="entity-overview-container"]'
        );
        const main = container?.querySelector(
            ':scope > [data-testid="entity-overview-main-panel"]'
        );
        const aside = container?.querySelector(
            '[data-testid="entity-overview-aside-panel"]'
        );
        const asideWrapper = aside?.parentElement;

        if (!container || !main || !aside || !asideWrapper) return;
        if (container.querySelector(':scope > .vm-db-resizer')) return;

        const resizer = document.createElement('div');
        const resizerBar = document.createElement('div');

        resizer.className = 'vm-db-resizer';

        Object.assign(resizer.style, {
            flex: '0 0 7px',
            width: '7px',
            cursor: 'col-resize',
            position: 'relative',
            zIndex: '100',
            display: 'flex',
            justifyContent: 'center'
        });

        Object.assign(resizerBar.style, {
            width: '5px',
            height: '100%',
            background: 'transparent',
            borderRadius: '4px',
            pointerEvents: 'none'
        });

        resizer.appendChild(resizerBar);
        container.insertBefore(resizer, asideWrapper);

        function setWidth(percent) {
            percent = Math.max(minWidth, Math.min(maxWidth, percent));

            main.style.setProperty(
                'width',
                `${percent}%`,
                'important'
            );
            main.style.setProperty(
                'flex-basis',
                `${percent}%`,
                'important'
            );
            main.style.setProperty(
                'min-width',
                '0',
                'important'
            );

            asideWrapper.style.setProperty(
                'width',
                `calc(${100 - percent}% - 7px)`,
                'important'
            );
            asideWrapper.style.setProperty(
                'flex-basis',
                `calc(${100 - percent}% - 7px)`,
                'important'
            );
            asideWrapper.style.setProperty(
                'min-width',
                '0',
                'important'
            );

            aside.style.setProperty(
                'width',
                '100%',
                'important'
            );
            aside.style.setProperty(
                'max-width',
                'none',
                'important'
            );

            window.dispatchEvent(new Event('resize'));
        }

        resizer.addEventListener('mouseenter', () => {
            if (!resizer.dataset.dragging) {
                resizerBar.style.background = '#f7f7f7';
            }
        });

        resizer.addEventListener('mouseleave', () => {
            if (!resizer.dataset.dragging) {
                resizerBar.style.background = 'transparent';
            }
        });

        resizer.addEventListener('mousedown', event => {
            event.preventDefault();

            resizer.dataset.dragging = 'true';
            resizerBar.style.background = '#8b8b8b';

            const rect = container.getBoundingClientRect();

            function onMouseMove(moveEvent) {
                const x = moveEvent.clientX - rect.left;
                const percent = x / rect.width * 100;

                setWidth(percent);
            }

            function onMouseUp() {
                delete resizer.dataset.dragging;

                resizerBar.style.background = resizer.matches(':hover')
                    ? '#f7f7f7'
                    : 'transparent';

                document.removeEventListener(
                    'mousemove',
                    onMouseMove
                );
                document.removeEventListener(
                    'mouseup',
                    onMouseUp
                );
            }

            document.addEventListener(
                'mousemove',
                onMouseMove
            );
            document.addEventListener(
                'mouseup',
                onMouseUp
            );
        });
    }

    const observer = new MutationObserver(init);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    init();
})();
