import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ServiceHelper from "../../services/service.helper";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search"
import ReportsService from "../../services/reports-service"
import CircularProgress from "@material-ui/core/CircularProgress";
import FailedDialog from "../faileddialog";
import ClientSelect from "../entities/client.select";
import DeliveryService from "../../services/delivery.service"
import MUIDataTable from "mui-datatables";
import TextField from "@material-ui/core/TextField";

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
    },
    title: {
        fontWeight: 'bold',
        margin: theme.spacing(2)
    },
});

class DiscountsByClientComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showFailedDialog: false,
            loading: true,
            resultDialogMessage: null,
            searchFromDate: new Date(),
            searchToDate: new Date(),
            columns: [],
            deliveries: [],
            selectedClient: {
                name: '',
                address: ''
            },
            data: [],
            total: 0
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
        this.onChangeSelectedClient = this.onChangeSelectedClient.bind(this);
    }

    componentDidMount() {
        this.getAllDeliveries()
    }

    getAllDeliveries() {
        DeliveryService.getDeliveries()
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            deliveries: response.data,
                            loading: false
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

    handleSearch() {
        this.setState({
            loading: true
        });
        ReportsService.discountsByClient(this.state.searchFromDate, this.state.searchToDate, this.state.selectedClient)
        .then(
            (response) => {

                if (response != null) {
                    console.log(response.data)
                    this.setState({
                        data: response.data.tableReport.slice(1),
                        columns: response.data.tableReport[0],
                        total: response.data.total,
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

    handleCloseFailedDialog() {
        this.setState({
            showFailedDialog: false
        });
    }

    onChangeSelectedClient(selectedClient) {
        this.setState({
            selectedClient: selectedClient[0]
        });
    
    }

    render() {
        const { classes } = this.props;
        const options = {
            selectableRows: 'none',
            filter: false,
            search: false,
            download: false,
            export: false,
            print: false,
            viewColumns: false,
            pagination: false,
            textLabels: {
                body: {
                    noMatch: 'No hay Datos'
                },
            }
        }
        return (
            <div>
                {this.state.loading ? <div className={classes.loading}><CircularProgress size={250} /></div> :
                    <div>
                        <Typography variant='h6' className={classes.title}>
                            Resumen de Decuentos
                        </Typography>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>

                            <KeyboardDatePicker
                                autoOk
                                id="search_from_date_picker"
                                variant="inline"
                                inputVariant="outlined"
                                label="Desde Fecha"
                                format="dd/MM/yyyy"
                                value={this.state.searchFromDate}
                                InputAdornmentProps={{ position: "start" }}
                                onChange={date => this.onChangeSearchFromDate(date)}
                                className={classes.textField}
                                style={{ width: '25%' }}
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
                                InputAdornmentProps={{ position: "start" }}
                                onChange={date => this.onChangeSearchToDate(date)}
                                className={classes.textField}
                                style={{ width: '25%' }}
                            />
                        </MuiPickersUtilsProvider>
                        <div>
                            <ClientSelect clientsNames={this.state.selectedClient != null ? this.state.selectedClient.name + ' ' + this.state.selectedClient.address : ''} deliveries={this.state.deliveries} multiselect
                                                                         clientSelected={this.onChangeSelectedClient} isViewMode={this.props.isViewMode}>
                            </ClientSelect>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<SearchIcon />}
                                onClick={this.handleSearch}
                            >
                                Ver
                            </Button>
                        </div>
                        <div className={classes.drawerHeader} />
                        <div>
                        <TextField
                                margin="dense"
                                id="total"
                                label="Total"
                                type="number"
                                style={{ width: '20%', }}
                                className={classes.textField}
                                contentEditable={false}
                                value={this.state.total}
                            />
                            <MUIDataTable
                                title={this.props.title}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={options}
                            />
                        </div>
                        {this.state.showFailedDialog ?
                            <div>
                                <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                    handleCloseFailedDialog={this.handleCloseFailedDialog}
                                    resultDialogMessage={this.state.resultDialogMessage} title='Resumen de descuentos' />
                            </div> : ''
                        }
                    </div>
                }

            </div>
        )
    }
}

export default withStyles(useStyles)(DiscountsByClientComponent);


