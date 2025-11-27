"use client";
import { Refresh, Save, Upload } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { Tooltip, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

type MapControlsProps = {
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  isLoading: boolean;
  isSaving: boolean;
  hasFields: boolean;
};

export default function MapControls({
  onReset,
  onSave,
  onLoad,
  isLoading,
  isSaving,
  hasFields,
}: MapControlsProps) {
  const t = useTranslations();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex md:flex-row justify-between items-center gap-4">
      <Tooltip
        title={t("fields.reset")}
        disableHoverListener={isMobile}
        disableTouchListener={true}
      >
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-400 text-white font-semibold px-2 rounded-md transition-colors disabled:opacity-50 w-full shadow-soft hover:shadow-medium h-10"
          disabled={isLoading || isSaving || !hasFields}
        >
          <Refresh className="flex-shrink-0" fontSize="small" />
          <span className="md:hidden text-sm">{t("fields.reset")}</span>
        </button>
      </Tooltip>

      <Tooltip
        title={isSaving ? t("common.creating") : t("fields.save")}
        disableHoverListener={isMobile}
        disableTouchListener={true}
      >
        <button
          onClick={onSave}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold px-2 rounded-md transition-colors disabled:opacity-50 w-full shadow-soft hover:shadow-medium h-10"
          disabled={isLoading || isSaving || !hasFields}
        >
          {isSaving ? (
            <>
              <CircularProgress className="flex-shrink-0" size={20} />
              <span className="md:hidden text-sm">{t("common.creating")}</span>
            </>
          ) : (
            <>
              <Save className="flex-shrink-0" fontSize="small" />
              <span className="md:hidden text-sm">{t("fields.save")}</span>
            </>
          )}
        </button>
      </Tooltip>

      <Tooltip
        title={isLoading ? t("common.loading") : t("fields.loadFields")}
        disableHoverListener={isMobile}
        disableTouchListener={true}
      >
        <button
          onClick={onLoad}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 text-white font-semibold px-2 rounded-md transition-colors disabled:opacity-50 w-full shadow-soft hover:shadow-medium h-10"
          disabled={isLoading || isSaving}
        >
          {isLoading ? (
            <>
              <CircularProgress className="flex-shrink-0" size={20} />
              <span className="md:hidden text-sm">{t("common.loading")}</span>
            </>
          ) : (
            <>
              <Upload className="flex-shrink-0" fontSize="small" />
              <span className="md:hidden text-sm">{t("fields.load")}</span>
            </>
          )}
        </button>
      </Tooltip>
    </div>
  );
}
