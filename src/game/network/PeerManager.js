// WebRTC Peer-to-Peer Real-Time Multiplayer Manager using PeerJS

import { Peer } from 'peerjs';

export class PeerManager {
  constructor(onStatusChange, onDataReceived) {
    this.peer = null;
    this.conn = null;
    this.isHost = false;
    this.roomCode = null;
    this.peerId = null;
    this.status = 'DISCONNECTED'; // 'DISCONNECTED', 'INITIALIZING', 'WAITING', 'CONNECTING', 'CONNECTED', 'ERROR'
    this.ping = 0;
    this.lastPingTime = 0;

    this.onStatusChange = onStatusChange;
    this.onDataReceived = onDataReceived;
  }

  // Create a Room as Host
  createRoom() {
    this.isHost = true;
    this.status = 'INITIALIZING';
    this.notifyStatus();

    // Generate random 4-letter room code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.roomCode = code;
    const fullPeerId = `indogame-${this.roomCode.toLowerCase()}`;

    this.initPeer(fullPeerId);
  }

  // Join an existing Room as Guest
  joinRoom(roomCode) {
    this.isHost = false;
    this.roomCode = roomCode.trim().toUpperCase();
    this.status = 'CONNECTING';
    this.notifyStatus();

    const targetPeerId = `indogame-${this.roomCode.toLowerCase()}`;

    // Init guest peer with random id
    this.initPeer(null, () => {
      // Connect to host
      this.conn = this.peer.connect(targetPeerId, {
        reliable: false // UDP-like low latency for fighting games
      });
      this.setupConnection();
    });
  }

  initPeer(customId, onOpenCallback) {
    if (this.peer) {
      this.peer.destroy();
    }

    try {
      this.peer = customId ? new Peer(customId) : new Peer();

      this.peer.on('open', (id) => {
        this.peerId = id;
        if (this.isHost) {
          this.status = 'WAITING';
          this.notifyStatus();
        }
        if (onOpenCallback) onOpenCallback();
      });

      this.peer.on('connection', (connection) => {
        if (this.isHost) {
          this.conn = connection;
          this.setupConnection();
        }
      });

      this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        this.status = 'ERROR';
        this.notifyStatus(err.message || 'Koneksi gagal');
      });

      this.peer.on('disconnected', () => {
        this.status = 'DISCONNECTED';
        this.notifyStatus();
      });
    } catch (e) {
      console.error('Peer init failed:', e);
      this.status = 'ERROR';
      this.notifyStatus('Inisialisasi WebRTC gagal');
    }
  }

  setupConnection() {
    if (!this.conn) return;

    this.conn.on('open', () => {
      this.status = 'CONNECTED';
      this.notifyStatus();

      // Start ping heartbeat
      this.startPingInterval();

      // If host, send room confirmation
      if (this.isHost) {
        this.send({
          type: 'HANDSHAKE',
          isHost: true,
          roomCode: this.roomCode
        });
      }
    });

    this.conn.on('data', (data) => {
      if (data.type === 'PING') {
        this.send({ type: 'PONG', timestamp: data.timestamp });
        return;
      }
      if (data.type === 'PONG') {
        this.ping = Math.max(5, Math.round(performance.now() - data.timestamp));
        return;
      }

      if (this.onDataReceived) {
        this.onDataReceived(data);
      }
    });

    this.conn.on('close', () => {
      this.status = 'DISCONNECTED';
      this.notifyStatus('Koneksi terputus');
    });

    this.conn.on('error', (err) => {
      console.error('Connection error:', err);
      this.status = 'ERROR';
      this.notifyStatus('Error koneksi antar pemain');
    });
  }

  startPingInterval() {
    setInterval(() => {
      if (this.conn && this.conn.open) {
        this.send({ type: 'PING', timestamp: performance.now() });
      }
    }, 2000);
  }

  send(data) {
    if (this.conn && this.conn.open) {
      try {
        this.conn.send(data);
      } catch (e) {
        console.warn('Send packet failed:', e);
      }
    }
  }

  disconnect() {
    if (this.conn) {
      this.conn.close();
      this.conn = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.status = 'DISCONNECTED';
    this.notifyStatus();
  }

  notifyStatus(errorMsg = null) {
    if (this.onStatusChange) {
      this.onStatusChange({
        status: this.status,
        isHost: this.isHost,
        roomCode: this.roomCode,
        ping: this.ping,
        error: errorMsg
      });
    }
  }
}
