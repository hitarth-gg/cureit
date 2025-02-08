import {
  Button,
  DropdownMenu,
  TextArea,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { getAddressFromCoords } from "../utils/api";
import { toast } from "sonner";
import { useEffect } from "react";

function BookingFormPersonalDetails({ data }) {
  const { formData, setFormData } = data;
  async function getAddress() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const address = await getAddressFromCoords(lat, lng);
      toast.success("Address fetched successfully");
      setFormData({ ...formData, address });
      console.log(address);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <div className="animate-fade">
      <div className="mb-4 flex select-none justify-center text-center font-noto text-base font-semibold md:text-lg">
        Fill your personal details
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1 lg:w-1/2">
          <span className="">Full Name</span>
          <TextField.Root
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          ></TextField.Root>
        </div>

        <div className="flex  flex-col gap-y-1">
          <span className="">Address</span>
          <div className="flex gap-x-2">
            <TextField.Root
              placeholder="Address"
              className="w-full"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            >
              <TextField.Slot>
                <Tooltip content="Get Address from your location">
                  <Button
                    variant="soft"
                    color="gray"
                    style={{
                      left: "0",
                      top: "0",
                      bottom: "0",
                      padding: "0 10px",
                      marginLeft: "-7px",
                      borderRadius: "4px 0 0 4px",
                    }}
                    onClick={() => getAddress()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="#2e2e2e"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
                    </svg>
                  </Button>
                </Tooltip>
              </TextField.Slot>
            </TextField.Root>
            <Button
              variant=""
              color="iris"
              size="2"
              onClick={() => getAddress()}
            >
              Get Address
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <span className="">Describe Health Issues</span>
          <TextArea
            placeholder="Description"
            data-lenis-prevent="true"
            resize="vertical"
            style={{
              height: "100px",
            }}
            value={formData.healthIssue}
            onChange={(e) =>
              setFormData({ ...formData, healthIssue: e.target.value })
            }
          ></TextArea>
        </div>

        <div className="flex gap-x-5">
          <div className="flex w-16 flex-col gap-y-1">
            <span className="">Age</span>
            <TextField.Root
              placeholder="Age"
              value={formData.age}
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            ></TextField.Root>
          </div>

          <div className="flex w-fit items-end">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button variant="outline" color="gray">
                  {/* Gender */}
                  {formData.gender ? formData.gender : "Gender"}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  onClick={() => setFormData({ ...formData, gender: "Male" })}
                >
                  Male
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => setFormData({ ...formData, gender: "Female" })}
                >
                  Female
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingFormPersonalDetails;
