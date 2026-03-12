import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Form Submissions</h1>

        {error && (
          <p className="text-red-600 mb-4">
            Error: {error.message}
          </p>
        )}

        {!data || data.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {data.map((submission) => (
              <div
                key={submission.id}
                className="border rounded-lg p-4"
              >
                <p><strong>Name:</strong> {submission.name}</p>
                <p><strong>Email:</strong> {submission.email}</p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(submission.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}