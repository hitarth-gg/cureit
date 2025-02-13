import { Badge, Checkbox, Code, DataList, Flex, Text } from "@radix-ui/themes";
import { format, parseISO } from "date-fns";
import moment from "moment";

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function DoctorSlotCard({ data, formData, setFormData }) {
  const tags = data?.tags;
  // iterate over key value pairs in tags
  return (
    <div className="flex justify-between gap-y-1 rounded-md border-2 px-4 py-2 font-noto">
      <DataList.Root
        orientation={{
          initial: "vertical",
          sm: "horizontal",
        }}
        style={{ gap: ".65rem" }}
        size={{
          initial: "1",
          md: "2",
        }}
      >
        <DataList.Item>
          <DataList.Label minWidth="88px">Name</DataList.Label>
          <DataList.Value>
            <Code variant="ghost">{data?.name}</Code>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="">
          <DataList.Label minWidth="88px">Specialization</DataList.Label>
          <DataList.Value>
            <Badge color="jade" variant="soft" radius="full">
              {data?.specialization}
            </Badge>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="88px">Hospital</DataList.Label>
          <DataList.Value>
            <Code variant="ghost">{data?.hospital_name}</Code>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="88px">Available Time</DataList.Label>
          <DataList.Value>
            {data?.available_from && data?.available_to && (
              <Code variant="ghost">
                {moment(data?.available_from, "HH:mm:ss").format("hh:mm A")} -{" "}
                {moment(data?.available_to, "HH:mm:ss").format("hh:mm A")}
              </Code>
            )}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="88px">Tags</DataList.Label>
          <DataList.Value>
            <div className="grid md:grid-flow-col md:grid-cols-4 grid-cols-2 gap-2">
              {data?.tags &&
                Object.entries(data.tags)
                  .slice(0, 5)
                  .map(([key, value], ix) => (
                    <div className="flex">
                      <Badge
                        radius="none"
                        style={{
                          paddingRight: "3px",
                        }}
                      >
                        {capitalizeFirstLetter(key)}
                      </Badge>
                      <Badge
                        style={{
                          paddingLeft: "3px",
                        }}
                        className="relative -left-0"
                        color="gray"
                        radius="none"
                      >
                        x {value}
                      </Badge>
                    </div>
                  ))}
              {!data?.tags && <Code variant="ghost">No tags available</Code>}
            </div>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
      <div className="ml-4 flex items-center justify-center">
        <Checkbox
          checked={formData?.selectedDoctor?.id === data?.id}
          onCheckedChange={(checked) => {
            checked && setFormData({ ...formData, selectedDoctor: data });
            !checked && setFormData({ ...formData, selectedDoctor: null });
          }}
          size={"3"}
        />
      </div>
    </div>
  );
}

export default DoctorSlotCard;
