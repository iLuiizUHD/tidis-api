import { Collections } from "@lib/firebase";
import fireadmin from "@lib/firebase/admin";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).end();
    return false;
  }

  const { alias } = req.query;

  const result = await fireadmin
    .firestore()
    .collection(Collections.SLUGS)
    .where("slug", "==", alias)
    .get();

  if (result.empty) {
    res.status(404).json({ message: "URL not found!" });
    return false;
  }

  const resultData = result.docs[0];

  fireadmin
    .firestore()
    .collection(Collections.SLUGS)
    .doc(resultData.id)
    .update({
      hits: resultData.data().hits + 1,
    });

  res.redirect(302, resultData.data().url).end();
  return true;
};
