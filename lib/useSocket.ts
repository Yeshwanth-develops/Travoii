'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      // First make a request to initialize the socket server
      await fetch('/api/socket');

      const socketInstance = io({
        path: '/api/socket',
        addTrailingSlash: false,
      });

      socketInstance.on('connect', () => {
        console.log('⚡ Connected to socket server');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('⚡ Disconnected from socket server');
        setIsConnected(false);
      });

      socketRef.current = socketInstance;
      setSocket(socketInstance);
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinTrip = (tripId: string) => {
    if (socket) {
      socket.emit('join-trip', tripId);
    }
  };

  const leaveTrip = (tripId: string) => {
    if (socket) {
      socket.emit('leave-trip', tripId);
    }
  };

  const inviteMember = (tripId: string, email: string) => {
    if (socket) {
      socket.emit('invite-member', { tripId, email });
    }
  };

  return {
    socket,
    isConnected,
    joinTrip,
    leaveTrip,
    inviteMember,
  };
}