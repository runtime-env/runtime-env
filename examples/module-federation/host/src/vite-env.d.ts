/// <reference types="vite/client" />

declare module "remote/RemoteMessage" {
  import { ComponentType } from "react";
  const Component: ComponentType;
  export default Component;
}

declare global {
  var runtimeEnv: {
    VITE_MESSAGE: string;
  };
}

export {};
