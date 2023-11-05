import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ApiConnectorType {
  url: string;
  config?: AxiosRequestConfig;
  params?: object;
}

// Now the connector is a generic function
const connector = async <T>({ url, config }: ApiConnectorType): Promise<AxiosResponse<T>> => {
  const response = await axios.get<T>(`${API_BASE_URL}/${url}`, config);
  return response;
};

const ApiConnector = {

  get: async <T>({ url, config, params }: ApiConnectorType): Promise<AxiosResponse<T>> => {
    const fullConfig: AxiosRequestConfig = {
      ...config,
      params,
    };
    return connector<T>({ url, config: fullConfig });
  },
  // post: () => {},
  // patch: () => {},
  // delete: () => {},
};

export default ApiConnector;
