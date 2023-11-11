type CreateMessage = (message: string) => string;

const createMessage: CreateMessage = (message) => {
  return `[runtime-env] ${message}`;
};

export default createMessage;
