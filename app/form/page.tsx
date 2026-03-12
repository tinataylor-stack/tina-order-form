"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BirthDatePicker from "@/components/BirthDatePicker";
import SignatureCanvas from "react-signature-canvas";

export default function FormPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [course, setCourse] = useState("");

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
  const [signatureData, setSignatureData] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sigCanvasRef = useRef<SignatureCanvas | null>(null);

  const isBusinessOwner = occupation === "business-owner";
  const needsInvoice = wantsInvoice === "yes";
  const isPersonalInvoice = invoiceType === "personal";
  const isCompanyInvoice = invoiceType === "company";

  const totalSteps = 8;

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateBeforeNext = () => {
    if (step === 1 && !course) {
      setMessage("กรุณาเลือกคอร์สที่สั่งซื้อ");
      return false;
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
    setSignatureData("");
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
    setSignatureData(finalSignature);

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
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
    } catch (error: any) {
      setMessage(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">แบบฟอร์มลงทะเบียน</h1>
        <p className="text-gray-600 mb-6">
          หน้า {step} จาก {totalSteps}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div>
              <label className="block mb-3 font-medium">คอร์สที่สั่งซื้อ</label>

              <div className="space-y-3">
                <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="course"
                    value="คอร์ส Quick Content"
                    checked={course === "คอร์ส Quick Content"}
                    onChange={(e) => setCourse(e.target.value)}
                    className="mt-1"
                  />
                  <span>คอร์ส Quick Content</span>
                </label>

                <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="course"
                    value="คอร์ส 9+1 ขายดีจัดเต็ม!"
                    checked={course === "คอร์ส 9+1 ขายดีจัดเต็ม!"}
                    onChange={(e) => setCourse(e.target.value)}
                    className="mt-1"
                  />
                  <span>คอร์ส 9+1 ขายดีจัดเต็ม!</span>
                </label>

                <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="course"
                    value="Ebook Ai สำหรับเด็ก"
                    checked={course === "Ebook Ai สำหรับเด็ก"}
                    onChange={(e) => setCourse(e.target.value)}
                    className="mt-1"
                  />
                  <span>Ebook Ai สำหรับเด็ก</span>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">ชื่อผู้รับสินค้า</label>
                  <input
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1">นามสกุล</label>
                  <input
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">ชื่อเล่น</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">อีเมล</label>
                <input
                  type="email"
                  inputMode="email"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block mb-1">เบอร์โทร</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="w-full border border-gray-300 rounded-md p-2"
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
                <label className="block mb-3 font-medium">
                  ชำระเงินผ่านช่องทางใด
                </label>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="โอนผ่านบัญชีธนาคาร"
                      checked={paymentMethod === "โอนผ่านบัญชีธนาคาร"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <span>โอนผ่านบัญชีธนาคาร</span>
                  </label>

                  <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ตัดบัตร"
                      checked={paymentMethod === "ตัดบัตร"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <span>ตัดบัตร</span>
                  </label>

                  <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="other"
                      checked={paymentMethod === "other"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="w-full">
                      <div>อื่น ๆ โปรดระบุ</div>
                      {paymentMethod === "other" && (
                        <input
                          className="w-full border border-gray-300 rounded-md p-2 mt-2"
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
                <label className="block mb-3 font-medium">อาชีพ</label>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="occupation"
                      value="business-owner"
                      checked={occupation === "business-owner"}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="mt-1"
                    />
                    <span>เจ้าของกิจการ / พ่อค้าแม่ค้าออนไลน์</span>
                  </label>

                  <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                    <input
                      type="radio"
                      name="occupation"
                      value="other"
                      checked={occupation === "other"}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="mt-1"
                    />
                    <div className="w-full">
                      <div>อื่น ๆ โปรดระบุ</div>
                      {occupation === "other" && (
                        <input
                          className="w-full border border-gray-300 rounded-md p-2 mt-2"
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
            <div>
              <label className="block mb-1 font-medium">
                บรรยายสิ่งที่ธุรกิจคุณทำมา 1 - 3 ประโยค
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 min-h-[150px]"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="ตัวอย่าง : ธุรกิจของเราช่วยให้หมอฟันได้ลูกค้าเพิ่มขึ้นผ่านการยิงแอด คิดค่าบริการเดือนละ 60,000 บาท/เดือน"
              />
            </div>
          )}

          {step === 5 && (
            <div>
              <label className="block mb-3 font-medium">
                ต้องการใบกำกับภาษีหรือไม่
              </label>

              <div className="space-y-3">
                <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="wantsInvoice"
                    value="yes"
                    checked={wantsInvoice === "yes"}
                    onChange={(e) => setWantsInvoice(e.target.value)}
                    className="mt-1"
                  />
                  <span>ต้องการ</span>
                </label>

                <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="wantsInvoice"
                    value="no"
                    checked={wantsInvoice === "no"}
                    onChange={(e) => setWantsInvoice(e.target.value)}
                    className="mt-1"
                  />
                  <span>ไม่ต้องการ</span>
                </label>
              </div>
            </div>
          )}

          {step === 6 && needsInvoice && (
            <div>
              <label className="block mb-3 font-medium">
                ออกใบกำกับภาษีในนาม
              </label>

              <div className="space-y-3">
                <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="invoiceType"
                    value="personal"
                    checked={invoiceType === "personal"}
                    onChange={(e) => setInvoiceType(e.target.value)}
                    className="mt-1"
                  />
                  <span>บุคคลธรรมดา</span>
                </label>

                <label className="flex items-start gap-3 border border-gray-300 rounded-md p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="invoiceType"
                    value="company"
                    checked={invoiceType === "company"}
                    onChange={(e) => setInvoiceType(e.target.value)}
                    className="mt-1"
                  />
                  <span>นิติบุคคล</span>
                </label>
              </div>
            </div>
          )}

          {step === 7 && needsInvoice && isPersonalInvoice && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1">ชื่อสำหรับออกใบกำกับภาษี</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={personalTaxName}
                  onChange={(e) => setPersonalTaxName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">เลขประจำตัวผู้เสียภาษี</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={personalTaxId}
                  onChange={(e) => setPersonalTaxId(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">ที่อยู่</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={personalAddress}
                  onChange={(e) => setPersonalAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">
                  อีเมลสำหรับจัดส่งใบกำกับภาษีผ่านระบบ e-Tax
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={personalInvoiceEmail}
                  onChange={(e) => setPersonalInvoiceEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 7 && needsInvoice && isCompanyInvoice && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1">ชื่อบริษัท</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">เลขประจำตัวผู้เสียภาษี</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">ที่อยู่บริษัท</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">
                  อีเมลสำหรับจัดส่งใบกำกับภาษีผ่านระบบ e-Tax
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={companyInvoiceEmail}
                  onChange={(e) => setCompanyInvoiceEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">
                  ชื่อผู้ติดต่อ สำหรับใบกำกับภาษีและใบหัก ณ ที่จ่าย
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={companyContactName}
                  onChange={(e) => setCompanyContactName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="w-full border border-gray-300 rounded-md p-2"
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
            <div className="space-y-6">
              <div>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <span>ยอมรับเงื่อนไขและข้อตกลงการให้บริการ</span>
                </label>
              </div>

              <div>
                <label className="block mb-2 font-medium">ลายเซ็น</label>

                <div className="border border-gray-300 rounded-md bg-white p-3">
                  <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor="black"
                    canvasProps={{
                      width: 700,
                      height: 220,
                      className: "w-full h-[220px]",
                    }}
                  />
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                ย้อนกลับ
              </button>
            )}

            {step < 8 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                ถัดไป
              </button>
            )}

            {step === 8 && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                {loading ? "กำลังส่ง..." : "ยืนยันข้อมูล"}
              </button>
            )}
          </div>

          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </main>
  );
}