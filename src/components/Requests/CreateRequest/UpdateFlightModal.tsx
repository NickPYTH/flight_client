import {AutoComplete, Button, DatePicker, Flex, Form, InputNumber, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {WorkTypeModel} from "../../../models/WorkTypeModel";
import {EmployeeResponsibleModel} from "../../../models/EmployeeResponsibleModel";
import {AirportModel} from "../../../models/AirportModel";
import {workTypesAPI} from "../../../services/WorkTypesService";
import {airportsAPI} from "../../../services/AirportsService";
import {employeeResponsibleAPI} from "../../../services/EmployeeResponsibleService";
import dayjs from 'dayjs';
import {justifyOptions} from "../../../configs/constants";
import {RequestRoutesGridType} from "../../../screens/Requests/Requests.types";

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
                        <Form.Item label="Воздушное судно">
                            <AutoComplete
                                value={workTypeModal}
                                size={'large'}
                                options={workTypeOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setWorkTypeOptions(getWorkTypesValue(text))}
                                placeholder={'Выберите вид работ'}
                                notFoundContent={'Виды работ не найдены'}
                                onSelect={(value, option) => setWorkTypeModal(value)}
                            />
                        </Form.Item>
                        <Form.Item label="Ответственное лицо">
                            <AutoComplete
                                value={empRespModal}
                                size={'large'}
                                options={empRespOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setEmpRespOptions(getEmpRespValue(text))}
                                placeholder={'Выберите ответственного'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setEmpRespModal(value)}
                            />
                        </Form.Item>
                        <Form.Item label="Дата и время вылета">
                            <DatePicker defaultValue={dayjs(flightDateModal, 'YYYY-MM-DD HH:mm:ss')}
                                        style={{width: '100%'}}
                                        size={'large'} showTime onChange={(value) => {
                                if (value)
                                    setFlightDateModal(value)
                            }} onOk={(value) => setFlightDateModal(value)}/>
                        </Form.Item>
                        <Form.Item label="Аэропорт вылета">
                            <AutoComplete
                                value={airportDepartureModal}
                                size={'large'}
                                options={airportsOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setAirportsOptions(getAirportsValue(text))}
                                placeholder={'Выберите аэропорт вылета'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setAirportDepartureModal(value)}
                            />
                        </Form.Item>
                        <Form.Item label="Аэропорт назначения">
                            <AutoComplete
                                value={airportArrivalModal}
                                size={'large'}
                                options={airportsOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setAirportsOptions(getAirportsValue(text))}
                                placeholder={'Выберите аэропорт назанчения'}
                                notFoundContent={'Ответственные не найдены'}
                                onSelect={(value, option) => setAirportArrivalModal(value)}
                            />
                        </Form.Item>
                    </Flex>
                    <Flex vertical gap={"small"} style={{width: '100%'}}>
                        <Form.Item label="Место дозаправки">
                            <AutoComplete
                                value={airportArrivalModal}
                                size={'large'}
                                options={airportsOptions}
                                style={{width: '100%'}}
                                onSearch={(text) => setAirportsOptions(getAirportsValue(text))}
                                placeholder={'Выберите место дозаправки'}
                                notFoundContent={'Место дозаправки не найдено'}
                                onSelect={(value, option) => setAirportArrivalModal(value)}
                            />
                        </Form.Item>
                        <Form.Item label="Колличество пассажиров">
                            <InputNumber
                                value={passengerCountModal}
                                style={{width: '100%'}}
                                size={'large'}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setPassengerCountModal(value);
                                }}
                                placeholder={'Введите колличество пассажиров'}
                            /></Form.Item>
                        <Form.Item label="Общий вес груза">
                            <InputNumber
                                value={cargoWeightMount}
                                style={{width: '100%'}}
                                size={'large'}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeightMount(value);
                                }}
                                placeholder={'Введите общий вес груза'}
                            />
                        </Form.Item>
                        <Form.Item label="Вес груза на внешней подвеске">
                            <InputNumber
                                value={cargoWeightOut}
                                style={{width: '100%'}}
                                size={'large'}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeightOut(value);
                                }}
                                placeholder={'Введите вес груза на внешней подвеске'}
                            />
                        </Form.Item>
                        <Form.Item label="Вес груза внутри физюляжа">
                            <InputNumber
                                value={cargoWeighIn}
                                style={{width: '100%'}}
                                size={'large'}
                                min={0}
                                onChange={(value) => {
                                    if (value)
                                        setCargoWeighIn(value);
                                }}
                                placeholder={'Введите вес груза внутри физюляжа'}
                            />
                        </Form.Item>
                    </Flex>
                </Flex>
            </Form>
        </Modal>
    )
}