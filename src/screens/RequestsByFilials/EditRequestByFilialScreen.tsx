import React, {useEffect, useState} from "react";
import {
    AutoComplete,
    Button,
    DatePicker,
    Divider,
    Flex,
    InputNumber,
    message,
    Modal,
    Select,
    Tag,
    Typography,
    Upload,
    UploadProps
} from "antd";
import {FilialModel} from "../../models/FilialModel";
import {PrinterOutlined, RollbackOutlined, UploadOutlined} from "@ant-design/icons";
import {BestReactGrid, Column, DateColumn, IntegerColumn, NumberColumn} from "@sencha/best-react-grid";
import {filialsAPI} from "../../services/FilialsService";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {justifyOptions} from "../../configs/constants";
import {useLocation, useNavigate} from "react-router-dom";
import {requestsByFilialsAPI} from "../../services/RequestsByFilialsService";
import {RequestRoutesGridType} from "./RequestsByFilials.types";
import {workTypesAPI} from "../../services/WorkTypesService";
import SelectEditor from "@sencha/best-react-grid/dist/editors/SelectEditor";
import {WorkTypeModel} from "../../models/WorkTypeModel";
import {airportsAPI} from "../../services/AirportsService";
import {AirportModel} from "../../models/AirportModel";
import {employeeResponsibleAPI} from "../../services/EmployeeResponsibleService";
import {EmployeeResponsibleModel} from "../../models/EmployeeResponsibleModel";
import {flightFilialAPI} from "../../services/FlightFilialService";

const {Text} = Typography;

export const EditRequestByFilialScreen = () => {
    // States
    const [requestId, setRequestId] = useState<string>("");
    const [statusId, setStatusId] = useState<string>("");
    const [filialId, setFilialId] = useState<string>("");
    const [fileId, setFileId] = useState<number | null>(null);
    const [fileList, setFileList] = useState<any | null>(null);
    const [fileUploading, setFileUploading] = useState<boolean>(false);
    const [gridData, setGridData] = useState<RequestRoutesGridType[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<RequestRoutesGridType | null>(null);
    //Modal states
    const [addRouteModalVisible, setAddRouteModalVisible] = useState(false);
    const [empRespOptions, setEmpRespOptions] = useState<{ value: string }[]>([]);
    const [workTypeOptions, setWorkTypeOptions] = useState<{ value: string }[]>([]);
    const [airportsOptions, setAirportsOptions] = useState<{ value: string }[]>([]);
    const [workTypeModal, setWorkTypeModal] = useState<string>("");
    const [empRespModal, setEmpRespModal] = useState<string>("");
    const [flightDateModal, setFlightDateModal] = useState<any>(""); // Date.js format
    const [airportDepartureModal, setAirportDepartureModal] = useState<string>("");
    const [airportArrivalModal, setAirportArrivalModal] = useState<string>("");
    const [passengerCountModal, setPassengerCountModal] = useState<string>("");
    const [cargoWeightMount, setCargoWeightMount] = useState<string>("");
    const [cargoWeighIn, setCargoWeighIn] = useState<string>("");
    const [cargoWeightOut, setCargoWeightOut] = useState<string>("");
    //End of modal states
    // -----

    // Useful utils
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
                    console.log(error)
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
    // -----

    // Web requests
    const [getAllFilialsRequest, {
        data: filials,
        isLoading: isFilialsLoading,
    }] = filialsAPI.useGetAllMutation();
    const [getAllWorkTypesRequest, {
        data: workTypes,
        isLoading: isWorkTypesLoading,
    }] = workTypesAPI.useGetAllMutation();
    const [getAllAirportsRequest, {
        data: airports,
        isLoading: isAirportsLoading,
    }] = airportsAPI.useGetAllMutation();
    const [getAllEmployeeResponsibleRequest, {
        data: employeeResponsible,
        isLoading: isEmployeeResponsibleLoading,
    }] = employeeResponsibleAPI.useGetAllMutation();
    const [updateFlightFilial, {
        data: updateFlightFilialData,
        isLoading: isLoadingUpdateFilial,
        isError: isErrorUpdateFilial,
    }] = flightFilialAPI.useUpdateMutation();
    const [getRequestById, {
        data: requestData,
        isLoading: isLoadingGetRequestById,
        isError: isErrorGetRequestById,
    }] = requestsByFilialsAPI.useGetByIdMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllWorkTypesRequest();
        getAllFilialsRequest();
        getAllAirportsRequest();
        getAllEmployeeResponsibleRequest();
        getRequestById(location.pathname.split("/")[2]); // get ID from path location
    }, []);
    useEffect(() => {
        if (requestData) {
            setFileList([{
                uid: `${requestData.idRequestFile}`,
                name: `${requestData.nameRequestFile}`,
                status: 'done',
                url: `http://localhost:8080/flight/api/file/get?id=${requestData.idRequestFile}`,
                percent: 100,
            }])
            setRequestId(requestData.id);
            setFilialId(requestData.idFilial);
            setStatusId(requestData.idState);
            setFileId(requestData.idRequestFile);
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
        }
    }, [requestData]);
    useEffect(() => {
        if (updateFlightFilialData) {
            getRequestById(location.pathname.split("/")[2]); // get ID from path location
        }
    }, [updateFlightFilialData])
    useEffect(() => {
        if (employeeResponsible)
            setEmpRespOptions(employeeResponsible.map((emp: EmployeeResponsibleModel) => ({value: emp.fio})));
    }, [employeeResponsible]);
    useEffect(() => {
        if (workTypes)
            setWorkTypeOptions(workTypes.map((workTypes: WorkTypeModel) => ({value: workTypes.name})));
    }, [workTypes]);
    useEffect(() => {
        if (airports)
            setAirportsOptions(airports.map((airport: AirportModel) => ({value: airport.name})));
    }, [airports]);
    // -----

    // Handlers
    const backBtnHandler = () => {
        return navigate(`/requests`);
    }
    const updateFlightFilialHandler = (rowData: any) => {
        const idAirportArrival = airports?.find((airport: AirportModel) => airport.name === rowData.airportArrival)?.id;
        const idAirportDeparture = airports?.find((airport: AirportModel) => airport.name === rowData.airportDeparture)?.id;
        const idWorkType = workTypes?.find((workType: WorkTypeModel) => workType.name === rowData.workType)?.id;
        if (idAirportArrival && idAirportDeparture && idWorkType) {
            updateFlightFilial({
                id: rowData.id,
                idWorkType,
                idRoute: rowData.routeId,
                flyDate: rowData.dateTime,
                idAirportArrival,
                idAirportDeparture,
                passengerCount: rowData.passengerCount,
                cargoWeightIn: rowData.cargoWeightIn,
                cargoWeightOut: rowData.cargoWeightOut,
                cargoWeightMount: rowData.cargoWeightMount
            });
        }
    }
    const getEmpRespValue = (searchText: string) => {
        if (employeeResponsible) {
            return employeeResponsible.filter((emp: EmployeeResponsibleModel) => emp.fio.includes(searchText)).map((emp: EmployeeResponsibleModel) => ({value: emp.fio}));
        }
        return [];
    }
    const getWorkTypesValue = (searchText: string) => {
        if (workTypes) {
            return workTypes.filter((workType: WorkTypeModel) => workType.name.includes(searchText)).map((workType: WorkTypeModel) => ({value: workType.name}));
        }
        return [];
    }
    const getAirportsValue = (searchText: string) => {
        if (airports) {
            return airports.filter((airport: AirportModel) => airport.name.includes(searchText)).map((airport: AirportModel) => ({value: airport.name}));
        }
        return [];
    }
    const createRouteHandler = () => {
        console.log(workTypeModal, empRespModal, flightDateModal, airportDepartureModal)
    }
    // -----
    const CustomCell = ({data}: any) => {
        if (data)
            if (!data.toString().includes("extModel"))
                return <div>{data}</div>;
        return <div></div>
    };
    return (
        <>
            {(workTypes && empRespOptions) &&
                <Modal
                    title="Новый маршрут"
                    okText={"Добавить"}
                    centered
                    open={addRouteModalVisible}
                    onOk={() => createRouteHandler()}
                    onCancel={() => {
                        setAddRouteModalVisible(false);
                        setSelectedRecord(null);
                    }}
                    width={740}
                >
                    <Flex gap={'small'} style={{width: '100%'}}>
                        <Flex vertical gap={"small"} style={{width: '100%'}}>
                            <AutoComplete
                                size={'large'}
                                options={workTypeOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setWorkTypeOptions(getWorkTypesValue(text))}
                                placeholder={'Выберите вид работ'}
                                notFoundContent={'Виды работ не найдены'}
                                onSelect={(value, option) => setWorkTypeModal(value)}
                            />
                            <AutoComplete
                                size={'large'}
                                options={empRespOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setEmpRespOptions(getEmpRespValue(text))}
                                placeholder={'Выберите ответственного'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setEmpRespModal(value)}
                            />
                            <DatePicker style={{width: '100%'}} size={'large'} showTime onChange={(value) => {
                                if(value)
                                    setFlightDateModal(value)
                            }} onOk={(value) => setFlightDateModal(value)}/>
                            <AutoComplete
                                size={'large'}
                                options={airportsOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setAirportsOptions(getAirportsValue(text))}
                                placeholder={'Выберите аэропорт вылета'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setAirportDepartureModal(value)}
                            />
                            <AutoComplete
                                size={'large'}
                                options={airportsOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setAirportsOptions(getAirportsValue(text))}
                                placeholder={'Выберите аэропорт назанчения'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setAirportArrivalModal(value)}
                            />
                        </Flex>
                        <Flex vertical gap={"small"} style={{width: '100%'}}>
                            <InputNumber
                                style={{width: '100%'}}
                                size={'large'}
                                min={0}
                                max={500}
                                onChange={(value) => {
                                    if (value)
                                        setPassengerCountModal(value.toString());
                                }}
                                placeholder={'Введите колличество пассажиров'}
                            />
                            <InputNumber
                                style={{width: '100%'}}
                                size={'large'}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeightMount(value);
                                }}
                                placeholder={'Введите общий вес груза'}
                            />
                            <InputNumber
                                style={{width: '100%'}}
                                size={'large'}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeightOut(value);
                                }}
                                placeholder={'Введите вес груза на внешней подвеске'}
                            />
                            <InputNumber
                                style={{width: '100%'}}
                                size={'large'}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeighIn(value);
                                }}
                                placeholder={'Введите вес груза внутри физюляжа'}
                            />
                        </Flex>
                    </Flex>
                </Modal>
            }
            <Flex gap="small" vertical>
                <Navbar/>
                {(filials === undefined || requestData === undefined) ?
                    <>Loading</> :
                    <>
                        <Flex justify={justifyOptions.flexStart}>
                            <Flex gap="small" vertical style={{margin: "5px 34px 0 17px"}}>
                                <Flex gap="small" style={{margin: "0 0 7px 0"}}>
                                    <Button size={'large'} onClick={backBtnHandler} icon={<RollbackOutlined/>}/>
                                    <Button size={'large'} icon={<PrinterOutlined/>}/>
                                </Flex>
                                <Button size={'middle'}>Отправить на согласование</Button>
                                <Button size={'middle'}>Создать заявку на полет</Button>
                            </Flex>
                            <Flex gap="small" vertical>
                                <Text>Код заявки <strong>{requestId}</strong></Text>
                                <Text>Статус заявки <Tag color="blue">{requestData.nameState}</Tag></Text>
                                <Select
                                    size={'middle'}
                                    placeholder="Филиал"
                                    loading={isFilialsLoading}
                                    value={filialId.toString()}
                                    style={{width: 330}}
                                    options={filials.map((filial: FilialModel): {
                                        value: string,
                                        label: string
                                    } => ({value: filial.id.toString(), label: filial.name}))}
                                    onSelect={(value) => setFilialId(value)}
                                />
                                <Upload  {...propsFile}>
                                    <Button size={'middle'} style={{width: 330}} icon={<UploadOutlined/>}>Обновить файл
                                        полетной
                                        заявки</Button>
                                </Upload>
                            </Flex>
                        </Flex>
                        <Divider/>
                        <Flex wrap="wrap" gap="small" justify={justifyOptions.flexStart}
                              style={{margin: "5px 0px 0 17px"}}>
                            <Button size={'middle'} style={{width: 230}}
                                    onClick={() => setAddRouteModalVisible(true)}>Добавить
                                маршрут</Button>
                            <Button disabled={selectedRecord === null} size={'middle'} style={{width: 230}}
                                    onClick={() => {
                                        setGridData((data: RequestRoutesGridType[]) => {
                                            if (selectedRecord !== null) {
                                                let newRecord: RequestRoutesGridType = {
                                                    workType: selectedRecord.workType,
                                                    employee: selectedRecord.employee,
                                                    dateTime: "",
                                                    airportDeparture: "",
                                                    airportArrival: "",
                                                    passengerCount: "",
                                                    cargoWeightMount: "",
                                                    cargoWeightIn: "",
                                                    cargoWeightOut: "",
                                                    routeId: "",
                                                    id: "",
                                                };
                                                console.log(data, selectedRecord)
                                                return data.concat(newRecord);
                                            }
                                            return data;
                                        });
                                    }}>Добавить
                                рейс</Button>
                        </Flex>
                        <BestReactGrid
                            onEdit={function (_ref) {
                                var columnIndex = _ref.columnIndex,
                                    rowIndex = _ref.rowIndex,
                                    rowData = _ref.rowData;
                                if (rowData)
                                    updateFlightFilialHandler(rowData);
                            }}
                            onValidateEdit={(_ref) => {
                                return true;
                            }}
                            variableHeights
                            store={{
                                fields: ["id",
                                    "workType",
                                    "employee",
                                    "dateTime",
                                    "airportDeparture",
                                    "airportArrival",
                                    "passengerCount",
                                    "cargoWeightMount",
                                    "cargoWeightOut",
                                    "cargoWeightIn",
                                    "routeId"
                                ],
                                groupers: [],
                            }}
                            data={gridData}
                            plugins={{
                                gridfilters: true,
                                rowedit: {
                                    autoConfirm: false,
                                },
                                groupingpanel: true,
                            }}
                            display="treeGroupedGrid"
                            groupHeaderTpl="{name} ({group.length})"
                            stateful
                            summaryPosition="hidden"
                            itemRipple={{
                                color: "#111111",
                            }}
                            onRowClick={(click) => {
                                console.log(click)
                                setSelectedRecord(click.record.data)
                            }}
                            children={[
                                <Column
                                    summary="count"
                                    summaryRenderer={function (value) {
                                        return value === 0 || value > 1
                                            ? "(" + value + " Tasks)"
                                            : "(1 Task)";
                                    }}
                                    field="workType"
                                    filterType="string"
                                    flex={2}
                                    text="Вид работ"
                                    editor={
                                        <SelectEditor
                                            options={workTypes?.map((type: WorkTypeModel) => type.name)}
                                        />
                                    }
                                />,
                                <Column
                                    editable
                                    field="employee"
                                    filterType="string"
                                    text="Ответсвенный"
                                    width={300}
                                    editor={
                                        <SelectEditor
                                            options={employeeResponsible?.map((emp: EmployeeResponsibleModel) => emp.fio)}
                                        />
                                    }
                                />,
                                <DateColumn
                                    editable
                                    field="dateTime"
                                    filterType="date"
                                    flex={2}
                                    text="Дата и время вылета"
                                />,
                                <Column
                                    editable
                                    field="airportDeparture"
                                    filterType="string"
                                    flex={2}
                                    text="Аэропорт вылета"
                                    editor={
                                        <SelectEditor
                                            options={airports?.map((airport: AirportModel) => airport.name)}
                                        />
                                    }
                                />,
                                <Column
                                    editable
                                    field="airportArrival"
                                    filterType="string"
                                    flex={2}
                                    text="Аэропорт назначения"
                                    editor={
                                        <SelectEditor
                                            options={airports?.map((airport: AirportModel) => airport.name)}
                                        />
                                    }
                                />,
                                <IntegerColumn
                                    editable
                                    field="passengerCount"
                                    filterType="string"
                                    flex={2}
                                    text="Кол-во пассажиров"
                                    renderer={<CustomCell/>}
                                />,
                                <NumberColumn
                                    editable
                                    field="cargoWeightMount"
                                    filterType="string"
                                    flex={2}
                                    text="Груз всего, тонн"
                                    renderer={<CustomCell/>}
                                />,
                                <NumberColumn
                                    editable
                                    field="cargoWeightOut"
                                    filterType="string"
                                    flex={2}
                                    text="Груз на внешней подвеске, тонн"
                                    renderer={<CustomCell/>}
                                />,
                                <NumberColumn
                                    editable
                                    field="cargoWeightIn"
                                    filterType="string"
                                    flex={2}
                                    text="Груз внутри фюзеляжа, тонн"
                                    renderer={<CustomCell/>}
                                />,
                                <IntegerColumn
                                    field="id"
                                    filterType="string"
                                    flex={2}
                                    text="Код заявки на полет"
                                    editable={false}
                                    renderer={<CustomCell/>}
                                    summary="count"
                                    summaryRenderer={function (value) {
                                        return value === 0 || value > 1
                                            ? "(" + value + " Tasks)"
                                            : "(1 Task)";
                                    }}
                                />,
                                <IntegerColumn
                                    field="routeId"
                                    filterType="string"
                                    flex={2}
                                    text="Route id"
                                    editable={false}
                                    hidden
                                />]}
                            style={{height: (window.innerHeight - 325).toString()}}
                        />
                    </>
                }
            </Flex>
        </>
    )

}