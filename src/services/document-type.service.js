import axios from "axios";
import authHeader from "./auth-header";
import ServiceHelper from "./service.helper";

class DocumentTypeService {

    getDocumentTypesByType(type) {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/type/by/" + type, {
                headers : authHeader()
            });
    }

}

export default new DocumentTypeService();