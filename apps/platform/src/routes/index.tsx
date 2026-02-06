import { createFileRoute } from "@tanstack/react-router";
import { api } from "./-server";
export const Route = createFileRoute("/")({
  loader: async () => {
    return (await api.users.$get()).json()
  },
  component: App
});

function App() {
  const { users } = Route.useLoaderData()
  return <div>
    {JSON.stringify(users)}
  </div>;
}
