import { postUtil } from "../utils/apiService";
export function createReport(payload) {
  const patientPayload = {
    patientDemographics: {
      ...payload,
    },
  };
  return new Promise((resolve, reject) => {
    postUtil("/api/add/patient-demographics", patientPayload)
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
