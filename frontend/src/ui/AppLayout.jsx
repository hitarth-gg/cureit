import { Theme } from "@radix-ui/themes";
import ReactLenis from "lenis/react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useCureitContext } from "../utils/ContextProvider";
import ChatBot from "../components/ChatBot/ChatBot";

function AppLayout() {
  const context = useCureitContext();
  const { theme } = context;
  return (
    <ReactLenis root options={{ lerp: 0.15 }}>
      <Theme appearance={theme}>
        <div className="">
          <Header />
          <main className="layout relative flex flex-col font-inter">
            <Outlet />
          </main>
          <div className="fixed bottom-0 w-full left-0 pointer-events-none">
            <ChatBot />
          </div>
        </div>
      </Theme>
    </ReactLenis>
  );
}

export default AppLayout;
