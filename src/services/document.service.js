import axios from "axios";
import ServiceHelper from "./service.helper";
import authHeader from "./auth-header";
import {format} from "date-fns";

class DocumentService {

    validDocumentTypeAndNumber(type, number) {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/validate/" + type.id + "/" + number, {
                headers : authHeader()
            });
    }

    createDocument(type, number, date, delivery, client) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document", {
                documentType: {
                    id: type.id,
                    type: type.type
                },
                number: number,
                date: format(date, 'yyyy-MM-dd'),
                delivery: {
                    id: delivery.id
                },
                settlementDate: format(date, 'yyyy-MM-dd')
            }, {
                headers : authHeader()
            });
    }

    addRow(number, type, date, delivery, articleId, quantity, client) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/row/add", {
                number: number,
                date: format(date, 'yyyy-MM-dd'),
                documentType: {
                    id: type.id,
                    type: type.type
                },
                delivery: {
                    id: delivery.id
                },
                client: client,
                rowToAdd: {
                    article: {
                        id: articleId
                    },
                    quantity: quantity
                },
                settlementDate: format(date, 'yyyy-MM-dd')
            }, {
                headers : authHeader()
            });
    }

    saveDocument(number, type) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/save", {
                number: number,
                documentType: {
                    id: type.id,
                    type: type.type
                }
            }, {
                headers : authHeader()
            });
    }

    updateDocument(number, type, date, delivery, client) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/update", {
                number: number,
                date: format(date, 'yyyy-MM-dd'),
                documentType: {
                    id: type.id,
                    type: type.type
                },
                delivery: {
                    id: delivery.id
                },
                client: client
            }, {
                headers : authHeader()
            });
    }

    cancelDocument(number, type) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/cancel", {
                number: number,
                documentType: {
                    id: type.id,
                    type: type.type
                }
            }, {
                headers : authHeader()
            });
    }

    getDocumentById(id) {
        return axios
            .get(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/" + id, {
                headers : authHeader()
            });
    }

    deleteDocumentById(id) {
        return axios
            .delete(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/" + id, {
                headers : authHeader()
            });
    }

    deleteRow(number, type, date, delivery, articleId, quantity) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/row/delete", {
                number: number,
                date: format(date, 'yyyy-MM-dd'),
                documentType: {
                    id: type.id,
                    type: type.type
                },
                delivery: {
                    id: delivery.id
                },
                rowToDelete: {
                    article: {
                        id: articleId
                    },
                    quantity: quantity
                },
                settlementDate: format(date, 'yyyy-MM-dd')
            }, {
                headers : authHeader()
            });
    }

    editRow(number, type, articleIdToDelete, quantityToDelete, articleIdToAdd, quantityToAdd) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/row/edit", {
                number: number,
                documentType: {
                    id: type.id,
                    type: type.type
                },
                rowToDelete: {
                    article: {
                        id: articleIdToDelete
                    },
                    quantity: quantityToDelete
                },
                rowToAdd: {
                    article: {
                        id: articleIdToAdd
                    },
                    quantity: quantityToAdd
                },
            }, {
                headers : authHeader()
            });
    }

    editArticlePrice(document, article, newPurchasePrice, newSalePrice) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/row/add/price", {
                id: document.id,
                number: document.number,
                documentType: {
                    id: document.documentType.id,
                    type: document.documentType.type
                },
                newArticlePrice: {
                    id: article.id,
                    newPrice: {
                        date: format(new Date(), 'yyyy-MM-dd'),
                        purchasePrice: newPurchasePrice,
                        salePrice: newSalePrice
                    }
                }
            }, {
                headers : authHeader()
            });
    }

    editDocumentNumber(document, newDocumentNumber) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/edit/number", {
                id: document.id,
                documentType: {
                    type: document.documentType.type
                },
                newNumber: newDocumentNumber
            }, {
                headers : authHeader()
            });
    }

    editDocumentType(document, newDocumentType) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/edit/type", {
                id: document.id,
                documentType: {
                    type: document.documentType.type
                },
                newType: newDocumentType
            }, {
                headers : authHeader()
            });
    }

    searchDocuments(number, fromDate, toDate, delivery, documentType, type) {
        return axios
            .post(ServiceHelper.getHost() + ServiceHelper.getLecherosApiPath() + "/document/filter", {
                number: number,
                fromDate: format(fromDate, 'yyyy-MM-dd'),
                toDate: format(toDate, 'yyyy-MM-dd'),
                delivery: delivery,
                documentType: documentType,
                type: type
            }, {
                headers : authHeader()
            });
    }

}

export default new DocumentService();