import React, {useEffect, useState} from "react";
import {Button, Divider, Flex, message, Select, Typography, Upload, UploadProps} from "antd";
import {FilialModel} from "../../models/FilialModel";
import {RollbackOutlined, UploadOutlined} from "@ant-design/icons";
//@ts-ignore
import {Column, DateColumn, Grid} from '@sencha/ext-react-modern';
import {Ext} from "../../index";
import {filialsAPI} from "../../services/FilialsService";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {justifyOptions} from "../../configs/constants";
import {useLocation, useNavigate} from "react-router-dom";
import {RequestRoutesGridType} from "./RequestsFilials.types";
import {requestsByFilialsAPI} from "../../services/RequestFilialService";
import {UpdateFlightModal} from "../../components/RequestsByFilials/CreateRequestByFilials/UpdateFlightModal";
import {CreateFlightModal} from "../../components/RequestsByFilials/CreateRequestByFilials/CreateFlightModal";

const {Text} = Typography;

export const CreateRequestByFilialsScreen = () => {
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
        isError: isErrorGetRequestById,
    }] = requestsByFilialsAPI.useGetByIdMutation();
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
    // -----

    // Handlers
    const backBtnHandler = () => {
        return navigate(`/requests`);
    }
    // -----
    return (
        <>
            <CreateFlightModal visible={createFlightModalVisible} setVisible={setCreateFlightModalVisible}
                               setGridData={setGridData}/>
            {selectedRecord &&
                <UpdateFlightModal visible={updateFlightModalVisible} setVisible={setUpdateFlightModalVisible}
                                   rowData={selectedRecord} setRowData={setSelectedRecord} setGridData={setGridData}/>
            }
            <Flex gap="small" vertical>
                <Navbar/>
                {(filials === undefined) ?
                    <>Loading</> :
                    <>
                        <Flex style={{marginLeft: 5}} gap="small" justify={justifyOptions.flexStart}>
                            <Flex gap="small" vertical>
                                <Flex gap="small" vertical>
                                    <Button size={'middle'} onClick={backBtnHandler}
                                            icon={<RollbackOutlined/>}>Назад</Button>
                                    <Button size={'middle'}>Создать</Button>
                                </Flex>
                            </Flex>
                            <Flex gap="small" vertical>
                                <Select
                                    size={'middle'}
                                    placeholder="Выберите филиал"
                                    loading={isFilialsLoading}
                                    style={{width: 330}}
                                    options={filials.map((filial: FilialModel): {
                                        value: string,
                                        label: string
                                    } => ({value: filial.id.toString(), label: filial.name}))}
                                    onSelect={(value) => setFilialId(value)}
                                />
                                <Upload  {...propsFile}>
                                    <Button size={'middle'} style={{width: 330}} icon={<UploadOutlined/>}>Добавить файл
                                        полетной
                                        заявки</Button>
                                </Upload>
                            </Flex>
                        </Flex>
                        <Divider/>
                        <Flex wrap="wrap" gap="small" justify={justifyOptions.flexStart}
                              style={{margin: "5px 0px 0 17px"}}>
                            <Button size={'middle'} style={{width: 230}}
                                    onClick={() => setCreateFlightModalVisible(true)}>Добавить
                                маршрут</Button>
                        </Flex>
                        <Grid
                            variableHeights
                            shadow
                            store={store}
                            style={{height: window.innerHeight - 325}}
                            onChilddoubletap={(event: any) => {
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
                                hidden={true}
                            />
                        </Grid>
                    </>
                }
            </Flex>
        </>
    )

}