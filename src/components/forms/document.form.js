import React from "react";
import {withStyles} from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";
import DocumentService from "../../services/document.service";
import ArticlesService from "../../services/articles.service";
import DeleteIcon from "@material-ui/icons/Delete";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"
import RefreshIcon from "@material-ui/icons/Refresh"
import EditArticlePriceForm from "./edit-article-price.form";
import ServiceHelper from "../../services/service.helper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import EditRowForm from "./edit-row.form";
import ClientSelect from "../entities/client.select";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2)
    },
    divider: {
        margin: theme.spacing(1),
    },
    textField: {
        margin: theme.spacing(1),
    },
    table_container: {
        maxHeight: 240,
    },
});

class DocumentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            localMessage: null,
            showNewPriceForm: false,
            selectedDate: new Date(),
            selectedArticle: null,
            selectedPurchasePrice: null,
            selectedSalePrice: null,
            selectedRow: null,
            anchorEl: null,
            showEditRowForm: false,
            editRowNewArticleCode: null,
            editRowNewQuantity: null
        }

        this.onPressKeyInNumberField = this.onPressKeyInNumberField.bind(this);
        this.onPressKeyInArticleCodeField = this.onPressKeyInArticleCodeField.bind(this);
        this.onPressKeyInDeliveryField = this.onPressKeyInDeliveryField.bind(this);
        this.onPressKeyInAddButtonField = this.onPressKeyInAddButtonField.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangePurchasePrice = this.onChangePurchasePrice.bind(this);
        this.onChangeSalePrice = this.onChangeSalePrice.bind(this);
        this.onClickNewPrice = this.onClickNewPrice.bind(this);
        this.handleEditPriceClose = this.handleEditPriceClose.bind(this);
        this.handleEditPriceSave = this.handleEditPriceSave.bind(this);
        this.onClickEditRow= this.onClickEditRow.bind(this);
        this.handleEditRowClose = this.handleEditRowClose.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.handleEditRowSave = this.handleEditRowSave.bind(this);
    }

    componentDidMount() {
        document.onkeypress = this.props.onPressS;
        
    }

    utilizeFocus() {
        const ref = React.createRef()
        const setFocus = () => {
            ref.current && ref.current.focus()
        }

        return {setFocus, ref}
    }

    renderDeliveryOptions() {
        if (this.props.deliveries != null) {
            return this.props.deliveries.map((delivery) => {
                return (
                    <MenuItem
                        label="Seleccione un Reparto"
                        value={delivery.id}
                        key={delivery.id} name={delivery.name}
                        onKeyDown={this.onPressKeyInDeliveryField}>{delivery.code} - {delivery.name}</MenuItem>
                );
            });
        }
    }

    onPressKeyInNumberField(event) {
        if (event.key === 'Enter') {
            if (!this.state.isViewMode && event.target.value != this.props.number) {
                DocumentService.validDocumentTypeAndNumber(this.props.selectedDocumentType, event.target.value)
                    .then(
                        (response) => {

                            if (response != null) {
                                this.setState({
                                    localMessage: response.data.message,
                                });
                            } else {
                                this.manageLocalRequestError('No hay respuesta del servidor.');
                            }
                            document.getElementById("date_picker").focus();
                        },
                        (error) => {
                            this.manageLocalRequestError(ServiceHelper.getErrorMessage(error));
                        }
                    );
            } else {
                document.getElementById("date_picker").focus();
            }
        }
    }

    manageLocalRequestError(message) {
        if (ServiceHelper.isUnauthorizedError(message)) {
            this.props.redirectToLogin();
        } else {
            this.setState({
                localMessage: message
            });
        }
    }

    onPressKeyInDateField(event) {
        if (event.key === 'Enter') {
            document.getElementById("delivery_select").focus();
        }
    }

    onPressKeyInDeliveryField(event) {
        if (event.key === 'Enter') {
        }
    }

    onPressKeyInArticleCodeField(event) {
        if (event.key === 'Enter') {
            ArticlesService.getArticleByCode(event.target.value)
                .then(
                    (response) => {
                        this.setState({
                            localMessage: null
                        });
                        document.getElementById("article_quantity").focus();
                    },
                    (error) => {
                        this.manageLocalRequestError(ServiceHelper.getErrorMessage(error));
                    }
                )
        }
    }

    onPressKeyInArticleQuantityField(event) {
        if (event.key === 'Enter') {
            document.getElementById("add_row_button").focus();
        }
    }

    onPressKeyInAddButtonField(event) {
        if (event.key === 'Enter') {
            document.getElementById("article_code").value = '';
            document.getElementById("article_quantity").value = '';
            document.getElementById("article_code").focus();
        }
    }

    onChangeDate(date) {
        this.setState({
            selectedDate: date
        });
    }

    onChangePurchasePrice(event) {
        if (event != null && event.target != null) {
            this.setState({
                selectedPurchasePrice: event.target.value
            });
        }
    }

    onChangeSalePrice(event) {
        if (event != null && event.target != null) {
            this.setState({
                selectedSalePrice: event.target.value
            });
        }
    }

    onClickNewPrice(row) {
        ArticlesService.getArticleByCode(row.article.code)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showNewPriceForm: true,
                            selectedArticle: response.data,
                            selectedPurchasePrice: response.data.currentPrice.purchasePrice,
                            selectedSalePrice: response.data.currentPrice.salePrice,
                        });
                    } else {
                        this.manageLocalRequestError('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageLocalRequestError(ServiceHelper.getErrorMessage(error));
                }
            )
    }

    handleEditPriceClose() {
        this.setState({
            showNewPriceForm: false,
        })
    }

    handleEditPriceSave() {
        DocumentService.editArticlePrice(this.props.selectedDocument, this.state.selectedArticle, this.state.selectedPurchasePrice, this.state.selectedSalePrice)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            showNewPriceForm: false,
                            selectedArticle: null,
                            selectedPurchasePrice: null,
                            selectedSalePrice: null,
                        });
                        this.props.onChangeDocument(response.data);
                    } else {
                        this.manageLocalRequestError('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageLocalRequestError(ServiceHelper.getErrorMessage(error));
                }
            )
    }

    onClickEditRow(row) {
        this.setState({
            selectedRow: row,
            showEditRowForm: true,
            editRowNewArticleCode: row.article.id,
            editRowNewQuantity: row.quantity,
        });
    }

    handleEditRowClose() {
        this.setState({
            selectedRow: null,
            showEditRowForm: false,
        })
    }


    onChangeQuantity(event) {
        this.setState({
            editRowNewQuantity: event.target.value
        });
    }

    handleEditRowSave() {
        this.setState({
            selectedRow: null,
            showEditRowForm: false,
        })
        this.props.editRow(this.state.selectedRow, this.state.editRowNewArticleCode, this.state.editRowNewQuantity);
    }

    onPressKeyInDelivery(event) {
        if (event.key === 'Enter') {
            document.getElementById("article_code").focus();
        }
    }

    render() {
        const {classes} = this.props;
        const columns = [
            {id: "code", label: "Codigo", display: true},
            {id: "description", label: "Descripcion", display: true},
            {label: "Cantidad", id: "quantity", display: true},
            {label: "Precio", id: "price", display: true},
            {label: "SubTotal", id: "subTotal", display: true},
            {label: "Descuento", id: "discount", display: this.props.isSale},
            {label: "Total", id: "total", display: true},
            {label: "Acciones", id: "actions", display: true},
        ]
        return (
            <div>
                <Dialog fullWidth open={this.props.open} onClose={this.props.handleClose}
                        aria-labelledby="form-dialog-title" maxWidth={'xl'}>
                    <DialogTitle id="form-dialog-title">{this.props.title}
                        <Button
                            onClick={this.props.onClickRefreshForm}
                            startIcon={<RefreshIcon/>}
                            color="primary">
                        </Button>
                    </DialogTitle>
                    <DialogContent>
                        <div>
                            {!this.props.isInventory ?
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="document_number"
                                    label="Numero"
                                    type="number"
                                    style={{width: '20%'}}
                                    className={classes.textField}
                                    defaultValue={this.props.number}
                                    onBlur={this.props.onChangePurchaseNumber}
                                    onKeyPress={this.onPressKeyInNumberField}
                                    disabled={this.props.documentCreated || this.props.isViewMode}
                                    //value={this.state.documentNumber}
                                /> : ''}


                            <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                <KeyboardDatePicker
                                    autoOk
                                    id="date_picker"
                                    variant="inline"
                                    inputVariant="outlined"
                                    label="Fecha"
                                    format="dd/MM/yyyy"
                                    value={this.props.date}
                                    InputAdornmentProps={{position: "start"}}
                                    onChange={date => this.props.onChangeDate(date)}
                                    className={classes.textField}
                                    style={{width: '20%'}}
                                    onKeyPress={this.onPressKeyInDateField}
                                />
                            </MuiPickersUtilsProvider>

                            <TextField
                                id="delivery_select"
                                select
                                label="Reparto"
                                value={this.props.delivery}
                                onChange={this.props.onChangeDelivery}
                                style={{width: '25%'}}
                                onKeyDown={this.onPressKeyInDelivery}
                            >
                                {this.renderDeliveryOptions()}
                            </TextField>

                            {this.props.isSale ? <ClientSelect clientsNames={this.props.clientsNames} deliveries={this.props.deliveries} multiselect
                                                                         clientSelected={this.props.selectClients} isViewMode={this.props.isViewMode}>
                            </ClientSelect> : ''}


                            {this.props.message && (
                                <div>
                                    <Typography display="inline" paragraph color="secondary"
                                                className={classes.textField}>
                                        {this.props.message}
                                    </Typography>
                                </div>
                            )}
                            {this.state.localMessage && !this.props.message && (
                                <div>
                                    <Typography display="inline" paragraph color="secondary"
                                                className={classes.textField}>
                                        {this.state.localMessage}
                                    </Typography>
                                </div>
                            )}
                            <div>
                                <Divider className={classes.divider}/>
                                <TextField
                                    margin="dense"
                                    id="article_code"
                                    label="Articulo"
                                    type="number"
                                    style={{width: '15%'}}
                                    className={classes.textField}
                                    onBlur={this.props.onChangeArticleCode}
                                    onKeyPress={this.onPressKeyInArticleCodeField}
                                    ref={this.props.articleCodeRef}
                                />
                                <TextField
                                    margin="dense"
                                    id="article_desc"
                                    label="Descripcion del Articulo"
                                    type="text"
                                    style={{width: '45%'}}
                                    className={classes.textField}
                                    value={this.props.articleDescription}
                                    defaultValue={"Descripcion del Articulo"}
                                    focused={false}
                                    //onBlur={this.props.onChangePurchaseNumber}
                                />
                                <TextField
                                    margin="dense"
                                    id="article_quantity"
                                    label="Cantidad"
                                    type="number"
                                    style={{width: '15%'}}
                                    className={classes.textField}
                                    //defaultValue={this.props.code}
                                    onBlur={this.props.onChangeQuantity}
                                    onKeyPress={this.onPressKeyInArticleQuantityField}
                                />
                                <Button
                                    id="add_row_button"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    startIcon={<AddIcon/>}
                                    onClick={this.props.addRow}
                                    onKeyPress={this.onPressKeyInAddButtonField}
                                    disabled={this.props.isViewMode}
                                > Agregar
                                </Button>
                            </div>

                            <TableContainer className={classes.table_container}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.filter(c => c.display).map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    //align={column.align}
                                                    //style={{minWidth: column.minWidth}}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.props.rows.map((row, i) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}
                                                          ref={i === this.props.rows.length - 1 ? this.props.tableRef : null}>
                                                    {columns.filter(c => c.display).map((column) => {
                                                        if (column.id === 'actions') {
                                                            return (
                                                                <TableCell key={column.id}>
                                                                    {this.props.isAdmin && !this.props.isViewMode ?
                                                                        <div>
                                                                            <IconButton
                                                                                onClick={() => this.onClickEditRow(row)}
                                                                                variant="contained"
                                                                                color="primary"
                                                                            >
                                                                                <EditIcon/>
                                                                            </IconButton>
                                                                            <IconButton
                                                                                onClick={() => this.props.deleteRow(row)}
                                                                                variant="contained"
                                                                                color="primary"
                                                                            >
                                                                                <DeleteIcon/>
                                                                            </IconButton>
                                                                            <IconButton
                                                                                onClick={() => this.onClickNewPrice(row)}
                                                                                variant="contained"
                                                                                color="primary"
                                                                            >
                                                                                <AttachMoneyIcon/>
                                                                            </IconButton>
                                                                        </div>
                                                                        : ''}
                                                                </TableCell>
                                                            );
                                                        }

                                                        let value = row[column.id];
                                                        if (column.id === 'code')
                                                            value = row['article'][column.id];
                                                        if (column.id === 'description')
                                                            value = row['article'][column.id];
                                                        return (
                                                            <TableCell key={column.id}>
                                                                {value}

                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TextField
                                margin="dense"
                                id="minim_tax"
                                label="Iva Minimo"
                                type="number"
                                style={{width: '20%', marginLeft: '10%'}}
                                className={classes.textField}
                                contentEditable={false}
                                value={this.props.minTaxes}
                            />
                            <TextField
                                margin="dense"
                                id="basic_tax"
                                label="Iva Basico"
                                type="number"
                                style={{width: '20%',}}
                                className={classes.textField}
                                contentEditable={false}
                                value={this.props.basicTaxes}
                            />
                            <TextField
                                margin="dense"
                                id="sub_total"
                                label="Sub Total"
                                type="number"
                                style={{width: '20%'}}
                                className={classes.textField}
                                contentEditable={false}
                                value={this.props.subTotal}
                            />
                            <TextField
                                margin="dense"
                                id="total"
                                label="Total"
                                type="number"
                                style={{width: '20%',}}
                                className={classes.textField}
                                contentEditable={false}
                                value={this.props.total}
                            />
                        </div>
                        {this.state.showNewPriceForm ? <div>
                            <EditArticlePriceForm
                                open={this.state.showNewPriceForm}
                                handleClose={this.handleEditPriceClose}
                                priceDate={this.state.selectedDate}
                                onChangeDate={this.onChangeDate}
                                onChangePurchasePrice={this.onChangePurchasePrice}
                                onChangeSalePrice={this.onChangeSalePrice}
                                salePrice={this.state.selectedSalePrice}
                                purchasePrice={this.state.selectedPurchasePrice}
                                articleCode={this.state.selectedArticle.code}
                                handleSave={this.handleEditPriceSave}
                            >
                            </EditArticlePriceForm>
                        </div> : ''}
                        {this.state.showEditRowForm ? <div>
                            <EditRowForm
                                open={this.state.showEditRowForm}
                                handleClose={this.handleEditRowClose}
                                articleCode={this.state.selectedRow.article.code}
                                quantity={this.state.selectedRow.quantity}
                                onChangeQuantity={this.onChangeQuantity}
                                handleSave={this.handleEditRowSave}
                            >
                            </EditRowForm>
                        </div> : ''}
                    </DialogContent>
                    <DialogActions>
                        {!this.props.isViewMode ?
                            <Button onClick={this.props.handleClose} color="primary">
                                Cancelar
                            </Button> : ''}
                        {!this.props.isViewMode ?
                            <Button onClick={this.props.handleSave} color="primary">
                                Guardar
                            </Button> : ''}
                        {this.props.isViewMode ?
                            <Button onClick={this.props.handleClose} color="primary">
                                Cerrar
                            </Button> : ''}
                    </DialogActions>
                </Dialog>
            </div>
        )
    }


}

export default withStyles(useStyles)(DocumentForm);

