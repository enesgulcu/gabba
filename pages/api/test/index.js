import { createNewData } from "@/services/serviceOperations";

const handler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new Error("hata 1");
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("hata 2");
    }

    const user = await createNewData("user", { email: email, password: password });
    console.log(user);
    if (user.error || !user) {
      throw new Error(user);
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
