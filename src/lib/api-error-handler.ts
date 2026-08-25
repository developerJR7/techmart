import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        if (error.response) {
            // O servidor respondeu com um status fora do range 2xx
            const data = error.response.data as any;

            // Verifica formatos comuns de erro
            if (data?.message) {
                return Array.isArray(data.message) ? data.message[0] : data.message;
            }

            if (data?.error) {
                return data.error;
            }

            // Mensagens padrão por status code
            switch (error.response.status) {
                case 400:
                    return 'Requisição inválida. Verifique os dados enviados.';
                case 401:
                    return 'Sessão expirada ou credenciais inválidas. Faça login novamente.';
                case 403:
                    return 'Você não tem permissão para realizar esta ação.';
                case 404:
                    return 'Recurso não encontrado.';
                case 429:
                    return 'Muitas requisições. Tente novamente em instantes.';
                case 500:
                    return 'Erro interno do servidor. Tente novamente mais tarde.';
                default:
                    return `Erro ${error.response.status}: Ocorreu um problema na comunicação com o servidor.`;
            }
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Ocorreu um erro inesperado. Tente novamente.';
};
