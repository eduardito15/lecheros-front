import React from "react";
import {withStyles} from "@material-ui/core/styles";
import AuthService from "../../services/auth.service";
import ClientService from "../../services/client.service"
import ServiceHelper from "../../services/service.helper";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import SuccessDialog from "../successdialog";
import FailedDialog from "../faileddialog";
import ConfirmDeleteDialog from "../confirm.delete.dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeliveryService from "../../services/delivery.service";
import ClientForm from "./forms/client.form";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    loading: {
        marginTop: theme.spacing(15),
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center'
    },
});

class Clients extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showForm: false,
            showSuccessDialog: false,
            showFailedDialog: false,
            resultDialogMessage: null,
            resultErrorMessage: null,
            selectedClient: {
                id: null
            },
            isEdit: false,
            isAdmin: false,
            showConfirmDeleteDialog: false,
            loading: true,
            deliveries: [],
            psCode: null,
            psBranch: null,
            clientName: null,
            socialReason: null,
            rut: null,
            clientAddress: null,
            clientPhone: null,
            clientEmail: null,
            clientDeliveries: [],
            driverCollect: true,
            debt: null,
            active: true,
            errorMessage: null,
            anchorEl: null,
        };

        this.onChangeCodePs = this.onChangeCodePs.bind(this);
        this.onChangeBranchPs = this.onChangeBranchPs.bind(this);
        this.clickNew = this.clickNew.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onChangeClientName = this.onChangeClientName.bind(this);
        this.onChangeSocialReason = this.onChangeSocialReason.bind(this);
        this.onChangeRut = this.onChangeRut.bind(this);
        this.onChangeClientAddress = this.onChangeClientAddress.bind(this);
        this.onChangeClientPhone = this.onChangeClientPhone.bind(this);
        this.onChangeClientEmail = this.onChangeClientEmail.bind(this);
        this.onChangeDelivery = this.onChangeDelivery.bind(this);
        this.handleDriverCollectCheckboxChange = this.handleDriverCollectCheckboxChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClientActionsClick = this.handleClientActionsClick.bind(this);
        this.handleCloseClientActionsClick = this.handleCloseClientActionsClick.bind(this);
        this.handleActiveCheckboxChange = this.handleActiveCheckboxChange.bind(this);
        this.onClickView = this.onClickView.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.handleCloseSuccessDialog = this.handleCloseSuccessDialog.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
        this.handleCloseConfirmDeleteDialog = this.handleCloseConfirmDeleteDialog.bind(this);
        this.handleDeleteConfirmDeleteDialog = this.handleDeleteConfirmDeleteDialog.bind(this);
    }

    componentDidMount() {
        this.getAll();
        this.getAllDeliveries();
        if (AuthService.hasRole("ROLE_ADMIN")) {
            this.setState({
                isAdmin: true
            })
        }
    }

    getAll() {
        ClientService.getClients()
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            data: response.data,
                            loading: false
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.')
                    }
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            )
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

    getAllDeliveries() {
        DeliveryService.getDeliveries()
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            deliveries: response.data,
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.')
                    }
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            )
    }

    onChangeCodePs(event) {
        if (event != null && event.target != null) {
            this.setState({
                psCode: event.target.value,
            });
        }
    }

    onChangeBranchPs(event) {
        if (event != null && event.target != null) {
            this.setState({
                psBranch: event.target.value,
            });
        }
    }

    onChangeClientName(event) {
        if (event != null && event.target != null) {
            this.setState({
                clientName: event.target.value,
            });
        }
    }

    onChangeSocialReason(event) {
        if (event != null && event.target != null) {
            this.setState({
                socialReason: event.target.value,
            });
        }
    }

    onChangeRut(event) {
        if (event != null && event.target != null) {
            this.setState({
                rut: event.target.value,
            });
        }
    }

    onChangeClientAddress(event) {
        if (event != null && event.target != null) {
            this.setState({
                clientAddress: event.target.value,
            });
        }
    }

    onChangeClientPhone(event) {
        if (event != null && event.target != null) {
            this.setState({
                clientPhone: event.target.value,
            });
        }
    }

    onChangeClientEmail(event) {
        if (event != null && event.target != null) {
            this.setState({
                clientEmail: event.target.value,
            });
        }
    }

    onChangeDelivery(event) {
        if (event != null && event.target != null) {
            this.setState({
                clientDeliveries: event.target.value,
            });
        }
    }

    handleDriverCollectCheckboxChange() {
        this.setState({
            driverCollect: !this.state.driverCollect
        })
    }

    handleClose() {
        this.setState({
            showForm: false,
            resultErrorMessage: null,
            isEdit: false,
            psCode: null,
            psBranch: null,
            clientName: null,
            socialReason: null,
            rut: null,
            clientAddress: null,
            clientPhone: null,
            clientEmail: null,
            clientDeliveries: [],
            driverCollect: true,
            debt: null,
            active: true,
            errorMessage: null,
            selectedClient: {
                id: null
            },
        });
    }

    clickNew() {
        this.setState({
            showForm: true,
            isViewMode: false,
            isEdit: false
        })
    }

    handleSave() {
        if (!this.state.isEdit) {
            this.createNewClient();
        } else {
            this.updateClient();
        }
    }

    createNewClient() {
        ClientService.createClient(this.state.psCode, this.state.psBranch, this.getDeliveriesToSend(),
            this.state.driverCollect, this.state.clientName, this.state.socialReason, this.state.rut,
            this.state.clientAddress, this.state.clientPhone, this.state.clientEmail)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Creado con éxito!',
                            psCode: null,
                            psBranch: null,
                            clientName: null,
                            socialReason: null,
                            rut: null,
                            clientAddress: null,
                            clientPhone: null,
                            clientEmail: null,
                            clientDeliveries: [],
                            driverCollect: true,
                            debt: null,
                            active: true,
                            errorMessage: null,
                            selectedClient: {
                                id: null
                            },
                        })
                    } else {
                        this.manageRequestErrorsInsideForm('No hay respuesta del servidor.')
                    }
                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                }
            );
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

    updateClient() {
        ClientService.updateClient(this.state.selectedClient.id, this.state.psCode, this.state.psBranch, this.getDeliveriesToSend(),
            this.state.driverCollect, this.state.clientName, this.state.socialReason, this.state.rut,
            this.state.clientAddress, this.state.clientPhone, this.state.clientEmail, this.state.active)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Actualizado con éxito!',
                            psCode: null,
                            psBranch: null,
                            clientName: null,
                            socialReason: null,
                            rut: null,
                            clientAddress: null,
                            clientPhone: null,
                            clientEmail: null,
                            clientDeliveries: [],
                            driverCollect: true,
                            debt: null,
                            active: true,
                            errorMessage: null,
                            selectedClient: {
                                id: null
                            },
                        })
                    } else {
                        this.manageRequestErrorsInsideForm('No hay respuesta del servidor.')
                    }

                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrorsInsideForm(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    getDeliveriesToSend() {
        const deliveriesToSend = [];
        this.state.clientDeliveries.map((c) => {
            return deliveriesToSend.push({
                id: c
            })
        });
        return deliveriesToSend;
    }

    handleClientActionsClick(event, client) {
        this.setState({
            selectedClient: client,
            anchorEl: event.currentTarget
        });
    };

    handleCloseClientActionsClick(event) {
        this.setState({
            anchorEl: null
        });
    };

    onClickView() {
        ClientService.getClientById(this.state.selectedClient.id)
            .then(
                (response) => {
                    if (response != null) {
                        const deliveriesIds = response.data.deliveries.map(d => {
                            return d.id;
                        })
                        this.setState({
                            showForm: true,
                            showSuccessDialog: false,
                            showFailedDialog: false,
                            resultErrorMessage: null,
                            psCode: response.data.psCode,
                            psBranch: response.data.psBranch,
                            clientName: response.data.name,
                            socialReason: response.data.socialReason,
                            rut: response.data.rut,
                            clientAddress: response.data.address,
                            clientPhone: response.data.phone,
                            clientEmail: response.data.email,
                            clientDeliveries: deliveriesIds,
                            driverCollect: response.data.driverCollect,
                            debt: response.data.debt,
                            active: response.data.active,
                            errorMessage: null,
                            isEdit: false,
                            isViewMode: true,
                            anchorEl: null,
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.')
                    }
                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    onClickEdit() {
        const deliveriesIds = this.state.selectedClient.deliveries.map(d => {
            return d.id;
        })
        this.setState({
            showForm: true,
            showSuccessDialog: false,
            showFailedDialog: false,
            resultErrorMessage: null,
            psCode: this.state.selectedClient.psCode,
            psBranch: this.state.selectedClient.psBranch,
            clientName: this.state.selectedClient.name,
            socialReason: this.state.selectedClient.socialReason,
            rut: this.state.selectedClient.rut,
            clientAddress: this.state.selectedClient.address,
            clientPhone: this.state.selectedClient.phone,
            clientEmail: this.state.selectedClient.email,
            clientDeliveries: deliveriesIds,
            driverCollect: this.state.selectedClient.driverCollect,
            debt: this.state.selectedClient.debt,
            active: this.state.selectedClient.active,
            errorMessage: null,
            isEdit: true,
            isViewMode: false,
            anchorEl: null,
        });
    }

    handleActiveCheckboxChange() {
        this.setState({
            active: !this.state.active
        })
    }

    confirmDelete() {
        this.setState({
            showConfirmDeleteDialog: true,
            anchorEl: null,
            resultDialogMessage: 'Eliminar el cliente ' + this.state.selectedClient.name + ' ?'
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
        this.deleteClient()
    }

    deleteClient() {
        ClientService.deleteClientById(this.state.selectedClient.id)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Eliminado con éxito!',
                            psCode: null,
                            psBranch: null,
                            clientName: null,
                            socialReason: null,
                            rut: null,
                            clientAddress: null,
                            clientPhone: null,
                            clientEmail: null,
                            clientDeliveries: [],
                            driverCollect: true,
                            debt: null,
                            active: true,
                            errorMessage: null,
                            selectedClient: {
                                id: null
                            },
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.')
                    }
                    this.getAll();
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            );
    }

    render() {
        const {classes} = this.props;
        const options = {
            filter: true,
            filterType: "textField",
            selectableRows: 'none',
            textLabels: {
                body: {
                    noMatch: 'No hay Clientes'
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
            {label: "ID", name: "id"},
            {label: "Codigo PS", name: "psCode"},
            {label: "Nombre", name: "name"},
            {label: "Direccion", name: "address"},
            {
                name: "Repartos",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['deliveries'].map(d => {
                                    return d.name
                                }).join(', ')}
                            </div>
                        );
                    }
                }
            },
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
                                            onClick={(e) => this.handleClientActionsClick(e, tableMeta.tableData[tableMeta.rowIndex])}
                                        >
                                            <MoreVertIcon/>
                                        </IconButton>
                                        <Menu
                                            id="simple-menu-document"
                                            anchorEl={this.state.anchorEl}
                                            keepMounted
                                            open={Boolean(this.state.anchorEl)}
                                            onClose={this.handleCloseClientActionsClick}
                                        >

                                            <MenuItem value={'viewClient'}
                                                      onClick={this.onClickView}><SearchIcon/>Ver</MenuItem>
                                            <MenuItem value={'editClient'}
                                                      onClick={this.onClickEdit}><EditIcon/>Editar</MenuItem>
                                            <MenuItem value={'deleteClient'}
                                                      onClick={this.confirmDelete}><DeleteIcon/>Eliminar</MenuItem>
                                        </Menu>
                                    </div>
                                    : ''}
                            </div>
                        );
                    },
                    print: false
                }
            }
        ]


        return (
            <div>
                {this.state.loading ? <div className={classes.loading}><CircularProgress size={250}/></div> :
                    <div>
                        {this.state.isAdmin ?
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<AddIcon/>}
                                style={{float: 'right'}}
                                onClick={this.clickNew}
                            >
                                Nuevo
                            </Button> : ''}
                        <MUIDataTable
                            title={"Clientes"}
                            data={this.state.data}
                            columns={columns}
                            options={options}

                        />
                        {this.state.showForm ? <div>
                            <ClientForm open={this.state.showForm} codePs={this.state.psCode}
                                        branchPs={this.state.psBranch}
                                        onChangeCodePs={this.onChangeCodePs} onChangeBranchPs={this.onChangeBranchPs}
                                        handleClose={this.handleClose} handleSave={this.handleSave}
                                        clientName={this.state.clientName} onChangeClientName={this.onChangeClientName}
                                        socialReason={this.state.socialReason}
                                        onChangeSocialReason={this.onChangeSocialReason}
                                        rut={this.state.rut} onChangeRut={this.onChangeRut}
                                        clientAddress={this.state.clientAddress}
                                        onChangeClientAddress={this.onChangeClientAddress}
                                        clientPhone={this.state.clientPhone}
                                        onChangeClientPhone={this.onChangeClientPhone}
                                        clientEmail={this.state.clientEmail}
                                        onChangeClientEmail={this.onChangeClientEmail}
                                        deliveries={this.state.deliveries} onChangeDelivery={this.onChangeDelivery}
                                        driverCollect={this.state.driverCollect}
                                        handleDriverCollectCheckboxChange={this.handleDriverCollectCheckboxChange}
                                        clientDeliveries={this.state.clientDeliveries}
                                        message={this.state.errorMessage} isViewMode={this.state.isViewMode}
                                        debt={this.state.debt}
                                        active={this.state.active}
                                        handleActiveCheckboxChange={this.handleActiveCheckboxChange}>

                            </ClientForm>
                        </div> : ''}
                        {this.state.showSuccessDialog ?
                            <div>
                                <SuccessDialog showSuccessDialog={this.state.showSuccessDialog}
                                               handleCloseSuccessDialog={this.handleCloseSuccessDialog}
                                               resultDialogMessage={this.state.resultDialogMessage} title='Clientes'/>
                            </div> : ''
                        }
                        {this.state.showFailedDialog ?
                            <div>
                                <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                              handleCloseFailedDialog={this.handleCloseFailedDialog}
                                              resultDialogMessage={this.state.resultDialogMessage} title='Clientes'/>
                            </div> : ''
                        }
                        {this.state.showConfirmDeleteDialog ?
                            <div>
                                <ConfirmDeleteDialog showConfirmDeleteDialog={this.state.showConfirmDeleteDialog}
                                                     handleDeleteConfirmDeleteDialog={this.handleDeleteConfirmDeleteDialog}
                                                     handleCloseConfirmDeleteDialog={this.handleCloseConfirmDeleteDialog}
                                                     resultDialogMessage={this.state.resultDialogMessage}
                                                     title='Eliminar'/>
                            </div> : ''
                        }
                    </div>}
            </div>
        );
    }

}

export default withStyles(useStyles)(Clients);
