"use client";
import Link from "next/link";
import { t } from "./lenguageSwitch";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-muted/30 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="font-semibold">{t("contact")}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t("address")}</p>
              <p>{t("city")}</p>
              <p>{t("phone")}</p>
              <p>{t("email")}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">{t("hours")}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t("mondayFriday")}</p>
              <p>{t("saturday")}</p>
              <p>{t("sunday")}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">{t("quickLinks")}</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link
                href="/appointment-check"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("checkAppointment")}
              </Link>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("staffLogin")}
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">{t("legal")}</h3>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <p>{t("privacyPolicy")}</p>
              <p>{t("termsOfService")}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
