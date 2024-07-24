import { hc } from 'hono/client'
import { ApiRoutes } from '../../backend/src/app'; // Adjust the import path if necessary


const client = hc<ApiRoutes>('http://localhost:3000/');

export const api = client.api;