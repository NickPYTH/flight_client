import React, {useEffect, useState} from "react";
import {Button, Collapse, Divider, Flex, message, Modal, Select, Spin, Upload, UploadProps} from "antd";
import {FilialModel} from "../../models/FilialModel";
import {PlusOutlined, RollbackOutlined, UploadOutlined} from "@ant-design/icons";
import {filialsAPI} from "../../services/FilialsService";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {alignOptions, justifyOptions} from "../../configs/constants";
import {useNavigate} from "react-router-dom";
import {CreateRequestFilialType, RequestRoutesGridType} from "./RequestsFilials.types";
//@ts-ignore
import {Column, DateColumn, ExtTreegroupedgrid, Grid} from '@sencha/ext-react-modern';
import {Ext} from "../../index";
import {CreateFlightModal} from "../../components/RequestsByFilials/CreateRequestByFilials/CreateFlightModal";
import {UpdateFlightModal} from "../../components/RequestsByFilials/CreateRequestByFilials/UpdateFlightModal";
import {requestsByFilialsAPI} from "../../services/RequestFilialService";

export const CreateRequestByFilialsScreen = () => {
    // States
    const [messageApi, messageContextHolder] = message.useMessage();
    const [selectedFilial, setSelectedFilial] = useState<string>("");
    const [file, setFile] = useState<any | null>(null);
    const [gridData, setGridData] = useState<RequestRoutesGridType[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<RequestRoutesGridType | null>(null);
    const [createFlightModalVisible, setCreateFlightModalVisible] = useState<boolean>(false);
    const [updateFlightModalVisible, setUpdateFlightModalVisible] = useState<boolean>(false);
    // -----

    // Useful utils
    let store = Ext.create('Ext.data.Store', {
        data: gridData,
        groupers: ['workType', 'employee'],
        fields: [
            {name: 'workType', type: 'string'},
            {name: 'employee', type: 'string'},
        ]
    })
    let navigate = useNavigate();
    const propsFile: UploadProps = {
        maxCount: 1,
        customRequest: (e: any) => {
            setFile([e.file])
        },
        onRemove: () => {
            setFile(null);
        },
        fileList: file,
    }
    const missingFilialMessage = () => {
        messageApi.warning('Вы не выбрали филиал');
    };
    // -----

    // Web requests
    const [getAllFilialsRequest, {
        data: filials,
        isLoading: isFilialsLoading,
    }] = filialsAPI.useGetAllMutation();
    const [createRequestByFilial, {
        data: requestResponse,
        isLoading: isCreateRequestByFilialLoading,
    }] = requestsByFilialsAPI.useCreateMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllFilialsRequest();
    }, []);
    useEffect(() => {
        if (selectedRecord !== null)
            setUpdateFlightModalVisible(true);
    }, [selectedRecord])
    useEffect(() => {
        if (gridData.length > 0) {
            //@ts-ignore
            document?.body?.querySelectorAll("ext-treegroupedgrid")[0]?.cmp?.expandAll();
        }
    }, [gridData]);
    useEffect(() => {
        //@ts-ignore
        document?.body?.querySelectorAll("ext-treegroupedgrid")[0]?.cmp?.expandAll();
    }, [createFlightModalVisible, updateFlightModalVisible]);
    useEffect(() => {
        if (requestResponse) {
            if (file) {
                const formData = new FormData();
                formData.append("fileName", file[0].name);
                formData.append("idRequestFilial", requestResponse.id);
                formData.append("fileBody", file[0]);
                fetch('http://localhost:8080/flight/api/file/create', {
                    method: 'POST',
                    body: formData,
                })
                    .then((res) => {
                        return res.text()
                    })
                    .then((m) => {
                    })
                    .catch((error) => {
                        console.log('Ошибка загрузки файла');
                    })
            }
            return navigate(`/requestsFilials/${requestResponse.id}`);
        }
    }, [requestResponse])
    // Handlers
    const backBtnHandler = () => {
        return navigate(`/requestsFilials`);
    }
    const createRequestHandler = () => {
        if (selectedFilial) {
            let request: CreateRequestFilialType = {
                idRequestFilial: requestResponse?.id,
                idFilial: selectedFilial,
                routes: gridData
            }
            createRequestByFilial(request);
        } else {
            missingFilialMessage();
        }
    }
    // -----
    return (
        <>
            {messageContextHolder}
            <CreateFlightModal visible={createFlightModalVisible} setVisible={setCreateFlightModalVisible}
                               setGridData={setGridData}/>
            {selectedRecord &&
                <UpdateFlightModal visible={updateFlightModalVisible} setVisible={setUpdateFlightModalVisible}
                                   setGridData={setGridData} rowData={selectedRecord} setRowData={setSelectedRecord}/>
            }
            <Flex gap="small" vertical>
                <Navbar title={'Создание заявки'}/>
                {(filials === undefined || isCreateRequestByFilialLoading) ?
                    <Flex style={{height: window.innerHeight}} justify={justifyOptions.center}
                          align={alignOptions.center}>
                        <Spin size={'large'}/>
                    </Flex> :
                    <>
                        <Flex justify={justifyOptions.flexStart}>
                            <Flex gap="small" vertical style={{margin: "5px 10px 0 17px"}}>
                                <Button onClick={createRequestHandler}
                                        icon={<PlusOutlined/>}>Создать заявку</Button>
                                <Button onClick={() => {
                                    Modal.confirm({
                                        onOk: () => backBtnHandler(),
                                        okText: 'Да',
                                        title: 'Вернуться в меню?',
                                        content: 'На этой странице есть изменения, которые будут потеряны, если вы решите закрыть ее.',
                                        footer: (_, {OkBtn, CancelBtn}) => (
                                            <>
                                                <CancelBtn/>
                                                <OkBtn/>
                                            </>
                                        ),
                                    });
                                }} icon={<RollbackOutlined/>}>Вернуться в меню</Button>
                            </Flex>
                            <Divider type={'vertical'}
                                     style={{height: file ? 115 : 84}}/>
                            <Flex style={{margin: "5px 10px 0 10px"}} gap="small" vertical>
                                <Select
                                    size={'middle'}
                                    placeholder="Выберите филиал"
                                    loading={isFilialsLoading}
                                    style={{width: 330}}
                                    options={filials.map((filial: FilialModel): {
                                        value: string,
                                        label: string
                                    } => ({value: filial.id.toString(), label: filial.name}))}
                                    onSelect={(value) => setSelectedFilial(value)}
                                />
                                <Upload  {...propsFile} >
                                    <Button
                                        size={'middle'} style={{width: 330}}
                                        icon={<UploadOutlined/>}>Добавить файл
                                        полетной
                                        заявки</Button>
                                </Upload>
                            </Flex>
                        </Flex>
                        <Collapse defaultActiveKey={['0']} items={[
                            {
                                key: '0',
                                label: 'Плановые полеты',
                                children:
                                    <>
                                        <Flex wrap="wrap" gap="small" justify={justifyOptions.flexStart}
                                              style={{margin: "0 0 15px 0"}}>
                                            <Button size={'middle'}
                                                    style={{width: 152}}
                                                    onClick={() => setCreateFlightModalVisible(true)}>Добавить
                                                маршрут</Button>
                                        </Flex>

                                        {Ext.isDomReady &&
                                            <ExtTreegroupedgrid
                                                collapse={false}
                                                style={{height: window.innerHeight - 325}}
                                                store={store}
                                                columnLines
                                                grouped
                                                shadow={false}

                                                groupSummaryPosition={'docked'}
                                                summaryPosition={'docked'}
                                                onChilddoubletap={(event: any) => {
                                                    setSelectedRecord(event.location.record.data);
                                                }}
                                                columns={[
                                                    {
                                                        text: 'Вид работ',
                                                        dataIndex: 'workType',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        flex: 1,
                                                        hidden: true
                                                    },
                                                    {
                                                        text: 'Ответсвенный',
                                                        dataIndex: 'employee',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        width: 200,
                                                        hidden: true
                                                    },
                                                    {
                                                        text: 'Дата и время вылета',
                                                        dataIndex: 'dateTime',
                                                        groupable: true,
                                                        filterType: 'date',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Аэропорт вылета',
                                                        dataIndex: 'airportDeparture',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Аэропорт назначения',
                                                        dataIndex: 'airportArrival',
                                                        groupable: true,
                                                        filterType: 'string',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Кол-во пассажиров',
                                                        dataIndex: 'passengerCount',
                                                        xtype: 'numbercolumn',
                                                        align: 'center',
                                                        filterType: 'number',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Груз всего, тонн',
                                                        dataIndex: 'cargoWeightMount',
                                                        xtype: 'numbercolumn',
                                                        align: 'center',
                                                        filterType: 'number',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Груз на внешней подвеске, тонн',
                                                        dataIndex: 'cargoWeightOut',
                                                        xtype: 'numbercolumn',
                                                        align: 'center',
                                                        filterType: 'number',
                                                        flex: 1
                                                    },
                                                    {
                                                        text: 'Груз внутри фюзеляжа, тонн',
                                                        dataIndex: 'cargoWeightIn',
                                                        xtype: 'numbercolumn',
                                                        align: 'center',
                                                        filterType: 'number',
                                                        flex: 1
                                                    },
                                                ]}
                                                platformConfig={{
                                                    desktop: {
                                                        plugins: {
                                                            groupingpanel: true,
                                                            gridfilterbar: true
                                                        }
                                                    },
                                                }}
                                            >
                                            </ExtTreegroupedgrid>
                                        }
                                    </>
                            }]}/>
                    </>
                }
            </Flex>
        </>
    )

}