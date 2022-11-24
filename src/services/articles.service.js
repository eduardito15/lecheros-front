import axios from "axios";
import authHeader from "./auth-header";
import {format} from "date-fns";
import ServiceHelper from "./service.helper";

class ArticlesService {

    savePrices(fileName, date, fromRow, toRow) {
        return axios
            .post(ServiceHelper.getHost() + "/lecheros/api/article/prices/load", {
                fileName: fileName,
                date: format(date, 'yyyy-MM-dd'),
                fromRow: fromRow,
                toRow: toRow
            }, {
                headers : authHeader()
            });
    }

    getArticleByCode(code) {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/article/" + code, {
                headers : authHeader()
            });
    }


}

export default new ArticlesService();