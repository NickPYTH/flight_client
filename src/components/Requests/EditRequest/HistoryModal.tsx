import React, {useEffect, useState} from 'react';
import {Button, Modal, Table} from 'antd';
import {RequestHistoryGridType} from "../../../screens/Requests/Requests.types";
import {requestAPI} from "../../../services/RequestService";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    requestId: string
}

export const HistoryModal = (props: ModalProps) => {
    // States
    const [gridData, setGridData] = useState<RequestHistoryGridType[]>([])
    // -----
    // Web requests
    const [getHistoryRequest, {
        data: getRequestHistoryData,
        isLoading: isGetHistoryRequestLoading,
    }] = requestAPI.useGetHistoryMutation();
    // -----
    // Effects
    useEffect(() => {
        getHistoryRequest(props.requestId);
    }, []);
    useEffect(() => {
        if (getRequestHistoryData)
            setGridData(getRequestHistoryData);
    }, [getRequestHistoryData]);
    // -----
    // Useful utils

    // -----
    // Handlers
    const handleOk = () => {
        props.setVisible(false);
    };

    const handleCancel = () => {
        props.setVisible(false);
    };
    // -----

    return (
        <Modal title="История" open={props.visible} onOk={handleOk} onCancel={handleCancel} width={1200} footer={[
            <Button key="back" onClick={handleCancel}>
                Назад
            </Button>,
        ]}>
            <Table
                bordered={true}
                size={'small'}
                pagination={{pageSizeOptions: ['10', '15', '20', '25']}}
                expandable={{
                    expandedRowRender: (record) => <p style={{margin: 0}}>{record.field}</p>,
                    rowExpandable: (record) => record.field === 'flightPlan',
                }}
                columns={[
                    {
                        title: 'Дата изменения',
                        key: 'date',
                        dataIndex: 'date',

                    },
                    {
                        title: 'Пользователь',
                        key: 'employee',
                        dataIndex: 'employee',
                    },
                    {
                        title: 'Поле',
                        key: 'field',
                        dataIndex: 'field',
                    },
                    {
                        title: 'Действие',
                        key: 'action',
                        dataIndex: 'action',
                    },
                    {
                        title: 'Новое значение',
                        key: 'newValue',
                        dataIndex: 'newValue'
                    },
                    {
                        title: 'Старое значение',
                        key: 'oldValue',
                        dataIndex: 'oldValue',
                    },
                ]} dataSource={gridData} loading={isGetHistoryRequestLoading}/>
        </Modal>
    );
};
