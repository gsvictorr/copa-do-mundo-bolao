
import axios from "axios";


export async function registerUser(name: string, email: string, password: string) {
  try {

      const response = await axios.post("/api/auth/register", { name, email, password });
      
      return response.data;

    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, error: "Erro ao conectar ao servidor." };
      }
    }
  };


export const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });

      return response.data;

    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      } else {
        return { success: false, error: "Erro ao conectar ao servidor." };
      }
    }
  };