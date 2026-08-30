import { Typography } from "@mui/material";
import { ResendContainer } from "./ResendOtpTimer.styles";
import { TypographyCenter } from "@/styled/CustomTypography";
import { ResendOtpTimerProps } from "./ResendOtpTimer.types";
import useResendOtpTimer from "./ResendOtpTimer.hooks";

export default function ResendOtpTimer(props: ResendOtpTimerProps) {
  const { containerRef, secondsLeft, showResend, handleResend } =
    useResendOtpTimer(props);

  return (
    <ResendContainer ref={containerRef}>
      {!showResend && (
        <TypographyCenter variant="body2">
          Tidak menerima OTP?{" "}
          <Typography component="span" sx={{ fontSize: "14px" }}>
            Kirim ulang dalam {secondsLeft} detik
          </Typography>
        </TypographyCenter>
      )}

      {showResend && (
        <TypographyCenter
          variant="body2"
          sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
          onClick={handleResend}
        >
          Resend OTP
        </TypographyCenter>
      )}
    </ResendContainer>
  );
}
