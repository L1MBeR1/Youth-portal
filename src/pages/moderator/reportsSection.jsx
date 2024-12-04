import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Pagination from '../../components/workspaceComponents/shared/workSpacePagination.jsx';
import { getReport, blockResource, excludeResource } from "../../api/reportsApi.js";
import useServiceData from '../../hooks/service/useServiceData.js';
import { useNavigate, createPath } from "react-router-dom";

function ReportsSection() {
    const navigate = useNavigate();
    const [selectedResource, setSelectedResource] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filterType, setFilterType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();

    const perPage = 10;

    const {
        data: resources,
        isLoading,
        refetch,
    } = useServiceData(["admin/reports"], getReport, setTotalPages, {
        page: currentPage,
        grouped: true,
    });

    useEffect(() => {
        refetch();
    }, [currentPage, refetch]);

    useEffect(() => {
        getReport();
    }, [currentPage, filterType, searchTerm]);

    const handleResourceClick = (resource) => {
        setSelectedResource(resource);
        setIsDialogOpen(true);
    };


    const handleOpenInNewTab = () => {
        console.log(totalPages);
        const resourceType = selectedResource.reportable_type.toLowerCase();
        const catalog = resourceType === 'user' ? 'profile' : resourceType;
        const url = `${window.location.origin}/${catalog}/${selectedResource.reportable_id}`;

        window.open(url, '_blank');
    };



    const handleExclude = () => { //TODO: TOKEN
        excludeResource(null, selectedResource.reportable_type, selectedResource.reportable_id)
        console.log("Кнопка 'Исключить' нажата");
        // TODO: действие после
    };

    const handleBlock = () => { //TODO: TOKEN
        blockResource(null, selectedResource.reportable_type, selectedResource.reportable_id);
        console.log("Кнопка 'Заблокировать' нажата");
        // TODO: действие после
    };

    return (
        <Box>
            <Typography fontWeight={700} fontSize={30} sx={{ mb: 2 }}>
                Жалобы
            </Typography>

            {/* TODO: Наверно не надо фильтровать */}
            {/* Resources Table */}
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "md",
                    overflow: "auto",
                    p: 2,
                    mb: 2,
                    border: "1px solid #ddd",
                    //TODO: Настроить высоту
                }}
            >
                {isLoading ? (
                    <Typography>Загружается...</Typography>
                ) : (
                    <Table hoverRow>
                        <thead>
                            <tr>
                                <th>Категория</th>
                                <th>Название</th>
                                <th>Количество жалоб</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource) => (
                                <tr
                                    key={resource.reportable_id}
                                    onClick={() => handleResourceClick(resource)}
                                >
                                    <td>{resource.reportable_type_label}</td>
                                    <td>{resource.reportable_name}</td>
                                    <td>{resource.reports_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Sheet>

            {/* Pagination */}
            <Pagination
                lastPage={totalPages}
                page={currentPage}
                onPageChange={setCurrentPage}
                size="sm"
                sx={{ alignSelf: "center" }}
            />

            {/* Modal Dialog */}
            <Modal open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <ModalDialog
                    aria-labelledby="resource-details"
                    sx={{ maxWidth: 600, borderRadius: "8px", p: 2 }}
                    layout="center"
                >
                    <ModalClose />

                    <Typography id="resource-details" level="h5" fontWeight="lg">
                        Подробности
                    </Typography>

                    {selectedResource && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography>
                                <strong>Тип:</strong> {selectedResource.reportable_type_label}
                            </Typography>
                            <Typography>
                                <strong>Название:</strong> {selectedResource.reportable_name}
                            </Typography>
                            <Typography>
                                <strong>Отчётов:</strong> {selectedResource.reports_count}
                            </Typography>
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                            gap: 1,
                        }}
                    >
                        <Button variant="solid" color="primary" onClick={handleOpenInNewTab}>
                            Открыть в новой вкладке
                        </Button>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="soft" color="primary" onClick={handleExclude}>
                                Исключить
                            </Button>
                            <Button variant="solid" color="danger" onClick={handleBlock}>
                                Заблокировать
                            </Button>
                        </Box>
                    </Box>

                    {/* Reports Table */}
                    <Sheet
                        variant="outlined"
                        sx={{
                            borderRadius: "md",
                            mt: 2,
                            overflow: "auto",
                            maxHeight: "200px",
                        }}
                    >
                        <Table hoverRow>
                            <thead>
                                <tr>
                                    <th>Причина</th>
                                    <th>Описание</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedResource?.reports_details.map((report, index) => (
                                    <tr key={index}>
                                        <td>{report.reason}</td>
                                        <td>{report.details ? report.details : "Нет описания"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                </ModalDialog>
            </Modal>
        </Box>
    );
}

export default ReportsSection;
