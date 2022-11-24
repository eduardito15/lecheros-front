import axios from "axios";
import ServiceHelper from "./service.helper";
import authHeader from "./auth-header";

class ClientService {

    getClients() {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/clients", {
                headers : authHeader()
            });
    }

    createClient(psCode, psBranch, deliveries, driverCollect, name, socialReason, rut, address, phone, email) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/client", {
                "driverCollect": driverCollect,
                "psCode": psCode,
                "psBranch": psBranch,
                "deliveries": deliveries,
                "name": name,
                "socialReason": socialReason,
                "rut": rut,
                "address": address,
                "phone": phone,
                "email": email,
            }, {
                headers : authHeader()
            });
    }

    updateClient(id, psCode, psBranch, deliveries, driverCollect, name, socialReason, rut, address, phone, email, active) {
        return axios
            .put(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/client/" + id, {
                "id": id,
                "driverCollect": driverCollect,
                "psCode": psCode,
                "psBranch": psBranch,
                "deliveries": deliveries,
                "name": name,
                "socialReason": socialReason,
                "rut": rut,
                "address": address,
                "phone": phone,
                "email": email,
                "active": active
            }, {
                headers : authHeader()
            });
    }

    deleteClientById(id) {
        return axios
            .delete(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/client/" + id, {
                headers : authHeader()
            });
    }

    getClientById(id) {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/client/" + id, {
                headers : authHeader()
            });
    }

    search(psCode, name, address, delivery) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/client/search", {
                "psCode": psCode,
                "name": name,
                "address": address,
                "delivery": {
                    "id": delivery
                }
            }, {
                headers : authHeader()
            });
    }
}

export default new ClientService();