import { Badge, Checkbox, Code, DataList, Flex, Text } from "@radix-ui/themes";

function DoctorSlotCard({ data, formData, setFormData }) {
  return (
    <div className="flex justify-between gap-y-1 rounded-md border-2 px-4 py-2 font-noto">
      <DataList.Root
        orientation={"horizontal"}
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
        <DataList.Item align="center">
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
            <Code variant="ghost">{data?.available_from}</Code>
          </DataList.Value>
        </DataList.Item>
        {/* Available date is not required as users selects the date */}
        {/* <DataList.Item>
          <DataList.Label minWidth="88px">Available Date</DataList.Label>
          <DataList.Value>
            <Code variant="ghost">{data?.available_date}</Code>
          </DataList.Value>
        </DataList.Item> */}
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
