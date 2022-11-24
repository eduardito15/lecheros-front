import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import authHeader from "../../../services/auth-header";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import Divider from "@material-ui/core/Divider";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import MUIDataTable from "mui-datatables";
import ServiceHelper from "../../../services/service.helper"


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

class ArticleForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            taxes: [],
            selected: null,
            newPrice: false
        }
        this.renderCategories = this.renderCategories.bind(this);
        this.handleNewPriceCheckboxChange = this.handleNewPriceCheckboxChange.bind(this);
    }

    componentDidMount() {
        this.getAllTaxes();
    }

    getAllTaxes() {
        fetch(ServiceHelper.getHost() + "/lecheros/api/taxes", {
            method: "GET",
            headers: authHeader(),
        })
            .then(res => res.json())
            .then(
                (response) => {
                    if (response.status === 401) {
                        this.props.redirectToLogin();
                    } else {
                        if (response != null) {
                            this.setState({
                                taxes: response
                            });
                        } else {
                            alert(response);
                        }
                    }
                },
                (error) => {
                    alert(error);
                }
            )
    }

    renderTaxOptions() {
        if (this.state.taxes != null) {
            return this.state.taxes.map((tax) => {
                return (
                    <MenuItem
                        label="Seleccione un iva"
                        value={tax.id}
                        key={tax.id} name={tax.name}>{tax.name}</MenuItem>
                );
            });
        }
    }

    renderCategoryOptions() {
        if (this.props.allCategories != null) {
            return this.props.allCategories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={this.props.categories.indexOf(c.id) > -1} color='primary'/>
                    <ListItemText primary={c.name}/>
                </MenuItem>
            ))
        }
    }

    renderCategories() {
        const categoriesNames = this.props.categories.map((c) => {
            return this.props.allCategories.find(x => x.id === c).name;
        });
        return categoriesNames.join(', ');
    }

    handleNewPriceCheckboxChange() {
        this.setState({
            newPrice: !this.state.newPrice
        })
    }

    render() {
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
        const options = {
            filter: false,
            search: false,
            download: false,
            print: false,
            pagination: false,
            filterType: "textField",
            selectableRows: 'none',

        }
        const columns = [
            {label: "Fecha", name: "date"},
            {label: "Precio de Compra", name: "purchasePrice"},
            {label: "Precion de Venta", name: "salePrice"}
        ]
        const {classes} = this.props;
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Articulo</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="code"
                            label="Codigo"
                            type="text"
                            style={{width: '50%'}}
                            className={classes.textField}
                            defaultValue={this.props.code}
                            onBlur={this.props.onChangeCode}
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            label="Descripcion"
                            type="text"
                            fullWidth
                            className={classes.textField}
                            defaultValue={this.props.description}
                            onBlur={this.props.onChangeDescription}
                        />
                        <InputLabel id="demo-simple-select-label" className={classes.textField}>Iva</InputLabel>
                        <Select className={classes.textField} style={{width: '50%'}} value={this.props.tax}
                                onChange={this.props.onChangeTax}>
                            {this.renderTaxOptions()}
                        </Select>
                        <InputLabel id="demo-simple-select-label" className={classes.textField}>Categorias</InputLabel>
                        <Select className={classes.textField} fullWidth value={this.props.categories}
                                multiple onChange={this.props.onChangeCategory} input={<Input/>}
                                MenuProps={MenuProps} renderValue={this.renderCategories}
                        >
                            {this.renderCategoryOptions()}
                        </Select>
                        <Divider className={classes.divider}/>
                        {this.props.isEdit ? <div>
                            <Typography display="inline" paragraph className={classes.divider}>
                                Nuevo Precio
                            </Typography>
                            <Checkbox
                                checked={this.state.newPrice}
                                onChange={this.handleNewPriceCheckboxChange}
                                name="checkedB"
                                color="primary"
                            />
                        </div> : ''}
                        {!this.props.isEdit || this.state.newPrice ?
                            <div>
                                <div>
                                    <Typography display="inline" paragraph className={classes.divider}>
                                        Precio
                                    </Typography>
                                </div>
                                <div>
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
                                        //defaultValue={this.props.code}
                                        onBlur={this.props.onChangePurchasePrice}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="sale_price"
                                        label="Precion de Venta"
                                        type="number"
                                        style={{width: '50%'}}
                                        className={classes.textField}
                                        //defaultValue={this.props.description}
                                        onBlur={this.props.onChangeSalePrice}
                                    />
                                </div>

                            </div> : ''}
                        {this.props.message && (
                            <div>
                                <Typography display="inline" paragraph color="secondary" className={classes.textField}>
                                    {this.props.message}
                                </Typography>
                            </div>
                        )}
                        <Divider className={classes.divider}/>

                        {this.props.isEdit ?
                            <div>
                                <MUIDataTable
                                    title={"Precios"}
                                    data={this.props.prices}
                                    columns={columns}
                                    options={options}

                                />
                            </div> : ''}
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

export default withStyles(useStyles)(ArticleForm);
