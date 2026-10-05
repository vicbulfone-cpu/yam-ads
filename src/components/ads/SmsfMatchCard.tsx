"use client";

import { SMSF_CARD, SMSF_CATEGORIES } from "@/content/smsf-questionnaire";
import BizMatchCard from "./BizMatchCard";
import { SMSF_CATEGORY_ICONS } from "./BizIcons";
import { OPEN_SMSF_QUESTIONNAIRE } from "@/lib/questionnaire-events";

/** SMSF match box (/ad-3): the business box (home page box style, select all that apply) with the SMSF wording and rows. */
export default function SmsfMatchCard() {
  return <BizMatchCard words={SMSF_CARD} categories={SMSF_CATEGORIES} icons={SMSF_CATEGORY_ICONS} openEvent={OPEN_SMSF_QUESTIONNAIRE} className="sz-card" />;
}
