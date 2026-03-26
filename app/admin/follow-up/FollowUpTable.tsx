"use client";

import { useEffect, useRef, useState } from "react";
import type { Submission } from "../types";

type FollowUpStatus = "none" | "called" | "disqualified" | "both";

function formatSubmittedAt(createdAt: string | null) {
  if (!createdAt) return "-";

  return new Date(createdAt).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
  });
}

export default function FollowUpTable({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [items, setItems] = useState(submissions);
  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        outboundCallNote: string;
        status: FollowUpStatus;
      }
    >
  >(() =>
    Object.fromEntries(
      submissions.map((submission) => {
        const status: FollowUpStatus = submission.outbound_called
          ? submission.disqualified
            ? "both"
            : "called"
          : submission.disqualified
            ? "disqualified"
            : "none";

        return [
          submission.id,
          {
            outboundCallNote: submission.outbound_call_note ?? "",
            status,
          },
        ];
      })
    )
  );
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const noteSaveTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  useEffect(() => {
    const timeouts = noteSaveTimeouts.current;

    return () => {
      Object.values(timeouts).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const saveRow = async (id: string, draftOverride?: { outboundCallNote: string; status: FollowUpStatus }) => {
    const draft = draftOverride ?? drafts[id];

    if (!draft) {
      return;
    }

    const outboundCallNote = draft.outboundCallNote;
    const outboundCalled = draft.status === "called" || draft.status === "both";
    const disqualified =
      draft.status === "disqualified" || draft.status === "both";

    try {
      setSavingIds((current) => ({
        ...current,
        [id]: true,
      }));
      setMessages((current) => ({
        ...current,
        [id]: "กำลังบันทึก...",
      }));

      const res = await fetch("/api/admin-follow-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          outboundCalled,
          outboundCallNote,
          disqualified,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((current) => ({
          ...current,
          [id]: data.error || "บันทึกไม่สำเร็จ",
        }));
        return;
      }

      const trimmedNote = outboundCallNote.trim();

      setItems((current) =>
        current.map((submission) =>
          submission.id === id
            ? {
                ...submission,
                outbound_called: outboundCalled,
                outbound_call_note: trimmedNote,
                disqualified,
              }
            : submission
        )
      );

      setDrafts((current) => ({
        ...current,
        [id]: {
          outboundCallNote: trimmedNote,
          status: draft.status,
        },
      }));

      setMessages((current) => ({
        ...current,
        [id]: "บันทึกแล้ว",
      }));
    } catch {
      setMessages((current) => ({
        ...current,
        [id]: "เกิดข้อผิดพลาดในการบันทึก",
      }));
    } finally {
      setSavingIds((current) => ({
        ...current,
        [id]: false,
      }));
    }
  };

  const scheduleNoteSave = (
    id: string,
    nextDraft: { outboundCallNote: string; status: FollowUpStatus }
  ) => {
    if (noteSaveTimeouts.current[id]) {
      clearTimeout(noteSaveTimeouts.current[id]);
    }

    noteSaveTimeouts.current[id] = setTimeout(() => {
      void saveRow(id, nextDraft);
      delete noteSaveTimeouts.current[id];
    }, 900);
  };

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
        ยังไม่มีรายการที่โทรติดตามแล้ว
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-[1080px] w-full border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm text-gray-600">
            <th className="border-b border-gray-200 px-4 py-3 font-medium">วันที่ส่งฟอร์ม</th>
            <th className="border-b border-gray-200 px-4 py-3 font-medium">ชื่อ</th>
            <th className="border-b border-gray-200 px-4 py-3 font-medium">ชื่อเล่น</th>
            <th className="border-b border-gray-200 px-4 py-3 font-medium">เบอร์โทร</th>
            <th className="border-b border-gray-200 px-4 py-3 font-medium">คอร์ส</th>
            <th className="border-b border-gray-200 px-4 py-3 font-medium">อาชีพ</th>
            <th className="border-b border-gray-200 px-4 py-3 font-medium">รายละเอียดธุรกิจ</th>
            <th className="border-b border-gray-200 px-4 py-3 font-medium">Status</th>
            <th className="border-b border-gray-200 px-4 py-3 font-medium">อัปเดตหลังโทรออก</th>
          </tr>
        </thead>

        <tbody>
          {items.map((submission) => {
            const fullName =
              [submission.first_name, submission.last_name]
                .filter(Boolean)
                .join(" ")
                .trim() || submission.name || "-";
            const isSaving = savingIds[submission.id] === true;
            const selectedStatus = drafts[submission.id]?.status ?? "none";
            const statusClass =
              selectedStatus === "called"
                ? "border-green-200 bg-green-50 text-green-700"
                : selectedStatus === "disqualified"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : selectedStatus === "both"
                    ? "border-orange-200 bg-orange-50 text-orange-700"
                    : "border-gray-300 bg-white text-gray-700";

            return (
              <tr key={submission.id} className="align-top">
                <td className="border-b border-gray-100 px-3 py-3 text-sm text-gray-700">
                  {formatSubmittedAt(submission.created_at)}
                </td>
                <td className="border-b border-gray-100 px-3 py-3 text-sm text-gray-900">
                  {fullName}
                </td>
                <td className="border-b border-gray-100 px-3 py-3 text-sm text-gray-700">
                  {submission.nickname || "-"}
                </td>
                <td className="border-b border-gray-100 px-3 py-3 text-sm text-gray-700">
                  {submission.phone || "-"}
                </td>
                <td className="border-b border-gray-100 px-3 py-3 text-sm text-gray-700">
                  <div className="w-[120px] break-words">
                    {submission.course || "-"}
                  </div>
                </td>
                <td className="border-b border-gray-100 px-3 py-3 text-sm text-gray-700">
                  {submission.occupation || "-"}
                </td>
                <td className="border-b border-gray-100 px-3 py-3 text-sm text-gray-700">
                  <div className="w-[140px] break-words whitespace-pre-wrap">
                    {submission.occupation === "เจ้าของกิจการ / พ่อค้าแม่ค้าออนไลน์"
                      ? submission.business_description || "-"
                      : "-"}
                  </div>
                </td>
                <td className="border-b border-gray-100 px-3 py-3 text-sm text-gray-700">
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      const nextDraft = {
                        outboundCallNote:
                          drafts[submission.id]?.outboundCallNote ??
                          submission.outbound_call_note ??
                          "",
                        status: e.target.value as FollowUpStatus,
                      };

                      if (noteSaveTimeouts.current[submission.id]) {
                        clearTimeout(noteSaveTimeouts.current[submission.id]);
                        delete noteSaveTimeouts.current[submission.id];
                      }

                      setDrafts((current) => ({
                        ...current,
                        [submission.id]: nextDraft,
                      }));

                      void saveRow(submission.id, nextDraft);
                    }}
                    className={`min-w-[132px] rounded-xl border px-2.5 py-2 text-sm outline-none transition focus:border-black ${statusClass}`}
                  >
                    <option value="none">-</option>
                    <option value="called">✓ Followed Up</option>
                    <option value="disqualified">✕ Disqualified</option>
                    <option value="both">✓ + ✕ Both</option>
                  </select>
                </td>
                <td className="border-b border-gray-100 px-3 py-3">
                  <textarea
                    value={drafts[submission.id]?.outboundCallNote ?? ""}
                    onChange={(e) => {
                      const nextDraft = {
                        outboundCallNote: e.target.value,
                        status:
                          drafts[submission.id]?.status ??
                          (submission.outbound_called
                            ? submission.disqualified
                              ? "both"
                              : "called"
                            : submission.disqualified
                              ? "disqualified"
                              : "none"),
                      };

                      setDrafts((current) => ({
                        ...current,
                        [submission.id]: nextDraft,
                      }));

                      setMessages((current) => ({
                        ...current,
                        [submission.id]: "กำลังพิมพ์...",
                      }));

                      scheduleNoteSave(submission.id, nextDraft);
                    }}
                    placeholder="เช่น โทรแล้ว นัดคุยอีกครั้งวันศุกร์"
                    className="min-h-[76px] w-[220px] rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="min-h-[20px] text-sm text-gray-500">
                      {messages[submission.id] ?? ""}
                    </div>
                    {isSaving ? (
                      <div className="shrink-0 text-sm text-gray-500">
                        กำลังบันทึก...
                      </div>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
