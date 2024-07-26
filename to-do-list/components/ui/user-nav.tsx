
  "use client";

  
  import { Button } from "./button"

  
  export function UserNav() {
    
    const handleClick = async () => {
      window.location.href = 'http://localhost:3000/api/logout'
    };
  
    return (
          <Button onClick={handleClick}>
             Log Out
          </Button>
    )
  }