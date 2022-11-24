import axios from "axios";
import ServiceHelper from "./service.helper";
import authHeader from "./auth-header";

class DriverService {

    getDrivers() {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/drivers", {
                headers : authHeader()
            });
    }

    createDriver(code, name, commission) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/driver", {
                "code": code,
                "name": name,
                "commission": {
                    "id": commission.id
                }
            }, {
                headers : authHeader()
            });
    }

    getDriverById(id) {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/driver/" + id, {
                headers : authHeader()
            });
    }

    deleteDriverById(id) {
        return axios
            .delete(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/driver/" + id, {
                headers : authHeader()
            });
    }

    updateDriver(id, code, name, commission) {
        return axios
            .put(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/driver/" + id, {
                "id": id,
                "code": code,
                "name": name,
                "commission": {
                    "id": commission.id
                }
            }, {
                headers : authHeader()
            });
    }
}

export default new DriverService();