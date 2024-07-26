
  "use client";

  
  import { Button } from "./button"

  
  export function UserNav() {
    
    const handleClick = async () => {
      window.location.href = 'https://todoapppss-101bc3b96116.herokuapp.com/api/logout'
    };
  
    return (
          <Button onClick={handleClick}>
             Log Out
          </Button>
    )
  }