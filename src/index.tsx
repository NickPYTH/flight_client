import React from 'react';
import ReactDOM from 'react-dom';
import {setupStore} from "./store/store";
import ruRU from 'antd/locale/ru_RU';
import {ConfigProvider} from "antd";
import {Router} from "./configs/Router";
import {Provider} from "react-redux";

const store = setupStore();
//@ts-ignore
export const Ext = window['Ext'];
// @ts-ignore
ReactDOM.render(<Provider store={store}>
        <ConfigProvider locale={ruRU}>
            <Router/>
        </ConfigProvider>
    </Provider>,
  document.getElementById('root')
);

