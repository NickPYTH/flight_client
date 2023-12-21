import React, {useEffect, useState} from "react";
import {Navbar} from "../../components/Layout/Header/Navbar";
import "@sencha/best-react-grid/dist/themes/grui.css";
import {Button, Flex, Select, Typography} from "antd";
import {justifyOptions, YEARS} from "../../configs/constants";
import {RequestsGridType} from "./Requests.types";
import {useNavigate} from "react-router-dom";
//@ts-ignore
import {ExtTreegroupedgrid} from '@sencha/ext-react-modern';
import {Ext} from "../../index";
import {requestAPI} from "../../services/RequestService";

const {Text} = Typography;
export const AllRequestsScreen = () => {
    let navigate = useNavigate();
    const [data, setData] = useState<RequestsGridType[]>([]);
    const [getAllRequests, {
        data: dataGetAllRequests,
        isLoading: isLoadingGetAllRequests,
    }] = requestAPI.useGetAllByYearMutation();
    const [year, setYear] = useState<number>(2023);
    const addBtnHandler = () => {
        return navigate(`create`);
    };
    const selectYearHandler = (value: number) => {
        setYear(value);
        getAllRequests(value);
    };
    useEffect(() => {
        getAllRequests(year)
    }, []);
    useEffect(() => {
        if (dataGetAllRequests) {
            setData(dataGetAllRequests)
        }
    }, [dataGetAllRequests]);
    let store = Ext.create('Ext.data.Store', {
        data: data,
        groupers: [],
        fields: [
            {name: 'id', type: 'int'},
            {name: 'createDate', type: 'date', dateFormat: 'c'},
            {name: 'filial', type: 'string'},
            {name: 'nameState', type: 'string'},
        ],
    })
    return (
        <Flex gap="small" vertical>
            <Navbar/>
            <Flex style={{margin: "0 0 0 8px"}} gap={"small"} justify={justifyOptions.center}>
                <Text style={{fontSize: 22, fontWeight: 500}}>Заявки на выполнение полетов филиалы</Text>
            </Flex>
            <Flex style={{margin: "0 5px 0 5px"}} gap={"small"} vertical={false} justify={justifyOptions.spaceBetween}>
                <Button onClick={addBtnHandler}>Добавить</Button>
                <Select
                    disabled={isLoadingGetAllRequests}
                    value={year}
                    onChange={selectYearHandler}
                    options={YEARS.map((year: number) => ({value: year, label: year.toString()}))}
                />
            </Flex>
            <div style={{height: window.innerHeight}}>
                {Ext.isDomReady &&
                    <ExtTreegroupedgrid
                        style={{height: '100%'}}
                        store={store}
                        columnLines
                        grouped
                        shadow={false}
                        groupHeaderTpl='{name} ({group.length})'
                        summaryPosition={'docked'}
                        onChilddoubletap={(event: any) => {
                            const id = event.location.record.data.id;
                            return navigate(`${id}`);
                        }}
                        columns={[
                            {
                                text: 'Код',
                                dataIndex: 'id',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Тип авиасообщения',
                                dataIndex: 'aircraftTypeName',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Номер',
                                dataIndex: 'docNum',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Дата вылета',
                                dataIndex: 'flyDateStart',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Модель ВС',
                                dataIndex: 'aircraftModelName',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Авиакомпания',
                                dataIndex: 'airlineName',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Договор',
                                dataIndex: 'docName',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Цель полета',
                                dataIndex: 'flightTargetName',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Состояние',
                                dataIndex: 'stateName',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                            {
                                text: 'Примечание',
                                dataIndex: 'note',
                                groupable: true,
                                filterType: 'string',
                                flex: 1
                            },
                        ]}
                        platformConfig={{
                            desktop: {
                                plugins: {
                                    groupingpanel: true,
                                }
                            },
                        }}
                    >
                    </ExtTreegroupedgrid>
                }
            </div>
        </Flex>
    )
}