import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export function UserNav() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // 1. Determine if the user is a recruiter
  const isRecruiter = user?.role === "RECRUITER";

  // 2. Set the destination path based on the role
  const profilePath = isRecruiter ? "/recruiter/settings" : "/dashboard/profile";

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-border/50">
            {/* Using the consistent Dicebear avatar source */}
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`} 
              alt={user?.name || "User"} 
            />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.name || "User"}
            </p>
            {/* Added a small badge to show their role */}
            <p className="text-xs font-semibold text-primary/80 uppercase mt-1">
              {isRecruiter ? "Recruiter" : "Candidate"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* 3. Use the dynamic 'profilePath' here */}
          <DropdownMenuItem onClick={() => navigate(profilePath)} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}