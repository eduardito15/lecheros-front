import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import DriverService from "../../services/driver.service";
import ServiceHelper from "../../services/service.helper";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search"
import ReportsService from "../../services/reports-service"
import CircularProgress from "@material-ui/core/CircularProgress";
import FailedDialog from "../faileddialog";
import MUIDataTable from "mui-datatables";

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

class CommissionReportComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showFailedDialog: false,
            loading: true,
            resultDialogMessage: null,
            deliveries: [],
            data: [],
            searchFromDate: new Date(),
            searchToDate: new Date(),
            selectedDriver: {
                id: null
            },
            columns: [],
            total: 0
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.onChangeDriver = this.onChangeDriver.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
    }

    componentDidMount() {
        this.getAllDrivers()
    }

    getAllDrivers() {
        DriverService.getDrivers()
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            drivers: response.data,
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

    renderDriverOptions() {
        if (this.state.drivers != null) {
            return this.state.drivers.map((delivery) => {
                return (
                    <MenuItem
                        label="Chofer"
                        value={delivery.id}
                        key={delivery.id} name={delivery.name}
                    >{delivery.code} - {delivery.name}</MenuItem>
                );
            });
        }
    }

    onChangeDriver(event) {
        const selectedDriver = this.state.drivers.find(d => {
            return d.id === event.target.value;
        });
        this.setState({
            selectedDriver: selectedDriver
        });
    }

    handleSearch() {
        this.setState({
            loading: true
        });
        ReportsService.commisionReport(this.state.searchFromDate, this.state.searchToDate, this.state.selectedDriver)
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

    render() {
        const { classes } = this.props;
        const options = {
            selectableRows: false,
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
                            Comisiones
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
                            <TextField
                                id="driver_select"
                                select
                                label="Chofer"
                                value={this.state.selectedDriver.id}
                                onChange={this.onChangeDriver}
                                style={{ width: '40%' }}
                            >
                                {this.renderDriverOptions()}
                            </TextField>
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
                                    resultDialogMessage={this.state.resultDialogMessage} title='Comisiones' />
                            </div> : ''
                        }
                    </div>
                }

            </div>
        )
    }
}

export default withStyles(useStyles)(CommissionReportComponent);


