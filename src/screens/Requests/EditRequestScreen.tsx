import React, {useEffect, useRef, useState} from "react";
import {RangeValue} from 'rc-picker/lib/interface'
import dayjs, {Dayjs} from "dayjs";
import {Button, Collapse, DatePicker, Divider, Flex, Form, InputNumber, Select, Spin, Typography} from "antd";
import {RollbackOutlined} from "@ant-design/icons";
import {filialsAPI} from "../../services/FilialsService";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {alignOptions, justifyOptions} from "../../configs/constants";
import {useLocation, useNavigate} from "react-router-dom";
//@ts-ignore
import {ExtTreegroupedgrid} from '@sencha/ext-react-modern';
import {Ext} from "../../index";
import {RequestRoutesGridType} from "./Requests.types";
import {requestAPI} from "../../services/RequestService";
import {FileUploadDND} from "../../components/Requests/FileUploadDnd/FileUploadDND";
import {aircraftModelAPI} from "../../services/AircraftModelService";
import {AircraftModel} from "../../models/AircraftModel";
import {flightTargetAPI} from "../../services/FlightTargetService";
import {FlightTargetModel} from "../../models/FlightTargetModel";
import {empCustomerAPI} from "../../services/EmpCustomerService";
import {EmpCustomerModel} from "../../models/EmpCustomerModel";
import {UpdateFlightModal} from "../../components/Requests/EditRequest/UpdateFlightModal";
import {CreateFlightModal} from "../../components/Requests/EditRequest/CreateFlightModal";
import {HistoryModal} from "../../components/Requests/EditRequest/HistoryModal";
import {CostCreateModalData, CreateCostModal} from "../../components/Requests/EditRequest/CreateCostModal";
import {EditCostModal} from "../../components/Requests/EditRequest/EditCostModal";

const {Text} = Typography;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export const EditRequestScreen = () => {
    // States
    const [requestId, setRequestId] = useState<string>("");
    const [gridData, setGridData] = useState<RequestRoutesGridType[]>([]);
    const [gridFactData, setGridFactData] = useState<RequestRoutesGridType[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<RequestRoutesGridType | null>(null);
    const [selectedCostRecord, setSelectedCostRecord] = useState<CostCreateModalData | null>(null);
    const [createFlightModalVisible, setCreateFlightModalVisible] = useState<boolean>(false);
    const [updateFlightModalVisible, setUpdateFlightModalVisible] = useState<boolean>(false);
    const gridRef = useRef(null);
    const [flyDateStart, setFlyDateStart] = useState<Dayjs | null>(null);
    const [flyDateFinish, setFlyDateFinish] = useState<Dayjs | null>(null);
    const [aircraftModel, setAircraftModel] = useState<string>('');
    const [flightTarget, setFlightTarget] = useState<string>('');
    const [empCustomer, setEmpCustomer] = useState<string>('');
    const [visibleHistoryModal, setVisibleHistoryModal] = useState<boolean>(false);
    const [flightDuration, setFlightDuration] = useState<number>(0);
    const [flightDurationOut, setFlightDurationOut] = useState<number>(0);
    const [cost, setCost] = useState<number>(0);
    const [costOut, setCostOut] = useState<number>(0);
    const [roundDigit, setRoundDigit] = useState<number>(2);
    const [visibleAddCostModal, setVisibleAddCostModal] = useState<boolean>(false);
    const [visibleEditCostModal, setVisibleEditCostModal] = useState<boolean>(false);
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
    let factStore = Ext.create('Ext.data.Store', {
        data: gridFactData,
        groupers: ['workType', 'employee'],
        fields: [
            {name: 'workType', type: 'string'},
            {name: 'employee', type: 'string'},
        ]
    })
    let navigate = useNavigate();
    const location = useLocation();
    // -----

    // Web requests
    const [getRequestById, {
        data: requestData,
        isLoading: isLoadingGetRequestById,
    }] = requestAPI.useGetByIdMutation();
    const [getAllFilialsRequest, {
        data: filials,
        isLoading: isFilialsLoading,
    }] = filialsAPI.useGetAllMutation();
    const [getAllAircraftModelRequest, {
        data: aircraftModelData,
        isLoading: isAircraftModelLoading,
    }] = aircraftModelAPI.useGetAllMutation();
    const [getAllFlightTargetRequest, {
        data: flightTargetData,
        isLoading: isFlightTargetLoading,
    }] = flightTargetAPI.useGetAllMutation();
    const [getAllEmpCustomerRequest, {
        data: empCustomerData,
        isLoading: isEmpCustomerLoading,
    }] = empCustomerAPI.useGetAllMutation();
    const [updateFieldRequest, {}] = requestAPI.useUpdateDateMutation();
    const [getAllCosts, {
        data: costs,
        isLoading: isCostsLoading,
    }] = requestAPI.useGetCostsMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllEmpCustomerRequest();
        getAllFlightTargetRequest();
        getAllAircraftModelRequest();
        getAllFilialsRequest();
        getAllCosts(location.pathname.split("/")[2]);
        getRequestById(location.pathname.split("/")[2]); // get ID from path location
    }, []);
    useEffect(() => {
        if (requestData) {
            setRoundDigit(requestData.roundDigit);
            setCost(requestData.cost ?? 0);
            setCostOut(requestData.cost ?? 0);
            setFlightDuration(requestData.duration ?? 0);
            setFlightDurationOut(requestData.durationOut ?? 0);
            setRequestId(requestData.id);
            setGridData(requestData?.routes.map((route) => (
                {
                    "dateTime": route.dateTime,
                    "cargoWeightOut": route.cargoWeightOut,
                    "cargoWeightMount": route.cargoWeightMount,
                    "routeId": route.routeId,
                    "passengerCount": route.passengerCount,
                    "workType": route.workType,
                    "airportDeparture": route.airportDeparture,
                    "cargoWeightIn": route.cargoWeightIn,
                    "id": route.id,
                    "employee": route.employee,
                    "airportArrival": route.airportArrival,
                    "idFlightFilial": "",
                    "idFuelPoint": ""
                }
            )));
            setGridFactData(requestData?.factRoutes.map((route) => (
                {
                    "dateTime": route.dateTime,
                    "cargoWeightOut": route.cargoWeightOut,
                    "cargoWeightMount": route.cargoWeightMount,
                    "routeId": route.routeId,
                    "passengerCount": route.passengerCount,
                    "workType": route.workType,
                    "airportDeparture": route.airportDeparture,
                    "cargoWeightIn": route.cargoWeightIn,
                    "id": route.id,
                    "employee": route.employee,
                    "airportArrival": route.airportArrival,
                    "idFlightFilial": "",
                    "idFuelPoint": ""
                }
            )));
            setFlyDateStart(dayjs(requestData.flyDateStart.slice(0, 19), dateFormat));
            setFlyDateFinish(dayjs(requestData.flyDateFinish.slice(0, 19), dateFormat));
            setAircraftModel(`${requestData.aircraftModelName}/${requestData.airlineName}/${requestData.airlineName}`);
            setFlightTarget(requestData.flightTargetName);
            setEmpCustomer(requestData.empCustomerLastName + " " + requestData.empCustomerName + " " + requestData.empCustomerSecondName);
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
    }, [updateFlightModalVisible]);
    // Handlers
    const backBtnHandler = () => {
        return navigate(`/requests`);
    }
    const refresh = () => {
        getRequestById(requestId);
    }
    const selectFlightRangeDateHandler = (value: RangeValue<Dayjs>) => {
        if (value) {
            if (value[0] && value[1]) {
                setFlyDateStart(value[0]);
                setFlyDateFinish(value[1]);
                updateFieldRequest({
                    id: requestId,
                    field: "date",
                    dateStart: value[0].format('YYYY-MM-DD HH:mm:ss'),
                    dateFinish: value[1].format('YYYY-MM-DD HH:mm:ss')
                });
            }
        }
    }
    const selectAircraftModelHandler = (value: string, option: any) => {
        setAircraftModel(value);
        updateFieldRequest({
            id: requestId,
            field: "aircraft",
            idContractData: option.value,
        });
    }
    const selectFlightTargetHandler = (value: string, option: any) => {
        updateFieldRequest({
            id: requestId,
            field: "target",
            idTarget: option.value,
        });
        setFlightTarget(value);
    }
    const selectEmpCustomerHandler = (value: string, option: any) => {
        updateFieldRequest({
            id: requestId,
            field: "empCustomer",
            idEmpCustomer: option.value,
        });
        setEmpCustomer(value);
    }
    const setFlightDurationHandler = (value: number | null) => {
        if (value) {
            setFlightDuration(value);
            updateFieldRequest({
                id: requestId,
                field: "flightDuration",
                value: value,
            });
        }
    }
    const setFlightDurationOutHandler = (value: number | null) => {
        if (value) {
            setFlightDurationOut(value);
            updateFieldRequest({
                id: requestId,
                field: "flightDurationOut",
                value: value,
            });
        }
    }
    const setRoundDigitHandler = (value: number, option: any) => {
        setRoundDigit(option.value);
        updateFieldRequest({
            id: requestId,
            field: "roundDigit",
            value: value,
        });
    }
    const setCostHandler = (value: number | null) => {
        if (value) {
            setCost(value);
            updateFieldRequest({
                id: requestId,
                field: "cost",
                value: value,
            });
        }
    }
    const setCostOutHandler = (value: number | null) => {
        if (value) {
            setCostOut(value);
            updateFieldRequest({
                id: requestId,
                field: "costOut",
                value: value,
            });
        }
    }
    // -----
    return (
        <>
            {visibleHistoryModal &&
                <HistoryModal visible={visibleHistoryModal} setVisible={setVisibleHistoryModal} requestId={requestId}/>
            }
            {createFlightModalVisible &&
                <CreateFlightModal visible={createFlightModalVisible} setVisible={setCreateFlightModalVisible}
                                   refresh={getRequestById}/>
            }
            {selectedRecord &&
                <UpdateFlightModal visible={updateFlightModalVisible} setVisible={setUpdateFlightModalVisible}
                                   refresh={getRequestById} rowData={selectedRecord} setRowData={setSelectedRecord}/>
            }
            <CreateCostModal visible={visibleAddCostModal} setVisible={setVisibleAddCostModal} requestId={requestId}
                             refresh={getAllCosts}/>
            {selectedCostRecord &&
                <EditCostModal visible={visibleEditCostModal} setVisible={setVisibleEditCostModal} requestId={requestId}
                               refresh={getAllCosts} data={selectedCostRecord}/>}
            <Flex gap="small" vertical>
                <Navbar title={'Редактирование заявки'}/>
                {(filials === undefined || requestData === undefined) ?
                    <Flex style={{height: window.innerHeight}} justify={justifyOptions.center}
                          align={alignOptions.center}>
                        <Spin size={'large'}/>
                    </Flex> :
                    <>
                        <Flex justify={justifyOptions.flexStart}>
                            <Flex gap="small" vertical style={{margin: "5px 10px 0 17px"}}>
                                <Text><strong>На согласовании</strong></Text>
                                <Text>Номер заявки <strong>{requestId}</strong></Text>
                                <Text>Код заявки <strong>{requestId}</strong></Text>
                                <Button style={{marginTop: 5,}}>Полет выполнен</Button>
                                <Button danger>Полет отклонен</Button>
                                <Button onClick={backBtnHandler} icon={<RollbackOutlined/>}>Вернуться в меню</Button>
                                {/*<Button onClick={() => setVisibleHistoryModal(true)}*/}
                                {/*        icon={<HistoryOutlined/>}>История редактирования</Button>*/}
                            </Flex>
                            <Divider type={'vertical'} style={{height: 230}}/>
                            <Flex vertical gap={"small"} style={{width: 550}}>
                                <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                                    <Text>Дата полета</Text>
                                    <RangePicker
                                        style={{width: 400}}
                                        showTime={true}
                                        value={[flyDateStart, flyDateFinish]}
                                        format={dateFormat}
                                        onChange={selectFlightRangeDateHandler}
                                    />
                                </Flex>
                                <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                                    <Text>Воздушное судно</Text>
                                    <Select
                                        value={aircraftModel}
                                        disabled={isAircraftModelLoading}
                                        size={'middle'}
                                        placeholder="Воздушное судно"
                                        loading={isFilialsLoading}
                                        style={{width: 400}}
                                        options={aircraftModelData?.map((aircraftModel: AircraftModel): {
                                            value: string,
                                            label: string
                                        } => ({
                                            value: aircraftModel.idContractData.toString(),
                                            label: `${aircraftModel.aircraftModelName}/${aircraftModel.contractName}/${aircraftModel.airlineName}`
                                        }))}
                                        onSelect={selectAircraftModelHandler}
                                    />
                                </Flex>
                                <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                                    <Text>Цель полета</Text>
                                    <Select
                                        value={flightTarget}
                                        disabled={isFlightTargetLoading}
                                        size={'middle'}
                                        placeholder="Цель полета"
                                        loading={isFilialsLoading}
                                        style={{width: 400}}
                                        options={flightTargetData?.map((flightTargetModel: FlightTargetModel): {
                                            value: string,
                                            label: string
                                        } => ({
                                            value: flightTargetModel.id.toString(),
                                            label: flightTargetModel.name
                                        }))}
                                        onSelect={selectFlightTargetHandler}
                                    />
                                </Flex>
                                <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                                    <Text>ФИО заказчика</Text>
                                    <Select
                                        value={empCustomer}
                                        disabled={isFlightTargetLoading}
                                        size={'middle'}
                                        placeholder="ФИО заказчика"
                                        loading={isFilialsLoading}
                                        style={{width: 400}}
                                        options={empCustomerData?.map((empCustomerModel: EmpCustomerModel) => ({
                                            value: empCustomerModel.id.toString(),
                                            label: empCustomerModel.empLastName + " " + empCustomerModel.empName + " " + empCustomerModel.empSecondName
                                        }))}
                                        onSelect={selectEmpCustomerHandler}
                                    />
                                </Flex>
                            </Flex>
                            <Divider type={'vertical'} style={{height: 230, marginLeft: 23}}/>
                            <Flex gap="small" vertical style={{margin: "5px 0 0 13px"}}>
                                {requestId &&
                                    <FileUploadDND requestId={requestId}/>
                                }
                            </Flex>
                        </Flex>
                        <Collapse defaultActiveKey={['1']} items={[
                            {
                                key: '0',
                                label: 'Затраты',
                                children: <>
                                    <Flex wrap="wrap" gap="large" justify={justifyOptions.flexStart}>
                                        <Form labelCol={{span: 9}} wrapperCol={{span: 8}}>
                                            <Form.Item label="Время полета">
                                                <InputNumber style={{width: 200}} value={flightDuration}
                                                             onChange={setFlightDurationHandler}/>
                                            </Form.Item>
                                            <Form.Item label="Налет в долях, ч">
                                                <InputNumber style={{width: 200}} value={flightDurationOut}
                                                             onChange={setFlightDurationOutHandler}/>
                                            </Form.Item>
                                            <Form.Item label="Итого">
                                                <InputNumber style={{width: 200}} value={costOut}
                                                             onChange={setCostOutHandler}/>
                                            </Form.Item>
                                        </Form>
                                        {/*<Form labelCol={{span: 12}} wrapperCol={{span: 8}}>*/}
                                        {/*    <Form.Item label="Время полета (с подвеской)">*/}
                                        {/*        <InputNumber style={{width: 200}} value={flightDuration}*/}
                                        {/*                     onChange={setFlightDurationHandler}/>*/}
                                        {/*    </Form.Item>*/}
                                        {/*    <Form.Item label="Налет в долях, ч (с подвеской)">*/}
                                        {/*        <InputNumber style={{width: 200}} value={flightDuration}*/}
                                        {/*                     onChange={setFlightDurationHandler}/>*/}
                                        {/*    </Form.Item>*/}
                                        {/*    <Form.Item label="В т.ч. к оплате (с подвеской)">*/}
                                        {/*        <InputNumber style={{width: 200}} value={flightDuration}*/}
                                        {/*                     onChange={setFlightDurationHandler}/>*/}
                                        {/*    </Form.Item>*/}
                                        {/*</Form>*/}
                                        <Form labelCol={{span: 9}} wrapperCol={{span: 8}}>
                                            <Form.Item label="Стоимость">
                                                <InputNumber style={{width: 200}} value={cost}
                                                             onChange={setCostHandler}/>
                                            </Form.Item>
                                            <Form.Item label="Округлить до">
                                                <Select
                                                    value={roundDigit}
                                                    disabled={isAircraftModelLoading}
                                                    size={'middle'}
                                                    placeholder="В т.ч. к оплате (с подвеской)"
                                                    loading={isFilialsLoading}
                                                    style={{width: 200}}
                                                    options={[{
                                                        value: 2,
                                                        label: '2 знаков'
                                                    }, {
                                                        value: 3,
                                                        label: '3 знаков'
                                                    }]}
                                                    onSelect={setRoundDigitHandler}
                                                />
                                            </Form.Item>
                                        </Form>
                                    </Flex>
                                    <Button style={{marginBottom: 10}}
                                            onClick={() => setVisibleAddCostModal(true)}>Добавить</Button>
                                    {Ext.isDomReady &&
                                        <ExtTreegroupedgrid
                                            data={costs}
                                            collapse={false}
                                            ref={gridRef}
                                            style={{height: 250}}
                                            columnLines
                                            grouped
                                            shadow={false}
                                            groupSummaryPosition={'docked'}
                                            summaryPosition={'docked'}
                                            onChilddoubletap={(event: any) => {
                                                setVisibleEditCostModal(true);
                                                setSelectedCostRecord({
                                                    selectedFilialId: event.location.record.data.filialId,
                                                    selectedWorkType: event.location.record.data.workTypeId,
                                                    flightDuration: event.location.record.data.duration,
                                                    flightCost: event.location.record.data.cost,
                                                    costId: event.location.record.data.costId
                                                });
                                            }}
                                            columns={[
                                                {
                                                    text: 'Филиал',
                                                    dataIndex: 'filialName',
                                                    groupable: true,
                                                    filterType: 'string',
                                                    flex: 1,
                                                },
                                                {
                                                    text: 'Вид работ',
                                                    dataIndex: 'workTypeName',
                                                    groupable: true,
                                                    filterType: 'string',
                                                    width: 200,
                                                },
                                                {
                                                    text: 'Налет (час)',
                                                    dataIndex: 'duration',
                                                    groupable: true,
                                                    filterType: 'string',
                                                    flex: 1
                                                },
                                                {
                                                    text: 'Затраты (руб.)',
                                                    dataIndex: 'cost',
                                                    groupable: true,
                                                    filterType: 'string',
                                                    flex: 1
                                                },
                                                {
                                                    text: 'Тариф',
                                                    dataIndex: 'airportArrival',
                                                    groupable: true,
                                                    filterType: 'string',
                                                    flex: 1,
                                                    hidden: true
                                                },
                                            ]}
                                        >
                                        </ExtTreegroupedgrid>
                                    }
                                </>,
                            },
                            {
                                key: '1',
                                label: 'Плановые полеты',
                                children: <>
                                    <Flex wrap="wrap" gap="small" justify={justifyOptions.flexStart}
                                          style={{margin: "0px 0px 15px 0px"}}>
                                        <Button disabled={requestData.stateName === 'Утверждено'} size={'middle'}
                                                style={{width: 230}}
                                                onClick={() => setCreateFlightModalVisible(true)}>Добавить
                                            маршрут</Button>
                                    </Flex>
                                    {Ext.isDomReady &&
                                        <ExtTreegroupedgrid
                                            collapse={false}
                                            ref={gridRef}
                                            style={{height: 440}}
                                            store={store}
                                            columnLines
                                            grouped
                                            shadow={false}
                                            groupSummaryPosition={'docked'}
                                            summaryPosition={'docked'}
                                            onChilddoubletap={(event: any) => {
                                                if (requestData.stateName !== 'Утверждено')
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
                                                    filterType: 'string',
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
                                                    text: 'Место дозаправки',
                                                    dataIndex: 'idFuelPoint',
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
                                </>,
                            },
                            {
                                key: '2',
                                label: 'Фактические полеты',
                                children: <>
                                    <Flex wrap="wrap" gap="small" justify={justifyOptions.flexStart}
                                          style={{margin: "0px 0px 15px 0px"}}>
                                        <Button disabled={requestData.stateName === 'Утверждено'} size={'middle'}
                                                style={{width: 230}}
                                                onClick={() => setCreateFlightModalVisible(true)}>Добавить
                                            маршрут</Button>
                                    </Flex>
                                    {Ext.isDomReady &&
                                        <ExtTreegroupedgrid
                                            collapse={false}
                                            ref={gridRef}
                                            style={{height: 440}}
                                            store={factStore}
                                            columnLines
                                            grouped
                                            shadow={false}
                                            groupHeaderTpl='{name} ({group.length})'
                                            groupSummaryPosition={'docked'}
                                            summaryPosition={'docked'}
                                            onChilddoubletap={(event: any) => {
                                                if (requestData.stateName !== 'Утверждено')
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
                                </>,
                            },
                        ]}/>
                    </>
                }
            </Flex>
        </>
    )

}