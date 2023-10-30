type ThrowError = (message: string) => never;

const throwError: ThrowError = (message) => {
  throw Error(`[@runtime-env/cli] ${message}`);
};

export default throwError;
