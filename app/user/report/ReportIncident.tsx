"use client";

import { useState } from "react";
import { db } from "@/firebase/config";
import { push, ref } from "firebase/database";

type GPS = {
  lat: number | null;
  lon: number | null;
};

type Severity = "critique" | "urgent" | "modere" | "observation";

export default function ReportIncident() {
  // ... tout ton code du formulaire ...
}
