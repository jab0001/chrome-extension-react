import React from 'react';
import ReactDOM from 'react-dom';

import "./styles/index.css";

import App from "./parts/AppPopup";
import classNames from './utils/classTransform';

const root = document.createElement('div');
root.classList.add(classNames('parent-flg'));
document.body.appendChild(root);

ReactDOM.render(<App />, root);
