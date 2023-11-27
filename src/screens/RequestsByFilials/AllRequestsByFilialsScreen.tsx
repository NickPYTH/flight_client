import React, {useEffect, useState} from "react";
import {Navbar} from "../../components/Layout/Header/Navbar";
import {BestReactGrid, Column} from "@sencha/best-react-grid";
import "@sencha/best-react-grid/dist/themes/grui.css";
import {Button, Flex, Select} from "antd";
import {justifyOptions, YEARS} from "../../configs/constants";
import {requestsByFilialsAPI} from "../../services/RequestsByFilialsService";
import {RequestsByFilialsGridType} from "./RequestsByFilials.types";
import {useNavigate} from "react-router-dom";

export const AllRequestsByFilialsScreen = () => {
    let navigate = useNavigate();
    const [data, setData] = useState<RequestsByFilialsGridType[]>([]);
    const [getAllRequestsByFilials, {
        data: dataGetAllRequestByFilials,
        isLoading: isLoadingGetAllRequestByFilials,
    }] = requestsByFilialsAPI.useGetAllByYearMutation();
    const [year, setYear] = useState<number>(2023);
    const addBtnHandler = () => {
        return navigate(`create`);
    };
    const selectYearHandler = (value: number) => {
        setYear(value);
        getAllRequestsByFilials(value);
    };
    useEffect(() => {
        getAllRequestsByFilials(year)
    }, []);
    useEffect(() => {
        if (dataGetAllRequestByFilials) {
            setData(dataGetAllRequestByFilials)
        }
    }, [dataGetAllRequestByFilials]);
    return (
        <Flex gap="small" vertical>
            <Navbar/>
            <Flex style={{margin: "0 5px 0 5px"}} gap={"small"} vertical={false} justify={justifyOptions.spaceBetween}>
                <Button onClick={addBtnHandler}>Добавить</Button>
                <Select
                    disabled={isLoadingGetAllRequestByFilials}
                    value={year}
                    onChange={selectYearHandler}
                    options={YEARS.map((year: number) => ({value: year, label: year.toString()}))}
                />
            </Flex>
            <BestReactGrid
                data={data}
                style={{height: (window.innerHeight - 100).toString()}}
                onChildDoubleTap={(e) => {
                    const id = e.record.data.id;
                    return navigate(`${id}`);
                }}
                display="treeGroupedGrid"
                groupHeaderTpl="{name} ({group.length})"
                plugins={{
                    gridsummaries: true,
                }}
                stateful
                summaryPosition="docked"
            >
                <Column
                    field="id"
                    filterType="string"
                    flex={1}
                    groupable
                    text="Код"
                />
                <Column
                    field="createDate"
                    filterType="string"
                    flex={2}
                    sortable
                    text="Дата создания"
                />
                <Column
                    field="createDate"
                    filterType="string"
                    flex={2}
                    sortable
                    text="Дата вылета"
                />
                <Column
                    field="nameFilial"
                    filterType="string"
                    flex={2}
                    groupable
                    text="Филиал"
                />
                <Column
                    field="nameState"
                    filterType="string"
                    flex={2}
                    groupable
                    text="Состояние"
                />
            </BestReactGrid>
        </Flex>
    )
}