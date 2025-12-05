"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const fetchTasks = async () => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .gte("due_at", `${today}T00:00:00Z`)
    .lte("due_at", `${today}T23:59:59Z`);

  if (error) throw error;
  return data;
};

export default function TodayTasksPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks-today"],
    queryFn: fetchTasks,
  });

  const mutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "completed" })
        .eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks-today"]),
  });

  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center py-10 text-gray-600">
        Loading tasks...
      </div>
    );

  if (isError)
    return (
      <div className="w-full flex justify-center items-center py-10 text-red-600">
        Error fetching tasks.
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tasks Due Today</h1>

      {data?.length ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left font-medium">Title</th>
                <th className="p-3 text-left font-medium">Application</th>
                <th className="p-3 text-left font-medium">Due</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((task) => (
                <tr
                  key={task.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{task.title || task.type}</td>
                  <td className="p-3 font-mono text-sm text-gray-700">
                    {task.related_id}
                  </td>
                  <td className="p-3">
                    {new Date(task.due_at).toLocaleString()}
                  </td>
                  <td
                    className={`p-3 capitalize font-semibold ${
                      task.status === "pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => mutation.mutate(task.id)}
                      disabled={mutation.isPending}
                      className={`px-4 py-2 rounded-md text-white transition ${
                        mutation.isPending
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {mutation.isPending ? "Updating..." : "Mark Complete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center py-10">No tasks due today 🎉</p>
      )}
    </div>
  );
}
