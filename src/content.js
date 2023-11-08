import "./styles/options.css";

import App from "./parts/AppContent";

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from "./utils/classTransform";
import {AppButtons} from "./parts/AppButtons";
import {waitForElement} from "./utils/imageUtil";

import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new Sentry.GlobalHandlers({
            onerror: true,
            onunhandledrejection: true,
        }),
        new Sentry.Breadcrumbs({
            console: true,
            sentry: true,
        })
    ],
    beforeSend: function(event, hint) {
        if (hint && hint.originalException instanceof Event) {
            event.extra.isTrusted = hint.originalException.isTrusted;
            event.extra.detail = hint.originalException.detail;
            event.extra.type = hint.originalException.type;
        }

        return event;
    },
    tracesSampleRate: 1.0,
});

const root = document.createElement('div');

const is1688item = window.location.host === 'detail.1688.com'

root.classList.add(classNames('parent-flg'));
root.classList.add(classNames('font-SFUIDisplay'));

document.body.appendChild(root);

ReactDOM.render(<App/>, root);

if (is1688item) {
    // Show information about provider
    waitForElement('#hd_0_container_0 :nth-child(2) :nth-child(1) :nth-child(1) :nth-child(3)', (element) => {
        const mouseoverEvent = new MouseEvent('mouseover', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });

        element.dispatchEvent(mouseoverEvent);
    })

    waitForElement('*:is(.order-button-children, .order-form-button-wrapper)', (buttonsBlock) => {
        const buttons = document.createElement('div');

        buttons.classList.add(classNames('parent-flg'));
        buttons.classList.add(classNames('font-SFUIDisplay'));
        buttons.classList.add(classNames('text-sm'));


        ReactDOM.render(<AppButtons/>, buttons);

        buttonsBlock.appendChild(buttons);
        buttonsBlock.style.cssText = buttonsBlock.style.cssText + ' height:108px !important; display:block !important';
    })
}