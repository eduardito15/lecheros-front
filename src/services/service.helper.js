
//const HOST = 'http://localhost:8080'
const HOST = 'http://lecheros-api.evecino.net'

const LECHEROS_API_PATH = "/lecheros/api"
const TAX_PATH = HOST + LECHEROS_API_PATH +  '/tax'
const ARTICLE_PATH = HOST + LECHEROS_API_PATH + '/article'

class ServiceHelper {

    getHost() {
        return HOST;
    }

    getLecherosApiPath() {
        return LECHEROS_API_PATH;
    }

    isErrorResponse(response) {
        if ((response.status != null && response.status !== 200) ||
            (response.code != null && response.message != null && response.code !== 200)) {
            return  true;
        }
        return false;
    }

    getErrorMessage(error) {
        const resMessage =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return resMessage;
    }

    getTaxPath() {
        return TAX_PATH;
    }

    getArticlePath() {
        return ARTICLE_PATH;
    }

    isUnauthorizedError(message) {
        return 'Request failed with status code 401' === this.getErrorMessage(message) || 'Error: Unauthorized' === this.getErrorMessage(message);
    }

}

export default new ServiceHelper();