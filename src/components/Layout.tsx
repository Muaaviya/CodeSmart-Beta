import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, title }: { children: React.ReactNode, title: string }) {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b bg-background">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold text-foreground">CodeFast</h1>
        </Link>
        <h2 className="text-xl font-semibold text-muted-foreground">{title}</h2>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-muted">{children}</main>
    </div>
  );
}
