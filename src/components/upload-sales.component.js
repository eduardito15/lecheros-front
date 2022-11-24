import React from "react";
import UploadService from "../services/upload-files.service";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import SuccessDialog from "./successdialog";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";

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

class UploadSales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: undefined,
            currentFile: undefined,
            loading: false,
            message: null,
            saving: false,
            loadMessage: null,
            showSuccessDialog: false,
            resultDialogMessage: null,
            result: [],
            company: 'Cerram',
        };
        this.selectFile = this.selectFile.bind(this);
        this.upload = this.upload.bind(this);
        this.handleCloseSuccessDialog = this.handleCloseSuccessDialog.bind(this);
        this.onChangeCompany = this.onChangeCompany.bind(this);
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

        UploadService.uploadSales(currentFile, this.state.company)
            .then((response) => {
                console.log(response);
                this.setState({
                    loading: false,
                    result: response.data,
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


    handleCloseSuccessDialog() {
        this.setState({
            showSuccessDialog: false,
        })
    }

    onChangeCompany(event) {
        this.setState({
            company: event.target.value
        });
    }

    renderCompanyOptions() {
        return ["Cerram", "Relece"].map((company) => {
            return (
                <MenuItem
                    label="Empresa"
                    value={company}
                    key={company} name={company}
                    >{company}</MenuItem>
            );
        });
    }

    render() {
        const {classes} = this.props;

        const {
            selectedFiles,
            message,
        } = this.state;
        const columns = [
            {id: "date", label: "Fecha", display: true},
            {id: "number", label: "Numero", display: true},
            {label: "Cliente", id: "clientName", display: true},
            {label: "Reparto", id: "deliveryName", display: true},
            {label: "Total", id: "total", display: true},
            {label: "Estado", id: "state", display: true},
        ]
        return (
            <div className="mg20">

                <Typography variant='h6' className={classes.title}>
                    Ingresar Ventas desde Archivo de Power Street
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
                    &nbsp;
                    &nbsp;
                    <TextField
                        id="delivery_select"
                        select
                        label="Empresa"
                        value={this.state.company}
                        onChange={this.onChangeCompany}
                        style={{width: '25%'}}
                    >
                        {this.renderCompanyOptions()}
                    </TextField>
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
                    Ingresar
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
                    <TableContainer className={classes.table_container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.filter(c => c.display).map((column) => (
                                        <TableCell
                                            key={column.id}
                                            //align={column.align}
                                            //style={{minWidth: column.minWidth}}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.result.map((row, i) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.filter(c => c.display).map((column) => {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {row[column.id]}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

export default withStyles(useStyles)(UploadSales);