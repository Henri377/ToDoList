import { hc } from 'hono/client'
import { ApiRoutes } from '../../backend/src/app'; // Adjust the import path if necessary


const client = hc<ApiRoutes>('https://todoapppss-101bc3b96116.herokuapp.com/');

export const api = client.api;