import React, {useEffect, useState} from "react";
import {Button, Divider, Flex, message, Select, Tag, Typography, Upload, UploadProps} from "antd";
import {FilialModel} from "../../models/FilialModel";
import {PrinterOutlined, RollbackOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
import {BestReactGrid, Column} from "@sencha/best-react-grid";
import {filialsAPI} from "../../services/FilialsService";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {justifyOptions} from "../../configs/constants";
import {useLocation, useNavigate} from "react-router-dom";
import {requestsByFilialsAPI} from "../../services/RequestsByFilialsService";
import {RequestRoutesGridType} from "./RequestsByFilials.types";

const {Text} = Typography;

export const EditRequestByFilialScreen = () => {
    // States
    const [requestId, setRequestId] = useState<string>("");
    const [statusId, setStatusId] = useState<string>("");
    const [filialId, setFilialId] = useState<string>("");
    const [fileId, setFileId] = useState<string>("");
    const [fileList, setFileList] = useState<any[]>([{
        uid: `${fileId}`,
        name: `${fileId}`,
        status: 'done',
        url: `http://localhost:8080/flight/api/file/get?id=${fileId}`,
        percent: 100,
    }]);
    const [fileUploading, setFileUploading] = useState<boolean>(false);
    const [gridData, setGridData] = useState<RequestRoutesGridType[]>([])
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
    const [getRequestById, {
        data: requestData,
        isLoading: isLoadingGetRequestById,
        isError: isErrorGetRequestById,
    }] = requestsByFilialsAPI.useGetByIdMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllFilialsRequest();
        getRequestById(location.pathname.split("/")[2]); // get ID from path location
    }, []);
    useEffect(() => {
        if (requestData) {
            console.log(requestData.routes)
            setRequestId(requestData.id);
            setFilialId(requestData.idFilial);
            setStatusId(requestData.idState);
            setFileId(requestData.idRequestFile);
            setGridData(requestData.routes);
        }
    }, [requestData]);
    // -----

    // Handlers
    const backBtnHandler = () => {
        return navigate(`/requests`);
    }
    // -----
    console.log(gridData)
    return (
        <Flex gap="small" vertical>
            <Navbar/>
            {(filials === undefined || requestData === undefined) ?
                <>Loading</> :
                <>
                    <Flex justify={justifyOptions.flexStart}>
                        <Flex gap="middle" vertical style={{margin: "5px 34px 0 17px"}}>
                            <Button size={'large'} onClick={backBtnHandler} icon={<RollbackOutlined/>}/>
                            <Button size={'large'} icon={<SaveOutlined/>}/>
                            <Button size={'large'} icon={<PrinterOutlined/>}/>
                        </Flex>
                        <Flex gap="small" vertical>
                            <Text>Код заявки <strong>{requestId}</strong></Text>
                            <Text>Статус заявки <Tag color="blue">{requestData.nameState}</Tag></Text>
                            <Select
                                placeholder="Филиал"
                                loading={isFilialsLoading}
                                value={filialId.toString()}
                                style={{width: 330}}
                                options={filials.map((filial: FilialModel): {
                                    value: string,
                                    label: string
                                } => ({value: filial.id.toString(), label: filial.name}))}
                            />
                            <Upload  {...propsFile}>
                                <Button style={{width: 330}} icon={<UploadOutlined/>}>Обновить файл полетной
                                    заявки</Button>
                            </Upload>
                        </Flex>
                    </Flex>
                    <Divider/>
                    <Flex wrap="wrap" gap="small" justify={justifyOptions.center}>
                        <Button style={{width: 230}}
                                onClick={() => {
                                }}>Отправить на
                            согласование</Button>
                        <Button style={{width: 230}} disabled={true}
                                onClick={() => {
                                }}>Отклонить</Button>
                        <Button style={{width: 230}} disabled={true}
                                onClick={() => {
                                }}>Создать заявку на
                            полет</Button>
                        <Button style={{width: 230}}
                                onClick={() => {
                                }}>Добавить
                            маршрут</Button>
                        <Button style={{width: 230}}
                                onClick={() => {
                                }}>Добавить
                            рейс</Button>
                        <Button style={{width: 230}} disabled={true}
                                onClick={() => {
                                }}>Изменить</Button>
                        <Button style={{width: 230}} disabled={true}
                                onClick={() => {
                                }}>Удалить</Button>
                    </Flex>
                    <BestReactGrid
                        onChildDoubleTap={(e) => {
                        }}
                        display="list"
                        data={requestData.routes}
                        plugins={{
                            gridfilters: true,
                        }}
                        children={[
                            <Column
                                field="workType"
                                filterType="string"
                                flex={2}
                                text="Вид работ"
                            />,
                            <Column
                                field="employee"
                                filterType="string"
                                flex={2}
                                text="Ответсвенный"
                            />,
                            <Column
                                field="dateTime"
                                filterType="string"
                                flex={2}
                                text="Дата и время вылета"
                            />,
                            <Column
                                field="airportDeparture"
                                filterType="string"
                                flex={2}
                                text="Аэропорт вылета"
                            />,
                            <Column
                                field="airportArrival"
                                filterType="string"
                                flex={2}
                                text="Аэропорт назначения"
                            />,
                            <Column
                                field="passengerCount"
                                filterType="string"
                                flex={2}
                                text="Кол-во пассажиров"
                            />,
                            <Column
                                field="cargoWeightMount"
                                filterType="string"
                                flex={2}
                                text="Груз всего, тонн"
                            />,
                            <Column
                                field="cargoWeightOut"
                                filterType="string"
                                flex={2}
                                text="Груз на внешней подвеске, тонн"
                            />,
                            <Column
                                field="cargoWeightIn"
                                filterType="string"
                                flex={2}
                                text="Груз внутри фюзеляжа, тонн"
                            />,
                            <Column
                                field="id"
                                filterType="string"
                                flex={2}
                                text="Код заявки на полет"
                            />]}
                        style={{height: (window.innerHeight - 325).toString()}}
                    />
                </>
            }
        </Flex>
    )

}