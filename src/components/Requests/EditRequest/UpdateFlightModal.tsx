import {AutoComplete, Button, DatePicker, Flex, Form, InputNumber, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {WorkTypeModel} from "../../../models/WorkTypeModel";
import {EmployeeResponsibleModel} from "../../../models/EmployeeResponsibleModel";
import {AirportModel} from "../../../models/AirportModel";
import {workTypesAPI} from "../../../services/WorkTypesService";
import {airportsAPI} from "../../../services/AirportsService";
import {employeeResponsibleAPI} from "../../../services/EmployeeResponsibleService";
import dayjs from 'dayjs';
import {flightPlanAPI} from "../../../services/FlightPlanService";
import {justifyOptions} from "../../../configs/constants";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    rowData: any,
    setRowData: Function,
}
export const UpdateFlightModal = (props: ModalProps) => {
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

    // Useful utils
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 20}};
    // -----

    // Web requests
    const [updateFlightPlan, {
        data: updateFlightPlanData,
    }] = flightPlanAPI.useUpdateMutation();
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
    const [deleteFlightPlan, {
        data: deleteFlightPlanData,
        isLoading: isDeleteFlightPlanLoading,
    }] = flightPlanAPI.useDeleteMutation();
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
    useEffect(() => {
        if (updateFlightPlanData) {
            props.refresh(requestId);
            closeUpdateRouteModalHandler();
        }
    }, [updateFlightPlanData]);
    useEffect(() => {
        if (deleteFlightPlanData) {
            props.refresh(requestId);
            closeUpdateRouteModalHandler();
        }
    }, [deleteFlightPlanData])
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
            updateFlightPlan({
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
                cargoWeightMount: cargoWeightMount,
                idFuelPoint: '',
                idRequest: ''
            });
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
    const deleteFlightHandler = () => {
        Modal.confirm({
            onOk: () => deleteFlightPlan(props.rowData.id),
            title: 'Удаление',
            content: 'Вы точно хотите удалить маршрут?',
            footer: (_, {OkBtn, CancelBtn}) => (
                <>
                    <CancelBtn/>
                    <OkBtn/>
                </>
            ),
        });
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
                <Button danger onClick={deleteFlightHandler}>Удалить</Button>
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
                            <DatePicker defaultValue={dayjs('2015/01/01', flightDateModal)} style={{width: '100%'}}
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