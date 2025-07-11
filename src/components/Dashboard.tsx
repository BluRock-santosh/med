import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/userStore';
import { useMedicationStore } from '@/store/medicationStore';
import { MedicationList } from './MedicationList.tsx';
import { MedicationForm } from './MedicationForm.tsx';
import { CheckCircle, Plus, AlertCircle, LogOut } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { useMedicationReminders } from '@/hooks/useMedicationReminders';
import { MedicationNotifications } from './MedicationNotifications';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Dashboard() {
  const { user, isPatient, isCaretaker, logout } = useUserStore();
  const { 
    medications, 
    loading, 
    error, 
    fetchMedications, 
    getNotTakenToday 
  } = useMedicationStore();
  const { missedMedications } = useMedicationReminders();
  const [showAddForm, setShowAddForm] = useState(false);
  const [notTakenToday, setNotTakenToday] = useState<number>(0);

  useEffect(() => {
    if (user?.uid) {
      fetchMedications(user.uid);
      updateNotTakenCount();
    }
  }, [user?.uid]);

  const updateNotTakenCount = async () => {
    if (user?.uid) {
      const notTaken = await getNotTakenToday(user.uid);
      setNotTakenToday(notTaken.length);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please log in to access your medication dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isCaretaker() ? 'Caretaker Dashboard' : 'Patient Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.displayName || user.email}
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {user.role}
            </span>
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
          <RoleSwitcher />
          {isCaretaker() && (
            <>
              <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-[95vw] sm:w-[400px] md:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Add New Medication</SheetTitle>
                    <SheetDescription>
                      Add a new medication for the patient's daily routine.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <MedicationForm 
                      onSuccess={() => setShowAddForm(false)}
                      onCancel={() => setShowAddForm(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              {missedMedications.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {missedMedications.length} missed
                </Badge>
              )}
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <p className="text-xs text-muted-foreground">
              Active medications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Taken Today</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notTakenToday}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taken Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length - notTakenToday}</div>
            <p className="text-xs text-muted-foreground">
              Completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {isCaretaker() && <MedicationNotifications />}

      {/* Medication List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isCaretaker() ? 'Patient Medications' : 'My Medications'}
          </CardTitle>
          <CardDescription>
            {isCaretaker() 
              ? 'Manage the patient\'s daily medications and track their progress.'
              : 'View your medications and mark them as taken.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading medications...</p>
            </div>
          ) : medications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {isCaretaker() 
                  ? 'No medications added for the patient yet.'
                  : 'No medications added yet.'
                }
              </p>
              {isCaretaker() && (
                <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
                  <SheetTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Medication
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full max-w-[95vw] sm:w-[400px] md:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Add New Medication</SheetTitle>
                      <SheetDescription>
                        Add a new medication for the patient's daily routine.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <MedicationForm 
                        onSuccess={() => setShowAddForm(false)}
                        onCancel={() => setShowAddForm(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          ) : (
            <MedicationList 
              medications={medications}
              onMedicationUpdated={updateNotTakenCount}
              userRole={user.role}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 