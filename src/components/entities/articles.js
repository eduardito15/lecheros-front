import React from "react";
import {withStyles} from "@material-ui/core/styles";
import authHeader from "../../services/auth-header";
import AuthService from "../../services/auth.service";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MUIDataTable from "mui-datatables";
import AddIcon from "@material-ui/icons/Add";
import ArticleForm from "./forms/articleform";
import {format} from 'date-fns';
import ServiceHelper from "../../services/service.helper";
import SuccessDialog from "../successdialog";
import FailedDialog from "../faileddialog";
import TextField from "@material-ui/core/TextField";
import ConfirmDeleteDialog from "../confirm.delete.dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    drawerHeader: {
        alignItems: 'center',
        padding: theme.spacing(1),
        // necessary for content to be below app bar
        justifyContent: 'flex-end',
    },
    loading: {
        marginTop: theme.spacing(15),
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center'
    },
    divider: {
        marginTop: theme.spacing(14),
    },
});

class Articles extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showForm: false,
            showSuccessDialog: false,
            showFailedDialog: false,
            resultDialogMessage: null,
            resultErrorMessage: null,
            selectedArticle: {
                id: null,
                code: null,
                description: null,
                tax: null,
                newPrice: {
                    date: new Date(),
                    salePrice: null,
                    purchasePrice: null,
                },
                categories: [],
                prices: []
            },
            isEdit: false,
            isAdmin: false,
            allCategories: [],
            showConfirmDeleteDialog: false,
            loading: true,
            filterByCategory: false,
            filterCategories: []
        };
        this.clickNew = this.clickNew.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onChangeCode = this.onChangeCode.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeTax = this.onChangeTax.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangePurchasePrice = this.onChangePurchasePrice.bind(this);
        this.onChangeSalePrice = this.onChangeSalePrice.bind(this);
        this.handleCloseSuccessDialog = this.handleCloseSuccessDialog.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onPressKeyInCodeFinder = this.onPressKeyInCodeFinder.bind(this);
        this.handleCloseConfirmDeleteDialog = this.handleCloseConfirmDeleteDialog.bind(this);
        this.handleDeleteConfirmDeleteDialog = this.handleDeleteConfirmDeleteDialog.bind(this);
        this.handleFilterByCategoryCheckboxChange = this.handleFilterByCategoryCheckboxChange.bind(this);
        this.onChangeFilterCategory = this.onChangeFilterCategory.bind(this);
        this.renderCategories = this.renderCategories.bind(this);
    }

    componentDidMount() {
        this.getAll();
        if (AuthService.hasRole("ROLE_ADMIN")) {
            this.setState({
                isAdmin: true
            })
        }
        this.getAllCategories();
    }

    getAll() {
        fetch(ServiceHelper.getHost() + "/lecheros/api/articles", {
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
                                data: response,
                                showFailedDialog: this.state.showFailedDialog,
                                showSuccessDialog: this.state.showSuccessDialog,
                                loading: false
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

    getAllCategories() {
        fetch(ServiceHelper.getHost() + "/lecheros/api/article/categories", {
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
                                allCategories: response
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

    clickNew() {
        this.setState({
            showForm: true,
            selectedArticle: {
                id: null,
                code: null,
                description: null,
                tax: null,
                newPrice: {
                    date: new Date(),
                    salePrice: null,
                    purchasePrice: null,
                },
                categories: [],
                isEdit: false
            },
        });
    }

    handleClose() {
        this.setState({
            showForm: false,
            showSuccessDialog: this.state.showSuccessDialog,
            showFailedDialog: this.state.showFailedDialog,
            resultErrorMessage: null,
            isEdit: false
        });
    }

    onChangeCode(event) {
        if (event != null && event.target != null) {
            this.setState({
                data: this.state.data,
                showForm: this.state.showForm,
                selectedArticle: {
                    id: this.state.selectedArticle.id,
                    code: event.target.value,
                    description: this.state.selectedArticle.description,
                    tax: this.state.selectedArticle.tax,
                    newPrice: {
                        date: this.state.selectedArticle.newPrice != null ? this.state.selectedArticle.newPrice.date : new Date(),
                        salePrice: this.state.selectedArticle.newPrice != null ? this.state.selectedArticle.newPrice.salePrice : null,
                        purchasePrice: this.state.selectedArticle.newPrice != null ? this.state.selectedArticle.newPrice.purchasePrice : null,
                    },
                    categories: this.state.selectedArticle.categories,
                    prices: this.state.selectedArticle.prices
                }
            });
        }
    }

    onChangeDescription(event) {
        if (event != null && event.target != null) {
            this.setState({
                data: this.state.data,
                showForm: this.state.showForm,
                selectedArticle: {
                    id: this.state.selectedArticle.id,
                    code: this.state.selectedArticle.code,
                    description: event.target.value,
                    tax: this.state.selectedArticle.tax,
                    newPrice: {
                        date: this.state.selectedArticle.newPrice.date,
                        salePrice: this.state.selectedArticle.newPrice.salePrice,
                        purchasePrice: this.state.selectedArticle.newPrice.purchasePrice,
                    },
                    categories: this.state.selectedArticle.categories,
                    prices: this.state.selectedArticle.prices
                }
            });
        }
    }

    onChangeTax(event) {
        if (event != null && event.target != null) {
            this.setState({
                data: this.state.data,
                showForm: this.state.showForm,
                selectedArticle: {
                    id: this.state.selectedArticle.id,
                    code: this.state.selectedArticle.code,
                    description: this.state.selectedArticle.description,
                    tax: event.target.value,
                    newPrice: {
                        date: this.state.selectedArticle.newPrice.date,
                        salePrice: this.state.selectedArticle.newPrice.salePrice,
                        purchasePrice: this.state.selectedArticle.newPrice.purchasePrice,
                    },
                    categories: this.state.selectedArticle.categories,
                    prices: this.state.selectedArticle.prices
                }
            });
        }
    }

    onChangeCategory(event) {
        if (event != null && event.target != null) {
            this.setState({
                data: this.state.data,
                showForm: this.state.showForm,
                selectedArticle: {
                    id: this.state.selectedArticle.id,
                    code: this.state.selectedArticle.code,
                    description: this.state.selectedArticle.description,
                    tax: this.state.selectedArticle.tax,
                    newPrice: {
                        date: this.state.selectedArticle.newPrice.date,
                        salePrice: this.state.selectedArticle.newPrice.salePrice,
                        purchasePrice: this.state.selectedArticle.newPrice.purchasePrice,
                    },
                    categories: event.target.value,
                    prices: this.state.selectedArticle.prices
                }
            });
        }
    }

    onChangeDate(date) {
        this.setState({
            data: this.state.data,
            showForm: this.state.showForm,
            selectedArticle: {
                id: this.state.selectedArticle.id,
                code: this.state.selectedArticle.code,
                description: this.state.selectedArticle.description,
                tax: this.state.selectedArticle.tax,
                newPrice: {
                    date: date,
                    salePrice: this.state.selectedArticle.newPrice.salePrice,
                    purchasePrice: this.state.selectedArticle.newPrice.purchasePrice,
                },
                categories: this.state.selectedArticle.categories,
                prices: this.state.selectedArticle.prices
            }
        });
    }

    onChangePurchasePrice(event) {
        if (event != null && event.target != null) {
            this.setState({
                data: this.state.data,
                showForm: this.state.showForm,
                selectedArticle: {
                    id: this.state.selectedArticle.id,
                    code: this.state.selectedArticle.code,
                    description: this.state.selectedArticle.description,
                    tax: this.state.selectedArticle.tax,
                    newPrice: {
                        date: this.state.selectedArticle.newPrice.date,
                        salePrice: this.state.selectedArticle.newPrice.salePrice,
                        purchasePrice: event.target.value,
                    },
                    categories: this.state.selectedArticle.categories,
                    prices: this.state.selectedArticle.prices
                }
            });
        }
    }

    onChangeSalePrice(event) {
        if (event != null && event.target != null) {
            this.setState({
                data: this.state.data,
                showForm: this.state.showForm,
                selectedArticle: {
                    id: this.state.selectedArticle.id,
                    code: this.state.selectedArticle.code,
                    description: this.state.selectedArticle.description,
                    tax: this.state.selectedArticle.tax,
                    newPrice: {
                        date: this.state.selectedArticle.newPrice.date,
                        salePrice: event.target.value,
                        purchasePrice: this.state.selectedArticle.newPrice.purchasePrice,
                    },
                    categories: this.state.selectedArticle.categories,
                    prices: this.state.selectedArticle.prices
                }
            });
        }
    }

    handleSave() {
        if (!this.state.isEdit) {
            this.createNewArticle();
        } else {
            this.updateArticle();
        }
    }

    createNewArticle() {
        fetch(ServiceHelper.getArticlePath(), {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify({
                description: this.state.selectedArticle.description,
                code: this.state.selectedArticle.code,
                tax: {
                    id: this.state.selectedArticle.tax
                },
                newPrice: {
                    date: format(this.state.selectedArticle.newPrice.date, 'yyyy-MM-dd'),
                    purchasePrice: this.state.selectedArticle.newPrice.purchasePrice,
                    salePrice: this.state.selectedArticle.newPrice.salePrice
                },
                categories: this.getCategoriesToSend()
            })
        })
            .then(res => res.json())
            .then(
                (response) => {
                    this.handleApiResponse(response, 'Creado con éxito!');
                },
                (error) => {
                    alert(error);
                }
            )
    }

    handleApiResponse(response, message) {
        if (ServiceHelper.isErrorResponse(response)) {
            this.setState({
                resultErrorMessage: response.message
            });
        } else {
            this.setState({
                data: this.state.data,
                selectedArticle: {
                    id: null,
                    code: null,
                    description: null,
                    tax: null,
                    newPrice: {
                        date: new Date(),
                        salePrice: null,
                        purchasePrice: null,
                    },
                    categories: []
                },
                isEdit: false,
                showForm: false,
                showFailedDialog: false,
                showSuccessDialog: true,
                resultDialogMessage: message,
                resultErrorMessage: null
            });
            this.getAll();
        }
    }

    handleCloseSuccessDialog() {
        this.setState({
            showSuccessDialog: false,

        });
    }

    handleCloseFailedDialog() {
        this.setState({
            showFailedDialog: false
        });
    }

    onClickEdit(article) {
        const categoriesIds = article.categories.map(c => {
            return c.id;
        })
        this.setState({
            data: this.state.data,
            selectedArticle: {
                id: article.id,
                code: article.code,
                description: article.description,
                tax: article.tax.id,
                newPrice: article.newPrice,
                categories: categoriesIds,
                prices: article.prices
            },
            isEdit: true,
            showForm: true
        })
    }

    updateArticle() {
        fetch(ServiceHelper.getArticlePath() + '/' + this.state.selectedArticle.id, {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify({
                description: this.state.selectedArticle.description,
                code: this.state.selectedArticle.code,
                tax: {
                    id: this.state.selectedArticle.tax
                },
                newPrice: {
                    date: format(this.state.selectedArticle.newPrice.date, 'yyyy-MM-dd'),
                    purchasePrice: this.state.selectedArticle.newPrice.purchasePrice,
                    salePrice: this.state.selectedArticle.newPrice.salePrice
                },
                categories: this.getCategoriesToSend()
            })
        })
            .then(res => res.json())
            .then(
                (response) => {
                    this.handleApiResponse(response, 'Actualizado con éxito!');
                },
                (error) => {
                    alert(error);
                }
            )
    }

    getCategoriesToSend() {
        const categoriesToSend = [];
        this.state.selectedArticle.categories.map((c) => {
            return categoriesToSend.push({
                id: c
            })
        });
        return categoriesToSend;
    }

    confirmDelete(article) {
        this.setState({
            selectedArticle: {
                id: article.id
            },
            showConfirmDeleteDialog: true,
            resultDialogMessage: 'Eliminar el producto con el codigo:  ' + article.code + ' ?'
        })
    }

    deleteArticle() {
        fetch(ServiceHelper.getHost() + "/lecheros/api/article/" + this.state.selectedArticle.id, {
            method: "DELETE",
            headers: authHeader()
        })
            .then(res => res)
            .then(
                (response) => {
                    this.handleDeleteResponse(response);
                },
                (error) => {
                    alert(error);
                }
            )
    }

    handleDeleteResponse(response) {
        if (ServiceHelper.isErrorResponse(response)) {
            let msg = response.message;
            if (response.status === 401 || response.status === 403) {
                msg = 'Error: Unauthorized';
            }
            this.setState({
                data: this.state.data,
                selectedArticle: {
                    id: null,
                    code: null,
                    description: null,
                    tax: null,
                    newPrice: {
                        date: new Date(),
                        salePrice: null,
                        purchasePrice: null,
                    },
                    categories: []
                },
                isEdit: false,
                showForm: false,
                showFailedDialog: true,
                showSuccessDialog: false,
                resultDialogMessage: msg
            })
        } else {
            this.setState({
                data: this.state.data,
                selectedArticle: {
                    id: null,
                    code: null,
                    description: null,
                    tax: null,
                    newPrice: {
                        date: new Date(),
                        salePrice: null,
                        purchasePrice: null,
                    },
                    categories: []
                },
                isEdit: false,
                showForm: false,
                showFailedDialog: false,
                showSuccessDialog: true,
                resultDialogMessage: 'Eliminado con Exito!'
            });
            this.getAll();
        }
    }

    onPressKeyInCodeFinder(event) {
        if (event.key === 'Enter') {
            fetch(ServiceHelper.getHost() + "/lecheros/api/article/" + event.target.value, {
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
                                const categoriesIds = response.categories.map(c => {
                                    return c.id;
                                })
                                this.setState({
                                    selectedArticle: {
                                        id: response.id,
                                        code: response.code,
                                        description: response.description,
                                        tax: response.tax.id,
                                        newPrice: response.newPrice,
                                        categories: categoriesIds,
                                        prices: response.prices
                                    },
                                    showForm: true,
                                    isEdit: true
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
    }

    handleCloseConfirmDeleteDialog() {
        this.setState({
            showConfirmDeleteDialog: false,

        });
    }

    handleDeleteConfirmDeleteDialog() {
        this.setState({
            showConfirmDeleteDialog: false,
        });
        this.deleteArticle()
    }

    handleFilterByCategoryCheckboxChange = (e) => {
        if (!e.target.checked) {
            this.setState({
                loading: e.target.checked,
                filterCategories: []
            });
            this.getAll();
        }
        this.setState({
            filterByCategory: e.target.checked,
        })
    }

    renderCategories() {
        const categoriesNames = this.state.filterCategories.map((c) => {
            return this.state.allCategories.find(x => x.id === c).name;
        });
        return categoriesNames.join(', ');
    }

    renderCategoryOptions() {

        if (this.state.allCategories != null) {
            return this.state.allCategories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={this.state.filterCategories.indexOf(c.id) > -1} color='primary'/>
                    <ListItemText primary={c.name}/>
                </MenuItem>
            ))
        }
    }

    onChangeFilterCategory(event) {
        this.setState({
            filterCategories: event.target.value,
            loading: true
        });
        this.filterByCategories(event.target.value);
    }

    filterByCategories(filterCategories) {
        fetch(ServiceHelper.getHost() + "/lecheros/api/articles/by/categories?categoriesIds=" + filterCategories.join(','), {
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
                                data: response,
                                showFailedDialog: this.state.showFailedDialog,
                                showSuccessDialog: this.state.showSuccessDialog,
                                loading: false
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

    render() {
        const {classes} = this.props;
        const columns = [
            {label: "Codigo", name: "code"},
            {label: "Descripcion", name: "description"},
            {
                name: "Precio de Venta",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['currentPrice']['salePrice']}
                            </div>
                        );
                    }
                }
            },
            {
                name: "Precio de Compra",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['currentPrice']['purchasePrice']}
                            </div>
                        );
                    }
                }
            },
            {
                name: "Iva",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['tax']['name']}
                            </div>
                        );
                    }
                }
            },
            {
                name: "Acciones",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {this.state.isAdmin ?
                                    <div>
                                        <IconButton
                                            onClick={() => this.onClickEdit(tableMeta.tableData[tableMeta.rowIndex])}
                                            variant="contained"
                                            color="primary"
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        &nbsp;
                                        <IconButton
                                            onClick={() => this.confirmDelete(tableMeta.tableData[tableMeta.rowIndex])}
                                            variant="contained"
                                            color="primary"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </div>
                                    : ''}
                            </div>
                        );
                    },
                    print: false
                }
            }
        ]
        const options = {
            filter: true,
            filterType: "textField",
            selectableRows: 'none',
            textLabels: {
                body: {
                    noMatch: 'No hay Documentos'
                },
                pagination: {
                    next: "Proxima Pagina",
                    previous: "Pagina Anterior",
                    rowsPerPage: "Filas por pagina:",
                    displayRows: "of",
                },
                toolbar: {
                    search: "Buscar",
                    downloadCsv: "Descargar",
                    print: "Imprimir",
                    viewColumns: "Ver Columnas",
                    filterTable: "Filtrar",
                },
                filter: {
                    all: "Todos",
                    title: "Filtros",
                    reset: "Reiniciar",
                },
            }
        }
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
                {this.state.loading ? <div className={classes.loading}> <CircularProgress size={250} />  </div> : <div>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="codeFinder"
                        label="Codigo"
                        type="text"
                        style={{width: '25%'}}
                        onKeyPress={this.onPressKeyInCodeFinder}
                    />
                    <div className={classes.drawerHeader}/>
                        <Typography display="inline" paragraph className={classes.divider}>
                        Buscar por Categoria:
                    </Typography>
                    <Checkbox
                        checked={this.state.filterByCategory}
                        onChange={this.handleFilterByCategoryCheckboxChange}
                        name="checkedFC"
                        color="primary"
                    />

                    {this.state.filterByCategory ?
                        <Select className={classes.textField} style={{width: '50%'}} value={this.state.filterCategories}
                                multiple onChange={this.onChangeFilterCategory} input={<Input/>}
                                MenuProps={MenuProps} renderValue={this.renderCategories}
                        >
                            {this.renderCategoryOptions()}
                        </Select>
                     : ''}
                    {this.state.isAdmin ?
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<AddIcon/>}
                            style={{float: 'right'}}
                            onClick={this.clickNew}
                        >
                            Nuevo
                        </Button> : ''}
                    <div className={classes.drawerHeader}/>
                    <MUIDataTable
                        title={"Articulos"}
                        data={this.state.data}
                        columns={columns}
                        options={options}

                    />
                    {this.state.showForm ?
                        <div>
                            <ArticleForm open={this.state.showForm} handleClose={this.handleClose}
                                         handleSave={this.handleSave}
                                         onChangeCode={this.onChangeCode} onChangeDescription={this.onChangeDescription}
                                         tax={this.state.selectedArticle.tax}
                                         onChangeTax={this.onChangeTax}
                                         priceDate={this.state.selectedArticle.newPrice != null ? this.state.selectedArticle.newPrice.date : new Date()}
                                         onChangeDate={this.onChangeDate}
                                         onChangePurchasePrice={this.onChangePurchasePrice}
                                         onChangeSalePrice={this.onChangeSalePrice}
                                         message={this.state.resultErrorMessage}
                                         onChangeCategory={this.onChangeCategory}
                                         categories={this.state.selectedArticle.categories}
                                         allCategories={this.state.allCategories} code={this.state.selectedArticle.code}
                                         description={this.state.selectedArticle.description}
                                         isEdit={this.state.isEdit} prices={this.state.selectedArticle.prices}/>
                        </div> : ''
                    }
                    {this.state.showSuccessDialog ?
                        <div>
                            <SuccessDialog showSuccessDialog={this.state.showSuccessDialog}
                                           handleCloseSuccessDialog={this.handleCloseSuccessDialog}
                                           resultDialogMessage={this.state.resultDialogMessage} title='Articulo'/>
                        </div> : ''
                    }
                    {this.state.showFailedDialog ?
                        <div>
                            <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                          handleCloseFailedDialog={this.handleCloseFailedDialog}
                                          resultDialogMessage={this.state.resultDialogMessage} title='Articulo'/>
                        </div> : ''
                    }
                    {this.state.showConfirmDeleteDialog ?
                        <div>
                            <ConfirmDeleteDialog showConfirmDeleteDialog={this.state.showConfirmDeleteDialog}
                                                 handleDeleteConfirmDeleteDialog={this.handleDeleteConfirmDeleteDialog}
                                                 handleCloseConfirmDeleteDialog={this.handleCloseConfirmDeleteDialog}
                                                 resultDialogMessage={this.state.resultDialogMessage} title='Eliminar'/>
                        </div> : ''
                    }
                </div>
                }
            </div>
        );
    }
}

export default withStyles(useStyles)(Articles);
