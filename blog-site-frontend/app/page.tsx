import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ThemeSwitcher from "@/components/utils/themeProvider/themeSwitcher";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <p className="">Hello world</p>
      <Button size={"lg"}>click me</Button>
      {/* <Card></Card> */}
      <ThemeSwitcher />
    </div>
  );
}
