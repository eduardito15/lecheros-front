import React from "react";
import { withStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { MuiPickersUtilsProvider} from "@material-ui/pickers";
import { DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {format} from "date-fns";

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

class EditSettlementDateForm extends React.Component {

    render() {
        const { classes } = this.props;

        return (<div>
            <Dialog fullWidth open={this.props.open} onClose={this.props.handleCloseEditDocumentNumber}
                aria-labelledby="form-dialog-title" >
                <DialogTitle id="form-dialog-title">Agregar Fecha de Liquidación</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            id="date_picker"
                            label="Fecha"
                            value={this.props.settlementDate}
                            onChange={date => this.props.onChangeSettlementDate(date)}
                            style={{ width: '40%' }}
                            animateYearScrolling
                            format="dd/MM/yyyy"
                        />
                    </MuiPickersUtilsProvider>
                    {this.props.message && (
                        <div>
                            <Typography display="inline" paragraph color="secondary"
                                className={classes.textField}>
                                {this.props.message}
                            </Typography>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleEditSettlementDate} color="primary">
                        Guardar
                    </Button>
                    <Button onClick={this.props.handleCloseEditSettlementDate} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

export default withStyles(useStyles)(EditSettlementDateForm);