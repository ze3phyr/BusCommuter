// lib/db.ts - Local mock implementation (no Firebase)
import type { BusStatus, BusStatusUpdate, RouteSubscription, AppNotification } from './data';

const generateId = () => Math.random().toString(36).substring(2, 15);

export async function updateBusStatus(
  routeId: string,
  status: BusStatus,
  estimatedArrival: string,
  delayMinutes: number,
  userId: string,
  reason?: string,
  etaStopName?: string
): Promise<BusStatusUpdate> {
  const updateData: BusStatusUpdate = {
    id: routeId,
    routeId,
    status,
    delayMinutes,
    estimatedArrival,
    etaStopName,
    updatedBy: userId,
    updatedAt: Date.now(),
    reason
  };

  const { loadBusStatus, saveBusStatus, saveNotification } = await import('./data');
  
  const existing = loadBusStatus(routeId);
  saveBusStatus(updateData);

  if (status === 'delayed' || status === 'cancelled') {
    const title = status === 'delayed' ? 'Bus Delayed' : 'Bus Cancelled';
    const message = status === 'delayed' 
      ? `Bus is delayed by ${delayMinutes} minutes${etaStopName ? ` near ${etaStopName}` : ''}. ${reason || ''}`
      : `Bus service has been cancelled. ${reason || ''}`;
    
    saveNotification({
      id: generateId(),
      routeId,
      type: 'delay',
      title,
      message,
      createdAt: Date.now(),
      read: false
    });
  } else if (status === 'on_time' && existing?.status !== 'on_time') {
    saveNotification({
      id: generateId(),
      routeId,
      type: 'status_change',
      title: 'Bus On Time',
      message: 'Bus is running on time.',
      createdAt: Date.now(),
      read: false
    });
  }

  return updateData;
}

export async function getBusStatus(routeId: string): Promise<BusStatusUpdate | null> {
  const { loadBusStatus } = await import('./data');
  return loadBusStatus(routeId);
}

export async function subscribeToRoute(
  routeId: string,
  userId: string,
  stopIds: string[]
): Promise<RouteSubscription> {
  const { loadSubscriptions, saveSubscription } = await import('./data');
  const existing = loadSubscriptions(userId).find(s => s.routeId === routeId);

  if (existing) {
    const updated = { ...existing, stopIds, notificationEnabled: true, createdAt: Date.now() };
    saveSubscription(updated);
    return updated;
  }

  const newSub: RouteSubscription = {
    id: generateId(),
    routeId,
    userId,
    stopIds,
    notificationEnabled: true,
    createdAt: Date.now()
  };
  saveSubscription(newSub);
  return newSub;
}

export async function unsubscribeFromRoute(routeId: string, userId: string): Promise<void> {
  const { loadSubscriptions } = await import('./data');
  const subs = loadSubscriptions(userId);
  const subsToSave = subs.map(s => 
    s.routeId === routeId && s.userId === userId 
      ? { ...s, notificationEnabled: false }
      : s
  );
  localStorage.setItem('bus_commuter_subs', JSON.stringify(subsToSave));
}

export async function getUserSubscriptions(userId: string): Promise<RouteSubscription[]> {
  const { loadSubscriptions } = await import('./data');
  return loadSubscriptions(userId).filter(s => s.notificationEnabled);
}

export async function getRouteSubscribers(routeId: string): Promise<string[]> {
  const { loadSubscriptions } = await import('./data');
  return loadSubscriptions('anonymous-user')
    .filter(s => s.routeId === routeId && s.notificationEnabled)
    .map(s => s.userId);
}

export async function getRecentNotifications(
  userId: string,
  maxResults: number = 10
): Promise<AppNotification[]> {
  const subs = await getUserSubscriptions(userId);
  const routeIds = subs.map(s => s.routeId);

  const { loadNotifications } = await import('./data');
  const notifs = loadNotifications();
  
  if (routeIds.length === 0) return notifs.slice(0, maxResults);
  
  return notifs
    .filter(n => routeIds.includes(n.routeId))
    .slice(0, maxResults);
}
