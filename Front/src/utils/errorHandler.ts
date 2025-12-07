import { ERROR_MESSAGES } from '../constants/messages';

export const handleError = (error: unknown, customMessage?: string) => {
  console.error('Error occurred:', error);
  
  const message = error instanceof Error ? error.message : ERROR_MESSAGES.DEFAULT;
  const displayMessage = customMessage || message;

  // TODO: Replace with Toast component later
  alert(displayMessage);
};
