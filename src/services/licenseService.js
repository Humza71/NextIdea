import { postUtil, getUtil, deleteUtil } from "../utils/apiService";
export function addLicense(payload) {
  return new Promise((resolve, reject) => {
    postUtil("/api/add/license", payload)
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateLicense(payload, id) {
  return new Promise((resolve, reject) => {
    postUtil(`/api/update/license/${id}`, payload)
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getAllLicense() {
  return new Promise((resolve, reject) => {
    getUtil("/api/get/licenses")
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

export function getAllLicenseByAdmin() {
  return new Promise((resolve, reject) => {
    getUtil("/api/get/all-licenses")
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

export function getLicense(id) {
  return new Promise((resolve, reject) => {
    getUtil(`/api/get/license/${id}`)
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

export const deleteLicense = async (id) => {
  return new Promise((resolve, reject) => {
    deleteUtil(`/api/delete/license/${id}`)
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
