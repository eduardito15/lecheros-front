import React from "react";
import MUIDataTable from "mui-datatables";
import TaxForm from "./forms/taxform";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import {withStyles} from '@material-ui/core/styles';
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import SuccessDialog from "../successdialog";
import FailedDialog from "../faileddialog";
import authHeader from "../../services/auth-header";
import ServiceHelper from "../../services/service.helper"
import AuthService from "../../services/auth.service";
import ConfirmDeleteDialog from "../confirm.delete.dialog";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

class Taxes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showForm: false,
            showSuccessDialog: false,
            showFailedDialog: false,
            resultDialogMessage: null,
            resultErrorMessage: null,
            selectedTax: {
                id: null,
                name: null,
                percentage: null
            },
            isEdit: false,
            isAdmin: false,
            showConfirmDeleteDialog: false
        };
        this.clickNew = this.clickNew.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePercentage = this.onChangePercentage.bind(this);
        this.handleCloseSuccessDialog = this.handleCloseSuccessDialog.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
        this.handleCloseConfirmDeleteDialog = this.handleCloseConfirmDeleteDialog.bind(this);
        this.handleDeleteConfirmDeleteDialog = this.handleDeleteConfirmDeleteDialog.bind(this);

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
        fetch("http://ec2-18-219-109-248.us-east-2.compute.amazonaws.com:5000/lecheros/api/taxes", {
            method: "GET",
            headers: authHeader(),
        })
            .then(res => res.json())
            .then(
                (response) => {
                    if (response.status === 401) {
                        this.props.redirectToLogin();
                    } else {
                        if (response != null) {
                            this.setState({
                                data: response,
                                showFailedDialog: this.state.showFailedDialog,
                                showSuccessDialog: this.state.showSuccessDialog
                            });
                        } else {
                            alert(response);
                        }
                    }
                },
                (error) => {
                    alert(error);
                }
            )
    }

    clickNew() {
        this.setState({
            showForm: true
        });
    }

    handleClose() {
        this.setState({
            showForm: false,
            showSuccessDialog: this.state.showSuccessDialog,
            showFailedDialog: this.state.showFailedDialog,
            resultErrorMessage: null
        });
    }

    handleCloseSuccessDialog() {
        this.setState({
            showSuccessDialog: false
        });
    }

    handleCloseFailedDialog() {
        this.setState({
            showFailedDialog: false
        });
    }

    onChangeName(event) {
        if (event != null && event.target != null) {
            this.setState({
                data: this.state.data,
                showForm: this.state.showForm,
                selectedTax: {
                    id: this.state.selectedTax.id,
                    name: event.target.value,
                    percentage: this.state.selectedTax.percentage
                }
            })
        }
    }

    onChangePercentage(event) {
        if (event != null && event.target != null) {
            this.setState({
                data: this.state.data,
                showForm: this.state.showForm,
                selectedTax: {
                    id: this.state.selectedTax.id,
                    name: this.state.selectedTax.name,
                    percentage: event.target.value
                }
            })
        }
    }

    onClickEdit(tax) {
        this.setState({
            data: this.state.data,
            selectedTax: {
                id: tax.id,
                name: tax.name,
                percentage: tax.percentage
            },
            isEdit: true,
            showForm: true
        })
    }

    handleSave() {
        if (!this.state.isEdit) {
            this.createNewTax();
        } else {
            this.updateTax();
        }
    }

    createNewTax() {
        fetch(ServiceHelper.getTaxPath(), {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify({
                name: this.state.selectedTax.name,
                percentage: this.state.selectedTax.percentage,
            })
        })
            .then(res => res.json())
            .then(
                (response) => {
                    this.handleApiResponse(response, 'Creado con éxito!');
                },
                (error) => {
                    alert(error);
                }
            )
    }

    updateTax() {
        fetch(ServiceHelper.getTaxPath() + '/' + this.state.selectedTax.id, {
            method: "PUT",
            headers: authHeader(),
            body: JSON.stringify({
                id: this.state.selectedTax.id,
                name: this.state.selectedTax.name,
                percentage: this.state.selectedTax.percentage,
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (response) => {
                    this.handleApiResponse(response, 'Actualizado con éxito!');
                },
                (error) => {
                    alert(error.message);
                }
            )
    }

    handleApiResponse(response, message) {
        if (ServiceHelper.isErrorResponse(response)) {
            this.setState({
                resultErrorMessage: response.message
            });
        } else {
            this.setState({
                data: this.state.data,
                selectedTax: {
                    id: null,
                    name: null,
                    percentage: null
                },
                isEdit: false,
                showForm: false,
                showFailedDialog: false,
                showSuccessDialog: true,
                resultDialogMessage: message,
                resultErrorMessage: null
            });
            this.getAll();
        }
    }

    confirmDelete(tax) {
        this.setState({
            selectedTax: {
                id: tax.id
            },
            showConfirmDeleteDialog: true,
            resultDialogMessage: 'Eliminar el iva con el nombre:  ' + tax.name + ' ?'
        })
    }

    deleteTax() {
        fetch(ServiceHelper.getHost() + "/lecheros/api/tax/" + this.state.selectedTax.id, {
            method: "DELETE",
            headers: authHeader()
        })
            .then(res => res)
            .then(
                (response) => {
                    this.handleDeleteResponse(response);
                },
                (error) => {
                    alert(error);
                }
            )
    }

    handleDeleteResponse(response) {
        if (ServiceHelper.isErrorResponse(response)) {
            let msg = response.message;
            if (response.status === 401 || response.status === 403) {
                msg = 'Error: Unauthorized';
            }
            this.setState({
                data: this.state.data,
                selectedTax: {
                    id: null,
                    name: null,
                    percentage: null
                },
                isEdit: false,
                showForm: false,
                showFailedDialog: true,
                showSuccessDialog: false,
                resultDialogMessage: msg
            })
        } else {
            this.setState({
                data: this.state.data,
                selectedTax: {
                    id: null,
                    name: null,
                    percentage: null
                },
                isEdit: false,
                showForm: false,
                showFailedDialog: false,
                showSuccessDialog: true,
                resultDialogMessage: 'Eliminado con Exito!'
            });
            this.getAll();
        }
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
        this.deleteTax();
    }

    render() {
        const {classes} = this.props;
        const columns = [
            {label: "ID", name: "id"},
            {label: "Nombre", name: "name"},
            {label: "Porcentaje", name: "percentage"},
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
                                        <Button
                                            onClick={() => this.onClickEdit(tableMeta.tableData[tableMeta.rowIndex])}
                                            startIcon={<EditIcon/>}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Editar
                                        </Button>
                                        &nbsp;
                                        <Button
                                            onClick={() => this.confirmDelete(tableMeta.tableData[tableMeta.rowIndex])}
                                            startIcon={<DeleteIcon/>}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                    : ''}
                            </div>
                        );
                    }
                }
            }
        ]
        const options = {
            filter: true,
            filterType: "textField",
            selectableRows: 'none'
        }

        return (
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
                    title={"Ivas"}
                    data={this.state.data}
                    columns={columns}
                    options={options}

                />
                {this.state.showForm ?
                    <div>
                        <TaxForm open={this.state.showForm} handleClose={this.handleClose} handleSave={this.handleSave}
                                 name={this.state.selectedTax.name} percentage={this.state.selectedTax.percentage}
                                 onChangeName={this.onChangeName} onChangePercentage={this.onChangePercentage}
                                 message={this.state.resultErrorMessage}/>
                    </div> : ''
                }

                {this.state.showSuccessDialog ?
                    <div>
                        <SuccessDialog showSuccessDialog={this.state.showSuccessDialog}
                                       handleCloseSuccessDialog={this.handleCloseSuccessDialog}
                                       resultDialogMessage={this.state.resultDialogMessage} title='Iva'/>
                    </div> : ''
                }
                {this.state.showFailedDialog ?
                    <div>
                        <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                      handleCloseFailedDialog={this.handleCloseFailedDialog}
                                      resultDialogMessage={this.state.resultDialogMessage}/>
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
            </div>
        );
    }
}

export default withStyles(useStyles)(Taxes);
