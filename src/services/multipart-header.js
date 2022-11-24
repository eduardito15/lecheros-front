export default function multipartHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        return { "Content-Type": "multipart/form-data", Authorization: 'Bearer ' + user.accessToken};
    } else {
        return {};
    }
}