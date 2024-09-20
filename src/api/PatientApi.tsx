import axios from "axios";

const Base_Url_Patients='http://localhost:8080/api/v1/patients';

export const listOfPatients =() => axios.get(Base_Url_Patients);