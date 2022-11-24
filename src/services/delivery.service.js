import axios from "axios";
import authHeader from "./auth-header";
import ServiceHelper from "./service.helper";

class DeliveryService {

    getDeliveries() {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/deliveries", {
                headers : authHeader()
            });
    }
}

export default new DeliveryService();