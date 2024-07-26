
import { columns } from "@/components/ui/columns";
import { DataTable } from "@/components/ui/data-table";
import { UserNav } from "@/components/ui/user-nav";
import { Task } from "@/data/schema"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';



async function getTasks() {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value ?? '';
    const res = await fetch("https://todoapppss-101bc3b96116.herokuapp.com/api/todo", {
      cache: "no-cache",
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token}` 
      }
    })
    const data = await res.json() as Task[]
    
    return data
  }
  

  

export const Home = async () => {
    const tasks = await getTasks()
    const token = cookies().get('access_token')?.value ?? '';

    if (!token) {
      redirect('https://todoapppss-101bc3b96116.herokuapp.com/api/login');
    }

    return (
        <>
          <div >
          </div>
          <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                <p className="text-muted-foreground">
                  Here&apos;s a list of your tasks !
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <UserNav />
              </div>
            </div>
            <DataTable data={tasks} columns={columns} />
          </div>
        </>
      )
}
  

  

export default Home;


