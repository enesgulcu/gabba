import { createNewData } from "@/services/serviceOperations";

const handler = async (req, res) => {
  if (req.method === "POST") {
  
    const { email, password } = req.body;

    if (email && password) {
      
      const user = await createNewData("user", { email: email, password: password });
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(400).json({ message: "Kullanıcı oluşturulamadı!" });
      } 
    } else{
      return res.status(400).json({ message: "Eksik bilgi!" });
    }
  } else {
    return res.status(400).json({ message: "Yanlış istek!" });
  }

};

export default handler;
