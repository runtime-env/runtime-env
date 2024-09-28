type ThrowError = (...message: any[]) => never;

const throwError: ThrowError = (...messages) => {
  const message = messages.join("\n");
  if (process.env.NODE_ENV === "production") {
    console.error(
      `[@runtime-env/cli]\n${message
        .split("\n")
        .map((message) => "  " + message)
        .join("\n")}`,
    );
    process.exit(1);
  } else {
    throw Error(message);
  }
};

export default throwError;
