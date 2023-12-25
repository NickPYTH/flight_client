import React, {useEffect, useState} from "react";
import {RangeValue} from 'rc-picker/lib/interface'
import {Dayjs} from "dayjs";
import {
    Button,
    Collapse,
    DatePicker,
    Divider,
    Flex,
    Form,
    message,
    Modal,
    Select,
    Spin,
    Tooltip,
    Typography
} from "antd";
import {PlusOutlined, RollbackOutlined} from "@ant-design/icons";
import {filialsAPI} from "../../services/FilialsService";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {alignOptions, justifyOptions} from "../../configs/constants";
import {useNavigate} from "react-router-dom";
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
import {UpdateFlightModal} from "../../components/Requests/CreateRequest/UpdateFlightModal";
import {CreateFlightModal} from "../../components/Requests/CreateRequest/CreateFlightModal";

const {Text} = Typography;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export const CreateRequestScreen = () => {
    // States
    const [messageApi, messageContextHolder] = message.useMessage();
    const [requestId, setRequestId] = useState<string>("");
    const [gridData, setGridData] = useState<RequestRoutesGridType[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<RequestRoutesGridType | null>(null);
    const [createFlightModalVisible, setCreateFlightModalVisible] = useState<boolean>(false);
    const [updateFlightModalVisible, setUpdateFlightModalVisible] = useState<boolean>(false);
    const [flyDateStart, setFlyDateStart] = useState<Dayjs | null>(null);
    const [flyDateFinish, setFlyDateFinish] = useState<Dayjs | null>(null);
    const [aircraftModel, setAircraftModel] = useState<string>('');
    const [flightTarget, setFlightTarget] = useState<string>('');
    const [empCustomer, setEmpCustomer] = useState<string>('');
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
    const missingField = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Web requests
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
    const [createRequest, {
        data: createResponse,
        isLoading: isCreateRequestLoading,
    }] = requestAPI.useCreateMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllEmpCustomerRequest();
        getAllFlightTargetRequest();
        getAllAircraftModelRequest();
        getAllFilialsRequest();
    }, []);
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
    const createRequestHandler = () => {
        if (!flyDateStart || !flyDateFinish)
            missingField('Вы не выбрали дату полета');
        if (aircraftModel.trim().length === 0)
            missingField('Вы не выбрали воздушное судно');
        if (flightTarget.trim().length === 0)
            missingField('Вы не выбрали цель полета');
        if (flightTarget.trim().length === 0)
            missingField('Вы не указали ФИО заказчика');
        console.log(gridData);
        createRequest({
            flyDateStart: flyDateStart,
            flyDateFinish: flyDateFinish,
            aircraftModelId: 1,
            contractDataId: 1,
            flightTargetId: 1,
            empCustomerId: 1,
            routes: gridData
        });
    }
    // -----

    return (
        <>
            {messageContextHolder}
            {createFlightModalVisible &&
                <CreateFlightModal setGridData={setGridData} visible={createFlightModalVisible}
                                   setVisible={setCreateFlightModalVisible}
                />
            }
            {selectedRecord &&
                <UpdateFlightModal setGridData={setGridData} visible={updateFlightModalVisible}
                                   setVisible={setUpdateFlightModalVisible}
                                   rowData={selectedRecord} setRowData={setSelectedRecord}/>
            }
            <Flex gap="small" vertical>
                <Navbar/>
                {filials === undefined ?
                    <Flex style={{height: window.innerHeight}} justify={justifyOptions.center}
                          align={alignOptions.center}>
                        <Spin size={'large'}/>
                    </Flex> :
                    <>
                        <Flex justify={justifyOptions.flexStart}>
                            <Flex gap="small" vertical style={{margin: "5px 10px 0 17px"}}>
                                <Flex gap="middle" style={{margin: "0 0 7px 0"}}>
                                    <Button size={'large'} onClick={() => {
                                        Modal.confirm({
                                            onOk: () => backBtnHandler(),
                                            okText: 'Да',
                                            title: 'Вернуться в меню?',
                                            content: 'На этой странице есть изменения, которые будут потеряны, если вы решите закрыть ее.',
                                            footer: (_, {OkBtn, CancelBtn}) => (
                                                <>
                                                    <CancelBtn/>
                                                    <OkBtn/>
                                                </>
                                            ),
                                        });
                                    }} icon={<RollbackOutlined/>}/>
                                    <Tooltip title={"Создать заявку"} placement="right">
                                        <Button type={'primary'} ghost size={'large'} onClick={createRequestHandler}
                                                icon={<PlusOutlined/>}/>
                                    </Tooltip>
                                </Flex>
                                <Text>Код заявки <strong>N/A</strong></Text>
                                <Text><strong>Заявка создается</strong></Text>
                            </Flex>
                            <Divider type={'vertical'} style={{height: 237}}/>
                            <Flex gap="small" vertical style={{margin: "20px 0 0 13px"}}>
                                <Form
                                    style={{maxWidth: 600}}
                                    // @ts-ignore
                                    labelCol={{span: 8}}
                                    wrapperCol={{span: 20}}
                                >
                                    <Form.Item label="Дата полета">
                                        <RangePicker
                                            showTime={true}
                                            value={[flyDateStart, flyDateFinish]}
                                            format={dateFormat}
                                            onChange={selectFlightRangeDateHandler}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Воздушное судно">
                                        <Select
                                            value={aircraftModel}
                                            disabled={isAircraftModelLoading}
                                            size={'middle'}
                                            placeholder="Воздушное судно"
                                            loading={isFilialsLoading}
                                            style={{width: '100%'}}
                                            options={aircraftModelData?.map((aircraftModel: AircraftModel): {
                                                value: string,
                                                label: string
                                            } => ({
                                                value: aircraftModel.idContractData.toString(),
                                                label: `${aircraftModel.aircraftModelName}/${aircraftModel.contractName}/${aircraftModel.airlineName}`
                                            }))}
                                            onSelect={selectAircraftModelHandler}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Цель полета">
                                        <Select
                                            value={flightTarget}
                                            disabled={isFlightTargetLoading}
                                            size={'middle'}
                                            placeholder="Цель полета"
                                            loading={isFilialsLoading}
                                            style={{width: '100%'}}
                                            options={flightTargetData?.map((flightTargetModel: FlightTargetModel): {
                                                value: string,
                                                label: string
                                            } => ({
                                                value: flightTargetModel.id.toString(),
                                                label: flightTargetModel.name
                                            }))}
                                            onSelect={selectFlightTargetHandler}
                                        />
                                    </Form.Item>
                                    <Form.Item label="ФИО заказчика">
                                        <Select
                                            value={empCustomer}
                                            disabled={isFlightTargetLoading}
                                            size={'middle'}
                                            placeholder="ФИО заказчика"
                                            loading={isFilialsLoading}
                                            style={{width: '100%'}}
                                            options={empCustomerData?.map((empCustomerModel: EmpCustomerModel) => ({
                                                value: empCustomerModel.id.toString(),
                                                label: empCustomerModel.empLastName + " " + empCustomerModel.empName + " " + empCustomerModel.empSecondName
                                            }))}
                                            onSelect={selectEmpCustomerHandler}
                                        />
                                    </Form.Item>
                                </Form>
                            </Flex>
                            <Divider type={'vertical'} style={{height: 237, marginLeft: 23}}/>
                            <Flex gap="small" vertical style={{margin: "5px 0 0 13px"}}>
                                {requestId &&
                                    <FileUploadDND requestId={requestId}/>
                                }
                            </Flex>
                        </Flex>
                        <Collapse defaultActiveKey={['1']} items={[
                            {
                                key: '1',
                                label: 'Плановые полеты',
                                children: <>
                                    <Flex wrap="wrap" gap="small" justify={justifyOptions.flexStart}
                                          style={{margin: "0px 0px 15px 0px"}}>
                                        <Button size={'middle'}
                                                style={{width: 230}}
                                                onClick={() => setCreateFlightModalVisible(true)}>Добавить
                                            маршрут</Button>
                                    </Flex>
                                    {Ext.isDomReady &&
                                        <ExtTreegroupedgrid
                                            collapse={false}
                                            style={{height: 440}}
                                            store={store}
                                            columnLines
                                            grouped
                                            shadow={false}
                                            groupSummaryPosition={'docked'}
                                            summaryPosition={'docked'}
                                            onChilddoubletap={(event: any) => {
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
                        ]}/>
                    </>
                }
            </Flex>
        </>
    )

}