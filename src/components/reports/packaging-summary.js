import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import DeliveryService from "../../services/delivery.service";
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

class PackagingSummaryComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showFailedDialog: false,
            loading: true,
            resultDialogMessage: null,
            deliveries: [],
            data: [],
            data2: [],
            searchFromDate: new Date(),
            searchToDate: new Date(),
            searchDelivery: {
                id: ''
            },
            columns: [],
            columns2: [],
            total: 0,
            total2: 0
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
    }

    componentDidMount() {
        this.setState({
            loading: false
        });
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
        ReportsService.packagingSummary(this.state.searchFromDate, this.state.searchToDate, 'CERRAM')
            .then(
                (response) => {

                    if (response != null) {
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
        ReportsService.packagingSummary(this.state.searchFromDate, this.state.searchToDate, 'RELECE')
            .then(
                (response) => {

                    if (response != null) {
                        this.setState({
                            data2: response.data.tableReport.slice(1),
                            columns2: response.data.tableReport[0],
                            total2: response.data.total,
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
            },
            responsive: "scroll",
        }
        return (
            <div>
                {this.state.loading ? <div className={classes.loading}><CircularProgress size={250} /></div> :
                    <div>
                        <Typography variant='h6' className={classes.title}>
                            Resumen de Envases
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
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SearchIcon />}
                            onClick={this.handleSearch}
                        >
                            Ver
                        </Button>
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
                                title={'Cerram'}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={options}
                            />
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
                                value={this.state.total2}
                            />
                            <MUIDataTable
                                title={'Relece'}
                                data={this.state.data2}
                                columns={this.state.columns2}
                                options={options}
                            />
                        </div>
                        {this.state.showFailedDialog ?
                            <div>
                                <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                    handleCloseFailedDialog={this.handleCloseFailedDialog}
                                    resultDialogMessage={this.state.resultDialogMessage} title='Resumen de Envases' />
                            </div> : ''
                        }
                    </div>
                }

            </div>
        )
    }
}

export default withStyles(useStyles)(PackagingSummaryComponent);


