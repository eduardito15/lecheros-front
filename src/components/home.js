import Typography from "@material-ui/core/Typography";
import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import liquidationService from "../services/liquidation.service";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { format } from "date-fns";
import documentService from "../services/document.service";


const useStyles = makeStyles((theme) =>
    createStyles({
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        }
    }),
);

function Home() {
    const [liquidations, setLiquidations] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);


    const classes = useStyles();
    const options = {
        selectableRows: 'none',
        filter: false,
        search: false,
        download: false,
        export: false,
        print: false,
        viewColumns: false,
        pagination: false,
        textLabels: {
            body: {
                noMatch: 'No hay Datos'
            },
        }
    }

    useEffect(() => {
        liquidationService.dayLiquidations()
            .then(
                (response) => {
                    if (response != null) {
                        setLiquidations(response.data)
                    } else {
                    }
                },
                (error) => {
                }
            )
        documentService.getDayDocumentsResume('INVENTORY')
            .then(
                (response) => {
                    if (response != null) {
                        setInventories(response.data)
                    } else {
                    }
                },
                (error) => {
                }
            )
    }, []);

    const columns = [
        {
            name: "Reparto",
            options: {
                display: true,
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
        { label: "Diferencia", id: "difference", name: "difference", display: true }
    ]

    const inventoryColumns = [
        {
            name: "Reparto",
            options: {
                display: true,
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
        { label: "Total", id: "total", name: "total", display: true }
    ]

    const documentsColumns = [
        {
            name: "Reparto",
            options: {
                display: true,
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
        { label: "Cant. Docs", id: "quantity", name: "docsCount", display: true },
        { label: "Total", id: "total", name: "total", display: true }
    ]

    return (
        <div>

            <div className={classes.drawerHeader} />
            <Typography paragraph>
            </Typography>
            <Typography paragraph>

            </Typography>
            <div style={{position: 'relative', height: '100%', width: '100%'}}>
                <div style={{ height: '100%', width: '48%', float: 'left', top: '10%', paddingTop:'20px', left: 0}}>
                    <MUIDataTable
                        title={'Liquidaciones'}
                        data={liquidations}
                        columns={columns}
                        options={options}
                    />
                </div>
                <div style={{ height: '100%', width: '48%', float: 'right', top: '10%', paddingTop:'20px', right: 0}}>
                    <MUIDataTable
                        title={'Inventarios'}
                        data={inventories}
                        columns={inventoryColumns}
                        options={options}
                    />
                </div>
            </div>
            <div>
                <Typography paragraph>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Typography>
            </div>
            <div style={{position: 'relative', height: '100%', width: '100%'}}>
                <div style={{ height: '100%', width: '48%', float: 'left', top: '55%', paddingTop:'20px', left: 0 }}>
                    <MUIDataTable
                        title={'Compras'}
                        data={purchases}
                        columns={documentsColumns}
                        options={options}
                    />
                </div>
                <div style={{ height: '100%', width: '48%', float: 'right', top: '55%', paddingTop:'20px', right: 0 }}>
                    <MUIDataTable
                        title={'Ventas'}
                        data={sales}
                        columns={documentsColumns}
                        options={options}
                    />
                </div>
            </div>



        </div>
    );
}

export default Home;
