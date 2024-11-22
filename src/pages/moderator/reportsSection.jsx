import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Pagination from '../../components/workspaceComponents/shared/workSpacePagination.jsx';
import { getReport } from "../../api/reportsApi.js";
import useServiceData from '../../hooks/service/useServiceData.js';
import { useNavigate, createPath } from "react-router-dom";

function ReportsSection() {
    const navigate = useNavigate();
    const [selectedResource, setSelectedResource] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [lastPage, setLastPage] = useState();
    const [filterType, setFilterType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const perPage = 10;

    const {
        data: resources,
        isLoading,
        refetch,
    } = useServiceData(['admin/reports'], getReport, setLastPage, {
        page: currentPage,
        grouped: true,
    });

    useEffect(() => {
        getReport();
    }, [currentPage, filterType, searchTerm]);

    const handleResourceClick = (resource) => {
        setSelectedResource(resource);
        setIsDialogOpen(true);
    };


    const handleOpenInNewTab = () => {
        console.log("Кнопка 'Открыть в новой вкладке' нажата");

        let catalog = selectedResource.reportable_type.toLowerCase();
        // catalog = catalog[catalog.length - 1] !== 's' ? catalog + 's' : catalog;

        switch (catalog) {
            case 'user':
                catalog = 'profile';
                break;
            default:
                break;
        }

        // const path = `/${catalog}/${selectedResource.reportable_id}`;
        // console.log(path);

        // Открыть новую вкладку
        const fullPath = `${window.location.origin}/${catalog}/${selectedResource.reportable_id}`;
        console.log(fullPath);
        window.open(fullPath, '_blank');

    };


    const handleExclude = () => {
        console.log("Кнопка 'Исключить' нажата");
    };

    const handleBlock = () => {
        console.log("Кнопка 'Заблокировать' нажата");
    };

    return (
        <Box sx={{ p: 3, gap: 2, /*bgcolor: "#fff",*/ borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
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
                    // bgcolor: "#f9f9f9",
                    border: "1px solid #ddd",
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
                                    style={{ cursor: "pointer", /*backgroundColor: "#fff",*/ transition: "0.3s" }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f1f1"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
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
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                size="sm"
                sx={{ alignSelf: "center" }}
            />

            {/* Modal Dialog */}
            <Modal open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <ModalDialog
                    aria-labelledby="resource-details"
                    sx={{ maxWidth: 600, /*bgcolor: "#fff",*/ borderRadius: "8px", p: 2 }}
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
                        <Button variant="plain" color="info" onClick={handleOpenInNewTab}>
                            Открыть в новой вкладке
                        </Button>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="soft" color="success" onClick={handleExclude}>
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
                            // bgcolor: "#f9f9f9",
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
