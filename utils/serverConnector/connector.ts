import axios, { AxiosRequestConfig } from 'axios'

const API_BASE_URL = 'https://pokeapi.co/api/v2'

type ApiConnectorType = {
  url: string
  config?: AxiosRequestConfig
}

const connector = ({ url, config }: ApiConnectorType) => {
  const data = axios.get(`${API_BASE_URL}/${url}`, config)

  return data
}

const ApiConnector = {
  get: ({ url, config }: ApiConnectorType) => {
    return connector({
      url,
      config,
    })
  },
  // post: () => {},
  // patch: () => {},
  // delete: () => {},
}

export default ApiConnector
