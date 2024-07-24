import Image from "next/image";
import { api } from "@/lib/api";

export async function getData() {
  // Fetch data from the API route
  const res = await api.todo.$get();
  const data = await res.json();

  // Pass the data to the Home component as props
  return {
    props: {
      data,
    },
  };
}

export default async function Home() {

  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="font-bold">His</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
