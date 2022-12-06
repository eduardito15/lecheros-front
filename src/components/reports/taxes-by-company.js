import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import ServiceHelper from "../../services/service.helper";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search"
import ReportsService from "../../services/reports-service"
import CircularProgress from "@material-ui/core/CircularProgress";
import FailedDialog from "../faileddialog";

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

class TaxesByCompanyComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showFailedDialog: false,
            loading: false,
            resultDialogMessage: null,
            data: [[0], [0], [0]],
            data2: [[0], [0], [0]],
            searchFromDate: new Date(),
            searchToDate: new Date(),
            columns: [],
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
    }

    componentDidMount() {
        
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
        ReportsService.taxesByCompany(this.state.searchFromDate, this.state.searchToDate, 'CERRAM')
            .then(
                (response) => {

                    if (response != null) {
                        this.setState({
                            data: response.data.tableReport.slice(1),
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
        ReportsService.taxesByCompany(this.state.searchFromDate, this.state.searchToDate, 'RELECE')
            .then(
                (response) => {

                    if (response != null) {
                        this.setState({
                            data2: response.data.tableReport.slice(1),
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
            }
        }
        return (
            <div>
                {this.state.loading ? <div className={classes.loading}><CircularProgress size={250} /></div> :
                    <div>
                        <Typography variant='h6' className={classes.title}>
                            Ivas por Empresa
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
                            <div>
                            <TextField
                                    margin="dense"
                                    id="ctitle"
                                    label="Cerram"
                                    type="texr"
                                    style={{ width: '45%', }}
                                    className={classes.textField}
                                    contentEditable={false}
                                    disabled={true}
                                />
                                <TextField
                                    margin="dense"
                                    id="rtitle"
                                    label="Relece"
                                    type="text"
                                    style={{ width: '45%', }}
                                    className={classes.textField}
                                    contentEditable={false}
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <TextField
                                    margin="dense"
                                    id="cpsiniva"
                                    label="Iva Compra"
                                    type="number"
                                    style={{ width: '45%', }}
                                    className={classes.textField}
                                    contentEditable={false}
                                    defaultValue={0}
                                    value={this.state.data[0][0]}
                                />
                                <TextField
                                    margin="dense"
                                    id="rpsiniva"
                                    label="Iva Compra"
                                    type="number"
                                    style={{ width: '45%', }}
                                    className={classes.textField}
                                    contentEditable={false}
                                    defaultValue={0}
                                    value={this.state.data2[0][0]}
                                />
                            </div>
                            <div>
                                <TextField
                                    margin="dense"
                                    id="cpconiva"
                                    label="Iva Venta"
                                    type="number"
                                    style={{ width: '45%', }}
                                    className={classes.textField}
                                    contentEditable={false}
                                    defaultValue={0}
                                    value={this.state.data[0][1]}
                                />
                                <TextField
                                    margin="dense"
                                    id="rpconiva"
                                    label="Iva Venta"
                                    type="number"
                                    style={{ width: '45%', }}
                                    className={classes.textField}
                                    contentEditable={false}
                                    defaultValue={0}
                                    value={this.state.data2[0][1]}
                                />
                            </div>
                            <div>
                                <TextField
                                    margin="dense"
                                    id="cvsiniva"
                                    label="Diferencia"
                                    type="number"
                                    style={{ width: '45%', }}
                                    className={classes.textField}
                                    contentEditable={false}
                                    defaultValue={0}
                                    value={this.state.data[0][2]}
                                />
                                <TextField
                                    margin="dense"
                                    id="rvsiniva"
                                    label="Diferencia"
                                    type="number"
                                    style={{ width: '45%', }}
                                    className={classes.textField}
                                    contentEditable={false}
                                    defaultValue={0}
                                    value={this.state.data2[0][2]}
                                />
                            </div>
                        </div>
                        {this.state.showFailedDialog ?
                            <div>
                                <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                    handleCloseFailedDialog={this.handleCloseFailedDialog}
                                    resultDialogMessage={this.state.resultDialogMessage} title='Ivas por Empresa' />
                            </div> : ''
                        }
                    </div>
                }

            </div>
        )
    }
}

export default withStyles(useStyles)(TaxesByCompanyComponent);


