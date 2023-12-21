import React, {useEffect, useState} from 'react';
import {FileExcelOutlined, FilePdfOutlined, FileWordOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {message, Upload} from 'antd';
import {fileStorageAPI} from "../../../services/FileStorageService";

const {Dragger} = Upload;

export const FileUploadDND = (props: any) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const propsFile: UploadProps = {
        maxCount: 1,
        customRequest: (e: any) => {
            const formData = new FormData();
            formData.append("fileName", e.file.name);
            formData.append("idRequest", props.requestId);
            formData.append("fileBody", e.file);

            fetch('http://localhost:8080/flight/api/file/addToRequest', {
                method: 'POST',
                body: formData,
            })
                .then((res) => {
                    return res.text()
                })
                .then((id) => {
                    setFileList(prev => prev.concat({
                        uid: e.file.uid,
                        id: id,
                        name: e.file.name,
                        status: "done",
                        url: `http://localhost:8080/flight/api/file/get?id=${id}`,
                        percent: 100
                    }));
                    message.success('Файл обновлен');
                })
                .catch((error) => {
                    message.error('Ошибка загрузки файла');
                })
                .finally(() => {
                    //setFileUploading(false);
                });
        },
        beforeUpload: (file) => {
            return true;
        },
        onRemove: (file: any) => {
            let requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };
            //@ts-ignore
            fetch(`http://localhost:8080/flight/api/file/delete?id=${file.id}`, requestOptions)
                .then(response => {
                })
                .then(result => {
                    message.error('Файл удален');
                    setFileList(prev => prev.filter(f => f.id !== file.id));
                })
                .catch(error => {
                    message.error('Ошибка удаления файла');
                    console.log('error', error);
                });
        },
        fileList
    }
    const [getFilesRequest, {
        data: getFilesData,
        isLoading: isGetFilesLoading,
    }] = fileStorageAPI.useGetAllMutation();
    useEffect(() => {
        console.log(props)
        getFilesRequest(props.requestId);
    }, []);
    useEffect(() => {
        if (getFilesData) {
            setFileList(getFilesData);
        }
    }, [getFilesData]);
    return (
        <Dragger {...propsFile}>
            <p style={{padding: '0 10px 0 10px'}} className="ant-upload-text">Нажмите или перетащите файлы в эту
                область, чтобы загрузить</p>
        </Dragger>
    );
}
