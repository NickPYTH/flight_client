import React, {useEffect, useState} from "react";
import {Button, Divider, Flex, message, Modal, Select, Tag, Typography, Upload, UploadProps} from "antd";
import {FilialModel} from "../../models/FilialModel";
import {PrinterOutlined, RollbackOutlined, UploadOutlined} from "@ant-design/icons";
import {filialsAPI} from "../../services/FilialsService";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {justifyOptions} from "../../configs/constants";
import {useLocation, useNavigate} from "react-router-dom";
import {requestsByFilialsAPI} from "../../services/RequestsByFilialsService";
import {RequestRoutesGridType} from "./RequestsByFilials.types";
//@ts-ignore
import {Column, DateColumn, Grid} from '@sencha/ext-react-modern';
import {Ext} from "../../index";
import {CreateFlightModal} from "../../components/RequestsByFilials/EditRequestByFilialScreen/CreateFlightModal";
import {UpdateFlightModal} from "../../components/RequestsByFilials/EditRequestByFilialScreen/UpdateFlightModal";

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
    const [createFlightModalVisible, setCreateFlightModalVisible] = useState<boolean>(false);
    const [updateFlightModalVisible, setUpdateFlightModalVisible] = useState<boolean>(false);
    // -----

    // Useful utils
    let store = Ext.create('Ext.data.Store', {
        fields: ['workType', 'airportArrival', 'employee'],
        data: gridData,
        groupers: ['workType', "employee"]
    });
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
    const [getRequestById, {
        data: requestData,
        isLoading: isLoadingGetRequestById,
    }] = requestsByFilialsAPI.useGetByIdMutation();
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
    // -----

    // Effects
    useEffect(() => {
        getAllFilialsRequest();
        getRequestById(location.pathname.split("/")[2]); // get ID from path location
    }, []);
    useEffect(() => {
        if (requestData) {
            console.log('here')
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
        if (selectedRecord !== null)
            setUpdateFlightModalVisible(true);
    }, [selectedRecord])
    useEffect(() => {
        console.log(sendOnConfirmData, confirmData, declineData)
        if (sendOnConfirmData || confirmData || declineData) {
            getRequestById(requestId);
        }
    }, [sendOnConfirmData, confirmData, declineData]);
    // -----

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
                    <>Loading</> :
                    <>
                        <Flex justify={justifyOptions.flexStart}>
                            <Flex gap="small" vertical style={{margin: "5px 34px 0 17px"}}>
                                <Flex gap="small" style={{margin: "0 0 7px 0"}}>
                                    <Button size={'large'} onClick={backBtnHandler} icon={<RollbackOutlined/>}/>
                                    <Button size={'large'} icon={<PrinterOutlined/>}/>
                                </Flex>
                                {requestData.nameState === 'Создано' &&
                                    <Button size={'middle'} onClick={() => {
                                        Modal.confirm({
                                            title: 'Отправка на согласование',
                                            okText: "Да, отправить",
                                            onOk: sendOnConfirmHandler,
                                            content: 'Сформировать заявку на согласование в СОП?',
                                            footer: (_, {OkBtn, CancelBtn}) => (
                                                <>
                                                    <CancelBtn/>
                                                    <OkBtn/>
                                                </>
                                            ),
                                        });
                                    }}>Отправить на согласование</Button>
                                }
                                {requestData.nameState === 'На согласовании' &&
                                    <>
                                        <Button size={'middle'} onClick={() => {
                                            Modal.confirm({
                                                title: 'Внимание',
                                                okText: "Да, утвердить",
                                                onOk: confirmHandler,
                                                content: 'Вы точно хотите утвердить заявку?',
                                                footer: (_, {OkBtn, CancelBtn}) => (
                                                    <>
                                                        <CancelBtn/>
                                                        <OkBtn/>
                                                    </>
                                                ),
                                            });
                                        }}>Утвердить</Button>
                                        <Button size={'middle'} onClick={() => {
                                            Modal.confirm({
                                                title: 'Внимание',
                                                okText: "Да, отклонить",
                                                onOk: declineHandler,
                                                content: 'Вы точно хотите отклонить заявку?',
                                                footer: (_, {OkBtn, CancelBtn}) => (
                                                    <>
                                                        <CancelBtn/>
                                                        <OkBtn/>
                                                    </>
                                                ),
                                            });
                                        }}>Отклонить</Button>
                                    </>
                                }
                                <Button disabled={requestData.nameState === 'Создано'} size={'middle'}>Создать заявку на
                                    полет</Button>
                            </Flex>
                            <Flex gap="small" vertical>
                                <Text>Код заявки <strong>{requestId}</strong></Text>
                                <Text>Статус заявки <Tag color="blue">{requestData.nameState}</Tag></Text>
                                <Select
                                    disabled={requestData.nameState === 'Утверждено'}
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
                                    <Button disabled={fileUploading || requestData.nameState === 'Утверждено'} size={'middle'} style={{width: 330}}
                                            icon={<UploadOutlined/>}>Обновить файл
                                        полетной
                                        заявки</Button>
                                </Upload>
                            </Flex>
                        </Flex>
                        <Divider/>
                        <Flex wrap="wrap" gap="small" justify={justifyOptions.flexStart}
                              style={{margin: "5px 0px 0 17px"}}>
                            <Button disabled={requestData.nameState === 'Утверждено'} size={'middle'} style={{width: 230}}
                                    onClick={() => setCreateFlightModalVisible(true)}>Добавить
                                маршрут</Button>
                        </Flex>
                        <Grid
                            variableHeights
                            shadow
                            store={store}
                            style={{height: window.innerHeight - 325}}
                            onChilddoubletap={(event: any) => {
                                if (requestData.nameState !== 'Утверждено')
                                    setSelectedRecord(event.location.record.data);
                            }}
                        >
                            <Column
                                dataIndex="workType"
                                filterType="string"
                                flex={2}
                                text="Вид работ"
                            />
                            <Column
                                editable
                                dataIndex="employee"
                                filterType="string"
                                text="Ответсвенный"
                                width={300}
                            />
                            <DateColumn
                                editable
                                dataIndex="dateTime"
                                filterType="date"
                                flex={2}
                                text="Дата и время вылета"
                            />
                            <Column
                                editable
                                dataIndex="airportDeparture"
                                filterType="string"
                                flex={2}
                                text="Аэропорт вылета"
                            />
                            <Column
                                editable
                                dataIndex="airportArrival"
                                filterType="string"
                                flex={2}
                                text="Аэропорт назначения"
                            />
                            <Column
                                editable
                                dataIndex="passengerCount"
                                filterType="string"
                                flex={2}
                                text="Кол-во пассажиров"
                            />
                            <Column
                                editable
                                dataIndex="cargoWeightMount"
                                filterType="string"
                                flex={2}
                                text="Груз всего, тонн"
                            />
                            <Column
                                editable
                                dataIndex="cargoWeightOut"
                                filterType="string"
                                flex={2}
                                text="Груз на внешней подвеске, тонн"
                            />
                            <Column
                                editable
                                dataIndex="cargoWeightIn"
                                filterType="string"
                                flex={2}
                                text="Груз внутри фюзеляжа, тонн"
                            />
                            <Column
                                dataIndex="id"
                                filterType="string"
                                flex={2}
                                text="Код заявки на полет"
                                editable={false}
                            />
                        </Grid>
                    </>
                }
            </Flex>
        </>
    )

}