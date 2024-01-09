import {AutoComplete, DatePicker, Flex, InputNumber, Modal, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {WorkTypeModel} from "../../../models/WorkTypeModel";
import {EmployeeResponsibleModel} from "../../../models/EmployeeResponsibleModel";
import {AirportModel} from "../../../models/AirportModel";
import {workTypesAPI} from "../../../services/WorkTypesService";
import {airportsAPI} from "../../../services/AirportsService";
import {employeeResponsibleAPI} from "../../../services/EmployeeResponsibleService";
import {RequestRoutesGridType} from "../../../screens/RequestsByFilials/RequestsFilials.types";
import {alignOptions, justifyOptions} from "../../../configs/constants";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    setGridData: Function,
}

const {Text} = Typography;
export const CreateFlightModal = (props: ModalProps) => {
    // States
    const [empRespOptions, setEmpRespOptions] = useState<{ value: string }[]>([]);
    const [workTypeOptions, setWorkTypeOptions] = useState<{ value: string }[]>([]);
    const [airportsOptions, setAirportsOptions] = useState<{ value: string }[]>([]);
    const [workTypeModal, setWorkTypeModal] = useState<string>("");
    const [empRespModal, setEmpRespModal] = useState<string>("");
    const [flightDateModal, setFlightDateModal] = useState<any>(""); // Date.js format
    const [airportDepartureModal, setAirportDepartureModal] = useState<string>("");
    const [airportArrivalModal, setAirportArrivalModal] = useState<string>("");
    const [passengerCountModal, setPassengerCountModal] = useState<number>(0);
    const [cargoWeightMount, setCargoWeightMount] = useState<number>(0);
    const [cargoWeighIn, setCargoWeighIn] = useState<number>(0);
    const [cargoWeightOut, setCargoWeightOut] = useState<number>(0);
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
    const createRouteHandler = () => {
        if (workTypes && employeeResponsible && airports) {
            const workType = workTypes.find((workType: WorkTypeModel) => workType.name === workTypeModal);
            const respEmp = employeeResponsible.find((emp: EmployeeResponsibleModel) => emp.fio === empRespModal);
            const airportArrival = airports.find((airport: AirportModel) => airport.name === airportArrivalModal);
            const airportDeparture = airports.find((airport: AirportModel) => airport.name === airportDepartureModal);
            if (workType === undefined) {
                console.log('Not Finded')
            }
            if (respEmp === undefined) {
                console.log('Not Finded')
            }
            if (airportDeparture === undefined) {
                console.log('Not Finded')
            }
            if (airportArrival === undefined) {
                console.log('Not Finded')
            }
            if (passengerCountModal !== null) {
                console.log('Pasc count ')
            }
            if (cargoWeightMount !== null) {
                console.log('Pasc count ')
            }
            if (cargoWeightOut !== null) {
                console.log('Pasc count ')
            }
            if (cargoWeighIn !== null) {
                console.log('Pasc count ')
            }
            if (workType && airportArrival && airportDeparture && respEmp) {
                props.setGridData((prev: RequestRoutesGridType[]) => {
                    let record: RequestRoutesGridType = {
                        id: "",
                        routeId: "",
                        workType: workTypeModal,
                        workTypeId: workType?.id,
                        employee: empRespModal,
                        employeeId: respEmp?.id,
                        dateTime: flightDateModal?.format('YYYY-MM-DD HH-mm-ss'),
                        airportDeparture: airportDepartureModal,
                        airportDepartureId: airportDeparture?.id,
                        airportArrival: airportArrivalModal,
                        airportArrivalId: airportArrival?.id,
                        passengerCount: passengerCountModal.toString(),
                        cargoWeightMount: cargoWeightMount.toString(),
                        cargoWeightIn: cargoWeighIn.toString(),
                        cargoWeightOut: cargoWeightOut.toString(),
                    }
                    return prev.concat(record);
                })
                closeCreateRouteModalHandler();
            }
        }
    }
    const closeCreateRouteModalHandler = () => {
        props.setVisible(false);
        setWorkTypeModal("");
        setEmpRespModal("");
        setFlightDateModal("");
        setAirportDepartureModal("");
        setAirportArrivalModal("");
        setPassengerCountModal(0);
        setCargoWeightMount(0);
        setCargoWeightOut(0);
        setCargoWeighIn(0);
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
    return (
        <Modal
            title="Новый маршрут"
            okText={"Добавить"}
            centered
            open={props.visible}
            onOk={() => createRouteHandler()}
            onCancel={closeCreateRouteModalHandler}
            width={600}
        >
            <Flex gap={'small'} style={{width: '100%'}}>
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
                            value={flightDateModal ? flightDateModal : null} //value={dayjs('2015/01/01', flightDateModal)}
                            style={{width: 350}} showTime onChange={(value) => {
                            if (value)
                                setFlightDateModal(value)
                        }} onOk={(value) => setFlightDateModal(value)}/>
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
        </Modal>
    )
}