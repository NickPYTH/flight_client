import {Form, InputNumber, Modal, Select} from "antd";
import {filialsAPI} from "../../../services/FilialsService";
import React, {useEffect, useState} from "react";
import {FilialModel} from "../../../models/FilialModel";
import {workTypesAPI} from "../../../services/WorkTypesService";
import {WorkTypeModel} from "../../../models/WorkTypeModel";
import {requestAPI} from "../../../services/RequestService";

export type CostEditModalData = {
    selectedFilialId: string,
    selectedWorkType: string,
    flightDuration: number,
    flightCost: number,
    costId: string
}

type ModalProps = {
    requestId: string,
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    data: CostEditModalData,
}

export const EditCostModal = (props: ModalProps) => {
    // States
    const [selectedFilial, setSelectedFilial] = useState<string>(props.data.selectedFilialId);
    const [selectedWorkType, setSelectedWorkType] = useState<string>(props.data.selectedWorkType);
    const [flightDuration, setFlightDuration] = useState<number>(props.data.flightDuration);
    const [flightCost, setFlightCost] = useState<number>(props.data.flightCost);
    // -----

    // Useful utils
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
    const [updateCostRequest, {
        data: updateCostData,
        isLoading: isUpdateCostLoading,
    }] = requestAPI.useUpdateCostMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllFilialsRequest();
        getAllWorkTypesRequest();
        setSelectedFilial(props.data.selectedFilialId);
    }, []);
    useEffect(() => {
        if (updateCostData) {
            props.setVisible(false);
            props.refresh(props.requestId);
        }
    }, [updateCostData]);
    // -----

    // Handlers
    const setSelectedFilialHandler = (value: string, option: any) => {
        setSelectedFilial(option.value);
    }
    const setSelectedWorkTypeHandler = (value: string, option: any) => {
        setSelectedWorkType(option.value);
    }
    const setFlightDurationHandler = (value: number | null) => {
        if (value) {
            setFlightDuration(value);
        }
    }
    const setFlightCostHandler = (value: number | null) => {
        if (value) {
            setFlightCost(value);
        }
    }
    const updateCostHandler = () => {
        if (selectedWorkType && selectedFilial && flightDuration && flightCost) {
            updateCostRequest({
                costId: props.data.costId,
                requestId: props.requestId,
                filialId: selectedFilial,
                workTypeId: selectedWorkType,
                duration: flightDuration,
                cost: flightCost
            })
        }
        else {

        }
    }
    const closeModalHandler = () => {
        props.setVisible(false);
    }
// -----

    return (
        <Modal
            title="Редактирование"
            okText={"Сохранить"}
            centered
            open={props.visible}
            onOk={updateCostHandler}
            onCancel={closeModalHandler}
            width={600}
        >
            <Form
                // @ts-ignore
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
            >
                <Form.Item label="Филиал">
                    <Select
                        defaultValue={selectedFilial.toString()}
                        disabled={isFilialsLoading}
                        size={'middle'}
                        placeholder="Выберите филиал"
                        loading={isFilialsLoading}
                        style={{width: '100%'}}
                        options={filials?.map((filial: FilialModel): {
                            value: string,
                            label: string
                        } => ({
                            value: filial.id.toString(),
                            label: `${filial.name}`
                        }))}
                        onSelect={setSelectedFilialHandler}
                    />
                </Form.Item>
                <Form.Item label="Вид работ">
                    <Select
                        defaultValue={selectedWorkType.toString()}
                        disabled={isWorkTypesLoading}
                        size={'middle'}
                        placeholder="Выберите вид работ"
                        loading={isWorkTypesLoading}
                        style={{width: '100%'}}
                        options={workTypes?.map((workType: WorkTypeModel): {
                            value: string,
                            label: string
                        } => ({
                            value: workType.id.toString(),
                            label: `${workType.name}`
                        }))}
                        onSelect={setSelectedWorkTypeHandler}
                    />
                </Form.Item>
                <Form.Item label="Время налета (час)">
                    <InputNumber style={{width: 200}} value={flightDuration}
                                 onChange={setFlightDurationHandler}/>
                </Form.Item>
                <Form.Item label="Затраты (руб)">
                    <InputNumber style={{width: 200}} value={flightCost}
                                 onChange={setFlightCostHandler}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}