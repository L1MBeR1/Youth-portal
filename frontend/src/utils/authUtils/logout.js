import { getToken,removeToken } from "./tokenStorage"
import { logout } from "../../api/authApi"

export const logoutFunc = async ()=>{
    const accessToken = await getToken();
    await logout(accessToken.token);
    removeToken();
}