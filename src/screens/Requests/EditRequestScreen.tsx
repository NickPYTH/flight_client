import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Collapse,
    DatePicker,
    Divider,
    Flex,
    Form,
    message,
    Select,
    Spin,
    Tag,
    Typography,
    UploadProps
} from "antd";
import {RedoOutlined, RollbackOutlined, SaveOutlined} from "@ant-design/icons";
import {filialsAPI} from "../../services/FilialsService";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {alignOptions, justifyOptions} from "../../configs/constants";
import {useLocation, useNavigate} from "react-router-dom";
import {requestsByFilialsAPI} from "../../services/RequestFilialService";
//@ts-ignore
import {ExtTreegroupedgrid} from '@sencha/ext-react-modern';
import {Ext} from "../../index";
import {CreateFlightModal} from "../../components/RequestsByFilials/EditRequestByFilialScreen/CreateFlightModal";
import {UpdateFlightModal} from "../../components/RequestsByFilials/EditRequestByFilialScreen/UpdateFlightModal";
import {RequestRoutesGridType} from "./Requests.types";
import {requestAPI} from "../../services/RequestService";
import dayjs from 'dayjs';
import {FileUploadDND} from "../../components/Requests/FileUploadDnd/FileUploadDND";
import {aircraftModelAPI} from "../../services/AircraftModelService";
import {AircraftModel} from "../../models/AircraftModel";
import {flightTargetAPI} from "../../services/FlightTargetService";
import {FlightTargetModel} from "../../models/FlightTargetModel";
import {empCustomerAPI} from "../../services/EmpCustomerService";
import {EmpCustomerModel} from "../../models/EmpCustomerModel";

const {Text} = Typography;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export const EditRequestScreen = () => {
    // States
    const [requestId, setRequestId] = useState<string>("");
    const [statusId, setStatusId] = useState<string>("");
    const [filialId, setFilialId] = useState<string>("");
    const [fileId, setFileId] = useState<number | null>(null);
    const [fileList, setFileList] = useState<any | null>(null);
    const [fileUploading, setFileUploading] = useState<boolean>(false);
    const [gridData, setGridData] = useState<RequestRoutesGridType[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<RequestRoutesGridType | null>(null);
    const [createFlightModalVisible, setCreateFlightModalVisible] = useState<boolean>(false);
    const [updateFlightModalVisible, setUpdateFlightModalVisible] = useState<boolean>(false);
    const gridRef = useRef(null);
    const [flyDateStart, setFlyDateStart] = useState<string>('');
    const [flyDateFinish, setFlyDateFinish] = useState<string>('');
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
    const location = useLocation();
    const propsFile: UploadProps = {
        maxCount: 1,
        customRequest: (e: any) => {
            const formData = new FormData();
            formData.append("fileName", e.file.name);
            formData.append("idRequestFilial", filialId);
            formData.append("fileBody", e.file);
            setFileUploading(true);
            fetch('http://localhost:8080/flight/api/file/create', {
                method: 'POST',
                body: formData,
            })
                .then((res) => {
                    return res.text()
                })
                .then((m) => {
                    setFileList([{
                        uid: e.file.uid,
                        id: JSON.parse(m).id,
                        name: e.file.name,
                        status: "done",
                        url: `http://localhost:8080/flight/api/file/get?id=${JSON.parse(m).id}`,
                        percent: 100
                    }]);
                    message.success('Файл обновлен');
                })
                .catch((error) => {
                    message.error('Ошибка загрузки файла');
                })
                .finally(() => {
                    setFileUploading(false);
                });
        },
        beforeUpload: (file) => {
            return true;
        },
        onRemove: (file) => {
            let requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };
            //@ts-ignore
            fetch(`http://localhost:8080/flight/api/file/delete?id=${fileId}`, requestOptions)
                .then(response => {
                })
                .then(result => {
                    message.error('Файл удален');
                    setFileList([]);
                })
                .catch(error => {
                    message.error('Ошибка удаления файла');
                    console.log('error', error);
                });
        },
        fileList,
    }
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 20}};
    // -----current.cmp.expandoKey

    // Web requests
    const [getRequestById, {
        data: requestData,
        isLoading: isLoadingGetRequestById,
    }] = requestAPI.useGetByIdMutation();
    const [sendOnConfirm, {
        data: sendOnConfirmData,
        isLoading: isLoadingSendOnConfirm,
    }] = requestsByFilialsAPI.useSendOnConfirmMutation();
    const [confirm, {
        data: confirmData,
        isLoading: isLoadingConfirm,
    }] = requestsByFilialsAPI.useConfirmMutation();
    const [decline, {
        data: declineData,
        isLoading: isLoadingDecline,
    }] = requestsByFilialsAPI.useDeclineMutation();
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
    // -----

    // Effects
    useEffect(() => {
        getAllEmpCustomerRequest();
        getAllFlightTargetRequest();
        getAllAircraftModelRequest();
        getAllFilialsRequest();
        getRequestById(location.pathname.split("/")[2]); // get ID from path location
    }, []);
    useEffect(() => {
        if (requestData) {
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
                    "airportArrival": route.airportArrival
                }
            )));
            setFlyDateStart(requestData.flyDateStart);
            setFlyDateFinish(requestData.flyDateFinish);
            setAircraftModel(requestData.aircraftModelName);
            setFlightTarget(requestData.flightTargetName);
            setEmpCustomer(requestData.empCustomerLastName + " " + requestData.empCustomerName + " " + requestData.empCustomerSecondName);
        }
    }, [requestData]);
    useEffect(() => {
        if (selectedRecord !== null)
            setUpdateFlightModalVisible(true);
    }, [selectedRecord])
    useEffect(() => {
        if (sendOnConfirmData || confirmData || declineData) {
            getRequestById(requestId);
        }
    }, [sendOnConfirmData, confirmData, declineData]);
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
    const sendOnConfirmHandler = () => {
        sendOnConfirm(requestId);
    }
    const confirmHandler = () => {
        confirm(requestId);
    }
    const declineHandler = () => {
        decline(requestId);
    }
    const refresh = () => {
        getRequestById(requestId);
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
                <Navbar/>
                {(filials === undefined || requestData === undefined) ?
                    <Flex style={{height: window.innerHeight}} justify={justifyOptions.center}
                          align={alignOptions.center}>
                        <Spin size={'large'}/>
                    </Flex> :
                    <>
                        <Flex justify={justifyOptions.flexStart}>
                            <Flex gap="small" vertical style={{margin: "5px 10px 0 17px"}}>
                                <Flex gap="middle" style={{margin: "0 0 7px 0"}}>
                                    <Button size={'large'} onClick={backBtnHandler} icon={<RollbackOutlined/>}/>
                                    <Button size={'large'} icon={<SaveOutlined/>}/>
                                    <Button size={'large'} onClick={refresh} icon={<RedoOutlined/>}/>
                                </Flex>
                                <Text>Номер заявки <strong>{requestId}</strong></Text>
                                <Text>Код заявки <strong>{requestId}</strong></Text>
                                <Tag color="blue" style={{width: 160, height: 25, textAlign: 'center'}}> На
                                    согласовании</Tag>
                                {/*requestData.stateName*/}
                                <Button style={{marginTop: 5, width: 160}} size={'middle'}>Полет выполнен</Button>
                                <Button style={{width: 160}} danger size={'middle'}>Полет отклонен</Button>
                            </Flex>
                            <Divider type={'vertical'} style={{height: 237}}/>
                            <Flex gap="small" vertical style={{margin: "20px 0 0 13px"}}>
                                <Form
                                    style={{maxWidth: 600}}
                                    // @ts-ignore
                                    {...formItemLayout}
                                >
                                    <Form.Item label="Дата полета">
                                        <RangePicker
                                            showTime={true}
                                            value={[dayjs(flyDateStart.slice(0, 19), dateFormat), dayjs(flyDateFinish.slice(0, 19), dateFormat)]}
                                            format={dateFormat}
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
                                            } => ({value: aircraftModel.id.toString(), label: aircraftModel.name}))}
                                            onSelect={(value) => setAircraftModel(value)}
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
                                            onSelect={(value) => setFlightTarget(value)}
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
                                            onSelect={(value) => setFlightTarget(value)}
                                        />
                                    </Form.Item>
                                </Form>
                            </Flex>
                            <Divider type={'vertical'} style={{height: 237, marginLeft: 23}}/>
                            <Flex gap="small" vertical style={{margin: "5px 0 0 13px"}}>
                                <FileUploadDND/>
                            </Flex>
                        </Flex>
                        <Collapse items={[
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
                                            style={{height: 500}}
                                            store={store}
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
                                            style={{height: 500}}
                                            store={store}
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
                        ]} defaultActiveKey={['1']}/>
                    </>
                }
            </Flex>
        </>
    )

}