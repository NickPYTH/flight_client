import {Empty} from "antd";

export const NotFound = () => {
    return (
            <div style={{marginTop: 400}}>
                <Empty  image={Empty.PRESENTED_IMAGE_DEFAULT} description={"Страница не найдена"}/>
        </div>)
}