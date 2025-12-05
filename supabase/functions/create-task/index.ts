import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
      });
    }

    const body = await req.json();
    const { application_id, task_type, due_at } = body;

    if (!application_id || !task_type || !due_at) {
      return new Response(JSON.stringify({
        error: "application_id, task_type, due_at required"
      }), { status: 400 });
    }

    const validTypes = ["call", "email", "review"];
    if (!validTypes.includes(task_type)) {
      return new Response(JSON.stringify({ error: "Invalid task_type" }), {
        status: 400,
      });
    }

    const dueDate = new Date(due_at);
    if (!(dueDate instanceof Date) || isNaN(dueDate.getTime()) || dueDate <= new Date()) {
      return new Response(
        JSON.stringify({ error: "due_at must be a future datetime" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        related_id: application_id,
        tenant_id: null,
        type: task_type,
        status: "pending",
        due_at: dueDate.toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ success: true, task_id: data.id }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
