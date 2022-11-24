import React from "react";
import UploadService from "../services/upload-files.service";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import ArticlesService from "../services/articles.service"
import SuccessDialog from "./successdialog";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    title: {
        fontWeight: 'bold',
        margin: theme.spacing(2)
    },
    uploadedText: {
        margin: theme.spacing(1)
    },
    divider: {
        margin: theme.spacing(2)
    },
    textField: {
        margin: theme.spacing(1),
    },
    savePrices: {
        margin: theme.spacing(1),
    }
});

class UploadPrices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: undefined,
            currentFile: undefined,
            loading: false,
            message: null,
            saving: false,
            priceDate: new Date(),
            fromRow: null,
            toRow: null,
            loadMessage: null,
            showSuccessDialog: false,
            resultDialogMessage: null
        };
        this.selectFile = this.selectFile.bind(this);
        this.upload = this.upload.bind(this);
        this.savePrices = this.savePrices.bind(this);
        this.onChangeFromRow = this.onChangeFromRow.bind(this);
        this.onChangeToRow = this.onChangeToRow.bind(this);
        this.handleCloseSuccessDialog = this.handleCloseSuccessDialog.bind(this);
    }

    selectFile(event) {
        this.setState({
            selectedFiles: event.target.files,
        });
    }

    upload() {
        let currentFile = this.state.selectedFiles[0];

        this.setState({
            loading: true,
            currentFile: currentFile,
        });

        UploadService.upload(currentFile)
            .then((response) => {
                this.setState({
                    loading: false,
                    message: response.data.message,
                    isError: false
                });
            })
            .catch((response) => {
                if (response.message === 'Request failed with status code 401') {
                    this.props.redirectToLogin();
                } else {
                    this.setState({
                        loading: false,
                        message: "No se pudo subir el archivo!",
                        currentFile: undefined,
                        isError: true
                    });
                }
            });

        this.setState({
            selectedFiles: undefined,
        });
    }

    savePrices() {
        this.setState({
            saving: true
        });
        ArticlesService.savePrices(this.state.currentFile.name, this.state.priceDate, this.state.fromRow, this.state.toRow)
            .then(response => {
                this.setState({
                    saving: false,
                    showSuccessDialog: true,
                    resultDialogMessage: 'Precios cargados correctamente!'
                });
            })
            .catch(error => {
                this.setState({
                    saving: false,
                    loadMessage: error.response.data.message
                });
            });
    }

    onChangeDate(date) {
        this.setState({
            priceDate: date
        })
    }

    onChangeFromRow(event) {
        this.setState({
            fromRow: event.target.value
        });
    }

    onChangeToRow(event) {
        this.setState({
            toRow: event.target.value
        });
    }

    handleCloseSuccessDialog() {
        this.setState({
            showSuccessDialog: false,
        })
    }

    render() {
        const {classes} = this.props;

        const {
            selectedFiles,
            currentFile,
            loading,
            message,
            saving
        } = this.state;

        return (
            <div className="mg20">

                <Typography variant='h6' className={classes.title}>
                    Ingresar Precios desde Archivo
                </Typography>

                <label htmlFor="btn-upload">
                    <input
                        id="btn-upload"
                        name="btn-upload"
                        style={{display: 'none'}}
                        type="file"
                        onChange={this.selectFile}/>
                    <Button
                        className="btn-choose"
                        variant="outlined"
                        component="span">
                        Seleccionar Archivo
                    </Button>
                </label>
                &nbsp;
                &nbsp;
                {selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : null}
                &nbsp;
                &nbsp;
                <Button
                    className="btn-upload"
                    color="primary"
                    variant="contained"
                    component="span"
                    disabled={!selectedFiles}
                    onClick={this.upload}>
                    Subir
                </Button>
                &nbsp;
                &nbsp;
                {this.state.loading ?
                    <CircularProgress size={30}/> : ''}

                <Typography className={classes.uploadedText}>
                    {message}
                </Typography>

                <Divider className={classes.divider} style={{width: '50%'}}/>
                <div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                        <KeyboardDatePicker
                            autoOk
                            variant="inline"
                            inputVariant="outlined"
                            label="Fecha"
                            format="dd/MM/yyyy"
                            value={this.state.priceDate}
                            InputAdornmentProps={{position: "start"}}
                            onChange={date => this.onChangeDate(date)}
                            className={classes.textField}
                            disabled={!(currentFile && !loading && !saving)}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <TextField
                    margin="dense"
                    id="purchase_price"
                    label="Desde Fila"
                    type="number"
                    style={{width: '25%'}}
                    className={classes.textField}
                    disabled={!(currentFile && !loading && !saving)}
                    //defaultValue={this.props.code}
                    onBlur={this.onChangeFromRow}
                />
                <div>
                    <TextField
                        margin="dense"
                        id="sale_price"
                        label="Hasta Fila"
                        type="number"
                        style={{width: '25%'}}
                        className={classes.textField}
                        disabled={!(currentFile && !loading && !saving)}
                        //defaultValue={this.props.description}
                        onBlur={this.onChangeToRow}
                    />
                </div>
                <div>
                    <Button
                        className={classes.savePrices}
                        color="primary"
                        variant="contained"
                        component="span"
                        disabled={!(currentFile && !loading && !saving)}
                        onClick={this.savePrices}>
                        Ingresar Precios
                    </Button>
                    {this.state.saving ?
                        <CircularProgress size={30}/> : ''}
                </div>
                <div>
                    {this.state.loadMessage && (
                        <div>
                            <Typography display="inline" paragraph color="secondary" className={classes.textField}>
                                {this.state.loadMessage}
                            </Typography>
                        </div>
                    )}
                </div>
                {this.state.showSuccessDialog ?
                    <div>
                        <SuccessDialog showSuccessDialog={this.state.showSuccessDialog}
                                       handleCloseSuccessDialog={this.handleCloseSuccessDialog}
                                       resultDialogMessage={this.state.resultDialogMessage} title='Precios'/>
                    </div> : ''
                }
            </div>
        );
    }
}

export default withStyles(useStyles)(UploadPrices);