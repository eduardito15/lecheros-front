import axios from "axios";
import ServiceHelper from "./service.helper";

const API_URL = ServiceHelper.getHost() + "/lecheros/api/auth/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }

    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.roles && user.roles.includes(role);
    }
}

export default new AuthService();