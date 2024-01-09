import {AutoComplete, Button, DatePicker, Flex, Form, InputNumber, Modal, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {WorkTypeModel} from "../../../models/WorkTypeModel";
import {EmployeeResponsibleModel} from "../../../models/EmployeeResponsibleModel";
import {AirportModel} from "../../../models/AirportModel";
import {workTypesAPI} from "../../../services/WorkTypesService";
import {airportsAPI} from "../../../services/AirportsService";
import {employeeResponsibleAPI} from "../../../services/EmployeeResponsibleService";
import dayjs from 'dayjs';
import {alignOptions, justifyOptions} from "../../../configs/constants";
import {RequestRoutesGridType} from "../../../screens/Requests/Requests.types";

const {Text} = Typography;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    rowData: any,
    setRowData: Function,
    setGridData: Function,
}
export const UpdateFlightModal = (props: ModalProps) => {
    // States
    const [empRespOptions, setEmpRespOptions] = useState<{ value: string }[]>([]);
    const [workTypeOptions, setWorkTypeOptions] = useState<{ value: string }[]>([]);
    const [airportsOptions, setAirportsOptions] = useState<{ value: string }[]>([]);
    const [workTypeModal, setWorkTypeModal] = useState<string>(props.rowData.workType);
    const [empRespModal, setEmpRespModal] = useState<string>(props.rowData.employee);
    const [flightDateModal, setFlightDateModal] = useState<any>("");
    const [airportDepartureModal, setAirportDepartureModal] = useState<string>("");
    const [airportArrivalModal, setAirportArrivalModal] = useState<string>("");
    const [passengerCountModal, setPassengerCountModal] = useState<number>(-1);
    const [cargoWeightMount, setCargoWeightMount] = useState<number>(-1);
    const [cargoWeighIn, setCargoWeighIn] = useState<number>(-1);
    const [cargoWeightOut, setCargoWeightOut] = useState<number>(-1);
    // -----

    // Useful utils

    // -----

    // Web requests
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
    // -----

    // Effects
    useEffect(() => {
        setAirportDepartureModal(props.rowData.airportDeparture);
        setAirportArrivalModal(props.rowData.airportArrival);
        setPassengerCountModal(props.rowData.passengerCount);
        setCargoWeightMount(props.rowData.cargoWeightMount);
        setCargoWeighIn(props.rowData.cargoWeightIn);
        setCargoWeightOut(props.rowData.cargoWeightOut);
        setFlightDateModal(props.rowData.dateTime);
        getAllWorkTypesRequest();
        getAllAirportsRequest();
        getAllEmployeeResponsibleRequest();
    }, []);
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
    const updateFlightHandler = () => {
        const airportArrival = airports?.find((airport: AirportModel) => airport.name === airportArrivalModal);
        const airportDeparture = airports?.find((airport: AirportModel) => airport.name === airportDepartureModal);
        const workType = workTypes?.find((workType: WorkTypeModel) => workType.name === workTypeModal);
        const respEmp = employeeResponsible?.find((emp: EmployeeResponsibleModel) => emp.fio === empRespModal);
        if (respEmp === undefined) {
            console.log('Not Finded')
        }
        if (airportArrival && airportDeparture && workType && respEmp) {
            props.setGridData((prev: RequestRoutesGridType[]) => {
                let copy = JSON.parse(JSON.stringify(prev));
                return copy.map((record: RequestRoutesGridType) => {
                    if (record.id === props.rowData.id) {
                        record = {
                            dateTime: flightDateModal,
                            cargoWeightOut: cargoWeightOut.toString(),
                            cargoWeightMount: cargoWeightMount.toString(),
                            routeId: "",
                            passengerCount: passengerCountModal.toString(),
                            workType: workType.name,
                            workTypeId: workType.id.toString(),
                            airportDeparture: airportDeparture.name,
                            airportDepartureId: airportDeparture.id.toString(),
                            cargoWeightIn: cargoWeighIn.toString(),
                            id: "",
                            employee: respEmp.fio,
                            employeeId: respEmp.id.toString(),
                            airportArrival: airportArrival.name,
                            airportArrivalId: airportArrival.id.toString(),
                            idFlightFilial: "",
                            idFuelPoint: ""
                        };
                    }
                    return record;
                });
            });
            closeUpdateRouteModalHandler();
        }
    }
    const closeUpdateRouteModalHandler = () => {
        props.setVisible(false);
        props.setRowData(null);
        setWorkTypeModal("");
        setEmpRespModal("");
        setFlightDateModal("");
        setAirportDepartureModal("");
        setAirportArrivalModal("");
        setPassengerCountModal(-1);
        setCargoWeightMount(-1);
        setCargoWeightOut(-1);
        setCargoWeighIn(-1);
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
    // -----
    const Footer = () => {
        return (
            <Flex justify={justifyOptions.flexEnd} gap={'small'}>
                <Button onClick={closeUpdateRouteModalHandler}>Отмена</Button>
                <Button type={'primary'} onClick={updateFlightHandler}>Сохранить</Button>
            </Flex>
        )
    }
    // -----
    return (
        <Modal
            title="Редактирование маршрута"
            okText={"Сохранить"}
            centered
            open={props.visible}
            onOk={() => updateFlightHandler()}
            onCancel={closeUpdateRouteModalHandler}
            width={740}
            footer={Footer}
        >
            <Form
                style={{maxWidth: 1200}}
                layout="vertical"
            >
                <Flex gap={'middle'} style={{width: '100%'}}>
                    <Flex vertical gap={"small"} style={{width: '100%'}}>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Вид работ</Text>
                            <AutoComplete
                                value={workTypeModal}
                                options={workTypeOptions}
                                style={{width: 350}}
                                onSearch={(text) => setWorkTypeOptions(getWorkTypesValue(text))}
                                placeholder={'Выберите вид работ'}
                                notFoundContent={'Виды работ не найдены'}
                                onSelect={(value, option) => setWorkTypeModal(value)}
                            />
                        </Flex>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Ответственное лицо</Text>
                            <AutoComplete
                                value={empRespModal}
                                options={empRespOptions}
                                style={{width: 350}}
                                onSearch={(text) => setEmpRespOptions(getEmpRespValue(text))}
                                placeholder={'Выберите ответственного'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setEmpRespModal(value)}
                            />
                        </Flex>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Дата</Text>
                            <DatePicker
                                value={dayjs(flightDateModal, 'YYYY-MM-DD HH:mm:ss')}
                                style={{width: 350}} showTime onChange={(value) => {
                                if (value)
                                    setFlightDateModal(value.format('YYYY-MM-DD HH:mm:ss'))
                            }} onOk={(value) => setFlightDateModal(value.format('YYYY-MM-DD HH:mm:ss'))}/>
                        </Flex>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Аэропорт вылета</Text>
                            <AutoComplete
                                value={airportDepartureModal}
                                options={airportsOptions}
                                style={{width: 350}}
                                onSearch={(text) => setAirportsOptions(getAirportsValue(text))}
                                placeholder={'Выберите аэропорт вылета'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setAirportDepartureModal(value)}
                            />
                        </Flex>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Аэропорт прибытия</Text>
                            <AutoComplete
                                value={airportArrivalModal}
                                options={airportsOptions}
                                style={{width: 350}}
                                onSearch={(text) => setAirportsOptions(getAirportsValue(text))}
                                placeholder={'Выберите аэропорт назанчения'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setAirportArrivalModal(value)}
                            />
                        </Flex>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Колличество пассажиров</Text>
                            <InputNumber
                                value={passengerCountModal}
                                style={{width: 350}}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setPassengerCountModal(value);
                                }}
                                placeholder={'Введите колличество пассажиров'}
                            />
                        </Flex>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Груз на внешней подвеске</Text>
                            <InputNumber
                                value={cargoWeightOut}
                                style={{width: 350}}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeightOut(value);
                                }}
                                placeholder={'Введите вес груза на внешней подвеске'}
                            />
                        </Flex>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Груз внутри фюзеляжа</Text>
                            <InputNumber
                                value={cargoWeighIn}
                                style={{width: 350}}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeighIn(value);
                                }}
                                placeholder={'Введите вес груза внутри физюляжа'}
                            />
                        </Flex>
                        <Flex align={alignOptions.center} justify={justifyOptions.spaceBetween}>
                            <Text>Общий вес груза</Text>
                            <InputNumber
                                value={cargoWeightMount}
                                style={{width: 350}}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeightMount(value);
                                }}
                                placeholder={'Введите общий вес груза'}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Form>
        </Modal>
    )
}