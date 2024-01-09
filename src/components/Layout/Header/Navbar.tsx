import React, {useState} from 'react';
import type {MenuProps} from 'antd';
import {Dropdown, Flex, Menu, Typography} from 'antd';
import {useNavigate} from "react-router-dom";
import {alignOptions, justifyOptions} from "../../../configs/constants";

const {Text} = Typography;

type propsType = {
    title: string
}

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
        } else if (e.key === "requestTypeThree") {
            return navigate(`/requestsByHelicopter`);
        } else {
            return navigate('/cosmos')
        }
    };


    return (
        <>
            {/*<Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>*/}
            <div style={{width: window.innerWidth, height: 75, backgroundColor: '#2196f3', padding: 10}}>
                <Text style={{color: 'white', fontSize: 24, height: '20px'}}>{props.title}</Text>
                <Flex style={{width: '100%', height: '50px'}} justify={justifyOptions.flexStart}
                      align={alignOptions.center}>
                    {/*// @ts-ignore*/}
                    <Dropdown trigger={['click']} menu={{items: items[0].children, onClick: onClick}}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Text style={{color: 'white', fontSize: 16, marginRight: 15}}>
                                Заявки
                            </Text>
                        </a>
                    </Dropdown>
                    {/*// @ts-ignore*/}
                    <Dropdown trigger={['click']} menu={{items: items[0].children}}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Text style={{color: 'white', fontSize: 16, marginRight: 15}}>
                                Планирование
                            </Text>
                        </a>
                    </Dropdown>
                    {/*// @ts-ignore*/}
                    <Dropdown trigger={['click']} menu={{items: items[0].children}}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Text style={{color: 'white', fontSize: 16, marginRight: 15}}>
                                Документы
                            </Text>
                        </a>
                    </Dropdown>
                    {/*// @ts-ignore*/}
                    <Dropdown trigger={['click']} menu={{items: items[0].children}}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Text style={{color: 'white', fontSize: 16, marginRight: 15}}>
                                Справочники
                            </Text>
                        </a>
                    </Dropdown>
                    {/*// @ts-ignore*/}
                    <Dropdown trigger={['click']} menu={{items: items[0].children}}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Text style={{color: 'white', fontSize: 16, marginRight: 15}}>
                                Отчеты
                            </Text>
                        </a>
                    </Dropdown>
                    {/*// @ts-ignore*/}
                    <Dropdown trigger={['click']} menu={{items: items[0].children}}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Text style={{color: 'white', fontSize: 16, marginRight: 15}}>
                                Администрирование
                            </Text>
                        </a>
                    </Dropdown>
                    {/*// @ts-ignore*/}
                    <Dropdown trigger={['click']} menu={{items: items[0].children}}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Text style={{color: 'white', fontSize: 16, marginRight: 15}}>
                                Справка
                            </Text>
                        </a>
                    </Dropdown>
                </Flex>
            </div>
        </>
    );
};
