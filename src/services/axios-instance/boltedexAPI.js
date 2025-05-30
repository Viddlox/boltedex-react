import axios from "axios";

import { API_URL } from "@/config";

const boltedexAPI = axios.create({
  baseURL: API_URL + "/api/pokemon",
});

export default boltedexAPI;
