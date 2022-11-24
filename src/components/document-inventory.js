import React from "react";
import {withStyles} from "@material-ui/core/styles";
import ServiceHelper from "../services/service.helper";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DocumentTypeService from "../services/document-type.service"
import DocumentForm from "./forms/document.form";
import DeliveryService from "../services/delivery.service";
import DocumentService from "../services/document.service"
import ArticlesService from "../services/articles.service"
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search"
import SuccessDialog from "./successdialog";
import FailedDialog from "./faileddialog";
import ConfirmDeleteDialog from "./confirm.delete.dialog";
import EditDocumentNumberForm from "./forms/edit-document-number.form";
import EditDocumentTypeForm from "./forms/edit-document-type.form";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert"

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    drawerHeader: {
        alignItems: 'center',
        padding: theme.spacing(1),
        // necessary for content to be below app bar
        justifyContent: 'flex-end',
    },
    loading: {
        marginTop: theme.spacing(15),
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center'
    },
    divider: {
        marginTop: theme.spacing(14),
    },
    textField: {
        margin: theme.spacing(1),
    }
});

class DocumentInventory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showForm: false,
            showFailedDialog: false,
            showSuccessDialog: false,
            resultDialogMessage: null,
            showConfirmDeleteDialog: false,
            loading: true,
            isAdmin: true,
            anchorEl: null,
            documentTypes: [],
            selectedDocumentType: null,
            deliveries: [],
            selectedDelivery: {
                id: ''
            },
            selectedDate: new Date(),
            selectedNumber: null,
            errorMessage: null,
            document: {
                rows: [],
                subTotal: 0,
                totalMinimTax: 0,
                totalBasicTax: 0,
                total: 0
            },
            isEdit: false,
            date: new Date(),
            isValidDocument: false,
            selectedArticle: {
                code: null,
                description: null
            },
            rowQuantity: null,
            isViewMode: false,
            anchorElDocument: null,
            showEditDocumentNumberDialog: false,
            showEditDocumentTypeDialog: false,
            searchNumber: null,
            searchFromDate: new Date(),
            searchToDate: new Date(),
            searchDelivery: {
                id: ''
            },
            searchDocumentType: {
                id: ''
            },
            tableRef: React.createRef(),
            articleCodeRef: React.createRef(),
            selectedDocument: null,
            selectedClient: {
                name: '',
                address: ''
            },
        }

        this.handleNewClick = this.handleNewClick.bind(this);
        this.handleCloseNewClick = this.handleCloseNewClick.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.onChangeDelivery = this.onChangeDelivery.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangePurchaseNumber = this.onChangePurchaseNumber.bind(this);
        this.onChangeArticleCode = this.onChangeArticleCode.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.addRow = this.addRow.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onPressS = this.onPressS.bind(this);
        this.handleDeleteConfirmDeleteDialog = this.handleDeleteConfirmDeleteDialog.bind(this);
        this.handleCloseConfirmDeleteDialog = this.handleCloseConfirmDeleteDialog.bind(this);
        this.handleCloseSuccessDialog = this.handleCloseSuccessDialog.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
        this.onClickRefreshForm = this.onClickRefreshForm.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.handleDocumentSettingsClick = this.handleDocumentSettingsClick.bind(this);
        this.handleCloseDocumentSettingsClick = this.handleCloseDocumentSettingsClick.bind(this);
        this.onChangeDocument = this.onChangeDocument.bind(this);
        this.handleEditDocumentNumber = this.handleEditDocumentNumber.bind(this);
        this.handleCloseEditDocumentNumber = this.handleCloseEditDocumentNumber.bind(this);
        this.handleEditDocumentNumberClick = this.handleEditDocumentNumberClick.bind(this);

        this.handleEditDocumentType = this.handleEditDocumentType.bind(this);
        this.handleCloseEditDocumentType = this.handleCloseEditDocumentType.bind(this);
        this.handleEditDocumentTypeClick = this.handleEditDocumentTypeClick.bind(this);
        this.onChangeDocumentType = this.onChangeDocumentType.bind(this);

        this.onChangeSearchNumber = this.onChangeSearchNumber.bind(this);
        this.onChangeSearchFromDate = this.onChangeSearchFromDate.bind(this);
        this.onChangeSearchToDate = this.onChangeSearchToDate.bind(this);
        this.onChangeSearchDelivery = this.onChangeSearchDelivery.bind(this);
        this.onChangeSearchDocumentType = this.onChangeSearchDocumentType.bind(this);
        this.handleCleanFilters = this.handleCleanFilters.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChangeFilterAccordion = this.handleChangeFilterAccordion.bind(this);

        this.onClickView = this.onClickView.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.editRow = this.editRow.bind(this);
        this.onChangeSelectedClient = this.onChangeSelectedClient.bind(this);
    }

    componentDidMount() {
        this.getAll();
        this.getAllDocumentTypes();
        this.getAllDeliveries();
    }

    getAll() {
        DocumentService.searchDocuments(this.state.searchNumber, this.state.searchFromDate, this.state.searchToDate, this.state.searchDelivery, this.state.searchDocumentType, this.props.documentType)
            .then(
                (response) => {

                    if (response != null) {
                        this.setState({
                            data: response.data,
                            loading: false
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    manageRequestErrors(message) {
        if (ServiceHelper.isUnauthorizedError(message)) {
            this.props.redirectToLogin();
        } else {
            this.setState({
                loading: false,
                showFailedDialog: true,
                resultDialogMessage: message
            });
        }
    }

    getAllDocumentTypes() {
        DocumentTypeService.getDocumentTypesByType(this.props.documentType)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            documentTypes: response.data,
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            )
    }

    getAllDeliveries() {
        DeliveryService.getDeliveries()
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            deliveries: response.data,
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            )
    }

    handleNewClick(event) {
        console.log(new Date());
        this.setState({
            anchorEl: event.currentTarget,
            isViewMode: false
        });
    };

    handleCloseNewClick(event) {
        if (event.currentTarget.value != null) {
            const selectedDocumentType = this.state.documentTypes.find(dt => {
                return dt.id === event.currentTarget.value;
            });
            this.setState({
                anchorEl: null,
                selectedDocumentType: selectedDocumentType,
                showForm: true

            });
        } else {
            this.setState({
                anchorEl: null

            });
        }
    };

    renderDocumentTypes() {
        if (this.state.documentTypes != null) {
            return this.state.documentTypes.map((dt) => {
                return (
                    <MenuItem onClick={this.handleCloseNewClick} value={dt.id}>{dt.name}</MenuItem>
                );
            });
        }
    }

    manageRequestErrorsInsideForm(message) {
        if (ServiceHelper.isUnauthorizedError(message)) {
            this.props.redirectToLogin();
        } else {
            this.setState({
                loading: false,
                errorMessage: message
            });
        }
    }

    onChangePurchaseNumber(event) {
        if (!this.state.isViewMode && event.target.value != this.state.selectedNumber) {
            this.setState({
                selectedNumber: event.target.value
            });
            if (event.target.value != null && event.target.value !== '') {
                DocumentService.validDocumentTypeAndNumber(this.state.selectedDocumentType, event.target.value)
                    .then(
                        (response) => {
                            if (response != null) {
                                this.setState({
                                    errorMessage: response.data.message,
                                });
                            } else {
                                this.manageRequestErrorsInsideForm('No hay respuesta del servidor.');
                            }
                        },
                        (error) => {
                            this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                        }
                    )
            }
        }
    }

    onChangeDate(date) {
        this.setState({
            selectedDate: date
        })
    }

    onChangeDelivery(event) {
        if (!this.state.isViewMode) {

            const selectedDelivery = this.state.deliveries.find(d => {
                return d.id === event.target.value;
            });
            this.setState({
                selectedDelivery: selectedDelivery
            });
            this.state.articleCodeRef.current.focus();
        }
    }

    onChangeArticleCode(event) {
        this.setState({});
        if (event.target.value != null && event.target.value !== '') {
            ArticlesService.getArticleByCode(event.target.value)
                .then(
                    (response) => {
                        if (response != null) {
                            this.setState({
                                selectedArticle: response.data,
                            });
                        } else {
                            this.manageRequestErrorsInsideForm('No hay respuesta del servidor.');
                        }
                    },
                    (error) => {
                        this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                    }
                )
        }
    }

    onChangeQuantity(event) {
        this.setState({
            rowQuantity: event.target.value
        })
    }

    addRow() {
        DocumentService.addRow(this.state.selectedNumber, this.state.selectedDocumentType,
            this.state.selectedDate, this.state.selectedDelivery, this.state.selectedArticle.id, this.state.rowQuantity
            , this.state.selectedClient)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            isValidDocument: true,
                            document: response.data,
                            selectedArticle: {},
                            selectedNumber: response.data.number
                        });
                        this.state.tableRef.current.scrollIntoView();
                    } else {
                        this.manageRequestErrorsInsideForm('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                }
            )
        this.setState({
            selectedArticle: {
                code: '',
                description: ''
            },
            rowQuantity: ''
        });
    }

    deleteRow(row) {
        DocumentService.deleteRow(this.state.selectedNumber, this.state.selectedDocumentType,
            this.state.selectedDate, this.state.selectedDelivery, row.article.id, row.quantity)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            isValidDocument: true,
                            document: response.data,
                            selectedArticle: {},
                            errorMessage : null
                        });
                    } else {
                        this.manageRequestErrorsInsideForm('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                }
            )
        this.setState({
            selectedArticle: {
                code: '',
                description: ''
            },
            rowQuantity: ''
        });
    }

    editRow(row, newArticleCode, newQuantity) {
        console.log(row);
        DocumentService.editRow(this.state.selectedNumber, this.state.selectedDocumentType,
            row.article.id, row.quantity, newArticleCode, newQuantity)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            isValidDocument: true,
                            document: response.data,
                            selectedArticle: {},
                            errorMessage : null
                        });
                    } else {
                        this.manageRequestErrorsInsideForm('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                }
            )
        this.setState({
            selectedArticle: {
                code: '',
                description: ''
            },
            rowQuantity: ''
        });
    }

    handleFormClose() {
        if (this.state.selectedNumber != null && this.state.selectedNumber !== '') {
            DocumentService.cancelDocument(this.state.document.number, this.state.selectedDocumentType)
                .then(
                    (response) => {
                        //Nothing, I notify only in error
                    },
                    (error) => {
                        this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                    }
                );
        }
        this.setState({
            showForm: false,
            loading: true,
            selectedDelivery: {
                id: ''
            },
            selectedDate: new Date(),
            selectedNumber: null,
            errorMessage: null,
            document: {
                rows: [],
                subTotal: 0,
                totalMinimTax: 0,
                totalBasicTax: 0,
                total: 0
            },
            isEdit: false,
            date: new Date(),
            isValidDocument: false,
            selectedArticle: {
                code: null,
                description: null
            },
            rowQuantity: null,
            isView: false,
            showEditDocumentNumberDialog: false,
            showEditDocumentTypeDialog: false,
            selectedClient: {
                name: '',
                address: ''
            },
        });
        this.getAll();
    }

    onPressS(event) {
        event = (event || window.event);
        if (event.keyCode === 115) {
            this.handleSave();
        }
    }

    handleSave() {
        //const nextNumber = this.state.document.number + 1;
        if (!this.state.isEdit) {
            this.newDocument();
        } else {
            this.updateDocument();
        }
    }

    newDocument() {
        DocumentService.saveDocument(this.state.selectedNumber, this.state.selectedDocumentType)
            .then(
                (response) => {
                    if (response != null) {
                        this.clearForm()
                    } else {
                        this.manageRequestErrorsInsideForm('No hay respuesta del servidor.');
                    }
                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    updateDocument() {
        DocumentService.updateDocument(this.state.selectedNumber, this.state.selectedDocumentType, this.state.selectedDate, this.state.selectedDelivery,
            this.state.selectedClient)
            .then(
                (response) => {
                    if (response != null) {
                        this.clearForm()
                    } else {
                        this.manageRequestErrorsInsideForm('No hay respuesta del servidor.');
                    }
                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    clearForm() {
        const continueShowForm = !this.state.isEdit;
        this.setState({
            showForm: continueShowForm,
            showSuccessDialog: false,
            loading: true,
            selectedDelivery: {
                id: ''
            },
            selectedDate: new Date(),
            selectedNumber: null,
            errorMessage: null,
            document: {
                number: null,
                rows: [],
                subTotal: 0,
                totalMinimTax: 0,
                totalBasicTax: 0,
                total: 0
            },
            isEdit: false,
            date: new Date(),
            isValidDocument: false,
            selectedArticle: {
                code: null,
                description: null
            },
            rowQuantity: null,
            isView: false,
            showEditDocumentNumberDialog: false,
            showEditDocumentTypeDialog: false,
            expanded: false,
            anchorElDocument: null,
            selectedClient: {
                name: '',
                address: ''
            },        });
    }

    onClickView() {
        DocumentService.getDocumentById(this.state.selectedDocument.id)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: true,
                            showSuccessDialog: false,
                            selectedDelivery: response.data.delivery,
                            selectedDate: response.data.date,
                            selectedNumber: response.data.number,
                            errorMessage: null,
                            document: response.data,
                            isEdit: false,
                            date: response.data.date,
                            selectedDocumentType: response.data.documentType,
                            isViewMode: true,
                            anchorElDocument: null,
                            selectedClient: response.data.client
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');
                    }

                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));

                }
            );
    }

    confirmDelete() {
        this.setState({
            document: {
                id: this.state.selectedDocument.id
            },
            showConfirmDeleteDialog: true,
            resultDialogMessage: 'Eliminar el documento ' + this.state.selectedDocument.documentType.name + ' con el numero:  ' + this.state.selectedDocument.number + ' ?'
        })
    }

    handleCloseSuccessDialog() {
        this.setState({
            showSuccessDialog: false,

        });
    }

    handleCloseFailedDialog() {
        this.setState({
            showFailedDialog: false
        });
    }

    handleCloseConfirmDeleteDialog() {
        this.setState({
            showConfirmDeleteDialog: false,

        });
    }

    handleDeleteConfirmDeleteDialog() {
        this.setState({
            showConfirmDeleteDialog: false,
        });
        this.deleteDocument()
    }

    deleteDocument() {
        DocumentService.deleteDocumentById(this.state.document.id)
            .then(
                (response) => {

                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Eliminada con exito',
                            loading: true,
                            selectedDelivery: {
                                id: ''
                            },
                            selectedDate: new Date(),
                            selectedNumber: null,
                            errorMessage: null,
                            document: {
                                number: null,
                                rows: [],
                                subTotal: 0,
                                totalMinimTax: 0,
                                totalBasicTax: 0,
                                total: 0
                            },
                            isEdit: false,
                            date: new Date(),
                            isValidDocument: false,
                            selectedArticle: {
                                code: null,
                                description: null
                            },
                            rowQuantity: null,
                            isView: false,
                            selectedDocumentType: {
                                name: null
                            },
                            anchorElDocument: null,
                            selectedClient: {
                                name: '',
                                address: ''
                            },                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');
                    }

                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    onClickEdit() {
        DocumentService.getDocumentById(this.state.selectedDocument.id)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: true,
                            showSuccessDialog: false,
                            selectedDelivery: response.data.delivery,
                            selectedDate: new Date(response.data.date.split('-')),
                            selectedNumber: response.data.number,
                            errorMessage: null,
                            document: response.data,
                            isEdit: true,
                            isValidDocument: true,
                            date: response.data.date,
                            selectedDocumentType: response.data.documentType,
                            isViewMode: false,
                            anchorElDocument: null,
                            selectedClient: response.data.client,

                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');

                    }

                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    onClickRefreshForm() {
        this.handleFormClose();
        this.setState({
            showForm: true
        });
    }

    handleDocumentSettingsClick(event, document) {
        this.setState({
            anchorElDocument: event.currentTarget,
            selectedDocument: document
        });
    };

    handleCloseDocumentSettingsClick(event) {
        if (event.currentTarget.value != null) {
            this.setState({
                anchorElDocument: null,
            });
        } else {
            this.setState({
                anchorElDocument: null

            });
        }
    };

    onChangeDocument(document) {
        this.setState({
            document: document
        })
    }

    handleEditDocumentNumberClick() {
        this.setState({
            showEditDocumentNumberDialog: true,
            document: this.state.selectedDocument,
            selectedNumber: this.state.selectedDocument.number,
            selectedDocumentType: this.state.selectedDocument.documentType
        });
    }

    handleEditDocumentNumber() {
        DocumentService.editDocumentNumber(this.state.document, this.state.selectedNumber)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            anchorElDocument: null,
                            showEditDocumentNumberDialog: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Numero cambiado con exito',
                            selectedNumber: null,
                            errorMessage: null,
                            document: response.data,
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor');
                    }
                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    handleCloseEditDocumentNumber() {
        this.setState({
            anchorElDocument: null,
            showEditDocumentNumberDialog: false,
        });
    }

    handleEditDocumentTypeClick() {
        this.setState({
            showEditDocumentTypeDialog: true,
            document: this.state.selectedDocument,
            selectedNumber: this.state.selectedDocument.number,
            selectedDocumentType: this.state.selectedDocument.documentType
        });
    }

    handleEditDocumentType() {
        DocumentService.editDocumentType(this.state.document, this.state.selectedDocumentType)
            .then(
                (response) => {

                    if (response != null) {
                        this.setState({
                            anchorElDocument: null,
                            showEditDocumentTypeDialog: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Tipo cambiado con exito',
                            selectedNumber: null,
                            errorMessage: null,
                            document: response.data
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');
                    }
                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    handleCloseEditDocumentType() {
        this.setState({
            anchorElDocument: null,
            showEditDocumentTypeDialog: false,
        });
    }

    onChangeDocumentType(event) {
        const selectedDocumentType = this.state.documentTypes.find(d => {
            return d.id === event.target.value;
        });
        this.setState({
            selectedDocumentType: selectedDocumentType
        });
    }

    renderSearchDeliveryOptions() {
        if (this.state.deliveries != null) {
            return this.state.deliveries.map((delivery) => {
                return (
                    <MenuItem
                        label="Reparto"
                        value={delivery.id}
                        key={delivery.id} name={delivery.name}
                    >{delivery.code} - {delivery.name}</MenuItem>
                );
            });
        }
    }

    onChangeSearchNumber(event) {
        this.setState({
            searchNumber: event.target.value
        })
    }

    onChangeSearchDelivery(event) {
        const selectedDelivery = this.state.deliveries.find(d => {
            return d.id === event.target.value;
        });
        this.setState({
            searchDelivery: selectedDelivery
        });
    }

    onChangeSearchFromDate(date) {
        this.setState({
            searchFromDate: date
        })
    }

    onChangeSearchToDate(date) {
        this.setState({
            searchToDate: date
        })
    }

    onChangeSearchDocumentType(event) {
        const selectedDocumentType = this.state.documentTypes.find(d => {
            return d.id === event.target.value;
        });
        this.setState({
            searchDocumentType: selectedDocumentType
        });
    }

    renderSearchDocumentTypeOptions() {
        if (this.state.documentTypes != null) {
            return this.state.documentTypes.map((dt) => {
                return (
                    <MenuItem
                        label="Tipo de Documento"
                        value={dt.id}
                        key={dt.id} name={dt.name}
                    >{dt.name}</MenuItem>
                );
            });
        }
    }

    handleCleanFilters() {
        document.getElementById('search_number').value = '';
        this.setState({
            searchNumber: null,
            searchFromDate: new Date(),
            searchToDate: new Date(),
            searchDelivery: {
                id: null
            },
            searchDocumentType: {
                id: null
            }
        });
        this.getAll();
    }

    handleSearch() {
        this.setState({
            loading: true
        });
        DocumentService.searchDocuments(this.state.searchNumber, this.state.searchFromDate, this.state.searchToDate, this.state.searchDelivery, this.state.searchDocumentType, this.props.documentType)
            .then(
                (response) => {

                        if (response != null) {
                            this.setState({
                                data: response.data,
                                loading: false
                            });
                        } else {
                            this.manageRequestErrors('No hay respuesta del servidor.');
                        }
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    handleChangeFilterAccordion() {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    onChangeSelectedClient(selectedClient) {
        if (!this.state.isViewMode) {
            this.setState({
                selectedClient: selectedClient[0]
            });
        }
    }

    render() {
        const {classes} = this.props;

        const options = {
            filterType: "textField",
            selectableRows: 'none',
            filter: false,
            search: false,
            textLabels: {
                body: {
                    noMatch: 'No hay Documentos'
                },
                pagination: {
                    next: "Proxima Pagina",
                    previous: "Pagina Anterior",
                    rowsPerPage: "Filas por pagina:",
                    displayRows: "of",
                },
                toolbar: {
                    search: "Buscar",
                    downloadCsv: "Descargar",
                    print: "Imprimir",
                    viewColumns: "Ver Columnas",
                    filterTable: "Filtrar",
                },
                filter: {
                    all: "Todos",
                    title: "Filtros",
                    reset: "Reiniciar",
                },
            }
        }
        const columns = [
            {
                name: "Tipo",
                options: {
                    display: !this.props.isInventory,
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['documentType']['name']}
                            </div>
                        );
                    }
                }
            },
            {label: "Numero", name: "number", options : { display: !this.props.isInventory}},
            {label: "Fecha", name: "date", options: {filter: false}},
            {
                name: "Reparto",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['delivery']['name']}
                            </div>
                        );
                    }
                }
            },
            {label: "SubTotal", name: "subTotal", options: {filter: false}},
            {label: "Iva Minimo", name: "totalMinimTax", options: {filter: false}},
            {label: "Iva Basico", name: "totalBasicTax", options: {filter: false}},
            {label: "Descuento", name: "discount", options: {filter: false, display: this.props.isSale}},
            {label: "Total", name: "total", options: {filter: false}},
            {
                name: "Acciones",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {this.state.isAdmin ?
                                    <div>
                                        <IconButton
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            style={{float: 'right'}}
                                            onClick={(e) => this.handleDocumentSettingsClick(e, tableMeta.tableData[tableMeta.rowIndex])}
                                        >
                                            <MoreVertIcon/>
                                        </IconButton>
                                        <Menu
                                            id="simple-menu-document"
                                            anchorEl={this.state.anchorElDocument}
                                            keepMounted
                                            open={Boolean(this.state.anchorElDocument)}
                                            onClose={this.handleCloseDocumentSettingsClick}
                                        >

                                            <MenuItem value={'viewDocument'}
                                                      onClick={this.onClickView}><SearchIcon/>Ver</MenuItem>
                                            <MenuItem value={'editDocument'}
                                                      onClick={this.onClickEdit}><EditIcon/>Editar</MenuItem>
                                            <MenuItem value={'deleteDocument'}
                                                      onClick={this.confirmDelete}><DeleteIcon/>Eliminar</MenuItem>


                                            <MenuItem value={'changeNumber'}
                                                      onClick={this.handleEditDocumentNumberClick}> Cambiar
                                                Numero</MenuItem>
                                            <MenuItem value={'changeDocumentType'}
                                                      onClick={this.handleEditDocumentTypeClick}> Cambiar
                                                Tipo</MenuItem>
                                        </Menu>
                                    </div>
                                    : ''}
                            </div>
                        );
                    },
                    print: false
                }
            },

        ]
        return (

            <div>

                {this.state.loading ? <div className={classes.loading}><CircularProgress size={250}/></div> :
                    <div>
                        <Accordion square expanded={this.state.expanded} onChange={this.handleChangeFilterAccordion}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header"
                                              expandIcon={<ExpandMoreIcon/>}>
                                <SearchIcon/>
                                <Typography>Buscar</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    {!this.props.isInventory ?
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="search_number"
                                            label="Numero"
                                            type="number"
                                            style={{width: '20%'}}
                                            className={classes.textField}
                                            onBlur={this.onChangeSearchNumber}
                                            defaultValue={this.state.searchNumber}
                                        /> : ''}
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                        <KeyboardDatePicker
                                            autoOk
                                            id="search_from_date_picker"
                                            variant="inline"
                                            inputVariant="outlined"
                                            label="Desde Fecha"
                                            format="dd/MM/yyyy"
                                            value={this.state.searchFromDate}
                                            InputAdornmentProps={{position: "start"}}
                                            onChange={date => this.onChangeSearchFromDate(date)}
                                            className={classes.textField}
                                            style={{width: '25%'}}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                        <KeyboardDatePicker
                                            autoOk
                                            id="search_to_date_picker"
                                            variant="inline"
                                            inputVariant="outlined"
                                            label="Hasta Fecha"
                                            format="dd/MM/yyyy"
                                            value={this.state.searchToDate}
                                            InputAdornmentProps={{position: "start"}}
                                            onChange={date => this.onChangeSearchToDate(date)}
                                            className={classes.textField}
                                            style={{width: '25%'}}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <TextField
                                        id="search_delivery_select"
                                        select
                                        label="Reparto"
                                        value={this.state.searchDelivery.id}
                                        onChange={this.onChangeSearchDelivery}
                                        style={{width: '30%'}}
                                    >
                                        {this.renderSearchDeliveryOptions()}
                                    </TextField>
                                    &nbsp;&nbsp;&nbsp;
                                    {!this.props.isInventory ?
                                        <TextField
                                            id="search_document_type_select"
                                            select
                                            label="Tipo de Documento"
                                            value={this.state.searchDocumentType.id}
                                            onChange={this.onChangeSearchDocumentType}
                                            style={{width: '35%'}}
                                        >
                                            {this.renderSearchDocumentTypeOptions()}
                                        </TextField>
                                        : ''}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        startIcon={<SearchIcon/>}
                                        onClick={this.handleSearch}
                                    >
                                        Buscar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.handleCleanFilters}
                                    >
                                        Limpiar Filtros
                                    </Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        {this.state.isAdmin ?
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<AddIcon/>}
                                    style={{float: 'right'}}
                                    onClick={this.handleNewClick}
                                >
                                    Nuevo
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={this.state.anchorEl}
                                    keepMounted
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={this.handleCloseNewClick}
                                >

                                    {this.renderDocumentTypes()}
                                </Menu>
                            </div> : ''}
                        <MUIDataTable
                            title={this.props.title}
                            data={this.state.data}
                            columns={columns}
                            options={options}
                        />
                        {this.state.showForm ?
                            <div>
                                <DocumentForm open={this.state.showForm} handleClose={this.handleFormClose}
                                              handleSave={this.handleSave}
                                              title={this.state.selectedDocumentType.name}
                                              date={this.state.selectedDate}
                                              onChangeDelivery={this.onChangeDelivery}
                                              deliveries={this.state.deliveries}
                                              delivery={this.state.selectedDelivery.id} onChangeDate={this.onChangeDate}
                                              onChangePurchaseNumber={this.onChangePurchaseNumber}
                                              message={this.state.errorMessage}
                                              isValidDocument={this.state.isValidDocument}
                                              onChangeArticleCode={this.onChangeArticleCode}
                                              articleDescription={this.state.selectedArticle.description}
                                              addRow={this.addRow} articleCode={this.state.selectedArticle.code}
                                              rows={this.state.document.rows} onChangeQuantity={this.onChangeQuantity}
                                              rowQuantity={this.state.rowQuantity}
                                              subTotal={this.state.document.subTotal}
                                              minTaxes={this.state.document.totalMinimTax}
                                              basicTaxes={this.state.document.totalBasicTax}
                                              total={this.state.document.total}
                                              number={this.state.selectedNumber}
                                              selectedDocumentType={this.state.selectedDocumentType}
                                              onPressS={this.onPressS} isAdmin={this.state.isAdmin}
                                              isViewMode={this.state.isViewMode}
                                              onClickRefreshForm={this.onClickRefreshForm}
                                              deleteRow={this.deleteRow}
                                              selectedDocument={this.state.document}
                                              onChangeDocument={this.onChangeDocument}
                                              tableRef={this.state.tableRef}
                                              articleCodeRef={this.state.articleCodeRef}
                                              isInventory={this.props.isInventory}
                                              editRow={this.editRow}
                                              selectClients={this.onChangeSelectedClient}
                                              clientsNames={this.state.selectedClient != null ? this.state.selectedClient.name + ' ' + this.state.selectedClient.address : ''}
                                              isSale={this.props.isSale}
                                />
                            </div> : ''
                        }
                    </div>
                }
                {this.state.showSuccessDialog ?
                    <div>
                        <SuccessDialog showSuccessDialog={this.state.showSuccessDialog}
                                       handleCloseSuccessDialog={this.handleCloseSuccessDialog}
                                       resultDialogMessage={this.state.resultDialogMessage} title='Documentos'/>
                    </div> : ''
                }
                {this.state.showFailedDialog ?
                    <div>
                        <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                      handleCloseFailedDialog={this.handleCloseFailedDialog}
                                      resultDialogMessage={this.state.resultDialogMessage} title='Documentos'/>
                    </div> : ''
                }
                {this.state.showConfirmDeleteDialog ?
                    <div>
                        <ConfirmDeleteDialog showConfirmDeleteDialog={this.state.showConfirmDeleteDialog}
                                             handleDeleteConfirmDeleteDialog={this.handleDeleteConfirmDeleteDialog}
                                             handleCloseConfirmDeleteDialog={this.handleCloseConfirmDeleteDialog}
                                             resultDialogMessage={this.state.resultDialogMessage} title='Eliminar'/>
                    </div> : ''
                }
                {this.state.showEditDocumentNumberDialog ?
                    <div>
                        <EditDocumentNumberForm open={this.state.showEditDocumentNumberDialog}
                                                handleEditDocumentNumber={this.handleEditDocumentNumber}
                                                handleCloseEditDocumentNumber={this.handleCloseEditDocumentNumber}
                                                message={this.state.errorMessage}
                                                number={this.state.selectedNumber}
                                                onChangePurchaseNumber={this.onChangePurchaseNumber}
                        />
                    </div> : ''
                }
                {this.state.showEditDocumentTypeDialog ?
                    <div>
                        <EditDocumentTypeForm open={this.state.showEditDocumentTypeDialog}
                                              message={this.state.errorMessage}
                                              documentTypes={this.state.documentTypes}
                                              handleCloseEditDocumentType={this.handleCloseEditDocumentType}
                                              documentType={this.state.selectedDocumentType}
                                              onChangeDocumentType={this.onChangeDocumentType}
                                              handleEditDocumentType={this.handleEditDocumentType}

                        />
                    </div> : ''
                }
            </div>
        );
    }

}

export default withStyles(useStyles)(DocumentInventory);
