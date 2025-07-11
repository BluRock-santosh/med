import { useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useMedicationStore } from '@/store/medicationStore';
import type { Medication } from '@/types/medication';

interface MissedMedication {
  id: string;
  medication: Medication;
  scheduledTime: string;
  missedAt: Date;
}

export function useMedicationReminders() {
  const { user, isCaretaker } = useUserStore();
  const { medications, checkTakenToday } = useMedicationStore();
  const [missedMedications, setMissedMedications] = useState<MissedMedication[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const notifiedIdsRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkMissedMedications = async () => {
    if (!user?.uid || !isCaretaker()) return;
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const missed: MissedMedication[] = [];
    for (const medication of medications) {
      for (const scheduledTime of medication.timeOfDay) {
        const missedId = `${medication.id}-${scheduledTime}`;
        const [scheduledHour, scheduledMinute] = scheduledTime.split(':').map(Number);
        const scheduledMinutes = scheduledHour * 60 + scheduledMinute;
        const [currentHour, currentMinute] = currentTime.split(':').map(Number);
        const currentMinutes = currentHour * 60 + currentMinute;
        const isOverdue = currentMinutes > scheduledMinutes + 15;
        if (isOverdue && !notifiedIdsRef.current.has(missedId)) {
          const isTaken = await checkTakenToday(medication.id, user.uid);
          if (!isTaken) {
            missed.push({
              id: missedId,
              medication,
              scheduledTime,
              missedAt: now,
            });
            notifiedIdsRef.current.add(missedId);
          }
        }
      }
    }
    if (missed.length > 0) {
      setMissedMedications(prev => {
        const all = [...prev, ...missed];
        const unique = all.filter((item, idx, arr) => arr.findIndex(i => i.id === item.id) === idx);
        return unique;
      });
      const newNotifications = missed.map(m =>
        `Patient missed ${m.medication.name} (${m.medication.dosage}) at ${m.scheduledTime}`
      );
      setNotifications(prev => [...prev, ...newNotifications]);
    }
  };

  const clearMissedMedication = (missedId: string) => {
    setMissedMedications(prev => prev.filter(m => m.id !== missedId));
    notifiedIdsRef.current.delete(missedId);
  };

  const clearNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setMissedMedications([]);
    notifiedIdsRef.current.clear();
  };

  useEffect(() => {
    if (!user?.uid || !isCaretaker()) return;
    checkMissedMedications();
    intervalRef.current = setInterval(checkMissedMedications, 60000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user?.uid, medications, isCaretaker]);

  useEffect(() => {
    const checkNewDay = () => {
      const now = new Date();
      if (now.getHours() === 0) {
        setMissedMedications([]);
        setNotifications([]);
        notifiedIdsRef.current.clear();
      }
    };
    const dayInterval = setInterval(checkNewDay, 60000);
    return () => clearInterval(dayInterval);
  }, []);

  return {
    missedMedications,
    notifications,
    clearMissedMedication,
    clearNotification,
    clearAllNotifications,
  };
} 