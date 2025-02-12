import { Box, Separator, Tabs } from "@radix-ui/themes";
import DoctorProfileTab from "./DoctorProfileTab";
import DoctorQueue from "./DoctorQueue";
import DoctorHistory from "./DoctorHistory";
import HistoryAppointments from "../PatientDashboard/HistoryAppointments";
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function DoctorDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "profile");

  useEffect(() => {
    setTab(searchParams.get("tab") || "profile");
  }, [searchParams]);

  return (
    <div className="text-sm font-medium">
      <Tabs.Root value={tab}>
        <Tabs.List
          size={{
            initial: "1",
            sm: "2",
          }}
        >
          <Tabs.Trigger
            value="profile"
            onClick={() => setSearchParams({ tab: "profile" })}
          >
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger
            onClick={() => setSearchParams({ tab: "queue" })}
            value="queue"
          >
            Queue
          </Tabs.Trigger>
          <Tabs.Trigger
            onClick={() => setSearchParams({ tab: "history" })}
            value="history"
          >
            History
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="profile">
            <DoctorProfileTab />
          </Tabs.Content>

          <Tabs.Content value="queue">
            <DoctorQueue />
          </Tabs.Content>

          <Tabs.Content value="history">
            <DoctorHistory />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}

export default DoctorDashboard;
