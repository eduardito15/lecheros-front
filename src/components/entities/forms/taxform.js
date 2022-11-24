import React from "react";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    tForm: {
        margin: theme.spacing(10),
    },
    textField: {
        margin: theme.spacing(1),
    }
});

class TaxForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            name: this.props.name,
            percentage: this.props.percentage
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Iva</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Nombre"
                            type="text"
                            fullWidth
                            className={classes.textField}
                            defaultValue={this.props.name}
                            onBlur={this.props.onChangeName}
                        />
                        <TextField
                            margin="dense"
                            id="percentage"
                            label="%"
                            type="number"
                            fullWidth
                            className={classes.textField}
                            defaultValue={this.props.percentage}
                            onBlur={this.props.onChangePercentage}
                        />
                        {this.props.message && (
                            <div>
                                <Typography display="inline" paragraph color="secondary" className={classes.textField}>
                                    {this.props.message}
                                </Typography>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={this.props.handleSave} color="primary">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default withStyles(useStyles)(TaxForm);
