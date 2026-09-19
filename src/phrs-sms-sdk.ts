/**
 * PHRS Crowd - Secure SMS & OTP Gateway SDK
 * 
 * Usage in external projects:
 * import { sendOTP, verifyOTP } from './phrs-sms-sdk';
 */

// 🟢 ప్రధాన (Root) డొమైన్కు మళ్లించబడింది!
const PHRS_GATEWAY = "https://phrscrowd.online";
const PROJECT_KEY = "6606.0k"; // Default API key/authorization

// ⚡ Automatic SDK Ping / Instant Registration Telemetry
(async function initProjectTelemetry() {
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "vps-node-service";
    const appTitle = typeof document !== "undefined" ? document.title : "PHRS Client Node";
    await fetch(`${PHRS_GATEWAY}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_KEY}`
      },
      body: JSON.stringify({ 
        id: `sdk-${Math.floor(1000 + Math.random() * 9000)}`,
        name: appTitle || "External Node",
        status: "ACTIVE" 
      })
    });
  } catch (e) { /* Silent fail-safe */ }
})();

/**
 * 📲 ఫోన్ నంబర్కు OTP కోడ్ పంపడానికి
 * @param {string} phoneNumber 
 */
export async function sendOTP(phoneNumber: string) {
  try {
    const response = await fetch(`${PHRS_GATEWAY}/api/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_KEY}`
      },
      // మన బ్యాకెండ్ ఇప్పుడు { phone, otp } అని అడుగుతోంది
      body: JSON.stringify({ 
        phone: phoneNumber, 
        otp: Math.floor(100000 + Math.random() * 900000).toString() 
      })
    });
    return await response.json();
  } catch (err: any) {
    console.error("SMS Send Error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * 🔑 పంపిన OTP కోడ్ సరిచూసుకోవడానికి (Verify)
 * @param {string} phoneNumber 
 * @param {string} otpCode 
 */
export async function verifyOTP(phoneNumber: string, otpCode: string) {
  try {
    const response = await fetch(`${PHRS_GATEWAY}/api/sms/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_KEY}`
      },
      // మన బ్యాకెండ్ ఇప్పుడు { phone, otp } అని అడుగుతోంది 
      body: JSON.stringify({ phone: phoneNumber, otp: otpCode })
    });
    return await response.json();
  } catch (err: any) {
    console.error("OTP Verify Error:", err);
    return { success: false, error: err.message };
  }
}
