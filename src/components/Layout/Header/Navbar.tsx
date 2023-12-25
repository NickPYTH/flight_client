import React, {useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {useNavigate} from "react-router-dom";

type propsType = {}

const items: MenuProps['items'] = [
    {
        label: 'Заявки',
        key: 'requests',
        children: [
            {
                label: 'Заявки на выполнение полетов',
                key: 'requestTypeOne',
            },
            {
                label: 'Заявки на выполнение полетов филиалы',
                key: 'requestTypeTwo',
            },
            {
                label: 'Заявки на выполнение полетов вертолетами',
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
    let navigate = useNavigate();
    const [current, setCurrent] = useState('requestTypeOne');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        if (e.key === "requestTypeOne") {
            return navigate(`/requestsFilials`);
        } else if (e.key === "requestTypeTwo") {
            return navigate(`/requests`);
        }
        else if (e.key === "requestTypeThree") {
            return navigate(`/requestsByHelicopter`);
        }
        else{
            return navigate('/cosmos')
        }
    };

    return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
    );
};
