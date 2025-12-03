import { useQuery } from "@tanstack/react-query";
import { api } from "../apis/axios";

const checkLoginStatus = async (): Promise<boolean> => {
    try {
        await api.get('/users/me');
        return true;
    } catch (error) {
        return false; 
    }
};

export const useAuth = () => {
    return useQuery<boolean>({
        queryKey: ['isLoggedIn'],
        queryFn: checkLoginStatus,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false, // Do not retry on failure
        refetchOnWindowFocus: false, // Do not refetch on window focus
    });
}