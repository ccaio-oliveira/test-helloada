import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useAuth } from "../../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import axios from "axios";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import ModalTaskDetails from './../ModalTaskDetails/ModalTaskDetails';
import ModalTaskForm from './../ModalTaskForm/ModalTaskForm';
import { ToastContext } from "../../../context/ToastContext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const TaskTable = () => {
    const toast = useContext(ToastContext);
    const { headers, handleSetHeaders, session } = useAuth();
    const [dataTask, setDataTask] = useState([]);
    const [totalDataTask, setTotalDataTask] = useState(0);
    const [visibleDetails, setVisibleDetails] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openModalTaskForm, setOpenModalTaskForm] = useState(false);
    const [actionModalForm, setActionModalForm] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [lazyLoading, setLazyLoading] = useState(false);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        title: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const handleDataTask = async () => {
        const params = { 
            userId: session.id, 
            page: currentPage,
            limit: rowsPerPage,
            filters: filters,
            sortField: sortField,
            sortOrder: sortOrder
        };

        setLazyLoading(true);

        // faz a requisição para buscar os relatórios
        await axios.post(`/api/tasks/index`, { 
            ...params 
        }, {
            headers
        })
        .then((response) => {
            setDataTask(response.data.tasks.data);
            setTotalDataTask(response.data.total)
            setLazyLoading(false);
        })
        .catch(() => {
            setLazyLoading(false);
        });
    }

    const onPage = (event) => {
        setCurrentPage(event.page + 1);
        setRowsPerPage(event.rows);
    }

    const onSort = (event) => {
        setSortField(event.sortField);
        setSortOrder(event.sortOrder);
    }

    const clearFilter = () => {
        initFilters();
    };

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary" className="border p-2 bg-red-500 text-white"><span className="ml-1">Clear</span></Button>;
    };

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success" className="border p-2 bg-sky-500 text-white"><span className="ml-1">Apply</span></Button>;
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            title: { value: null, matchMode: FilterMatchMode.CONTAINS },
            description: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue('');
    };

    const onGlobalFilterChange = (event) => {
        setGlobalFilterValue(event.target.value);
        setFilters({ ...filters, global: { value: event.target.value, matchMode: FilterMatchMode.CONTAINS } });
    };

    const filterTemplate = (options) => {
        return (
            <InputText 
                value={options.value ?? ''} 
                onChange={(e) => options.filterCallback(e.target.value)} 
                placeholder="Search" 
                className="p-inputtext-sm p-d-block w-full border rounded p-2" 
            />
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <div className="new">
                    <Button
                        type="button" 
                        icon="pi pi-plus" 
                        label="New Task" 
                        outlined 
                        className="bg-sky-600 hover:bg-sky-800 mr-2 w-full h-full px-3 text-white flex justify-content-center" 
                        onClick={() => openModalForm('new')}
                    />
                </div>
                <div className="filters flex">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} className="bg-sky-600 hover:bg-sky-800 mr-2 w-full px-3 text-white flex justify-content-center" />
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search mr-3" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} className="p-2 pl-9 border rounded" />
                    </IconField>
                </div>
            </div>
        )
    }

    const header = renderHeader();

    const openModalDetails = async (id) => {
        toast.current.show({ severity: 'info', summary: 'Loading', detail: 'Please wait...', life: 3000 });

        await axios.get(`/api/tasks/${id}`, { headers })
        .then((response) => {
            setSelectedTask(response.data.task);
            setVisibleDetails(true);
        })
        .catch(() => {
            setVisibleDetails(false);
        });
    }

    const openModalForm = async (action) => {

        if(action !== 'new') {
            toast.current.show({ severity: 'info', summary: 'Loading', detail: 'Please wait...', life: 3000 });
            // faz a requisição para buscar o relatório
            await axios.get(`/api/tasks/${action}`, { headers })
            .then((response) => {
                setActionModalForm(response.data);
                setOpenModalTaskForm(true);
            })
            .catch(() => {
                setOpenModalTaskForm(false);
            });
        } else {
            setOpenModalTaskForm(true);
            setActionModalForm(action);
        }
    }

    const dialog = (id) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'bg-red-500 text-white py-2 px-3 ml-3',
            rejectClassName: 'bg-sky-600 text-white py-2 px-3',
            accept: () => deleteTask(id),
            reject: () => {}
        });
    }

    const deleteTask = async (id) => {
        

        toast.current.show({ severity: 'info', summary: 'Deleting', detail: 'Please wait...' });
        await axios.delete(`/api/tasks/${id}`, { headers })
        .then(() => {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task deleted successfully' });
            handleDataTask();
        })
        .catch(() => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting task' });
        });
    }

    useEffect(() => {
        if(openModalTaskForm === false){
            handleDataTask();
            setLazyLoading(true);
        }
    }, [currentPage, rowsPerPage, filters, openModalTaskForm, sortField, sortOrder]);

    return (
        <>
            <ConfirmDialog />
            <DataTable
                stripedRows
                value={dataTask}
                virtualScrollerOptions={{ 
                    lazy: true, 
                    onLazyLoad: handleDataTask, 
                    loadingTemplate: 'Loading Tasks', 
                    showLoader: true,
                    loading: lazyLoading,
                    itemSize: 10
                }}
                lazy
                loading={lazyLoading}
                paginator
                rows={rowsPerPage}
                rowsPerPageOptions={[5, 10, 15, 20, 25]}
                totalRecords={totalDataTask}
                onPage={onPage}
                dataKey="id"
                filters={filters}
                onFilter={e => setFilters(e.filters)}
                globalFilterFields={['title', 'description']}
                header={header}
                emptyMessage="No tasks found"
                onRowClick={(e) => openModalDetails(e.data.id)}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
                removableSort
            >
                <Column field="id" header="ID" sortable />
                <Column 
                    field="title" 
                    header="Title" 
                    sortable 
                    filter 
                    filterPlaceholder="Search by title" 
                    filterElement={filterTemplate}
                    filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate}
                />
                <Column 
                    field="description" 
                    header="Description" 
                    sortable 
                    filter 
                    filterPlaceholder="Search by description"
                    filterElement={filterTemplate}
                    filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate}
                />
                <Column 
                    headers="Actions"
                    body={(rowData) => (
                        <div className="flex justify-center">
                            <Button onClick={() => openModalForm(rowData.id)} type="button" icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" />
                            <Button onClick={() => dialog(rowData.id)} type="button" icon="pi pi-trash" className="p-button-rounded p-button-danger" />
                        </div>
                    )}
                />
            </DataTable>

            {
                selectedTask && (
                    <ModalTaskDetails
                        task={selectedTask}
                        visible={visibleDetails}
                        handleVisible={setVisibleDetails}
                    />
                )
            }

            {
                openModalTaskForm && (
                    <ModalTaskForm
                        action={actionModalForm}
                        visible={openModalTaskForm}
                        handleVisible={setOpenModalTaskForm}
                    />
                )
            }
        </>
    )
}

export default TaskTable;