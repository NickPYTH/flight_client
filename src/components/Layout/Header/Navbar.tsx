import React, {useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';

type propsType = {}

const items: MenuProps['items'] = [
    {
        label: 'Заявки',
        key: 'requests',
        children: [
            {
                label: 'Заявка на выполнение полетов',
                key: 'requestTypeOne',
            },
            {
                label: 'Заявка на выполнение полетов филиалы',
                key: 'requestTypeTwo',
            },
            {
                label: 'Заявка на выполнение полетов вертолетами',
                key: 'requestTypeThree',
            },
        ],
    },
    {
        label: 'Планирование',
        key: 'plans',
    },
    {
        label: 'Документы',
        key: 'docs',
    },
    {
        label: 'Справочники',
        key: 'dicts',
    },
    {
        label: 'Отчеты',
        key: 'reports',
    },
    {
        label: 'Администрирование',
        key: 'administration',
    },
    {
        label: 'Справка',
        key: 'help',
    },
];

export const Navbar = (props: propsType) => {
    const [current, setCurrent] = useState('requestTypeOne');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return (
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
    );
};
