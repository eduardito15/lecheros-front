import React from "react";
import {withStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
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

class DriverForm extends React.Component {

    renderDeliveryOptions() {
        if (this.props.commissions != null) {
            return this.props.commissions.map((commission) => {
                return (
                    <MenuItem
                        label="Seleccione una Comisión"
                        value={commission.id}
                        key={commission.id} name={commission.name}
                        >{commission.name}</MenuItem>
                );
            });
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Chofer</DialogTitle>
                    <DialogContent>
                        <div>
                            <TextField
                                margin="dense"
                                id="driver_code"
                                label="Codigo"
                                type="text"
                                className={classes.textField}
                                defaultValue={this.props.driverCode}
                                onBlur={this.props.onChangeDriverCode}
                            />
                        </div>
                        <div>
                            <TextField
                                margin="dense"
                                id="driver_name"
                                label="Nombre"
                                type="text"
                                className={classes.textField}
                                defaultValue={this.props.driverName}
                                onBlur={this.props.onChangeDriverName}
                            />
                        </div>
                        <div>
                            <TextField
                                id="delivery_select"
                                select
                                label="Comisión"
                                value={this.props.commission.id}
                                onChange={this.props.onChangeCommission}
                                style={{width: '100%'}}
                            >
                                {this.renderDeliveryOptions()}
                            </TextField>
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

export default withStyles(useStyles)(DriverForm);
