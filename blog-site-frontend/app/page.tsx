import { Navbar } from "@/_components/nav";
import { Button } from "@/_components/ui/button";
import ThemeSwitcher from "@/_components/utils/themeProvider/themeSwitcher";
import { WanderingEyes } from "@/_components/wandering-eyes";
import { getMe } from "@/services/getMe";

export default async function Home() {
  const user = await getMe();

  return (
    <div className="">
      <Navbar user={user} />
      <p className="">Hello world</p>

      <div className="">
        
      </div>

      <ThemeSwitcher />
    </div>
  );
}
