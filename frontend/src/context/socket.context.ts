import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface SocketContextValue {
  getSocket: () => Socket | null;
}

export const SocketContext = createContext<SocketContextValue | undefined>(
  undefined
);
