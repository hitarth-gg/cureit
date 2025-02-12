import {
  Button,
  Code,
  Dialog,
  Flex,
  Separator,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  toolbarPlugin,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertImage,
  imagePlugin,
  diffSourcePlugin,
  InsertTable,
  tablePlugin,
  ListsToggle,
  listsPlugin,
  headingsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  InsertThematicBreak,
  markdownShortcutPlugin,
  linkPlugin,
} from "@mdxeditor/editor";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useCallback, useState } from "react";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";
import { Cross1Icon } from "@radix-ui/react-icons";
import HBorder from "../HBorder";
import { toast } from "sonner";
import debounce from "lodash.debounce";
import usePostPrescription from "../../hooks/usePutPrescription";
import usePostAppointmentStatus from "../../hooks/usePostAppointmentStatus";
import { set } from "lodash";

function SeeDetails({ data, refetch, otpVerified }) {
  const {
    patientName,
    age,
    gender,
    hospital,
    currentMedication,
    issue,
    issueDetails,
    appointment_time,
    appointment_date,
    queuePosition,
  } = data;
  const [isPaneOpen, setIsPaneOpen] = useState(false);

  const [doctorRemarks, setDoctorRemarks] = useState(""); // can either debounce or use a normal variable to store the doctorRemarks to avoid unnecessary re-renders
  const [doctorPrescription, setDoctorPrescription] = useState("");

  const [savePrescriptionSuccess, setSavePrescriptionSuccess] = useState(false);
  const [updateAppointmetnStatusSuccess , setUpdateAppointmentStatusSuccess] = useState(false);
  const { mutate: savePrescription } = usePostPrescription(
    setSavePrescriptionSuccess,
  );
  const { mutate: saveAppointmentStatus } = usePostAppointmentStatus(setUpdateAppointmentStatusSuccess);
  async function saveDetails() {
    // Save the doctorRemarks and doctorPrescription to the database
    // Refetch the data
    toast.success("Details saved successfully");
  }
  const appointmentId = data.appointmentId;
  async function saveAndMarkAsDone() {
    setSavePrescriptionSuccess(false);
    setUpdateAppointmentStatusSuccess(false);
    savePrescription.mutate({appointmentId , doctorRemarks, doctorPrescription });
    saveAppointmentStatus.mutate({
      appointmentId: data.appointmentId,
      status: "completed",
    });
    if(savePrescriptionSuccess && updateAppointmetnStatusSuccess){
      setIsPaneOpen(false);
      toast.success("Details saved successfully");
    }
    else
    {
      toast.error("Error saving details");
    }
    // Save the doctorRemarks and doctorPrescription to the database
  }

 

  const debouncedSetDoctorRemarks = useCallback(
    debounce((newContent) => {
      setDoctorRemarks(newContent);
    }, 300), // Adjust the delay (in ms) based on your needs
    [],
  );
  const debouncedSetDoctorPrescription = useCallback(
    debounce((newContent) => {
      setDoctorPrescription(newContent);
    }, 300),
    [],
  );
  console.log(doctorRemarks, doctorPrescription);

  return (
    <div className="">
      <Tooltip
        className={otpVerified ? "hidden" : ""}
        disableHoverableContent={true}
        content="Verify OTP to see details"
        side="top"
      >
        <div className="w-full">
          <Button
            className="w-max"
            disabled={!otpVerified}
            color="iris"
            onClick={() => setIsPaneOpen(true)}
            size={{ initial: "1", md: "2" }}
          >
            Details
          </Button>
        </div>
      </Tooltip>
      <SlidingPanel
        backdropClicked={() => setIsPaneOpen(false)}
        className="prose max-w-none font-inter text-sm"
        overlayClassName="some-custom-overlay-class"
        isOpen={isPaneOpen}
        size={90}
        type="right"
      >
        <div className="h-screen overflow-scroll bg-white">
          <div className="top-0 flex h-10 items-center bg-gray-200 p-4">
            <Button
              variant="ghost"
              color="gray"
              radius="small"
              size={"1"}
              onClick={() => setIsPaneOpen(false)}
            >
              <Cross1Icon />
            </Button>
          </div>
          <div
            data-lenis-prevent="true"
            className="overflow-scroll bg-white p-8"
          >
            <Text as="div" size="5" weight="bold">
              Patient Details:
            </Text>
            <div className="my-8 w-full border"></div>

            <Flex direction="column" gap="2">
              <label className="flex gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Name:
                </Text>
                <Text as="div" size="2" mb="1">
                  {patientName}
                </Text>
              </label>

              <label className="flex gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Age & Gender:
                </Text>
                <Text as="div" size="2" mb="1">
                  {age} {gender}
                </Text>
              </label>

              {/* <label className="flex gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Current Medication:
                </Text>
                {currentMedication.split(",").map((med, ix) => (
                  <Code color="green" weight={"bold"} size="2" key={ix}>
                    {med}
                  </Code>
                ))}
              </label> */}

              <label className="flex gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Issue:
                </Text>
                <Text as="div" size="2" mb="1">
                  {issueDetails}
                </Text>
              </label>

              <label className="flex gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Queue Position:
                </Text>
                <Code as="div" weight={"bold"} size="2" mb="1">
                  {queuePosition}
                </Code>
              </label>

              <label className="flex gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Appointment Date:
                </Text>
                <Code as="div" weight={"bold"} size="2" mb="1">
                  {appointment_date}
                </Code>
              </label>

              {/* <label className="flex gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Appointment Time:
                </Text>
                <Code as="div" weight={"bold"} size="2" mb="1">
                  {appointment_time}
                </Code>
              </label> */}

              <label className="flex flex-col gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Doctor Remarks:
                </Text>
              </label>
              <MDXEditor
                onChange={(newContent) => {
                  debouncedSetDoctorRemarks(newContent);
                }}
                contentEditableClassName="prose max-w-none h-full mb-4 border-2 border-t-0"
                markdown={""}
                placeholder="Type Doctor Remarks here..."
                plugins={[
                  toolbarPlugin({
                    toolbarClassName: "my-classname",
                    toolbarContents: () => (
                      <>
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <BlockTypeSelect />
                        <CodeToggle />
                        <CreateLink />
                        <Separator orientation={"vertical"} />
                        <InsertImage />
                        <InsertTable />
                        <Separator orientation={"vertical"} />
                        <ListsToggle />
                        <InsertThematicBreak />
                        <DiffSourceToggleWrapper />
                      </>
                    ),
                  }),
                  headingsPlugin(),
                  imagePlugin(),
                  diffSourcePlugin(),
                  tablePlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                  linkPlugin(),
                  markdownShortcutPlugin(),
                ]}
              />
              <label className="flex flex-col gap-3">
                <Text as="div" size="2" mb="1" weight="bold">
                  Medical Prescription:
                </Text>
              </label>
              <MDXEditor
                onChange={(newContent) => {
                  console.log(newContent);

                  debouncedSetDoctorPrescription(newContent);
                }}
                contentEditableClassName="prose max-w-none mb-4 h-full border-2 border-t-0"
                markdown={""}
                placeholder="Type Medical Prescription here..."
                plugins={[
                  toolbarPlugin({
                    toolbarClassName: "my-classname",
                    toolbarContents: () => (
                      <>
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <BlockTypeSelect />
                        <CodeToggle />
                        <CreateLink />
                        <Separator orientation={"vertical"} />
                        <InsertImage />
                        <InsertTable />
                        <Separator orientation={"vertical"} />
                        <ListsToggle />
                        <InsertThematicBreak />
                        <DiffSourceToggleWrapper />
                      </>
                    ),
                  }),
                  headingsPlugin(),
                  imagePlugin(),
                  diffSourcePlugin(),
                  tablePlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                  linkPlugin(),
                  markdownShortcutPlugin(),
                ]}
              />
            </Flex>
            <div className="flex w-full gap-x-4 py-4">
              <Button>Save</Button>
              <Button 
              onClick={saveAndMarkAsDone}
              >Save & Mark as Done</Button>
            </div>
          </div>
        </div>
      </SlidingPanel>
    </div>
  );
}

export default SeeDetails;
