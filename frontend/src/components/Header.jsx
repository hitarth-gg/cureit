import { BellIcon, GearIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import CureitLogo from "../assets/CureitLogo";
import { useCureitContext } from "../utils/ContextProvider";
import { Box, Button, DropdownMenu, Tooltip } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const context = useCureitContext();
  const { theme, setTheme } = context;
  // get scrool position

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

  return (
    <div
      // border-b-[1px]
      className={`sticky top-0 z-50 flex h-11 w-full justify-between border-b-[#55555550] bg-[#ffffff50] px-3 backdrop-blur-md transition-all duration-500`}
      style={{
        // boxShadow bottom outline
        boxShadow: scrollPosition > 0 ? "0px 0px 2px 0px #00000050" : "none",
      }}
    >
      <div className="my-auto w-16 cursor-pointer" onClick={() => navigate("/")}>
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

        <Button
          color="iris"
          size={"2"}
          variant="ghost"
          style={{
            fontWeight: "500",
          }}
        >
          Login
        </Button>

        <Tooltip content="Notifications" side="bottom">
          <Button color="iris" size={"2"} variant="ghost">
            <BellIcon />
          </Button>
        </Tooltip>

        <DropdownMenu.Root modal={false}>
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
            <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

export default Header;
