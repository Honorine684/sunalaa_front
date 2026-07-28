export function getTransactionLabel(source, description, t) {
  const handle = description?.match(/@(\S+)/)?.[1];

  switch (source) {
    case "daily_collect":  return t("daily_collect");
    case "streak":         return t("streak");
    case "welcome_bonus":  return t("welcome_bonus");
    case "profile_bonus":  return t("profile_bonus");
    case "referralBonus":  return t("referral_bonus");
    case "mission":        return t("mission");
    case "transfer_out":   return t("transfer_out", { handle: handle ? `@${handle}` : "—" });
    case "transfer_in":    return t("transfer_in",  { handle: handle ? `@${handle}` : "—" });
    default:               return description || source || "Transaction";
  }
}
