import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

// Attach access token to every request
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accesstoken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle 401 — try to refresh the token
Axios.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        let originRequest = error.config

        // Guard: only retry on 401 and if response exists
        if (error.response && error.response.status === 401 && !originRequest._retry) {
            originRequest._retry = true

            const refreshToken = localStorage.getItem("refreshToken")

            if (refreshToken) {
                try {
                    const newAccessToken = await refreshAccessToken(refreshToken)
                    if (newAccessToken) {
                        originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                        return Axios(originRequest)
                    }
                } catch (refreshError) {
                    // Refresh failed — clear tokens and let caller handle
                    localStorage.removeItem('accesstoken')
                    localStorage.removeItem('refreshToken')
                }
            }
        }

        return Promise.reject(error)
    }
)

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })

        const accessToken = response.data.data.accessToken
        localStorage.setItem('accesstoken', accessToken)
        return accessToken
    } catch (error) {
        console.error("Token refresh failed:", error)
        return null
    }
}

export default Axios