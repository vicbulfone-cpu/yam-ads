"use client";

import { REG_CARD, REG_CATEGORIES } from "@/content/registration-questionnaire";
import BizMatchCard from "./BizMatchCard";
import { REG_CATEGORY_ICONS } from "./BizIcons";
import { OPEN_REG_QUESTIONNAIRE } from "@/lib/questionnaire-events";

/** Registration match box (/ad-4): the business box (home page box style, select all that apply) with the registration wording and rows. */
export default function RegistrationMatchCard() {
  return <BizMatchCard words={REG_CARD} categories={REG_CATEGORIES} icons={REG_CATEGORY_ICONS} openEvent={OPEN_REG_QUESTIONNAIRE} className="rz-card sz-card bz-card-wide" />;
}
