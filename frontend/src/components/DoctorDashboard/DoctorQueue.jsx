import { toast } from "sonner";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import useGetQueueForDoctor from "../../hooks/useGetQueueForDoctor";
import DoctorQueueCard from "./DoctorQueueCard";
import { useAuthContext } from "../../utils/ContextProvider";
import { Button, DropdownMenu } from "@radix-ui/themes";
function DoctorQueue() {
  const user = useAuthContext();
  const [doctorId, setDoctorId] = useState(null);
  useEffect(() => {
    if (user.currentUser != null) {
      setDoctorId(user.currentUser.id);
      // console.log(user.currentUser.id);
    }
  }, [user]);
  const { isLoading, data, error, status, refetch, isFetching } =
    useGetQueueForDoctor(doctorId);

  if (error) {
    toast.error("Error fetching data");
  }

  const [slotData, setSlotData] = useState({
    doctorId: doctorId,
    selectedDate: new Date()
      .toLocaleDateString("en-IN")
      .replace(/\//g, "-")
      .split("-")
      .map((x) => (x.length === 1 ? `0${x}` : x))
      .join("-"),
    appointmentType: null,
  });

  return (
    <div className="">
      {(isLoading || isFetching) && <Loader />}
      <div className="mb-4 flex items-center gap-x-4">
        <input
          className="w-44 rounded-md border border-gray-300 p-2 text-sm md:text-base"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={
            slotData.selectedDate
              ? slotData.selectedDate.split("-").reverse().join("-")
              : ""
          }
          onChange={(e) => {
            const [year, month, day] = e.target.value.split("-");
            const formattedDate = `${day}-${month}-${year}`;
            setSlotData({
              ...slotData,
              selectedDate: formattedDate,
              selectedDoctor: null,
            });
          }}
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="soft">
              {slotData.appointmentType || "Appointment Type"}
              <DropdownMenu.TriggerIcon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              shortcut=""
              onSelect={() =>
                setSlotData({ ...slotData, appointmentType: "Online" })
              }
            >
              Online
            </DropdownMenu.Item>
            <DropdownMenu.Item
              shortcut=""
              onSelect={() =>
                setSlotData({ ...slotData, appointmentType: "Offline" })
              }
            >
              Offline
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="flex flex-col gap-4">
        {data?.map((queue, ix) => (
          <DoctorQueueCard key={ix} data={queue} refetch={refetch} />
        ))}
        {data?.length === 0 && (
          <div className="text-center">No appointments to show!</div>
        )}
      </div>
    </div>
  );
}

export default DoctorQueue;
