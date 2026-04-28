"use client";

import { useMemo, useState } from "react";
import type { Submission } from "./types";

const ADMIN_COURSE_OPTIONS = [
  "Claude COWORK - Live Session 60 นาที",
  "Claude COWORK - Bootcamp 4 สัปดาห์",
  "คอร์ส Quick Content - แบบ Basic",
  "คอร์ส Quick Content - แบบ VIP",
  "Ebook Ai สำหรับเด็ก",
] as const;

const CUSTOM_COURSE_OPTION = "__custom__";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
}) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "-"
      : typeof value === "boolean"
        ? value
          ? "ใช่"
          : "ไม่ใช่"
        : String(value);

  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-100 py-2 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="break-words whitespace-pre-wrap text-sm text-gray-900">
        {displayValue}
      </div>
    </div>
  );
}

function Badge({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "green" | "yellow" | "red" | "blue";
}) {
  const toneClass =
    tone === "green"
      ? "border-green-200 bg-green-100 text-green-800"
      : tone === "yellow"
        ? "border-yellow-200 bg-yellow-100 text-yellow-800"
        : tone === "red"
          ? "border-red-200 bg-red-100 text-red-800"
          : tone === "blue"
            ? "border-blue-200 bg-blue-100 text-blue-800"
            : "border-gray-200 bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function formatInvoiceType(invoiceType: string | null) {
  if (invoiceType === "personal") return "บุคคลธรรมดา";
  if (invoiceType === "company") return "นิติบุคคล";
  return "-";
}

function formatSubmittedAt(createdAt: string | null) {
  if (!createdAt) return "-";

  return new Date(createdAt).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type AdminTab = "all" | "invoice" | "hidden";

type FollowUpState = {
  outboundCalled: boolean;
  outboundCallNote: string;
  disqualified: boolean;
};

type CourseDraftState = {
  selectedOption: string;
  customValue: string;
};

function createCourseDraft(course: string | null): CourseDraftState {
  const trimmedCourse = course?.trim() ?? "";

  if (ADMIN_COURSE_OPTIONS.includes(trimmedCourse as (typeof ADMIN_COURSE_OPTIONS)[number])) {
    return {
      selectedOption: trimmedCourse,
      customValue: "",
    };
  }

  return {
    selectedOption: CUSTOM_COURSE_OPTION,
    customValue: trimmedCourse,
  };
}

function getFinalCourseValue(draft: CourseDraftState) {
  return draft.selectedOption === CUSTOM_COURSE_OPTION
    ? draft.customValue.trim()
    : draft.selectedOption.trim();
}

function FollowUpPanel({
  draft,
  isSaving,
  saveMessage,
  onChange,
  onSave,
}: {
  draft: FollowUpState;
  isSaving: boolean;
  saveMessage: string;
  onChange: (next: FollowUpState) => void;
  onSave: () => void;
}) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">ติดตามโดย Closer</h3>
        <p className="mt-1 text-sm text-gray-500">
          บันทึกสถานะการโทรออกและอัปเดตหลังคุยกับลูกค้า
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={draft.outboundCalled}
            onChange={(e) =>
              onChange({
                ...draft,
                outboundCalled: e.target.checked,
              })
            }
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />

          <div>
            <div className="font-medium text-gray-900">โทรออกแล้ว</div>
            <div className="text-sm text-gray-500">
              ติ๊กเมื่อ Closer โทรติดตามลูกค้าแล้ว
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={draft.disqualified}
            onChange={(e) =>
              onChange({
                ...draft,
                disqualified: e.target.checked,
              })
            }
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />

          <div>
            <div className="font-medium text-gray-900">Disqualified</div>
            <div className="text-sm text-gray-500">
              ติ๊กเมื่อลูกค้าคนนี้ไม่ต้องติดตามต่อแล้ว
            </div>
          </div>
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            อัปเดตหลังโทรออก
          </label>
          <textarea
            value={draft.outboundCallNote}
            onChange={(e) =>
              onChange({
                ...draft,
                outboundCallNote: e.target.value,
              })
            }
            placeholder="เช่น โทรแล้ว นัดคุยอีกครั้งวันศุกร์"
            className="min-h-[180px] w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "กำลังบันทึก..." : "บันทึกการติดตาม"}
        </button>

        {saveMessage ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            {saveMessage}
          </div>
        ) : null}

      </div>
    </aside>
  );
}

export default function AdminSubmissionsList({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("all");
  const [items, setItems] = useState(submissions);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [savingFollowUpId, setSavingFollowUpId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [savingCourseId, setSavingCourseId] = useState<string | null>(null);
  const [followUpDrafts, setFollowUpDrafts] = useState<
    Record<string, FollowUpState>
  >(() =>
    Object.fromEntries(
      submissions.map((submission) => [
        submission.id,
        {
          outboundCalled: submission.outbound_called === true,
          outboundCallNote: submission.outbound_call_note ?? "",
          disqualified: submission.disqualified === true,
        },
      ])
    )
  );
  const [saveMessages, setSaveMessages] = useState<Record<string, string>>({});
  const [courseDrafts, setCourseDrafts] = useState<Record<string, CourseDraftState>>(
    () =>
      Object.fromEntries(
        submissions.map((submission) => [
          submission.id,
          createCourseDraft(submission.course),
        ])
      )
  );
  const [courseMessages, setCourseMessages] = useState<Record<string, string>>({});

  const visibleSubmissions = useMemo(() => {
    if (activeTab === "hidden") {
      return items.filter((submission) => submission.is_hidden_in_admin === true);
    }

    let filtered = items.filter(
      (submission) => submission.is_hidden_in_admin !== true
    );

    if (activeTab === "invoice") {
      filtered = filtered.filter((submission) => submission.wants_invoice === true);
    }

    return filtered;
  }, [items, activeTab]);

  const invoiceCount = items.filter(
    (submission) =>
      submission.wants_invoice === true && submission.is_hidden_in_admin !== true
  ).length;

  const hiddenCount = items.filter(
    (submission) => submission.is_hidden_in_admin === true
  ).length;

  const activeCount = items.filter(
    (submission) => submission.is_hidden_in_admin !== true
  ).length;

  const toggleHidden = async (id: string, hidden: boolean) => {
    try {
      setLoadingId(id);

      const res = await fetch("/api/admin-hide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          hidden,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      setItems((current) =>
        current.map((submission) =>
          submission.id === id
            ? { ...submission, is_hidden_in_admin: hidden }
            : submission
        )
      );
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoadingId(null);
    }
  };

  const updateDraft = (id: string, next: FollowUpState) => {
    setFollowUpDrafts((current) => ({
      ...current,
      [id]: next,
    }));

    setSaveMessages((current) => ({
      ...current,
      [id]: "",
    }));
  };

  const startEditingCourse = (id: string, course: string | null) => {
    setEditingCourseId(id);
    setCourseDrafts((current) => ({
      ...current,
      [id]: createCourseDraft(course),
    }));
    setCourseMessages((current) => ({
      ...current,
      [id]: "",
    }));
  };

  const cancelEditingCourse = (id: string, course: string | null) => {
    setEditingCourseId((current) => (current === id ? null : current));
    setCourseDrafts((current) => ({
      ...current,
      [id]: createCourseDraft(course),
    }));
    setCourseMessages((current) => ({
      ...current,
      [id]: "",
    }));
  };

  const updateCourseDraft = (id: string, next: CourseDraftState) => {
    setCourseDrafts((current) => ({
      ...current,
      [id]: next,
    }));
    setCourseMessages((current) => ({
      ...current,
      [id]: "",
    }));
  };

  const saveCourse = async (id: string) => {
    const draft = courseDrafts[id];

    if (!draft) {
      return;
    }

    const finalCourse = getFinalCourseValue(draft);

    if (!finalCourse) {
      setCourseMessages((current) => ({
        ...current,
        [id]: "กรุณาเลือกหรือกรอกชื่อคอร์ส",
      }));
      return;
    }

    try {
      setSavingCourseId(id);
      setCourseMessages((current) => ({
        ...current,
        [id]: "",
      }));

      const res = await fetch("/api/admin-update-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          course: finalCourse,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCourseMessages((current) => ({
          ...current,
          [id]: data.error || "บันทึกคอร์สไม่สำเร็จ",
        }));
        return;
      }

      setItems((current) =>
        current.map((submission) =>
          submission.id === id
            ? {
                ...submission,
                course: finalCourse,
              }
            : submission
        )
      );

      setCourseDrafts((current) => ({
        ...current,
        [id]: createCourseDraft(finalCourse),
      }));
      setCourseMessages((current) => ({
        ...current,
        [id]: "บันทึกคอร์สเรียบร้อยแล้ว",
      }));
      setEditingCourseId((current) => (current === id ? null : current));
    } catch {
      setCourseMessages((current) => ({
        ...current,
        [id]: "เกิดข้อผิดพลาดในการบันทึก",
      }));
    } finally {
      setSavingCourseId(null);
    }
  };

  const saveFollowUp = async (id: string) => {
    const draft = followUpDrafts[id];

    if (!draft) {
      return;
    }

    try {
      setSavingFollowUpId(id);
      setSaveMessages((current) => ({
        ...current,
        [id]: "",
      }));

      const res = await fetch("/api/admin-follow-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          outboundCalled: draft.outboundCalled,
          outboundCallNote: draft.outboundCallNote,
          disqualified: draft.disqualified,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveMessages((current) => ({
          ...current,
          [id]: data.error || "บันทึกไม่สำเร็จ",
        }));
        return;
      }

      setItems((current) =>
        current.map((submission) =>
          submission.id === id
            ? {
                ...submission,
                outbound_called: draft.outboundCalled,
                outbound_call_note: draft.outboundCallNote.trim(),
                disqualified: draft.disqualified,
              }
            : submission
        )
      );

      setFollowUpDrafts((current) => ({
        ...current,
        [id]: {
          outboundCalled: draft.outboundCalled,
          outboundCallNote: draft.outboundCallNote.trim(),
          disqualified: draft.disqualified,
        },
      }));

      setSaveMessages((current) => ({
        ...current,
        [id]: "บันทึกการติดตามเรียบร้อยแล้ว",
      }));
    } catch {
      setSaveMessages((current) => ({
        ...current,
        [id]: "เกิดข้อผิดพลาดในการบันทึก",
      }));
    } finally {
      setSavingFollowUpId(null);
    }
  };

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        ยังไม่มีข้อมูลส่งเข้ามา
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">แสดงอยู่ {activeCount} รายการ</Badge>
            <Badge tone="green">ต้องการใบกำกับภาษี {invoiceCount} รายการ</Badge>
            <Badge tone="gray">ซ่อนแล้ว {hiddenCount} รายการ</Badge>
            <Badge tone="gray">ทั้งหมด {items.length} รายการ</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                activeTab === "all"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              ทั้งหมด
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("invoice")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                activeTab === "invoice"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              เฉพาะคนที่ขอใบกำกับภาษี
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("hidden")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                activeTab === "hidden"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              รายการที่ซ่อน
            </button>
          </div>
        </div>
      </div>

      {!visibleSubmissions.length ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
          {activeTab === "hidden"
            ? "ยังไม่มีรายการที่ถูกซ่อน"
            : "ไม่มีรายการที่ต้องแสดง"}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleSubmissions.map((submission, index) => {
            const fullName =
              [submission.first_name, submission.last_name]
                .filter(Boolean)
                .join(" ")
                .trim() || submission.name || "-";

            const summaryLine = [
              submission.nickname ? `ชื่อเล่น: ${submission.nickname}` : null,
              submission.course ? `คอร์ส: ${submission.course}` : null,
              submission.phone ? `โทร: ${submission.phone}` : null,
            ]
              .filter(Boolean)
              .join(" • ");

            const isHiddenTab = activeTab === "hidden";
            const isLoading = loadingId === submission.id;
            const isEditingCourse = editingCourseId === submission.id;
            const isSavingCourse = savingCourseId === submission.id;
            const followUpDraft = followUpDrafts[submission.id] ?? {
              outboundCalled: submission.outbound_called === true,
              outboundCallNote: submission.outbound_call_note ?? "",
              disqualified: submission.disqualified === true,
            };
            const courseDraft = courseDrafts[submission.id] ??
              createCourseDraft(submission.course);

            return (
              <details
                key={submission.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm text-white">
                          {index + 1}
                        </span>

                        <h2 className="break-words text-lg font-semibold text-gray-900">
                          {fullName}
                        </h2>

                        {submission.wants_invoice ? (
                          <Badge tone="green">
                            ต้องการใบกำกับภาษี
                            {submission.invoice_type
                              ? ` • ${formatInvoiceType(submission.invoice_type)}`
                              : ""}
                          </Badge>
                        ) : null}

                        {submission.outbound_called ? (
                          <Badge tone="yellow">โทรติดตามแล้ว</Badge>
                        ) : null}

                        {submission.disqualified ? (
                          <Badge tone="red">Disqualified</Badge>
                        ) : null}

                        {isHiddenTab ? <Badge tone="gray">ซ่อนอยู่</Badge> : null}
                      </div>

                      <div className="mt-2 break-words text-sm text-gray-600">
                        {submission.email || "-"}
                      </div>

                      {summaryLine ? (
                        <div className="mt-1 break-words text-sm text-gray-500">
                          {summaryLine}
                        </div>
                      ) : null}

                      <div className="mt-2 text-xs text-gray-400">
                        ส่งเมื่อ: {formatSubmittedAt(submission.created_at)}
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 text-sm text-gray-500 transition-transform group-open:rotate-180">
                      ▼
                    </div>
                  </summary>

                  <div className="border-t border-gray-200 px-5 pb-5">
                    <div className="flex justify-end pt-4">
                      {isHiddenTab ? (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => toggleHidden(submission.id, false)}
                          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isLoading ? "กำลังอัปเดต..." : "เอากลับมา"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => toggleHidden(submission.id, true)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isLoading ? "กำลังอัปเดต..." : "ซ่อน"}
                        </button>
                      )}
                    </div>

                    <div className="grid gap-6 pt-4 xl:grid-cols-[minmax(0,2fr)_340px]">
                      <div>
                        <div className="mb-6">
                          <h3 className="mb-3 font-semibold text-gray-900">
                            ข้อมูลทั่วไป
                          </h3>
                          <div className="rounded-xl bg-gray-50 p-4">
                            <div className="border-b border-gray-100 py-2">
                              <div className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr] md:gap-4">
                                <div className="text-sm text-gray-500">คอร์สที่สั่งซื้อ</div>
                                <div className="space-y-3">
                                  {isEditingCourse ? (
                                    <>
                                      <select
                                        value={courseDraft.selectedOption}
                                        onChange={(e) =>
                                          updateCourseDraft(submission.id, {
                                            ...courseDraft,
                                            selectedOption: e.target.value,
                                          })
                                        }
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                                      >
                                        {ADMIN_COURSE_OPTIONS.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                        <option value={CUSTOM_COURSE_OPTION}>
                                          อื่น ๆ
                                        </option>
                                      </select>

                                      {courseDraft.selectedOption === CUSTOM_COURSE_OPTION ? (
                                        <input
                                          value={courseDraft.customValue}
                                          onChange={(e) =>
                                            updateCourseDraft(submission.id, {
                                              ...courseDraft,
                                              customValue: e.target.value,
                                            })
                                          }
                                          placeholder="กรอกชื่อคอร์สที่ถูกต้อง"
                                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                                        />
                                      ) : null}

                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          type="button"
                                          disabled={isSavingCourse}
                                          onClick={() => saveCourse(submission.id)}
                                          className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          {isSavingCourse ? "กำลังบันทึก..." : "บันทึก"}
                                        </button>
                                        <button
                                          type="button"
                                          disabled={isSavingCourse}
                                          onClick={() =>
                                            cancelEditingCourse(
                                              submission.id,
                                              submission.course
                                            )
                                          }
                                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                          ยกเลิก
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div className="break-words whitespace-pre-wrap text-sm text-gray-900">
                                        {submission.course || "-"}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          startEditingCourse(
                                            submission.id,
                                            submission.course
                                          )
                                        }
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                      >
                                        แก้ไขคอร์ส
                                      </button>
                                    </div>
                                  )}

                                  {courseMessages[submission.id] ? (
                                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                                      {courseMessages[submission.id]}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <InfoRow
                              label="ชื่อผู้รับสินค้า"
                              value={submission.first_name}
                            />
                            <InfoRow label="นามสกุล" value={submission.last_name} />
                            <InfoRow label="ชื่อเล่น" value={submission.nickname} />
                            <InfoRow label="อีเมล" value={submission.email} />
                            <InfoRow label="เบอร์โทร" value={submission.phone} />
                            <InfoRow
                              label="ชำระเงินผ่าน"
                              value={submission.payment_method}
                            />
                            <InfoRow
                              label="วัน/เดือน/ปีเกิด"
                              value={submission.birth_date}
                            />
                            <InfoRow label="อาชีพ" value={submission.occupation} />
                            <InfoRow
                              label="ยอมรับเงื่อนไข"
                              value={submission.accepted_terms}
                            />
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="mb-3 font-semibold text-gray-900">
                            ข้อมูลธุรกิจ
                          </h3>
                          <div className="rounded-xl bg-gray-50 p-4">
                            <InfoRow
                              label="รายละเอียดธุรกิจ"
                              value={submission.business_description}
                            />
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="mb-3 font-semibold text-gray-900">
                            ข้อมูลใบกำกับภาษี
                          </h3>
                          <div className="rounded-xl bg-gray-50 p-4">
                            <InfoRow
                              label="ต้องการใบกำกับภาษี"
                              value={submission.wants_invoice}
                            />
                            <InfoRow
                              label="ประเภทใบกำกับภาษี"
                              value={formatInvoiceType(submission.invoice_type)}
                            />
                            <InfoRow
                              label="ชื่อสำหรับออกใบกำกับภาษี"
                              value={submission.personal_tax_name}
                            />
                            <InfoRow
                              label="เลขประจำตัวผู้เสียภาษี (บุคคลธรรมดา)"
                              value={submission.personal_tax_id}
                            />
                            <InfoRow
                              label="ที่อยู่ (บุคคลธรรมดา)"
                              value={submission.personal_address}
                            />
                            <InfoRow
                              label="อีเมล e-Tax (บุคคลธรรมดา)"
                              value={submission.personal_invoice_email}
                            />
                            <InfoRow label="ชื่อบริษัท" value={submission.company_name} />
                            <InfoRow
                              label="เลขประจำตัวผู้เสียภาษี (บริษัท)"
                              value={submission.company_tax_id}
                            />
                            <InfoRow
                              label="ที่อยู่บริษัท"
                              value={submission.company_address}
                            />
                            <InfoRow
                              label="อีเมล e-Tax (บริษัท)"
                              value={submission.company_invoice_email}
                            />
                            <InfoRow
                              label="ชื่อผู้ติดต่อ"
                              value={submission.company_contact_name}
                            />
                            <InfoRow
                              label="เบอร์โทรผู้ติดต่อ"
                              value={submission.company_contact_phone}
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-3 font-semibold text-gray-900">
                            ลายเซ็น
                          </h3>
                          <div className="rounded-xl bg-gray-50 p-4">
                            {submission.signature_url ? (
                              <div className="space-y-3">
                                <a
                                  href={submission.signature_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="break-all text-sm underline"
                                >
                                  เปิดลิงก์ลายเซ็น
                                </a>

                                <img
                                  src={submission.signature_url}
                                  alt="Signature"
                                  className="max-w-full rounded-lg border border-gray-300 bg-white"
                                />
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                ไม่มีลายเซ็น
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <FollowUpPanel
                        draft={followUpDraft}
                        isSaving={savingFollowUpId === submission.id}
                        saveMessage={saveMessages[submission.id] ?? ""}
                        onChange={(next) => updateDraft(submission.id, next)}
                        onSave={() => saveFollowUp(submission.id)}
                      />
                    </div>
                  </div>
                </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
