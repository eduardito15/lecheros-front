import axios from "axios";
import ServiceHelper from "./service.helper";
import authHeader from "./auth-header";

class CommissionService {

    getCommissions() {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/commissions", {
                headers : authHeader()
            });
    }

    createCommission(name, percentage, milkPercentage) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/commission", {
                "name": name,
                "percentage": percentage,
                "milkPercentage": milkPercentage,
            }, {
                headers : authHeader()
            });
    }

    getCommissionById(id) {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/commission/" + id, {
                headers : authHeader()
            });
    }

    deleteCommissionById(id) {
        return axios
            .delete(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/commission/" + id, {
                headers : authHeader()
            });
    }

    updateClient(id, name, percentage, milkPercentage) {
        return axios
            .put(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/commission/" + id, {
                "id": id,
                "name": name,
                "percentage": percentage,
                "milkPercentage": milkPercentage,
            }, {
                headers : authHeader()
            });
    }
}

export default new CommissionService();