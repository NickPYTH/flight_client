import React from 'react';
import {FileWordOutlined, FileExcelOutlined, FilePdfOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {message, Upload} from 'antd';

const {Dragger} = Upload;

const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
        const {status} = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

export const FileUploadDND: React.FC = () => (
    <Dragger {...props}>
        <p className="ant-upload-drag-icon">
            <FileWordOutlined size={1}/>
            <FileExcelOutlined />
            <FilePdfOutlined />
        </p>
        <p style={{padding: '0 10px 0 10px'}} className="ant-upload-text">Нажмите или перетащите файлы в эту область, чтобы загрузить</p>
    </Dragger>
);
