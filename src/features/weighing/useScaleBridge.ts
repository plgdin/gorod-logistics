import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  BridgeConnectionState,
  BridgeMode,
  DiagnosticLogEntry,
  DiscoveredSerialPort,
  LiveWeightReading,
  SimulatorScenarioId,
} from './types';

const DEFAULT_BRIDGE_URL =
  (import.meta.env.VITE_SCALE_BRIDGE_URL as string | undefined)?.trim() ||
  'ws://127.0.0.1:8765';
const DEFAULT_BRIDGE_TOKEN =
  (import.meta.env.VITE_SCALE_BRIDGE_TOKEN as string | undefined)?.trim() ||
  'gorod-local-scale-token';

const MAX_DIAGNOSTIC_LOGS = 80;

export interface ScaleBridgeHandle {
  bridgeUrl: string;
  bridgeOnline: boolean;
  bridgeConnecting: boolean;
  connectionState: BridgeConnectionState;
  mode: BridgeMode;
  deviceName: string;
  ports: DiscoveredSerialPort[];
  selectedPort: string;
  baudRate: number;
  scenario: SimulatorScenarioId;
  diagnosticsEnabled: boolean;
  diagnosticLogs: DiagnosticLogEntry[];
  liveReading: LiveWeightReading | null;
  lastReadingAt: string | null;
  error: string | null;
  setSelectedPort: (port: string) => void;
  setBaudRate: (baud: number) => void;
  setMode: (mode: BridgeMode) => void;
  retryBridge: () => void;
  refreshPorts: () => void;
  connectScale: (overridePort?: string, overrideMode?: BridgeMode) => void;
  disconnectScale: () => void;
  reconnectScale: () => void;
  toggleDiagnostics: (enabled: boolean) => void;
  clearDiagnostics: () => void;
  setSimulatorScenario: (scenario: SimulatorScenarioId) => void;
}

export function useScaleBridge(active: boolean = true): ScaleBridgeHandle {
  const wsRef = useRef<WebSocket | null>(null);
  const [socketNonce, setSocketNonce] = useState(0);

  const [bridgeOnline, setBridgeOnline] = useState(false);
  const [bridgeConnecting, setBridgeConnecting] = useState(false);
  const [connectionState, setConnectionState] =
    useState<BridgeConnectionState>('DISCONNECTED');
  const [mode, setMode] = useState<BridgeMode>('hardware');
  const [deviceName, setDeviceName] = useState('HC-05 / Casio Scale');
  const [ports, setPorts] = useState<DiscoveredSerialPort[]>([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [baudRate, setBaudRate] = useState(9600);
  const [scenario, setScenarioState] = useState<SimulatorScenarioId>('heavy_1254_2');
  const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<DiagnosticLogEntry[]>([]);
  const [liveReading, setLiveReading] = useState<LiveWeightReading | null>(null);
  const [lastReadingAt, setLastReadingAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendCommand = useCallback((payload: Record<string, unknown>) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError('Local scale bridge is not connected.');
      return false;
    }
    ws.send(JSON.stringify(payload));
    return true;
  }, []);

  useEffect(() => {
    if (!active) return;

    let disposed = false;
    setBridgeConnecting(true);
    setError(null);

    const separator = DEFAULT_BRIDGE_URL.includes('?') ? '&' : '?';
    const wsUrl = `${DEFAULT_BRIDGE_URL}${separator}token=${encodeURIComponent(
      DEFAULT_BRIDGE_TOKEN
    )}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (disposed) return;
      setBridgeOnline(true);
      setBridgeConnecting(false);
      setError(null);
      ws.send(JSON.stringify({ type: 'LIST_PORTS' }));
    };

    ws.onmessage = (event) => {
      if (disposed || typeof event.data !== 'string') return;
      try {
        const msg = JSON.parse(event.data) as Record<string, unknown>;
        if (msg.type === 'CONNECTION_STATUS') {
          const nextStatus = String(msg.status || 'DISCONNECTED') as BridgeConnectionState;
          setConnectionState(nextStatus);
          if (typeof msg.device === 'string') setDeviceName(msg.device);
          if (msg.mode === 'hardware' || msg.mode === 'simulator') setMode(msg.mode);
          if (typeof msg.port === 'string' && msg.port && msg.port !== 'SIMULATOR') {
            setSelectedPort(msg.port);
          }
          if (typeof msg.error === 'string' && msg.error) {
            setError(msg.error);
          } else if (nextStatus === 'CONNECTED' || nextStatus === 'RECEIVING') {
            setError(null);
          }
          if (nextStatus === 'DISCONNECTED') {
            setLiveReading(null);
          }
        } else if (msg.type === 'PORTS_LIST') {
          const list = Array.isArray(msg.ports)
            ? (msg.ports as DiscoveredSerialPort[])
            : [];
          setPorts(list);
          setSelectedPort((prev) => {
            if (prev && list.some((p) => p.port === prev)) return prev;
            const btFirst = list.find((p) => p.isBluetooth);
            return btFirst?.port || list[0]?.port || '';
          });
        } else if (msg.type === 'WEIGHT_UPDATE') {
          const reading: LiveWeightReading = {
            weight: typeof msg.weight === 'number' ? msg.weight : null,
            unit: typeof msg.unit === 'string' ? msg.unit : 'kg',
            rawWeight: typeof msg.rawWeight === 'number' ? msg.rawWeight : null,
            rawUnit: typeof msg.rawUnit === 'string' ? msg.rawUnit : 'kg',
            stable: Boolean(msg.stable),
            stabilitySource:
              msg.stabilitySource === 'DEVICE' || msg.stabilitySource === 'SOFTWARE'
                ? msg.stabilitySource
                : 'UNSTABLE',
            overload: Boolean(msg.overload),
            invalid: Boolean(msg.invalid),
            raw: typeof msg.raw === 'string' ? msg.raw : '',
            timestamp:
              typeof msg.timestamp === 'string'
                ? msg.timestamp
                : new Date().toISOString(),
            mode: msg.mode === 'simulator' ? 'simulator' : 'hardware',
            error: typeof msg.error === 'string' ? msg.error : null,
          };
          setLiveReading(reading);
          setLastReadingAt(reading.timestamp);
          if (reading.error) setError(reading.error);
        } else if (msg.type === 'DIAGNOSTIC_LOG') {
          const entry: DiagnosticLogEntry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            timestamp: String(msg.timestamp || new Date().toISOString()),
            byteCount: Number(msg.byteCount || 0),
            totalBytes: Number(msg.totalBytes || 0),
            ascii: String(msg.ascii || ''),
            hex: String(msg.hex || ''),
            port: typeof msg.port === 'string' ? msg.port : null,
            baudRate: typeof msg.baudRate === 'number' ? msg.baudRate : null,
          };
          setDiagnosticLogs((prev) => [entry, ...prev].slice(0, MAX_DIAGNOSTIC_LOGS));
        } else if (msg.type === 'BRIDGE_ERROR') {
          setError(String(msg.error || 'Bridge error'));
        }
      } catch {
        setError('Received unreadable message from local bridge.');
      }
    };

    ws.onerror = () => {
      if (disposed) return;
      setBridgeOnline(false);
      setBridgeConnecting(false);
    };

    ws.onclose = () => {
      if (disposed) return;
      setBridgeOnline(false);
      setBridgeConnecting(false);
      setConnectionState('DISCONNECTED');
    };

    return () => {
      disposed = true;
      ws.close();
      wsRef.current = null;
    };
  }, [active, socketNonce]);

  const retryBridge = useCallback(() => {
    setSocketNonce((n) => n + 1);
  }, []);

  const refreshPorts = useCallback(() => {
    sendCommand({ type: 'LIST_PORTS' });
  }, [sendCommand]);

  const connectScale = useCallback(
    (overridePort?: string, overrideMode?: BridgeMode) => {
      setError(null);
      const targetMode = overrideMode ?? mode;
      const targetPort = overridePort ?? selectedPort;
      if (targetMode === 'hardware' && !targetPort) {
        setError('Select a Bluetooth/Serial COM port before connecting.');
        return;
      }
      sendCommand({
        type: 'CONNECT',
        port: targetMode === 'simulator' ? 'SIMULATOR' : targetPort,
        baudRate,
        dataBits: 8,
        parity: 'N',
        stopBits: 1,
        mode: targetMode,
      });
    },
    [baudRate, mode, selectedPort, sendCommand]
  );

  const disconnectScale = useCallback(() => {
    sendCommand({ type: 'DISCONNECT' });
  }, [sendCommand]);

  const reconnectScale = useCallback(() => {
    sendCommand({ type: 'RECONNECT' });
  }, [sendCommand]);

  const toggleDiagnostics = useCallback(
    (enabled: boolean) => {
      setDiagnosticsEnabled(enabled);
      sendCommand({ type: 'ENABLE_DIAGNOSTICS', enabled });
    },
    [sendCommand]
  );

  const clearDiagnostics = useCallback(() => {
    setDiagnosticLogs([]);
  }, []);

  const setSimulatorScenario = useCallback(
    (nextScenario: SimulatorScenarioId) => {
      setScenarioState(nextScenario);
      sendCommand({ type: 'SET_SIMULATOR_SCENARIO', scenario: nextScenario });
    },
    [sendCommand]
  );

  return {
    bridgeUrl: DEFAULT_BRIDGE_URL,
    bridgeOnline,
    bridgeConnecting,
    connectionState,
    mode,
    deviceName,
    ports,
    selectedPort,
    baudRate,
    scenario,
    diagnosticsEnabled,
    diagnosticLogs,
    liveReading,
    lastReadingAt,
    error,
    setSelectedPort,
    setBaudRate,
    setMode,
    retryBridge,
    refreshPorts,
    connectScale,
    disconnectScale,
    reconnectScale,
    toggleDiagnostics,
    clearDiagnostics,
    setSimulatorScenario,
  };
}

