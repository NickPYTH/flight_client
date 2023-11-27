import {AutoComplete, DatePicker, Flex, InputNumber, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {WorkTypeModel} from "../../../models/WorkTypeModel";
import {EmployeeResponsibleModel} from "../../../models/EmployeeResponsibleModel";
import {AirportModel} from "../../../models/AirportModel";
import {flightFilialAPI} from "../../../services/FlightFilialService";
import {filialsAPI} from "../../../services/FilialsService";
import {workTypesAPI} from "../../../services/WorkTypesService";
import {airportsAPI} from "../../../services/AirportsService";
import {employeeResponsibleAPI} from "../../../services/EmployeeResponsibleService";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    refresh: Function,
}
export const CreateFlightModal = (props: ModalProps) => {
    // States
    const [requestId] = useState<string>(() => {
        return window.location.pathname.split("/")[2]
    });
    const [empRespOptions, setEmpRespOptions] = useState<{ value: string }[]>([]);
    const [workTypeOptions, setWorkTypeOptions] = useState<{ value: string }[]>([]);
    const [airportsOptions, setAirportsOptions] = useState<{ value: string }[]>([]);
    const [workTypeModal, setWorkTypeModal] = useState<string>("");
    const [empRespModal, setEmpRespModal] = useState<string>("");
    const [flightDateModal, setFlightDateModal] = useState<any>(""); // Date.js format
    const [airportDepartureModal, setAirportDepartureModal] = useState<string>("");
    const [airportArrivalModal, setAirportArrivalModal] = useState<string>("");
    const [passengerCountModal, setPassengerCountModal] = useState<number>(-1);
    const [cargoWeightMount, setCargoWeightMount] = useState<number>(-1);
    const [cargoWeighIn, setCargoWeighIn] = useState<number>(-1);
    const [cargoWeightOut, setCargoWeightOut] = useState<number>(-1);
    // -----

    // Web requests
    const [createFlightFilial, {
        data: createdFlightFilialData,
        isLoading: isLoadingCreateFlightFilial,
        isError: isErrorCreateFlightFilial,
    }] = flightFilialAPI.useCreateMutation();
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
    // -----

    // Effects
    useEffect(() => {
        getAllFilialsRequest();
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
    useEffect(() => {
        if (createdFlightFilialData)
            props.refresh(requestId);
    }, [createdFlightFilialData]);
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
                createFlightFilial({
                    idRequestFilial: requestId,
                    idWorkType: workType.id,
                    flyDate: flightDateModal?.format('YYYY-MM-DD'),
                    idAirportArrival: airportArrival.id,
                    idAirportDeparture: airportDeparture.id,
                    idEmpResp: respEmp.id,
                    passengerCount: passengerCountModal,
                    cargoWeightIn: cargoWeighIn,
                    cargoWeightOut: cargoWeightOut,
                    cargoWeightMount: cargoWeightMount
                });
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
    return (
        <Modal
            title="Новый маршрут"
            okText={"Добавить"}
            centered
            open={props.visible}
            onOk={() => createRouteHandler()}
            onCancel={closeCreateRouteModalHandler}
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
                        if (value)
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
                        onChange={(value) => {
                            if (value)
                                setPassengerCountModal(value);
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
    )
}