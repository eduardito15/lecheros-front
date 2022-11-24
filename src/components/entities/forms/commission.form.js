import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2),
    },
    textField: {
        margin: theme.spacing(1),
    }
});

class CommissionForm extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title"
                        maxWidth={'md'}>
                    <DialogTitle id="form-dialog-title">Comisión</DialogTitle>
                    <DialogContent>
                        <div>
                            <TextField
                                margin="dense"
                                id="commission_name"
                                label="Nombre"
                                type="text"
                                className={classes.textField}
                                defaultValue={this.props.commissionName}
                                onBlur={this.props.onChangeCommissionName}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="commission_percentage"
                                label="Porcentaje"
                                type="number"
                                className={classes.textField}
                                defaultValue={this.props.commissionPercentage}
                                onBlur={this.props.onChangeCommissionPercentage}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="commission_milk_percentage"
                                label="Porcentaje Leche"
                                type="number"
                                className={classes.textField}
                                defaultValue={this.props.commissionMilkPercentage}
                                onBlur={this.props.onChangeCommissionMilkPercentage}
                            />
                        </div>
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
                        {this.props.isViewMode ?
                            <Button onClick={this.props.handleClose} color="primary">
                                Cerrar
                            </Button> : <div><Button onClick={this.props.handleClose} color="primary">
                                Cancelar
                            </Button>
                                <Button onClick={this.props.handleSave} color="primary">
                                    Guardar
                                </Button></div>
                        }

                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}

export default withStyles(useStyles)(CommissionForm);