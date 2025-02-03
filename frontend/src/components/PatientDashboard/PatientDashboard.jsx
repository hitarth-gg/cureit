import { Box, Tabs, Text } from "@radix-ui/themes";
import ProfileTab from "./ProfileTab";
import UpcomingAppointments from "./UpcomingAppointments";
import HistoryAppointments from "./HistoryAppointments";
import { useLocation } from "react-router-dom";

function PatientDashboard() {
  const location = useLocation();
  const tab = location?.state?.tab || "profile";
  return (
    <div className="text-sm font-medium">
      <Tabs.Root defaultValue={tab}>
        <Tabs.List
          size={{
            initial: "1",
            sm: "2",
          }}
        >
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="appointments">Appointments</Tabs.Trigger>
          <Tabs.Trigger value="history">History</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="profile">
            <ProfileTab />
          </Tabs.Content>

          <Tabs.Content value="appointments">
            <UpcomingAppointments />
          </Tabs.Content>

          <Tabs.Content value="history">
            <HistoryAppointments />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}

export default PatientDashboard;
