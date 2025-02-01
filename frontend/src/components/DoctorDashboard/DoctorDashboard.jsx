import { Box, Separator, Tabs } from "@radix-ui/themes";
import DoctorProfileTab from "./DoctorProfileTab";
import DoctorQueue from "./DoctorQueue";


function DoctorDashboard() {
  return (
    <div className="text-sm font-medium">
      
      <Tabs.Root defaultValue="profile">
        <Tabs.List
          size={{
            initial: "1",
            sm: "2",
          }}
        >
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="queue">Queue</Tabs.Trigger>
          <Tabs.Trigger value="history">History</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="profile">
            <DoctorProfileTab />
          </Tabs.Content>

          <Tabs.Content value="queue">
            <DoctorQueue />
          </Tabs.Content>

          <Tabs.Content value="history">
            <HistoryAppointments />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}

export default DoctorDashboard;
