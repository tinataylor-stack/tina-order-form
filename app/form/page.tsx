"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BirthDatePicker from "@/components/BirthDatePicker";
import SignatureCanvas from "react-signature-canvas";

export default function FormPage() {
  const router = useRouter();
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const startSmartCourseName = 'Start Smart | เริ่มให้ถูกทาง แบบคนที่ "รู้เกม"';
  const startSmartTiers = [
    "แบบวิเคราะห์ให้ 499 บาท",
    "แบบเอาจริง 2,990 บาท",
    "แบบใกล้ชิด 29,990 บาท",
  ];
  const quickContentCourseName = "คอร์ส Quick Content";
  const quickContentTiers = ["แบบ Basic", "แบบ VIP"];

  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const [course, setCourse] = useState("");
  const [startSmartTier, setStartSmartTier] = useState("");
  const [quickContentTier, setQuickContentTier] = useState("");
  const [otherCourse, setOtherCourse] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");
  const [otherPaymentMethod, setOtherPaymentMethod] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [occupation, setOccupation] = useState("");
  const [otherOccupation, setOtherOccupation] = useState("");

  const [businessDescription, setBusinessDescription] = useState("");

  const [wantsInvoice, setWantsInvoice] = useState("");
  const [invoiceType, setInvoiceType] = useState("");

  const [personalTaxName, setPersonalTaxName] = useState("");
  const [personalTaxId, setPersonalTaxId] = useState("");
  const [personalAddress, setPersonalAddress] = useState("");
  const [personalInvoiceEmail, setPersonalInvoiceEmail] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyTaxId, setCompanyTaxId] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyInvoiceEmail, setCompanyInvoiceEmail] = useState("");
  const [companyContactName, setCompanyContactName] = useState("");
  const [companyContactPhone, setCompanyContactPhone] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isBusinessOwner = occupation === "business-owner";
  const needsInvoice = wantsInvoice === "yes";
  const isPersonalInvoice = invoiceType === "personal";
  const isCompanyInvoice = invoiceType === "company";
  const isOtherCourse = course === "other";
  const isStartSmartSystem = course === startSmartCourseName;
  const isQuickContent = course === quickContentCourseName;
  const finalCourse = isOtherCourse
    ? otherCourse.trim()
    : isStartSmartSystem && startSmartTier
      ? `${startSmartCourseName} - ${startSmartTier}`
      : isQuickContent && quickContentTier
        ? `${quickContentCourseName} - ${quickContentTier}`
      : course;

  const handleCourseChange = (value: string) => {
    setCourse(value);

    if (value !== startSmartCourseName) {
      setStartSmartTier("");
    }

    if (value !== quickContentCourseName) {
      setQuickContentTier("");
    }

    if (value !== "other") {
      setOtherCourse("");
    }
  };

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateBeforeNext = () => {
    if (step === 1) {
      if (!course) {
        setMessage("กรุณาเลือกคอร์สที่สั่งซื้อ");
        return false;
      }

      if (isOtherCourse && !otherCourse.trim()) {
        setMessage("กรุณาระบุคอร์สหรือสินค้าที่สั่งซื้อ");
        return false;
      }

      if (isStartSmartSystem && !startSmartTier) {
        setMessage("กรุณาเลือกระดับของ Start Smart System");
        return false;
      }

      if (isQuickContent && !quickContentTier) {
        setMessage("กรุณาเลือกระดับของคอร์ส Quick Content");
        return false;
      }
    }

    if (step === 2) {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
        setMessage("กรุณากรอกข้อมูลในหน้านี้ให้ครบ");
        return false;
      }

      if (!validateEmail(email)) {
        setMessage("กรุณากรอกอีเมลให้ถูกต้อง");
        return false;
      }
    }

    if (step === 3) {
      if (!paymentMethod || !birthDate || !occupation) {
        setMessage("กรุณากรอกข้อมูลในหน้านี้ให้ครบ");
        return false;
      }

      if (paymentMethod === "other" && !otherPaymentMethod.trim()) {
        setMessage("กรุณาระบุช่องทางการชำระเงิน");
        return false;
      }

      if (occupation === "other" && !otherOccupation.trim()) {
        setMessage("กรุณาระบุอาชีพ");
        return false;
      }
    }

    if (step === 4 && isBusinessOwner) {
      if (!businessDescription.trim()) {
        setMessage("กรุณาบรรยายธุรกิจของคุณ");
        return false;
      }
    }

    if (step === 5 && !wantsInvoice) {
      setMessage("กรุณาเลือกว่าต้องการใบกำกับภาษีหรือไม่");
      return false;
    }

    if (step === 6 && needsInvoice && !invoiceType) {
      setMessage("กรุณาเลือกประเภทใบกำกับภาษี");
      return false;
    }

    if (step === 7 && needsInvoice && isPersonalInvoice) {
      if (
        !personalTaxName.trim() ||
        !personalTaxId.trim() ||
        !personalAddress.trim() ||
        !personalInvoiceEmail.trim()
      ) {
        setMessage("กรุณากรอกข้อมูลใบกำกับภาษีให้ครบ");
        return false;
      }

      if (!validateEmail(personalInvoiceEmail)) {
        setMessage("กรุณากรอกอีเมลสำหรับ e-Tax ให้ถูกต้อง");
        return false;
      }
    }

    if (step === 7 && needsInvoice && isCompanyInvoice) {
      if (
        !companyName.trim() ||
        !companyTaxId.trim() ||
        !companyAddress.trim() ||
        !companyInvoiceEmail.trim() ||
        !companyContactName.trim() ||
        !companyContactPhone.trim()
      ) {
        setMessage("กรุณากรอกข้อมูลใบกำกับภาษีให้ครบ");
        return false;
      }

      if (!validateEmail(companyInvoiceEmail)) {
        setMessage("กรุณากรอกอีเมลสำหรับ e-Tax ให้ถูกต้อง");
        return false;
      }
    }

    setMessage("");
    return true;
  };

  const handleNext = () => {
    if (!validateBeforeNext()) return;

    if (step === 3 && !isBusinessOwner) {
      setStep(5);
      return;
    }

    if (step === 5 && wantsInvoice === "no") {
      setStep(8);
      return;
    }

    if (step === 6 && needsInvoice) {
      setStep(7);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setMessage("");

    if (step === 5 && !isBusinessOwner) {
      setStep(3);
      return;
    }

    if (step === 8 && wantsInvoice === "no") {
      setStep(5);
      return;
    }

    if (step === 7) {
      setStep(6);
      return;
    }

    setStep((prev) => prev - 1);
  };

  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setMessage("กรุณายอมรับเงื่อนไขและข้อตกลงการให้บริการ");
      return;
    }

    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setMessage("กรุณาเซ็นลายเซ็นก่อนส่งข้อมูล");
      return;
    }

    const finalSignature = sigCanvasRef.current.toDataURL("image/png");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: finalCourse,
          firstName,
          lastName,
          nickname,
          email,
          phone,
          paymentMethod,
          otherPaymentMethod,
          birthDate,
          occupation,
          otherOccupation,
          businessDescription,
          wantsInvoice: wantsInvoice === "yes",
          invoiceType,
          personalTaxName,
          personalTaxId,
          personalAddress,
          personalInvoiceEmail,
          companyName,
          companyTaxId,
          companyAddress,
          companyInvoiceEmail,
          companyContactName,
          companyContactPhone,
          acceptedTerms,
          signatureData: finalSignature,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push(
        `/thank-you?nickname=${encodeURIComponent(nickname.trim() || "คนเก่ง")}`
      );
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const radioCardClass = (checked: boolean) =>
    `flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
      checked
        ? "border-black bg-gray-50"
        : "border-gray-300 bg-white hover:border-gray-400"
    }`;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            แบบฟอร์มลงทะเบียน
          </h1>
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
              <span>
                หน้า {step} จาก {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-black transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">เลือกคอร์สที่สั่งซื้อ</h2>
                <p className="mt-1 text-sm text-gray-500">
                  กรุณาเลือกสินค้าที่ต้องการลงทะเบียน
                </p>
              </div>

              <div className="space-y-3">
                <label className={radioCardClass(isStartSmartSystem)}>
                  <input
                    type="radio"
                    name="course"
                    value={startSmartCourseName}
                    checked={isStartSmartSystem}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="w-full">
                    <div className="font-medium text-gray-900">{startSmartCourseName}</div>
                    {isStartSmartSystem && (
                      <div className="mt-3 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-sm text-gray-600">เลือกระดับที่ต้องการ</p>
                        {startSmartTiers.map((tier) => (
                          <label
                            key={tier}
                            className={radioCardClass(startSmartTier === tier)}
                          >
                            <input
                              type="radio"
                              name="startSmartTier"
                              value={tier}
                              checked={startSmartTier === tier}
                              onChange={(e) => setStartSmartTier(e.target.value)}
                              className="mt-1"
                            />
                            <span className="font-medium text-gray-900">{tier}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </label>

                <label className={radioCardClass(isQuickContent)}>
                  <input
                    type="radio"
                    name="course"
                    value={quickContentCourseName}
                    checked={isQuickContent}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="w-full">
                    <div className="font-medium text-gray-900">{quickContentCourseName}</div>
                    {isQuickContent && (
                      <div className="mt-3 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-sm text-gray-600">เลือกระดับที่ต้องการ</p>
                        {quickContentTiers.map((tier) => (
                          <label
                            key={tier}
                            className={radioCardClass(quickContentTier === tier)}
                          >
                            <input
                              type="radio"
                              name="quickContentTier"
                              value={tier}
                              checked={quickContentTier === tier}
                              onChange={(e) => setQuickContentTier(e.target.value)}
                              className="mt-1"
                            />
                            <span className="font-medium text-gray-900">{tier}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </label>

                <label className={radioCardClass(course === "Ebook Ai สำหรับเด็ก")}>
                  <input
                    type="radio"
                    name="course"
                    value="Ebook Ai สำหรับเด็ก"
                    checked={course === "Ebook Ai สำหรับเด็ก"}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="mt-1"
                  />
                  <span className="font-medium text-gray-900">Ebook Ai สำหรับเด็ก</span>
                </label>

                <label className={radioCardClass(isOtherCourse)}>
                  <input
                    type="radio"
                    name="course"
                    value="other"
                    checked={isOtherCourse}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="mt-1"
                  />
                  <div className="w-full">
                    <div className="font-medium text-gray-900">อื่น ๆ โปรดระบุ</div>
                    {isOtherCourse && (
                      <input
                        className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                        value={otherCourse}
                        onChange={(e) => setOtherCourse(e.target.value)}
                        placeholder="กรุณาระบุคอร์สหรือสินค้า"
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">ข้อมูลผู้สั่งซื้อ</h2>
                <p className="mt-1 text-sm text-gray-500">
                  กรอกข้อมูลติดต่อสำหรับการลงทะเบียน
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    ชื่อผู้รับสินค้า
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    นามสกุล
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">ชื่อเล่น</label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
                <input
                  type="email"
                  inputMode="email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">เบอร์โทร</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={phone}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    setPhone(digitsOnly);
                  }}
                  placeholder="0812345678"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">ข้อมูลเพิ่มเติม</h2>
                <p className="mt-1 text-sm text-gray-500">
                  แจ้งรายละเอียดการชำระเงิน วันเกิด และอาชีพ
                </p>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  ชำระเงินผ่านช่องทางใด
                </label>

                <div className="space-y-3">
                  <label className={radioCardClass(paymentMethod === "โอนผ่านบัญชีธนาคาร")}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="โอนผ่านบัญชีธนาคาร"
                      checked={paymentMethod === "โอนผ่านบัญชีธนาคาร"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <span className="font-medium text-gray-900">โอนผ่านบัญชีธนาคาร</span>
                  </label>

                  <label className={radioCardClass(paymentMethod === "ตัดบัตร")}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ตัดบัตร"
                      checked={paymentMethod === "ตัดบัตร"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <span className="font-medium text-gray-900">ตัดบัตร</span>
                  </label>

                  <label className={radioCardClass(paymentMethod === "other")}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="other"
                      checked={paymentMethod === "other"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="w-full">
                      <div className="font-medium text-gray-900">อื่น ๆ โปรดระบุ</div>
                      {paymentMethod === "other" && (
                        <input
                          className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                          value={otherPaymentMethod}
                          onChange={(e) => setOtherPaymentMethod(e.target.value)}
                          placeholder="กรุณาระบุ"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <BirthDatePicker value={birthDate} onChange={setBirthDate} />

              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">อาชีพ</label>

                <div className="space-y-3">
                  <label className={radioCardClass(occupation === "business-owner")}>
                    <input
                      type="radio"
                      name="occupation"
                      value="business-owner"
                      checked={occupation === "business-owner"}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="mt-1"
                    />
                    <span className="font-medium text-gray-900">
                      เจ้าของกิจการ / พ่อค้าแม่ค้าออนไลน์
                    </span>
                  </label>

                  <label className={radioCardClass(occupation === "other")}>
                    <input
                      type="radio"
                      name="occupation"
                      value="other"
                      checked={occupation === "other"}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="mt-1"
                    />
                    <div className="w-full">
                      <div className="font-medium text-gray-900">อื่น ๆ โปรดระบุ</div>
                      {occupation === "other" && (
                        <input
                          className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                          value={otherOccupation}
                          onChange={(e) => setOtherOccupation(e.target.value)}
                          placeholder="กรุณาระบุ"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 4 && isBusinessOwner && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">ข้อมูลธุรกิจ</h2>
                <p className="mt-1 text-sm text-gray-500">
                  สำหรับผู้ที่เป็นเจ้าของกิจการ
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  บรรยายสิ่งที่ธุรกิจคุณทำมา 1 - 3 ประโยค
                </label>
                <textarea
                  className="min-h-[160px] w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="ตัวอย่าง : ธุรกิจของเราช่วยให้หมอฟันได้ลูกค้าเพิ่มขึ้นผ่านการยิงแอด คิดค่าบริการเดือนละ 60,000 บาท/เดือน"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">ใบกำกับภาษี</h2>
                <p className="mt-1 text-sm text-gray-500">
                  เลือกว่าคุณต้องการใบกำกับภาษีหรือไม่
                </p>
              </div>

              <div className="space-y-3">
                <label className={radioCardClass(wantsInvoice === "yes")}>
                  <input
                    type="radio"
                    name="wantsInvoice"
                    value="yes"
                    checked={wantsInvoice === "yes"}
                    onChange={(e) => setWantsInvoice(e.target.value)}
                    className="mt-1"
                  />
                  <span className="font-medium text-gray-900">ต้องการ</span>
                </label>

                <label className={radioCardClass(wantsInvoice === "no")}>
                  <input
                    type="radio"
                    name="wantsInvoice"
                    value="no"
                    checked={wantsInvoice === "no"}
                    onChange={(e) => setWantsInvoice(e.target.value)}
                    className="mt-1"
                  />
                  <span className="font-medium text-gray-900">ไม่ต้องการ</span>
                </label>
              </div>
            </div>
          )}

          {step === 6 && needsInvoice && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">ประเภทใบกำกับภาษี</h2>
                <p className="mt-1 text-sm text-gray-500">
                  ระบุว่าต้องการออกในนามบุคคลธรรมดาหรือนิติบุคคล
                </p>
              </div>

              <div className="space-y-3">
                <label className={radioCardClass(invoiceType === "personal")}>
                  <input
                    type="radio"
                    name="invoiceType"
                    value="personal"
                    checked={invoiceType === "personal"}
                    onChange={(e) => setInvoiceType(e.target.value)}
                    className="mt-1"
                  />
                  <span className="font-medium text-gray-900">บุคคลธรรมดา</span>
                </label>

                <label className={radioCardClass(invoiceType === "company")}>
                  <input
                    type="radio"
                    name="invoiceType"
                    value="company"
                    checked={invoiceType === "company"}
                    onChange={(e) => setInvoiceType(e.target.value)}
                    className="mt-1"
                  />
                  <span className="font-medium text-gray-900">นิติบุคคล</span>
                </label>
              </div>
            </div>
          )}

          {step === 7 && needsInvoice && isPersonalInvoice && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">ข้อมูลใบกำกับภาษี</h2>
                <p className="mt-1 text-sm text-gray-500">สำหรับบุคคลธรรมดา</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ชื่อสำหรับออกใบกำกับภาษี
                </label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={personalTaxName}
                  onChange={(e) => setPersonalTaxName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  เลขประจำตัวผู้เสียภาษี
                </label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={personalTaxId}
                  onChange={(e) => setPersonalTaxId(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">ที่อยู่</label>
                <textarea
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={personalAddress}
                  onChange={(e) => setPersonalAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  อีเมลสำหรับจัดส่งใบกำกับภาษีผ่านระบบ e-Tax
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={personalInvoiceEmail}
                  onChange={(e) => setPersonalInvoiceEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 7 && needsInvoice && isCompanyInvoice && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">ข้อมูลใบกำกับภาษี</h2>
                <p className="mt-1 text-sm text-gray-500">สำหรับนิติบุคคล</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ชื่อบริษัท
                </label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  เลขประจำตัวผู้เสียภาษี
                </label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ที่อยู่บริษัท
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  อีเมลสำหรับจัดส่งใบกำกับภาษีผ่านระบบ e-Tax
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={companyInvoiceEmail}
                  onChange={(e) => setCompanyInvoiceEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ชื่อผู้ติดต่อ สำหรับใบกำกับภาษีและใบหัก ณ ที่จ่าย
                </label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={companyContactName}
                  onChange={(e) => setCompanyContactName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  value={companyContactPhone}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    setCompanyContactPhone(digitsOnly);
                  }}
                />
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  ยืนยันข้อมูล
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  เซ็นชื่อและยอมรับเงื่อนไขก่อนส่งแบบฟอร์ม
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300"
                  />

                  <div className="text-sm leading-6 text-gray-700">
                    ฉันยอมรับ{" "}
                    <a
                      href="https://www.tina-academy.com/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-black underline underline-offset-2"
                    >
                      เงื่อนไขและข้อตกลงการให้บริการ
                    </a>
                  </div>
                </label>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <label className="block font-medium text-gray-900">ลายเซ็น</label>
                    <p className="text-sm text-gray-500">เซ็นในกรอบด้านล่าง</p>
                  </div>

                  <button
                    type="button"
                    onClick={clearSignature}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
                  <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor="black"
                    canvasProps={{
                      width: 700,
                      height: 220,
                      className: "h-[220px] w-full",
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  การกดยืนยันถือว่าคุณรับทราบรายละเอียดและยืนยันความถูกต้องของข้อมูลที่กรอก
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                ย้อนกลับ
              </button>
            )}

            {step < 8 && (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
              >
                ถัดไป
              </button>
            )}

            {step === 8 && (
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "กำลังส่ง..." : "ยืนยันและส่งข้อมูล"}
              </button>
            )}
          </div>

          {message && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
