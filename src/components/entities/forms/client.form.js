import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";

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

class ClientForm extends React.Component {

    constructor(props) {
        super(props);

        this.renderDeliveryOptions = this.renderDeliveryOptions.bind(this);
        this.renderDeliveries = this.renderDeliveries.bind(this);
    }

    renderDeliveryOptions() {
        if (this.props.deliveries != null) {
            return this.props.deliveries.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                    <Checkbox checked={this.props.clientDeliveries.indexOf(d.id) > -1} color='primary'/>
                    <ListItemText primary={d.name}/>
                </MenuItem>
            ))
        }
    }

    renderDeliveries() {
        const categoriesNames = this.props.clientDeliveries.map((d) => {
            return this.props.deliveries.find(x => x.id === d).name;
        });
        return categoriesNames.join(', ');
    }

    render() {
        const {classes} = this.props;
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 250,
                },
            },
        };
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title"
                        maxWidth={'xl'}>
                    <DialogTitle id="form-dialog-title">Cliente</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            id="ps_code"
                            label="Codigo PS"
                            type="text"
                            style={{width: '45%'}}
                            className={classes.textField}
                            defaultValue={this.props.codePs}
                            onBlur={this.props.onChangeCodePs}
                        />
                        <TextField
                            margin="dense"
                            id="ps_branch"
                            label="Sucursal PS"
                            type="text"
                            style={{width: '45%'}}
                            className={classes.textField}
                            defaultValue={this.props.branchPs}
                            onBlur={this.props.onChangeBranchPs}
                        />
                        <div>
                            <InputLabel id="demo-simple-select-label" className={classes.textField}>
                                Repartos
                            </InputLabel>
                            <Select className={classes.textField} style={{width: '45%'}}
                                    value={this.props.clientDeliveries}
                                    multiple onChange={this.props.onChangeDelivery} input={<Input/>}
                                    MenuProps={MenuProps} renderValue={this.renderDeliveries}
                            >
                                {this.renderDeliveryOptions()}
                            </Select>
                            <Typography display="inline" paragraph className={classes.divider}>
                                Cobra Chofer
                            </Typography>
                            <Checkbox
                                checked={this.props.driverCollect}
                                onChange={this.props.handleDriverCollectCheckboxChange}
                                name="checkedB"
                                color="primary"
                            />
                        </div>
                        <TextField
                            margin="dense"
                            id="name"
                            label="Nombre"
                            type="text"
                            style={{width: '45%'}}
                            className={classes.textField}
                            defaultValue={this.props.clientName}
                            onBlur={this.props.onChangeClientName}
                        />
                        <TextField
                            margin="dense"
                            id="social_reason"
                            label="Razon Social"
                            type="text"
                            style={{width: '45%'}}
                            className={classes.textField}
                            defaultValue={this.props.socialReason}
                            onBlur={this.props.onChangeSocialReason}
                        />

                        <TextField
                            margin="dense"
                            id="rut"
                            label="Rut"
                            type="text"
                            style={{width: '45%'}}
                            className={classes.textField}
                            defaultValue={this.props.rut}
                            onBlur={this.props.onChangeRut}
                        />
                        <TextField
                            margin="dense"
                            id="address"
                            label="Direccion"
                            type="text"
                            style={{width: '45%'}}
                            className={classes.textField}
                            defaultValue={this.props.clientAddress}
                            onBlur={this.props.onChangeClientAddress}
                        />

                        <TextField
                            margin="dense"
                            id="phone"
                            label="Telefono"
                            type="text"
                            style={{width: '45%'}}
                            className={classes.textField}
                            defaultValue={this.props.clientPhone}
                            onBlur={this.props.onChangeClientPhone}
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            label="Email"
                            type="text"
                            style={{width: '45%'}}
                            className={classes.textField}
                            defaultValue={this.props.clientEmail}
                            onBlur={this.props.onChangeClientEmail}
                        />
                        {this.props.isViewMode || this.props.isEdit ?
                            <div>
                                <TextField
                                    margin="dense"
                                    id="debt"
                                    label="Deuda"
                                    type="text"
                                    style={{width: '45%'}}
                                    className={classes.textField}
                                    value={this.props.debt}
                                />
                                <Typography display="inline" paragraph className={classes.divider}>
                                    Activo
                                </Typography>
                                <Checkbox
                                    checked={this.props.active}
                                    onChange={this.props.handleActiveCheckboxChange}
                                    name="checkedB"
                                    color="primary"
                                /></div> : ''}
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
        );
    }
}

export default withStyles(useStyles)(ClientForm);
