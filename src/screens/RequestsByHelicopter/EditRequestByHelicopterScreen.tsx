import React, {useEffect, useState} from "react";
import {Button, Collapse, DatePicker, Divider, Flex, Modal, Select, Spin, Typography} from "antd";
import {RedoOutlined, RollbackOutlined} from "@ant-design/icons";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {alignOptions, justifyOptions} from "../../configs/constants";
import {useLocation, useNavigate} from "react-router-dom";
import {RangeValue} from 'rc-picker/lib/interface'
//@ts-ignore
import {Column, DateColumn, ExtTreegroupedgrid, Grid} from '@sencha/ext-react-modern';
import {Ext} from "../../index";
import {CreateFlightModal} from "../../components/RequestsByFilials/EditRequestByFilials/CreateFlightModal";
import {UpdateFlightModal} from "../../components/RequestsByFilials/EditRequestByFilials/UpdateFlightModal";
import {RequestRoutesGridType} from "./Requests.types";
import dayjs, {Dayjs} from "dayjs";
import {airlinesAPI} from "../../services/AirlineService";
import {AirlineModel} from "../../models/AirlineModel";
import {requestHelicopterAPI} from "../../services/RequestHelicopterService";
import {workTypesAPI} from "../../services/WorkTypesService";
import {WorkTypeModel} from "../../models/WorkTypeModel";

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const {Text} = Typography;

export const EditRequestsByHelicopterScreen = () => {
    // States
    const [requestId, setRequestId] = useState<string>("");
    const [statusId, setStatusId] = useState<string>("");
    const [airline, setAirline] = useState<string>("");
    const [workType, setWorkType] = useState<string>("");
    const [gridData, setGridData] = useState<RequestRoutesGridType[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<RequestRoutesGridType | null>(null);
    const [createFlightModalVisible, setCreateFlightModalVisible] = useState<boolean>(false);
    const [updateFlightModalVisible, setUpdateFlightModalVisible] = useState<boolean>(false);
    const [flyDateStart, setFlyDateStart] = useState<Dayjs | null>(null);
    const [flyDateFinish, setFlyDateFinish] = useState<Dayjs | null>(null);
    const [flightDate, setFlightDate] = useState<any>("");
    // -----

    // Useful utils
    let store = Ext.create('Ext.data.Store', {
        data: gridData,
        groupers: ['workType', 'employee'],
        fields: [
            {name: 'workType', type: 'string'},
            {name: 'employee', type: 'string'},
        ]
    })
    let navigate = useNavigate();
    const location = useLocation();
    //

    // Web requests
    const [getRequestById, {
        data: requestData,
        isLoading: isLoadingGetRequestById,
    }] = requestHelicopterAPI.useGetByIdMutation();
    const [getAllAirlinesRequest, {
        data: airlines,
        isLoading: isAirlinesLoading,
    }] = airlinesAPI.useGetAllMutation();
    const [getAllWorkTypesRequest, {
        data: workTypes,
        isLoading: isWorkTypesLoading,
    }] = workTypesAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllWorkTypesRequest();
        getAllAirlinesRequest();
        getRequestById(location.pathname.split("/")[2]); // get ID from path location
    }, []);
    useEffect(() => {
        if (requestData) {
            setRequestId(requestData.id);
            setAirline(requestData.airlineId);
            setWorkType(requestData.workTypeId);
            setStatusId(requestData.idState);
            setGridData(requestData?.routes.map((route:any) => (
                {
                    dateTime: route.dateTime,
                    cargoWeightOut: route.cargoWeightOut,
                    cargoWeightMount: route.cargoWeightMount,
                    routeId: route.routeId,
                    passengerCount: route.passengerCount,
                    workType: route.workType,
                    airportDeparture: route.airportDeparture,
                    cargoWeightIn: route.cargoWeightIn,
                    id: route.id,
                    employee: route.employee,
                    airportArrival: route.airportArrival
                }
            )));
        }
    }, [requestData]);
    useEffect(() => {
        if (selectedRecord !== null)
            setUpdateFlightModalVisible(true);
    }, [selectedRecord])
    useEffect(() => {
        if (gridData.length > 0) {
            //@ts-ignore
            document?.body?.querySelectorAll("ext-treegroupedgrid")[0]?.cmp?.expandAll();
        }
    }, [gridData]);
    useEffect(() => {
        //@ts-ignore
        document?.body?.querySelectorAll("ext-treegroupedgrid")[0]?.cmp?.expandAll();
    }, [createFlightModalVisible, updateFlightModalVisible]);
    // Handlers
    const backBtnHandler = () => {
        return navigate(`/requestsByHelicopter`);
    }
    const confirmHandler = () => {

    }
    const refresh = () => {
        getRequestById(requestId);
    }
    const selectFlightRangeDateHandler = (value: RangeValue<Dayjs>) => {
        if (value) {
            if (value[0] && value[1]) {
                setFlyDateStart(value[0]);
                setFlyDateFinish(value[1]);
                // updateFieldRequest({
                //     id: requestId,
                //     field: "date",
                //     dateStart: value[0].format('YYYY-MM-DD HH:mm:ss'),
                //     dateFinish: value[1].format('YYYY-MM-DD HH:mm:ss')
                // });
            }
        }
    }
    // -----
    return (
        <>
            <CreateFlightModal visible={createFlightModalVisible} setVisible={setCreateFlightModalVisible}
                               refresh={getRequestById}/>
            {selectedRecord &&
                <UpdateFlightModal visible={updateFlightModalVisible} setVisible={setUpdateFlightModalVisible}
                                   refresh={getRequestById} rowData={selectedRecord} setRowData={setSelectedRecord}/>
            }
            <Flex gap="small" vertical>
                <Navbar title={'Редактирование заявки'}/>
                {(airlines === undefined || requestData === undefined) ?
                    <Flex style={{height: window.innerHeight}} justify={justifyOptions.center}
                          align={alignOptions.center}>
                        <Spin size={'large'}/>
                    </Flex> :
                    <>
                        <Flex justify={justifyOptions.flexStart}>
                            <Flex gap="small" vertical style={{margin: "5px 10px 0 17px"}}>
                                <Flex gap="middle" style={{margin: "0 0 7px 0"}}>
                                    <Button size={'large'} onClick={backBtnHandler} icon={<RollbackOutlined/>}/>
                                    <Button size={'large'} onClick={refresh} icon={<RedoOutlined/>}/>
                                </Flex>
                                <Text>Код заявки <strong>{requestId}</strong></Text>
                                <Text><strong>{requestData.nameState}</strong></Text>
                                <Button size={'middle'} onClick={() => {
                                    Modal.confirm({
                                        title: 'Отправка на согласование',
                                        okText: "Да, отправить",
                                        onOk: () => {
                                        },
                                        content: 'Сформировать заявку на согласование в СОП?',
                                        footer: (_, {OkBtn, CancelBtn}) => (
                                            <>
                                                <CancelBtn/>
                                                <OkBtn/>
                                            </>
                                        ),
                                    });
                                }}>На согласование</Button>
                                {requestData.nameState === 'На согласовании' &&
                                    <>
                                        <Button size={'middle'} onClick={() => {
                                            Modal.confirm({
                                                title: 'Внимание',
                                                okText: "Да, утвердить",
                                                onOk: confirmHandler,
                                                content: 'Вы точно хотите утвердить заявку?',
                                                footer: (_, {OkBtn, CancelBtn}) => (
                                                    <>
                                                        <CancelBtn/>
                                                        <OkBtn/>
                                                    </>
                                                ),
                                            });
                                        }}>Утвердить</Button>
                                        <Button size={'middle'} onClick={() => {
                                            Modal.confirm({
                                                title: 'Внимание',
                                                okText: "Да, отклонить",
                                                onOk: () => {
                                                },
                                                content: 'Вы точно хотите отклонить заявку?',
                                                footer: (_, {OkBtn, CancelBtn}) => (
                                                    <>
                                                        <CancelBtn/>
                                                        <OkBtn/>
                                                    </>
                                                ),
                                            });
                                        }}>Отклонить</Button>
                                    </>
                                }
                            </Flex>
                            <Divider type={'vertical'}
                                     style={{height: requestData.nameState === 'Создано' ? 160 : requestData.nameState === 'Утверждено' || requestData.nameState === 'Отклонено' ? 120 : 200}}/>
                            <Flex gap="small" vertical style={{margin: "5px 10px 0 17px"}}>
                                <Select
                                    style={{width: '100%'}}
                                    disabled={requestData.nameState === 'Утверждено'}
                                    size={'middle'}
                                    placeholder="Филиал"
                                    loading={isAirlinesLoading}
                                    value={airline.toString()}
                                    options={airlines.map((airline: AirlineModel): {
                                        value: string,
                                        label: string
                                    } => ({value: airline.id.toString(), label: airline.name}))}
                                    onSelect={(value) => setAirline(value)}
                                />
                                <Select
                                    style={{width: '100%'}}
                                    disabled={requestData.nameState === 'Утверждено'}
                                    size={'middle'}
                                    placeholder="Филиал"
                                    loading={isWorkTypesLoading}
                                    value={workType.toString()}
                                    options={workTypes?.map((workType: WorkTypeModel): {
                                        value: string,
                                        label: string
                                    } => ({value: workType.id.toString(), label: workType.name}))}
                                    onSelect={(value) => setWorkType(value)}
                                />
                                <DatePicker
                                    defaultValue={dayjs(requestData?.date)}
                                    style={{width: '100%'}}
                                    size={'middle'} showTime onChange={(value) => {
                                    if (value)
                                        setFlightDate(value)
                                }} onOk={(value) => setFlightDate(value)}/>
                                <RangePicker
                                    showTime={true}
                                    defaultValue={[flyDateStart, flyDateFinish]}
                                    value={[dayjs(requestData?.flyDateStart), dayjs(requestData?.flyDateFinish)]}
                                    format={dateFormat}
                                    onChange={selectFlightRangeDateHandler}
                                />
                            </Flex>
                        </Flex>
                        <Collapse defaultActiveKey={['0']} items={[
                            {
                                key: '0',
                                label: 'Плановые полеты',
                                children:
                                    <>
                                        <Flex wrap="wrap" gap="small" justify={justifyOptions.flexStart}
                                              style={{margin: "0 0 15px 0"}}>
                                            <Button disabled={requestData.nameState === 'Утверждено'} size={'middle'}
                                                    style={{width: 152}}
                                                    onClick={() => setCreateFlightModalVisible(true)}>Добавить
                                                маршрут</Button>
                                        </Flex>

                                        {Ext.isDomReady &&
                                            <ExtTreegroupedgrid
                                                collapse={false}
                                                style={{height: window.innerHeight - 325}}
                                                store={store}
                                                columnLines
                                                grouped
                                                shadow={false}

                                                groupSummaryPosition={'docked'}
                                                summaryPosition={'docked'}
                                                onChilddoubletap={(event: any) => {
                                                    if (requestData.nameState !== 'Утверждено')
                                                        setSelectedRecord(event.location.record.data);
                                                }}
                                                columns={[
                                                    {
                                                        text: 'Вид работ',
                                                        dataIndex: 'workType',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        flex: 1,
                                                        hidden: true
                                                    },
                                                    {
                                                        text: 'Ответсвенный',
                                                        dataIndex: 'employee',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        width: 200,
                                                        hidden: true
                                                    },
                                                    {
                                                        text: 'Дата и время вылета',
                                                        dataIndex: 'dateTime',
                                                        groupable: true,
                                                        filterType: 'date',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Аэропорт вылета',
                                                        dataIndex: 'airportDeparture',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Аэропорт назначения',
                                                        dataIndex: 'airportArrival',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Аэропорт назначения',
                                                        dataIndex: 'airportArrival',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Кол-во пассажиров',
                                                        dataIndex: 'passengerCount',
                                                        xtype: 'numbercolumn',
                                                        align: 'center',
                                                        filterType: 'number',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Груз всего, тонн',
                                                        dataIndex: 'cargoWeightMount',
                                                        xtype: 'numbercolumn',
                                                        align: 'center',
                                                        filterType: 'number',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Груз на внешней подвеске, тонн',
                                                        dataIndex: 'cargoWeightOut',
                                                        xtype: 'numbercolumn',
                                                        align: 'center',
                                                        filterType: 'number',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Груз внутри фюзеляжа, тонн',
                                                        dataIndex: 'cargoWeightIn',
                                                        xtype: 'numbercolumn',
                                                        align: 'center',
                                                        filterType: 'number',
                                                        flex: 1
                                                    },
                                                ]}
                                                platformConfig={{
                                                    desktop: {
                                                        plugins: {
                                                            groupingpanel: true,
                                                            gridfilterbar: true
                                                        }
                                                    },
                                                }}
                                            >
                                            </ExtTreegroupedgrid>
                                        }
                                    </>
                            }]}/>
                    </>
                }
            </Flex>
        </>
    )

}