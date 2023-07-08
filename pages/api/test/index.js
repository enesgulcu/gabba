import { createNewData } from "@/services/serviceOperations";
import cors from 'cors';

const handler = async (req, res) => {
  await cors()(req, res);
  try {
    if (req.method !== "POST") {
      throw new Error("hata 1");
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("hata 2");
    }

    const user = await createNewData("user", { email: email, password: password });
    user && console.log("veri iletildi");
    if (user.error || !user) {
      throw new Error(user);
    }
    return res.status(200).json({status: "success",USER: user , message: "Şifre başarıyla değiştirildi!"});

  } catch (error) {
    return res.status(500).json({status: "error", error: error.message});
  }
};

export default handler;
