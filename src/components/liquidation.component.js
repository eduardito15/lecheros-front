import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeliveryService from "../services/delivery.service";
import DriverService from "../services/driver.service";
import LiquidationService from "../services/liquidation.service";
import ServiceHelper from "../services/service.helper";
import { MuiPickersUtilsProvider} from "@material-ui/pickers";
import { DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FailedDialog from "./faileddialog";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import ViewLiquidationDocumentsComponent from "./forms/view-liquidation-documents.component";
import DocumentForm from "./forms/document.form";
import { InputLabel } from "@material-ui/core";

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
    textField: {
        margin: theme.spacing(1),
    },
    title: {
        fontWeight: 'bold',
        margin: theme.spacing(2)
    },
});

class LiquidationComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showFailedDialog: false,
            resultDialogMessage: null,
            deliveries: [],
            date: new Date(),
            selectedDelivery: {
                id: null
            },
            drivers: [],
            selectedDriver: {
                id: null
            },
            liquidation: {
                id: null,
                previousBalance: 0,
                purchases: 0,
                utility: 0,
                referMilk: 0,
                debt: 0,
                inventory: 0,
                companyTrust: 0,
                difference: 0
            },
            cash: 0,
            diffCorrection: 0,
            showLiquidationDocumentsForm: false,
            liquidationPurchases: [],
            showLiquidationInventory: false,
            liquidationInventory: {
                rows: [],
                subTotal: 0,
                totalMinimTax: 0,
                totalBasicTax: 0,
                total: 0
            },
            showLiquidationSaleDocumentsForm: false,
            liquidationSales: [],
        }

        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeDelivery = this.onChangeDelivery.bind(this);
        this.onChangeDriver = this.onChangeDriver.bind(this);
        this.handleCloseFailedDialog = this.handleCloseFailedDialog.bind(this);
        this.onChangeCash = this.onChangeCash.bind(this);
        this.onChangeDiffCorrection = this.onChangeDiffCorrection.bind(this);
        this.onPressKeyInDifferenceCorrection = this.onPressKeyInDifferenceCorrection.bind(this);
        this.clickViewPurchasesDetail = this.clickViewPurchasesDetail.bind(this);
        this.clickViewInventoryDetail = this.clickViewInventoryDetail.bind(this);
        this.clickViewCompanyTrustDetail = this.clickViewCompanyTrustDetail.bind(this);
        this.closeLiquidation = this.closeLiquidation.bind(this);
        this.openLiquidation = this.openLiquidation.bind(this);
        this.closeLiquidationPurchasesForm = this.closeLiquidationPurchasesForm.bind(this);
        this.showLiquidationPurchasesForm = this.showLiquidationPurchasesForm.bind(this);
        this.closeLiquidationInventoryForm = this.closeLiquidationInventoryForm.bind(this);
        this.closeLiquidationSalesForm = this.closeLiquidationSalesForm.bind(this);
        this.callLiquidate = this.callLiquidate.bind(this);
    }

    componentDidMount() {
        this.getAllDeliveries();
        this.getAllDrivers();
    }

    getAllDeliveries() {
        DeliveryService.getDeliveries()
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            deliveries: response.data,
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
                loading: false,
                showFailedDialog: true,
                resultDialogMessage: message
            });
        }
    }

    getAllDrivers() {
        DriverService.getDrivers()
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            drivers: response.data,
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

    renderDeliveryOptions() {
        if (this.state.deliveries != null) {
            return this.state.deliveries.map((delivery) => {
                return (
                    <MenuItem
                        label="Reparto"
                        value={delivery.id}
                        key={delivery.id} name={delivery.name}
                    >{delivery.code} - {delivery.name}</MenuItem>
                );
            });
        }
    }

    onChangeDate(date) {
        this.cleanForm();
        this.setState({
            date: date
        })
    }

    onChangeDelivery(event) {
        this.cleanForm();
        const selectedDelivery = this.state.deliveries.find(d => {
            return d.id === event.target.value;
        });
        this.setState({
            selectedDelivery: selectedDelivery
        });
    }

    renderDriverOptions() {
        if (this.state.drivers != null) {
            return this.state.drivers.map((delivery) => {
                return (
                    <MenuItem
                        label="Chofer"
                        value={delivery.id}
                        key={delivery.id} name={delivery.name}
                    >{delivery.code} - {delivery.name}</MenuItem>
                );
            });
        }
    }

    onChangeDriver(event) {
        console.log('on change driver')
        console.log(this.state.drivers)
        console.log(event.target.value)
        const selectedDriver = this.state.drivers.find(d => {
            return d.id === event.target.value;
        });
        this.setState({
            selectedDriver: selectedDriver
        });
        //this.liquidate(this.state.date, this.state.selectedDelivery, selectedDriver, 0, 0);
    }

    callLiquidate() {
        if (this.state.selectedDelivery.id != null) {
            this.liquidate(this.state.date, this.state.selectedDelivery, this.state.selectedDriver, 0, 0);
        }
    }

    handleCloseFailedDialog() {
        this.setState({
            showFailedDialog: false
        });
    }

    onPressKeyInDate(event) {
        if (event.key === 'Enter') {
            document.getElementById("delivery_select").focus();
        }
    }

    onPressKeyInDelivery(event) {
        if (event.key === 'Enter') {
            document.getElementById("driver_select").focus();
        }
    }

    onPressKeyInDriver(event) {
        if (event.key === 'Enter') {
            document.getElementById("cash").focus();
        }
    }

    onPressKeyInCash(event) {
        if (event.key === 'Enter') {
            document.getElementById("difference_correction").focus();
        }
    }

    onPressKeyInDifferenceCorrection(event) {
        if (event.key === 'Enter') {
            document.getElementById("date_picker").focus();
            //Send to api
            this.liquidate(this.state.date, this.state.selectedDelivery, this.state.selectedDriver, this.state.cash, event.target.value);
        }
    }

    liquidate(date, delivery, driver, cash, diffCorrection) {
        LiquidationService.liquidate(this.state.liquidation.id, date, delivery, driver, cash, diffCorrection)
            .then(
                (response) => {
                    if (response != null) {
                        this.setState({
                            liquidation: response.data,
                            cash: response.data.cashDelivery,
                            diffCorrection: response.data.differenceCorrection,
                        });
                        if (response.data.selectedDelivery != null) {
                            this.setState({
                                selectedDriver: response.data.driver
                            });
                        } 
                    } else {
                        this.manageRequestErrors('No hay respuesta del servidor.');
                    }
                },
                (error) => {
                    this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                }
            )
    }

    onChangeCash(event) {
        this.setState({
            cash: event.target.value,
        })
    }

    onChangeDiffCorrection(event) {
        this.setState({
            diffCorrection: event.target.value,
        })
    }

    clickViewPurchasesDetail() {
        if (this.weAreInLiquidation() ) {
            LiquidationService.liquidationPurchases(this.state.liquidation.id, this.state.date, this.state.selectedDelivery, this.state.selectedDriver)
                .then(
                    (response) => {
                        if (response != null) {
                            this.setState({
                                liquidationPurchases: response.data,
                            });
                        } else {
                            this.manageRequestErrors('No hay respuesta del servidor.');
                        }
                    },
                    (error) => {
                        this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                    }
                )
            this.setState({
                showLiquidationDocumentsForm: true,
            });
        }
    }

    clickViewInventoryDetail() {
        if (this.weAreInLiquidation()) {
            LiquidationService.liquidationInventory(this.state.liquidation.id, this.state.date, this.state.selectedDelivery, this.state.selectedDriver)
                .then(
                    (response) => {
                        if (response != null) {
                            console.log(response);
                            this.setState({
                                liquidationInventory: response.data,
                            });
                        } else {
                            this.manageRequestErrors('No hay respuesta del servidor.');
                        }
                    },
                    (error) => {
                        this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                    }
                )
            this.setState({
                showLiquidationInventory: true,
            });
        }
    }

    clickViewCompanyTrustDetail() {
        if (this.weAreInLiquidation() ) {
            LiquidationService.liquidationSales(this.state.liquidation.id, this.state.date, this.state.selectedDelivery, this.state.selectedDriver)
                .then(
                    (response) => {
                        if (response != null) {
                            this.setState({
                                liquidationSales: response.data,
                            });
                        } else {
                            this.manageRequestErrors('No hay respuesta del servidor.');
                        }
                    },
                    (error) => {
                        this.manageRequestErrors(ServiceHelper.getErrorMessage(error));
                    }
                )
            this.setState({
                showLiquidationSaleDocumentsForm: true,
            });
        }
    }

    closeLiquidation() {
        this.weAreInLiquidation();
    }

    openLiquidation() {
        this.weAreInLiquidation();
    }

    weAreInLiquidation() {
        if (this.state.liquidation.id == null) {
            this.setState({
                loading: false,
                showFailedDialog: true,
                resultDialogMessage: 'Primero hay que estar en una liquidación'
            });
            return false;
        }
        return true;
    }

    showLiquidationPurchasesForm() {
        this.setState( {
            showLiquidationDocumentsForm: true
        });
    }

    closeLiquidationPurchasesForm() {
        this.setState( {
            showLiquidationDocumentsForm: false
        });
    }

    showLiquidationInventoryForm() {
        this.setState( {
            showLiquidationInventory: true
        });
    }

    closeLiquidationInventoryForm() {
        this.setState( {
            showLiquidationInventory: false
        });
    }

    closeLiquidationSalesForm() {
        this.setState( {
            showLiquidationSaleDocumentsForm: false
        });
    }

    handleCashFocus(event) {
        event.target.select();
    }

    handleDifferenceCorrectionFocus(event) {
        event.target.select();
    }

    cleanForm() {
        this.setState({
            showFailedDialog: false,
            resultDialogMessage: null,
            selectedDelivery: {
                id: null
            },
            selectedDriver: {
                id: null
            },
            liquidation: {
                id: null,
                previousBalance: 0,
                purchases: 0,
                utility: 0,
                referMilk: 0,
                debt: 0,
                inventory: 0,
                companyTrust: 0,
                difference: 0
            },
            cash: 0,
            diffCorrection: 0,
            showLiquidationDocumentsForm: false,
            liquidationPurchases: [],
            showLiquidationInventory: false,
            liquidationInventory: {
                rows: [],
                subTotal: 0,
                totalMinimTax: 0,
                totalBasicTax: 0,
                total: 0
            },
            showLiquidationSaleDocumentsForm: false,
            liquidationSales: [],
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <div>
                <Typography variant='h6' className={classes.title}>
                    Liquidación
                </Typography>
                <div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        id="date_picker"
                        label="Fecha"
                        value={this.state.date}
                        onChange={date => this.onChangeDate(date)}
                        style={{width: '40%'}}
                        animateYearScrolling
                        format="dd/MM/yyyy"
                        onKeyPress={this.onPressKeyInDate}
                    />
                    </MuiPickersUtilsProvider>
                    
                    {this.state.liquidation.closed ? <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{width: '25%'}}
                        onClick={this.openLiquidation}
                    >
                        Abrir
                    </Button> : ''}
                    {/*{!this.state.liquidation.closed ? <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{width: '25%'}}
                        onClick={this.closeLiquidation}
                    >
                        Cerrar
                    </Button> : ''}*/}
                </div>
                <div>
                    <TextField
                        id="delivery_select"
                        select
                        label="Reparto"
                        value={this.state.selectedDelivery.id}
                        onChange={this.onChangeDelivery}
                        style={{width: '40%'}}
                        onKeyDown={this.onPressKeyInDelivery}
                    >
                        {this.renderDeliveryOptions()}
                    </TextField>
                </div>
                <div>
                    <InputLabel className={classes.drawerHeader}>Chofer</InputLabel>
                    <TextField
                        id="driver_select"
                        select
                        value={this.state.selectedDriver.id}
                        onChange={this.onChangeDriver}
                        style={{width: '40%'}}
                        onKeyDown={this.onPressKeyInDriver}
                        onFocus={this.callLiquidate}
                    >
                        {this.renderDriverOptions()}
                    </TextField>
                </div>
                <div>
                    <TextField
                        id="previos_babance"
                        text
                        label="Saldo Anterior"
                        style={{width: '40%'}}
                        value={this.state.liquidation.previousBalance}
                    >
                    </TextField>
                </div>

                <div>
                    <TextField
                        id="purchases"
                        text
                        label="Compras"
                        style={{width: '40%'}}
                        value={this.state.liquidation.purchases}
                    >
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{width: '25%'}}
                        onClick={this.clickViewPurchasesDetail}
                    >
                        Ver Compras
                    </Button>
                </div>

                <div>
                    <TextField
                        id="utility"
                        text
                        label="Utilidad"
                        style={{width: '40%'}}
                        value={this.state.liquidation.utility}
                    >
                    </TextField>
                </div>

                <div>
                    <TextField
                        id="refer_milk"
                        text
                        label="Remito Pinchadas"
                        style={{width: '40%'}}
                        value={this.state.liquidation.referMilk}
                    >
                    </TextField>
                </div>

                <div>
                    <TextField
                        id="cash"
                        number
                        label="Entrega Efectivo"
                        style={{width: '40%'}}
                        value={this.state.cash}
                        onKeyPress={this.onPressKeyInCash}
                        onChange={this.onChangeCash}
                        onFocus={this.handleCashFocus}
                    >
                    </TextField>
                </div>

                <div>
                    <TextField
                        id="difference_correction"
                        number
                        label="Corrección de Diferencia"
                        style={{width: '40%'}}
                        value={this.state.diffCorrection}
                        onKeyPress={this.onPressKeyInDifferenceCorrection}
                        onChange={this.onChangeDiffCorrection}
                        onFocus={this.handleDifferenceCorrectionFocus}
                    >
                    </TextField>
                </div>

                <div>
                    <TextField
                        id="debt"
                        text
                        label="Deuda"
                        style={{width: '40%'}}
                        value={this.state.liquidation.debt}
                    >
                    </TextField>
                </div>

                <div>
                    <TextField
                        id="inventory"
                        text
                        label="Inventario"
                        style={{width: '40%'}}
                        value={this.state.liquidation.inventory}
                    >
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{width: '25%'}}
                        onClick={this.clickViewInventoryDetail}
                    >
                        Ver Inventario
                    </Button>
                </div>

                <div>
                    <TextField
                        id="company_trust"
                        text
                        label="Fiado Empresa"
                        style={{width: '40%'}}
                        value={this.state.liquidation.companyTrust}
                    >
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{width: '25%'}}
                        onClick={this.clickViewCompanyTrustDetail}
                    >
                        Ver Fiado Empresa
                    </Button>
                </div>

                <div>
                    <TextField
                        id="difference"
                        text
                        label="Diferencia"
                        style={{width: '40%'}}
                        value={this.state.liquidation.difference}
                    >
                    </TextField>
                </div>

                {this.state.showFailedDialog ?
                    <div>
                        <FailedDialog showFailedDialog={this.state.showFailedDialog}
                                      handleCloseFailedDialog={this.handleCloseFailedDialog}
                                      resultDialogMessage={this.state.resultDialogMessage} title='Liquidación'/>
                    </div> : ''
                }
                {this.state.showLiquidationDocumentsForm ?
                    <div>
                        <ViewLiquidationDocumentsComponent open={this.state.showLiquidationDocumentsForm}
                                      handleClose={this.closeLiquidationPurchasesForm}
                                      data={this.state.liquidationPurchases} title='Compras'
                                                           dialogTitle={'Compras de Liquidación'}/>
                    </div> : ''
                }
                {this.state.showLiquidationInventory ?
                    <div>
                        <DocumentForm open={this.state.showLiquidationInventory} handleClose={this.closeLiquidationInventoryForm}
                                      title={'Inventario'}
                                      date={this.state.date}
                                      deliveries={this.state.deliveries}
                                      delivery={this.state.selectedDelivery.id}
                                      message={this.state.errorMessage}
                                      rows={this.state.liquidationInventory.rows}
                                      subTotal={this.state.liquidationInventory.subTotal}
                                      minTaxes={this.state.liquidationInventory.totalMinimTax}
                                      basicTaxes={this.state.liquidationInventory.totalBasicTax}
                                      total={this.state.liquidationInventory.total}
                                      number={this.state.liquidationInventory.number}
                                      isViewMode={true}
                                      selectedDocument={this.state.liquidationInventory}
                                      isInventory={true}
                                      isSale={false}
                        />
                    </div> : ''
                }
                {this.state.showLiquidationSaleDocumentsForm ?
                    <div>
                        <ViewLiquidationDocumentsComponent open={this.state.showLiquidationSaleDocumentsForm}
                                                           handleClose={this.closeLiquidationSalesForm}
                                                           data={this.state.liquidationSales} title='Ventas'
                                                           dialogTitle={'Fiado que cobra la Empresa'}/>
                    </div> : ''
                }
            </div>
        )
    }
}

export default withStyles(useStyles)(LiquidationComponent);
