import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, X, Clock, Bell } from 'lucide-react';
import { useMedicationReminders } from '@/hooks/useMedicationReminders';

export function MedicationNotifications() {
  const { 
    missedMedications, 
    notifications, 
    clearMissedMedication, 
    clearNotification, 
    clearAllNotifications 
  } = useMedicationReminders();

  if (missedMedications.length === 0 && notifications.length === 0) {
    return null;
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatMissedTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-4">
      {/* Missed Medications */}
      {missedMedications.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-lg text-red-800">
                  Missed Medications ({missedMedications.length})
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                Clear All
              </Button>
            </div>
            <CardDescription className="text-red-700">
              Patient has missed these medications. Please check on them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {missedMedications.map((missed) => (
              <div
                key={missed.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-red-800">
                      {missed.medication.name}
                    </h4>
                    <Badge variant="destructive" className="text-xs">
                      {missed.medication.dosage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-red-700">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Scheduled: {formatTime(missed.scheduledTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Missed at: {formatMissedTime(missed.missedAt)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearMissedMedication(missed.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* General Notifications */}
      {notifications.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-lg text-yellow-800">
                  Notifications ({notifications.length})
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200"
              >
                <span className="text-sm text-yellow-800">{notification}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearNotification(index)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 