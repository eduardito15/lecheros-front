import './App.css';
import React from 'react'
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import BuildIcon from '@material-ui/icons/Build';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import {makeStyles, useTheme, createStyles} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import {Route, Switch} from "react-router-dom";
import {useHistory} from 'react-router-dom';

import Home from "./components/home";
import Taxes from "./components/entities/taxes";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import Login from "./components/login.component";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import HomeIcon from "@material-ui/icons/Home"
import Articles from "./components/entities/articles";
import UploadPrices from "./components/upload-prices.component";
import Documents from "./components/document";
import LocalShippingIcon from "@material-ui/icons/LocalShipping"
import AssignmentIcon from "@material-ui/icons/Assignment"
import AssessmentIcon from "@material-ui/icons/Assessment"
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"
import DocumentsInventory from "./components/document-inventory";
import Clients from "./components/entities/clients";
import DocumentSales from "./components/document-sales";
import UploadSales from "./components/upload-sales.component";
import LiquidationComponent from "./components/liquidation.component";
import Drivers from "./components/entities/driver";
import Commissions from "./components/entities/commission";
import ContainerControlComponent from "./components/reports/container-control.js"
import ContainerControlByCompanyComponent from "./components/reports/container-control-by-company.js"
import PackagingSummaryComponent from "./components/reports/packaging-summary"
import CommissionComponent from "./components/reports/commission-report"
import PurchasesRefundsComponent from "./components/reports/purchases-refunds"
import PurchasesByCompanyComponent from "./components/reports/purchases-by-company"
import TaxesByCompanyComponent from "./components/reports/taxes-by-company"
import SalesByClientComponent from "./components/reports/sales-by-client"

const drawerWidth = 280;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        userInfo: {
            marginLeft: theme.spacing(2)
        }
    }),
);


function App() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openMaintenanceSubMenu, setOpenMaintenanceSubMenu] = React.useState(false);
    const history = useHistory()
    const [openLoginForm, setOpenLoginForm] = React.useState(true);
    const [user, setUser] = React.useState();
    const [openSalesSubMenu, setOpenSalesSubMenu] = React.useState(false);
    const [openReportsSubMenu, setOpenReportsSubMenu] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleHome = () => {
        history.push("/home");
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    /*const handleTaxesClick = () => {
        history.push("/taxes");
    };*/

    const handleArticlesClick = () => {
        history.push("/articles");
    };

    const handlePricesClick = () => {
        history.push("/articles/prices");
    };

    const handleClientsClick = () => {
        history.push("/clients");
    };

    const handlePromotionsClick = () => {
        history.push("/promotions");
    };

    const handleCommissionsClick = () => {
        history.push("/commissions");
    };

    const handleDriversClick = () => {
        history.push("/drivers");
    };

    const handleClickMaintenanceSubMenu = () => {
        setOpenMaintenanceSubMenu(!openMaintenanceSubMenu);
    };

    const handlePurchasesClick = () => {
        history.push("/purchases");
    };

    const handleInventoriesClick = () => {
        history.push("/inventories");
    };

    const handleLiquidationsClick = () => {
        history.push("/liquidations");
    };

    const handleReportsClick = () => {
        history.push("/reports");
    };

    const redirectToLogin = () => {
        setOpenLoginForm(true);
        history.push("/")
    };

    const handleLoginFormStatus = (loginStatus, user) => {
        setOpenLoginForm(!loginStatus);
        if (loginStatus) {
            setUser(user);
        }
        history.push("/home");
    };

    const logout = () => {
        localStorage.removeItem("user");
        setOpenLoginForm(true);
        setUser(null);
        history.push("/");
    }

    window.onload = function () {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
    };

    const handleClickSalesSubMenu = () => {
        setOpenSalesSubMenu(!openSalesSubMenu);
    };

    const handleClickReportsSubMenu = () => {
        setOpenReportsSubMenu(!openReportsSubMenu);
    };

    const handleSalesClick = () => {
        history.push("/sales");
    }

    const handleUploadSalesClick = () => {
        history.push("/sales/upload");
    }

    const handleContainerControlReportClick = () => {
        history.push("/reports/container/control");
    }

    const handleContainerControlByCompanyReportClick = () => {
        history.push("/reports/container/control/by/company");
    }

    const handlePackagingSummaryReportClick = () => {
        history.push("/reports/packaging/summary");
    }

    const handleCommissionReportClick = () => {
        history.push("/reports/commision");
    }

    const handlePurchasesRefundsReportClick = () => {
        history.push("/reports/purchases/refunds");
    }

    const handlePurchasesByCompanyReportClick = () => {
        history.push("/reports/purchases/by/company");
    }

    const handleTaxesByCompanyReportClick = () => {
        history.push("/reports/taxes/by/company");
    }

    const handleSalesByClientReportClick = () => {
        history.push("/reports/sales/by/client");
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <head>
            </head>
            <div>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar color="primary">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="home"
                            onClick={handleHome}
                            edge="start"
                            className={clsx(classes.menuButton, open)}
                        >
                            <HomeIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Lecheros Web
                        </Typography>

                        <div className={classes.userInfo}>
                            <Typography variant="h8" >
                                {user != null ? 'Usuario: ' + user.username : ''}
                            </Typography>
                            {user != null ?
                                <Button onClick={logout} style={{color: '#FFFFFF'}}>
                                    <ExitToAppIcon/>
                                    Salir
                                </Button> : ''
                            }
                        </div>
                    </Toolbar>


                </AppBar>
            </div>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>

                    <ListItem button key="maintenance" onClick={() => handleClickMaintenanceSubMenu()}>
                        <ListItemIcon> <BuildIcon/> </ListItemIcon>
                        <ListItemText primary="Mantenimiento"/>
                        {openMaintenanceSubMenu ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={openMaintenanceSubMenu} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button key="maintenance-articles" onClick={() => handleArticlesClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Articulos"/>
                            </ListItem>
                            <ListItem button key="maintenance-prices" onClick={() => handlePricesClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Precios"/>
                            </ListItem>
                            <ListItem button key="maintenance-clients" onClick={() => handleClientsClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Clientes"/>
                            </ListItem>
                            <ListItem button key="maintenance-commissions" onClick={() => handleCommissionsClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Comisiones"/>
                            </ListItem>
                            <ListItem button key="maintenance-drivers" onClick={() => handleDriversClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Choferes"/>
                            </ListItem>
                            {/*<ListItem button key="maintenance-tax" onClick={() => handleTaxesClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Ivas"/>
                            </ListItem>*/}
                        </List>
                    </Collapse>
                    <ListItem button key="purchases" onClick={handlePurchasesClick}>
                        <ListItemIcon> <AddShoppingCartIcon/> </ListItemIcon>
                        <ListItemText primary="Compras"/>
                    </ListItem>
                    <ListItem button key="inventory" onClick={handleInventoriesClick}>
                        <ListItemIcon> <AssignmentIcon/> </ListItemIcon>
                        <ListItemText primary="Inventarios"/>
                    </ListItem>
                    <ListItem button key="sales" onClick={handleClickSalesSubMenu}>
                        <ListItemIcon> <LocalShippingIcon/> </ListItemIcon>
                        <ListItemText primary="Facturas"/>
                        {openSalesSubMenu ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={openSalesSubMenu} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button key="sales-home" onClick={() => handleSalesClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Facturas"/>
                            </ListItem>
                            <ListItem button key="sale-upload" onClick={() => handleUploadSalesClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Cargar desde Archivo"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button key="liquidations" onClick={handleLiquidationsClick}>
                        <ListItemIcon> <AttachMoneyIcon/> </ListItemIcon>
                        <ListItemText primary="Liquidaciones"/>
                    </ListItem>
                    <ListItem button key="informs" onClick={handleClickReportsSubMenu}>
                        <ListItemIcon> <AssessmentIcon/> </ListItemIcon>
                        <ListItemText primary="Informes"/>
                        {openReportsSubMenu ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={openReportsSubMenu} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button key="cc-report" onClick={() => handleContainerControlReportClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Control de Envases"/>
                            </ListItem>
                            <ListItem button key="cc-report" onClick={() => handleContainerControlByCompanyReportClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Control de Envases por Empresa"/>
                            </ListItem>
                            <ListItem button key="cc-report" onClick={() => handlePackagingSummaryReportClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Resumen de Envases"/>
                            </ListItem>
                            <ListItem button key="cc-report" onClick={() => handleCommissionReportClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Comision"/>
                            </ListItem>
                            <ListItem button key="cc-report" onClick={() => handlePurchasesRefundsReportClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Analisis Compras/Devoluciones"/>
                            </ListItem>
                            <ListItem button key="cc-report" onClick={() => handlePurchasesByCompanyReportClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Compras por Empresa"/>
                            </ListItem>
                            <ListItem button key="cc-report" onClick={() => handleTaxesByCompanyReportClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Analisis Iva"/>
                            </ListItem>
                            <ListItem button key="cc-report" onClick={() => handleSalesByClientReportClick()}
                                      className={classes.nested}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Resumen de Compras por Cliente"/>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
                <Divider/>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <Switch>
                    <Route path="/taxes">
                        <div className={classes.drawerHeader}/>
                        <Taxes redirectToLogin={redirectToLogin}/>
                    </Route>
                    <Route path="/home">
                        <Home/>
                    </Route>
                    <Route path="/purchases">
                        <div className={classes.drawerHeader}/>
                        <Documents title={"Compras"} type={"purchases"} documentType={"PURCHASE"}
                                   redirectToLogin={redirectToLogin} isInventory={false} handleDrawerOpen={handleDrawerOpen}
                                   isSale={false}
                        />
                    </Route>
                    <Route path="/inventories">
                        <div className={classes.drawerHeader}/>
                        <DocumentsInventory title={"Inventarios"} type={"inventories"} documentType={"INVENTORY"}
                                   redirectToLogin={redirectToLogin} isInventory={true} handleDrawerOpen={handleDrawerOpen}
                                            IsSale={false}
                        />
                    </Route>
                    <Route path="/sales/upload">
                        <div className={classes.drawerHeader}/>
                        <UploadSales>

                        </UploadSales>
                    </Route>
                    <Route path="/sales">
                        <div className={classes.drawerHeader}/>
                        <DocumentSales title={"Ventas"} type={"sales"} documentType={"SALE"}
                                            redirectToLogin={redirectToLogin} isInventory={false} handleDrawerOpen={handleDrawerOpen}
                                       isSale={true}
                        />
                    </Route>
                    <Route path="/clients">
                        <div className={classes.drawerHeader}/>
                        <Clients redirectToLogin={redirectToLogin}/>
                    </Route>
                    <Route path="/drivers">
                        <div className={classes.drawerHeader}/>
                        <Drivers redirectToLogin={redirectToLogin}/>
                    </Route>
                    <Route path="/commissions">
                        <div className={classes.drawerHeader}/>
                        <Commissions redirectToLogin={redirectToLogin}/>
                    </Route>
                    <Route path="/articles/prices">
                        <div className={classes.drawerHeader}/>
                        <UploadPrices redirectToLogin={redirectToLogin}/>
                    </Route>
                    <Route path="/articles">
                        <div className={classes.drawerHeader}/>
                        <Articles redirectToLogin={redirectToLogin}/>
                    </Route>
                    <Route path="/liquidations">
                        <div className={classes.drawerHeader}/>
                        <LiquidationComponent redirectToLogin={redirectToLogin}>

                        </LiquidationComponent>
                    </Route>
                    <Route path="/reports/container/control/by/company">
                        <div className={classes.drawerHeader}/>
                        <ContainerControlByCompanyComponent redirectToLogin={redirectToLogin}>

                        </ContainerControlByCompanyComponent>
                    </Route>
                    <Route path="/reports/container/control">
                        <div className={classes.drawerHeader}/>
                        <ContainerControlComponent redirectToLogin={redirectToLogin}>

                        </ContainerControlComponent>
                    </Route>
                    <Route path="/reports/packaging/summary">
                        <div className={classes.drawerHeader}/>
                        <PackagingSummaryComponent redirectToLogin={redirectToLogin}>

                        </PackagingSummaryComponent>
                    </Route>
                    <Route path="/reports/commision">
                        <div className={classes.drawerHeader}/>
                        <CommissionComponent redirectToLogin={redirectToLogin}>

                        </CommissionComponent>
                    </Route>
                    <Route path="/reports/purchases/refunds">
                        <div className={classes.drawerHeader}/>
                        <PurchasesRefundsComponent redirectToLogin={redirectToLogin}>

                        </PurchasesRefundsComponent>
                    </Route>
                    <Route path="/reports/purchases/by/company">
                        <div className={classes.drawerHeader}/>
                        <PurchasesByCompanyComponent redirectToLogin={redirectToLogin}>

                        </PurchasesByCompanyComponent>
                    </Route>
                    <Route path="/reports/taxes/by/company">
                        <div className={classes.drawerHeader}/>
                        <TaxesByCompanyComponent redirectToLogin={redirectToLogin}>

                        </TaxesByCompanyComponent>
                    </Route>
                    <Route path="/reports/sales/by/client">
                        <div className={classes.drawerHeader}/>
                        <SalesByClientComponent redirectToLogin={redirectToLogin}>

                        </SalesByClientComponent>
                    </Route>
                    <Route path="/">
                        <Login openLoginForm={openLoginForm}
                               closeLogin={(loginStatus, user) => handleLoginFormStatus(loginStatus, user)}/>
                    </Route>
                </Switch>
            </main>
        </div>
    );
}

export default App;
