import React from "react";
import {withStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import MUIDataTable from "mui-datatables";
import CommissionService from "../../services/commission.service";
import ServiceHelper from "../../services/service.helper";
import CommissionForm from "./forms/commission.form";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import AuthService from "../../services/auth.service";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SuccessDialog from "../successdialog";
import FailedDialog from "../faileddialog";
import ConfirmDeleteDialog from "../confirm.delete.dialog";

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

class Commissions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showForm: false,
            showSuccessDialog: false,
            showFailedDialog: false,
            resultDialogMessage: null,
            resultErrorMessage: null,
            isViewMode: false,
            isEdit: false,
            isAdmin: false,
            showConfirmDeleteDialog: false,
            loading: true,
            commissionName: null,
            commissionPercentage: null,
            commissionMilkPercentage: null,
            selectedCommission: {
                id: null
            },
            anchorEl: null,
        }

        this.handleClose = this.handleClose.bind(this);
        this.clickNew = this.clickNew.bind(this);
        this.onChangeCommissionName = this.onChangeCommissionName.bind(this);
        this.onChangeCommissionPercentage = this.onChangeCommissionPercentage.bind(this);
        this.onChangeCommissionMilkPercentage = this.onChangeCommissionMilkPercentage.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClientActionsClick = this.handleClientActionsClick.bind(this);
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
        if (AuthService.hasRole("ROLE_ADMIN")) {
            this.setState({
                isAdmin: true
            })
        }
    }

    getAll() {
        CommissionService.getCommissions()
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

    handleClose() {
        this.setState({
            showForm: false,
            resultErrorMessage: null,
            isEdit: false,
            errorMessage: null,
            commissionName: null,
            commissionPercentage: null,
            commissionMilkPercentage: null,
            selectedCommission: {
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

    onChangeCommissionName(event) {
        if (event != null && event.target != null) {
            this.setState({
                commissionName: event.target.value,
            });
        }
    }

    onChangeCommissionPercentage(event) {
        if (event != null && event.target != null) {
            this.setState({
                commissionPercentage: event.target.value,
            });
        }
    }

    onChangeCommissionMilkPercentage(event) {
        if (event != null && event.target != null) {
            this.setState({
                commissionMilkPercentage: event.target.value,
            });
        }
    }

    handleSave() {
        if (!this.state.isEdit) {
            this.createNewCommission();
        } else {
            this.updateCommission();
        }
    }

    createNewCommission() {
        CommissionService.createCommission(this.state.commissionName, this.state.commissionPercentage,
            this.state.commissionMilkPercentage)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Creada con éxito!',
                            resultErrorMessage: null,
                            isEdit: false,
                            errorMessage: null,
                            commissionName: null,
                            commissionPercentage: null,
                            commissionMilkPercentage: null,
                            selectedCommission: {
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

    updateCommission() {
        CommissionService.updateClient(this.state.selectedCommission.id, this.state.commissionName, this.state.commissionPercentage,
            this.state.commissionMilkPercentage)
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
                            commissionName: null,
                            commissionPercentage: null,
                            commissionMilkPercentage: null,
                            selectedCommission: {
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

    handleClientActionsClick(event, commission) {
        this.setState({
            selectedCommission: commission,
            anchorEl: event.currentTarget
        });
    };

    handleCloseClientActionsClick(event) {
        this.setState({
            anchorEl: null
        });
    };

    onClickView() {
        CommissionService.getCommissionById(this.state.selectedCommission.id)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: true,
                            showSuccessDialog: false,
                            showFailedDialog: false,
                            resultErrorMessage: null,
                            commissionName: response.data.name,
                            commissionPercentage: response.data.percentage,
                            commissionMilkPercentage: response.data.milkPercentage,
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
            commissionName: this.state.selectedCommission.name,
            commissionPercentage: this.state.selectedCommission.percentage,
            commissionMilkPercentage: this.state.selectedCommission.milkPercentage,
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
            resultDialogMessage: 'Eliminar la commission ' + this.state.selectedCommission.name + ' ?'
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
        this.deleteCommission()
    }

    deleteCommission() {
        CommissionService.deleteCommissionById(this.state.selectedCommission.id)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showForm: false,
                            showSuccessDialog: true,
                            resultDialogMessage: 'Eliminada con éxito!',
                            commissionName: null,
                            commissionPercentage: null,
                            commissionMilkPercentage: null,
                            selectedCommission: {
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
                    noMatch: 'No hay Comisiones'
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
            {label: "Nombre", name: "name"},
            {label: "Porcentaje", name: "percentage"},
            {label: "Porcentaje Leche", name: "milkPercentage"},
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
                            title={"Comisiones"}
                            data={this.state.data}
                            columns={columns}
                            options={options}

                        />
                        {this.state.showForm ? <div>
                            <CommissionForm open={this.state.showForm} handleClose={this.handleClose}
                                            commissionName={this.state.commissionName}
                                            onChangeCommissionName={this.onChangeCommissionName}
                                            commissionPercentage={this.state.commissionPercentage}
                                            onChangeCommissionPercentage={this.onChangeCommissionPercentage}
                                            commissionMilkPercentage={this.state.commissionMilkPercentage}
                                            onChangeCommissionMilkPercentage={this.onChangeCommissionMilkPercentage}
                                            isViewMode={this.state.isViewMode} handleSave={this.handleSave}
                                            message={this.state.errorMessage}
                            ></CommissionForm>
                        </div> : ''}
                        {this.state.showSuccessDialog ?
                            <div>
                                <SuccessDialog showSuccessDialog={this.state.showSuccessDialog}
                                               handleCloseSuccessDialog={this.handleCloseSuccessDialog}
                                               resultDialogMessage={this.state.resultDialogMessage} title='Comisiones'/>
                            </div> : ''
                        }
                        {this.state.showFailedDialog ?
                            <div>
                                <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                              handleCloseFailedDialog={this.handleCloseFailedDialog}
                                              resultDialogMessage={this.state.resultDialogMessage} title='Comisiones'/>
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

export default withStyles(useStyles)(Commissions);