import axios from "axios";
import multipartHeader from "./multipart-header";
import ServiceHelper from "./service.helper";


class UploadFilesService {

    upload(file) {
        let formData = new FormData();

        formData.append("file", file);

        return axios.post(ServiceHelper.getHost() + "/lecheros/api/prices/upload", formData, {
            headers: multipartHeader()
        });
    }

    uploadSales(file, company) {
        let formData = new FormData();

        formData.append("file", file);
        formData.append("company", company);

        return axios.post(ServiceHelper.getHost() + "/lecheros/api/sales/upload", formData, {
            headers: multipartHeader()
        });
    }

    getFiles() {
        return axios.get("/files");
    }
}

export default new UploadFilesService();