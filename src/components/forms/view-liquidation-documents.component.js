import React from "react";
import {withStyles} from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";

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

class ViewLiquidationDocumentsComponent extends React.Component {
    render() {

        const options = {
            filterType: "textField",
            selectableRows: 'none',
            filter: false,
            search: false,
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
        const columns = [
            {
                name: "Tipo",
                options: {
                    display: !this.props.isInventory,
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['documentType']['name']}
                            </div>
                        );
                    }
                }
            },
            {label: "Numero", name: "number", options: {display: !this.props.isInventory}},
            {label: "Fecha", name: "date", options: {filter: false}},
            {
                name: "Reparto",
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta) => {
                        return (
                            <div>
                                {tableMeta.tableData[tableMeta.rowIndex]['delivery']['name']}
                            </div>
                        );
                    }
                }
            },
            {label: "SubTotal", name: "subTotal", options: {filter: false}},
            {label: "Iva Minimo", name: "totalMinimTax", options: {filter: false}},
            {label: "Iva Basico", name: "totalBasicTax", options: {filter: false}},
            {label: "Descuento", name: "discount", options: {filter: false, display: this.props.isSale}},
            {label: "Total", name: "total", options: {filter: false}},
        ]

        return (<div>
            <Dialog fullWidth open={this.props.open} onClose={this.props.handleClose}
                    aria-labelledby="form-dialog-title" maxWidth={'xl'}>
                <DialogTitle id="form-dialog-title">{this.props.dialogTitle}</DialogTitle>
                <DialogContent>
                    <MUIDataTable
                        title={this.props.title}
                        data={this.props.data}
                        columns={columns}
                        options={options}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>)
    }
}

export default withStyles(useStyles)(ViewLiquidationDocumentsComponent);