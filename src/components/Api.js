import config from "../config/config";
import axios from "axios/index";

/**
 * @purpose Funtional Component which makes api & get hit lists
 * @param searchTerm
 * @param page
 * @returns {AxiosPromise}
 * @constructor
 */
const Api = (searchTerm, page) => {
    return axios(`${config.PATH_BASE}${config.PATH_SEARCH}?${config.PARAM_SEARCH}
        ${searchTerm}&${config.PARAM_PAGE}\
${page}&${config.PARAM_HPP}${config.DEFAULT_HPP}`);
};

export default Api;