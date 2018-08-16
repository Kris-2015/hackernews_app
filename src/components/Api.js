import config from "../config/config";
import axios from "axios/index";

/**
 *Function to make an Api calls
 */
export default {

    /**
     * Function to make an api call and get the lists of data
     * @param searchTerm
     * @param page
     * @returns {AxiosPromise}
     */
    getList(searchTerm, page) {
        return axios(`${config.PATH_BASE}${config.PATH_SEARCH}?${config.PARAM_SEARCH}
        ${searchTerm}&${config.PARAM_PAGE}\
${page}&${config.PARAM_HPP}${config.DEFAULT_HPP}`);
    }
};