import axios from "axios";
import ServiceHelper from "./service.helper";
import authHeader from "./auth-header";
import {format} from "date-fns";

class LiquidationService {

    liquidate(id, date, delivery, driver, cash, diffCorrection) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/liquidation", {
                id: id,
                date: format(date, 'yyyy-MM-dd'),
                delivery: {
                    id: delivery.id
                },
                driver: {
                    id: driver.id
                },
                cashDelivery: cash,
                differenceCorrection: diffCorrection
            }, {
                headers : authHeader()
            });
    }

    liquidationPurchases(id, date, delivery, driver) {
        const url = ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/liquidation/purchases";
        return this.liquidationDocuments(url, id, date, delivery, driver)
    }

    liquidationSales(id, date, delivery, driver) {
        const url = ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/liquidation/sales";
        return this.liquidationDocuments(url, id, date, delivery, driver)
    }

    liquidationDocuments(url, id, date, delivery, driver) {
        return axios
            .post(url, {
                id: id,
                date: format(date, 'yyyy-MM-dd'),
                delivery: {
                    id: delivery.id
                },
                driver: {
                    id: driver.id
                },
            }, {
                headers : authHeader()
            });
    }

    liquidationInventory(id, date, delivery, driver) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/liquidation/inventory", {
                id: id,
                date: format(date, 'yyyy-MM-dd'),
                delivery: {
                    id: delivery.id
                },
                driver: {
                    id: driver.id
                },
            }, {
                headers : authHeader()
            });
    }

    updateStatus(id, closed) {
        return axios
            .patch(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/liquidation/status", {
                id: id,
                closed: closed
            }, {
                headers : authHeader()
            });
    }

    dayLiquidations() {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/liquidation/day", {
                headers : authHeader()
            });
    }


}

export default new LiquidationService();