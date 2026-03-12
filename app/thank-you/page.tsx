export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ nickname?: string }>;
}) {
  const params = await searchParams;
  const nickname = params.nickname || "คนเก่ง";

  return (
    <main className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-2xl w-full text-center border border-gray-300 rounded-2xl p-10 bg-white">
        <h1 className="text-3xl font-bold mb-6">ขอแสดงความยินดีด้วยค่า 🎉</h1>

        <p className="text-xl mb-4">
          คุณ <span className="font-semibold">{nickname}</span> ที่ได้ลงทุนในตัวเอง 😊
        </p>

        <p className="text-gray-700">
          สามารถแคปหน้าจอนี้ส่งกลับมาให้แอดมินได้เลยค่ะ
        </p>
      </div>
    </main>
  );
}