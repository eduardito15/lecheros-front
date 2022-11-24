import React from "react";
import {withStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import ClientService from "../../../services/client.service"
import ServiceHelper from "../../../services/service.helper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

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

class ClientSelectForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchCodePs: null,
            searchName: null,
            searchAddress: null,
            searchDelivery: null,
            allClients: [],
            clients: [],

        }

        this.onChangeCodePs = this.onChangeCodePs.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangeDelivery = this.onChangeDelivery.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.onChangeClients = this.onChangeClients.bind(this);
        this.onChangeClient = this.onChangeClient.bind(this);
        this.renderClients = this.renderClients.bind(this);
        this.onSelectClientsClick = this.onSelectClientsClick.bind(this);
    }

    onChangeCodePs(event) {
        this.setState({
            searchCodePs: event.target.value
        })
    }

    onChangeName(event) {
        this.setState({
            searchName: event.target.value
        })
    }

    onChangeAddress(event) {
        this.setState({
            searchAddress: event.target.value
        })
    }

    renderDeliveryOptions() {
        if (this.props.deliveries != null) {
            return this.props.deliveries.map((delivery) => {
                return (
                    <MenuItem
                        label="Seleccione un Reparto"
                        value={delivery.id}
                        key={delivery.id} name={delivery.name}
                    >{delivery.id} - {delivery.name}</MenuItem>
                );
            });
        }
    }

    renderClientOptions() {
        if (this.state.allClients != null) {
            return this.state.allClients.map((client) => {
                return (
                    <MenuItem
                        label="Seleccione un Cliente"
                        value={client.id}
                        key={client.id} name={client.name}
                    >
                        <ListItemText primary={client.name + ' ' + client.address}/>
                    </MenuItem>
                );
            });
        }
    }

    onChangeDelivery(event) {
        const selectedDelivery = this.props.deliveries.find(d => {
            return d.id === event.target.value;
        });
        this.setState({
            searchDelivery: selectedDelivery.id
        });
    }

    handleSearch() {
        ClientService.search(this.state.searchCodePs, this.state.searchName, this.state.searchAddress,
            this.state.searchDelivery)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            allClients: response.data,
                        });
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            )
    }

    manageRequestErrors(message) {
        if (ServiceHelper.isUnauthorizedError(message)) {
            this.props.redirectToLogin();
        } else {
            this.setState({
                errorMessage: message
            });
        }
    }

    onChangeClient(event) {
        this.setState({
            clients: [event.target.value],
        });
    }

    onChangeClients(event) {
        this.setState({
            clients: event.target.value,
        });
    }

    renderClientOptionsMultiSelect() {
        if (this.state.allClients != null) {
            return this.state.allClients.map((client) => {
                return (
                    <MenuItem
                        label="Seleccione un Cliente"
                        value={client.id}
                        key={client.id} name={client.name}
                    >
                        <Checkbox checked={this.state.clients.indexOf(client.id) > -1} color='primary'/>
                        <ListItemText primary={client.name + ' ' + client.address}/>
                    </MenuItem>
                );
            });
        }
    }

    renderClients() {
        const clientsName = this.state.clients.map((c) => {
            return this.state.allClients.find(x => x.id === c).name + ' - ' + this.state.allClients.find(x => x.id === c).address;
        });
        return clientsName.join(', ');
    }

    onSelectClientsClick() {
        const selectedClients = [];
        this.state.clients.map((c) => {
            return selectedClients.push(this.state.allClients.find(x => x.id === c));
        });
        this.setState({

        })
        this.props.clientSelected(selectedClients);
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
        return (<div>
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title"
                    maxWidth={'xl'}>
                <DialogTitle id="form-dialog-title">Buscar Cliente</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="client_search_codePs"
                        label="Codigo PS"
                        type="text"
                        style={{width: '25%'}}
                        className={classes.textField}
                        onBlur={this.onChangeCodePs}
                    />
                    <TextField
                        margin="dense"
                        id="client_search_name"
                        label="Nombre"
                        type="text"
                        style={{width: '25%'}}
                        className={classes.textField}
                        onBlur={this.onChangeName}
                    />
                    <TextField
                        margin="dense"
                        id="client_search_adrees"
                        label="Direccion"
                        type="text"
                        style={{width: '25%'}}
                        className={classes.textField}
                        onBlur={this.onChangeAddress}
                    />
                    <TextField
                        id="search_delivery_select"
                        select
                        label="Reparto"
                        style={{width: '50%'}}
                        onChange={this.onChangeDelivery}
                    >
                        {this.renderDeliveryOptions()}
                    </TextField>

                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SearchIcon/>}
                        onClick={this.handleSearch}
                    >
                        Buscar
                    </Button>
                    {this.props.errorMessage && (
                        <div>
                            <Typography display="inline" paragraph color="secondary"
                                        className={classes.textField}>
                                {this.props.errorMessage}
                            </Typography>
                        </div>
                    )}
                    <Divider className={classes.divider}/>

                    {this.state.allClients != [] ? <div>
                        {this.props.multiselect ?
                        <TextField
                            id="selected_client"
                            select
                            label="Cliente"
                            style={{width: '100%'}}
                            renderValue={this.renderClients}
                            onChange={this.onChangeClient}
                        >
                            {this.renderClientOptions()}
                        </TextField> : <div>
                                <InputLabel id="demo-simple-select-label" className={classes.textField}>Clientes</InputLabel>
                                <Select className={classes.textField} fullWidth value={this.state.clients}
                                        multiple onChange={this.onChangeClients}  input={<Input/>}
                                        MenuProps={MenuProps} renderValue={this.renderClients}
                                >
                                    {this.renderClientOptionsMultiSelect()}
                                </Select>
                            </div>}
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => this.onSelectClientsClick()}
                        >
                            Seleccionar
                        </Button>
                    </div> : ''}
                </DialogContent>
            </Dialog>
        </div>);
    }
}

export default withStyles(useStyles)(ClientSelectForm);