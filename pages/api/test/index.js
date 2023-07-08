import { createNewData } from "@/services/serviceOperations";

const handler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw "Hatalı istek yöntemi";
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw "E-posta veya şifre eksik";
    }

    const user = await createNewData("user", { email, password });

    if (user.error || !user) {
      throw "Kullanıcı oluşturulurken bir hata oluştu";
    }

    console.log("Veri iletildi");
    return res.status(200).json({ status: "success", user, message: "Veri iletildi!" });

  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};

export default handler;
