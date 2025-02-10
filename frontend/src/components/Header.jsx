import {
  BellIcon,
  ExitIcon,
  GearIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import CureitLogo from "../assets/CureitLogo";
import { useCureitContext } from "../utils/ContextProvider";
import { Avatar, Box, Button, DropdownMenu, Tooltip } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./logout";
import { supabase } from "../utils/supabaseClient";
import { useGetUserDetails } from "../hooks/useGetUserDetails";
import { useQueryClient } from "@tanstack/react-query";

function Header() {
  const cureitContext = useCureitContext();
  const { theme, setTheme, profile, setProfile } = cureitContext;
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [tokenString, setTokenString] = useState(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        console.log("User signed out successfully");
        // invalidate query client
        setTokenString(null);
        setProfile(null);
        queryClient.invalidateQueries("userDetails");
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };
  console.log("accessToken", accessToken, "userId", userId);

  useEffect(() => {
    const tokenStringTemp = localStorage.getItem(
      "sb-vakmfwtcbdeaigysjgch-auth-token",
    );
    setTokenString(tokenStringTemp);
    const token = JSON.parse(tokenStringTemp);
    if (token) {
      setAccessToken(token.access_token);
    }

    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      if (error) console.error("Error fetching user:", error);
    };
    fetchUser();
  }, []);

  const {
    isLoading: isLoadingDetails,
    data: dataDetails,
    error: errorDetails,
    refetch: refetchDetails,
    isFetching: isFetchingDetails,
  } = useGetUserDetails(userId, accessToken);

  useEffect(() => {
    console.log("xxxxxx", dataDetails);

    if (dataDetails) {
      setProfile(dataDetails.profile);
    }
  }, [dataDetails, isLoadingDetails]);

  const name = profile?.name || "";
  const displayName = name.replace("Dr. ", "").split(" ");

  return (
    <div
      // border-b-[1px]
      className={`sticky top-0 z-50 flex h-11 w-full justify-between border-b-[#55555550] bg-[#ffffff50] px-3 backdrop-blur-md transition-all duration-500`}
      style={{
        // boxShadow bottom outline
        boxShadow: scrollPosition > 0 ? "0px 0px 2px 0px #00000050" : "none",
      }}
    >
      <div
        className="my-auto w-16 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <CureitLogo fillColor={theme === "dark" ? "#ffffff" : "#000000"} />
      </div>

      <div className="flexmy-auto mx-3 flex items-center justify-center gap-x-5">
        {/* <Tooltip content="Toggle Theme" side="bottom">
          <Button
            color="gray"
            size={"2"}
            variant="ghost"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            {theme === "dark" ? (
              <MoonIcon className="my-1" />
            ) : (
              <SunIcon className="my-1" />
            )}
          </Button>
        </Tooltip> */}

        {!profile ? (
          <Button
            color="iris"
            size={"2"}
            variant="ghost"
            style={{
              fontWeight: "500",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        ) : (
          // <Logout />

          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger>
              <Button variant="ghost" color="gray">
                <div className="flex items-center justify-center gap-x-2 font-noto text-sm font-medium">
                  <Avatar
                    color="blue"
                    size={{
                      initial: "1",
                      sm: "1",
                      md: "1",
                    }}
                    radius="full"
                    src={profile?.avatar_url || ""}
                    fallback={displayName[0][0]}
                  />
                  <div className="mr-1 font-semibold">
                    {name.includes("Dr. ") ? "Dr." : ""} {displayName[0]}
                  </div>
                </div>
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-black">
              <DropdownMenu.Item
                shortcut=""
                onClick={() => navigate("/user/dashboard")}
              >
                Dashboard
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                shortcut=""
                onClick={() =>
                  navigate("/user/dashboard", {
                    state: { tab: "profile" },
                  })
                }
              >
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                shortcut=""
                onClick={() =>
                  navigate("/user/dashboard", {
                    // state: { tab: "queue" },
                    state: {
                      tab: `${profile?.role === "doctor" ? "queue" : "appointments"}`,
                    },
                  })
                }
              >
                {profile?.role === "doctor" ? "Queue" : "Appointments"}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />

              <DropdownMenu.Item color="red" onClick={handleLogout}>
                <div className="flex w-full items-center justify-between">
                  Sign Out <ExitIcon />
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}

        <Tooltip content="Notifications" side="bottom">
          <Button color="iris" size={"2"} variant="ghost">
            <BellIcon />
          </Button>
        </Tooltip>

        {/* <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger>
            <Button variant="ghost" color="iris">
              <GearIcon />
              <DropdownMenu.TriggerIcon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-black">
            <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
            <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
                <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

                <DropdownMenu.Separator />
                <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>

            <DropdownMenu.Separator />
            <DropdownMenu.Item>Share</DropdownMenu.Item>
            <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              shortcut="⌘ ⌫"
              color="red"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root> */}
      </div>
    </div>
  );
}

export default Header;
