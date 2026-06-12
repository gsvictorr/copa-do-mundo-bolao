  export const translateError = (errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      "auth/email-already-in-use": "Este e-mail já está cadastrado.",
      "auth/invalid-email": "Formato de e-mail inválido.",
      "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
      "auth/user-not-found": "Usuário não encontrado.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/api-key-not-valid": "Chave e API incorreta.",
      "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "Informe uma chave de API correta.",
      "unknown-error": "Erro desconhecido. Tente novamente."
    };
    
      return errorMessages[errorCode] || "Ocorreu um erro desconhecido.";
    };