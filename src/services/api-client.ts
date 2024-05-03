import axios from "axios";

export default axios.create({
    baseURL: 'https://api.rawg.io/api',
    params: {
        key: 'c529d812a8a3499489a61d4ffa9eda7d'
    }
})