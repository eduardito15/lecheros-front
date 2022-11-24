import React from "react";
import {withStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import MUIDataTable from "mui-datatables";
import DriverService from "../../services/driver.service";
import CommissionService from "../../services/commission.service";
import ServiceHelper from "../../services/service.helper";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AuthService from "../../services/auth.service";
import SuccessDialog from "../successdialog";
import FailedDialog from "../faileddialog";
import ConfirmDeleteDialog from "../confirm.delete.dialog";
import DriverForm from "./forms/driver.form";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

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

class Drivers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showForm: false,
            showSuccessDialog: false,
            showFailedDialog: false,
            resultDialogMessage: null,
            resultErrorMessage: null,
            isEdit: false,
            isAdmin: false,
            showConfirmDeleteDialog: false,
            loading: true,
            commissions: [],
            driverName: null,
            driverCode: null,
            selectedCommission: {
                id: null
            },
            selectedDriver: {
                id: null
            },
            anchorEl: null,
        }

        this.handleClose = this.handleClose.bind(this);
        this.clickNew = this.clickNew.bind(this);
        this.onChangeDriverName = this.onChangeDriverName.bind(this);
        this.onChangeDriverCode = this.onChangeDriverCode.bind(this);
        this.onChangeCommission = this.onChangeCommission.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDriverActionsClick = this.handleDriverActionsClick.bind(this);
        this.handleCloseClientActionsClick = this.handleCloseClientActionsClick.bind(this);
        this.onClickView = this.onClickView.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.handleCloseConfirmDeleteDialog = this.handleCloseConfirmDeleteDialog.bind(this);
        this.handleDeleteConfirmDeleteDialog = this.handleDeleteConfirmDeleteDialog.bind(this);
        this.handleCloseSuccessDialog = this.handleCloseSuccessDialog.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);

    }

    componentDidMount() {
        this.getAll();
        this.getAllCommissions();
        if (AuthService.hasRole("ROLE_ADMIN")) {
            this.setState({
                isAdmin: true
            })
        }
    }

    getAll() {
        DriverService.getDrivers()
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

    getAllCommissions() {
        CommissionService.getCommissions()
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            commissions: response.data,
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

    handleClose() {
        this.setState({
            showForm: false,
            resultErrorMessage: null,
            isEdit: false,
            errorMessage: null,
            driverName: null,
            driverCode: null,
            selectedCommission: {
                id: null
            },
            selectedDriver: {
                id: null
            },
            isViewMode: false
        });
    }

    clickNew() {
        this.setState({
            showForm: true,
            isViewMode: false,
            isEdit: false
        })
    }

    onChangeDriverName(event) {
        if (event != null && event.target != null) {
            this.setState({
                driverName: event.target.value,
            });
        }
    }

    onChangeDriverCode(event) {
        if (event != null && event.target != null) {
            this.setState({
                driverCode: event.target.value,
            });
        }
    }

    onChangeCommission(event) {
        if (!this.state.isViewMode) {

            const selectedCommission = this.state.commissions.find(d => {
                return d.id === event.target.value;
            });
            this.setState({
                selectedCommission: selectedCommission
            });
        }
    }

    handleSave() {
        if (!this.state.isEdit) {
            this.createNewDriver();
        } else {
            this.updateDriver();
        }
    }

    createNewDriver() {
        DriverService.createDriver(this.state.driverCode, this.state.driverName,
            this.state.selectedCommission)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Creado con éxito!',
                            resultErrorMessage: null,
                            isEdit: false,
                            errorMessage: null,
                            driverName: null,
                            driverCode: null,
                            selectedCommission: {
                                id: null
                            },
                            selectedDriver: {
                                id: null
                            },
                            isViewMode: false
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

    updateDriver() {
        DriverService.updateDriver(this.state.selectedDriver.id, this.state.driverCode, this.state.driverName,
            this.state.selectedCommission)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Actualizada con éxito!',
                            resultErrorMessage: null,
                            isEdit: false,
                            errorMessage: null,
                            driverName: null,
                            driverCode: null,
                            selectedCommission: {
                                id: null
                            },
                            selectedDriver: {
                                id: null
                            },
                            isViewMode: false
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

    handleDriverActionsClick(event, driver) {
        this.setState({
            selectedDriver: driver,
            anchorEl: event.currentTarget
        });
    };

    handleCloseClientActionsClick(event) {
        this.setState({
            anchorEl: null
        });
    };

    onClickView() {
        DriverService.getDriverById(this.state.selectedDriver.id)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: true,
                            showSuccessDialog: false,
                            showFailedDialog: false,
                            resultErrorMessage: null,
                            driverCode: response.data.code,
                            driverName: response.data.name,
                            selectedCommission: response.data.commission,
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
        this.setState({
            showForm: true,
            showSuccessDialog: false,
            showFailedDialog: false,
            resultErrorMessage: null,
            driverCode: this.state.selectedDriver.code,
            driverName: this.state.selectedDriver.name,
            selectedCommission: this.state.selectedDriver.commission,
            errorMessage: null,
            isEdit: true,
            isViewMode: false,
            anchorEl: null,
        });
    }

    confirmDelete() {
        this.setState({
            showConfirmDeleteDialog: true,
            anchorEl: null,
            resultDialogMessage: 'Eliminar el chofer ' + this.state.selectedDriver.name + ' ?'
        })
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
        this.deleteDriver()
    }

    deleteDriver() {
        DriverService.deleteDriverById(this.state.selectedDriver.id)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Eliminado con éxito!',
                            driverName: null,
                            driverCode: null,
                            selectedCommission: {
                                id: null
                            },
                            selectedDriver: {
                                id: null
                            },
                            errorMessage: null
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

    render() {
        const {classes} = this.props;
        const options = {
            filter: true,
            filterType: "textField",
            selectableRows: 'none',
            textLabels: {
                body: {
                    noMatch: 'No hay Choferes'
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
            {label: "Codigo", name: "code"},
            {label: "Nombre", name: "name"},
            {
                name: "Comission",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['commission']['name']}
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
                                            onClick={(e) => this.handleDriverActionsClick(e, tableMeta.tableData[tableMeta.rowIndex])}
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
                            title={"Choferes"}
                            data={this.state.data}
                            columns={columns}
                            options={options}

                        />
                        {this.state.showForm ? <div>
                            <DriverForm open={this.state.showForm} handleClose={this.handleClose}
                                            driverCode={this.state.driverCode} onChangeDriverCode={this.onChangeDriverCode}
                                            driverName={this.state.driverName} onChangeDriverName={this.onChangeDriverName}
                                            commission={this.state.selectedCommission} onChangeCommission={this.onChangeCommission}
                                            commissions={this.state.commissions}
                                            isViewMode={this.state.isViewMode} handleSave={this.handleSave}
                                            message={this.state.errorMessage}
                            ></DriverForm>
                        </div> : ''}
                        {this.state.showSuccessDialog ?
                            <div>
                                <SuccessDialog showSuccessDialog={this.state.showSuccessDialog}
                                               handleCloseSuccessDialog={this.handleCloseSuccessDialog}
                                               resultDialogMessage={this.state.resultDialogMessage} title='Choferes'/>
                            </div> : ''
                        }
                        {this.state.showFailedDialog ?
                            <div>
                                <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                              handleCloseFailedDialog={this.handleCloseFailedDialog}
                                              resultDialogMessage={this.state.resultDialogMessage} title='Choferes'/>
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
        )
    }
}

export default withStyles(useStyles)(Drivers);