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
import dayjs from 'dayjs';

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    rowData: any,
    setRowData: Function,
}
export const UpdateFlightModal = (props: ModalProps) => {
    console.log(props.rowData)
    // States
    const [requestId] = useState<string>(() => {
        return window.location.pathname.split("/")[2]
    });
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

    // Web requests
    const [updateFlightFilial, {
        data: updateFlightFilialData,
        isLoading: isLoadingUpdateFilial,
        isError: isErrorUpdateFilial,
    }] = flightFilialAPI.useUpdateMutation();
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
        setAirportDepartureModal(props.rowData.airportDeparture);
        setAirportArrivalModal(props.rowData.airportArrival);
        setPassengerCountModal(props.rowData.passengerCount);
        setCargoWeightMount(props.rowData.cargoWeightMount);
        setCargoWeighIn(props.rowData.cargoWeightIn);
        setCargoWeightOut(props.rowData.cargoWeightOut);
        setFlightDateModal(props.rowData.dateTime);
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
        if (updateFlightFilialData) {
            props.refresh(requestId);
            closeUpdateRouteModalHandler();
        }
    }, [updateFlightFilialData]);
    // -----

    // Handlers
    const updateFlightHandler = () => {
        const idAirportArrival = airports?.find((airport: AirportModel) => airport.name === airportArrivalModal)?.id;
        const idAirportDeparture = airports?.find((airport: AirportModel) => airport.name === airportDepartureModal)?.id;
        const idWorkType = workTypes?.find((workType: WorkTypeModel) => workType.name === workTypeModal)?.id;
        const respEmp = employeeResponsible?.find((emp: EmployeeResponsibleModel) => emp.fio === empRespModal);
        if (respEmp === undefined) {
            console.log('Not Finded')
        }
        if (idAirportArrival && idAirportDeparture && idWorkType) {
            updateFlightFilial({
                id: props.rowData.id,
                idWorkType,
                idEmpResp: respEmp?.id,
                idRoute: props.rowData.routeId,
                flyDate: flightDateModal,
                idAirportArrival,
                idAirportDeparture,
                passengerCount: passengerCountModal,
                cargoWeightIn: cargoWeighIn,
                cargoWeightOut: cargoWeightOut,
                cargoWeightMount: cargoWeightMount
            });
        }
    }
    // -----
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
    return (
        <Modal
            title="Редактирование маршрута"
            okText={"Сохранить"}
            centered
            open={props.visible}
            onOk={() => updateFlightHandler()}
            onCancel={closeUpdateRouteModalHandler}
            width={740}
        >
            <Flex gap={'small'} style={{width: '100%'}}>
                <Flex vertical gap={"small"} style={{width: '100%'}}>
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
                    <DatePicker defaultValue={dayjs('2015/01/01', flightDateModal)} style={{width: '100%'}}
                                size={'large'} showTime onChange={(value) => {
                        if (value)
                            setFlightDateModal(value)
                    }} onOk={(value) => setFlightDateModal(value)}/>
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
                </Flex>
                <Flex vertical gap={"small"} style={{width: '100%'}}>
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
                    />
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
                </Flex>
            </Flex>
        </Modal>
    )
}