export default function RemoteMessage() {
  return <div>Remote: {globalThis.runtimeEnv.VITE_MESSAGE}</div>;
}
