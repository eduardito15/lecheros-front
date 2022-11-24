import React from "react";
import {withStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
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

class EditRowForm extends React.Component {

    render() {
        const {classes} = this.props;

        return (<div>
                <Dialog fullWidth open={this.props.open} onClose={this.props.handleClose}
                        aria-labelledby="form-dialog-title" >
                    <DialogTitle id="form-dialog-title">Modificar Renglon</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="article_code"
                            label="Articulo"
                            type="number"
                            style={{width: '50%'}}
                            className={classes.textField}
                            value={this.props.articleCode}
                        />
                        <TextField
                            margin="dense"
                            id="row_quantity"
                            label="Cantidad"
                            type="number"
                            style={{width: '50%'}}
                            className={classes.textField}
                            defaultValue={this.props.quantity}
                            onBlur={this.props.onChangeQuantity}
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

export default withStyles(useStyles)(EditRowForm);