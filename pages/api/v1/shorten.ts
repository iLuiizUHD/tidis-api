import { Collections } from "@lib/firebase";
import express from "express";
import expressRateLimit from "express-rate-limit";
import expressSlowDown from "express-slow-down";
import helmet from "helmet";
import * as yup from "yup";
import fireadmin from "../../../lib/firebase/admin";
import { formatSlug, generateSlug } from "../../../lib/utils/slug";

const app = express();

// Express middlewares
app.use(helmet());
app.use(
  expressSlowDown({
    windowMs: 50 * 1000,
    delayAfter: 5,
    delayMs: 750,
  })
);
app.use(
  expressRateLimit({
    windowMs: 50 * 1000,
    max: 5,
  })
);
app.disable("x-powered-by");

// Types
type Shortener = {
  url: string;
  slug?: string;
  creator?: string;
};

const ShortenerSchema = yup.object().shape({
  url: yup.string().trim().url().required(),
  slug: yup.string().trim(),
  creator: yup.string().trim(),
});

app.post("/v1/shorten", async (req, res) => {
  try {
    const body: Shortener = req.body;

    // Validate the received data
    const valid: Shortener = await ShortenerSchema.validate(body);

    // Generate the slug or slugify what came in
    const slug = formatSlug(valid.slug) || generateSlug();

    // Find if the slug already exists
    const snap = await fireadmin
      .firestore()
      .collection(Collections.SLUGS)
      .where("slug", "==", slug)
      .get();

    if (!snap.empty) {
      res.status(403).json({ error: "Slug is already in use! Try again!" });
      return false;
    }

    await fireadmin
      .firestore()
      .collection(Collections.SLUGS)
      .add({
        slug,
        url: valid.url,
        creator: valid.creator || "",
        hits: 0,
      });

    res.status(201).json({
      url: valid.url,
      slug,
    });

    //
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default (req, res) => app(req, res);
