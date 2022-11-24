import React from "react";
import {withStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2)
    },
    divider: {
        margin: theme.spacing(2),
    },
    textField: {
        margin: theme.spacing(1),
    }
});

class EditArticlePriceForm extends React.Component {

    render() {
        const {classes} = this.props;

        return (<div>
            <Dialog fullWidth open={this.props.open} onClose={this.props.handleClose}
                    aria-labelledby="form-dialog-title" >
                <DialogTitle id="form-dialog-title">Modificar Precio del Articulo: {this.props.articleCode}</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                        <KeyboardDatePicker
                            autoOk
                            variant="inline"
                            inputVariant="outlined"
                            label="Fecha"
                            format="dd/MM/yyyy"
                            value={this.props.priceDate}
                            InputAdornmentProps={{position: "start"}}
                            onChange={date => this.props.onChangeDate(date)}
                            className={classes.textField}


                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        margin="dense"
                        id="purchase_price"
                        label="Precio de Compra"
                        type="number"
                        style={{width: '50%'}}
                        className={classes.textField}
                        defaultValue={this.props.purchasePrice}
                        onBlur={this.props.onChangePurchasePrice}
                    />
                    <TextField
                        margin="dense"
                        id="sale_price"
                        label="Precion de Venta"
                        type="number"
                        style={{width: '50%'}}
                        className={classes.textField}
                        defaultValue={this.props.salePrice}
                        onBlur={this.props.onChangeSalePrice}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleSave} color="primary">
                        Guardar
                    </Button>
                    <Button onClick={this.props.handleClose} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            </div>
        );
    }
}

export default withStyles(useStyles)(EditArticlePriceForm);