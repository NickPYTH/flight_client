import React, {useEffect, useState} from "react";
import {Navbar} from "../../components/Layout/Header/Navbar";
import "@sencha/best-react-grid/dist/themes/grui.css";
import {Button, Flex, Select, Typography} from "antd";
import {justifyOptions, YEARS} from "../../configs/constants";
import {requestsByFilialsAPI} from "../../services/RequestFilialService";
import {RequestsByFilialsGridType} from "./RequestsFilials.types";
import {useNavigate} from "react-router-dom";
//@ts-ignore
import {ExtTreegroupedgrid} from '@sencha/ext-react-modern';
import {Ext} from "../../index";

const { Text } = Typography;

export const AllRequestsByFilialsScreen = () => {
    let navigate = useNavigate();
    const [data, setData] = useState<RequestsByFilialsGridType[]>([]);
    const [getAllRequestsByFilials, {
        data: dataGetAllRequestByFilials,
        isLoading: isLoadingGetAllRequestByFilials,
    }] = requestsByFilialsAPI.useGetAllByYearMutation();
    const [year, setYear] = useState<number>(2023);
    const addBtnHandler = () => {
        return navigate(`create`);
    };
    const selectYearHandler = (value: number) => {
        setYear(value);
        getAllRequestsByFilials(value);
    };
    useEffect(() => {
        getAllRequestsByFilials(year)
    }, []);
    useEffect(() => {
        if (dataGetAllRequestByFilials) {
            setData(dataGetAllRequestByFilials)
        }
    }, [dataGetAllRequestByFilials]);
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
            <Navbar title={'Заявки на выполнение полетов'}/>
            <Flex style={{margin: "0 5px 0 5px"}} gap={"small"} justify={justifyOptions.spaceBetween}>
                <Button onClick={addBtnHandler}>Добавить</Button>
                <Select
                    disabled={isLoadingGetAllRequestByFilials}
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
                                text: 'ИД',
                                dataIndex: 'id',
                                groupable: true,
                                filterType: 'string',
                                width: 200
                            },
                            {
                                text: 'Дата создания',
                                dataIndex: 'createDate',
                                groupable: true,
                                filterType: 'list',
                                width: 300,
                            },
                            {
                                text: 'Филиал',
                                dataIndex: 'nameFilial',
                                groupable: true,
                                summary: 'count',
                                width: 300
                            },
                            {
                                text: 'Состояние',
                                dataIndex: 'nameState',
                                groupable: true,
                                summary: 'count',
                                width: 300
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