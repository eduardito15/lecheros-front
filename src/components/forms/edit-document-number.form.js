import React from "react";
import {withStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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

class EditDocumentNumberForm extends React.Component {

    render() {
        const {classes} = this.props;

        return (<div>
                <Dialog fullWidth open={this.props.open} onClose={this.props.handleCloseEditDocumentNumber}
                        aria-labelledby="form-dialog-title" >
                    <DialogTitle id="form-dialog-title">Cambiar numero de Documento</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="document_number"
                            label="Numero"
                            type="number"
                            style={{width: '50%'}}
                            className={classes.textField}
                            defaultValue={this.props.number}
                            onBlur={this.props.onChangePurchaseNumber}
                        />
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
                        <Button onClick={this.props.handleEditDocumentNumber} color="primary">
                            Guardar
                        </Button>
                        <Button onClick={this.props.handleCloseEditDocumentNumber} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(useStyles)(EditDocumentNumberForm);