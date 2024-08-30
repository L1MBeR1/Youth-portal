import { logout } from "../../api/authApi";
import { getToken, removeToken } from "./tokenStorage";

export const logoutFunc = async ()=>{
    const accessToken = await getToken();
    await logout(accessToken.token);
    removeToken();
}