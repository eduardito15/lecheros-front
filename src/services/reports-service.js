import axios from "axios";
import authHeader from "./auth-header";
import ServiceHelper from "./service.helper";

class ReportsService {

    getContainerControlReport(from, to, delivery) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/container/control", {
                from: from,
                to: to,
                delivery: delivery
            }, {
                headers: authHeader()
            });
    }

    getContainerControlByCompanyReport(from, to, delivery) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/container/control/by/company", {
                from: from,
                to: to,
                delivery: delivery
            }, {
                headers: authHeader()
            });
    }

    packagingSummary(from, to, company) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/packaging/summary", {
                from: from,
                to: to,
                company: company
            }, {
                headers: authHeader()
            });
    }

    commisionReport(from, to, driver) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/commission", {
                from: from,
                to: to,
                driver: driver
            }, {
                headers: authHeader()
            });
    }

    purchasesRefundsReport(from, to, delivery, fromArticle, toArticle) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/purchases/refunds", {
                from: from,
                to: to,
                delivery: delivery,
                fromArticle: fromArticle,
                toArticle: toArticle
            }, {
                headers: authHeader()
            });
    }
}

export default new ReportsService();