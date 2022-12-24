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

    purchasesByCompany(from, to, delivery, company) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/purchases/by/company", {
                from: from,
                to: to,
                delivery: delivery,
                company: company
            }, {
                headers: authHeader()
            });
    }

    taxesByCompany(from, to, company) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/taxes/by/company", {
                from: from,
                to: to,
                company: company
            }, {
                headers: authHeader()
            });
    }

    salesByClient(from, to, client) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/sales/by/client", {
                from: from,
                to: to,
                client: {
                    id: client.id
                }
            }, {
                headers: authHeader()
            });
    }

    discountsByClient(from, to, client) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/report/discounts/by/client", {
                from: from,
                to: to,
                client: {
                    id: client.id
                }
            }, {
                headers: authHeader()
            });
    }
}

export default new ReportsService();